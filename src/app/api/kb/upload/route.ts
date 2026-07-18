import { NextRequest, NextResponse } from 'next/server';
import { verifyUser, hasPermission } from '@/lib/api-auth';

export async function POST(req: NextRequest) {
  try {
    // 1. Authenticate user
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

    if (!file || !category) {
      return NextResponse.json({ success: false, error: 'Bad Request: Missing file or category' }, { status: 400 });
    }

    // 4. Validate file type and size
    const allowedTypes = [
      'application/pdf',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'text/plain'
    ];
    const isAllowedType = allowedTypes.includes(file.type) || 
      file.name.endsWith('.pdf') || 
      file.name.endsWith('.docx') || 
      file.name.endsWith('.txt');

    if (!isAllowedType) {
      return NextResponse.json({ success: false, error: 'Validation Error: Invalid file type. Only PDF, DOCX, and TXT are allowed.' }, { status: 400 });
    }

    const maxFileSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxFileSize) {
      return NextResponse.json({ success: false, error: 'Validation Error: File size exceeds the 10MB limit.' }, { status: 400 });
    }

    // 5. Proxy to n8n secure webhook
    const n8nUrl = process.env.N8N_WEBHOOK_UPLOAD_KB || 'https://your-n8n-instance/webhook/upload-kb';
    
    // Construct new FormData to forward
    const proxyData = new FormData();
    proxyData.append('file', file);
    proxyData.append('category', category);
    proxyData.append('uploaded_by', user.name);
    proxyData.append('uploaded_by_email', user.email);

    const response = await fetch(n8nUrl, {
      method: 'POST',
      body: proxyData,
    });

    if (!response.ok) {
      throw new Error(`n8n responded with status ${response.status}: ${response.statusText}`);
    }

    return NextResponse.json({ success: true, message: 'Document added to knowledge base successfully' });
  } catch (error) {
    console.error('API KB Upload error:', error);
    return NextResponse.json({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Internal Server Error' 
    }, { status: 500 });
  }
}
