import { useState, useEffect } from 'react';
import { ordersAPI } from '../../api/orders';
import useWebSocket from '../../hooks/useWebSocket';
import toast from 'react-hot-toast';
import { formatCurrency, formatDate, ORDER_STATUS, STATUS_FLOW } from '../../utils/constants';
import { RefreshCw, Eye } from 'lucide-react';

const ManageOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [filterStatus, setFilterStatus] = useState('');

  // Real-time WebSocket updates
  useWebSocket('/orders/', (data) => {
    if (data.type === 'order_status_update') {
      setOrders((prev) => prev.map((o) => (o.id === data.data.id ? data.data : o)));
      if (selectedOrder?.id === data.data.id) {
        setSelectedOrder(data.data);
      }
    }
  });

  useEffect(() => {
    fetchOrders();
  }, [filterStatus]);

  const fetchOrders = async () => {
    try {
      const params = filterStatus ? { status: filterStatus } : {};
      const response = await ordersAPI.getOrders();
      let data = response.data.results || response.data;
      if (filterStatus) {
        data = data.filter((o) => o.status === filterStatus);
      }
      setOrders(data);
    } catch (error) {
      toast.error('Failed to fetch orders');
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (orderId, newStatus) => {
    try {
      const response = await ordersAPI.updateOrderStatus(orderId, { status: newStatus });
      toast.success(`Order #${orderId} status updated to ${newStatus}`);
      fetchOrders();
    } catch (error) {
      toast.error(error.response?.data?.status?.[0] || 'Failed to update status');
    }
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Manage Orders</h1>
        <button onClick={fetchOrders} className="btn-outline flex items-center gap-2 text-sm">
          <RefreshCw size={16} />
          Refresh
        </button>
      </div>

      {/* Status Filter */}
      <div className="flex gap-2 overflow-x-auto pb-4 mb-6 scrollbar-hide">
        <button onClick={() => setFilterStatus('')} className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${!filterStatus ? 'bg-primary-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}>
          All
        </button>
        {STATUS_FLOW.map((status) => {
          const info = ORDER_STATUS[status];
          return (
            <button key={status} onClick={() => setFilterStatus(status)} className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${filterStatus === status ? 'bg-primary-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}>
              {info?.label || status}
            </button>
          );
        })}
        <button onClick={() => setFilterStatus('cancelled')} className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${filterStatus === 'cancelled' ? 'bg-red-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}>
          Cancelled
        </button>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Order ID</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Customer</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Items</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Amount</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Status</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Date</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => {
                const statusInfo = ORDER_STATUS[order.status] || {};
                const nextStatuses = {
                  pending: 'confirmed',
                  confirmed: 'preparing',
                  preparing: 'ready',
                  ready: 'out_for_delivery',
                  out_for_delivery: 'delivered',
                };

                return (
                  <tr key={order.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4 font-medium text-gray-900">#{order.id}</td>
                    <td className="py-3 px-4 text-gray-600">{order.user_email || order.user}</td>
                    <td className="py-3 px-4 text-gray-600">{order.items?.length || 0} items</td>
                    <td className="py-3 px-4 font-medium text-gray-900">{formatCurrency(order.total_amount)}</td>
                    <td className="py-3 px-4">
                      <span className={`badge ${statusInfo.color}`}>{statusInfo.label || order.status}</span>
                    </td>
                    <td className="py-3 px-4 text-gray-500 text-sm">{formatDate(order.created_at)}</td>
                    <td className="py-3 px-4">
                      <div className="flex gap-2">
                        {nextStatuses[order.status] && (
                          <button
                            onClick={() => updateStatus(order.id, nextStatuses[order.status])}
                            className="text-xs bg-green-100 text-green-700 hover:bg-green-200 px-3 py-1 rounded-full font-medium transition-colors"
                          >
                            → {ORDER_STATUS[nextStatuses[order.status]]?.label}
                          </button>
                        )}
                        {order.status === 'pending' && (
                          <button
                            onClick={() => updateStatus(order.id, 'cancelled')}
                            className="text-xs bg-red-100 text-red-700 hover:bg-red-200 px-3 py-1 rounded-full font-medium transition-colors"
                          >
                            Cancel
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ManageOrders;
