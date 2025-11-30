import { motion } from 'motion/react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Search, Users, MessageSquare, ClipboardList, Bell, Compass } from 'lucide-react';
import { ROUTES } from '../utils/routes';

const Header = () => {
    const location = useLocation();

    const isActive = (path: string) => location.pathname === path;

    return (
        <motion.header
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            transition={{ duration: 0.5, type: "spring", stiffness: 100 }}
            className="bg-white border-b border-gray-200 shadow-sm"
        >
            <div className="max-w-7xl mx-auto px-3 sm:px-6 py-3">
                <div className="flex items-center justify-between">
                    <Link
                        to={ROUTES.HOME}
                        className="flex items-center space-x-2 sm:space-x-3 group"
                    >
                        <motion.div
                            className="w-8 h-8 sm:w-10 sm:h-10 bg-[#348086] rounded-xl flex items-center justify-center shadow-md"
                            whileHover={{ scale: 1.05, rotate: 5 }}
                            transition={{ type: "spring", stiffness: 300 }}
                        >
                            <Compass className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                        </motion.div>
                        <div className="hidden sm:flex flex-col">
                            <h1 className="text-xl font-bold text-gray-900">Tahwissa</h1>
                            <p className="text-gray-500 text-xs">Your Travel Companion</p>
                        </div>
                    </Link>

                    <nav className="flex items-center space-x-2 sm:space-x-4 md:space-x-8">
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

                    <div className="flex items-center space-x-2 sm:space-x-4 md:space-x-6">
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
                                to={ROUTES.PROFILE}
                                className="flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 bg-[#348086] text-white rounded-full font-semibold text-xs sm:text-sm hover:bg-[#2a6970] transition-colors"
                            >
                                TR
                            </Link>
                        </motion.div>
                    </div>
                </div>
            </div>
        </motion.header>
    );
};

export default Header;