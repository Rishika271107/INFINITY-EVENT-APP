import { useState } from "react";
import {
  CalendarCheck, Users, Store, TrendingUp, Settings,
  CheckCircle2, XCircle, AlertCircle, Building2,
  UtensilsCrossed, Camera, Flower2, Shirt, Sparkles, MapPin,
  Mail, Phone, MapPinIcon, Save, Bell, Shield,
} from "lucide-react";

function StatusBadge({ status }) {
  const m = {
    confirmed: ["status-confirmed","Confirmed"],
    pending: ["status-pending","Pending"],
    cancelled: ["status-cancelled","Cancelled"],
    active: ["status-confirmed","Active"],
    inactive: ["status-pending","Inactive"],
    suspended: ["status-cancelled","Suspended"],
  };
  const [cls, lbl] = m[status] || m.pending;
  return <span className={`status-badge ${cls}`}>{lbl}</span>;
}

// ── BOOKINGS ─────────────────────────────────────────
const INIT_BOOKINGS = [
  { id:"BK-9041", user:"Arjun Patel", service:"Venue", icon:<Building2 size={14}/>, amount:"₹1,20,000", date:"11 May 2026", status:"confirmed" },
  { id:"BK-9040", user:"Meera Singh", service:"Food Supply", icon:<UtensilsCrossed size={14}/>, amount:"₹28,500", date:"11 May 2026", status:"pending" },
  { id:"BK-9039", user:"Rahul Verma", service:"Photography", icon:<Camera size={14}/>, amount:"₹45,000", date:"10 May 2026", status:"confirmed" },
  { id:"BK-9038", user:"Priya Sharma", service:"Fashion", icon:<Shirt size={14}/>, amount:"₹18,200", date:"10 May 2026", status:"pending" },
  { id:"BK-9037", user:"Karan Mehta", service:"Makeup", icon:<Sparkles size={14}/>, amount:"₹9,800", date:"10 May 2026", status:"cancelled" },
  { id:"BK-9036", user:"Divya Nair", service:"Decoration", icon:<Flower2 size={14}/>, amount:"₹32,000", date:"09 May 2026", status:"confirmed" },
  { id:"BK-9035", user:"Aditya Roy", service:"Tourist", icon:<MapPin size={14}/>, amount:"₹14,600", date:"09 May 2026", status:"pending" },
  { id:"BK-9034", user:"Sneha Gupta", service:"Venue", icon:<Building2 size={14}/>, amount:"₹95,000", date:"08 May 2026", status:"confirmed" },
  { id:"BK-9033", user:"Vikram Joshi", service:"Food Supply", icon:<UtensilsCrossed size={14}/>, amount:"₹42,000", date:"08 May 2026", status:"confirmed" },
  { id:"BK-9032", user:"Ananya Das", service:"Photography", icon:<Camera size={14}/>, amount:"₹38,000", date:"07 May 2026", status:"pending" },
  { id:"BK-9031", user:"Rohan Pillai", service:"Decoration", icon:<Flower2 size={14}/>, amount:"₹27,500", date:"07 May 2026", status:"cancelled" },
  { id:"BK-9030", user:"Isha Kapoor", service:"Makeup", icon:<Sparkles size={14}/>, amount:"₹12,400", date:"06 May 2026", status:"confirmed" },
];

export function BookingsSection() {
  const [bookings, setBookings] = useState(INIT_BOOKINGS.map(b => ({ ...b })));
  const [filter, setFilter] = useState("all");
  const [svcFilter, setSvcFilter] = useState("all");
  const [viewing, setViewing] = useState(null);
  const list = bookings.filter(b =>
    (filter === "all" || b.status === filter) &&
    (svcFilter === "all" || b.service === svcFilter)
  );
  const services = ["all",...new Set(bookings.map(b=>b.service))];

  const updateStatus = (id, newStatus) => {
    setBookings(prev => prev.map(b => b.id === id ? { ...b, status: newStatus } : b));
    if (viewing && viewing.id === id) setViewing(prev => ({ ...prev, status: newStatus }));
  };

  const openView = (b) => setViewing({ ...b });
  const closeView = () => setViewing(null);

  return (
    <div className="admin-section">
      <div className="section-header">
        <h2 className="section-title">All Bookings</h2>
        <p className="section-subtitle">Manage and track all platform bookings</p>
      </div>
      <div className="section-filters">
        <div className="filter-group">
          <label>Status:</label>
          <div className="filter-pills">
            {["all","confirmed","pending","cancelled"].map(f=>(
              <button key={f} className={`filter-pill ${filter===f?"active":""}`}
                onClick={()=>setFilter(f)} type="button">
                {f.charAt(0).toUpperCase()+f.slice(1)}
              </button>
            ))}
          </div>
        </div>
        <div className="filter-group">
          <label>Service:</label>
          <div className="filter-pills">
            {services.map(s=>(
              <button key={s} className={`filter-pill ${svcFilter===s?"active":""}`}
                onClick={()=>setSvcFilter(s)} type="button">
                {s==="all"?"All":s}
              </button>
            ))}
          </div>
        </div>
      </div>
      <div className="admin-card"><div className="bookings-table-wrap">
        <table className="bookings-table">
          <thead><tr>
            <th>ID</th><th>User</th><th>Service</th><th>Amount</th><th>Date</th><th>Status</th><th>Actions</th>
          </tr></thead>
          <tbody>{list.map(b=>(
            <tr key={b.id}>
              <td className="booking-id">{b.id}</td>
              <td>{b.user}</td>
              <td><span className="service-tag">{b.icon}{b.service}</span></td>
              <td className="amount-col">{b.amount}</td>
              <td className="date-col">{b.date}</td>
              <td><StatusBadge status={b.status}/></td>
              <td className="action-btns">
                {b.status==="pending" && <>
                  <button className="approve-btn" type="button" onClick={()=>updateStatus(b.id,"confirmed")}>Approve</button>
                  <button className="reject-btn" type="button" onClick={()=>updateStatus(b.id,"cancelled")}>Reject</button>
                </>}
                {b.status!=="pending" && <button className="view-btn" type="button" onClick={()=>openView(b)}>View</button>}
              </td>
            </tr>
          ))}</tbody>
        </table>
      </div></div>
      <div className="section-summary-row">
        <div className="summary-chip"><span>Total:</span><strong>{bookings.length}</strong></div>
        <div className="summary-chip confirmed"><span>Confirmed:</span><strong>{bookings.filter(b=>b.status==="confirmed").length}</strong></div>
        <div className="summary-chip pending"><span>Pending:</span><strong>{bookings.filter(b=>b.status==="pending").length}</strong></div>
        <div className="summary-chip cancelled"><span>Cancelled:</span><strong>{bookings.filter(b=>b.status==="cancelled").length}</strong></div>
      </div>

      {/* ── BOOKING DETAIL MODAL ── */}
      {viewing && (
        <div className="modal-overlay" onClick={closeView}>
          <div className="modal-card" onClick={e=>e.stopPropagation()}>
            <button className="modal-close" type="button" onClick={closeView}>✕</button>
            <h3 className="modal-title">Booking Details</h3>
            <div className="modal-id">{viewing.id}</div>
            <div className="modal-grid">
              <div className="modal-field"><span>Customer</span><strong>{viewing.user}</strong></div>
              <div className="modal-field"><span>Service</span><strong>{viewing.service}</strong></div>
              <div className="modal-field"><span>Amount</span><strong>{viewing.amount}</strong></div>
              <div className="modal-field"><span>Date</span><strong>{viewing.date}</strong></div>
              <div className="modal-field"><span>Status</span><StatusBadge status={viewing.status}/></div>
              <div className="modal-field"><span>Payment</span><strong>{viewing.status==="confirmed"?"Paid":"Unpaid"}</strong></div>
            </div>
            <div className="modal-actions">
              {viewing.status==="confirmed" && (
                <button className="reject-btn" type="button" onClick={()=>{updateStatus(viewing.id,"cancelled");closeView();}}>Cancel Booking</button>
              )}
              {viewing.status==="cancelled" && (
                <button className="approve-btn" type="button" onClick={()=>{updateStatus(viewing.id,"confirmed");closeView();}}>Reinstate</button>
              )}
              <button className="view-btn" type="button" onClick={closeView}>Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ── USERS ────────────────────────────────────────────
const USERS_DATA = [
  { name:"Arjun Patel", email:"arjun@example.com", city:"Mumbai", bookings:12, joined:"Jan 2025", status:"active" },
  { name:"Meera Singh", email:"meera@example.com", city:"Delhi", bookings:8, joined:"Mar 2025", status:"active" },
  { name:"Rahul Verma", email:"rahul@example.com", city:"Bangalore", bookings:15, joined:"Dec 2024", status:"active" },
  { name:"Priya Sharma", email:"priya@example.com", city:"Pune", bookings:6, joined:"Jun 2025", status:"active" },
  { name:"Karan Mehta", email:"karan@example.com", city:"Ahmedabad", bookings:3, joined:"Sep 2025", status:"inactive" },
  { name:"Divya Nair", email:"divya@example.com", city:"Kochi", bookings:9, joined:"Feb 2025", status:"active" },
  { name:"Aditya Roy", email:"aditya@example.com", city:"Kolkata", bookings:4, joined:"Jul 2025", status:"active" },
  { name:"Sneha Gupta", email:"sneha@example.com", city:"Jaipur", bookings:11, joined:"Apr 2025", status:"active" },
  { name:"Vikram Joshi", email:"vikram@example.com", city:"Chennai", bookings:2, joined:"Nov 2025", status:"inactive" },
  { name:"Ananya Das", email:"ananya@example.com", city:"Hyderabad", bookings:7, joined:"May 2025", status:"active" },
];

export function UsersSection() {
  const [search, setSearch] = useState("");
  const list = USERS_DATA.filter(u =>
    u.name.toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase()) ||
    u.city.toLowerCase().includes(search.toLowerCase())
  );
  return (
    <div className="admin-section">
      <div className="section-header">
        <h2 className="section-title">User Management</h2>
        <p className="section-subtitle">View and manage all registered users</p>
      </div>
      <div className="section-toolbar">
        <input className="section-search" type="text" placeholder="Search users by name, email or city..."
          value={search} onChange={e=>setSearch(e.target.value)} />
        <div className="toolbar-stats">
          <span className="toolbar-stat"><Users size={14}/>Total: <strong>{USERS_DATA.length}</strong></span>
          <span className="toolbar-stat active-stat">Active: <strong>{USERS_DATA.filter(u=>u.status==="active").length}</strong></span>
        </div>
      </div>
      <div className="admin-card"><div className="bookings-table-wrap">
        <table className="bookings-table">
          <thead><tr><th>Name</th><th>Email</th><th>City</th><th>Bookings</th><th>Joined</th><th>Status</th></tr></thead>
          <tbody>{list.map(u=>(
            <tr key={u.email}>
              <td><strong>{u.name}</strong></td>
              <td className="date-col">{u.email}</td>
              <td>{u.city}</td>
              <td className="amount-col">{u.bookings}</td>
              <td className="date-col">{u.joined}</td>
              <td><StatusBadge status={u.status}/></td>
            </tr>
          ))}</tbody>
        </table>
      </div></div>
    </div>
  );
}

// ── VENDORS ──────────────────────────────────────────
const VENDORS_INIT = [
  { name:"The Grand Palace Hotels", service:"Venue", city:"Mumbai", rating:4.9, bookings:312, status:"active" },
  { name:"Royal Feast Caterers", service:"Food Supply", city:"Delhi", rating:4.8, bookings:248, status:"active" },
  { name:"Lens & Light Studio", service:"Photography", city:"Bangalore", rating:4.7, bookings:196, status:"active" },
  { name:"Bloom & Petal Decor", service:"Decoration", city:"Pune", rating:4.7, bookings:178, status:"active" },
  { name:"Glamour Touch Makeup", service:"Makeup", city:"Mumbai", rating:4.6, bookings:154, status:"active" },
  { name:"Couture Dreams", service:"Fashion", city:"Delhi", rating:4.5, bookings:132, status:"active" },
  { name:"Wanderlust Tours", service:"Tourist", city:"Jaipur", rating:4.4, bookings:98, status:"active" },
  { name:"Elite Venues Co.", service:"Venue", city:"Chennai", rating:4.3, bookings:87, status:"suspended" },
  { name:"Snap Studios", service:"Photography", city:"Hyderabad", rating:4.2, bookings:76, status:"active" },
];

export function VendorsSection() {
  const [vendors, setVendors] = useState(VENDORS_INIT.map(v => ({ ...v })));
  const [search, setSearch] = useState("");
  const list = vendors.filter(v =>
    v.name.toLowerCase().includes(search.toLowerCase()) ||
    v.service.toLowerCase().includes(search.toLowerCase())
  );
  const activateVendor = (name) => {
    setVendors(prev => prev.map(v => v.name === name ? { ...v, status: "active" } : v));
  };
  return (
    <div className="admin-section">
      <div className="section-header">
        <h2 className="section-title">Vendor Management</h2>
        <p className="section-subtitle">Manage all registered service vendors</p>
      </div>
      <div className="section-toolbar">
        <input className="section-search" type="text" placeholder="Search vendors..."
          value={search} onChange={e=>setSearch(e.target.value)} />
        <div className="toolbar-stats">
          <span className="toolbar-stat"><Store size={14}/>Total: <strong>{vendors.length}</strong></span>
          <span className="toolbar-stat active-stat">Active: <strong>{vendors.filter(v=>v.status==="active").length}</strong></span>
        </div>
      </div>
      <div className="admin-card"><div className="bookings-table-wrap">
        <table className="bookings-table">
          <thead><tr><th>Vendor</th><th>Service</th><th>City</th><th>Rating</th><th>Bookings</th><th>Status</th><th>Action</th></tr></thead>
          <tbody>{list.map(v=>(
            <tr key={v.name}>
              <td><strong>{v.name}</strong></td>
              <td><span className="service-tag">{v.service}</span></td>
              <td>{v.city}</td>
              <td className="amount-col">★ {v.rating}</td>
              <td className="amount-col">{v.bookings}</td>
              <td><StatusBadge status={v.status}/></td>
              <td>{v.status==="suspended"
                ? <button className="approve-btn" type="button" onClick={()=>activateVendor(v.name)}>Activate</button>
                : <button className="view-btn" type="button">View</button>}
              </td>
            </tr>
          ))}</tbody>
        </table>
      </div></div>
    </div>
  );
}

// ── REVENUE ──────────────────────────────────────────
const MONTHLY = [
  {month:"Oct 2025",revenue:"₹6.2L"},{month:"Nov 2025",revenue:"₹7.8L"},
  {month:"Dec 2025",revenue:"₹9.4L"},{month:"Jan 2026",revenue:"₹7.1L"},
  {month:"Feb 2026",revenue:"₹8.6L"},{month:"Mar 2026",revenue:"₹10.2L"},
  {month:"Apr 2026",revenue:"₹8.1L"},{month:"May 2026",revenue:"₹5.2L"},
];
const SVC_REV = [
  {service:"Venue",revenue:"₹15.4L",pct:32,bookings:487},
  {service:"Food Supply",revenue:"₹10.6L",pct:22,bookings:342},
  {service:"Photography",revenue:"₹7.7L",pct:16,bookings:256},
  {service:"Decoration",revenue:"₹6.3L",pct:13,bookings:198},
  {service:"Fashion",revenue:"₹4.3L",pct:9,bookings:145},
  {service:"Makeup",revenue:"₹2.4L",pct:5,bookings:121},
  {service:"Tourist",revenue:"₹1.9L",pct:3,bookings:98},
];

export function RevenueSection() {
  return (
    <div className="admin-section">
      <div className="section-header">
        <h2 className="section-title">Revenue Report</h2>
        <p className="section-subtitle">Comprehensive revenue analytics</p>
      </div>
      <div className="rev-metrics-row">
        <div className="rev-metric-card"><p>Total Revenue</p><h3>₹48.6L</h3><span className="delta-up">+8.4% vs last year</span></div>
        <div className="rev-metric-card"><p>This Month</p><h3>₹5.2L</h3><span className="delta-down">Month in progress</span></div>
        <div className="rev-metric-card"><p>Avg per Booking</p><h3>₹12,640</h3><span className="delta-up">+3.2%</span></div>
        <div className="rev-metric-card"><p>Top Service</p><h3>Venue</h3><span className="delta-up">₹15.4L (32%)</span></div>
      </div>
      <div className="admin-card">
        <div className="admin-card-header"><h3>Monthly Breakdown</h3></div>
        <div className="bookings-table-wrap"><table className="bookings-table">
          <thead><tr><th>Month</th><th>Revenue</th></tr></thead>
          <tbody>{MONTHLY.map(m=>(
            <tr key={m.month}><td>{m.month}</td><td className="amount-col">{m.revenue}</td></tr>
          ))}</tbody>
        </table></div>
      </div>
      <div className="admin-card" style={{marginTop:20}}>
        <div className="admin-card-header"><h3>Revenue by Service</h3></div>
        <div className="bookings-table-wrap"><table className="bookings-table">
          <thead><tr><th>Service</th><th>Revenue</th><th>Share</th><th>Bookings</th></tr></thead>
          <tbody>{SVC_REV.map(s=>(
            <tr key={s.service}>
              <td><strong>{s.service}</strong></td>
              <td className="amount-col">{s.revenue}</td>
              <td>{s.pct}%</td>
              <td className="amount-col">{s.bookings}</td>
            </tr>
          ))}</tbody>
        </table></div>
      </div>
    </div>
  );
}

// ── SETTINGS ─────────────────────────────────────────
export function SettingsSection() {
  const [notifEmail, setNotifEmail] = useState(true);
  const [notifBooking, setNotifBooking] = useState(true);
  const [notifRevenue, setNotifRevenue] = useState(false);
  const [maintenance, setMaintenance] = useState(false);

  return (
    <div className="admin-section">
      <div className="section-header">
        <h2 className="section-title">Settings</h2>
        <p className="section-subtitle">Platform configuration and preferences</p>
      </div>

      <div className="settings-grid">
        <div className="admin-card settings-card">
          <h3 className="settings-card-title"><Shield size={16}/>Admin Profile</h3>
          <div className="settings-form">
            <div className="settings-field"><label>Admin Name</label><input type="text" defaultValue="Rajesh Sharma" /></div>
            <div className="settings-field"><label>Email</label><input type="email" defaultValue="admin@infinityevents.com" /></div>
            <div className="settings-field"><label>Phone</label><input type="tel" defaultValue="+91 98765 43210" /></div>
            <button className="settings-save-btn" type="button"><Save size={15}/>Save Changes</button>
          </div>
        </div>

        <div className="admin-card settings-card">
          <h3 className="settings-card-title"><Bell size={16}/>Notifications</h3>
          <div className="settings-toggles">
            <label className="toggle-row">
              <span>Email notifications</span>
              <input type="checkbox" checked={notifEmail} onChange={()=>setNotifEmail(!notifEmail)} />
              <span className="toggle-slider"/>
            </label>
            <label className="toggle-row">
              <span>New booking alerts</span>
              <input type="checkbox" checked={notifBooking} onChange={()=>setNotifBooking(!notifBooking)} />
              <span className="toggle-slider"/>
            </label>
            <label className="toggle-row">
              <span>Weekly revenue reports</span>
              <input type="checkbox" checked={notifRevenue} onChange={()=>setNotifRevenue(!notifRevenue)} />
              <span className="toggle-slider"/>
            </label>
          </div>
        </div>

        <div className="admin-card settings-card">
          <h3 className="settings-card-title"><Settings size={16}/>Platform</h3>
          <div className="settings-toggles">
            <label className="toggle-row">
              <span>Maintenance mode</span>
              <input type="checkbox" checked={maintenance} onChange={()=>setMaintenance(!maintenance)} />
              <span className="toggle-slider"/>
            </label>
          </div>
          <div className="settings-info">
            <p>Platform Version: <strong>2.4.1</strong></p>
            <p>Last Updated: <strong>10 May 2026</strong></p>
            <p>Active Sessions: <strong>24</strong></p>
          </div>
        </div>
      </div>
    </div>
  );
}
