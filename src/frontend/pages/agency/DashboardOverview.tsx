import { PageHeader, PageState, Button, StatusBadge } from '../../components/ui';
import { useFeedback } from '../../components/ui/FeedbackProvider';
import { useNavigate } from 'react-router-dom';
import { motion } from "motion/react";
import {
  Package,
  Calendar,
  Star,
  Users,
  Clock,
} from "lucide-react";
import { useDashboardData } from "../../hooks/useDashboardData";
import { VerificationBanner } from "../../components/agency/VerificationBanner";
import { VerificationModal } from "../../components/agency/VerificationModal";
import { useState, useEffect } from "react";
import { getCurrentAgencyUuid, getCurrentProfileType } from "../../utils/session";
import { profileService } from "../../services/api";

export function DashboardOverview() {
  const { notify } = useFeedback();
  const navigate = useNavigate();
  const { data, loading, error } = useDashboardData();
  const [isVerificationModalOpen, setIsVerificationModalOpen] = useState(false);
  const [verified, setVerified] = useState(false);
  const [agencyId, setAgencyId] = useState<string>('');

  useEffect(() => {
    const fetchVerificationStatus = async () => {
      try {
        const id = getCurrentAgencyUuid();
        const profileType = getCurrentProfileType();
        if (!id || !profileType) return;
        setAgencyId(id);

        const response = await profileService.getProfile(id, profileType);
        if (response.data || response.profile) {
          const profile = response.data || response.profile;
          setVerified(profile.verified || false);
        }
      } catch (error) {
        console.error('Failed to load verification status:', error);
      }
    };
    fetchVerificationStatus();
  }, []);

  if (loading) return <PageState kind="loading" title="Loading your overview" />;
  if (error || !data) return <PageState kind="error" title="Overview unavailable" description={error || 'Please try again.'} action={<Button onClick={() => window.location.reload()}>Try again</Button>} />;

  const stats = [
    {
      icon: Package,
      label: "Active Tours",
      value: data.stats.activeTours.toString(),
      change: data.stats.activeTours === 0 ? "No tours yet" : "Active right now",
    },
    {
      icon: Calendar,
      label: "Total Bookings",
      value: data.stats.totalBookings.toString(),
      change: 'Across all your tours',
    },
    {
      icon: Star,
      label: "Average Rating",
      value: data.stats.averageRating.toFixed(1),
      change: `Based on ${data.stats.totalReviews} reviews`,
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader title="Your overview" description="Keep track of your tours, bookings, and traveler feedback." actions={<Button onClick={() => navigate('/agency/add-tour')}>Create tour</Button>} />
      {/* Verification Banner */}
      <VerificationBanner
        verified={verified}
        onApplyVerification={() => setIsVerificationModalOpen(true)}
      />

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="panel p-4 sm:p-5"
          >
            <stat.icon className="mb-4 h-5 w-5 text-brand" aria-hidden="true" />
            <h3 className="mb-1 text-2xl font-semibold tracking-tight text-brand-ink">{stat.value}</h3>
            <p className="text-sm font-medium text-gray-700">{stat.label}</p>
            <p className="mt-1 text-xs text-gray-500">{stat.change}</p>
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
                <button
                  onClick={() => navigate('/agency/bookings')}
                  className="text-sm font-medium text-gray-900 hover:text-gray-700 transition-colors"
                >
                  View All
                </button>
              </div>
            </div>

            {/* Card Content */}
            <div className="p-6">
              <div className="space-y-4">
                {!data.recentBookings.length && <p className="py-4 text-sm leading-6 text-gray-500">No bookings yet. Once travelers request your tours, you can review them here.</p>}
                {data.recentBookings.map((booking) => (
                  <div
                    key={booking.id}
                    className="flex flex-wrap items-center justify-between gap-3 border-b border-line py-4 last:border-0"
                  >
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900 mb-1">{booking.tour}</h4>
                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-gray-500">
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
                        <StatusBadge status={booking.status} />
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
                {!data.popularTours.length && <p className="text-sm leading-6 text-gray-500">Your tours will appear here as you build your collection.</p>}
                {data.popularTours.map((tour, index) => (
                  <div key={`tour-${index}-${tour.name}`}>
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900 mb-2">{tour.name}</h4>
                        <div className="flex flex-row items-center gap-4 text-xs text-gray-500 mb-3">
                          <span className="flex items-center gap-1.5">
                            <Calendar className="w-3.5 h-3.5" />
                            {tour.bookings} bookings
                          </span>

                        </div>
                      </div>
                      {tour.rating > 0 && <span className="inline-flex items-center gap-1 px-2 py-1 text-xs font-bold border border-gray-200 rounded-lg bg-white text-gray-900">
                        <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                        {tour.rating}
                      </span>}
                    </div>

                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Verification Modal */}
      <VerificationModal
        isOpen={isVerificationModalOpen}
        onClose={() => setIsVerificationModalOpen(false)}
        agencyId={agencyId}
        profileType={getCurrentProfileType() || 'agency'}
        onSuccess={() => {
          setVerified(false);
          notify('Verification request submitted successfully!');
        }}
      />
    </div>
  );
}
