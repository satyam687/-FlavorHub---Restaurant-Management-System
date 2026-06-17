import { Minus, Plus, Trash2 } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { formatCurrency } from '../utils/constants';

const CartItem = ({ item }) => {
  const { updateCartItem, removeFromCart } = useCart();

  const handleQuantityChange = async (newQuantity) => {
    if (newQuantity < 1) return;
    await updateCartItem(item.id, { quantity: newQuantity });
  };

  return (
    <div className="flex items-center gap-4 py-4 border-b border-gray-100 last:border-0">
      {/* Image */}
      <div className="w-20 h-20 rounded-lg bg-gray-200 flex-shrink-0 overflow-hidden">
        {item.menu_item_detail?.image ? (
          <img src={item.menu_item_detail.image} alt={item.menu_item_detail.name} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-100">
            <span className="text-2xl">🍽️</span>
          </div>
        )}
      </div>

      {/* Details */}
      <div className="flex-1 min-w-0">
        <h4 className="font-semibold text-gray-900 truncate">{item.menu_item_detail?.name || 'Item'}</h4>
        {item.special_instructions && (
          <p className="text-xs text-gray-500 mt-1 truncate">{item.special_instructions}</p>
        )}
        <p className="text-primary-600 font-bold mt-1">{formatCurrency(item.subtotal)}</p>
      </div>

      {/* Quantity Controls */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => handleQuantityChange(item.quantity - 1)}
          disabled={item.quantity <= 1}
          className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <Minus size={14} />
        </button>
        <span className="w-8 text-center font-semibold">{item.quantity}</span>
        <button
          onClick={() => handleQuantityChange(item.quantity + 1)}
          className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100 transition-colors"
        >
          <Plus size={14} />
        </button>
      </div>

      {/* Remove */}
      <button
        onClick={() => removeFromCart(item.id)}
        className="text-red-500 hover:text-red-700 hover:bg-red-50 p-2 rounded-lg transition-colors"
      >
        <Trash2 size={18} />
      </button>
    </div>
  );
};

export default CartItem;
