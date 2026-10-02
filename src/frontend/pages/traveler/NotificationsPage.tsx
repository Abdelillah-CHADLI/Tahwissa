import { PageState, Button } from '../../components/ui';
import { CalendarCheck, MapPin } from 'lucide-react';
import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import api from '../../services/api';
import type { User } from '../../types/auth';

interface Notification {
  id: string;
  type: 'booking' | 'review' | 'message' | 'tour' | 'guide' | 'post' | 'offer';
  title: string;
  message: string;
  timestamp: string;
  isRead: boolean;
}

type BookingStatus = string;

interface Booking {
  booking_id?: string | number;
  booking_date?: string;
  status?: BookingStatus;
  tour_id?: string | number;
  tours?: {
    tour_id?: string | number;
    tour_title?: string;
    start_date?: string;
    location?: string;
  };
}

const READ_STORAGE_KEY_PREFIX = 'traveler_notifications_read:';
const REMINDER_DAYS = 3;

const safeParseDate = (dateStr?: string): Date | null => {
  if (!dateStr) return null;
  const d = new Date(dateStr);
  return Number.isNaN(d.getTime()) ? null : d;
};

const formatRelativeDay = (dateStr?: string): string => {
  const date = safeParseDate(dateStr);
  if (!date) return '';

  const now = new Date();
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const startOfThatDay = new Date(date.getFullYear(), date.getMonth(), date.getDate());

  const diffMs = startOfThatDay.getTime() - startOfToday.getTime();
  const diffDays = Math.round(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return 'today';
  if (diffDays === 1) return 'tomorrow';
  if (diffDays === -1) return 'yesterday';
  if (diffDays > 1) return `in ${diffDays} days`;
  return `${Math.abs(diffDays)} days ago`;
};

const getTravellerIdFromStorage = (): string | null => {
  const userStr = localStorage.getItem('user');
  if (!userStr) return null;
  try {
    const user: User = JSON.parse(userStr);
    return (user.profileId || user.userId || user.id || null) as string | null;
  } catch {
    return null;
  }
};

const loadReadIds = (travellerId: string): Set<string> => {
  try {
    const raw = localStorage.getItem(`${READ_STORAGE_KEY_PREFIX}${travellerId}`);
    if (!raw) return new Set();
    const arr = JSON.parse(raw);
    return Array.isArray(arr) ? new Set(arr.map(String)) : new Set();
  } catch {
    return new Set();
  }
};

const saveReadIds = (travellerId: string, ids: Set<string>) => {
  try {
    localStorage.setItem(`${READ_STORAGE_KEY_PREFIX}${travellerId}`, JSON.stringify(Array.from(ids)));
  } catch {
    // ignore storage failures
  }
};

const NotificationsPage = () => {
  const [activeFilter, setActiveFilter] = useState<'all' | 'unread' | 'read'>('all');
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);



  const fetchNotifications = async () => {
    setLoading(true); setError('');
    try {
      const travellerId = getTravellerIdFromStorage();
      if (!travellerId) {
        setNotifications([]);
        return;
      }

      const readIds = loadReadIds(travellerId);

      const response = await api.get('/api/bookings/explore', {
        params: { userId: travellerId }
      });

      const bookings: Booking[] = response.data?.data || [];

      const built: Notification[] = [];

      bookings.forEach((booking) => {
        const bookingId = String(booking.booking_id ?? `${booking.tour_id ?? 'tour'}-${booking.booking_date ?? 'date'}`);
        const tourTitle = booking.tours?.tour_title || 'your tour';
        const status = String(booking.status ?? 'PENDING').toUpperCase();

        built.push({
          id: `booking-${bookingId}-status`,
          type: 'booking',
          title: `Booking ${status}`,
          message: `Your booking for "${tourTitle}" is ${status.toLowerCase()}.`,
          timestamp: formatRelativeDay(booking.booking_date) || 'recently',
          isRead: readIds.has(`booking-${bookingId}-status`)
        });

        const startDate = safeParseDate(booking.tours?.start_date);
        if (startDate) {
          const now = new Date();
          const diffMs = startDate.getTime() - now.getTime();
          const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
          if (diffDays >= 0 && diffDays <= REMINDER_DAYS) {
            built.push({
              id: `booking-${bookingId}-reminder`,
              type: 'tour',
              title: 'Upcoming Trip Reminder',
              message: `Your "${tourTitle}" starts ${formatRelativeDay(booking.tours?.start_date)}.`,
              timestamp: formatRelativeDay(booking.tours?.start_date) || 'soon',
              isRead: readIds.has(`booking-${bookingId}-reminder`)
            });
          }
        }
      });

      setNotifications(built);
    } catch {
      setError('Trip updates could not be loaded. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { void fetchNotifications(); }, []);

  const markAsRead = async (id: string) => {
    try {
      const travellerId = getTravellerIdFromStorage();
      if (travellerId) {
        const readIds = loadReadIds(travellerId);
        readIds.add(id);
        saveReadIds(travellerId, readIds);
      }
      setNotifications(notifications.map(notif =>
        notif.id === id ? { ...notif, isRead: true } : notif
      ));
    } catch {
      // ignore
    }
  };

  const markAllAsRead = async () => {
    try {
      const travellerId = getTravellerIdFromStorage();
      if (travellerId) {
        const readIds = loadReadIds(travellerId);
        notifications.forEach(n => readIds.add(n.id));
        saveReadIds(travellerId, readIds);
      }
      setNotifications(notifications.map(notif => ({ ...notif, isRead: true })));
    } catch {
      // ignore
    }
  };

  const filteredNotifications = notifications.filter(notif => {
    if (activeFilter === 'unread') return !notif.isRead;
    if (activeFilter === 'read') return notif.isRead;
    return true;
  });

  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <div className="min-h-screen bg-[#f5f8f7] py-5 sm:py-8">
      <div className="mx-auto max-w-4xl px-4 sm:px-6">
        <motion.div className="mb-6 rounded-2xl bg-[#245f63] px-5 py-7 text-white sm:px-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#cbf492]">Your activity</p>
          <h1 className="mt-2 text-2xl font-bold sm:text-3xl">Notifications</h1>
          <p className="mt-2 text-sm text-white/85 sm:text-base">Booking updates and reminders for your upcoming trips.</p>
        </motion.div>
        
        {/* Filter Tabs */}
        <div className="mb-5 flex flex-wrap gap-2">
          {(['all', 'unread', 'read'] as const).map((filter) => (
            <motion.button
              key={filter} aria-pressed={activeFilter === filter}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setActiveFilter(filter)}
              className={`px-4 py-2 rounded-full text-sm font-medium ${
                activeFilter === filter
                  ? 'bg-[#348086] text-white'
                  : 'bg-white text-gray-600 border border-[#dce9e5] hover:bg-[#eef6f1]'
              }`}
            >
              {filter === 'all' && `All (${notifications.length})`}
              {filter === 'unread' && `Unread (${unreadCount})`}
              {filter === 'read' && `Read (${notifications.length - unreadCount})`}
            </motion.button>
          ))}
        </div>

        {/* Mark All as Read */}
        {unreadCount > 0 && (
          <div className="mb-6">
            <button
              onClick={markAllAsRead}
              className="text-sm font-medium text-[#348086] hover:underline"
            >
              Mark all as read
            </button>
          </div>
        )}

        {/* Notifications List */}
        <div className="space-y-4">
          {loading ? <PageState kind="loading" title="Loading your updates" /> : error ? <PageState kind="error" title="Updates unavailable" description={error} action={<Button onClick={() => void fetchNotifications()}>Try again</Button>} /> : filteredNotifications.length === 0 ? <PageState title={activeFilter === 'unread' ? "You're all caught up" : 'No updates here yet'} description="Booking confirmations and upcoming trip reminders will appear here." /> : (
            filteredNotifications.map((notification, index) => (
              <motion.div
                key={notification.id} role="button" tabIndex={0} aria-label={`${notification.title}${notification.isRead ? ' · Read' : ' · Mark as read'}`} onKeyDown={event => { if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); void markAsRead(notification.id); } }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`rounded-2xl border border-[#dce9e5] bg-white p-4 shadow-sm sm:p-5 ${
                  notification.isRead ? 'border-l-4 border-l-gray-300' : 'border-l-4 border-l-[#348086]'
                } hover:shadow-md transition-shadow cursor-pointer`}
                onClick={() => markAsRead(notification.id)}
              >
                <div className="flex items-start">
                  <div className={`shrink-0 w-9 h-9 rounded-lg flex items-center justify-center text-lg ${
                    notification.isRead ? 'bg-gray-100' : 'bg-[#e3f1e9]'
                  }`}>
                    {notification.type === 'tour' ? <MapPin size={18} /> : <CalendarCheck size={18} />}
                  </div>
                  <div className="ml-3 min-w-0 flex-1">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium text-gray-900">{notification.title}</h3>
                        <p className="text-sm leading-6 text-gray-600 mt-1">{notification.message}</p>
                        <span className="text-sm text-gray-500 mt-2 block">{notification.timestamp}</span>
                      </div>
                      {!notification.isRead && (
                        <span className="inline-block h-2 w-2 rounded-full bg-[#348086]"></span>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default NotificationsPage;
