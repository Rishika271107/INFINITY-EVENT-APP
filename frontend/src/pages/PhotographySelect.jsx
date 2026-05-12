import { useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./PhotographyFlow.css";

const PHOTOGRAPHERS = [
  { id: 1, name: "Lens Master Studio", city: "Mumbai", reviews: 456, rating: 4.9, pricePerHr: 5000 },
  { id: 2, name: "Pixel Perfect", city: "Delhi", reviews: 312, rating: 4.8, pricePerHr: 4500 },
  { id: 3, name: "Golden Frame", city: "Bangalore", reviews: 234, rating: 4.7, pricePerHr: 4000 },
  { id: 4, name: "Candid Clicks", city: "Jaipur", reviews: 523, rating: 4.9, pricePerHr: 6000 },
  { id: 5, name: "Shutter Stories", city: "Goa", reviews: 287, rating: 4.8, pricePerHr: 4800 },
  { id: 6, name: "Dream Capture", city: "Udaipur", reviews: 198, rating: 4.7, pricePerHr: 4200 },
  { id: 7, name: "Royal Snaps", city: "Hyderabad", reviews: 365, rating: 4.8, pricePerHr: 5200 },
  { id: 8, name: "Timeless Tales", city: "Pune", reviews: 274, rating: 4.7, pricePerHr: 3900 },
  { id: 9, name: "Wedding Vision", city: "Chennai", reviews: 321, rating: 4.8, pricePerHr: 4700 },
  { id: 10, name: "Frame Factory", city: "Kolkata", reviews: 302, rating: 4.7, pricePerHr: 4300 },
  { id: 11, name: "Event Exposure", city: "Ahmedabad", reviews: 188, rating: 4.6, pricePerHr: 3800 },
  { id: 12, name: "Studio Aura", city: "Lucknow", reviews: 226, rating: 4.7, pricePerHr: 4100 },
  { id: 13, name: "Silver Lens", city: "Indore", reviews: 153, rating: 4.6, pricePerHr: 3600 },
  { id: 14, name: "Color Capture", city: "Bhopal", reviews: 207, rating: 4.7, pricePerHr: 4050 },
  { id: 15, name: "Flash Folks", city: "Surat", reviews: 249, rating: 4.8, pricePerHr: 4500 },
  { id: 16, name: "Dream Pixel", city: "Nagpur", reviews: 174, rating: 4.6, pricePerHr: 3700 },
  { id: 17, name: "Focus Films", city: "Noida", reviews: 290, rating: 4.8, pricePerHr: 4900 },
  { id: 18, name: "Prime Portraits", city: "Chandigarh", reviews: 168, rating: 4.7, pricePerHr: 4400 },
  { id: 19, name: "Classic Captures", city: "Mumbai", reviews: 352, rating: 4.8, pricePerHr: 5100 },
  { id: 20, name: "Urban Frames", city: "Delhi", reviews: 241, rating: 4.7, pricePerHr: 4300 },
  { id: 21, name: "Moments & More", city: "Bangalore", reviews: 318, rating: 4.8, pricePerHr: 4950 },
  { id: 22, name: "Pure Portraits", city: "Jaipur", reviews: 197, rating: 4.6, pricePerHr: 3950 },
  { id: 23, name: "Wedding Whispers", city: "Goa", reviews: 281, rating: 4.7, pricePerHr: 4600 },
  { id: 24, name: "Snap Society", city: "Pune", reviews: 265, rating: 4.7, pricePerHr: 4200 },
  { id: 25, name: "Studio Gleam", city: "Hyderabad", reviews: 304, rating: 4.8, pricePerHr: 5000 },
  { id: 26, name: "Focus Point", city: "Chennai", reviews: 215, rating: 4.6, pricePerHr: 4050 },
  { id: 27, name: "Dream Album Co.", city: "Kolkata", reviews: 246, rating: 4.7, pricePerHr: 4400 },
  { id: 28, name: "Art Lens House", city: "Ahmedabad", reviews: 187, rating: 4.6, pricePerHr: 3900 },
  { id: 29, name: "EverAfter Clicks", city: "Lucknow", reviews: 272, rating: 4.8, pricePerHr: 4700 },
  { id: 30, name: "Spark Studio", city: "Noida", reviews: 309, rating: 4.8, pricePerHr: 5150 },
  { id: 31, name: "Motion Memories", city: "Chandigarh", reviews: 228, rating: 4.7, pricePerHr: 4350 },
  { id: 32, name: "Golden Hour Team", city: "Udaipur", reviews: 194, rating: 4.6, pricePerHr: 4000 },
  { id: 33, name: "Frame & Film", city: "Surat", reviews: 223, rating: 4.7, pricePerHr: 4250 },
  { id: 34, name: "Elite Photography", city: "Indore", reviews: 211, rating: 4.7, pricePerHr: 4150 },
  { id: 35, name: "Backdrop Studios", city: "Bhopal", reviews: 176, rating: 4.6, pricePerHr: 3850 },
  { id: 36, name: "Infinity Snaps", city: "Nagpur", reviews: 238, rating: 4.7, pricePerHr: 4300 },
];

export default function PhotographySelect() {
  const navigate = useNavigate();
  const location = useLocation();

  const photographyRequest = location.state?.photographyRequest;
  const filteredPhotographers = useMemo(() => {
    if (!photographyRequest?.city) return PHOTOGRAPHERS;

    // Keep plenty of cards visible: show selected city first, then all others.
    const inCity = PHOTOGRAPHERS.filter((p) => p.city === photographyRequest.city);
    const otherCities = PHOTOGRAPHERS.filter((p) => p.city !== photographyRequest.city);
    return [...inCity, ...otherCities];
  }, [photographyRequest]);

  if (!photographyRequest) {
    return (
      <div className="photo-flow-page">
        <div className="photo-flow-container">
          <p className="photo-empty-text">Please fill photography details first.</p>
          <button className="photo-gold-btn" type="button" onClick={() => navigate("/services/photography")}>
            Go to Details
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="photo-flow-page">
      <div className="photo-flow-container">
        <button className="photo-back-btn" type="button" onClick={() => navigate(-1)}>
          ← BACK
        </button>

        <div className="photo-stepper">
          <div className="photo-step done">1</div>
          <div className="photo-line active" />
          <div className="photo-step active">2</div>
          <div className="photo-line" />
          <div className="photo-step">3</div>
        </div>

        <h1 className="photo-title">Select a Photographer</h1>

        <div className="photo-vendor-grid">
          {filteredPhotographers.map((photographer) => (
            <article key={photographer.id} className="photo-vendor-card">
              <div className="photo-vendor-top">
                <h3>{photographer.name}</h3>
                <p>★ {photographer.rating}</p>
              </div>

              <p className="photo-vendor-city">{photographer.city}</p>
              <p className="photo-vendor-reviews">{photographer.reviews} reviews</p>

              <div className="photo-vendor-bottom">
                <strong>
                  ₹{photographer.pricePerHr.toLocaleString()}
                  <span>/hr</span>
                </strong>

                <button
                  className="photo-gold-btn photo-small-btn"
                  type="button"
                  onClick={() =>
                    navigate("/services/photography/confirm", {
                      state: {
                        photographyRequest,
                        selectedPhotographer: photographer,
                      },
                    })
                  }
                >
                  BOOK NOW
                </button>
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}
