import { NextResponse } from 'next/server';
import twilio from 'twilio';

const VoiceResponse = twilio.twiml.VoiceResponse;

export async function POST() {
  const twiml = new VoiceResponse();
  
  twiml.say('Hello! This is a call from your Zenware AI application.');
  
  return new NextResponse(twiml.toString(), {
    headers: {
      'Content-Type': 'text/xml',
    },
  });
}