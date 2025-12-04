'use client';

import { useState, useEffect } from 'react';
import NotificationModal from '@/components/NotificationModal';

interface Staff {
  id: string;
  name: string;
  code: string;
}

interface Shift {
  time_in: string;
}

export default function CheckPage() {
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [showNotification, setShowNotification] = useState(false);
  const [workDuration, setWorkDuration] = useState(0);
  const [staffName, setStaffName] = useState<string>('');

  // Khi load: check cookie, nếu có thì tự động kết thúc ca (chạy ở background)
  useEffect(() => {
    checkAndEndShift();
  }, []);

  const checkAndEndShift = async () => {
    try {
      const res = await fetch('/api/who-am-i');
      if (!res.ok) {
        return;
      }

      const data = await res.json();
      if (data.ok) {
        const endRes = await fetch('/api/end-shift', { method: 'POST' });
        if (endRes.ok) {
          const endData = await endRes.json();
          if (endData.ok) {
            const duration = Math.round(
              (Date.now() - new Date(data.shift.time_in).getTime()) / 60000
            );
            setWorkDuration(duration);
            setStaffName(data.staff?.name || '');
            setShowNotification(true);
          }
        }
      }
    } catch (err) {
      console.error('Error:', err);
    }
  };

  const handleStartShift = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccessMessage('');

    try {
      const res = await fetch('/api/start-shift', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: code.trim() }),
      });

      const data = await res.json();
      if (data.ok) {
        setSuccessMessage('Bắt đầu ca thành công!');
        setCode('');
      } else {
        setError(data.error || 'Có lỗi xảy ra');
      }
    } catch (err) {
      setError('Lỗi kết nối, vui lòng thử lại');
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-md mx-auto">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h1 className="text-2xl font-bold mb-6 text-gray-800 text-center">Bắt đầu ca làm việc</h1>

          {successMessage && (
            <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded">
              {successMessage}
            </div>
          )}

          {error && (
            <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
              {error}
            </div>
          )}

          <form onSubmit={handleStartShift} className="space-y-4">
            <div>
              <label className="block mb-2 font-semibold text-gray-700">Mã nhân viên</label>
              <input
                type="number"
                inputMode="numeric"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="VD: 001"
                required
                disabled={loading}
                autoFocus
              />
            </div>

            <button
              type="submit"
              disabled={loading || !code.trim()}
              className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Đang xử lý...' : 'Bắt đầu ca'}
            </button>
          </form>
        </div>
      </div>

      {/* Notification Modal */}
      <NotificationModal
        isOpen={showNotification}
        duration={workDuration}
        staffName={staffName}
        onClose={() => setShowNotification(false)}
      />
    </div>
  );
}
