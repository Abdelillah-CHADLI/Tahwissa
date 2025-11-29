import { motion } from 'motion/react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Home, Search, Users, MessageSquare, ClipboardList, Bell, Compass, Menu, X } from 'lucide-react';
import { ROUTES } from '../utils/routes';
import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext'; 

const Header = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { user } = useAuth(); 
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const isActive = (path: string) => location.pathname === path;

    const handleProfileClick = (e: React.MouseEvent) => {
        if (!user) {
            e.preventDefault(); 
            navigate(ROUTES.SIGN_IN);
        }
    };

    const navItems = [
        { path: ROUTES.HOME, icon: Home, label: 'Home' },
        { path: ROUTES.EXPLORE, icon: Search, label: 'Explore' },
        { path: ROUTES.GUIDES, icon: Users, label: 'Guides & Agencies' },
        { path: ROUTES.COMMUNITY, icon: MessageSquare, label: 'Community' },
        { path: ROUTES.REQUESTS, icon: ClipboardList, label: 'My Requests' },
    ];

    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen);
    };

    return (
        <motion.header
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            transition={{ duration: 0.5, type: "spring", stiffness: 100 }}
            className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-50"
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3">
                <div className="flex items-center justify-between">
                    <Link
                        to={ROUTES.HOME}
                        className="flex items-center space-x-2 sm:space-x-3 group"
                    >
                        <motion.div 
                            className="w-8 h-8 sm:w-10 sm:h-10 bg-[#348086] rounded-xl flex items-center justify-center shadow-md"
                            whileHover={{ 
                                scale: 1.05, 
                                rotate: 360,
                                transition: { 
                                    rotate: { duration: 0.6, ease: "easeInOut" },
                                    scale: { duration: 0.2 }
                                }
                            }}
                        >
                            <Compass className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                        </motion.div>
                        <div className="flex flex-col">
                            <h1 className="text-lg sm:text-xl font-bold text-gray-900">Tahwissa</h1>
                            <p className="text-gray-500 text-xs hidden sm:block">Your Travel Companion</p>
                        </div>
                    </Link>

                    <nav className="hidden lg:flex items-center space-x-8">
                        <motion.div whileHover={{ y: -2 }} transition={{ type: "spring", stiffness: 400 }}>
                            <Link
                                to={ROUTES.HOME}
                                className={`flex items-center space-x-1 sm:space-x-2 transition-colors pb-1 border-b-2 px-1 sm:px-0 ${isActive(ROUTES.HOME)
                                    ? 'text-[#348086] border-[#348086]'
                                    : 'text-gray-600 border-transparent hover:text-[#348086] hover:border-[#348086]'
                                    }`}
                            >
                                <Home className="w-4 h-4" />
                                <span className="text-sm font-medium hidden md:inline">Home</span>
                            </Link>
                        </motion.div>

                        <motion.div whileHover={{ y: -2 }} transition={{ type: "spring", stiffness: 400 }}>
                            <Link
                                to={ROUTES.EXPLORE}
                                className={`flex items-center space-x-1 sm:space-x-2 transition-colors pb-1 border-b-2 px-1 sm:px-0 ${isActive(ROUTES.EXPLORE)
                                    ? 'text-[#348086] border-[#348086]'
                                    : 'text-gray-600 border-transparent hover:text-[#348086] hover:border-[#348086]'
                                    }`}
                            >
                                <Search className="w-4 h-4" />
                                <span className="text-sm font-medium hidden md:inline">Explore</span>
                            </Link>
                        </motion.div>

                        <motion.div whileHover={{ y: -2 }} transition={{ type: "spring", stiffness: 400 }}>
                            <Link
                                to={ROUTES.GUIDES}
                                className={`flex items-center space-x-1 sm:space-x-2 transition-colors pb-1 border-b-2 px-1 sm:px-0 ${isActive(ROUTES.GUIDES)
                                    ? 'text-[#348086] border-[#348086]'
                                    : 'text-gray-600 border-transparent hover:text-[#348086] hover:border-[#348086]'
                                    }`}
                            >
                                <Users className="w-4 h-4" />
                                <span className="text-sm font-medium hidden lg:inline">Guides & Agencies</span>
                            </Link>
                        </motion.div>

                        <motion.div whileHover={{ y: -2 }} transition={{ type: "spring", stiffness: 400 }}>
                            <Link
                                to={ROUTES.COMMUNITY}
                                className={`flex items-center space-x-1 sm:space-x-2 transition-colors pb-1 border-b-2 px-1 sm:px-0 ${isActive(ROUTES.COMMUNITY)
                                    ? 'text-[#348086] border-[#348086]'
                                    : 'text-gray-600 border-transparent hover:text-[#348086] hover:border-[#348086]'
                                    }`}
                            >
                                <MessageSquare className="w-4 h-4" />
                                <span className="text-sm font-medium hidden md:inline">Community</span>
                            </Link>
                        </motion.div>

                        <motion.div whileHover={{ y: -2 }} transition={{ type: "spring", stiffness: 400 }}>
                            <Link
                                to={ROUTES.REQUESTS}
                                className={`flex items-center space-x-1 sm:space-x-2 transition-colors pb-1 border-b-2 px-1 sm:px-0 ${isActive(ROUTES.REQUESTS)
                                    ? 'text-[#348086] border-[#348086]'
                                    : 'text-gray-600 border-transparent hover:text-[#348086] hover:border-[#348086]'
                                    }`}
                            >
                                <ClipboardList className="w-4 h-4" />
                                <span className="text-sm font-medium hidden md:inline">My Requests</span>
                            </Link>
                        </motion.div>
                    </nav>

                    <div className="hidden lg:flex items-center space-x-6">
                        <motion.button 
                            whileHover={{ scale: 1.05, y: -1 }}
                            whileTap={{ scale: 0.95 }}
                            className="p-1.5 sm:p-2 text-gray-600 hover:text-[#348086] hover:bg-gray-100 rounded-lg transition-colors relative"
                        >
                            <Bell className="w-4 h-4 sm:w-5 sm:h-5" />
                            <span className="absolute top-0.5 right-0.5 sm:top-1 sm:right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                        </motion.button>

                        <motion.div
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            <Link
                                to={user ? ROUTES.PROFILE : ROUTES.SIGN_IN}
                                onClick={handleProfileClick}
                                className="flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 bg-[#348086] text-white rounded-full font-semibold text-xs sm:text-sm hover:bg-[#2a6970] transition-colors"
                            >
                                {user ? (user.firstName?.charAt(0) || user.name?.charAt(0) || 'U') : 'TR'}
                            </Link>
                        </motion.div>
                    </div>

                    <div className="flex lg:hidden items-center space-x-4">
                        <motion.button 
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="p-2 text-gray-600 hover:text-[#348086] hover:bg-gray-100 rounded-lg transition-colors relative"
                        >
                            <Bell className="w-5 h-5" />
                            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                        </motion.button>

                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={toggleMobileMenu}
                            className="p-2 text-gray-600 hover:text-[#348086] hover:bg-gray-100 rounded-lg transition-colors"
                        >
                            {isMobileMenuOpen ? (
                                <X className="w-5 h-5" />
                            ) : (
                                <Menu className="w-5 h-5" />
                            )}
                        </motion.button>
                    </div>
                </div>

                <motion.div
                    initial={false}
                    animate={{ 
                        height: isMobileMenuOpen ? 'auto' : 0,
                        opacity: isMobileMenuOpen ? 1 : 0
                    }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                    className="lg:hidden overflow-hidden border-t border-gray-200 mt-3"
                >
                    <nav className="py-4">
                        <div className="flex flex-col space-y-3">
                            {navItems.map((item) => {
                                const Icon = item.icon;
                                return (
                                    <motion.div
                                        key={item.path}
                                        initial={{ x: -20, opacity: 0 }}
                                        animate={{ x: 0, opacity: isMobileMenuOpen ? 1 : 0 }}
                                        transition={{ duration: 0.3 }}
                                    >
                                        <Link
                                            to={item.path}
                                            onClick={() => setIsMobileMenuOpen(false)}
                                            className={`flex items-center space-x-3 p-3 rounded-lg transition-colors ${
                                                isActive(item.path)
                                                    ? 'bg-[#348086] text-white'
                                                    : 'text-gray-600 hover:bg-gray-100 hover:text-[#348086]'
                                            }`}
                                        >
                                            <Icon className="w-5 h-5" />
                                            <span className="font-medium">{item.label}</span>
                                        </Link>
                                    </motion.div>
                                );
                            })}
                            
                            <motion.div
                                initial={{ x: -20, opacity: 0 }}
                                animate={{ x: 0, opacity: isMobileMenuOpen ? 1 : 0 }}
                                transition={{ duration: 0.3, delay: 0.1 }}
                                className="flex items-center space-x-3 p-3 border-t border-gray-200 pt-4 mt-2"
                            >
                                <Link
                                    to={user ? ROUTES.PROFILE : ROUTES.SIGN_IN}
                                    onClick={(e) => {
                                        if (!user) {
                                            e.preventDefault();
                                            navigate(ROUTES.SIGN_IN);
                                        }
                                        setIsMobileMenuOpen(false);
                                    }}
                                    className="flex items-center space-x-3 w-full"
                                >
                                    <div className="flex items-center justify-center w-10 h-10 bg-[#348086] text-white rounded-full font-semibold text-sm">
                                        {user ? (user.firstName?.charAt(0) || user.name?.charAt(0) || 'U') : 'TR'}
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="font-medium text-gray-900">
                                            {user ? (user.firstName || user.name || 'User') : 'Traveler'}
                                        </span>
                                        <span className="text-sm text-gray-500">
                                            {user ? 'View Profile' : 'Sign In'}
                                        </span>
                                    </div>
                                </Link>
                            </motion.div>
                        </div>
                    </nav>
                </motion.div>
            </div>
        </motion.header>
    );
};

export default Header;