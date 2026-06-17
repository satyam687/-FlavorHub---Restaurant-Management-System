import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import CartItem from '../components/CartItem';
import { Link, useNavigate } from 'react-router-dom';
import { formatCurrency } from '../utils/constants';
import { ShoppingBag, Trash2, ArrowRight } from 'lucide-react';

const Cart = () => {
  const { cart, loading, clearCart, totalItems, totalPrice } = useCart();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!cart.items || cart.items.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center px-4">
        <ShoppingBag size={64} className="text-gray-300 mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Your cart is empty</h2>
        <p className="text-gray-500 mb-6">Add some delicious items from our menu!</p>
        <Link to="/menu" className="btn-primary">
          Browse Menu
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Your Cart</h1>
        <button onClick={clearCart} className="text-red-500 hover:text-red-700 flex items-center gap-1 text-sm font-medium">
          <Trash2 size={16} />
          Clear Cart
        </button>
      </div>

      {/* Cart Items */}
      <div className="bg-white rounded-xl shadow-md p-6 mb-6">
        {cart.items.map((item) => (
          <CartItem key={item.id} item={item} />
        ))}
      </div>

      {/* Order Summary */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Order Summary</h3>
        <div className="space-y-3">
          <div className="flex justify-between text-gray-600">
            <span>Items ({totalItems})</span>
            <span>{formatCurrency(totalPrice)}</span>
          </div>
          <div className="flex justify-between text-gray-600">
            <span>Delivery Fee</span>
            <span className="text-green-600">Free</span>
          </div>
          <div className="border-t pt-3 flex justify-between font-bold text-lg text-gray-900">
            <span>Total</span>
            <span>{formatCurrency(totalPrice)}</span>
          </div>
        </div>
        <button
          onClick={() => navigate('/checkout')}
          className="btn-primary w-full mt-6 flex items-center justify-center gap-2"
        >
          Proceed to Checkout
          <ArrowRight size={18} />
        </button>
        <Link to="/menu" className="block text-center text-primary-600 hover:text-primary-700 font-medium mt-3 text-sm">
          Continue Shopping
        </Link>
      </div>
    </div>
  );
};

export default Cart;
