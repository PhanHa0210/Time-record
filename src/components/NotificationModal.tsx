'use client';

import { useState, useEffect } from 'react';

interface NotificationModalProps {
  isOpen: boolean;
  type: 'start' | 'end';
  duration?: number; // phút (chỉ dùng cho end)
  staffName?: string;
  isLoading?: boolean; // Đang fetch ở background
  onClose: () => void;
}

export default function NotificationModal({ 
  isOpen, 
  type, 
  duration = 0, 
  staffName, 
  isLoading = false,
  onClose 
}: NotificationModalProps) {
  const [currentDateTime, setCurrentDateTime] = useState('');

  // Memoize format datetime để tránh re-compute
  useEffect(() => {
    if (isOpen) {
      // Format ngày giờ VN - tối ưu bằng cách dùng Intl API
      const now = new Date();
      const dateFormatter = new Intl.DateTimeFormat('vi-VN', {
        timeZone: 'Asia/Ho_Chi_Minh',
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
      
      const timeFormatter = new Intl.DateTimeFormat('vi-VN', {
        timeZone: 'Asia/Ho_Chi_Minh',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false
      });
      
      setCurrentDateTime(`${dateFormatter.format(now)}, ${timeFormatter.format(now)}`);
    }
  }, [isOpen]);

  const hours = Math.floor(duration / 60);
  const minutes = duration % 60;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div className="bg-white rounded-lg shadow-2xl max-w-md w-full p-6">
        <div className="text-center">
          {/* Icon checkmark */}
          <div className={`mx-auto flex items-center justify-center h-16 w-16 rounded-full mb-4 ${
            isLoading ? 'bg-blue-100' : 'bg-green-100'
          }`}>
            {isLoading ? (
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500"></div>
            ) : (
              <svg
                className="h-10 w-10 text-green-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            )}
          </div>

          {/* Title with staff name */}
          {type === 'start' ? (
            <>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">
                {isLoading ? (
                  'Đang bắt đầu ca...'
                ) : staffName ? (
                  <>
                    <span className="text-blue-600">{staffName}</span>
                  </>
                ) : (
                  'Bắt đầu ca thành công!'
                )}
              </h2>
              {!isLoading && (
                <p className="text-gray-600 mb-4">
                  {staffName ? 'Đã bắt đầu ca làm việc' : 'Bắt đầu ca thành công!'}
                </p>
              )}
            </>
          ) : (
            <>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">
                {staffName ? (
                  <>
                    <span className="text-blue-600">{staffName}</span>
                  </>
                ) : (
                  'Đã kết thúc ca thành công!'
                )}
              </h2>
              <p className="text-gray-600 mb-4">Đã kết thúc ca thành công!</p>
            </>
          )}

          {/* Duration - chỉ hiển thị khi kết thúc ca */}
          {type === 'end' && (
            <div className="my-6">
              <p className="text-gray-600 mb-2">Thời gian làm việc:</p>
              <div className="inline-flex items-center justify-center bg-blue-50 rounded-lg px-6 py-4">
                <span className="text-4xl font-bold text-blue-600">
                  {hours > 0 && `${hours} giờ `}
                  {minutes} phút
                </span>
              </div>
              <p className="text-gray-500 mt-2 text-sm">
                Tổng: {duration} phút
              </p>
            </div>
          )}

          {/* Hiển thị ngày giờ VN */}
          {currentDateTime && (
            <div className="mt-4 pt-4 border-t border-gray-200">
              <p className="text-sm text-gray-500">
                {currentDateTime}
              </p>
            </div>
          )}

          {/* Close button - chỉ hiển thị khi không loading */}
          {!isLoading && (
            <button
              onClick={onClose}
              className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-4 rounded-lg mt-4"
            >
              Đóng
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
