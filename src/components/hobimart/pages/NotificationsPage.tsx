'use client';

import { useState, useMemo, useEffect } from 'react';
import {
  Bell,
  BellOff,
  CheckCheck,
  ChevronRight,
  Package,
  Tag,
  Heart,
  RefreshCw,
  MessageCircle,
  Users,
} from 'lucide-react';
import { notifications as initialNotifications } from '@/lib/data';
import type { Notification } from '@/lib/data';
import { useAppStore } from '@/lib/store';
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
  BreadcrumbPage,
} from '@/components/ui/breadcrumb';

/* ── Emoji & color mapping per notification type ── */
const typeConfig: Record<
  Notification['type'],
  { emoji: string; bg: string; icon: React.ElementType }
> = {
  order: { emoji: '📦', bg: 'bg-orange-100', icon: Package },
  price: { emoji: '🏷️', bg: 'bg-emerald-100', icon: Tag },
  wishlist: { emoji: '♡', bg: 'bg-red-100', icon: Heart },
  trade: { emoji: '🔄', bg: 'bg-teal-100', icon: RefreshCw },
  message: { emoji: '💬', bg: 'bg-blue-100', icon: MessageCircle },
  community: { emoji: '👥', bg: 'bg-purple-100', icon: Users },
};

/* ── Helper: group notifications by time period ── */
function groupNotifications(items: Notification[]) {
  const today: Notification[] = [];
  const yesterday: Notification[] = [];
  const earlier: Notification[] = [];

  items.forEach((n) => {
    const time = n.time.toLowerCase();
    if (time.includes('hour') || time === 'just now' || time.includes('min')) {
      today.push(n);
    } else if (time.includes('day ago') && !time.startsWith('2') && !time.startsWith('3') && !time.startsWith('4') && !time.startsWith('5') && !time.startsWith('6') && !time.startsWith('7')) {
      today.push(n);
    } else if (
      time === '1 day ago' ||
      (time.includes('day ago') &&
        parseInt(time) >= 2 &&
        parseInt(time) <= 2)
    ) {
      yesterday.push(n);
    } else {
      earlier.push(n);
    }
  });

  return { today, yesterday, earlier };
}

export default function NotificationsPage() {
  const { navigate, notifications, unreadCount, fetchNotifications, markAllNotificationsRead, markNotificationRead } = useAppStore();

  useEffect(() => { fetchNotifications(); }, [fetchNotifications]);

  const markAllRead = () => { markAllNotificationsRead(); };

  const markSingleRead = (id: string) => {
    markNotificationRead(parseInt(id));
  };

  const { today, yesterday, earlier } = useMemo(
    () => groupNotifications(notifications),
    [notifications],
  );

  const hasUnread = unreadCount > 0;

  /* ── Render a notification item ── */
  const renderNotification = (notification: Notification) => {
    const config = typeConfig[notification.type];
    return (
      <button
        key={notification.id}
        onClick={() => markSingleRead(notification.id)}
        className={`w-full text-left flex items-start gap-3.5 p-4 rounded-xl transition-all duration-200 group ${
          notification.read
            ? 'bg-white hover:bg-gray-50'
            : 'bg-[#FFF7ED] border border-[#FF6B35]/10 hover:border-[#FF6B35]/20'
        }`}
      >
        {/* Icon circle with emoji */}
        <div
          className={`w-10 h-10 rounded-full ${config.bg} flex items-center justify-center flex-shrink-0 text-lg`}
        >
          {config.emoji}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h4
              className={`text-sm font-semibold truncate ${
                notification.read ? 'text-[#1F2937]' : 'text-[#1F2937]'
              }`}
            >
              {notification.title}
            </h4>
            {!notification.read && (
              <span className="w-2 h-2 rounded-full bg-[#FF6B35] flex-shrink-0" />
            )}
          </div>
          <p
            className={`text-xs mt-0.5 line-clamp-1 ${
              notification.read ? 'text-gray-400' : 'text-gray-500'
            }`}
          >
            {notification.description}
          </p>
          <span className="text-[11px] text-gray-300 mt-1 block">
            {notification.time}
          </span>
        </div>

        {/* Chevron */}
        <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-[#FF6B35] transition-colors flex-shrink-0 mt-2.5" />
      </button>
    );
  };

  /* ── Render a section ── */
  const renderSection = (
    label: string,
    items: Notification[],
  ) => {
    if (items.length === 0) return null;
    return (
      <div className="space-y-2">
        <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400 px-1">
          {label}
        </h3>
        <div className="space-y-2">{items.map(renderNotification)}</div>
      </div>
    );
  };

  /* ── Empty State (all read) ── */
  if (!hasUnread && notificationsList.length > 0) {
    return (
      <div className="min-h-screen bg-[#F8FAFC]">
        {/* Breadcrumb */}
        <div className="bg-white border-b border-[#E5E7EB]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink
                    onClick={() => navigate('home')}
                    className="cursor-pointer text-[#64748B] hover:text-[#FF6B35] transition-colors"
                  >
                    Home
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="text-[#E5E7EB]" />
                <BreadcrumbItem>
                  <BreadcrumbPage className="text-[#111827] font-semibold">
                    Notifications
                  </BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-10">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2.5">
              <h1 className="text-2xl sm:text-3xl font-bold text-[#1F2937]">
                <span className="text-[#FF6B35]">🔔</span> Notifications
              </h1>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-[#E5E7EB] py-16 text-center">
            <div className="w-20 h-20 rounded-full bg-green-50 flex items-center justify-center mx-auto mb-5">
              <BellOff className="w-10 h-10 text-green-300" />
            </div>
            <h3 className="text-lg font-bold text-[#1F2937]">
              You&apos;re all caught up!
            </h3>
            <p className="text-sm text-gray-400 mt-1.5 max-w-sm mx-auto">
              No new notifications. Check back later for updates on your orders,
              wishlist, and community activity.
            </p>
          </div>

          {/* Still show read notifications below */}
          <div className="mt-8 space-y-6">
            <div className="flex items-center gap-2 px-1">
              <span className="text-sm font-semibold text-[#1F2937]">
                Recent
              </span>
              <span className="text-xs text-gray-400">
                {notificationsList.length} notifications
              </span>
            </div>
            {renderSection('Today', today)}
            {renderSection('Yesterday', yesterday)}
            {renderSection('Earlier', earlier)}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      {/* Breadcrumb */}
      <div className="bg-white border-b border-[#E5E7EB]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink
                  onClick={() => navigate('home')}
                  className="cursor-pointer text-[#64748B] hover:text-[#FF6B35] transition-colors"
                >
                  Home
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="text-[#E5E7EB]" />
              <BreadcrumbItem>
                <BreadcrumbPage className="text-[#111827] font-semibold">
                  Notifications
                </BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-10">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl sm:text-3xl font-bold text-[#1F2937]">
              <span className="text-[#FF6B35]">🔔</span> Notifications
            </h1>
            {hasUnread && (
              <span className="inline-flex items-center justify-center min-w-[24px] h-6 px-2 rounded-full bg-[#FF6B35] text-white text-xs font-bold">
                {unreadCount}
              </span>
            )}
          </div>

          {hasUnread && (
            <button
              onClick={markAllRead}
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-[#FF6B35] bg-[#FF6B35]/10 rounded-xl hover:bg-[#FF6B35]/20 transition-colors"
            >
              <CheckCheck className="w-3.5 h-3.5" />
              Mark all as read
            </button>
          )}
        </div>

        {/* Notification sections */}
        <div className="bg-white rounded-2xl border border-[#E5E7EB] p-4 sm:p-5">
          <div className="space-y-6">
            {renderSection('Today', today)}
            {renderSection('Yesterday', yesterday)}
            {renderSection('Earlier', earlier)}
          </div>
        </div>
      </div>
    </div>
  );
}
