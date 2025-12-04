import { supabase } from './supabaseClient';

export interface Staff {
  id: string;
  name: string;
  code: string;
}

export interface Shift {
  id: string;
  staff_id: string;
  shift_date: string;
  session_token: string;
  time_in: string;
  time_out: string | null;
  created_at: string;
}

/**
 * Tìm staff theo code
 */
export async function findStaffByCode(code: string): Promise<Staff | null> {
  const { data, error } = await supabase
    .from('staff')
    .select('id, name, code')
    .eq('code', code)
    .single();

  if (error || !data) {
    return null;
  }

  return data;
}

/**
 * Kiểm tra staff có ca đang mở không
 */
export async function hasActiveShift(staffId: string): Promise<boolean> {
  const { data, error } = await supabase
    .from('shift')
    .select('id')
    .eq('staff_id', staffId)
    .is('time_out', null)
    .maybeSingle();

  return !error && data !== null;
}

/**
 * Tạo ca mới
 */
export async function createShift(staffId: string, sessionToken: string): Promise<Shift> {
  const { data, error } = await supabase
    .from('shift')
    .insert({
      staff_id: staffId,
      session_token: sessionToken,
    })
    .select()
    .single();

  if (error || !data) {
    throw new Error('Failed to create shift');
  }

  return data;
}

/**
 * Tìm ca đang mở theo session token
 */
export async function findActiveShiftByToken(
  sessionToken: string
): Promise<{ shift: Shift; staff: Staff } | null> {
  const { data, error } = await supabase
    .from('shift')
    .select(
      `
      *,
      staff:staff_id (
        id,
        name,
        code
      )
    `
    )
    .eq('session_token', sessionToken)
    .is('time_out', null)
    .single();

  if (error || !data) {
    return null;
  }

  return {
    shift: {
      id: data.id,
      staff_id: data.staff_id,
      shift_date: data.shift_date,
      session_token: data.session_token,
      time_in: data.time_in,
      time_out: data.time_out,
      created_at: data.created_at,
    },
    staff: (data as any).staff,
  };
}

/**
 * Kết thúc ca
 */
export async function endShift(sessionToken: string): Promise<Shift> {
  const { data, error } = await supabase
    .from('shift')
    .update({ time_out: new Date().toISOString() })
    .eq('session_token', sessionToken)
    .is('time_out', null)
    .select()
    .single();

  if (error || !data) {
    throw new Error('Failed to end shift');
  }

  return data;
}
