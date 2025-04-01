import { NextResponse } from 'next/server';
import twilio from 'twilio';

const client = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

export async function POST(request: Request) {
  try {
    const { newUrl } = await request.json();

    const app = await client.applications(process.env.TWILIO_APP_SID)
      .update({
        voiceUrl: newUrl
      });

    return NextResponse.json({ 
      success: true, 
      message: 'TwiML URL updated successfully',
      newUrl: app.voiceUrl
    });
  } catch (error) {
    console.error('Error updating TwiML URL:', error);
    return NextResponse.json(
      { error: 'Failed to update TwiML URL' },
      { status: 500 }
    );
  }
}