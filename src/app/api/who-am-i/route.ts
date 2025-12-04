import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { findActiveShiftByToken } from '@/lib/shifts'

export async function GET() {
  try {
    const cookieStore = cookies()
    const shiftToken = cookieStore.get('shift_token')?.value

    if (!shiftToken) {
      return NextResponse.json({
        ok: false,
        reason: 'NO_TOKEN'
      })
    }

    // Tìm shift đang mở theo session_token
    const result = await findActiveShiftByToken(shiftToken)

    if (!result) {
      return NextResponse.json({
        ok: false,
        reason: 'NO_ACTIVE_SHIFT'
      })
    }

    return NextResponse.json({
      ok: true,
      shift: result.shift,
      staff: result.staff
    })
  } catch (error) {
    console.error('Error in who-am-i:', error)
    return NextResponse.json(
      { ok: false, reason: 'SERVER_ERROR' },
      { status: 500 }
    )
  }
}

