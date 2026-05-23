import React, { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ErrorBoundary from './components/ErrorBoundary';
import SkeletonLoader from './components/async/SkeletonLoader';
import ProtectedRoute from './components/ProtectedRoute';
import { AdminProvider } from './context/AdminContext';
import UserLayout from './components/UserLayout';

// Lazy-loaded page components
const Home = lazy(() => import('./pages/Home'));
const RoleSelection = lazy(() => import('./pages/RoleSelection'));
const UserLogin = lazy(() => import('./pages/UserLogin'));
const UserSignup = lazy(() => import('./pages/UserSignup'));
const UserDashboard = lazy(() => import('./pages/UserDashboard'));
const AdminLogin = lazy(() => import('./pages/AdminLogin'));
const AdminDashboard = lazy(() => import('./pages/AdminDashboard'));
const ForgotPassword = lazy(() => import('./pages/ForgotPassword'));
const BudgetTracker = lazy(() => import('./pages/BudgetTracker'));
const PastActivities = lazy(() => import('./pages/PastActivities'));
const ProfilePage = lazy(() => import('./pages/ProfilePage'));
const ReminderPage = lazy(() => import('./pages/ReminderPage'));
const FoodSupplyHotels = lazy(() => import('./pages/FoodSupplyHotels'));
const FoodMenuPage = lazy(() => import('./pages/FoodMenuPage'));
const FoodCheckout = lazy(() => import('./pages/FoodCheckout'));
const VenueDetails = lazy(() => import('./pages/VenueDetails'));
const VenueSelection = lazy(() => import('./pages/VenueSelection'));
const VenueConfirm = lazy(() => import('./pages/VenueConfirm'));
const FashionDesigning = lazy(() => import('./pages/FashionDesigning'));
const FashionConfirm = lazy(() => import('./pages/FashionConfirm'));
const PhotographyDetails = lazy(() => import('./pages/PhotographyDetails'));
const PhotographySelect = lazy(() => import('./pages/PhotographySelect'));
const PhotographyConfirm = lazy(() => import('./pages/PhotographyConfirm'));
const TouristPlaces = lazy(() => import('./pages/TouristPlaces'));
const TouristHotels = lazy(() => import('./pages/TouristHotels'));
const TouristConfirm = lazy(() => import('./pages/TouristConfirm'));
const MakeupServices = lazy(() => import('./pages/MakeupServices'));
const MakeupConfirm = lazy(() => import('./pages/MakeupConfirm'));
const DecorationDetails = lazy(() => import('./pages/DecorationDetails'));
const DecorationVendors = lazy(() => import('./pages/DecorationVendors'));
const DecorationBooking = lazy(() => import('./pages/DecorationBooking'));
const OTPVerification = lazy(() => import('./pages/OTPVerification'));
const BookingSuccess = lazy(() => import('./pages/BookingSuccess'));
const AiHelp = lazy(() => import('./pages/AiHelp'));

function App() {
  return (
    <BrowserRouter>
      <ErrorBoundary>
        <Suspense fallback={<SkeletonLoader />}>
          <Routes>
            {/* Main Pages */}
            <Route path="/" element={<Home />} />
            <Route path="/role-selection" element={<RoleSelection />} />
            <Route path="/user/login" element={<UserLogin />} />
            <Route path="/user/signup" element={<UserSignup />} />
            <Route path="/verify-otp" element={<OTPVerification />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />

            {/* Admin */}
            <Route path="/admin-login" element={<AdminLogin />} />
            <Route path="/admin/dashboard" element={
              <ProtectedRoute role="admin">
                <AdminProvider>
                  <AdminDashboard />
                </AdminProvider>
              </ProtectedRoute>
            } />

            {/* Dashboard Layout (Protected for Users) */}
            <Route element={<ProtectedRoute role="user"><UserLayout /></ProtectedRoute>}>
              {/* Dashboard Homes */}
              <Route path="/user/home" element={<UserDashboard />} />
              <Route path="/user/dashboard" element={<UserDashboard />} />

              {/* Features */}
              <Route path="/budget-tracker" element={<BudgetTracker />} />
              <Route path="/past-activities" element={<PastActivities />} />
              <Route path="/user/profile" element={<ProfilePage />} />
              <Route path="/user/reminder" element={<ReminderPage />} />

              {/* Services (Nested to preserve layout) */}
              <Route path="/food-supply" element={<FoodSupplyHotels />} />
              <Route path="/food-supply/menu/:id" element={<FoodMenuPage />}/>
              <Route path="/food-supply/checkout" element={<FoodCheckout />}/>

              <Route path="/venues/details" element={<VenueDetails />} />
              <Route path="/venues/select" element={<VenueSelection />} />
              <Route path="/venues/confirm" element={<VenueConfirm />} />

              <Route path="/fashion-designing" element={<FashionDesigning />} />
              <Route path="/fashion/confirm" element={<FashionConfirm />} />  

              <Route path="/services/photography" element={<PhotographyDetails />} />
              <Route path="/services/photography/select" element={<PhotographySelect />} />
              <Route path="/services/photography/confirm" element={<PhotographyConfirm />} />
              
              <Route path="/services/tourist" element={<TouristPlaces />} />
              <Route path="/services/tourist/hotels" element={<TouristHotels />} />
              <Route path="/services/tourist/confirm" element={<TouristConfirm />} />
              
              <Route path="/services/makeup" element={<MakeupServices />} />
              <Route path="/services/makeup/confirm" element={<MakeupConfirm />} />

              <Route path="/services/decoration" element={<DecorationDetails />} />
              <Route path="/services/decoration/vendors" element={<DecorationVendors />} />
              <Route path="/services/decoration/booking" element={<DecorationBooking />} />
              
              <Route path="/booking-success" element={<BookingSuccess />} />  
              <Route path="/ai-help" element={<AiHelp />} />
            </Route>

            {/* Fallback Route */}
            <Route path="*" element={<Home />} />
          </Routes>
        </Suspense>
      </ErrorBoundary>
    </BrowserRouter>
  );
}

export default App;