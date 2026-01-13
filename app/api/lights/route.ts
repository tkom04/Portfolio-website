import { NextRequest, NextResponse } from 'next/server';
import { rateLimit, getClientIdentifier } from '@/lib/rateLimit';

export async function POST(request: NextRequest) {
  try {
    // Rate limiting: 5 requests per minute per IP
    const identifier = getClientIdentifier(request);
    const limit = rateLimit(identifier, 5, 60 * 1000); // 5 requests per 60 seconds

    if (!limit.allowed) {
      return NextResponse.json(
        { 
          error: 'Too many requests',
          message: 'Please wait before toggling lights again',
          resetTime: limit.resetTime,
        },
        { 
          status: 429,
          headers: {
            'X-RateLimit-Limit': '5',
            'X-RateLimit-Remaining': '0',
            'X-RateLimit-Reset': limit.resetTime.toString(),
            'Retry-After': Math.ceil((limit.resetTime - Date.now()) / 1000).toString(),
          },
        }
      );
    }

    const { action } = await request.json();
    const token = process.env.HA_ACCESS_TOKEN;
    const baseUrl = process.env.HA_BASE_URL || 'http://homeassistant.local:8123';

    if (!token) {
      return NextResponse.json(
        { error: 'Home Assistant token not configured' },
        { status: 500 }
      );
    }

    // Target the specific Hue color lamp
    const entityId = 'light.hue_color_lamp_2';

    const service = action === 'turn_on' ? 'turn_on' : 'turn_off';

    const response = await fetch(`${baseUrl}/api/services/light/${service}`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        entity_id: entityId,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Home Assistant API error:', errorText);
      return NextResponse.json(
        { error: 'Failed to control lights', details: errorText },
        { status: response.status }
      );
    }

    const data = await response.json();

    return NextResponse.json({
      success: true,
      action,
      data,
    }, {
      headers: {
        'X-RateLimit-Limit': '5',
        'X-RateLimit-Remaining': limit.remaining.toString(),
        'X-RateLimit-Reset': limit.resetTime.toString(),
      },
    });
  } catch (error) {
    console.error('Error controlling lights:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const token = process.env.HA_ACCESS_TOKEN;
    const baseUrl = process.env.HA_BASE_URL || 'http://homeassistant.local:8123';

    if (!token) {
      return NextResponse.json(
        { error: 'Home Assistant token not configured' },
        { status: 500 }
      );
    }

    // Get the state of the specific Hue color lamp
    const entityId = 'light.hue_color_lamp_2';

    const response = await fetch(`${baseUrl}/api/states/${entityId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: 'Failed to get light state' },
        { status: response.status }
      );
    }

    const data = await response.json();
    const isOn = data.state === 'on';

    return NextResponse.json({
      success: true,
      lightsOn: isOn,
      state: data.state,
    });
  } catch (error) {
    console.error('Error getting light state:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

