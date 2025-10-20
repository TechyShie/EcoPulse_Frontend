import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Leaf, TrendingDown, Zap, Globe, ArrowRight, CheckCircle2, BarChart3, Smartphone, X, Mail, Phone, MessageCircle, Users } from 'lucide-react';
import Login from "./components/Login";
import Signup from "./components/Signup";
import './App.css';

const ContactModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const contacts = [
    {
      name: "shie",
      type: "Sales Inquiries",
      email: "shie@carbonai.com",
      phone: "+1 (555) 123-4568",
      description: "Questions about enterprise plans and pricing",
      icon: <Users className="icon" />,
      iconClass: "sales"
    },
    {
      name: "Caleb Muindi",
      type: "Technical Support",
      email: "Caleb@carbonai.com",
      phone: "+1 (555) 123-4569",
      description: "Technical questions and API integration help",
      icon: <Phone className="icon" />,
      iconClass: "technical"
    },
    {
      name: "Mwongera Martin",
      type: "Partnerships",
      email: "mmuthaura06@gmail.com",
      phone: "0791312163",
      description: "Business partnerships and collaboration opportunities",
      icon: <Mail className="icon" />,
      iconClass: "partnership"
    }
  ];

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>
          <X size={24} />
        </button>
        
        <h2 className="modal-title">Contact Us</h2>
        <p className="modal-description">
          Get in touch with our team. We're here to help you on your climate action journey.
        </p>
        
        <div className="contact-list">
          {contacts.map((contact, index) => (
            <div key={index} className="contact-item">
              <div className={`contact-icon ${contact.iconClass}`}>
                {contact.icon}
              </div>
              <div className="contact-details">
                <div className="contact-name">{contact.name}</div>
                <div className="contact-type">{contact.type}</div>
                <a href={`mailto:${contact.email}`} className="contact-email">
                  {contact.email}
                </a>
                <a href={`tel:${contact.phone}`} className="contact-phone">
                  {contact.phone}
                </a>
                <div className="contact-description">{contact.description}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

function HomePage() {
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);

  return (
    <>
      <ContactModal 
        isOpen={isContactModalOpen} 
        onClose={() => setIsContactModalOpen(false)} 
      />
      
      <header className="header">
        <nav className="nav">
          <div className="logo">
            <div className="logo-icon">
              <Leaf className="icon" />
            </div>
            <span className="logo-text">CarbonAI</span>
          </div>
          <div className="nav-links">
            <a href="#features" className="nav-link"><b>Features</b></a>
            <a href="#how-it-works" className="nav-link"><b>How it works</b></a>
            <a href="/login" className="nav-link"><b>Sign In</b></a>
            <a href="/signup" className="btn-primary"><b>Get Started</b></a>
          </div>
        </nav>
      </header>

      <main>
        {/* Hero Section */}
        <section className="hero-section">
          <div className="hero-content">
            <div className="hero-text">
              <div className="badge">
                <span>AI-Powered Climate Action</span>
              </div>
              <h1 className="hero-title">
                Track Your Carbon Footprint with <span className="highlight">Intelligence</span>
              </h1>
              <p className="hero-description">
                Make a real impact on climate change. Our AI analyzes your daily activities and provides personalized insights to reduce your carbon emissions effortlessly.
              </p>
              <div className="hero-stats">
                <div className="stat">
                  <div className="stat-number">50k+</div>
                  <div className="stat-label">Active Users</div>
                </div>
                <div className="stat-divider"></div>
                <div className="stat">
                  <div className="stat-number">2M+</div>
                  <div className="stat-label">Tons CO₂ Saved</div>
                </div>
              </div>
            </div>

            <div className="hero-card-wrapper">
              <div className="hero-card">
                <div className="impact-card">
                  <div className="impact-header">
                    <h3>Your Impact Today</h3>
                    <TrendingDown className="impact-icon" />
                  </div>
                  <div className="impact-items">
                    <div className="impact-item energy">
                      <div className="impact-item-left">
                        <div className="impact-item-icon">
                          <Zap className="icon-sm" />
                        </div>
                        <span>Energy</span>
                      </div>
                      <span className="impact-value">-23%</span>
                    </div>
                    <div className="impact-item travel">
                      <div className="impact-item-left">
                        <div className="impact-item-icon">
                          <Globe className="icon-sm" />
                        </div>
                        <span>Travel</span>
                      </div>
                      <span className="impact-value">-15%</span>
                    </div>
                    <div className="impact-item food">
                      <div className="impact-item-left">
                        <div className="impact-item-icon">
                          <BarChart3 className="icon-sm" />
                        </div>
                        <span>Food</span>
                      </div>
                      <span className="impact-value">-8%</span>
                    </div>
                  </div>
                  <div className="impact-total">
                    <div className="total-content">
                      <div className="total-number">4.2kg</div>
                      <div className="total-label">CO₂ Saved Today</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        
        <section id="features" className="features-section">
          <div className="section-header">
            <h2 className="section-title">Powerful Features for Climate Action</h2>
            <p className="section-description">
              Everything you need to understand and reduce your environmental impact
            </p>
          </div>
          <div className="features-grid">
            <div className="feature-card feature-emerald">
              <div className="feature-icon emerald">
                <Zap className="icon-lg" />
              </div>
              <h3 className="feature-title">Real-Time Tracking</h3>
              <p className="feature-description">
                Automatically monitor your carbon footprint across transportation, energy, food, and shopping with AI-powered analysis.
              </p>
            </div>
            <div className="feature-card feature-blue">
              <div className="feature-icon blue">
                <BarChart3 className="icon-lg" />
              </div>
              <h3 className="feature-title">Smart Insights</h3>
              <p className="feature-description">
                Get personalized recommendations based on your lifestyle patterns and see exactly where you can make the biggest impact.
              </p>
            </div>
            <div className="feature-card feature-orange">
              <div className="feature-icon orange">
                <Smartphone className="icon-lg" />
              </div>
              <h3 className="feature-title">Mobile First</h3>
              <p className="feature-description">
                Track on-the-go with our intuitive mobile app. Log activities instantly and stay mindful of your environmental choices.
              </p>
            </div>
          </div>
        </section>

       
        <section id="how-it-works" className="how-it-works-section">
          <div className="section-header">
            <h2 className="section-title"><b>How It Works</b></h2>
            <p className="section-description">
              Three simple steps to start making a difference
            </p>
          </div>
          <div className="steps-grid">
            <div className="step">
              <div className="step-number">1</div>
              <h3 className="step-title">Connect & Track</h3>
              <p className="step-description">
                Link your daily activities and let our AI automatically calculate your carbon footprint in real-time.
              </p>
            </div>
            <div className="step">
              <div className="step-number">2</div>
              <h3 className="step-title">Get Insights</h3>
              <p className="step-description">
                Receive personalized recommendations and discover which changes will have the most significant impact.
              </p>
            </div>
            <div className="step">
              <div className="step-number">3</div>
              <h3 className="step-title">Take Action</h3>
              <p className="step-description">
                Follow guided challenges, track your progress, and watch your carbon footprint decrease over time.
              </p>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="cta-section">
          <div className="cta-card">
            <div className="cta-content">
              <h2 className="cta-title">Ready to Make a Difference?</h2>
              <p className="cta-description">
                Join thousands of users taking climate action today. Start tracking your carbon footprint for free.
              </p>
              <div className="cta-button-wrapper">
                <a href="/signup" className="btn-cta-large">
                  <span>Get Started </span>
                  <ArrowRight className="btn-icon" />
                </a>
              </div>
              <div className="cta-features">
                <div className="cta-feature">
                </div>
                </div>
              </div>
            </div>
        </section>
      </main>

      <footer className="footer">
        <div className="footer-content">
          <div className="footer-logo">
            <div className="logo-icon">
              <Leaf className="icon" />
            </div>
            <span className="logo-text">CarbonAI</span>
          </div>
          <div className="footer-links">
            <button 
              className="btn-contact"
              onClick={() => setIsContactModalOpen(true)}
            >
              <b>Contact</b>
            </button>
          </div>
          <div className="footer-copyright">
            © 2025 CarbonAI. All rights reserved.
          </div>
        </div>
      </footer>
    </>
  );
}

function App() {
  return (
    <Router>
      <div className="app-container">
        <div className="leaves-background">
          {Array.from({ length: 200 }).map((_, i) => (
            <div
              key={i}
              className="leaf"
              style={{
                left: `${Math.random() * 100}%`,
                width: `${10 + Math.random() * 25}px`,
                height: `${10 + Math.random() * 25}px`,
                animationDuration: `${10 + Math.random() * 20}s`,
                animationDelay: `${Math.random() * 5}s`,
                transform: `rotate(${Math.random() * 360}deg)`
              }}
            ></div>
          ))}
        </div>

        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;