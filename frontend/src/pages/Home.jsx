import { useNavigate } from "react-router-dom";
import {
  Calculator,
  Flower2,
  Bot,
  Camera,
  UtensilsCrossed,
  Shirt,
  MapPin,
  Sparkles,
  ChevronDown,
  Phone,
  Mail,
  Star,
  Quote
} from "lucide-react";
import "./Home.css";

function Home() {
  const navigate = useNavigate();
  const services = [
    { title: "Budget Tracker", description: "Smart expense management for your perfect event", icon: <Calculator size={34} /> },
    { title: "Decoration", description: "Exquisite themes from floral to royal grandeur", icon: <Flower2 size={34} /> },
    { title: "AI Help", description: "Intelligent planning assistant at your service", icon: <Bot size={34} /> },
    { title: "Photography", description: "Capture every precious moment beautifully", icon: <Camera size={34} /> },
    { title: "Food Supply", description: "Curated culinary experiences for every palate", icon: <UtensilsCrossed size={34} /> },
    { title: "Fashion Designing", description: "Bespoke styling for your special occasion", icon: <Shirt size={34} /> },
    { title: "Tourist Places", description: "Discover India's most enchanting destinations", icon: <MapPin size={34} /> },
    { title: "Makeup", description: "Transform with top beauty artists & studios", icon: <Sparkles size={34} /> },
  ];

  const galleryImages = [
    "https://images.unsplash.com/photo-1519225421980-715cb0215aed?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
    "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
    "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
    "https://images.unsplash.com/photo-1530103862676-de8892ebeea0?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
  ];

  const testimonials = [
    { name: "Priya & Rahul", review: "Infinity made our dream wedding a reality! Every detail was perfect, from the decorations to the catering.", rating: 5 },
    { name: "Aditya Sharma", review: "The AI planning tool saved us so much time. Highly recommend their photography and makeup services too.", rating: 5 },
    { name: "Neha Verma", review: "Exceptional service! We booked our corporate event through them and the venue selection was top notch.", rating: 4 },
  ];

  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="home-page">
      {/* NAVBAR */}
      <nav className="home-navbar">
        <div className="nav-brand">Infinity</div>
        <div className="nav-links">
          <button onClick={() => scrollTo("home")}>Home</button>
          <button onClick={() => scrollTo("about")}>About</button>
          <button onClick={() => scrollTo("services")}>Services</button>
          <button onClick={() => scrollTo("gallery")}>Gallery</button>
          <button onClick={() => scrollTo("testimonials")}>Reviews</button>
          <button onClick={() => scrollTo("contact")}>Contact</button>
        </div>
        <button className="nav-login-btn" onClick={() => navigate("/user/login")}>Login</button>
      </nav>

      {/* HERO SECTION */}
      <section className="hero-section" id="home">
        <div className="hero-overlay"></div>
        <div className="hero-content">
          <p className="hero-subtitle">Premier Event Management</p>
          <h1 className="hero-title">
            Welcome To<br />Infinity
          </h1>
          <div className="gold-line"></div>
          <p className="hero-description">
            Where every celebration becomes an unforgettable<br />masterpiece
          </p>
          <button className="explore-btn" onClick={() => navigate("/role-selection")}>
            Let’s Explore
          </button>
        </div>
        <button className="scroll-down-btn" onClick={() => scrollTo("about")}>
          <ChevronDown size={34} />
        </button>
      </section>

      {/* ABOUT SECTION */}
      <section className="about-section" id="about">
        <div className="section-container">
          <div className="about-content">
            <h2 className="section-title">Why Choose Infinity</h2>
            <div className="services-line" style={{margin: '28px 0'}}></div>
            <p className="about-text">
              At Infinity, we blend luxury with seamless execution to craft events that leave a lasting impression. 
              Our comprehensive platform connects you with elite vendors, intelligent budgeting tools, and dedicated planners.
              From intimate gatherings to grand celebrations, we ensure your vision is realized to perfection.
            </p>
            <div className="about-features">
              <div className="feature"><Star className="gold-icon"/> Premium Quality</div>
              <div className="feature"><Star className="gold-icon"/> Verified Vendors</div>
              <div className="feature"><Star className="gold-icon"/> 24/7 Support</div>
            </div>
          </div>
          <div className="about-image">
            <img src="https://images.unsplash.com/photo-1522673607200-164d1b6ce486?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80" alt="Luxury Event" />
          </div>
        </div>
      </section>

      {/* SERVICES SECTION */}
      <section className="services-section" id="services">
        <div className="services-header">
          <h2 className="section-title center">Our Services</h2>
          <div className="services-line"></div>
        </div>
        <div className="services-grid">
          {services.map((service, index) => (
            <div className="service-card" key={index}>
              <div className="service-icon">{service.icon}</div>
              <h3>{service.title}</h3>
              <p>{service.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* GALLERY SECTION */}
      <section className="gallery-section" id="gallery">
        <div className="services-header">
          <h2 className="section-title center">Past Events</h2>
          <div className="services-line"></div>
        </div>
        <div className="gallery-grid">
          {galleryImages.map((src, index) => (
            <div className="gallery-item" key={index}>
              <img src={src} alt={`Event ${index + 1}`} />
              <div className="gallery-overlay">
                <span>View Magical Moments</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* TESTIMONIALS SECTION */}
      <section className="testimonials-section" id="testimonials">
        <div className="services-header">
          <h2 className="section-title center">Customer Reviews</h2>
          <div className="services-line"></div>
        </div>
        <div className="testimonials-grid">
          {testimonials.map((testimonial, index) => (
            <div className="testimonial-card" key={index}>
              <Quote className="quote-icon" size={40} />
              <p className="testimonial-text">"{testimonial.review}"</p>
              <div className="testimonial-author">
                <div className="author-info">
                  <h4>{testimonial.name}</h4>
                  <div className="stars">
                    {[...Array(testimonial.rating)].map((_, i) => <Star key={i} size={16} className="star-icon" fill="currentColor" />)}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CONTACT SECTION */}
      <section className="contact-section" id="contact">
        <div className="contact-container">
          <div className="contact-info">
            <h2 className="section-title">Get in Touch</h2>
            <div className="services-line" style={{margin: '28px 0'}}></div>
            <p className="contact-desc">Ready to start planning? Contact our expert team today and let's create something extraordinary.</p>
            <div className="contact-details">
              <div className="contact-item">
                <Phone className="gold-icon" />
                <span>+91 98765 43210</span>
              </div>
              <div className="contact-item">
                <Mail className="gold-icon" />
                <span>hello@infinityevents.com</span>
              </div>
              <div className="contact-item">
                <MapPin className="gold-icon" />
                <span>Infinity Tower, Bandra West, Mumbai</span>
              </div>
            </div>
          </div>
          <div className="contact-form">
            <form onSubmit={(e) => e.preventDefault()}>
              <input type="text" placeholder="Your Name" required />
              <input type="email" placeholder="Your Email" required />
              <textarea placeholder="Message" rows="5" required></textarea>
              <button type="submit" className="submit-btn">Send Message</button>
            </form>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="home-footer">
        © 2026 <span>Infinity</span> — Luxury Event Management
      </footer>
    </div>
  );
}

export default Home;