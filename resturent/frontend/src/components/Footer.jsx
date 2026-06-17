import { Link } from 'react-router-dom';
import { Phone, Mail, MapPin, Clock,Youtube,Instagram,Twitter,YoutubeIcon,InstagramIcon,TwitterIcon } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-10 h-10 bg-primary-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">FH</span>
              </div>
              <span className="text-xl font-bold text-white">FlavorHub</span>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed">
              Your favorite restaurants, delivered fast. Fresh food, great taste, every time.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><Link to="/menu" className="hover:text-primary-400 transition-colors text-sm">Our Menu</Link></li>
              <li><Link to="/cart" className="hover:text-primary-400 transition-colors text-sm">Cart</Link></li>
              <li><Link to="/order-tracking" className="hover:text-primary-400 transition-colors text-sm">Track Order</Link></li>
              <li><Link to="/login" className="hover:text-primary-400 transition-colors text-sm">Login</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-white font-semibold mb-4">Contact Us</h3>
            <ul className="space-y-3">
              <li className="flex items-center gap-2 text-sm">
                <Phone size={16} className="text-primary-400" />
                +91 8966815546
              </li>
              <li className="flex items-center gap-2 text-sm">
                <Mail size={16} className="text-primary-400" />
                pythonanchal@gmail.com
              </li>
              <li className="flex items-start gap-2 text-sm">
                <MapPin size={16} className="text-primary-400 mt-0.5" />
                123 Food Street, Rewa, India
              </li>
            </ul>
          </div>

          {/* Hours */}
          <div>
            <h3 className="text-white font-semibold mb-4">Opening Hours</h3>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center gap-2">
                <Clock size={16} className="text-primary-400" />
                Mon - Fri: 10am - 11pm
              </li>
              <li className="flex items-center gap-2">
                <Clock size={16} className="text-primary-400" />
                Sat - Sun: 9am - 12am
              </li>
            </ul>
          </div>
        </div>
     <div className="col-span-1">
  <p>  Social:</p>
  <div className="flex gap-4 mt-4">
    <a
      href="https://www.instagram.com/satyamkushwaha3181/"
      target="_blank"
      rel="noopener noreferrer"
      className="text-gray-400 hover:text-pink-500 transition-colors"
    >
      <Instagram size={22} />
    </a>

    <a
      href="https://www.youtube.com/@satyamkushwaha1021"
      target="_blank"
      rel="noopener noreferrer"
      className="text-gray-400 hover:text-red-500 transition-colors"
    >
      <Youtube size={22} />
    </a>

    <a
      href="https://x.com/SatyamK79360868"
      target="_blank"
      rel="noopener noreferrer"
      className="text-gray-400 hover:text-blue-400 transition-colors"
    >
      <Twitter size={22} />
    </a>
  </div>
</div>
 
        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm text-gray-500">
          <p>&copy; {new Date().getFullYear()} FlavorHub.  Satyam All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
