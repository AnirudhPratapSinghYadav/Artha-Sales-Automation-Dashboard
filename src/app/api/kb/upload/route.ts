import { NextRequest, NextResponse } from 'next/server';
import { verifyUser, hasPermission } from '@/lib/api-auth';
import { createClient } from '@supabase/supabase-js';

export async function POST(req: NextRequest) {
  try {
    // 1. Authenticate user using the existing API auth
    const user = await verifyUser(req);
    if (!user) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    // 2. Authorize user
    const isAuthorized = 
      hasPermission(user, 'knowledge_base', 'upload') || 
      hasPermission(user, 'knowledge_base', 'manage') ||
      user.role === 'admin' || 
      user.role === 'sales_head' || 
      user.role === 'ceo';

    if (!isAuthorized) {
      return NextResponse.json({ success: false, error: 'Forbidden: Insufficient permissions to upload knowledge' }, { status: 403 });
    }

    // 3. Parse FormData
    const formData = await req.formData();
    const file = formData.get('file') as File | null;
    const category = formData.get('category') as string | null;

    if (!file) {
      return NextResponse.json({ success: false, error: 'Bad Request: Missing file' }, { status: 400 });
    }

    // 4. Validate file type and size (Strict constraints)
    const allowedTypes = [
      'application/pdf',
      'text/plain',
    ];

    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json({ success: false, error: 'Validation Error: Invalid file type. Only PDF and TXT are allowed.' }, { status: 400 });
    }

    const maxFileSize = 50 * 1024 * 1024; // 50MB
    if (file.size > maxFileSize) {
      return NextResponse.json({ success: false, error: 'Validation Error: File size exceeds the 50MB limit.' }, { status: 400 });
    }

    // 5. Setup authenticated Supabase Client
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
    const authHeader = req.headers.get('Authorization') || '';
    
    const supabase = createClient(supabaseUrl, supabaseAnonKey, {
      global: {
        headers: {
          Authorization: authHeader,
        },
      },
    });

    // 6. Generate Unique Storage Path
    const rawCategory = category || 'general';
    let formattedCategory = rawCategory.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
    if (!formattedCategory) formattedCategory = 'general';

    const originalName = file.name;
    const lastDotIndex = originalName.lastIndexOf('.');
    let baseName = originalName;
    let ext = '';
    
    if (lastDotIndex !== -1) {
      baseName = originalName.substring(0, lastDotIndex);
      ext = originalName.substring(lastDotIndex);
    }

    const cleanBaseName = baseName.toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_+|_+$/g, '');
    const timestamp = Date.now();
    const storagePath = `${formattedCategory}/${cleanBaseName}_${timestamp}${ext}`;
    const bucketName = 'knowledge-base';

    // 7. Upload to Supabase Storage
    const { error: uploadError } = await supabase.storage
      .from(bucketName)
      .upload(storagePath, file, {
        upsert: false,
        contentType: file.type,
      });

    if (uploadError) {
      console.error('Storage upload error:', uploadError);
      return NextResponse.json({ success: false, error: 'Failed to upload document to storage' }, { status: 500 });
    }

    // 8. Generate a signed URL for the uploaded file (1 hour expiry)
    const { data: signedUrlData, error: signedUrlError } = await supabase.storage
      .from(bucketName)
      .createSignedUrl(storagePath, 3600);
      
    if (signedUrlError || !signedUrlData?.signedUrl) {
      console.error('Signed URL generation error:', signedUrlError);
      return NextResponse.json({ success: false, error: 'Failed to generate signed URL for document' }, { status: 500 });
    }
    const signedUrl = signedUrlData.signedUrl;

    // 9. Insert into Database using the NEW schema
    // id, file_name, category, status, error_message, processed_at, created_at
    const { data: dbData, error: dbError } = await supabase
      .from('knowledge_documents')
      .insert({
        file_name: originalName,
        category: rawCategory,
        status: 'pending'
      })
      .select('id')
      .single();

    if (dbError) {
      console.error('Database insert error:', dbError);
      // Rollback: Delete the orphaned file from storage
      await supabase.storage.from(bucketName).remove([storagePath]);
      return NextResponse.json({ success: false, error: 'Failed to save document metadata' }, { status: 500 });
    }

    const documentId = dbData.id;

    // 10. Synchronously POST to the n8n webhook
    const webhookUrl = process.env.N8N_WEBHOOK_URL || process.env.NEXT_PUBLIC_N8N_WEBHOOK_UPLOAD_KB;
    if (!webhookUrl) {
      return NextResponse.json({ success: false, error: 'Webhook URL is not configured.' }, { status: 500 });
    }

    try {
      const n8nResponse = await fetch(webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          documentId: documentId,
          bucket: bucketName,
          storagePath: storagePath,
          mimeType: file.type,
          fileName: originalName,
          category: rawCategory,
          signedUrl: signedUrl
        })
      });

      if (!n8nResponse.ok) {
        throw new Error(`Webhook responded with status ${n8nResponse.status}`);
      }

      // 11. Read Webhook Response exactly and return to client
      const webhookData = await n8nResponse.json();
      
      if (webhookData.success) {
        return NextResponse.json({
          success: true,
          message: webhookData.message || 'Processing complete.'
        });
      } else {
        return NextResponse.json({
          success: false,
          error: webhookData.error || webhookData.message || 'Processing failed at webhook.'
        }, { status: 400 });
      }

    } catch (err) {
      console.error('Webhook synchronous fetch failed:', err);
      // We mark as failed in DB
      await supabase.from('knowledge_documents')
        .update({ status: 'failed', error_message: err instanceof Error ? err.message : 'Webhook error' })
        .eq('id', documentId);
        
      return NextResponse.json({ 
        success: false, 
        error: `Processing error: ${err instanceof Error ? err.message : 'Unknown webhook error'}` 
      }, { status: 500 });
    }

  } catch (error) {
    console.error('API KB Upload error:', error);
    return NextResponse.json({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Internal Server Error' 
    }, { status: 500 });
  }
}
