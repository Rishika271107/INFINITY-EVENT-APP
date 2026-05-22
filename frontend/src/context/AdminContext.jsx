import React, { createContext, useState, useEffect, useCallback } from "react";
import { Building2 } from "lucide-react";
import API from "../services/api";

// Create the Admin context
export const AdminContext = createContext();

export const AdminProvider = ({ children }) => {
  // Shared state
  const [bookings, setBookings] = useState([]);
  const [users, setUsers] = useState([]);
  const [vendors, setVendors] = useState([]);
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalBookings: 0,
    pendingBookings: 0,
    totalRevenue: 0,
  });
  const [loadingBookings, setLoadingBookings] = useState(false);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [loadingVendors, setLoadingVendors] = useState(false);
  const [loadingStats, setLoadingStats] = useState(false);
  const [error, setError] = useState(null);

  // Fetch bookings
  const fetchBookings = useCallback(async () => {
    setLoadingBookings(true);
    try {
      const response = await API.get("/bookings/all");
      if (response.data.success) {
        const mappedBookings = response.data.bookings.map(bk => ({
          id: bk._id,
          user: bk.user?.username || "Unknown",
          service: bk.serviceName,
          serviceIcon: <Building2 size={15} />, // default icon – can be refined
          amount: `₹${bk.totalAmount.toLocaleString()}`,
          date: new Date(bk.eventDate).toLocaleDateString(),
          status: bk.bookingStatus,
          payment: bk.paymentStatus === "paid" ? "Paid" : "Pending",
        }));
        setBookings(mappedBookings);
      } else {
        setError("Failed to fetch bookings");
      }
    } catch (err) {
      console.error("Error fetching bookings:", err);
      setError(err.message || "Error fetching bookings");
    } finally {
      setLoadingBookings(false);
    }
  }, []);

  // Fetch users
  const fetchUsers = useCallback(async () => {
    setLoadingUsers(true);
    try {
      const response = await API.get("/admin/users");
      if (response.data.success) {
        setUsers(response.data.users);
      } else {
        setError("Failed to fetch users");
      }
    } catch (err) {
      console.error("Error fetching users:", err);
      setError(err.message || "Error fetching users");
    } finally {
      setLoadingUsers(false);
    }
  }, []);

  // Fetch vendors
  const fetchVendors = useCallback(async () => {
    setLoadingVendors(true);
    try {
      const response = await API.get("/admin/vendors");
      if (response.data.success) {
        setVendors(response.data.vendors);
      } else {
        setError("Failed to fetch vendors");
      }
    } catch (err) {
      console.error("Error fetching vendors:", err);
      setError(err.message || "Error fetching vendors");
    } finally {
      setLoadingVendors(false);
    }
  }, []);

  // Fetch stats
  const fetchStats = useCallback(async () => {
    setLoadingStats(true);
    try {
      const response = await API.get("/admin/stats");
      if (response.data.success) {
        setStats(response.data.stats);
      } else {
        setError("Failed to fetch stats");
      }
    } catch (err) {
      console.error("Error fetching stats:", err);
      setError(err.message || "Error fetching stats");
    } finally {
      setLoadingStats(false);
    }
  }, []);

  // Initial load
  useEffect(() => {
    fetchBookings();
    fetchUsers();
    fetchVendors();
    fetchStats();
  }, [fetchBookings, fetchUsers, fetchVendors, fetchStats]);

  const value = {
    bookings,
    setBookings,
    users,
    setUsers,
    vendors,
    setVendors,
    stats,
    setStats,
    loadingBookings,
    loadingUsers,
    loadingVendors,
    loadingStats,
    error,
    fetchBookings,
    fetchUsers,
    fetchVendors,
    fetchStats,
  };

  return (
    <AdminContext.Provider value={value}>
      {children}
    </AdminContext.Provider>
  );
};
