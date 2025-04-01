import { NextResponse } from 'next/server';
import twilio from 'twilio';

const client = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

export async function POST(request: Request) {
  try {
    const { to } = await request.json();

    const call = await client.calls.create({
      url: `${process.env.NEXT_PUBLIC_BASE_URL}/api/twilio/twiml`,
      to: to,
      from: process.env.TWILIO_PHONE_NUMBER,
    });

    return NextResponse.json({ success: true, callId: call.sid });
  } catch (error) {
    console.error('Error making call:', error);
    return NextResponse.json(
      { error: 'Failed to initiate call' },
      { status: 500 }
    );
  }
}