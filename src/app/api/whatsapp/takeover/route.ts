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
      hasPermission(user, 'whatsapp', 'take_over') || 
      user.role === 'admin' || 
      user.role === 'sales_rep' || 
      user.role === 'sales_head' || 
      user.role === 'ceo';

    if (!isAuthorized) {
      return NextResponse.json({ success: false, error: 'Forbidden: Insufficient permissions to takeover conversation' }, { status: 403 });
    }

    // 3. Parse JSON Body
    const body = await req.json();
    const { lead_id, phone, human_takeover } = body;

    // 4. Validate inputs
    if (!lead_id || !phone || human_takeover === undefined) {
      return NextResponse.json({ success: false, error: 'Bad Request: Missing lead_id, phone, or human_takeover value' }, { status: 400 });
    }

    // 5. Proxy to n8n secure webhook
    const n8nUrl = process.env.N8N_WEBHOOK_TAKEOVER || 'https://your-n8n-instance/webhook/takeover';
    
    const response = await fetch(n8nUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        lead_id,
        phone,
        human_takeover,
        triggered_by: user.name,
        triggered_by_email: user.email
      }),
    });

    if (!response.ok) {
      throw new Error(`n8n responded with status ${response.status}: ${response.statusText}`);
    }

    return NextResponse.json({ 
      success: true, 
      message: human_takeover ? 'You\'ve taken over this conversation' : 'Bot resumed for this conversation' 
    });
  } catch (error) {
    console.error('API Takeover Toggle error:', error);
    return NextResponse.json({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Internal Server Error' 
    }, { status: 500 });
  }
}
