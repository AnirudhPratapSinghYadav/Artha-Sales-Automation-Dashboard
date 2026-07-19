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
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'text/plain',
      'text/markdown'
    ];

    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json({ success: false, error: 'Validation Error: Invalid file type. Only PDF, DOCX, TXT, and Markdown are allowed.' }, { status: 400 });
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
    // Ensure category is URL-friendly (e.g. "Case Study" -> "case-study")
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

    // Clean base name for storage (e.g. "Bank Mandiri" -> "bank_mandiri")
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

    // 8. Insert into Database
    const { data: dbData, error: dbError } = await supabase
      .from('knowledge_documents')
      .insert({
        title: originalName,
        file_name: originalName,
        storage_path: storagePath,
        bucket_name: bucketName,
        mime_type: file.type,
        file_size: file.size,
        category: rawCategory,
        status: 'uploaded',
        uploaded_at: new Date().toISOString()
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

    // 9. Fire-and-forget Webhook
    const webhookUrl = process.env.N8N_WEBHOOK_URL || process.env.NEXT_PUBLIC_N8N_WEBHOOK_UPLOAD_KB;
    if (webhookUrl) {
      fetch(webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          documentId: documentId,
          bucket: bucketName,
          storagePath: storagePath,
          mimeType: file.type,
          fileName: originalName
        })
      }).catch(err => {
        // We catch and log, but do not fail the request
        console.error('Failed to trigger webhook asynchronously:', err);
      });
    }

    // 10. Return strictly required success format
    return NextResponse.json({
      success: true,
      documentId: documentId,
      storagePath: storagePath,
      status: 'uploaded'
    });

  } catch (error) {
    console.error('API KB Upload error:', error);
    return NextResponse.json({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Internal Server Error' 
    }, { status: 500 });
  }
}
