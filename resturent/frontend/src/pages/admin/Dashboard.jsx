import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ordersAPI } from '../../api/orders';
import { authAPI } from '../../api/auth';
import { menuAPI } from '../../api/menu';
import { formatCurrency, ORDER_STATUS } from '../../utils/constants';
import { ShoppingCart, Users, BookOpen, DollarSign, TrendingUp, Clock } from 'lucide-react';

const AdminDashboard = () => {
  const [stats, setStats] = useState({ orders: 0, revenue: 0, users: 0, menuItems: 0 });
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [ordersRes, usersRes, menuRes] = await Promise.all([
          ordersAPI.getOrders(),
          authAPI.getUsers(),
          menuAPI.getMenuItems(),
        ]);

        const orders = ordersRes.data.results || ordersRes.data;
        const users = usersRes.data.results || usersRes.data;
        const menuItems = menuRes.data.results || menuRes.data;

        const totalRevenue = orders
          .filter((o) => o.payment_status === 'completed')
          .reduce((sum, o) => sum + parseFloat(o.total_amount), 0);

        setStats({
          orders: orders.length,
          revenue: totalRevenue,
          users: users.length,
          menuItems: menuItems.length,
        });
        setRecentOrders(orders.slice(0, 5));
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Admin Dashboard</h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 font-medium">Total Orders</p>
              <p className="text-3xl font-bold text-gray-900 mt-1">{stats.orders}</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
              <ShoppingCart className="text-blue-600" size={24} />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 font-medium">Revenue</p>
              <p className="text-3xl font-bold text-gray-900 mt-1">{formatCurrency(stats.revenue)}</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
              <DollarSign className="text-green-600" size={24} />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 font-medium">Users</p>
              <p className="text-3xl font-bold text-gray-900 mt-1">{stats.users}</p>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
              <Users className="text-purple-600" size={24} />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 font-medium">Menu Items</p>
              <p className="text-3xl font-bold text-gray-900 mt-1">{stats.menuItems}</p>
            </div>
            <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
              <BookOpen className="text-orange-600" size={24} />
            </div>
          </div>
        </div>
      </div>

      {/* Quick Links */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Link to="/admin/menu" className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow group">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center group-hover:bg-orange-200 transition-colors">
              <BookOpen className="text-orange-600" size={20} />
            </div>
            <div>
              <h3 className="font-bold text-gray-900">Manage Menu</h3>
              <p className="text-sm text-gray-500">Add, edit, remove items</p>
            </div>
          </div>
        </Link>
        <Link to="/admin/orders" className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow group">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center group-hover:bg-blue-200 transition-colors">
              <ShoppingCart className="text-blue-600" size={20} />
            </div>
            <div>
              <h3 className="font-bold text-gray-900">Manage Orders</h3>
              <p className="text-sm text-gray-500">Track and update orders</p>
            </div>
          </div>
        </Link>
        <Link to="/admin/users" className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow group">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center group-hover:bg-purple-200 transition-colors">
              <Users className="text-purple-600" size={20} />
            </div>
            <div>
              <h3 className="font-bold text-gray-900">Manage Users</h3>
              <p className="text-sm text-gray-500">View and manage users</p>
            </div>
          </div>
        </Link>
      </div>

      {/* Recent Orders */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
          <Clock size={20} />
          Recent Orders
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Order ID</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Customer</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Amount</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Status</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Date</th>
              </tr>
            </thead>
            <tbody>
              {recentOrders.map((order) => {
                const statusInfo = ORDER_STATUS[order.status] || {};
                return (
                  <tr key={order.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4 font-medium text-gray-900">#{order.id}</td>
                    <td className="py-3 px-4 text-gray-600">{order.user_email || order.user}</td>
                    <td className="py-3 px-4 font-medium text-gray-900">{formatCurrency(order.total_amount)}</td>
                    <td className="py-3 px-4">
                      <span className={`badge ${statusInfo.color}`}>{statusInfo.label || order.status}</span>
                    </td>
                    <td className="py-3 px-4 text-gray-500 text-sm">{new Date(order.created_at).toLocaleDateString()}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <Link to="/admin/orders" className="text-primary-600 hover:text-primary-700 font-medium text-sm mt-4 inline-block">
          View All Orders →
        </Link>
      </div>
    </div>
  );
};

export default AdminDashboard;
