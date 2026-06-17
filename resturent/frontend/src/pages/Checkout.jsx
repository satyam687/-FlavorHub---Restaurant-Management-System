import { useState } from 'react';
import { useCart } from '../context/CartContext';
import { ordersAPI } from '../api/orders';
import toast from 'react-hot-toast';
import { QRCodeCanvas } from 'qrcode.react';
import { Truck, ChevronRight } from 'lucide-react';
import { formatCurrency } from '../utils/constants';

const Checkout = () => {
  const { cart, totalPrice, totalItems } = useCart();

  const [loading, setLoading] = useState(false);
  const [upiLink, setUpiLink] = useState('');

  const [formData, setFormData] = useState({
    delivery_address: '',
    phone: '',
    special_instructions: '',
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.delivery_address || !formData.phone) {
      toast.error('Please fill all required fields');
      return;
    }

    if (!cart.items || cart.items.length === 0) {
      toast.error('Your cart is empty');
      return;
    }

    setLoading(true);

    try {
      const orderData = {
        delivery_address: formData.delivery_address,
        phone: formData.phone,
        special_instructions: formData.special_instructions,
        total_amount: totalPrice,

        items: cart.items.map((item) => ({
          menu_item: item.menu_item_detail?.id || item.menu_item,
          quantity: item.quantity,
        })),
      };

      const response = await ordersAPI.createOrder(orderData);

      console.log('Order Created:', response.data);

      const generatedUpiLink =
        `upi://pay?pa=8966815546@axl&pn=Restaurant&am=${totalPrice}&cu=INR`;

      setUpiLink(generatedUpiLink);

      toast.success('Order created successfully');

    } catch (error) {
      console.error(error);
      toast.error('Failed to create order');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">

      <h1 className="text-3xl font-bold mb-8">
        Checkout
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* Left Side */}
        <div className="lg:col-span-2">

          <form onSubmit={handleSubmit} className="space-y-6">

            <div className="bg-white rounded-xl shadow-md p-6">

              <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
                <Truck size={20} />
                Delivery Information
              </h2>

              <textarea
                name="delivery_address"
                value={formData.delivery_address}
                onChange={handleChange}
                placeholder="Delivery Address"
                className="input-field w-full mb-4"
                rows={3}
                required
              />

              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="Phone Number"
                className="input-field w-full mb-4"
                required
              />

              <textarea
                name="special_instructions"
                value={formData.special_instructions}
                onChange={handleChange}
                placeholder="Special Instructions"
                className="input-field w-full"
                rows={2}
              />

            </div>

            {upiLink && (
              <div className="bg-white rounded-xl shadow-md p-6">

                <h3 className="text-lg font-bold mb-4 text-center">
                  Scan & Pay via UPI
                </h3>

                <div className="flex justify-center">
                  <QRCodeCanvas
                    value={upiLink}
                    size={250}
                  />
                </div>

                <div className="mt-4 text-center">

                  <p className="font-medium">
                    UPI ID: 8966815546@axl
                  </p>

                  <p className="text-gray-500 text-sm mt-2">
                    Scan using Google Pay, PhonePe, Paytm or BHIM
                  </p>

                </div>

              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full flex items-center justify-center gap-2 py-3"
            >
              {loading ? (
                'Processing...'
              ) : (
                <>
                  Place Order - {formatCurrency(totalPrice)}
                  <ChevronRight size={18} />
                </>
              )}
            </button>

          </form>

        </div>

        {/* Right Side */}
        <div>

          <div className="bg-white rounded-xl shadow-md p-6">

            <h3 className="text-lg font-bold mb-4">
              Order Summary
            </h3>

            {cart.items?.map((item) => (
              <div
                key={item.id}
                className="flex justify-between mb-2"
              >
                <span>
                  {item.menu_item_detail?.name} × {item.quantity}
                </span>

                <span>
                  {formatCurrency(item.subtotal)}
                </span>
              </div>
            ))}

            <hr className="my-4" />

            <div className="flex justify-between">
              <span>Items ({totalItems})</span>
              <span>{formatCurrency(totalPrice)}</span>
            </div>

            <div className="flex justify-between">
              <span>Delivery</span>
              <span>Free</span>
            </div>

            <div className="flex justify-between font-bold text-lg mt-3">
              <span>Total</span>
              <span>{formatCurrency(totalPrice)}</span>
            </div>

          </div>

        </div>

      </div>

    </div>
  );
};

export default Checkout;
 