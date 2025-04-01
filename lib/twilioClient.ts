import { Device, Call } from '@twilio/voice-sdk';
import { TwilioDevice } from './types';

let twilioDevice: TwilioDevice = {
  device: null,
  isReady: false,
  error: null,
};

export async function initializeTwilioDevice(): Promise<void> {
  try {
    // Get token from backend
    const response = await fetch('/api/twilio/token', {
      method: 'POST',
    });
    const data = await response.json();

    if (!data.token) {
      throw new Error('Failed to get token');
    }

    // Initialize device
    const device = new Device(data.token);
    
    device.on('ready', () => {
      twilioDevice = {
        ...twilioDevice,
        device,
        isReady: true,
        error: null,
      };
    });

    device.on('error', (error) => {
      console.error('Twilio device error:', error);
      twilioDevice = {
        ...twilioDevice,
        error,
      };
    });

  } catch (error) {
    console.error('Error initializing Twilio device:', error);
    twilioDevice = {
      ...twilioDevice,
      error: error instanceof Error ? error : new Error('Unknown error'),
    };
  }
}

export async function makeOutboundCall(phoneNumber: string): Promise<Call | null> {
  try {
    if (!twilioDevice.device || !twilioDevice.isReady) {
      throw new Error('Twilio device not ready');
    }

    const call = await twilioDevice.device.connect({ params: { To: phoneNumber } });
    return call;
  } catch (error) {
    console.error('Error making outbound call:', error);
    return null;
  }
}

export async function sendSMS(to: string, message: string): Promise<boolean> {
  try {
    const response = await fetch('/api/twilio/sms', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ to, message }),
    });

    const data = await response.json();
    return data.success;
  } catch (error) {
    console.error('Error sending SMS:', error);
    return false;
  }
}

export async function makeServerCall(to: string): Promise<boolean> {
  try {
    const response = await fetch('/api/twilio/call', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ to }),
    });

    const data = await response.json();
    return data.success;
  } catch (error) {
    console.error('Error making server call:', error);
    return false;
  }
}

export async function updateTwimlUrl(newUrl: string): Promise<boolean> {
  try {
    const response = await fetch('/api/twilio/update-url', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ newUrl }),
    });

    const data = await response.json();
    return data.success;
  } catch (error) {
    console.error('Error updating TwiML URL:', error);
    return false;
  }
}