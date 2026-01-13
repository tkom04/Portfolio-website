import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';
import { rateLimit, getClientIdentifier } from '@/lib/rateLimit';

const LOG_FILE_PATH = path.join(process.cwd(), 'data', 'lights-log.json');

// Ensure data directory exists
async function ensureDataDirectory() {
  const dataDir = path.join(process.cwd(), 'data');
  try {
    await fs.access(dataDir);
  } catch {
    await fs.mkdir(dataDir, { recursive: true });
  }
}

// POST - Add a new log entry
export async function POST(request: NextRequest) {
  try {
    // Rate limiting: 10 log entries per minute per IP
    const identifier = getClientIdentifier(request);
    const limit = rateLimit(identifier, 10, 60 * 1000); // 10 requests per 60 seconds

    if (!limit.allowed) {
      return NextResponse.json(
        { 
          error: 'Too many requests',
          message: 'Please wait before submitting another log entry',
          resetTime: limit.resetTime,
        },
        { 
          status: 429,
          headers: {
            'X-RateLimit-Limit': '10',
            'X-RateLimit-Remaining': '0',
            'X-RateLimit-Reset': limit.resetTime.toString(),
            'Retry-After': Math.ceil((limit.resetTime - Date.now()) / 1000).toString(),
          },
        }
      );
    }

    const { action, visitor, timestamp } = await request.json();

    if (!action || !visitor || !timestamp) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    await ensureDataDirectory();

    // Read existing logs
    let logs: Array<{ action: string; timestamp: string; visitor: string }> = [];
    try {
      const fileContent = await fs.readFile(LOG_FILE_PATH, 'utf-8');
      logs = JSON.parse(fileContent);
    } catch {
      // File doesn't exist yet, start with empty array
      logs = [];
    }

    // Add new log entry
    logs.unshift({
      action,
      visitor,
      timestamp: new Date(timestamp).toISOString(),
    });

    // Keep only last 1000 entries
    logs = logs.slice(0, 1000);

    // Write back to file
    await fs.writeFile(LOG_FILE_PATH, JSON.stringify(logs, null, 2), 'utf-8');

    return NextResponse.json({
      success: true,
      message: 'Log entry added',
    }, {
      headers: {
        'X-RateLimit-Limit': '10',
        'X-RateLimit-Remaining': limit.remaining.toString(),
        'X-RateLimit-Reset': limit.resetTime.toString(),
      },
    });
  } catch (error) {
    console.error('Error saving log:', error);
    return NextResponse.json(
      { error: 'Failed to save log entry', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

// GET - Retrieve all logs
export async function GET() {
  try {
    await ensureDataDirectory();

    // Read logs from file
    let logs: Array<{ action: string; timestamp: string; visitor: string }> = [];
    try {
      const fileContent = await fs.readFile(LOG_FILE_PATH, 'utf-8');
      logs = JSON.parse(fileContent);
    } catch {
      // File doesn't exist yet, return empty array
      logs = [];
    }

    // Return last 50 entries (most recent first)
    const recentLogs = logs.slice(0, 50).map(log => ({
      ...log,
      timestamp: new Date(log.timestamp),
    }));

    return NextResponse.json({
      success: true,
      logs: recentLogs,
      total: logs.length,
    });
  } catch (error) {
    console.error('Error reading logs:', error);
    return NextResponse.json(
      { error: 'Failed to read logs', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

