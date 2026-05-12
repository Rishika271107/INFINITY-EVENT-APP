import { useNavigate } from "react-router-dom";
import "./DecorationVendors.css";

function DecorationVendors() {

  const navigate = useNavigate();

  const vendors = [
  {
    name: "Royal Floral Studio",
    city: "Mumbai",
    type: "Floral",
    reviews: 312,
    price: "₹15,000/day",
    rating: 4.9,
  },

  {
    name: "Balloon Dreams",
    city: "Delhi",
    type: "Balloon",
    reviews: 198,
    price: "₹8,000/day",
    rating: 4.7,
  },

  {
    name: "LED Magic Decor",
    city: "Bangalore",
    type: "LED",
    reviews: 245,
    price: "₹20,000/day",
    rating: 4.8,
  },

  {
    name: "Heritage Decorators",
    city: "Jaipur",
    type: "Traditional",
    reviews: 421,
    price: "₹25,000/day",
    rating: 4.9,
  },

  {
    name: "Grand Royal Events",
    city: "Udaipur",
    type: "Royal Theme",
    reviews: 367,
    price: "₹30,000/day",
    rating: 4.8,
  },

  {
    name: "Sparkle & Shine",
    city: "Pune",
    type: "Modern",
    reviews: 156,
    price: "₹18,000/day",
    rating: 4.6,
  },

  {
    name: "Golden Petals Decor",
    city: "Hyderabad",
    type: "Luxury Floral",
    reviews: 289,
    price: "₹22,000/day",
    rating: 4.8,
  },

  {
    name: "Dream Day Designers",
    city: "Chennai",
    type: "Wedding Theme",
    reviews: 334,
    price: "₹26,000/day",
    rating: 4.9,
  },

  {
    name: "Elite Event Makers",
    city: "Kolkata",
    type: "Stage Decor",
    reviews: 201,
    price: "₹17,000/day",
    rating: 4.7,
  },

  {
    name: "Luxury Aura Events",
    city: "Goa",
    type: "Beach Theme",
    reviews: 174,
    price: "₹35,000/day",
    rating: 4.9,
  },

  {
    name: "Blossom Creations",
    city: "Ahmedabad",
    type: "Floral",
    reviews: 223,
    price: "₹16,000/day",
    rating: 4.6,
  },

  {
    name: "Crystal Wedding Decor",
    city: "Mysore",
    type: "Crystal Theme",
    reviews: 310,
    price: "₹28,000/day",
    rating: 4.9,
  },

  {
    name: "Moonlight Decor Studio",
    city: "Coimbatore",
    type: "Reception Decor",
    reviews: 185,
    price: "₹19,000/day",
    rating: 4.7,
  },

  {
    name: "Vintage Event Planners",
    city: "Lucknow",
    type: "Vintage",
    reviews: 205,
    price: "₹21,000/day",
    rating: 4.8,
  },

  {
    name: "Heavenly Lights",
    city: "Surat",
    type: "Lighting Decor",
    reviews: 143,
    price: "₹14,000/day",
    rating: 4.5,
  },

  {
    name: "Majestic Mandap Designers",
    city: "Indore",
    type: "Mandap Decor",
    reviews: 355,
    price: "₹27,000/day",
    rating: 4.9,
  },
];

  return (
    <div className="vendors-page">

      <div className="vendors-container">

        <div
          className="back-btn"
          onClick={() => navigate(-1)}
        >
          ← BACK
        </div>

        <div className="stepper">
          <div className="step active">1</div>
          <div className="line active-line"></div>
          <div className="step active">2</div>
          <div className="line"></div>
          <div className="step">3</div>
        </div>

        <h1 className="vendors-title">
          SELECT A DECORATOR
        </h1>

        <div className="vendors-grid">

          {vendors.map((vendor, index) => (

            <div className="vendor-card" key={index}>

              <div className="vendor-top">

                <h2>{vendor.name}</h2>

                <span>⭐ {vendor.rating}</span>

              </div>

              <p className="vendor-location">
                {vendor.city} · {vendor.type}
              </p>

              <p className="vendor-reviews">
                {vendor.reviews} reviews
              </p>

              <div className="vendor-bottom">

                <h3>{vendor.price}</h3>

                <button
                  className="book-btn"
                  onClick={() =>
                    navigate("/services/decoration/booking")
                  }
                >
                  BOOK NOW
                </button>

              </div>

            </div>

          ))}

        </div>

      </div>

    </div>
  );
}

export default DecorationVendors;