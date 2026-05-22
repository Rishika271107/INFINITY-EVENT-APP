import { useState, useContext, useEffect, useCallback } from "react";
import { useDebounce } from "../hooks/useDebounce";
import {
  Users, Store, Settings,
  Building2, UtensilsCrossed, Camera, Flower2, Shirt, Sparkles, MapPin,
  Save, Bell, Shield, Edit, CreditCard, HelpCircle, RefreshCw, TrendingUp
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { AdminContext } from "../context/AdminContext";
import API from "../services/api";

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
  const { bookings, setBookings, loadingBookings } = useContext(AdminContext);
  const [filter, setFilter] = useState("all");
  const [svcFilter, setSvcFilter] = useState("all");
  const [viewing, setViewing] = useState(null);
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 200);
  const rowsPerPage = 10;
  const [currentPage, setCurrentPage] = useState(1);

  const services = ["all",...new Set(bookings.map(b=>b.service))];

  const filteredList = bookings.filter(b =>
    (filter === "all" || b.status === filter) &&
    (svcFilter === "all" || b.service === svcFilter) &&
    (debouncedSearch === "" || b.user.toLowerCase().includes(debouncedSearch.toLowerCase()) || b.service.toLowerCase().includes(debouncedSearch.toLowerCase()))
  );

  const totalPages = Math.ceil(filteredList.length / rowsPerPage) || 1;
  const paginated = filteredList.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage);

  const updateStatus = (id, newStatus) => {
    setBookings(prev => prev.map(b => b.id === id ? { ...b, status: newStatus } : b));
    if (viewing && viewing.id === id) setViewing(prev => ({ ...prev, status: newStatus }));
  };

  const openView = b => setViewing({ ...b });
  const closeView = () => setViewing(null);

  const goToPage = (page) => {
    const p = Math.max(1, Math.min(page, totalPages));
    setCurrentPage(p);
  };

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
            {["all","confirmed","pending","cancelled"].map(f => (
              <button key={f} className={`filter-pill ${filter===f?"active":""}`}
                onClick={()=>{setFilter(f); setCurrentPage(1);}} type="button">
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
          <tbody>{paginated.map(b=>(
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

      <div className="pagination" style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: "10px", marginTop: "10px" }}>
  <button type="button" disabled={currentPage===1} onClick={() => goToPage(currentPage-1)}>Prev</button>
  <span>{currentPage} / {totalPages}</span>
  <button type="button" disabled={currentPage===totalPages} onClick={() => goToPage(currentPage+1)}>Next</button>
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
// Users will be fetched via AdminContext; no static mock data needed

export function UsersSection() {
  const { users } = useContext(AdminContext);
  const [search, setSearch] = useState("");
  const list = users.filter(u =>
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
            value={search} onChange={e => setSearch(e.target.value)} />
          <div className="toolbar-stats">
            <span className="toolbar-stat"><Users size={14}/>Total: <strong>{users.length}</strong></span>
            <span className="toolbar-stat active-stat">Active: <strong>{users.filter(u => u.status === "active").length}</strong></span>
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
  const { vendors, setVendors } = useContext(AdminContext);
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

// ── DYNAMIC REVENUE & TRANSACTION AUDIT SECTIONS ───────────────────

export function RevenueSection() {
  const { stats, fetchStats } = useContext(AdminContext);
  
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // Refund processing state
  const [refundTarget, setRefundTarget] = useState(null);
  const [refundAmount, setRefundAmount] = useState("");
  const [refundLoading, setRefundLoading] = useState(false);
  const [refundMessage, setRefundMessage] = useState("");

  const loadTransactions = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await API.get("/admin/transactions");
      if (response.data.success) {
        setTransactions(response.data.transactions);
      } else {
        setError("Failed to fetch transaction logs.");
      }
    } catch (err) {
      console.error("Error reading transaction logs:", err);
      setError(err.response?.data?.message || err.message || "Failed to load transactions.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadTransactions();
    fetchStats();
  }, [loadTransactions, fetchStats]);

  // Execute actual online refund via Razorpay
  const handleProcessRefund = async (e) => {
    e.preventDefault();
    if (!refundTarget) return;

    setRefundLoading(true);
    setRefundMessage("");
    try {
      const payload = {
        bookingId: refundTarget.booking?._id || refundTarget.booking,
        amount: refundAmount ? parseFloat(refundAmount) : undefined
      };

      const response = await API.post("/payment/refund", payload);

      if (response.data.success) {
        setRefundMessage("✅ Online Refund completed successfully via Razorpay.");
        // Refresh lists
        loadTransactions();
        fetchStats();
        setTimeout(() => {
          setRefundTarget(null);
          setRefundAmount("");
          setRefundMessage("");
        }, 2000);
      }
    } catch (err) {
      console.error("Refund error:", err);
      setRefundMessage(`❌ Refund failed: ${err.response?.data?.message || err.message}`);
    } finally {
      setRefundLoading(false);
    }
  };

  // Aggregated dynamic metrics
  const successTx = transactions.filter(t => t.status === "success");
  const failedTx = transactions.filter(t => t.status === "failed");
  const pendingTx = transactions.filter(t => t.status === "pending");

  const totalSuccessfulAmount = successTx.reduce((sum, t) => sum + t.amount, 0);
  const avgTicket = successTx.length > 0 ? totalSuccessfulAmount / successTx.length : 0;
  
  // Group by service to get exact breakdown
  const serviceBreakdown = successTx.reduce((acc, curr) => {
    const sName = curr.booking?.serviceType || "Unknown";
    acc[sName] = (acc[sName] || 0) + curr.amount;
    return acc;
  }, {});

  const totalRevenue = stats.totalRevenue || totalSuccessfulAmount;

  return (
    <div className="admin-section">
      <div className="section-header">
        <h2 className="section-title">Revenue & Payments</h2>
        <p className="section-subtitle">Real-time gateway audits and administrative refund control</p>
      </div>

      {/* METRIC CARD GRID */}
      <div className="rev-metrics-row">
        <div className="rev-metric-card">
          <p>Total Revenue</p>
          <h3>₹{totalRevenue.toLocaleString("en-IN")}</h3>
          <span className="delta-up">Verified Gateway Captures</span>
        </div>
        <div className="rev-metric-card">
          <p>Successful Payments</p>
          <h3 style={{ color: "#d4af37" }}>{successTx.length}</h3>
          <span className="delta-up">Checkout Completion: {transactions.length > 0 ? Math.round((successTx.length / transactions.length) * 100) : 100}%</span>
        </div>
        <div className="rev-metric-card">
          <p>Failed Attempts</p>
          <h3 style={{ color: "#ff5252" }}>{failedTx.length}</h3>
          <span className="delta-down">Abandoned checkouts tracked</span>
        </div>
        <div className="rev-metric-card">
          <p>Average Order Value</p>
          <h3>₹{Math.round(avgTicket).toLocaleString("en-IN")}</h3>
          <span className="delta-up">Per ticket purchase</span>
        </div>
      </div>

      <div className="admin-card-row" style={{ display: "flex", gap: "20px", flexWrap: "wrap", marginBottom: "20px" }}>
        
        {/* REVENUE BREAKDOWN BY SERVICE */}
        <div className="admin-card" style={{ flex: 1, minWidth: "300px" }}>
          <div className="admin-card-header">
            <h3>Revenue Breakdown by Service</h3>
          </div>
          <div className="bookings-table-wrap" style={{ padding: "10px" }}>
            <table className="bookings-table">
              <thead>
                <tr>
                  <th>Service Type</th>
                  <th>Gateway Captures</th>
                  <th>Share</th>
                </tr>
              </thead>
              <tbody>
                {Object.keys(serviceBreakdown).length === 0 ? (
                  <tr>
                    <td colSpan="3" style={{ textTransform: "uppercase", fontSize: "11px", color: "rgba(255,255,255,0.4)" }}>No captures recorded yet</td>
                  </tr>
                ) : (
                  Object.entries(serviceBreakdown).map(([srv, val]) => (
                    <tr key={srv}>
                      <td style={{ textTransform: "capitalize" }}><strong>{srv}</strong></td>
                      <td className="amount-col">₹{val.toLocaleString()}</td>
                      <td>{totalRevenue > 0 ? Math.round((val / totalRevenue) * 100) : 0}%</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* SECURE RAZORPAY GATEWAY OVERVIEW */}
        <div className="admin-card" style={{ flex: 1, minWidth: "300px" }}>
          <div className="admin-card-header">
            <h3>Razorpay System Overview</h3>
          </div>
          <div className="settings-info" style={{ padding: "18px", color: "rgba(255,255,255,0.8)", fontSize: "14px", lineHeight: "1.8" }}>
            <p>Gateway Mode: <strong style={{ color: "#ffb300" }}>TEST MODE (Active)</strong></p>
            <p>Signature Verification: <strong style={{ color: "#d4af37" }}>HMAC-SHA256 (Enforced)</strong></p>
            <p>Razorpay Key ID: <code>{process.env.RAZORPAY_KEY_ID || "rzp_test_SqkxUS9DW4aoGz"}</code></p>
            <p>Database Consistency Sync: <strong style={{ color: "#00e5ff" }}>Webhooks Configured</strong></p>
            <p>Pending / Retry Pool: <strong>{pendingTx.length} items logged</strong></p>
            <button className="qa-btn" style={{ width: "auto", display: "inline-flex", gap: "6px", alignSelf: "flex-start", marginTop: "10px" }} onClick={() => { loadTransactions(); fetchStats(); }}>
              <RefreshCw size={14} /> Refresh Logs
            </button>
          </div>
        </div>
      </div>

      {/* DYNAMIC TRANSACTION LOG TABLE */}
      <div className="admin-card">
        <div className="admin-card-header">
          <h3>MERN Gateway Transaction Audits</h3>
        </div>
        {loading ? (
          <div style={{ padding: "40px", textAlign: "center", color: "rgba(255,255,255,0.4)" }}>Querying transaction records...</div>
        ) : error ? (
          <div style={{ padding: "40px", textAlign: "center", color: "#ff5252" }}>{error}</div>
        ) : transactions.length === 0 ? (
          <div style={{ padding: "40px", textAlign: "center", color: "rgba(255,255,255,0.4)" }}>No transaction events logged. Initiate bookings to display data.</div>
        ) : (
          <div className="bookings-table-wrap">
            <table className="bookings-table">
              <thead>
                <tr>
                  <th>Transaction ID</th>
                  <th>Customer</th>
                  <th>Linked Booking</th>
                  <th>Amount</th>
                  <th>Gateway Method</th>
                  <th>Razorpay Identifiers</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((tx) => {
                  const isSuccess = tx.status === "success";
                  const isFailed = tx.status === "failed";
                  return (
                    <tr key={tx._id}>
                      <td className="booking-id" style={{ fontSize: "11px" }}>TX-{tx._id.substring(18)}</td>
                      <td>
                        <div style={{ display: "flex", flexDirection: "column" }}>
                          <span>{tx.user?.username || "Unknown"}</span>
                          <span style={{ fontSize: "11px", color: "rgba(255,255,255,0.4)" }}>{tx.user?.email || ""}</span>
                        </div>
                      </td>
                      <td>
                        <div style={{ display: "flex", flexDirection: "column" }}>
                          <span style={{ textTransform: "capitalize" }}>{tx.booking?.serviceName || "Abandoned Checkout"}</span>
                          <span style={{ fontSize: "11px", color: "rgba(255,255,255,0.4)" }}>{tx.booking?.serviceType || "none"}</span>
                        </div>
                      </td>
                      <td className="amount-col">₹{tx.amount.toLocaleString()}</td>
                      <td>
                        <span className="service-tag" style={{ background: "rgba(255,255,255,0.03)" }}>
                          <CreditCard size={12} style={{ color: "#d4af37", marginRight: "4px" }} />
                          {tx.paymentMethod ? tx.paymentMethod.toUpperCase() : "PENDING"}
                        </span>
                      </td>
                      <td>
                        <div style={{ display: "flex", flexDirection: "column", fontSize: "11px", fontFamily: "monospace", color: "rgba(255,255,255,0.6)" }}>
                          <span>Order: {tx.razorpay_order_id || tx.razorpayOrderId || "none"}</span>
                          {tx.razorpay_payment_id && <span>Pay: {tx.razorpay_payment_id}</span>}
                        </div>
                      </td>
                      <td>
                        <span className={`status-badge ${isSuccess ? "status-confirmed" : isFailed ? "status-cancelled" : "status-pending"}`}>
                          {tx.status.toUpperCase()}
                        </span>
                      </td>
                      <td>
                        {isSuccess && tx.paymentMethod !== "refund" ? (
                          <button className="reject-btn" type="button" style={{ padding: "4px 8px", fontSize: "12px" }} onClick={() => setRefundTarget(tx)}>
                            Refund
                          </button>
                        ) : tx.paymentMethod === "refund" ? (
                          <span style={{ fontSize: "11px", color: "#ff5252", fontStyle: "italic" }}>Refunded</span>
                        ) : (
                          <span style={{ color: "rgba(255,255,255,0.25)" }}>—</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ONLINE REFUND EXECUTION DIALOG MODAL */}
      {refundTarget && (
        <div className="modal-overlay" onClick={() => setRefundTarget(null)}>
          <div className="modal-card" onClick={e => e.stopPropagation()}>
            <button className="modal-close" type="button" onClick={() => setRefundTarget(null)}>✕</button>
            <h3 className="modal-title">Trigger Razorpay Online Refund</h3>
            <div className="modal-id">Transaction: TX-{refundTarget._id.substring(18)}</div>
            
            <form onSubmit={handleProcessRefund} style={{ marginTop: "15px" }}>
              <div className="modal-grid" style={{ marginBottom: "15px" }}>
                <div className="modal-field">
                  <span>Customer Name</span>
                  <strong>{refundTarget.user?.username || "Unknown"}</strong>
                </div>
                <div className="modal-field">
                  <span>Original Amount</span>
                  <strong>₹{refundTarget.amount.toLocaleString()}</strong>
                </div>
                <div className="modal-field">
                  <span>Payment Ref</span>
                  <strong style={{ fontFamily: "monospace" }}>{refundTarget.razorpay_payment_id}</strong>
                </div>
                <div className="modal-field">
                  <span>Refund Speed</span>
                  <strong style={{ color: "#d4af37" }}>Instant/Normal (Via Razorpay API)</strong>
                </div>
              </div>

              <div className="field" style={{ display: "flex", flexDirection: "column", gap: "6px", marginBottom: "15px" }}>
                <label style={{ fontSize: "12px", color: "rgba(255,255,255,0.6)" }}>Refund Amount (INR) — Leave empty for full refund</label>
                <input
                  type="number"
                  placeholder={`Full Refund: ₹${refundTarget.amount}`}
                  min="1"
                  max={refundTarget.amount}
                  step="0.01"
                  value={refundAmount}
                  onChange={(e) => setRefundAmount(e.target.value)}
                  style={{
                    background: "rgba(0,0,0,0.4)",
                    border: "1px solid rgba(255,255,255,0.1)",
                    borderRadius: "6px",
                    padding: "8px 12px",
                    color: "#ffffff"
                  }}
                />
              </div>

              {refundMessage && (
                <div style={{ padding: "10px", borderRadius: "6px", background: "rgba(255,255,255,0.03)", fontSize: "13px", marginBottom: "15px", color: "#ffffff" }}>
                  {refundMessage}
                </div>
              )}

              <div className="modal-actions" style={{ marginTop: "15px" }}>
                <button className="reject-btn" type="submit" disabled={refundLoading}>
                  {refundLoading ? "Processing Refund..." : "✓ Confirm Refund"}
                </button>
                <button className="view-btn" type="button" onClick={() => setRefundTarget(null)} disabled={refundLoading}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

// ── SETTINGS ─────────────────────────────────────────
export function SettingsSection() {
  const { user } = useAuth();
  const [notifEmail, setNotifEmail] = useState(true);
  const [notifBooking, setNotifBooking] = useState(true);
  const [notifRevenue, setNotifRevenue] = useState(false);
  const [maintenance, setMaintenance] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(() => {
    return localStorage.getItem("platformLastUpdated") || "10 May 2026";
  });

  const [savedName, setSavedName] = useState(user?.username || "Rajesh Sharma");
  const [savedEmail, setSavedEmail] = useState(user?.email || "admin@infinityevents.com");
  const [savedPhone, setSavedPhone] = useState(user?.phone || "+91 98765 43210");

  const [adminName, setAdminName] = useState(savedName);
  const [adminEmail, setAdminEmail] = useState(savedEmail);
  const [adminPhone, setAdminPhone] = useState(savedPhone);

  const [isEditing, setIsEditing] = useState(false);

  const hasChanges = adminName !== savedName || adminEmail !== savedEmail || adminPhone !== savedPhone;

  const triggerModification = () => {
    const now = new Date();
    const formatted = now.toLocaleString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: true
    });
    setLastUpdated(formatted);
    localStorage.setItem("platformLastUpdated", formatted);
  };

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
            <div className="settings-field">
              <label>Admin Name</label>
              <input 
                type="text" 
                value={adminName} 
                onChange={(e) => setAdminName(e.target.value)} 
                readOnly={!isEditing}
                style={!isEditing ? { opacity: 0.7, cursor: "not-allowed", border: "1px solid rgba(255,255,255,0.05)" } : {}}
              />
            </div>
            <div className="settings-field">
              <label>Email</label>
              <input 
                type="email" 
                value={adminEmail} 
                onChange={(e) => setAdminEmail(e.target.value)} 
                readOnly={!isEditing}
                style={!isEditing ? { opacity: 0.7, cursor: "not-allowed", border: "1px solid rgba(255,255,255,0.05)" } : {}}
              />
            </div>
            <div className="settings-field">
              <label>Phone</label>
              <input 
                type="tel" 
                value={adminPhone} 
                onChange={(e) => setAdminPhone(e.target.value)} 
                readOnly={!isEditing}
                style={!isEditing ? { opacity: 0.7, cursor: "not-allowed", border: "1px solid rgba(255,255,255,0.05)" } : {}}
              />
            </div>
            {!isEditing ? (
              <button 
                className="settings-save-btn" 
                type="button" 
                onClick={() => setIsEditing(true)}
              >
                <Edit size={15} />Edit Profile
              </button>
            ) : (
              <div style={{ display: "flex", gap: "10px", marginTop: "4px" }}>
                {hasChanges && (
                  <button 
                    className="settings-save-btn" 
                    type="button" 
                    style={{ flex: 1 }}
                    onClick={() => {
                      setSavedName(adminName);
                      setSavedEmail(adminEmail);
                      setSavedPhone(adminPhone);
                      triggerModification();
                      setIsEditing(false);
                    }}
                  >
                    <Save size={15} />Save Changes
                  </button>
                )}
                <button 
                  className="settings-save-btn" 
                  type="button" 
                  style={{ 
                    flex: 1,
                    background: "transparent", 
                    border: "1px solid rgba(255,255,255,0.2)", 
                    color: "rgba(255,255,255,0.7)" 
                  }} 
                  onClick={() => {
                    setAdminName(savedName);
                    setAdminEmail(savedEmail);
                    setAdminPhone(savedPhone);
                    setIsEditing(false);
                  }}
                >
                  Cancel
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="admin-card settings-card">
          <h3 className="settings-card-title"><Bell size={16}/>Notifications</h3>
          <div className="settings-toggles">
            <label className="toggle-row">
              <span>Email notifications</span>
              <input type="checkbox" checked={notifEmail} onChange={() => { setNotifEmail(!notifEmail); triggerModification(); }} />
              <span className="toggle-slider"/>
            </label>
            <label className="toggle-row">
              <span>New booking alerts</span>
              <input type="checkbox" checked={notifBooking} onChange={() => { setNotifBooking(!notifBooking); triggerModification(); }} />
              <span className="toggle-slider"/>
            </label>
            <label className="toggle-row">
              <span>Weekly revenue reports</span>
              <input type="checkbox" checked={notifRevenue} onChange={() => { setNotifRevenue(!notifRevenue); triggerModification(); }} />
              <span className="toggle-slider"/>
            </label>
          </div>
        </div>

        <div className="admin-card settings-card">
          <h3 className="settings-card-title"><Settings size={16}/>Platform</h3>
          <div className="settings-toggles">
            <label className="toggle-row">
              <span>Maintenance mode</span>
              <input type="checkbox" checked={maintenance} onChange={() => { setMaintenance(!maintenance); triggerModification(); }} />
              <span className="toggle-slider"/>
            </label>
          </div>
          <div className="settings-info">
            <p>Platform Version: <strong>2.4.1</strong></p>
            <p>Last Updated: <strong>{lastUpdated}</strong></p>
            <p>Active Sessions: <strong>24</strong></p>
          </div>
        </div>
      </div>
    </div>
  );
}
