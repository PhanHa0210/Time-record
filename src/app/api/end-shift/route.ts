import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { endShift } from '@/lib/shifts';

// Tối ưu: Không cache API này
export const dynamic = 'force-dynamic'
export const revalidate = 0

export async function POST() {
  const cookieStore = cookies();
  const shiftToken = cookieStore.get('shift_token')?.value;
  const response = NextResponse.json({ ok: true });

  if (shiftToken) {
    try {
      await endShift(shiftToken);
    } catch (err) {
      console.error('Error ending shift:', err);
    }
    response.cookies.delete('shift_token');
  }

  return response;
}
