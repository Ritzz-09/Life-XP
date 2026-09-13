import { NextResponse } from 'next/server';
import { sendContactNotification } from '@/lib/otp-manager';

export async function POST(req: Request) {
  try {
    const { name, email, category, subject, message } = await req.json();
    if (!name || !email || !message) {
      return NextResponse.json({ error: 'Please provide your name, email, and message.' }, { status: 400 });
    }
    const sent = await sendContactNotification({
      name,
      email,
      category: category || 'Feedback',
      subject: subject || 'General Feedback',
      message,
    });
    return NextResponse.json({ success: true, sent });
  } catch (err) {
    console.error('Contact API error:', err);
    return NextResponse.json({ error: 'Failed to process message' }, { status: 500 });
  }
}
