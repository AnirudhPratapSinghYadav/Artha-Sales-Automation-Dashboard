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
      hasPermission(user, 'leads', 'create') || 
      user.role === 'admin' || 
      user.role === 'sales_rep' || 
      user.role === 'sales_head' || 
      user.role === 'ceo';

    if (!isAuthorized) {
      return NextResponse.json({ success: false, error: 'Forbidden: Insufficient permissions to create leads' }, { status: 403 });
    }

    // 3. Parse JSON Body
    const body = await req.json();
    const { firstName, lastName, email, phone, company, title, industry, country, notes } = body;

    // 4. Validate inputs
    if (!firstName || !lastName || !email || !phone) {
      return NextResponse.json({ success: false, error: 'Validation Error: Missing required fields (firstName, lastName, email, phone)' }, { status: 400 });
    }

    // Clean and validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json({ success: false, error: 'Validation Error: Invalid email address format.' }, { status: 400 });
    }

    // Clean and validate phone number (e.g. only numbers, optional + prefix, length between 8-15 digits)
    const cleanPhone = phone.replace(/[^\d+]/g, '');
    if (cleanPhone.length < 8 || cleanPhone.length > 15) {
      return NextResponse.json({ success: false, error: 'Validation Error: Phone number must be between 8 and 15 digits.' }, { status: 400 });
    }

    // 5. Proxy to n8n secure webhook
    const n8nUrl = process.env.N8N_WEBHOOK_NEW_LEAD || 'https://your-n8n-instance/webhook/new-lead';
    
    const response = await fetch(n8nUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        first_name: firstName,
        last_name: lastName,
        email: email.trim().toLowerCase(),
        phone: cleanPhone,
        company: company || '',
        title: title || '',
        industry: industry || '',
        country: country || '',
        notes: notes || '',
        created_by: user.name,
        created_by_email: user.email
      }),
    });

    if (!response.ok) {
      throw new Error(`n8n responded with status ${response.status}: ${response.statusText}`);
    }

    return NextResponse.json({ success: true, message: 'Lead successfully created and queued' });
  } catch (error) {
    console.error('API Lead Create error:', error);
    return NextResponse.json({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Internal Server Error' 
    }, { status: 500 });
  }
}
