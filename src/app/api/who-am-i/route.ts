import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { findActiveShiftByToken } from '@/lib/shifts'

// Tối ưu: Không cache API này vì cần data real-time
export const dynamic = 'force-dynamic'
export const revalidate = 0

export async function GET() {
  try {
    const cookieStore = cookies()
    const shiftToken = cookieStore.get('shift_token')?.value

    if (!shiftToken) {
      return NextResponse.json(
        {
          ok: false,
          reason: 'NO_TOKEN'
        },
        { status: 401 }
      )
    }

    // Tìm shift đang mở theo session_token
    const result = await findActiveShiftByToken(shiftToken)

    if (!result) {
      return NextResponse.json(
        {
          ok: false,
          reason: 'NO_ACTIVE_SHIFT'
        },
        { status: 404 }
      )
    }

    return NextResponse.json({
      ok: true,
      shift: result.shift,
      staff: result.staff
    }, {
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate',
      }
    })
  } catch (error) {
    console.error('Error in who-am-i:', error)
    return NextResponse.json(
      { ok: false, reason: 'SERVER_ERROR' },
      { status: 500 }
    )
  }
}

