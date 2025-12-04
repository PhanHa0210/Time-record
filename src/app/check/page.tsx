'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';

// Lazy load NotificationModal để giảm initial bundle size
const NotificationModal = dynamic(() => import('@/components/NotificationModal'), {
  ssr: false,
});

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
  const [error, setError] = useState('');
  const [showNotification, setShowNotification] = useState(false);
  const [notificationType, setNotificationType] = useState<'start' | 'end'>('start');
  const [workDuration, setWorkDuration] = useState(0);
  const [staffName, setStaffName] = useState<string>('');
  const [isNotificationLoading, setIsNotificationLoading] = useState(false);
  const [isCheckingShift, setIsCheckingShift] = useState(true);

  // Khi load: check cookie, nếu có thì tự động kết thúc ca (chạy ở background)
  // Tối ưu: Chạy ngay sau khi component mount, không delay
  useEffect(() => {
    let isMounted = true;
    
    const checkAndEndShift = async () => {
      try {
        // Sử dụng AbortController để có thể cancel nếu component unmount
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5000); // Timeout 5s
        
        const res = await fetch('/api/who-am-i', { 
          cache: 'no-store',
          signal: controller.signal,
        });
        
        clearTimeout(timeoutId);
        
        if (!res.ok || !isMounted) return;

        const data = await res.json();
        if (data.ok && data.shift && isMounted) {
          const timeIn = new Date(data.shift.time_in).getTime();
          const duration = Math.max(0, Math.round((Date.now() - timeIn) / 60000));
          
          setWorkDuration(duration);
          setStaffName(data.staff?.name || '');
          setNotificationType('end');
          setShowNotification(true);
          
          // End shift ở background, không chờ response
          fetch('/api/end-shift', { method: 'POST' }).catch(() => {});
        }
      } catch (err) {
        // Ignore errors silently - không ảnh hưởng UX
        if (err instanceof Error && err.name !== 'AbortError') {
          console.error('Error:', err);
        }
      } finally {
        if (isMounted) {
          setIsCheckingShift(false);
        }
      }
    };

    // Chạy ngay lập tức, không delay
    checkAndEndShift();
    
    return () => {
      isMounted = false;
    };
  }, []);

  const handleStartShift = async (e: React.FormEvent) => {
    e.preventDefault();
    const codeValue = code.trim();
    
    if (!codeValue) {
      setError('Vui lòng nhập mã nhân viên');
      return;
    }

    setError('');
    setNotificationType('start');
    setShowNotification(true);
    setIsNotificationLoading(true);
    setCode('');

    try {
      const res = await fetch('/api/start-shift', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: codeValue }),
        cache: 'no-store',
      });

      const data = await res.json();
      if (data.ok) {
        setStaffName(data.staff?.name || '');
        setIsNotificationLoading(false);
      } else {
        setShowNotification(false);
        setError(data.error || 'Có lỗi xảy ra');
        setIsNotificationLoading(false);
      }
    } catch (err) {
      setShowNotification(false);
      setError('Lỗi kết nối, vui lòng thử lại');
      setIsNotificationLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-md mx-auto">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h1 className="text-2xl font-bold mb-6 text-gray-800 text-center">
            Bắt đầu ca làm việc
            {isCheckingShift && (
              <span className="ml-2 inline-block h-4 w-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></span>
            )}
          </h1>

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
                onChange={(e) => {
                  setCode(e.target.value);
                  if (error) setError('');
                }}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="VD: 001"
                required
                disabled={isNotificationLoading}
                autoFocus
              />
            </div>

            <button
              type="submit"
              disabled={isNotificationLoading || !code.trim()}
              className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-4 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isNotificationLoading ? 'Đang xử lý...' : 'Bắt đầu ca'}
            </button>
          </form>
        </div>
      </div>

      {showNotification && (
        <NotificationModal
          isOpen={showNotification}
          type={notificationType}
          duration={workDuration}
          staffName={staffName}
          isLoading={isNotificationLoading}
          onClose={() => {
            setShowNotification(false);
            setIsNotificationLoading(false);
          }}
        />
      )}
    </div>
  );
}
