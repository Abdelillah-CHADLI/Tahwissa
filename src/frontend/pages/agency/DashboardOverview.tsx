import { useNavigate } from 'react-router-dom';
import { motion } from "motion/react";
import {
  Package,
  Calendar,
  Star,
  TrendingUp,
  Users,
  Eye,
  Clock,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { useDashboardData } from "../../hooks/useDashboardData";

export function DashboardOverview() {
  const navigate = useNavigate();
  const { data, loading, error } = useDashboardData();

  // Loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-600" />
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error || !data) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md text-center">
          <AlertCircle className="w-12 h-12 mx-auto mb-4 text-red-500" />
          <h3 className="text-xl font-bold mb-2">Failed to Load Dashboard</h3>
          <p className="text-sm text-gray-600 mb-4">
            {error || "An unexpected error occurred"}
          </p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  const stats = [
    {
      icon: Package,
      label: "Active Tours",
      value: data.stats.activeTours.toString(),
      change: "+2 this month",
      color: "bg-[#375E5E]",
      trend: "up" as const,
    },
    {
      icon: Calendar,
      label: "Total Bookings",
      value: data.stats.totalBookings.toString(),
      change: `+${data.stats.monthlyBookingChange}% from last month`,
      color: "bg-[#5D8E8E]",
      trend: "up" as const,
    },
    {
      icon: Star,
      label: "Average Rating",
      value: data.stats.averageRating.toFixed(1),
      change: `Based on ${data.stats.totalReviews} reviews`,
      color: "bg-[#D4F58D]",
      trend: "stable" as const,
    },
  ];

  return (
    <div className="space-y-8">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:border-[#375E5E] transition-colors"
          >
            <div className="flex items-start justify-between mb-4">
              <div
                className={`w-12 h-12 rounded-xl ${stat.color} flex items-center justify-center shadow-sm`}
              >
                <stat.icon className={`w-6 h-6 ${stat.label === "Average Rating" ? "text-white" : "text-white"}`} />
              </div>
              {stat.trend === "up" && (
                <TrendingUp className="w-4 h-4 text-green-500" />
              )}
            </div>
            <h3 className="text-3xl font-bold mb-1 text-gray-900">{stat.value}</h3>
            <p className="text-sm text-gray-500 mb-2">{stat.label}</p>
            <p className="text-xs text-gray-400">{stat.change}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Bookings */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="lg:col-span-2"
        >
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 h-full">
            {/* Card Header */}
            <div className="p-6 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-medium text-gray-900">Recent Bookings</h2>
                <button className="text-sm font-medium text-gray-900 hover:text-gray-700 transition-colors">
                  View All
                </button>
              </div>
            </div>

            {/* Card Content */}
            <div className="p-6">
              <div className="space-y-4">
                {data.recentBookings.map((booking) => (
                  <div
                    key={booking.id}
                    className="flex items-center justify-between p-4 rounded-xl border border-gray-100 hover:border-[#375E5E] transition-all bg-white"
                  >
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900 mb-1">{booking.tour}</h4>
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <span className="flex items-center gap-1">
                          <Users className="w-3.5 h-3.5" />
                          {booking.traveler}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5" />
                          {booking.date}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="font-bold text-gray-900">{booking.amount}</p>
                        <span
                          className={`inline-block mt-1 px-3 py-1 text-xs font-medium rounded-full text-white ${
                            booking.status === "confirmed"
                              ? "bg-[#375E5E]"
                              : "bg-[#5D8E8E]"
                          }`}
                        >
                          {booking.status}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Popular Tours */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 h-full">
            {/* Card Header */}
            <div className="p-6 border-b border-gray-100">
              <h2 className="text-lg font-medium text-gray-900">Popular Tours</h2>
            </div>

            {/* Card Content */}
            <div className="p-6">
              <div className="space-y-8">
                {data.popularTours.map((tour) => (
                  <div key={tour.name}>
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900 mb-2">{tour.name}</h4>
                        <div className="flex flex-row items-center gap-4 text-xs text-gray-500 mb-3">
                          <span className="flex items-center gap-1.5">
                            <Calendar className="w-3.5 h-3.5" />
                            {tour.bookings} bookings
                          </span>
                          <span className="flex items-center gap-1.5">
                            <Eye className="w-3.5 h-3.5" />
                            {tour.views} views
                          </span>
                        </div>
                      </div>
                      <span className="inline-flex items-center gap-1 px-2 py-1 text-xs font-bold border border-gray-200 rounded-lg bg-white text-gray-900">
                        <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                        {tour.rating}
                      </span>
                    </div>
                    {/* Progress Bar */}
                    <div className="w-full bg-gray-100 rounded-full h-1.5 overflow-hidden">
                      <div
                        className="bg-[#375E5E] h-1.5 rounded-full transition-all"
                        style={{ width: `${(tour.bookings / 50) * 100}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.6 }}
      >
        <div className="bg-[#4A7B7B] text-white rounded-xl shadow-sm relative overflow-hidden">
          <div className="p-8 relative z-10">
            <div className="flex items-center justify-between">
              <div className="max-w-lg">
                <h3 className="text-xl font-medium mb-2 text-white">
                  Ready to grow your business?
                </h3>
                <p className="text-white/90 mb-6 text-sm">
                  Create new tour programs and reach more travelers
                </p>
                <button 
                  onClick={() => navigate('/agency/add-tour')}
                  className="px-6 py-2.5 bg-[#D4F58D] text-[#375E5E] rounded-lg hover:bg-[#c3e87b] transition-colors font-bold text-sm"
                >
                  Create New Tour
                </button>
              </div>
              <Package className="w-40 h-40 text-white/10 absolute -right-8 -bottom-12 rotate-12 stroke-1" />
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
