import { useNavigate } from "react-router-dom";
import "./FashionFlow.css";

const designers = [
  { id: 1, name: "SABYASACHI STUDIO", city: "Kolkata", rating: 4.9, reviews: 678, pricePerHr: 8000 },
  { id: 2, name: "MANISH MALHOTRA ATELIER", city: "Mumbai", rating: 4.9, reviews: 589, pricePerHr: 10000 },
  { id: 3, name: "ANITA DONGRE DESIGN", city: "Jaipur", rating: 4.8, reviews: 432, pricePerHr: 7000 },
  { id: 4, name: "TARUN TAHILIANI", city: "Delhi", rating: 4.8, reviews: 398, pricePerHr: 9000 },
  { id: 5, name: "RITU KUMAR COUTURE", city: "Delhi", rating: 4.7, reviews: 345, pricePerHr: 6000 },
  { id: 6, name: "ROYAL THREADS", city: "Jaipur", rating: 4.6, reviews: 234, pricePerHr: 4000 },
  { id: 7, name: "ABU JANI SANDEEP KHOSLA", city: "Mumbai", rating: 4.9, reviews: 522, pricePerHr: 11000 },
  { id: 8, name: "PAYAL SINGHAL STUDIO", city: "Delhi", rating: 4.7, reviews: 287, pricePerHr: 6500 },
  { id: 9, name: "MASABA HOUSE", city: "Mumbai", rating: 4.6, reviews: 301, pricePerHr: 5800 },
  { id: 10, name: "RAW MANGO BY SANJAY", city: "Bengaluru", rating: 4.8, reviews: 276, pricePerHr: 7200 },
  { id: 11, name: "KALKI COUTURE", city: "Ahmedabad", rating: 4.7, reviews: 418, pricePerHr: 6200 },
  { id: 12, name: "NEETA LULLA ATELIER", city: "Mumbai", rating: 4.8, reviews: 356, pricePerHr: 8500 },
  { id: 13, name: "SHYAM NARAYAN TAILORS", city: "Lucknow", rating: 4.5, reviews: 198, pricePerHr: 3200 },
  { id: 14, name: "HERITAGE BESPOKE HOUSE", city: "Hyderabad", rating: 4.6, reviews: 246, pricePerHr: 4500 },
  { id: 15, name: "URBAN STITCH LAB", city: "Pune", rating: 4.5, reviews: 173, pricePerHr: 3000 },
  { id: 16, name: "ZARDOZI ROYAL CRAFT", city: "Jaipur", rating: 4.7, reviews: 211, pricePerHr: 5000 },
  { id: 17, name: "THREAD & VEIL STUDIO", city: "Chandigarh", rating: 4.6, reviews: 188, pricePerHr: 3600 },
  { id: 18, name: "THE GROOM ROOM TAILORS", city: "Delhi", rating: 4.7, reviews: 262, pricePerHr: 4100 },
  { id: 19, name: "VELVET DRAPE COUTURE", city: "Mumbai", rating: 4.8, reviews: 309, pricePerHr: 7600 },
  { id: 20, name: "REGAL WEAVES STUDIO", city: "Varanasi", rating: 4.6, reviews: 156, pricePerHr: 3400 },
  { id: 21, name: "RAMP READY DESIGN LAB", city: "Bengaluru", rating: 4.7, reviews: 267, pricePerHr: 6800 },
  { id: 22, name: "BRIDAL BLOOM ATELIER", city: "Indore", rating: 4.5, reviews: 142, pricePerHr: 2900 },
  { id: 23, name: "ETHNIC EDGE TAILORING", city: "Surat", rating: 4.6, reviews: 194, pricePerHr: 3300 },
  { id: 24, name: "CROWN CUT BESPOKE", city: "Chennai", rating: 4.7, reviews: 224, pricePerHr: 4700 },
  { id: 25, name: "AURUM DESIGN COLLECTIVE", city: "Kolkata", rating: 4.8, reviews: 281, pricePerHr: 7100 },
];

export default function FashionDesigning() {
  const navigate = useNavigate();

  const onBookNow = (designer) => {
    navigate("/fashion/confirm", { state: { selectedDesigner: designer } });
  };

  return (
    <div className="fashion-page">
      <div className="fashion-container">
        <button className="fashion-back-btn" type="button" onClick={() => navigate(-1)}>
          ← BACK
        </button>

        <h1 className="fashion-title">TOP DESIGNERS &amp; TAILORS</h1>

        <div className="designer-grid">
          {designers.map((d) => (
            <div className="designer-card" key={d.id}>
              <div className="designer-main">
                <h3>{d.name}</h3>
                <p className="city">{d.city}</p>
                <p className="reviews">{d.reviews} reviews</p>
                <p className="price">
                  ₹{d.pricePerHr.toLocaleString()}
                  <span>/hr</span>
                </p>
              </div>

              <div className="designer-right">
                <p className="rating">★ {d.rating}</p>
                <button className="book-btn" type="button" onClick={() => onBookNow(d)}>
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