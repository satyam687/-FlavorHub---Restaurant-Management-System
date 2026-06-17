import React from 'react';
import { ShoppingCart, Leaf, Flame } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { formatCurrency } from '../utils/constants';

const MenuItemCard = ({ item }) => {
  const { addToCart } = useCart();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      toast.error('Please login to add items to cart');
      navigate('/login');
      return;
    }

    try {
      await addToCart(item.id, 1);
      toast.success(`${item.name} added to cart`);
    } catch (error) {
      toast.error('Failed to add item to cart');
      console.error(error);
    }
  };

  return (
    <div className="card group">
      {/* Image */}
      <div className="relative h-48 bg-gray-200 overflow-hidden rounded-t-lg">
        {item.image ? (
          <img
            src={item.image}
            alt={item.name}
            onError={(e) => {
              e.target.src =
                'https://via.placeholder.com/300x200?text=No+Image';
            }}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary-100 to-accent-100">
            <span className="text-4xl">🍽️</span>
          </div>
        )}

        {/* Badges */}
        <div className="absolute top-3 left-3 flex gap-2">
          {item.is_vegetarian && (
            <span className="bg-green-500 text-white px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1">
              <Leaf size={12} />
              Veg
            </span>
          )}

          {item.is_spicy && (
            <span className="bg-red-500 text-white px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1">
              <Flame size={12} />
              Spicy
            </span>
          )}
        </div>

        {item.availability !== 'available' && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <span className="bg-red-600 text-white px-4 py-2 rounded-lg font-semibold">
              {item.availability === 'sold_out'
                ? 'Sold Out'
                : 'Unavailable'}
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-semibold text-gray-900 text-lg leading-tight">
            {item.name}
          </h3>

          <span className="text-primary-600 font-bold text-lg whitespace-nowrap ml-2">
            {formatCurrency(item.price)}
          </span>
        </div>

        {item.description && (
          <p className="text-gray-500 text-sm mb-3 line-clamp-2">
            {item.description}
          </p>
        )}

        <div className="flex items-center justify-between">
          <span className="text-xs text-gray-400">
            {item.preparation_time
              ? `~${item.preparation_time} min`
              : ''}
          </span>

          <button
            onClick={handleAddToCart}
            disabled={item.availability !== 'available'}
            className="flex items-center gap-1 bg-primary-600 hover:bg-primary-700 disabled:bg-gray-400 text-white px-3 py-2 rounded-lg text-sm font-medium transition-colors"
          >
            <ShoppingCart size={14} />
            Add
          </button>
        </div>
      </div>
    </div>
  );
};

export default MenuItemCard;

