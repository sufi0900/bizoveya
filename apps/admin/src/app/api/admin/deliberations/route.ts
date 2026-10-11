import { NextResponse } from 'next/server';
import { adminApi } from '@/features/admin/api';
import { adminSession, safeAdminError } from '@/features/admin/access';
import { readInput } from '@/features/agents/input';
import { meetingConsentInputSchema } from '@/features/meetings/consent-contracts';
import { controlMeetingExecutionConsent, loadMeetingExecutionConsents } from '@/features/meetings/consent-store';
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const GET = () => adminApi(db => loadMeetingExecutionConsents(db));
export async function POST(request: Request) {
  try {
    const { db } = await adminSession(), input = await readInput(request, meetingConsentInputSchema, 2000);
    return NextResponse.json(await controlMeetingExecutionConsent(db, input), { headers: { 'Cache-Control': 'private, no-store' } });
  } catch (cause) {
    const error = safeAdminError(cause);
    return NextResponse.json({ error: error.message, code: error.code }, { status: error.status, headers: { 'Cache-Control': 'private, no-store' } });
  }
}
