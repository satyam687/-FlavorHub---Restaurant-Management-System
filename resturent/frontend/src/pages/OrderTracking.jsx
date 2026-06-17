import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { ordersAPI } from '../api/orders';
import OrderStatusTracker from '../components/OrderStatus';
import useWebSocket from '../hooks/useWebSocket';
import { formatCurrency, formatDate, ORDER_STATUS } from '../utils/constants';
import { Package, MapPin, Phone, Clock } from 'lucide-react';

const OrderTracking = () => {
  const { orderId } = useParams();
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  // WebSocket for real-time updates
  const { lastMessage } = useWebSocket(
    selectedOrder ? `/orders/${selectedOrder.id}/` : '/orders/',
    (data) => {
      if (data.type === 'order_status_update') {
        const updated = data.data;
        if (selectedOrder && updated.id === selectedOrder.id) {
          setSelectedOrder(updated);
        }
        setOrders((prev) => prev.map((o) => (o.id === updated.id ? updated : o)));
      }
    }
  );

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await ordersAPI.getMyOrders();
        const ordersData = response.data.results || response.data;
        setOrders(ordersData);
        if (orderId) {
          const found = ordersData.find((o) => o.id === parseInt(orderId));
          if (found) setSelectedOrder(found);
        } else if (ordersData.length > 0) {
          setSelectedOrder(ordersData[0]);
        }
      } catch (error) {
        console.error('Failed to fetch orders:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, [orderId]);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center px-4">
        <Package size={64} className="text-gray-300 mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 mb-2">No orders yet</h2>
        <p className="text-gray-500 mb-6">Place your first order from our menu!</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">My Orders</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Order List */}
        <div className="lg:col-span-1 space-y-3">
          {orders.map((order) => {
            const statusInfo = ORDER_STATUS[order.status] || {};
            return (
              <button
                key={order.id}
                onClick={() => setSelectedOrder(order)}
                className={`w-full text-left bg-white rounded-xl shadow-md p-4 transition-all ${
                  selectedOrder?.id === order.id ? 'ring-2 ring-primary-600' : 'hover:shadow-lg'
                }`}
              >
                <div className="flex justify-between items-start mb-2">
                  <span className="font-bold text-gray-900">Order #{order.id}</span>
                  <span className={`badge ${statusInfo.color}`}>{statusInfo.label || order.status}</span>
                </div>
                <p className="text-sm text-gray-500">{formatCurrency(order.total_amount)}</p>
                <p className="text-xs text-gray-400 mt-1">{formatDate(order.created_at)}</p>
              </button>
            );
          })}
        </div>

        {/* Order Detail */}
        {selectedOrder && (
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-md p-6">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Order #{selectedOrder.id}</h2>
                  <p className="text-gray-500 text-sm mt-1">{formatDate(selectedOrder.created_at)}</p>
                </div>
                <span className={`badge text-base px-4 py-1 ${ORDER_STATUS[selectedOrder.status]?.color || 'bg-gray-100 text-gray-800'}`}>
                  {ORDER_STATUS[selectedOrder.status]?.label || selectedOrder.status}
                </span>
              </div>

              {/* Status Tracker */}
              <div className="mb-8 px-4">
                <OrderStatusTracker currentStatus={selectedOrder.status} />
              </div>

              {/* Delivery Info */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                  <MapPin size={18} className="text-primary-600 mt-0.5" />
                  <div>
                    <p className="text-xs text-gray-500">Delivery Address</p>
                    <p className="text-sm text-gray-900">{selectedOrder.delivery_address}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                  <Phone size={18} className="text-primary-600 mt-0.5" />
                  <div>
                    <p className="text-xs text-gray-500">Phone</p>
                    <p className="text-sm text-gray-900">{selectedOrder.phone}</p>
                  </div>
                </div>
              </div>

              {/* Items */}
              <div className="mb-6">
                <h3 className="font-bold text-gray-900 mb-3">Items</h3>
                <div className="space-y-3">
                  {selectedOrder.items?.map((item, index) => (
                    <div key={index} className="flex justify-between items-center py-2 border-b border-gray-100 last:border-0">
                      <div>
                        <span className="font-medium text-gray-900">{item.menu_item_name}</span>
                        <span className="text-gray-500 ml-2">x{item.quantity}</span>
                      </div>
                      <span className="font-semibold text-gray-900">{formatCurrency(item.subtotal)}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Total */}
              <div className="border-t pt-4">
                <div className="flex justify-between font-bold text-lg text-gray-900">
                  <span>Total</span>
                  <span>{formatCurrency(selectedOrder.total_amount)}</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderTracking;
