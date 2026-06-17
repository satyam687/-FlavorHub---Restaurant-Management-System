import { useState, useEffect } from 'react';
import { authAPI } from '../../api/auth';
import toast from 'react-hot-toast';
import { formatDate } from '../../utils/constants';
import { Users, Shield, ShieldOff, Trash2, Mail, User as UserIcon } from 'lucide-react';

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await authAPI.getUsers();
      setUsers(response.data.results || response.data);
    } catch (error) {
      toast.error('Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };

  const toggleAdmin = async (userId, currentAdmin) => {
    try {
      await authAPI.updateUser(userId, { is_admin: !currentAdmin });
      toast.success('User admin status updated');
      fetchUsers();
    } catch (error) {
      toast.error('Failed to update user');
    }
  };

  const deleteUser = async (userId) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;
    try {
      await authAPI.deleteUser(userId);
      toast.success('User deleted');
      fetchUsers();
    } catch (error) {
      toast.error('Failed to delete user');
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
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Manage Users</h1>
        <span className="text-gray-500">{users.length} total users</span>
      </div>

      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">User</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Email</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Phone</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Role</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Joined</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 bg-primary-100 rounded-full flex items-center justify-center">
                        <UserIcon size={16} className="text-primary-600" />
                      </div>
                      <span className="font-medium text-gray-900">{user.username}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-gray-600">{user.email}</td>
                  <td className="py-3 px-4 text-gray-600">{user.phone || '-'}</td>
                  <td className="py-3 px-4">
                    <span className={`badge ${user.is_admin ? 'bg-purple-100 text-purple-800' : 'bg-gray-100 text-gray-800'}`}>
                      {user.is_admin ? 'Admin' : 'Customer'}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-gray-500 text-sm">{formatDate(user.created_at)}</td>
                  <td className="py-3 px-4">
                    <div className="flex gap-2">
                      <button
                        onClick={() => toggleAdmin(user.id, user.is_admin)}
                        title={user.is_admin ? 'Remove admin' : 'Make admin'}
                        className={`p-1.5 rounded-lg transition-colors ${
                          user.is_admin ? 'text-purple-600 hover:bg-purple-100' : 'text-gray-400 hover:bg-gray-100'
                        }`}
                      >
                        {user.is_admin ? <Shield size={16} /> : <ShieldOff size={16} />}
                      </button>
                      <button
                        onClick={() => deleteUser(user.id)}
                        className="text-red-500 hover:bg-red-50 p-1.5 rounded-lg transition-colors"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ManageUsers;
