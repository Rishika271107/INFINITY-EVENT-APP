import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import RoleSelection from "./pages/RoleSelection";
import UserLogin from "./pages/UserLogin";
import UserSignup from "./pages/UserSignup";
import UserDashboard from "./pages/UserDashboard";

import BudgetTracker from "./pages/BudgetTracker";
import PastActivities from "./pages/PastActivities";

import ProfilePage from "./pages/ProfilePage";
import ReminderPage from "./pages/ReminderPage";

import FoodSupplyHotels from "./pages/FoodSupplyHotels";
import FoodMenuPage from "./pages/FoodMenuPage";
import FoodCheckout from "./pages/FoodCheckout";

import VenueDetails from "./pages/VenueDetails";
import VenueSelection from "./pages/VenueSelection";
import VenueConfirm from "./pages/VenueConfirm";

import FashionDesigning from "./pages/FashionDesigning";
import FashionConfirm from "./pages/FashionConfirm";
import PhotographyDetails from "./pages/PhotographyDetails";
import PhotographySelect from "./pages/PhotographySelect";
import PhotographyConfirm from "./pages/PhotographyConfirm";
import TouristPlaces from "./pages/TouristPlaces";
import TouristHotels from "./pages/TouristHotels";
import TouristConfirm from "./pages/TouristConfirm";
import MakeupServices from "./pages/MakeupServices";
import MakeupConfirm from "./pages/MakeupConfirm";


import DecorationDetails from "./pages/DecorationDetails";
import DecorationVendors from "./pages/DecorationVendors";
import DecorationBooking from "./pages/DecorationBooking";
import BookingSuccess from "./pages/BookingSuccess";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* Main Pages */}
        <Route path="/" element={<Home />} />
        <Route path="/role-selection" element={<RoleSelection />} />
        <Route path="/user/login" element={<UserLogin />} />
        <Route path="/user/signup" element={<UserSignup />} />

        {/* Dashboard */}
        <Route path="/user/home" element={<UserDashboard />} />
        <Route path="/user/dashboard" element={<UserDashboard />} />

        {/* Features */}
        <Route path="/budget-tracker" element={<BudgetTracker />} />
        <Route path="/past-activities" element={<PastActivities />} />

        {/* Profile */}
        <Route path="/user/profile" element={<ProfilePage />} />

        {/* Reminder */}
        <Route path="/user/reminder" element={<ReminderPage />} />

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
      </Routes>
    </BrowserRouter>
  );
}

export default App;