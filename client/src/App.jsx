import { Leaf, TrendingDown, Zap, Globe, ArrowRight, CheckCircle2, BarChart3, Smartphone } from 'lucide-react';
import './App.css';

function App() {
  return (
    <div className="app-container">
      <header className="header">
        <nav className="nav">
          <div className="logo">
            <div className="logo-icon">
              <Leaf className="icon" />
            </div>
            <span className="logo-text">CarbonAI</span>
          </div>
          <div className="nav-links">
            <a href="#features" className="nav-link">Features</a>
            <a href="#how-it-works" className="nav-link">How It Works</a>
            <a href="#pricing" className="nav-link">Pricing</a>
            <button className="btn-primary">Get Started</button>
          </div>
        </nav>
      </header>

      <main>
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
              <div className="hero-buttons">
                <button className="btn-cta">
                  <span>Start Tracking Free</span>
                  <ArrowRight className="btn-icon" />
                </button>
                <button className="btn-secondary">Watch Demo</button>
              </div>
              <div className="hero-stats">
                <div className="stat">
                  <div className="stat-number">50K+</div>
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
            <h2 className="section-title">How It Works</h2>
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

        <section className="cta-section">
          <div className="cta-card">
            <div className="cta-content">
              <h2 className="cta-title">Ready to Make a Difference?</h2>
              <p className="cta-description">
                Join thousands of users taking climate action today. Start tracking your carbon footprint for free.
              </p>
              <div className="cta-button-wrapper">
                <button className="btn-cta-large">
                  <span>Get Started Free</span>
                  <ArrowRight className="btn-icon" />
                </button>
              </div>
              <div className="cta-features">
                <div className="cta-feature">
                  <CheckCircle2 className="check-icon" />
                  <span>No credit card required</span>
                </div>
                <div className="cta-feature">
                  <CheckCircle2 className="check-icon" />
                  <span>Free forever</span>
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
            <a href="#" className="footer-link">Privacy</a>
            <a href="#" className="footer-link">Terms</a>
            <a href="#" className="footer-link">Contact</a>
          </div>
          <div className="footer-copyright">
            © 2025 CarbonAI. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
