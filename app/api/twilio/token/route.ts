import { NextResponse } from 'next/server';
import twilio from 'twilio';

const accessToken = twilio.jwt.AccessToken;
const VoiceGrant = accessToken.VoiceGrant;

export async function POST() {
  try {
    // Create an access token
    const token = new accessToken(
      process.env.TWILIO_ACCOUNT_SID!,
      process.env.TWILIO_API_KEY!,
      process.env.TWILIO_API_SECRET!,
      { identity: 'user' }
    );

    // Create a Voice grant and add it to the token
    const grant = new VoiceGrant({
      outgoingApplicationSid: process.env.TWILIO_APP_SID,
      incomingAllow: true,
    });
    token.addGrant(grant);

    // Generate the token
    return NextResponse.json({ token: token.toJwt() });
  } catch (error) {
    console.error('Error generating token:', error);
    return NextResponse.json(
      { error: 'Failed to generate token' },
      { status: 500 }
    );
  }
}