import { useMemo, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import {
  LayoutDashboard,
  CalendarCheck,
  Users,
  Store,
  TrendingUp,
  Settings,
  LogOut,
  Bell,
  ShieldCheck,
  ChevronRight,
  UtensilsCrossed,
  Building2,
  Shirt,
  Camera,
  Flower2,
  MapPin,
  Sparkles,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
} from "lucide-react";

import "./AdminDashboard.css";
import "./AdminSections.css";
import {
  BookingsSection,
  UsersSection,
  VendorsSection,
  RevenueSection,
  SettingsSection,
} from "./AdminSections";

// ─── MOCK DATA ────────────────────────────────────────────────────────────────

const STATS = [
  {
    id: "total-bookings",
    label: "Total Bookings",
    value: "3,847",
    delta: "+12% this month",
    positive: true,
    icon: <CalendarCheck size={22} />,
  },
  {
    id: "total-revenue",
    label: "Total Revenue",
    value: "₹48.6L",
    delta: "+8.4% this month",
    positive: true,
    icon: <TrendingUp size={22} />,
  },
  {
    id: "total-users",
    label: "Registered Users",
    value: "1,204",
    delta: "+34 this week",
    positive: true,
    icon: <Users size={22} />,
  },
  {
    id: "active-vendors",
    label: "Active Vendors",
    value: "186",
    delta: "+3 new today",
    positive: true,
    icon: <Store size={22} />,
  },
  {
    id: "pending-orders",
    label: "Pending Orders",
    value: "47",
    delta: "Requires attention",
    positive: false,
    icon: <Clock size={22} />,
  },
];

const INITIAL_BOOKINGS = [
  {
    id: "BK-9041",
    user: "Arjun Patel",
    service: "Venue",
    serviceIcon: <Building2 size={15} />,
    amount: "₹1,20,000",
    date: "11 May 2026",
    status: "confirmed",
    payment: "Paid",
  },
  {
    id: "BK-9040",
    user: "Meera Singh",
    service: "Food Supply",
    serviceIcon: <UtensilsCrossed size={15} />,
    amount: "₹28,500",
    date: "11 May 2026",
    status: "pending",
    payment: "Pending",
  },
  {
    id: "BK-9039",
    user: "Rahul Verma",
    service: "Photography",
    serviceIcon: <Camera size={15} />,
    amount: "₹45,000",
    date: "10 May 2026",
    status: "confirmed",
    payment: "Paid",
  },
  {
    id: "BK-9038",
    user: "Priya Sharma",
    service: "Fashion Designing",
    serviceIcon: <Shirt size={15} />,
    amount: "₹18,200",
    date: "10 May 2026",
    status: "pending",
    payment: "Pending",
  },
  {
    id: "BK-9037",
    user: "Karan Mehta",
    service: "Makeup",
    serviceIcon: <Sparkles size={15} />,
    amount: "₹9,800",
    date: "10 May 2026",
    status: "cancelled",
    payment: "Refunded",
  },
  {
    id: "BK-9036",
    user: "Divya Nair",
    service: "Decoration",
    serviceIcon: <Flower2 size={15} />,
    amount: "₹32,000",
    date: "09 May 2026",
    status: "confirmed",
    payment: "Paid",
  },
  {
    id: "BK-9035",
    user: "Aditya Roy",
    service: "Tourist Places",
    serviceIcon: <MapPin size={15} />,
    amount: "₹14,600",
    date: "09 May 2026",
    status: "pending",
    payment: "Pending",
  },
];

const REVENUE_BARS = [
  { month: "Oct", value: 58 },
  { month: "Nov", value: 74 },
  { month: "Dec", value: 91 },
  { month: "Jan", value: 68 },
  { month: "Feb", value: 82 },
  { month: "Mar", value: 96 },
  { month: "Apr", value: 78 },
  { month: "May", value: 63 },
];

const SERVICE_BREAKDOWN = [
  { label: "Venue",       pct: 32, icon: <Building2 size={14} />,      color: "#d4af37" },
  { label: "Food Supply", pct: 22, icon: <UtensilsCrossed size={14} />, color: "#c9a227" },
  { label: "Photography", pct: 16, icon: <Camera size={14} />,          color: "#b8911e" },
  { label: "Decoration",  pct: 13, icon: <Flower2 size={14} />,         color: "#a07c15" },
  { label: "Fashion",     pct: 9,  icon: <Shirt size={14} />,           color: "#8a680d" },
  { label: "Others",      pct: 8,  icon: <Sparkles size={14} />,        color: "#725507" },
];

const TOP_VENDORS = [
  { name: "The Grand Palace Hotels", service: "Venue",       rating: 4.9, bookings: 312 },
  { name: "Royal Feast Caterers",    service: "Food Supply", rating: 4.8, bookings: 248 },
  { name: "Lens & Light Studio",     service: "Photography", rating: 4.7, bookings: 196 },
  { name: "Bloom & Petal Decor",     service: "Decoration",  rating: 4.7, bookings: 178 },
  { name: "Glamour Touch Makeup",    service: "Makeup",      rating: 4.6, bookings: 154 },
];

const SIDEBAR_ITEMS = [
  { id: "overview",  label: "Overview",  icon: <LayoutDashboard size={18} />, section: "overview"  },
  { id: "bookings",  label: "Bookings",  icon: <CalendarCheck size={18} />,   section: "bookings"  },
  { id: "users",     label: "Users",     icon: <Users size={18} />,           section: "users"     },
  { id: "vendors",   label: "Vendors",   icon: <Store size={18} />,           section: "vendors"   },
  { id: "revenue",   label: "Revenue",   icon: <TrendingUp size={18} />,      section: "revenue"   },
  { id: "settings",  label: "Settings",  icon: <Settings size={18} />,        section: "settings"  },
];

const INIT_NOTIFICATIONS = [
  { id: 1, message: "New booking BK-9041 confirmed for Arjun Patel", time: "2m ago",  read: false },
  { id: 2, message: "Vendor 'Royal Feast Caterers' requested activation",             time: "10m ago", read: false },
  { id: 3, message: "Revenue report for April 2026 is ready",                         time: "30m ago", read: true  },
  { id: 4, message: "3 new users registered this week",                               time: "1h ago",  read: true  },
];

// ─── STATUS BADGE ─────────────────────────────────────────────────────────────

function StatusBadge({ status }) {
  const cfg = {
    confirmed: { icon: <CheckCircle2 size={13} />, label: "Confirmed", cls: "status-confirmed" },
    pending:   { icon: <AlertCircle size={13} />,  label: "Pending",   cls: "status-pending"   },
    cancelled: { icon: <XCircle size={13} />,      label: "Cancelled", cls: "status-cancelled" },
  };
  const { icon, label, cls } = cfg[status] ?? cfg.pending;
  return (
    <span className={`status-badge ${cls}`}>
      {icon}
      {label}
    </span>
  );
}

// ─── BOOKING DETAIL MODAL ─────────────────────────────────────────────────────

function BookingModal({ booking, onClose, onStatusChange }) {
  if (!booking) return null;

  const isPending   = booking.status === "pending";
  const isConfirmed = booking.status === "confirmed";

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose} aria-label="Close modal">✕</button>

        <p className="modal-title">Booking Details</p>
        <p className="modal-id">#{booking.id}</p>

        <div className="modal-grid">
          <div className="modal-field"><span>Customer</span><strong>{booking.user}</strong></div>
          <div className="modal-field"><span>Service</span><strong>{booking.service}</strong></div>
          <div className="modal-field"><span>Amount</span><strong>{booking.amount}</strong></div>
          <div className="modal-field"><span>Date</span><strong>{booking.date}</strong></div>
          <div className="modal-field">
            <span>Status</span>
            <strong><StatusBadge status={booking.status} /></strong>
          </div>
          <div className="modal-field"><span>Payment</span><strong>{booking.payment}</strong></div>
        </div>

        <div className="modal-actions">
          {isPending && (
            <>
              <button className="approve-btn" onClick={() => onStatusChange(booking.id, "confirmed")}>
                ✓ Approve
              </button>
              <button className="reject-btn" onClick={() => onStatusChange(booking.id, "cancelled")}>
                ✕ Reject
              </button>
            </>
          )}
          {isConfirmed && (
            <button className="reject-btn" onClick={() => onStatusChange(booking.id, "cancelled")}>
              Cancel Booking
            </button>
          )}
          {booking.status === "cancelled" && (
            <button className="approve-btn" onClick={() => onStatusChange(booking.id, "confirmed")}>
              Reinstate
            </button>
          )}
          <button className="view-btn" onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  );
}

// ─── NOTIFICATION DROPDOWN ────────────────────────────────────────────────────

function NotificationDropdown({ notifications, onClear, onMarkRead }) {
  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <div className="notif-dropdown" onClick={(e) => e.stopPropagation()}>
      <div className="notif-header">
        <span>
          Notifications
          {unreadCount > 0 && (
            <span className="notif-count">{unreadCount}</span>
          )}
        </span>
        <div className="notif-header-actions">
          {unreadCount > 0 && (
            <button className="notif-mark-read" type="button" onClick={onMarkRead}>
              Mark all read
            </button>
          )}
          <button className="notif-clear" type="button" onClick={onClear}>
            Clear
          </button>
        </div>
      </div>
      <ul className="notif-list">
        {notifications.length === 0 && (
          <li className="notif-empty">🔔 No new notifications</li>
        )}
        {notifications.map((n) => (
          <li key={n.id} className={`notif-item ${n.read ? "" : "unread"}`}>
            <div className="notif-msg">{n.message}</div>
            <div className="notif-time">{n.time}</div>
          </li>
        ))}
      </ul>
    </div>
  );
}

// ─── OVERVIEW SECTION (inline) ────────────────────────────────────────────────

function OverviewSection({ bookings, setBookings, setActiveSection, navigate }) {
  const [bookingFilter, setBookingFilter] = useState("all");
  const [selectedBooking, setSelectedBooking] = useState(null);

  const filteredBookings = useMemo(() => {
    if (bookingFilter === "all") return bookings;
    return bookings.filter((b) => b.status === bookingFilter);
  }, [bookings, bookingFilter]);

  const updateStatus = (id, newStatus) => {
    setBookings((prev) =>
      prev.map((b) => (b.id === id ? { ...b, status: newStatus } : b))
    );
    setSelectedBooking((prev) =>
      prev && prev.id === id ? { ...prev, status: newStatus } : prev
    );
  };

  return (
    <>
      {/* STAT CARDS */}
      <div className="admin-stats-grid">
        {STATS.map((stat) => (
          <div key={stat.id} className="admin-stat-card" id={`stat-${stat.id}`}>
            <div className="stat-icon">{stat.icon}</div>
            <div className="stat-body">
              <p className="stat-label">{stat.label}</p>
              <h3 className="stat-value">{stat.value}</h3>
              <p className={`stat-delta ${stat.positive ? "delta-up" : "delta-down"}`}>
                {stat.delta}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* CHARTS ROW */}
      <div className="admin-charts-row">
        <div className="admin-card chart-card" id="revenue-chart">
          <div className="admin-card-header">
            <h3>Monthly Revenue</h3>
            <span className="card-tag">Last 8 Months</span>
          </div>
          <div className="bar-chart">
            {REVENUE_BARS.map((bar) => (
              <div key={bar.month} className="bar-col">
                <div
                  className="bar-fill"
                  style={{ height: `${bar.value}%` }}
                  title={`${bar.month}: ${bar.value}%`}
                />
                <span className="bar-label">{bar.month}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="admin-card breakdown-card" id="service-breakdown">
          <div className="admin-card-header">
            <h3>Revenue by Service</h3>
            <span className="card-tag">This Year</span>
          </div>
          <div className="breakdown-list">
            {SERVICE_BREAKDOWN.map((item) => (
              <div key={item.label} className="breakdown-row">
                <div className="breakdown-label">
                  <span className="breakdown-icon" style={{ color: item.color }}>
                    {item.icon}
                  </span>
                  <span>{item.label}</span>
                </div>
                <div className="breakdown-bar-wrap">
                  <div
                    className="breakdown-bar-fill"
                    style={{ width: `${item.pct}%`, background: item.color }}
                  />
                </div>
                <span className="breakdown-pct">{item.pct}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* RECENT BOOKINGS TABLE */}
      <div className="admin-card bookings-card" id="recent-bookings">
        <div className="admin-card-header">
          <h3>Recent Bookings</h3>
          <div className="filter-pills">
            {["all", "confirmed", "pending", "cancelled"].map((f) => (
              <button
                key={f}
                id={`filter-${f}`}
                className={`filter-pill ${bookingFilter === f ? "active" : ""}`}
                onClick={() => setBookingFilter(f)}
                type="button"
              >
                {f.charAt(0).toUpperCase() + f.slice(1)}
              </button>
            ))}
          </div>
        </div>
        <div className="bookings-table-wrap">
          <table className="bookings-table">
            <thead>
              <tr>
                <th>Booking ID</th>
                <th>User</th>
                <th>Service</th>
                <th>Amount</th>
                <th>Date</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredBookings.map((bk) => (
                <tr key={bk.id}>
                  <td className="booking-id">{bk.id}</td>
                  <td>{bk.user}</td>
                  <td>
                    <span className="service-tag">
                      {bk.serviceIcon}
                      {bk.service}
                    </span>
                  </td>
                  <td className="amount-col">{bk.amount}</td>
                  <td className="date-col">{bk.date}</td>
                  <td>
                    <StatusBadge status={bk.status} />
                  </td>
                  <td>
                    <div className="action-btns">
                      {bk.status === "pending" && (
                        <>
                          <button
                            className="approve-btn"
                            type="button"
                            onClick={() => updateStatus(bk.id, "confirmed")}
                          >
                            Approve
                          </button>
                          <button
                            className="reject-btn"
                            type="button"
                            onClick={() => updateStatus(bk.id, "cancelled")}
                          >
                            Reject
                          </button>
                        </>
                      )}
                      <button
                        className="view-btn"
                        id={`view-booking-${bk.id}`}
                        type="button"
                        onClick={() => setSelectedBooking(bk)}
                      >
                        View
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* BOTTOM ROW: Top Vendors + Quick Actions */}
      <div className="admin-bottom-row">
        <div className="admin-card vendors-card" id="top-vendors">
          <div className="admin-card-header">
            <h3>Top Vendors</h3>
            <span className="card-tag">By Bookings</span>
          </div>
          <ol className="vendors-list">
            {TOP_VENDORS.map((v, i) => (
              <li key={v.name} className="vendor-row">
                <span className="vendor-rank">#{i + 1}</span>
                <div className="vendor-info">
                  <p className="vendor-name">{v.name}</p>
                  <p className="vendor-service">{v.service}</p>
                </div>
                <div className="vendor-meta">
                  <span className="vendor-rating">★ {v.rating}</span>
                  <span className="vendor-bk">{v.bookings} bookings</span>
                </div>
              </li>
            ))}
          </ol>
        </div>

        <div className="admin-card quick-actions-card" id="quick-actions">
          <div className="admin-card-header">
            <h3>Quick Actions</h3>
          </div>
          <div className="quick-actions-grid">
            <button className="qa-btn" id="qa-manage-vendors" type="button" onClick={() => setActiveSection("vendors")}>
              <Store size={20} />
              Manage Vendors
            </button>
            <button className="qa-btn" id="qa-view-users" type="button" onClick={() => setActiveSection("users")}>
              <Users size={20} />
              View Users
            </button>
            <button className="qa-btn" id="qa-all-bookings" type="button" onClick={() => setActiveSection("bookings")}>
              <CalendarCheck size={20} />
              All Bookings
            </button>
            <button className="qa-btn" id="qa-revenue-report" type="button" onClick={() => setActiveSection("revenue")}>
              <TrendingUp size={20} />
              Revenue Report
            </button>
            <button className="qa-btn" id="qa-settings" type="button" onClick={() => setActiveSection("settings")}>
              <Settings size={20} />
              Settings
            </button>
            <button className="qa-btn qa-user-dash" id="qa-user-dashboard" type="button" onClick={() => navigate("/user/dashboard")}>
              <LayoutDashboard size={20} />
              User Dashboard
            </button>
          </div>
          <div className="satisfaction-block">
            <div className="sat-label">
              <span>Platform Satisfaction</span>
              <span className="sat-pct">91%</span>
            </div>
            <div className="sat-bar-wrap">
              <div className="sat-bar-fill" style={{ width: "91%" }} />
            </div>
          </div>
        </div>
      </div>

      {/* BOOKING DETAIL MODAL */}
      {selectedBooking && (
        <BookingModal
          booking={selectedBooking}
          onClose={() => setSelectedBooking(null)}
          onStatusChange={(id, status) => {
            updateStatus(id, status);
            setSelectedBooking((prev) => ({ ...prev, status }));
          }}
        />
      )}
    </>
  );
}

// ─── MAIN COMPONENT ───────────────────────────────────────────────────────────

function AdminDashboard() {
  const navigate = useNavigate();

  // ── Core nav state ────────────────────────────────────────────────────────
  const [activeSection, setActiveSection] = useState("overview");

  // ── Shared bookings state (used by overview + bookings section) ───────────
  const [bookings, setBookings] = useState(INITIAL_BOOKINGS);

  // ── Notification state ────────────────────────────────────────────────────
  const [showNotif, setShowNotif]       = useState(false);
  const [notifications, setNotifications] = useState(INIT_NOTIFICATIONS);

  const unreadCount = notifications.filter((n) => !n.read).length;

  // Close notifications when clicking outside
  useEffect(() => {
    if (!showNotif) return;
    const handler = (e) => {
      if (
        !e.target.closest(".notif-dropdown") &&
        !e.target.closest("#admin-notif-btn")
      ) {
        setShowNotif(false);
      }
    };
    document.addEventListener("click", handler);
    return () => document.removeEventListener("click", handler);
  }, [showNotif]);

  const pendingStat = STATS.find((s) => s.id === "pending-orders");

  const handleMarkAllRead = () =>
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));

  const handleClearNotif = () => setNotifications([]);

  // ─── JSX ──────────────────────────────────────────────────────────────────
  return (
    <div className="admin-dash-page">

      {/* ═══════════════ SIDEBAR ═══════════════ */}
      <aside className="admin-dash-sidebar">

        {/* Brand */}
        <div
          className="admin-sidebar-brand"
          role="button"
          tabIndex={0}
          onClick={() => setActiveSection("overview")}
          onKeyDown={(e) => { if (e.key === "Enter") setActiveSection("overview"); }}
          aria-label="Go to overview"
        >
          <h1>Infinity</h1>
          <p>Admin Panel</p>
        </div>

        {/* Nav links */}
        <nav className="admin-sidebar-menu" aria-label="Admin sidebar">
          {SIDEBAR_ITEMS.map((item) => (
            <button
              key={item.id}
              id={`admin-nav-${item.id}`}
              className={`admin-sidebar-link ${activeSection === item.section ? "active" : ""}`}
              onClick={() => setActiveSection(item.section)}
              type="button"
            >
              <span>{item.icon}</span>
              {item.label}
              {activeSection === item.section && (
                <ChevronRight size={14} className="active-chevron" />
              )}
            </button>
          ))}
        </nav>

        {/* User Dashboard shortcut */}
        <button
          className="admin-sidebar-link user-dash-link"
          id="go-to-user-dash-btn"
          onClick={() => navigate("/user/dashboard")}
          type="button"
        >
          <span><Users size={18} /></span>
          User Dashboard
        </button>

        {/* Logout */}
        <button
          className="admin-sidebar-link admin-logout-link"
          id="admin-logout-btn"
          onClick={() => navigate("/")}
          type="button"
        >
          <span><LogOut size={18} /></span>
          Logout
        </button>
      </aside>

      {/* ═══════════════ MAIN ═══════════════ */}
      <main className="admin-dash-main">

        {/* ── TOPBAR ── */}
        <header className="admin-dash-topbar">
          <div className="topbar-left">
            <h2>
              {SIDEBAR_ITEMS.find((s) => s.section === activeSection)?.label ?? "Dashboard"}
            </h2>
            {pendingStat && (
              <span className="topbar-pending-pill">
                <AlertCircle size={13} />
                {pendingStat.value} pending
              </span>
            )}
          </div>

          <div className="admin-topbar-right">
            {/* Notification bell */}
            <div className="notif-wrapper">
              <button
                className="admin-notif-btn"
                type="button"
                aria-label="Notifications"
                id="admin-notif-btn"
                onClick={() => setShowNotif((v) => !v)}
              >
                <Bell size={21} />
                {unreadCount > 0 && <span className="notif-dot" />}
              </button>

              {showNotif && (
                <NotificationDropdown
                  notifications={notifications}
                  onClear={handleClearNotif}
                  onMarkRead={handleMarkAllRead}
                />
              )}
            </div>

            <div className="admin-avatar" aria-label="Admin profile">
              <ShieldCheck size={22} />
            </div>
          </div>
        </header>

        {/* ── CONTENT ── */}
        <section className="admin-dash-content">

          {activeSection === "overview" && (
            <OverviewSection
              bookings={bookings}
              setBookings={setBookings}
              setActiveSection={setActiveSection}
              navigate={navigate}
            />
          )}

          {activeSection === "bookings" && <BookingsSection />}
          {activeSection === "users"    && <UsersSection />}
          {activeSection === "vendors"  && <VendorsSection />}
          {activeSection === "revenue"  && <RevenueSection />}
          {activeSection === "settings" && <SettingsSection />}

        </section>
      </main>
    </div>
  );
}

export default AdminDashboard;
//gygjnuhbuhb