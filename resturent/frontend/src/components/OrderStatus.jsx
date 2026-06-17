import { ORDER_STATUS, STATUS_FLOW } from '../utils/constants';
import { Check, Clock } from 'lucide-react';

const OrderStatusTracker = ({ currentStatus }) => {
  const currentIndex = STATUS_FLOW.indexOf(currentStatus);
  const isCancelled = currentStatus === 'cancelled';

  if (isCancelled) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-center">
        <span className="badge bg-red-100 text-red-800 text-base px-4 py-1">
          Order Cancelled
        </span>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="flex items-center justify-between relative">
        {/* Progress line */}
        <div className="absolute top-4 left-0 right-0 h-1 bg-gray-200 z-0">
          <div
            className="h-full bg-green-500 transition-all duration-500"
            style={{ width: `${(currentIndex / (STATUS_FLOW.length - 1)) * 100}%` }}
          />
        </div>

        {/* Status steps */}
        {STATUS_FLOW.map((status, index) => {
          const isCompleted = index <= currentIndex;
          const isCurrent = index === currentIndex;
          const statusInfo = ORDER_STATUS[status];

          return (
            <div key={status} className="relative z-10 flex flex-col items-center">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${
                  isCompleted
                    ? 'bg-green-500 border-green-500 text-white'
                    : 'bg-white border-gray-300 text-gray-400'
                } ${isCurrent ? 'ring-4 ring-green-100 scale-110' : ''}`}
              >
                {isCompleted ? <Check size={14} /> : <Clock size={14} />}
              </div>
              <span className={`text-xs mt-2 font-medium text-center max-w-[80px] ${
                isCompleted ? 'text-green-700' : 'text-gray-400'
              }`}>
                {statusInfo?.label || status}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default OrderStatusTracker;
