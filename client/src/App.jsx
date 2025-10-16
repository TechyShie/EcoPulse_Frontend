import { Leaf, TrendingDown, Zap, Globe, ArrowRight, CheckCircle2, BarChart3, Smartphone } from 'lucide-react';
import './index.css';


function App() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50 to-white">
      <header className="container mx-auto px-6 py-8">
        <nav className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="bg-emerald-600 p-2 rounded-lg">
              <Leaf className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold text-gray-900">CarbonAI</span>
          </div>
          <div className="hidden md:flex items-center space-x-8">
            <a href="#features" className="text-gray-700 hover:text-emerald-600 transition-colors font-medium">Features</a>
            <a href="#how-it-works" className="text-gray-700 hover:text-emerald-600 transition-colors font-medium">How It Works</a>
            <a href="#pricing" className="text-gray-700 hover:text-emerald-600 transition-colors font-medium">Pricing</a>
            <button className="bg-emerald-600 text-white px-6 py-2.5 rounded-lg hover:bg-emerald-700 transition-all transform hover:scale-105 font-medium shadow-lg shadow-emerald-600/30">
              Get Started
            </button>
          </div>
        </nav>
      </header>

      <main>
        <section className="container mx-auto px-6 py-20 md:py-32">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="inline-block">
                <span className="bg-emerald-100 text-emerald-700 px-4 py-2 rounded-full text-sm font-semibold">
                  AI-Powered Climate Action
                </span>
              </div>
              <h1 className="text-5xl md:text-6xl font-bold text-gray-900 leading-tight">
                Track Your Carbon Footprint with <span className="text-emerald-600">Intelligence</span>
              </h1>
              <p className="text-xl text-gray-600 leading-relaxed">
                Make a real impact on climate change. Our AI analyzes your daily activities and provides personalized insights to reduce your carbon emissions effortlessly.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <button className="bg-emerald-600 text-white px-8 py-4 rounded-lg hover:bg-emerald-700 transition-all transform hover:scale-105 font-semibold text-lg shadow-xl shadow-emerald-600/30 flex items-center justify-center space-x-2">
                  <span>Start Tracking Free</span>
                  <ArrowRight className="w-5 h-5" />
                </button>
                <button className="border-2 border-gray-300 text-gray-700 px-8 py-4 rounded-lg hover:border-emerald-600 hover:text-emerald-600 transition-all font-semibold text-lg">
                  Watch Demo
                </button>
              </div>
              <div className="flex items-center space-x-8 pt-4">
                <div>
                  <div className="text-3xl font-bold text-gray-900">50K+</div>
                  <div className="text-gray-600 text-sm">Active Users</div>
                </div>
                <div className="h-12 w-px bg-gray-300"></div>
                <div>
                  <div className="text-3xl font-bold text-gray-900">2M+</div>
                  <div className="text-gray-600 text-sm">Tons CO₂ Saved</div>
                </div>
              </div>
            </div>
            <div className="relative">
              <div className="bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl p-8 shadow-2xl transform rotate-3 hover:rotate-0 transition-transform duration-300">
                <div className="bg-white rounded-xl p-6 space-y-6">
                  <div className="flex items-center justify-between">
                    <h3 className="font-bold text-gray-900 text-lg">Your Impact Today</h3>
                    <TrendingDown className="w-6 h-6 text-emerald-600" />
                  </div>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-emerald-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="bg-emerald-600 p-2 rounded-lg">
                          <Zap className="w-5 h-5 text-white" />
                        </div>
                        <span className="font-medium text-gray-900">Energy</span>
                      </div>
                      <span className="font-bold text-emerald-600">-23%</span>
                    </div>
                    <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="bg-blue-600 p-2 rounded-lg">
                          <Globe className="w-5 h-5 text-white" />
                        </div>
                        <span className="font-medium text-gray-900">Travel</span>
                      </div>
                      <span className="font-bold text-blue-600">-15%</span>
                    </div>
                    <div className="flex items-center justify-between p-4 bg-orange-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="bg-orange-600 p-2 rounded-lg">
                          <BarChart3 className="w-5 h-5 text-white" />
                        </div>
                        <span className="font-medium text-gray-900">Food</span>
                      </div>
                      <span className="font-bold text-orange-600">-8%</span>
                    </div>
                  </div>
                  <div className="pt-4 border-t border-gray-200">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-gray-900">4.2kg</div>
                      <div className="text-gray-600 text-sm">CO₂ Saved Today</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="features" className="bg-white py-20">
          <div className="container mx-auto px-6">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                Powerful Features for Climate Action
              </h2>
              <p className="text-xl text-gray-600">
                Everything you need to understand and reduce your environmental impact
              </p>
            </div>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-gradient-to-br from-emerald-50 to-teal-50 p-8 rounded-2xl hover:shadow-xl transition-shadow">
                <div className="bg-emerald-600 w-14 h-14 rounded-xl flex items-center justify-center mb-6">
                  <Zap className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Real-Time Tracking</h3>
                <p className="text-gray-600 leading-relaxed">
                  Automatically monitor your carbon footprint across transportation, energy, food, and shopping with AI-powered analysis.
                </p>
              </div>
              <div className="bg-gradient-to-br from-blue-50 to-cyan-50 p-8 rounded-2xl hover:shadow-xl transition-shadow">
                <div className="bg-blue-600 w-14 h-14 rounded-xl flex items-center justify-center mb-6">
                  <BarChart3 className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Smart Insights</h3>
                <p className="text-gray-600 leading-relaxed">
                  Get personalized recommendations based on your lifestyle patterns and see exactly where you can make the biggest impact.
                </p>
              </div>
              <div className="bg-gradient-to-br from-orange-50 to-amber-50 p-8 rounded-2xl hover:shadow-xl transition-shadow">
                <div className="bg-orange-600 w-14 h-14 rounded-xl flex items-center justify-center mb-6">
                  <Smartphone className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Mobile First</h3>
                <p className="text-gray-600 leading-relaxed">
                  Track on-the-go with our intuitive mobile app. Log activities instantly and stay mindful of your environmental choices.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section id="how-it-works" className="py-20 bg-gradient-to-b from-white to-emerald-50">
          <div className="container mx-auto px-6">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                How It Works
              </h2>
              <p className="text-xl text-gray-600">
                Three simple steps to start making a difference
              </p>
            </div>
            <div className="grid md:grid-cols-3 gap-12 max-w-5xl mx-auto">
              <div className="text-center space-y-4">
                <div className="bg-emerald-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto text-white text-2xl font-bold shadow-lg shadow-emerald-600/30">
                  1
                </div>
                <h3 className="text-2xl font-bold text-gray-900">Connect & Track</h3>
                <p className="text-gray-600 leading-relaxed">
                  Link your daily activities and let our AI automatically calculate your carbon footprint in real-time.
                </p>
              </div>
              <div className="text-center space-y-4">
                <div className="bg-emerald-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto text-white text-2xl font-bold shadow-lg shadow-emerald-600/30">
                  2
                </div>
                <h3 className="text-2xl font-bold text-gray-900">Get Insights</h3>
                <p className="text-gray-600 leading-relaxed">
                  Receive personalized recommendations and discover which changes will have the most significant impact.
                </p>
              </div>
              <div className="text-center space-y-4">
                <div className="bg-emerald-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto text-white text-2xl font-bold shadow-lg shadow-emerald-600/30">
                  3
                </div>
                <h3 className="text-2xl font-bold text-gray-900">Take Action</h3>
                <p className="text-gray-600 leading-relaxed">
                  Follow guided challenges, track your progress, and watch your carbon footprint decrease over time.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="py-20 bg-emerald-600">
          <div className="container mx-auto px-6">
            <div className="max-w-4xl mx-auto bg-white rounded-3xl p-12 shadow-2xl">
              <div className="text-center space-y-6">
                <h2 className="text-4xl md:text-5xl font-bold text-gray-900">
                  Ready to Make a Difference?
                </h2>
                <p className="text-xl text-gray-600">
                  Join thousands of users taking climate action today. Start tracking your carbon footprint for free.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                  <button className="bg-emerald-600 text-white px-8 py-4 rounded-lg hover:bg-emerald-700 transition-all transform hover:scale-105 font-semibold text-lg shadow-xl shadow-emerald-600/30 flex items-center justify-center space-x-2">
                    <span>Get Started Free</span>
                    <ArrowRight className="w-5 h-5" />
                  </button>
                </div>
                <div className="flex items-center justify-center space-x-8 pt-8">
                  <div className="flex items-center space-x-2 text-gray-700">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                    <span className="font-medium">No credit card required</span>
                  </div>
                  <div className="flex items-center space-x-2 text-gray-700">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                    <span className="font-medium">Free forever</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-gray-900 text-gray-400 py-12">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="flex items-center space-x-2">
              <div className="bg-emerald-600 p-2 rounded-lg">
                <Leaf className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-white">CarbonAI</span>
            </div>
            <div className="flex space-x-8">
              <a href="#" className="hover:text-white transition-colors">Privacy</a>
              <a href="#" className="hover:text-white transition-colors">Terms</a>
              <a href="#" className="hover:text-white transition-colors">Contact</a>
            </div>
            <div className="text-sm">
              © 2025 CarbonAI. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
