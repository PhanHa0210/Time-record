'use client';

interface NotificationModalProps {
  isOpen: boolean;
  duration: number; // phút
  staffName?: string;
  onClose: () => void;
}

export default function NotificationModal({ isOpen, duration, staffName, onClose }: NotificationModalProps) {
  if (!isOpen) return null;

  const hours = Math.floor(duration / 60);
  const minutes = duration % 60;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div className="bg-white rounded-lg shadow-2xl max-w-md w-full p-6">
        <div className="text-center">
          {/* Icon checkmark */}
          <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-4">
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
          </div>

          {/* Title with staff name */}
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            {staffName ? (
              <>
                Chào mừng trở lại, <span className="text-blue-600">{staffName}</span>!
              </>
            ) : (
              'Đã kết thúc ca thành công!'
            )}
          </h2>
          {staffName && (
            <p className="text-gray-600 mb-4">Đã kết thúc ca thành công!</p>
          )}

          {/* Duration */}
          <div className="my-6">
            <p className="text-gray-600 mb-2">Thời gian làm việc:</p>
            <div className="inline-flex items-center justify-center bg-blue-50 rounded-lg px-6 py-4">
              <span className="text-4xl font-bold text-blue-600">
                {hours > 0 && `${hours} giờ `}
                {minutes} phút
              </span>
            </div>
          </div>

          {/* Close button */}
          <button
            onClick={onClose}
            className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-4 rounded-lg transition-colors mt-4"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
}
