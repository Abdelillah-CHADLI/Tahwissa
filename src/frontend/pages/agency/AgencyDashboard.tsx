import { useState, useEffect } from 'react';
import { motion } from "motion/react";
import { LayoutDashboard, Building2, Calendar, Package, Bell, Star, Settings, LogOut, Menu, X, Shield } from 'lucide-react';
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { profileService } from '../../services/api';
import { mockAgencyProvider } from '../../data/mockAgency';
import { ROUTES } from '../../utils/routes';

export function AgencyDashboard() {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isDesktop, setIsDesktop] = useState(false);
    const [agencyProfile, setAgencyProfile] = useState<any>(mockAgencyProvider);
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        const handleResize = () => {
            setIsDesktop(window.innerWidth >= 1024);
        };

        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                let agencyId = localStorage.getItem('agencyId');
                const userStr = localStorage.getItem('user');
                if (userStr && !agencyId) {
                    const user = JSON.parse(userStr);
                    agencyId = user.agencyId || user.id;
                }
                
                if (!agencyId) return;

                const response = await profileService.getProfile(agencyId, 'agency');
                if (response.data) {
                    setAgencyProfile({
                        name: response.data.agency_name,
                        verified: response.data.verified || false,
                        ...response.data
                    });
                }
            } catch {
                // Keep using mock data on error
            }
        };
        fetchProfile();
    }, []);

    const menuItems = [
        { path: "/agency", label: "Dashboard", icon: LayoutDashboard, end: true },
        { path: "/agency/profile", label: "Agency Profile", icon: Building2 },
        { path: "/agency/tour-programs", label: "Tour Programs", icon: Package },
        { path: "/agency/bookings", label: "Bookings", icon: Calendar },
        { path: "/agency/reviews", label: "Reviews & Ratings", icon: Star },
        { path: "/agency/settings", label: "Settings", icon: Settings },
        { path: "/agency/admin", label: "Admin Panel", icon: Shield },
    ];

    const currentMenuItem = menuItems.find(item => item.path === location.pathname) || menuItems[0];

    const handleLogout = () => {
        localStorage.removeItem('agencyId');
        localStorage.removeItem('token'); // If you use tokens
        navigate(ROUTES.HOME);
    };

    return (
        <div className='min-h-screen bg-gray-50'>
            <div className='lg:hidden bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between sticky top-0 z-50'>
                <div className='flex items-center gap-3'>
                    <button className='hover:bg-gray-100 p-1 rounded-md' onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
                        {isSidebarOpen ? <X className='w-5 h-5 text-gray-600' /> : <Menu className='w-5 h-5 text-gray-600' />}
                    </button>
                    <h2 className="font-semibold text-gray-800">Agency Dashboard</h2>
                </div>
                <div className="flex items-center gap-2">
                    <button className='hover:bg-green-50 p-2 rounded-full relative transition-colors'>
                        <Bell className='w-5 h-5 text-gray-600' />
                        <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
                    </button>
                </div>
            </div>

            <div className='flex'>
                <motion.aside
                    initial={false}
                    animate={{ x: (isSidebarOpen || isDesktop) ? 0 : -300 }}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    className={`
            fixed lg:sticky top-0 h-screen bg-white border-r border-gray-200 z-40
            w-72 flex flex-col pt-16 lg:pt-0
            ${isSidebarOpen ? "block" : "hidden lg:block"}
          `}
                >
                    <div className="p-6">
                        <div className="flex items-start gap-3 mb-8">
                            <div className="bg-[#375E5E] p-2 rounded-lg shrink-0">
                                <Building2 className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <h1 className="font-bold text-gray-900 leading-tight">{agencyProfile.name || "Explore Algeria Tours"}</h1>
                                <p className="text-xs text-gray-500 mt-0.5">Travel Agency</p>
                                <div className="flex items-center gap-2 mt-2">
                                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-green-50 text-green-600 text-[10px] font-medium border border-green-100">
                                        <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
                                        Active
                                    </span>
                                    {agencyProfile.verified && (
                                        <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-[#375E5E] text-white text-[10px] font-medium">
                                            Verified
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>

                        <nav className="space-y-1">
                            {menuItems.map((item) => (
                                <NavLink
                                    key={item.path}
                                    to={item.path}
                                    end={item.end}
                                    onClick={() => setIsSidebarOpen(false)}
                                    className={({ isActive }) => `w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${isActive
                                        ? "bg-[#375E5E] text-white shadow-md shadow-[#375E5E]/20"
                                        : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                                        }`}
                                >
                                    {({ isActive }) => (
                                        <>
                                            <item.icon className={`w-5 h-5 ${isActive ? "text-white" : "text-gray-400"}`} />
                                            {item.label}
                                            {isActive && (
                                                <span className="ml-auto w-1.5 h-1.5 rounded-full bg-green-400"></span>
                                            )}
                                        </>
                                    )}
                                </NavLink>
                            ))}
                        </nav>
                    </div>

                    <div className="mt-auto p-6 border-t border-gray-100">
                        <button 
                            onClick={handleLogout}
                            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
                        >
                            <LogOut className="w-5 h-5" />
                            Logout
                        </button>
                    </div>
                </motion.aside>

                <main className="flex-1 overflow-y-auto bg-gray-50">
                    <div className="hidden lg:block bg-white border-b border-gray-200 px-8 py-5 sticky top-0 z-30">
                        <div className="flex items-center justify-between">
                            <div>
                                <h2 className="text-xl font-semibold text-gray-900">
                                    {currentMenuItem.label}
                                </h2>
                                <p className="text-sm text-gray-500 mt-1">
                                    Manage your agency and tour programs
                                </p>
                            </div>
                            <div className="flex items-center gap-4">
                                <button className='hover:bg-green-50 p-2 rounded-full relative transition-colors'>
                                    <Bell className="w-5 h-5 text-gray-600" />
                                    <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white" />
                                </button>
                                <div className="w-8 h-8 rounded-full bg-[#375E5E] flex items-center justify-center text-white font-medium text-sm">
                                    {agencyProfile.name ? agencyProfile.name.substring(0, 2).toUpperCase() : "AM"}
                                </div>
                            </div>
                        </div>
                    </div>

                    <motion.div
                        key={location.pathname}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                        className="p-4 lg:p-8"
                    >
                        <Outlet />
                    </motion.div>
                </main>
            </div>

            {isSidebarOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    onClick={() => setIsSidebarOpen(false)}
                    className="fixed inset-0 bg-black/50 z-30 lg:hidden"
                />
            )}
        </div>
    );
}
