import { useState, useEffect } from 'react';
import { menuAPI } from '../api/menu';
import MenuItemCard from '../components/MenuItem';
import { Search } from 'lucide-react';

const MenuPage = () => {
  const [menuItems, setMenuItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  const [selectedCategory, setSelectedCategory] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [isVegetarian, setIsVegetarian] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const [itemsRes, categoriesRes] = await Promise.all([
          menuAPI.getMenuItems({
            category__slug: selectedCategory || undefined,
          }),
          menuAPI.getCategories(),
        ]);

        setMenuItems(itemsRes.data.results || itemsRes.data);
        setCategories(categoriesRes.data.results || categoriesRes.data);
      } catch (error) {
        console.error('Failed to fetch menu:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [selectedCategory]);

  // Frontend filtering
  const filteredMenuItems = menuItems.filter((item) => {
    const matchesSearch =
      !searchQuery ||
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesVeg =
      !isVegetarian || item.food_type === 'veg';

    return matchesSearch && matchesVeg;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          Our Menu
        </h1>
        <p className="text-gray-500 mt-2">
          Explore our delicious offerings
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4 mb-8">
        {/* Search */}
        <div className="relative flex-1">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            size={18}
          />

          <input
            type="text"
            placeholder="Search dishes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="input-field pl-10"
          />
        </div>

        {/* Category */}
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="input-field w-full md:w-48"
        >
          <option value="">All Categories</option>

          {categories.map((cat) => (
            <option key={cat.id} value={cat.slug}>
              {cat.name}
            </option>
          ))}
        </select>

        {/* Veg Only */}
        <label className="flex items-center gap-2 cursor-pointer bg-white border border-gray-300 rounded-lg px-4 py-3 hover:border-green-500 transition-colors">
          <input
            type="checkbox"
            checked={isVegetarian}
            onChange={(e) =>
              setIsVegetarian(e.target.checked)
            }
            className="w-4 h-4"
          />

          <span className="text-sm font-medium text-gray-700">
            Veg Only
          </span>
        </label>
      </div>

      {/* Category Pills */}
      <div className="flex gap-2 overflow-x-auto pb-4 mb-6">
        <button
          onClick={() => setSelectedCategory('')}
          className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
            !selectedCategory
              ? 'bg-primary-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          All
        </button>

        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.slug)}
            className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
              selectedCategory === cat.slug
                ? 'bg-primary-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {cat.name}
          </button>
        ))}
      </div>

      {/* Menu Grid */}
      {loading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        </div>
      ) : filteredMenuItems.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredMenuItems.map((item) => (
            <MenuItemCard
              key={item.id}
              item={item}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">
            No items found matching your criteria.
          </p>

          <button
            onClick={() => {
              setSelectedCategory('');
              setSearchQuery('');
              setIsVegetarian(false);
            }}
            className="btn-outline mt-4"
          >
            Clear Filters
          </button>
        </div>
      )}
    </div>
  );
};

export default MenuPage;

 