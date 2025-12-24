import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
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
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    setLoading(true);
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
      setNotifications([]);
    } finally {
      setLoading(false);
    }
  };

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

  const getNotificationIcon = (type: Notification['type']) => {
    const icons = {
      booking: '✓',
      review: '★',
      message: '💬',
      tour: '📍',
      guide: '👤',
      post: '❤️',
      offer: '🎁'
    };
    return icons[type] || '🔔';
  };

  const filteredNotifications = notifications.filter(notif => {
    if (activeFilter === 'unread') return !notif.isRead;
    if (activeFilter === 'read') return notif.isRead;
    return true;
  });

  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <motion.h1 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl font-bold text-gray-800 mb-2"
        >
          Notifications
        </motion.h1>
        <p className="text-gray-600 mb-8">Stay updated with your bookings, messages, and activities</p>
        
        {/* Filter Tabs */}
        <div className="flex space-x-4 mb-6">
          {(['all', 'unread', 'read'] as const).map((filter) => (
            <motion.button
              key={filter}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setActiveFilter(filter)}
              className={`px-4 py-2 rounded-full text-sm font-medium ${
                activeFilter === filter
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-600 border border-gray-300 hover:bg-gray-50'
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
              className="text-blue-600 hover:text-blue-800 text-sm font-medium"
            >
              Mark all as read
            </button>
          </div>
        )}

        {/* Notifications List */}
        <div className="space-y-4">
          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <p className="mt-2 text-gray-600">Loading notifications...</p>
            </div>
          ) : filteredNotifications.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-lg shadow">
              <p className="text-gray-600">No notifications found</p>
            </div>
          ) : (
            filteredNotifications.map((notification, index) => (
              <motion.div
                key={notification.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`bg-white rounded-lg shadow p-6 border-l-4 ${
                  notification.isRead ? 'border-gray-300' : 'border-blue-500'
                } hover:shadow-md transition-shadow cursor-pointer`}
                onClick={() => markAsRead(notification.id)}
              >
                <div className="flex items-start">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center text-lg ${
                    notification.isRead ? 'bg-gray-100' : 'bg-blue-100'
                  }`}>
                    {getNotificationIcon(notification.type)}
                  </div>
                  <div className="ml-4 flex-1">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium text-gray-900">{notification.title}</h3>
                        <p className="text-gray-600 mt-1">{notification.message}</p>
                        <span className="text-sm text-gray-500 mt-2 block">{notification.timestamp}</span>
                      </div>
                      {!notification.isRead && (
                        <span className="inline-block w-2 h-2 bg-blue-600 rounded-full"></span>
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