import { useState, useEffect } from 'react';
import { menuAPI } from '../../api/menu';
import toast from 'react-hot-toast';
import { formatCurrency } from '../../utils/constants';
import { Plus, Edit, Trash2, X, Save, Image } from 'lucide-react';

const ManageMenu = () => {
  const [menuItems, setMenuItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState({
    name: '', description: '', price: '', category: '',
    is_vegetarian: false, is_spicy: false, preparation_time: 15,
    availability: 'available', is_active: true,
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [itemsRes, catRes] = await Promise.all([
        menuAPI.getMenuItems(),
        menuAPI.getCategories(),
      ]);
      setMenuItems(itemsRes.data.results || itemsRes.data);
      setCategories(catRes.data.results || catRes.data);
    } catch (error) {
      toast.error('Failed to fetch menu data');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = { ...formData, price: parseFloat(formData.price) };
      if (editingItem) {
        await menuAPI.updateMenuItem(editingItem.slug, data);
        toast.success('Menu item updated');
      } else {
        await menuAPI.createMenuItem(data);
        toast.success('Menu item created');
      }
      setShowForm(false);
      setEditingItem(null);
      resetForm();
      fetchData();
    } catch (error) {
      toast.error('Failed to save menu item');
    }
  };

  const handleEdit = (item) => {
    setEditingItem(item);
    setFormData({
      name: item.name,
      description: item.description,
      price: item.price,
      category: item.category,
      is_vegetarian: item.is_vegetarian,
      is_spicy: item.is_spicy,
      preparation_time: item.preparation_time,
      availability: item.availability,
      is_active: item.is_active,
    });
    setShowForm(true);
  };

  const handleDelete = async (item) => {
    if (!window.confirm(`Delete "${item.name}"?`)) return;
    try {
      await menuAPI.deleteMenuItem(item.slug);
      toast.success('Menu item deleted');
      fetchData();
    } catch (error) {
      toast.error('Failed to delete menu item');
    }
  };

  const resetForm = () => {
    setFormData({
      name: '', description: '', price: '', category: '',
      is_vegetarian: false, is_spicy: false, preparation_time: 15,
      availability: 'available', is_active: true,
    });
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
        <h1 className="text-3xl font-bold text-gray-900">Manage Menu</h1>
        <button
          onClick={() => { setShowForm(true); setEditingItem(null); resetForm(); }}
          className="btn-primary flex items-center gap-2"
        >
          <Plus size={18} />
          Add Item
        </button>
      </div>

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-900">{editingItem ? 'Edit Item' : 'Add New Item'}</h2>
              <button onClick={() => { setShowForm(false); setEditingItem(null); }} className="text-gray-400 hover:text-gray-600">
                <X size={24} />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
                <input type="text" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="input-field" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} className="input-field" rows={3} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Price *</label>
                  <input type="number" step="0.01" value={formData.price} onChange={(e) => setFormData({ ...formData, price: e.target.value })} className="input-field" required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Category *</label>
                  <select value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })} className="input-field" required>
                    <option value="">Select Category</option>
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Prep Time (min)</label>
                  <input type="number" value={formData.preparation_time} onChange={(e) => setFormData({ ...formData, preparation_time: parseInt(e.target.value) || 15 })} className="input-field" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Availability</label>
                  <select value={formData.availability} onChange={(e) => setFormData({ ...formData, availability: e.target.value })} className="input-field">
                    <option value="available">Available</option>
                    <option value="unavailable">Unavailable</option>
                    <option value="sold_out">Sold Out</option>
                  </select>
                </div>
              </div>
              <div className="flex gap-6">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={formData.is_vegetarian} onChange={(e) => setFormData({ ...formData, is_vegetarian: e.target.checked })} className="w-4 h-4 rounded" />
                  <span className="text-sm text-gray-700">Vegetarian</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={formData.is_spicy} onChange={(e) => setFormData({ ...formData, is_spicy: e.target.checked })} className="w-4 h-4 rounded" />
                  <span className="text-sm text-gray-700">Spicy</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={formData.is_active} onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })} className="w-4 h-4 rounded" />
                  <span className="text-sm text-gray-700">Active</span>
                </label>
              </div>
              <div className="flex gap-3 pt-2">
                <button type="submit" className="btn-primary flex-1 flex items-center justify-center gap-2">
                  <Save size={18} />
                  {editingItem ? 'Update' : 'Create'}
                </button>
                <button type="button" onClick={() => { setShowForm(false); setEditingItem(null); }} className="btn-outline flex-1">
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Items Table */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Item</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Category</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Price</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Status</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody>
              {menuItems.map((item) => (
                <tr key={item.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                        {item.image ? <img src={item.image} alt={item.name} className="w-10 h-10 rounded-lg object-cover" /> : <Image size={16} className="text-gray-400" />}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{item.name}</p>
                        <p className="text-xs text-gray-500">{item.is_vegetarian ? '🟢 Veg' : '🔴 Non-Veg'}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-gray-600">{item.category_name || '-'}</td>
                  <td className="py-3 px-4 font-medium text-gray-900">{formatCurrency(item.price)}</td>
                  <td className="py-3 px-4">
                    <span className={`badge ${item.availability === 'available' ? 'bg-green-100 text-green-800' : item.availability === 'sold_out' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'}`}>
                      {item.availability}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex gap-2">
                      <button onClick={() => handleEdit(item)} className="text-blue-600 hover:text-blue-800 p-1">
                        <Edit size={16} />
                      </button>
                      <button onClick={() => handleDelete(item)} className="text-red-600 hover:text-red-800 p-1">
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

export default ManageMenu;
