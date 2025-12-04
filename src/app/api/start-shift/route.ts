import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { randomBytes } from 'crypto'
import {
  findStaffByCode,
  hasActiveShift,
  createShift
} from '@/lib/shifts'

export async function POST(request: NextRequest) {
  try {
    const { code } = await request.json()

    if (!code) {
      return NextResponse.json(
        { ok: false, error: 'Missing code' },
        { status: 400 }
      )
    }

    // Tìm staff theo code
    const staff = await findStaffByCode(code)
    if (!staff) {
      return NextResponse.json(
        { ok: false, error: 'Staff not found' },
        { status: 404 }
      )
    }

    // Check staff có ca đang mở không
    const hasActive = await hasActiveShift(staff.id)
    if (hasActive) {
      return NextResponse.json(
        { ok: false, error: 'Bạn đang có ca chưa kết thúc' },
        { status: 400 }
      )
    }

    // Tạo sessionToken random
    const sessionToken = randomBytes(32).toString('hex')

    // Insert shift (không cần branch nữa)
    const shift = await createShift(staff.id, sessionToken)

    // Set cookie
    const response = NextResponse.json({
      ok: true,
      shift,
      staff
    })

    response.cookies.set('shift_token', sessionToken, {
      httpOnly: true,
      maxAge: 8 * 60 * 60, // 8 giờ
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      path: '/'
    })

    return response
  } catch (error) {
    console.error('Error in start-shift:', error)
    return NextResponse.json(
      { ok: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}

