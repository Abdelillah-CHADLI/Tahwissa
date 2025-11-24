import { Facebook, Instagram, Twitter, Linkedin } from 'lucide-react';
import { Link } from 'react-router-dom';
import { ROUTES } from '../../utils/routes';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="container mx-auto px-6 max-w-7xl">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          {/* About */}
          <div>
            <h3 className="text-xl font-bold mb-4">About</h3>
            <p className="text-gray-400">
              Discover authentic Algerian tours and connect with local guides. Explore deserts, mountains, coasts, and more.
            </p>
          </div>

          {/* Explore */}
          <div>
            <h3 className="text-xl font-bold mb-4">Explore</h3>
            <ul className="text-gray-400 space-y-2">
              <li>
                <Link to={ROUTES.EXPLORE} className="hover:text-lime-400 transition-colors">
                  Explore Tours
                </Link>
              </li>
              <li>
                <Link to={ROUTES.SIGN_IN} className="hover:text-lime-400 transition-colors">
                  Sign In
                </Link>
              </li>
              <li>
                <Link to={ROUTES.SIGN_UP} className="hover:text-lime-400 transition-colors">
                  Sign Up
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-xl font-bold mb-4">Support</h3>
            <ul className="text-gray-400 space-y-2">

              <li>
                <Link to="#" className="hover:text-lime-400 transition-colors">
                  FAQ
                </Link>
              </li>
              <li>
                <Link to="#" className="hover:text-lime-400 transition-colors">
                  Terms & Conditions
                </Link>
              </li>
              <li>
                <Link to="#" className="hover:text-lime-400 transition-colors">
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>

          {/* Connect */}
          <div>
            <h3 className="text-xl font-bold mb-4">Connect</h3>
            <div className="flex gap-4 text-gray-400">
              <a href="#" aria-label="Facebook" className="hover:text-lime-400 transition-colors">
                <Facebook className="w-6 h-6" />
              </a>
              <a href="#" aria-label="Instagram" className="hover:text-lime-400 transition-colors">
                <Instagram className="w-6 h-6" />
              </a>
              <a href="#" aria-label="Twitter" className="hover:text-lime-400 transition-colors">
                <Twitter className="w-6 h-6" />
              </a>
              <a href="#" aria-label="LinkedIn" className="hover:text-lime-400 transition-colors">
                <Linkedin className="w-6 h-6" />
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-8 text-center text-gray-400">
          <p>&copy; 2025 Algerian Travel. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
