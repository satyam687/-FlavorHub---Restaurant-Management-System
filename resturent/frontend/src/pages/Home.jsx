import { Link } from 'react-router-dom';
import { menuAPI } from '../api/menu';
import { useState, useEffect } from 'react';
import MenuItemCard from '../components/MenuItem';
import { ShoppingCart, Clock, Award, Truck } from 'lucide-react';

const Home = () => {
  const [featuredItems, setFeaturedItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const response = await menuAPI.getFeaturedItems();
        setFeaturedItems(response.data);
      } catch (error) {
        console.error('Failed to fetch featured items:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchFeatured();
  }, []);

  return (
    <div>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-primary-700 to-accent-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28">
          <div className="max-w-2xl">
            <h1 className="text-4xl md:text-6xl font-extrabold leading-tight mb-6">
              Delicious Food,<br />
              <span className="text-accent-200">Delivered Fast</span>
            </h1>
            <p className="text-lg md:text-xl text-gray-100 mb-8 leading-relaxed">
              Order from your favorite restaurants with just a few clicks. Fresh meals prepared with love and delivered to your doorstep.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link to="/menu" className="bg-white text-primary-700 hover:bg-gray-100 font-bold py-3 px-8 rounded-lg transition-colors shadow-lg">
                Browse Menu
              </Link>
              <Link to="/register" className="border-2 border-white text-white hover:bg-white hover:text-primary-700 font-bold py-3 px-8 rounded-lg transition-colors">
                Get Started
              </Link>
            </div>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-gray-50 to-transparent" />
      </section>

      {/* Features */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl shadow-lg p-6 flex items-center gap-4">
            <div className="w-14 h-14 bg-primary-100 rounded-xl flex items-center justify-center flex-shrink-0">
              <ShoppingCart className="text-primary-600" size={28} />
            </div>
            <div>
              <h3 className="font-bold text-gray-900">Easy Ordering</h3>
              <p className="text-gray-500 text-sm">Browse, add to cart, and checkout in minutes</p>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6 flex items-center gap-4">
            <div className="w-14 h-14 bg-accent-100 rounded-xl flex items-center justify-center flex-shrink-0">
              <Truck className="text-accent-600" size={28} />
            </div>
            <div>
              <h3 className="font-bold text-gray-900">Fast Delivery</h3>
              <p className="text-gray-500 text-sm">Get your food delivered in under 45 minutes</p>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6 flex items-center gap-4">
            <div className="w-14 h-14 bg-green-100 rounded-xl flex items-center justify-center flex-shrink-0">
              <Award className="text-green-600" size={28} />
            </div>
            <div>
              <h3 className="font-bold text-gray-900">Best Quality</h3>
              <p className="text-gray-500 text-sm">Fresh ingredients from trusted restaurants</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Items */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-3">Popular Dishes</h2>
          <p className="text-gray-500 max-w-2xl mx-auto">Discover our most loved dishes, crafted with the finest ingredients and bursting with flavor</p>
        </div>
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredItems.map((item) => (
              <MenuItemCard key={item.id} item={item} />
            ))}
          </div>
        )}
        <div className="text-center mt-10">
          <Link to="/menu" className="btn-outline">
            View Full Menu
          </Link>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-primary-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Order?</h2>
          <p className="text-primary-100 text-lg mb-8 max-w-2xl mx-auto">
            Join thousands of happy customers who enjoy delicious meals delivered right to their door.
          </p>
          <Link to="/menu" className="bg-white text-primary-700 hover:bg-gray-100 font-bold py-3 px-8 rounded-lg transition-colors shadow-lg inline-block">
            Start Ordering Now
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;
