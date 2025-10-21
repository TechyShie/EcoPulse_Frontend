import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const Dashboard = () => {
  const [dashboardData, setDashboardData] = useState({});
  const [loading, setLoading] = useState(true);
  const [expandedSections, setExpandedSections] = useState({
    activities: false,
    goals: false,
    settings: false
  });

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  // API service for fetching dashboard data
  const fetchDashboardData = async () => {
    try {
      // In a real app, this would be an API call
      // const response = await fetch('/api/dashboard');
      // const data = await response.json();

      // For now, using mock data with simulated API delay
      const mockData = {
        totalEmissions: 1247.5,
        ecoScore: 82,
        activeProjects: 12,
        weeklyGoal: 1500,
        monthlyTrend: -12.5,
        recentActivities: [
          { id: 1, description: 'Flight to London', category: 'travel', carbon_emission: 450.2, created_at: '2024-01-15' },
          { id: 2, description: 'Weekly groceries', category: 'food', carbon_emission: 67.8, created_at: '2024-01-14' },
          { id: 3, description: 'Electric bill', category: 'energy', carbon_emission: 89.3, created_at: '2024-01-13' },
          { id: 4, description: 'Bus commute', category: 'transport', carbon_emission: 12.1, created_at: '2024-01-12' }
        ]
      };

      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1500));

      return mockData;
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      throw error;
    }
  };

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        const data = await fetchDashboardData();
        setDashboardData(data);
        setLoading(false);
      } catch (error) {
        console.error('Failed to load dashboard:', error);
        setLoading(false);
      }
    };

    loadDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-green-900 to-emerald-900 flex items-center justify-center">
        <div className="text-center space-y-8">
          <div className="inline-flex items-center gap-4 px-8 py-4 bg-gradient-to-r from-white/15 to-white/10 backdrop-blur-md rounded-full border-2 border-white/30 shadow-2xl">
            <div className="relative">
              <div className="w-4 h-4 bg-gradient-to-r from-green-400 to-emerald-400 rounded-full animate-pulse shadow-lg"></div>
              <div className="absolute inset-0 w-4 h-4 bg-gradient-to-r from-green-400 to-emerald-400 rounded-full animate-ping"></div>
            </div>
            <span className="text-green-100 font-semibold text-lg tracking-wide">LOADING DASHBOARD</span>
          </div>

          <div className="space-y-4">
            <div className="w-96 h-8 bg-white/10 rounded-full animate-pulse mx-auto"></div>
            <div className="w-80 h-6 bg-white/5 rounded-full animate-pulse mx-auto"></div>
          </div>

          <div className="grid grid-cols-3 gap-6 max-w-2xl mx-auto">
            <div className="h-32 bg-white/10 rounded-2xl animate-pulse"></div>
            <div className="h-32 bg-white/10 rounded-2xl animate-pulse"></div>
            <div className="h-32 bg-white/10 rounded-2xl animate-pulse"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #ecfdf5 0%, #f0fdf4 100%)',
      width: '100%',
      position: 'relative',
      zIndex: 100
    }}>
      {/* Override the leaves background */}
      <style>{`
        .leaves-background {
          display: none !important;
        }
        .app-container {
          background: transparent !important;
        }
      `}</style>

      {/* MAIN CONTENT AREA - FULL WIDTH */}
      <main style={{
        padding: '40px',
        background: 'transparent',
        minHeight: '100vh',
        position: 'relative',
        zIndex: 200,
        overflowY: 'auto'
      }}>
        <h1 style={{
          color: '#111827',
          fontSize: '3rem',
          fontWeight: 'bold',
          textAlign: 'center',
          marginBottom: '3rem',
          textShadow: '2px 2px 4px rgba(0,0,0,0.1)'
        }}>
          Environmental Impact Dashboard
        </h1>

        {/* MAIN LAYOUT - LEFT SECTIONS, RIGHT CONTENT */}
        <div style={{
          display: 'flex',
          gap: '2rem',
          maxWidth: '1600px',
          margin: '0 auto',
          alignItems: 'flex-start'
        }}>

          {/* LEFT SIDE - COMPACT SECTIONS */}
          <div style={{
            width: '300px',
            display: 'flex',
            flexDirection: 'column',
            gap: '1.5rem'
          }}>

            {/* ACTIVITIES SECTION - COMPACT VERTICAL */}
            <div style={{
              background: 'linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%)',
              color: '#111827',
              borderRadius: '1rem',
              border: expandedSections.activities ? '4px solid #059669' : '2px solid #059669',
              minHeight: expandedSections.activities ? '250px' : '80px',
              position: 'relative',
              zIndex: '100',
              boxShadow: '0 8px 20px rgba(5, 150, 105, 0.2)',
              cursor: 'pointer',
              transition: 'all 0.3s ease'
            }}
            onClick={() => toggleSection('activities')}>
              <div style={{
                padding: '1rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}>
                <h2 style={{
                  fontSize: expandedSections.activities ? '1.5rem' : '1.1rem',
                  fontWeight: 'bold',
                  color: '#111827',
                  margin: 0,
                  textShadow: '2px 2px 4px rgba(0,0,0,0.1)',
                  transition: 'font-size 0.3s ease'
                }}>
                  📋 Activities {expandedSections.activities ? '▼' : '▶'}
                </h2>
              </div>

              {expandedSections.activities && (
                <div style={{
                  padding: '0 1rem 1rem 1rem'
                }}>
                  <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.75rem'
                  }}>
                    {dashboardData.recentActivities.map((activity) => (
                      <div
                        key={activity.id}
                        style={{
                          background: 'rgba(255, 255, 255, 0.9)',
                          borderRadius: '0.5rem',
                          padding: '0.75rem',
                          border: '2px solid rgba(5, 150, 105, 0.8)',
                          textAlign: 'center',
                          backdropFilter: 'blur(10px)',
                          boxShadow: '0 2px 8px rgba(5, 150, 105, 0.1)'
                        }}
                      >
                        <h3 style={{
                          fontSize: '0.8rem',
                          fontWeight: 'bold',
                          color: '#111827',
                          marginBottom: '0.25rem'
                        }}>
                          {activity.description}
                        </h3>
                        <p style={{
                          fontSize: '1.2rem',
                          fontWeight: '900',
                          color: '#059669',
                          marginBottom: '0.25rem'
                        }}>
                          {activity.carbon_emission}kg CO₂
                        </p>
                        <span style={{
                          background: 'rgba(5, 150, 105, 0.9)',
                          color: 'white',
                          padding: '0.2rem 0.4rem',
                          borderRadius: '0.4rem',
                          fontSize: '0.6rem',
                          textTransform: 'uppercase',
                          border: '1px solid rgba(16, 185, 129, 0.6)'
                        }}>
                          {activity.category}
                        </span>
                      </div>
                    ))}

                    {/* View All Logs Link */}
                    <Link
                      to="/logs"
                      style={{
                        background: 'linear-gradient(135deg, #059669 0%, #10b981 100%)',
                        color: 'white',
                        border: 'none',
                        borderRadius: '0.5rem',
                        padding: '0.75rem 1rem',
                        fontSize: '0.8rem',
                        fontWeight: 'bold',
                        textDecoration: 'none',
                        textAlign: 'center',
                        cursor: 'pointer',
                        transition: 'all 0.3s ease',
                        boxShadow: '0 2px 8px rgba(5, 150, 105, 0.3)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '0.5rem'
                      }}
                      onMouseEnter={(e) => {
                        e.target.style.transform = 'translateY(-2px)';
                        e.target.style.boxShadow = '0 4px 15px rgba(5, 150, 105, 0.4)';
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.transform = 'translateY(0)';
                        e.target.style.boxShadow = '0 2px 8px rgba(5, 150, 105, 0.3)';
                      }}
                    >
                      📋 View All Logs
                    </Link>
                  </div>
                </div>
              )}
            </div>

            {/* GOALS SECTION - COMPACT VERTICAL */}
            <div style={{
              background: 'linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)',
              color: '#111827',
              borderRadius: '1rem',
              border: expandedSections.goals ? '4px solid #059669' : '2px solid #059669',
              minHeight: expandedSections.goals ? '250px' : '80px',
              position: 'relative',
              zIndex: '100',
              boxShadow: '0 8px 20px rgba(5, 150, 105, 0.2)',
              cursor: 'pointer',
              transition: 'all 0.3s ease'
            }}
            onClick={() => toggleSection('goals')}>
              <div style={{
                padding: '1rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}>
                <h2 style={{
                  fontSize: expandedSections.goals ? '1.5rem' : '1.1rem',
                  fontWeight: 'bold',
                  color: '#111827',
                  margin: 0,
                  textShadow: '2px 2px 4px rgba(0,0,0,0.1)',
                  transition: 'font-size 0.3s ease'
                }}>
                  🎯 Goals {expandedSections.goals ? '▼' : '▶'}
                </h2>
              </div>

              {expandedSections.goals && (
                <div style={{
                  padding: '0 1rem 1rem 1rem'
                }}>
                  <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.75rem'
                  }}>
                    <div style={{
                      background: 'rgba(255, 255, 255, 0.9)',
                      borderRadius: '0.5rem',
                      padding: '0.75rem',
                      border: '2px solid rgba(5, 150, 105, 0.8)',
                      textAlign: 'center',
                      backdropFilter: 'blur(10px)',
                      boxShadow: '0 2px 8px rgba(5, 150, 105, 0.1)'
                    }}>
                      <h3 style={{
                        fontSize: '0.8rem',
                        fontWeight: 'bold',
                        color: '#111827',
                        marginBottom: '0.25rem'
                      }}>
                        Weekly Goal
                      </h3>
                      <p style={{
                        fontSize: '0.7rem',
                        color: '#047857',
                        marginBottom: '0.25rem'
                      }}>
                        Current: {dashboardData.totalEmissions.toFixed(1)} kg CO₂
                      </p>
                      <p style={{
                        fontSize: '0.7rem',
                        color: '#047857',
                        marginBottom: '0.25rem'
                      }}>
                        Goal: {dashboardData.weeklyGoal} kg CO₂
                      </p>
                      <div style={{
                        width: '100%',
                        height: '6px',
                        background: 'rgba(236, 253, 245, 0.8)',
                        borderRadius: '3px',
                        border: '1px solid rgba(5, 150, 105, 0.6)',
                        marginBottom: '0.25rem'
                      }}>
                        <div
                          style={{
                            height: '100%',
                            background: 'linear-gradient(90deg, #059669, #10b981)',
                            borderRadius: '2px',
                            width: `${Math.min((dashboardData.totalEmissions / dashboardData.weeklyGoal) * 100, 100)}%`
                          }}
                        />
                      </div>
                      <p style={{
                        fontSize: '0.6rem',
                        fontWeight: 'bold',
                        color: dashboardData.totalEmissions < dashboardData.weeklyGoal ? '#059669' : '#ca8a04'
                      }}>
                        {dashboardData.totalEmissions < dashboardData.weeklyGoal
                          ? `🎉 ${dashboardData.weeklyGoal - dashboardData.totalEmissions}kg left`
                          : '🏆 Goal achieved!'
                        }
                      </p>
                    </div>

                    <div style={{
                      background: 'rgba(255, 255, 255, 0.9)',
                      borderRadius: '0.5rem',
                      padding: '0.75rem',
                      border: '2px solid rgba(5, 150, 105, 0.8)',
                      textAlign: 'center',
                      backdropFilter: 'blur(10px)',
                      boxShadow: '0 2px 8px rgba(5, 150, 105, 0.1)'
                    }}>
                      <h3 style={{
                        fontSize: '0.8rem',
                        fontWeight: 'bold',
                        color: '#111827',
                        marginBottom: '0.25rem'
                      }}>
                        Monthly Challenge
                      </h3>
                      <p style={{
                        fontSize: '0.7rem',
                        color: '#047857',
                        marginBottom: '0.25rem'
                      }}>
                        Reduce emissions by 15%
                      </p>
                      <div style={{
                        width: '100%',
                        height: '6px',
                        background: 'rgba(236, 253, 245, 0.8)',
                        borderRadius: '3px',
                        border: '1px solid rgba(5, 150, 105, 0.6)',
                        marginBottom: '0.25rem'
                      }}>
                        <div
                          style={{
                            height: '100%',
                            background: 'linear-gradient(90deg, #059669, #10b981)',
                            borderRadius: '2px',
                            width: `${Math.max(0, 100 - Math.abs(dashboardData.monthlyTrend))}%`
                          }}
                        />
                      </div>
                      <p style={{
                        fontSize: '0.6rem',
                        fontWeight: 'bold',
                        color: dashboardData.monthlyTrend < 0 ? '#059669' : '#ea580c'
                      }}>
                        {dashboardData.monthlyTrend < 0
                          ? `🎉 ${Math.abs(dashboardData.monthlyTrend)}% reduction!`
                          : 'Keep working!'
                        }
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* SETTINGS SECTION - COMPACT VERTICAL */}
            <div style={{
              background: 'linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%)',
              color: '#111827',
              borderRadius: '1rem',
              border: expandedSections.settings ? '4px solid #059669' : '2px solid #059669',
              minHeight: expandedSections.settings ? '250px' : '80px',
              position: 'relative',
              zIndex: '100',
              boxShadow: '0 8px 20px rgba(5, 150, 105, 0.2)',
              cursor: 'pointer',
              transition: 'all 0.3s ease'
            }}
            onClick={() => toggleSection('settings')}>
              <div style={{
                padding: '1rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}>
                <h2 style={{
                  fontSize: expandedSections.settings ? '1.5rem' : '1.1rem',
                  fontWeight: 'bold',
                  color: '#111827',
                  margin: 0,
                  textShadow: '2px 2px 4px rgba(0,0,0,0.1)',
                  transition: 'font-size 0.3s ease'
                }}>
                  ⚙️ Settings {expandedSections.settings ? '▼' : '▶'}
                </h2>
              </div>

              {expandedSections.settings && (
                <div style={{
                  padding: '0 1rem 1rem 1rem'
                }}>
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr',
                    gap: '0.75rem'
                  }}>
                    <div style={{
                      background: 'rgba(255, 255, 255, 0.9)',
                      borderRadius: '0.5rem',
                      padding: '0.75rem',
                      border: '2px solid rgba(5, 150, 105, 0.8)',
                      textAlign: 'center',
                      backdropFilter: 'blur(10px)',
                      boxShadow: '0 2px 8px rgba(5, 150, 105, 0.1)'
                    }}>
                      <h3 style={{
                        fontSize: '0.8rem',
                        fontWeight: 'bold',
                        color: '#111827',
                        marginBottom: '0.25rem'
                      }}>
                        Notifications
                      </h3>
                      <p style={{
                        fontSize: '0.7rem',
                        color: '#059669'
                      }}>
                        Daily reminders enabled
                      </p>
                    </div>

                    <div style={{
                      background: 'rgba(255, 255, 255, 0.9)',
                      borderRadius: '0.5rem',
                      padding: '0.75rem',
                      border: '2px solid rgba(5, 150, 105, 0.8)',
                      textAlign: 'center',
                      backdropFilter: 'blur(10px)',
                      boxShadow: '0 2px 8px rgba(5, 150, 105, 0.1)'
                    }}>
                      <h3 style={{
                        fontSize: '0.8rem',
                        fontWeight: 'bold',
                        color: '#111827',
                        marginBottom: '0.25rem'
                      }}>
                        Privacy
                      </h3>
                      <p style={{
                        fontSize: '0.7rem',
                        color: '#059669'
                      }}>
                        Data encryption active
                      </p>
                    </div>

                    <div style={{
                      background: 'rgba(255, 255, 255, 0.9)',
                      borderRadius: '0.5rem',
                      padding: '0.75rem',
                      border: '2px solid rgba(5, 150, 105, 0.8)',
                      textAlign: 'center',
                      backdropFilter: 'blur(10px)',
                      boxShadow: '0 2px 8px rgba(5, 150, 105, 0.1)'
                    }}>
                      <h3 style={{
                        fontSize: '0.8rem',
                        fontWeight: 'bold',
                        color: '#111827',
                        marginBottom: '0.25rem'
                      }}>
                        Theme
                      </h3>
                      <p style={{
                        fontSize: '0.7rem',
                        color: '#059669'
                      }}>
                        Eco-green active
                      </p>
                    </div>

                    <div style={{
                      background: 'rgba(255, 255, 255, 0.9)',
                      borderRadius: '0.5rem',
                      padding: '0.75rem',
                      border: '2px solid rgba(5, 150, 105, 0.8)',
                      textAlign: 'center',
                      backdropFilter: 'blur(10px)',
                      boxShadow: '0 2px 8px rgba(5, 150, 105, 0.1)'
                    }}>
                      <h3 style={{
                        fontSize: '0.8rem',
                        fontWeight: 'bold',
                        color: '#111827',
                        marginBottom: '0.25rem'
                      }}>
                        Export
                      </h3>
                      <p style={{
                        fontSize: '0.7rem',
                        color: '#059669'
                      }}>
                        PDF reports available
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>

          </div>

          {/* RIGHT SIDE - SUMMARY CARDS & CHARTS */}
          <div style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            gap: '2rem'
          }}>

            {/* SUMMARY CARDS SECTION - COMPACT */}
            <div style={{
              background: 'linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%)',
              color: '#111827',
              borderRadius: '1rem',
              border: '3px solid #059669',
              padding: '1.5rem',
              position: 'relative',
              zIndex: '100',
              boxShadow: '0 10px 25px rgba(5, 150, 105, 0.2)'
            }}>
              <h2 style={{
                fontSize: '1.5rem',
                fontWeight: 'bold',
                color: '#111827',
                marginBottom: '1.5rem',
                textAlign: 'center',
                textShadow: '2px 2px 4px rgba(0,0,0,0.1)'
              }}>
                📊 Dashboard Overview
              </h2>

              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: '1rem'
              }}>
                {/* Total Emissions Card */}
                <div style={{
                  background: 'rgba(255, 255, 255, 0.9)',
                  borderRadius: '0.75rem',
                  padding: '1rem',
                  border: '2px solid rgba(5, 150, 105, 0.8)',
                  textAlign: 'center',
                  backdropFilter: 'blur(10px)',
                  boxShadow: '0 4px 15px rgba(5, 150, 105, 0.1)'
                }}>
                  <h3 style={{
                    fontSize: '0.9rem',
                    fontWeight: 'bold',
                    color: '#111827',
                    marginBottom: '0.5rem'
                  }}>
                    Total Emissions
                  </h3>
                  <p style={{
                    fontSize: '1.8rem',
                    fontWeight: '900',
                    color: '#059669',
                    marginBottom: '0.25rem'
                  }}>
                    {dashboardData.totalEmissions.toFixed(1)}
                  </p>
                  <span style={{
                    fontSize: '0.7rem',
                    color: '#6b7280'
                  }}>
                    kg CO₂
                  </span>
                </div>

                {/* Eco Score Card */}
                <div style={{
                  background: 'rgba(255, 255, 255, 0.9)',
                  borderRadius: '0.75rem',
                  padding: '1rem',
                  border: '2px solid rgba(5, 150, 105, 0.8)',
                  textAlign: 'center',
                  backdropFilter: 'blur(10px)',
                  boxShadow: '0 4px 15px rgba(5, 150, 105, 0.1)'
                }}>
                  <h3 style={{
                    fontSize: '0.9rem',
                    fontWeight: 'bold',
                    color: '#111827',
                    marginBottom: '0.5rem'
                  }}>
                    Eco Score
                  </h3>
                  <p style={{
                    fontSize: '1.8rem',
                    fontWeight: '900',
                    color: '#059669',
                    marginBottom: '0.25rem'
                  }}>
                    {dashboardData.ecoScore}
                  </p>
                  <span style={{
                    fontSize: '0.7rem',
                    color: '#6b7280'
                  }}>
                    / 100
                  </span>
                </div>

                {/* Active Projects Card */}
                <div style={{
                  background: 'rgba(255, 255, 255, 0.9)',
                  borderRadius: '0.75rem',
                  padding: '1rem',
                  border: '2px solid rgba(5, 150, 105, 0.8)',
                  textAlign: 'center',
                  backdropFilter: 'blur(10px)',
                  boxShadow: '0 4px 15px rgba(5, 150, 105, 0.1)'
                }}>
                  <h3 style={{
                    fontSize: '0.9rem',
                    fontWeight: 'bold',
                    color: '#111827',
                    marginBottom: '0.5rem'
                  }}>
                    Projects
                  </h3>
                  <p style={{
                    fontSize: '1.8rem',
                    fontWeight: '900',
                    color: '#059669',
                    marginBottom: '0.25rem'
                  }}>
                    {dashboardData.activeProjects}
                  </p>
                  <span style={{
                    fontSize: '0.7rem',
                    color: '#6b7280'
                  }}>
                    active
                  </span>
                </div>

                {/* Monthly Trend Card */}
                <div style={{
                  background: 'rgba(255, 255, 255, 0.9)',
                  borderRadius: '0.75rem',
                  padding: '1rem',
                  border: '2px solid rgba(5, 150, 105, 0.8)',
                  textAlign: 'center',
                  backdropFilter: 'blur(10px)',
                  boxShadow: '0 4px 15px rgba(5, 150, 105, 0.1)'
                }}>
                  <h3 style={{
                    fontSize: '0.9rem',
                    fontWeight: 'bold',
                    color: '#111827',
                    marginBottom: '0.5rem'
                  }}>
                    Trend
                  </h3>
                  <p style={{
                    fontSize: '1.8rem',
                    fontWeight: '900',
                    color: dashboardData.monthlyTrend < 0 ? '#059669' : '#ea580c',
                    marginBottom: '0.25rem'
                  }}>
                    {dashboardData.monthlyTrend}%
                  </p>
                  <span style={{
                    fontSize: '0.7rem',
                    color: '#6b7280'
                  }}>
                    monthly
                  </span>
                </div>
              </div>

              {/* COMPACT CHART - Weekly Trend */}
              <div style={{
                marginTop: '1.5rem',
                padding: '1rem',
                background: 'rgba(255, 255, 255, 0.8)',
                borderRadius: '0.75rem',
                border: '2px solid rgba(5, 150, 105, 0.6)'
              }}>
                <h3 style={{
                  fontSize: '1rem',
                  fontWeight: 'bold',
                  color: '#111827',
                  marginBottom: '0.75rem',
                  textAlign: 'center'
                }}>
                  📈 Weekly Trend
                </h3>
                <div style={{
                  height: '100px',
                  position: 'relative',
                  display: 'flex',
                  alignItems: 'end',
                  justifyContent: 'space-between',
                  padding: '0.5rem'
                }}>
                  {[65, 45, 78, 32, 89, 56, 71].map((value, index) => (
                    <div key={index} style={{
                      width: '18px',
                      height: `${(value / 100) * 70}px`,
                      background: `linear-gradient(to top, #059669, #10b981)`,
                      borderRadius: '2px 2px 0 0',
                      position: 'relative',
                      margin: '0 1px'
                    }}>
                      <div style={{
                        position: 'absolute',
                        top: '-18px',
                        left: '50%',
                        transform: 'translateX(-50%)',
                        fontSize: '0.5rem',
                        color: '#059669',
                        fontWeight: 'bold'
                      }}>
                        {value}
                      </div>
                    </div>
                  ))}
                </div>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  marginTop: '0.5rem',
                  fontSize: '0.5rem',
                  color: '#6b7280'
                }}>
                  <span>M</span>
                  <span>T</span>
                  <span>W</span>
                  <span>T</span>
                  <span>F</span>
                  <span>S</span>
                  <span>S</span>
                </div>
              </div>
            </div>

            {/* FULL CHARTS SECTION - RIGHT SIDE */}
            <div style={{
              background: 'linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%)',
              color: '#111827',
              borderRadius: '1.5rem',
              border: '3px solid #059669',
              padding: '2rem',
              boxShadow: '0 15px 35px rgba(5, 150, 105, 0.25)'
            }}>
              <h2 style={{
                fontSize: '2rem',
                fontWeight: 'bold',
                color: '#111827',
                marginBottom: '2rem',
                textAlign: 'center',
                textShadow: '2px 2px 4px rgba(0,0,0,0.1)'
              }}>
                📈 Detailed Analytics
              </h2>

              {/* LARGE CHART - Monthly Trends */}
              <div style={{
                padding: '2rem',
                background: 'rgba(255, 255, 255, 0.9)',
                borderRadius: '1rem',
                border: '2px solid rgba(5, 150, 105, 0.6)',
                marginBottom: '2rem'
              }}>
                <h3 style={{
                  fontSize: '1.5rem',
                  fontWeight: 'bold',
                  color: '#111827',
                  marginBottom: '1.5rem',
                  textAlign: 'center'
                }}>
                  📊 Monthly Emission Trends
                </h3>
                <div style={{
                  height: '250px',
                  position: 'relative',
                  display: 'flex',
                  alignItems: 'end',
                  justifyContent: 'space-between',
                  padding: '2rem 1rem 1rem 1rem'
                }}>
                  {[45, 62, 38, 71, 29, 84, 53, 67, 41, 78, 35, 89].map((value, index) => (
                    <div key={index} style={{
                      width: '40px',
                      height: `${(value / 100) * 180}px`,
                      background: `linear-gradient(to top, #059669, #10b981)`,
                      borderRadius: '4px 4px 0 0',
                      position: 'relative',
                      margin: '0 2px',
                      boxShadow: '0 2px 8px rgba(5, 150, 105, 0.3)'
                    }}>
                      <div style={{
                        position: 'absolute',
                        top: '-25px',
                        left: '50%',
                        transform: 'translateX(-50%)',
                        fontSize: '0.8rem',
                        color: '#059669',
                        fontWeight: 'bold'
                      }}>
                        {value}
                      </div>
                    </div>
                  ))}
                </div>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  marginTop: '1rem',
                  fontSize: '0.8rem',
                  color: '#6b7280',
                  padding: '0 1rem'
                }}>
                  <span>Jan</span>
                  <span>Feb</span>
                  <span>Mar</span>
                  <span>Apr</span>
                  <span>May</span>
                  <span>Jun</span>
                  <span>Jul</span>
                  <span>Aug</span>
                  <span>Sep</span>
                  <span>Oct</span>
                  <span>Nov</span>
                  <span>Dec</span>
                </div>
              </div>

              {/* PIE CHART - Category Breakdown */}
              <div style={{
                padding: '2rem',
                background: 'rgba(255, 255, 255, 0.9)',
                borderRadius: '1rem',
                border: '2px solid rgba(5, 150, 105, 0.6)'
              }}>
                <h3 style={{
                  fontSize: '1.5rem',
                  fontWeight: 'bold',
                  color: '#111827',
                  marginBottom: '1.5rem',
                  textAlign: 'center'
                }}>
                  🥧 Emission Categories
                </h3>
                <div style={{
                  height: '250px',
                  position: 'relative',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <div style={{
                    width: '200px',
                    height: '200px',
                    borderRadius: '50%',
                    background: `conic-gradient(
                      #059669 0% 35%,
                      #10b981 35% 60%,
                      #34d399 60% 80%,
                      #6ee7b7 80% 100%
                    )`,
                    position: 'relative',
                    boxShadow: '0 8px 25px rgba(5, 150, 105, 0.2)'
                  }}>
                    <div style={{
                      position: 'absolute',
                      top: '50%',
                      left: '50%',
                      transform: 'translate(-50%, -50%)',
                      width: '120px',
                      height: '120px',
                      background: 'rgba(255, 255, 255, 0.9)',
                      borderRadius: '50%',
                      border: '2px solid rgba(5, 150, 105, 0.6)'
                    }}>
                      <div style={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        textAlign: 'center'
                      }}>
                        <div style={{
                          fontSize: '0.9rem',
                          fontWeight: 'bold',
                          color: '#059669'
                        }}>
                          1,247kg
                        </div>
                        <div style={{
                          fontSize: '0.7rem',
                          color: '#6b7280'
                        }}>
                          Total CO₂
                        </div>
                      </div>
                    </div>
                  </div>

                  <div style={{
                    marginLeft: '2rem',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.5rem'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <div style={{ width: '12px', height: '12px', background: '#059669', borderRadius: '2px' }}></div>
                      <span style={{ fontSize: '0.8rem', color: '#111827' }}>Travel (35%)</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <div style={{ width: '12px', height: '12px', background: '#10b981', borderRadius: '2px' }}></div>
                      <span style={{ fontSize: '0.8rem', color: '#111827' }}>Energy (25%)</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <div style={{ width: '12px', height: '12px', background: '#34d399', borderRadius: '2px' }}></div>
                      <span style={{ fontSize: '0.8rem', color: '#111827' }}>Food (20%)</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <div style={{ width: '12px', height: '12px', background: '#6ee7b7', borderRadius: '2px' }}></div>
                      <span style={{ fontSize: '0.8rem', color: '#111827' }}>Transport (20%)</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>

        </div>

          {/* SUMMARY CARDS SECTION - COMPACT */}
          <div style={{
            background: 'linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%)',
            color: '#111827',
            borderRadius: '1rem',
            border: '3px solid #059669',
            padding: '1.5rem',
            position: 'relative',
            zIndex: '100',
            boxShadow: '0 10px 25px rgba(5, 150, 105, 0.2)'
          }}>
            <h2 style={{
              fontSize: '1.5rem',
              fontWeight: 'bold',
              color: '#111827',
              marginBottom: '1.5rem',
              textAlign: 'center',
              textShadow: '2px 2px 4px rgba(0,0,0,0.1)'
            }}>
              📊 Dashboard Overview
            </h2>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(2, 1fr)',
              gap: '1rem'
            }}>
              {/* Total Emissions Card */}
              <div style={{
                background: 'rgba(255, 255, 255, 0.9)',
                borderRadius: '0.75rem',
                padding: '1rem',
                border: '2px solid rgba(5, 150, 105, 0.8)',
                textAlign: 'center',
                backdropFilter: 'blur(10px)',
                boxShadow: '0 4px 15px rgba(5, 150, 105, 0.1)'
              }}>
                <h3 style={{
                  fontSize: '0.9rem',
                  fontWeight: 'bold',
                  color: '#111827',
                  marginBottom: '0.5rem'
                }}>
                  Total Emissions
                </h3>
                <p style={{
                  fontSize: '1.8rem',
                  fontWeight: '900',
                  color: '#059669',
                  marginBottom: '0.25rem'
                }}>
                  {dashboardData.totalEmissions.toFixed(1)}
                </p>
                <span style={{
                  fontSize: '0.7rem',
                  color: '#6b7280'
                }}>
                  kg CO₂
                </span>
              </div>

              {/* Eco Score Card */}
              <div style={{
                background: 'rgba(255, 255, 255, 0.9)',
                borderRadius: '0.75rem',
                padding: '1rem',
                border: '2px solid rgba(5, 150, 105, 0.8)',
                textAlign: 'center',
                backdropFilter: 'blur(10px)',
                boxShadow: '0 4px 15px rgba(5, 150, 105, 0.1)'
              }}>
                <h3 style={{
                  fontSize: '0.9rem',
                  fontWeight: 'bold',
                  color: '#111827',
                  marginBottom: '0.5rem'
                }}>
                  Eco Score
                </h3>
                <p style={{
                  fontSize: '1.8rem',
                  fontWeight: '900',
                  color: '#059669',
                  marginBottom: '0.25rem'
                }}>
                  {dashboardData.ecoScore}
                </p>
                <span style={{
                  fontSize: '0.7rem',
                  color: '#6b7280'
                }}>
                  / 100
                </span>
              </div>

              {/* Active Projects Card */}
              <div style={{
                background: 'rgba(255, 255, 255, 0.9)',
                borderRadius: '0.75rem',
                padding: '1rem',
                border: '2px solid rgba(5, 150, 105, 0.8)',
                textAlign: 'center',
                backdropFilter: 'blur(10px)',
                boxShadow: '0 4px 15px rgba(5, 150, 105, 0.1)'
              }}>
                <h3 style={{
                  fontSize: '0.9rem',
                  fontWeight: 'bold',
                  color: '#111827',
                  marginBottom: '0.5rem'
                }}>
                  Projects
                </h3>
                <p style={{
                  fontSize: '1.8rem',
                  fontWeight: '900',
                  color: '#059669',
                  marginBottom: '0.25rem'
                }}>
                  {dashboardData.activeProjects}
                </p>
                <span style={{
                  fontSize: '0.7rem',
                  color: '#6b7280'
                }}>
                  active
                </span>
              </div>

              {/* Monthly Trend Card */}
              <div style={{
                background: 'rgba(255, 255, 255, 0.9)',
                borderRadius: '0.75rem',
                padding: '1rem',
                border: '2px solid rgba(5, 150, 105, 0.8)',
                textAlign: 'center',
                backdropFilter: 'blur(10px)',
                boxShadow: '0 4px 15px rgba(5, 150, 105, 0.1)'
              }}>
                <h3 style={{
                  fontSize: '0.9rem',
                  fontWeight: 'bold',
                  color: '#111827',
                  marginBottom: '0.5rem'
                }}>
                  Trend
                </h3>
                <p style={{
                  fontSize: '1.8rem',
                  fontWeight: '900',
                  color: dashboardData.monthlyTrend < 0 ? '#059669' : '#ea580c',
                  marginBottom: '0.25rem'
                }}>
                  {dashboardData.monthlyTrend}%
                </p>
                <span style={{
                  fontSize: '0.7rem',
                  color: '#6b7280'
                }}>
                  monthly
                </span>
              </div>
            </div>

            {/* COMPACT CHART - Emissions Trend */}
            <div style={{
              marginTop: '1.5rem',
              padding: '1rem',
              background: 'rgba(255, 255, 255, 0.8)',
              borderRadius: '0.75rem',
              border: '2px solid rgba(5, 150, 105, 0.6)'
            }}>
              <h3 style={{
                fontSize: '1rem',
                fontWeight: 'bold',
                color: '#111827',
                marginBottom: '0.75rem',
                textAlign: 'center'
              }}>
                📈 Weekly Trend
              </h3>
              <div style={{
                height: '120px',
                position: 'relative',
                display: 'flex',
                alignItems: 'end',
                justifyContent: 'space-between',
                padding: '0.5rem'
              }}>
                {/* Compact chart bars */}
                {[65, 45, 78, 32, 89, 56, 71].map((value, index) => (
                  <div key={index} style={{
                    width: '20px',
                    height: `${(value / 100) * 80}px`,
                    background: `linear-gradient(to top, #059669, #10b981)`,
                    borderRadius: '2px 2px 0 0',
                    position: 'relative',
                    margin: '0 1px'
                  }}>
                    <div style={{
                      position: 'absolute',
                      top: '-20px',
                      left: '50%',
                      transform: 'translateX(-50%)',
                      fontSize: '0.6rem',
                      color: '#059669',
                      fontWeight: 'bold'
                    }}>
                      {value}
                    </div>
                  </div>
                ))}
              </div>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                marginTop: '0.5rem',
                fontSize: '0.6rem',
                color: '#6b7280'
              }}>
                <span>M</span>
                <span>T</span>
                <span>W</span>
                <span>T</span>
                <span>F</span>
                <span>S</span>
                <span>S</span>
              </div>
            </div>
          </div>

          {/* ACTIVITIES SECTION - COMPACT */}
          <div style={{
            background: 'linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%)',
            color: '#111827',
            borderRadius: '1rem',
            border: expandedSections.activities ? '4px solid #059669' : '2px solid #059669',
            minHeight: expandedSections.activities ? '300px' : '100px',
            position: 'relative',
            zIndex: '100',
            boxShadow: '0 10px 25px rgba(5, 150, 105, 0.2)',
            cursor: 'pointer',
            transition: 'all 0.3s ease'
          }}
          onClick={() => toggleSection('activities')}>
            <div style={{
              padding: '1rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}>
              <h2 style={{
                fontSize: expandedSections.activities ? '1.8rem' : '1.3rem',
                fontWeight: 'bold',
                color: '#111827',
                margin: 0,
                textShadow: '2px 2px 4px rgba(0,0,0,0.1)',
                transition: 'font-size 0.3s ease'
              }}>
                📋 Activities {expandedSections.activities ? '▼' : '▶'}
              </h2>
              <div style={{
                fontSize: '0.8rem',
                color: '#6b7280',
                opacity: expandedSections.activities ? 0 : 1,
                transition: 'opacity 0.3s ease'
              }}>
                Click to expand
              </div>
            </div>

            {expandedSections.activities && (
              <div style={{
                padding: '0 1rem 1rem 1rem'
              }}>
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                  gap: '1rem'
                }}>
                  {dashboardData.recentActivities.map((activity) => (
                    <div
                      key={activity.id}
                      style={{
                        background: 'rgba(255, 255, 255, 0.9)',
                        borderRadius: '0.75rem',
                        padding: '1rem',
                        border: '2px solid rgba(5, 150, 105, 0.8)',
                        textAlign: 'center',
                        backdropFilter: 'blur(10px)',
                        boxShadow: '0 4px 15px rgba(5, 150, 105, 0.1)'
                      }}
                    >
                      <h3 style={{
                        fontSize: '1rem',
                        fontWeight: 'bold',
                        color: '#111827',
                        marginBottom: '0.5rem'
                      }}>
                        {activity.description}
                      </h3>
                      <p style={{
                        fontSize: '1.5rem',
                        fontWeight: '900',
                        color: '#059669',
                        marginBottom: '0.25rem'
                      }}>
                        {activity.carbon_emission} kg CO₂
                      </p>
                      <span style={{
                        background: 'rgba(5, 150, 105, 0.9)',
                        color: 'white',
                        padding: '0.25rem 0.5rem',
                        borderRadius: '0.5rem',
                        fontSize: '0.7rem',
                        textTransform: 'uppercase',
                        border: '1px solid rgba(16, 185, 129, 0.6)'
                      }}>
                        {activity.category}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* GOALS SECTION - COMPACT */}
          <div style={{
            background: 'linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)',
            color: '#111827',
            borderRadius: '1rem',
            border: expandedSections.goals ? '4px solid #059669' : '2px solid #059669',
            minHeight: expandedSections.goals ? '300px' : '100px',
            position: 'relative',
            zIndex: '100',
            boxShadow: '0 10px 25px rgba(5, 150, 105, 0.2)',
            cursor: 'pointer',
            transition: 'all 0.3s ease'
          }}
          onClick={() => toggleSection('goals')}>
            <div style={{
              padding: '1rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}>
              <h2 style={{
                fontSize: expandedSections.goals ? '1.8rem' : '1.3rem',
                fontWeight: 'bold',
                color: '#111827',
                margin: 0,
                textShadow: '2px 2px 4px rgba(0,0,0,0.1)',
                transition: 'font-size 0.3s ease'
              }}>
                🎯 Goals {expandedSections.goals ? '▼' : '▶'}
              </h2>
              <div style={{
                fontSize: '0.8rem',
                color: '#6b7280',
                opacity: expandedSections.goals ? 0 : 1,
                transition: 'opacity 0.3s ease'
              }}>
                Click to expand
              </div>
            </div>

            {expandedSections.goals && (
              <div style={{
                padding: '0 1rem 1rem 1rem'
              }}>
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                  gap: '1rem'
                }}>
                  <div style={{
                    background: 'rgba(255, 255, 255, 0.9)',
                    borderRadius: '0.75rem',
                    padding: '1rem',
                    border: '2px solid rgba(5, 150, 105, 0.8)',
                    textAlign: 'center',
                    backdropFilter: 'blur(10px)',
                    boxShadow: '0 4px 15px rgba(5, 150, 105, 0.1)'
                  }}>
                    <h3 style={{
                      fontSize: '1rem',
                      fontWeight: 'bold',
                      color: '#111827',
                      marginBottom: '0.5rem'
                    }}>
                      Weekly Goal
                    </h3>
                    <p style={{
                      fontSize: '0.9rem',
                      color: '#047857',
                      marginBottom: '0.5rem'
                    }}>
                      Current: {dashboardData.totalEmissions.toFixed(1)} kg CO₂
                    </p>
                    <p style={{
                      fontSize: '0.9rem',
                      color: '#047857',
                      marginBottom: '0.5rem'
                    }}>
                      Goal: {dashboardData.weeklyGoal} kg CO₂
                    </p>
                    <div style={{
                      width: '100%',
                      height: '8px',
                      background: 'rgba(236, 253, 245, 0.8)',
                      borderRadius: '4px',
                      border: '1px solid rgba(5, 150, 105, 0.6)',
                      marginBottom: '0.5rem'
                    }}>
                      <div
                        style={{
                          height: '100%',
                          background: 'linear-gradient(90deg, #059669, #10b981)',
                          borderRadius: '3px',
                          width: `${Math.min((dashboardData.totalEmissions / dashboardData.weeklyGoal) * 100, 100)}%`
                        }}
                      />
                    </div>
                    <p style={{
                      fontSize: '0.8rem',
                      fontWeight: 'bold',
                      color: dashboardData.totalEmissions < dashboardData.weeklyGoal ? '#059669' : '#ca8a04'
                    }}>
                      {dashboardData.totalEmissions < dashboardData.weeklyGoal
                        ? `🎉 ${dashboardData.weeklyGoal - dashboardData.totalEmissions}kg left`
                        : '🏆 Goal achieved!'
                      }
                    </p>
                  </div>

                  <div style={{
                    background: 'rgba(255, 255, 255, 0.9)',
                    borderRadius: '0.75rem',
                    padding: '1rem',
                    border: '2px solid rgba(5, 150, 105, 0.8)',
                    textAlign: 'center',
                    backdropFilter: 'blur(10px)',
                    boxShadow: '0 4px 15px rgba(5, 150, 105, 0.1)'
                  }}>
                    <h3 style={{
                      fontSize: '1rem',
                      fontWeight: 'bold',
                      color: '#111827',
                      marginBottom: '0.5rem'
                    }}>
                      Monthly Challenge
                    </h3>
                    <p style={{
                      fontSize: '0.8rem',
                      color: '#047857',
                      marginBottom: '0.5rem'
                    }}>
                      Reduce emissions by 15%
                    </p>
                    <div style={{
                      width: '100%',
                      height: '8px',
                      background: 'rgba(236, 253, 245, 0.8)',
                      borderRadius: '4px',
                      border: '1px solid rgba(5, 150, 105, 0.6)',
                      marginBottom: '0.5rem'
                    }}>
                      <div
                        style={{
                          height: '100%',
                          background: 'linear-gradient(90deg, #059669, #10b981)',
                          borderRadius: '3px',
                          width: `${Math.max(0, 100 - Math.abs(dashboardData.monthlyTrend))}%`
                        }}
                      />
                    </div>
                    <p style={{
                      fontSize: '0.8rem',
                      fontWeight: 'bold',
                      color: dashboardData.monthlyTrend < 0 ? '#059669' : '#ea580c'
                    }}>
                      {dashboardData.monthlyTrend < 0
                        ? `🎉 ${Math.abs(dashboardData.monthlyTrend)}% reduction!`
                        : 'Keep working!'
                      }
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* SETTINGS SECTION - COMPACT */}
          <div style={{
            background: 'linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%)',
            color: '#111827',
            borderRadius: '1rem',
            border: expandedSections.settings ? '4px solid #059669' : '2px solid #059669',
            minHeight: expandedSections.settings ? '300px' : '100px',
            position: 'relative',
            zIndex: '100',
            boxShadow: '0 10px 25px rgba(5, 150, 105, 0.2)',
            cursor: 'pointer',
            transition: 'all 0.3s ease'
          }}
          onClick={() => toggleSection('settings')}>
            <div style={{
              padding: '1rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}>
              <h2 style={{
                fontSize: expandedSections.settings ? '1.8rem' : '1.3rem',
                fontWeight: 'bold',
                color: '#111827',
                margin: 0,
                textShadow: '2px 2px 4px rgba(0,0,0,0.1)',
                transition: 'font-size 0.3s ease'
              }}>
                ⚙️ Settings {expandedSections.settings ? '▼' : '▶'}
              </h2>
              <div style={{
                fontSize: '0.8rem',
                color: '#6b7280',
                opacity: expandedSections.settings ? 0 : 1,
                transition: 'opacity 0.3s ease'
              }}>
                Click to expand
              </div>
            </div>

            {expandedSections.settings && (
              <div style={{
                padding: '0 1rem 1rem 1rem'
              }}>
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(2, 1fr)',
                  gap: '1rem'
                }}>
                  <div style={{
                    background: 'rgba(255, 255, 255, 0.9)',
                    borderRadius: '0.75rem',
                    padding: '1rem',
                    border: '2px solid rgba(5, 150, 105, 0.8)',
                    textAlign: 'center',
                    backdropFilter: 'blur(10px)',
                    boxShadow: '0 4px 15px rgba(5, 150, 105, 0.1)'
                  }}>
                    <h3 style={{
                      fontSize: '1rem',
                      fontWeight: 'bold',
                      color: '#111827',
                      marginBottom: '0.5rem'
                    }}>
                      Notifications
                    </h3>
                    <p style={{
                      fontSize: '0.8rem',
                      color: '#059669'
                    }}>
                      Daily reminders enabled
                    </p>
                  </div>

                  <div style={{
                    background: 'rgba(255, 255, 255, 0.9)',
                    borderRadius: '0.75rem',
                    padding: '1rem',
                    border: '2px solid rgba(5, 150, 105, 0.8)',
                    textAlign: 'center',
                    backdropFilter: 'blur(10px)',
                    boxShadow: '0 4px 15px rgba(5, 150, 105, 0.1)'
                  }}>
                    <h3 style={{
                      fontSize: '1rem',
                      fontWeight: 'bold',
                      color: '#111827',
                      marginBottom: '0.5rem'
                    }}>
                      Privacy
                    </h3>
                    <p style={{
                      fontSize: '0.8rem',
                      color: '#059669'
                    }}>
                      Data encryption active
                    </p>
                  </div>

                  <div style={{
                    background: 'rgba(255, 255, 255, 0.9)',
                    borderRadius: '0.75rem',
                    padding: '1rem',
                    border: '2px solid rgba(5, 150, 105, 0.8)',
                    textAlign: 'center',
                    backdropFilter: 'blur(10px)',
                    boxShadow: '0 4px 15px rgba(5, 150, 105, 0.1)'
                  }}>
                    <h3 style={{
                      fontSize: '1rem',
                      fontWeight: 'bold',
                      color: '#111827',
                      marginBottom: '0.5rem'
                    }}>
                      Theme
                    </h3>
                    <p style={{
                      fontSize: '0.8rem',
                      color: '#059669'
                    }}>
                      Eco-green active
                    </p>
                  </div>

                  <div style={{
                    background: 'rgba(255, 255, 255, 0.9)',
                    borderRadius: '0.75rem',
                    padding: '1rem',
                    border: '2px solid rgba(5, 150, 105, 0.8)',
                    textAlign: 'center',
                    backdropFilter: 'blur(10px)',
                    boxShadow: '0 4px 15px rgba(5, 150, 105, 0.1)'
                  }}>
                    <h3 style={{
                      fontSize: '1rem',
                      fontWeight: 'bold',
                      color: '#111827',
                      marginBottom: '0.5rem'
                    }}>
                      Export
                    </h3>
                    <p style={{
                      fontSize: '0.8rem',
                      color: '#059669'
                    }}>
                      PDF reports available
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* FULL CHART SECTION BELOW */}
        <div style={{
          marginTop: '3rem',
          maxWidth: '1400px',
          margin: '3rem auto 0 auto'
        }}>
          <div style={{
            background: 'linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%)',
            color: '#111827',
            borderRadius: '1.5rem',
            border: '3px solid #059669',
            padding: '2rem',
            boxShadow: '0 15px 35px rgba(5, 150, 105, 0.25)'
          }}>
            <h2 style={{
              fontSize: '2rem',
              fontWeight: 'bold',
              color: '#111827',
              marginBottom: '2rem',
              textAlign: 'center',
              textShadow: '2px 2px 4px rgba(0,0,0,0.1)'
            }}>
              📈 Detailed Analytics
            </h2>

            {/* LARGE CHART - Emissions Trend */}
            <div style={{
              padding: '2rem',
              background: 'rgba(255, 255, 255, 0.9)',
              borderRadius: '1rem',
              border: '2px solid rgba(5, 150, 105, 0.6)',
              marginBottom: '2rem'
            }}>
              <h3 style={{
                fontSize: '1.5rem',
                fontWeight: 'bold',
                color: '#111827',
                marginBottom: '1.5rem',
                textAlign: 'center'
              }}>
                📊 Monthly Emission Trends
              </h3>
              <div style={{
                height: '300px',
                position: 'relative',
                display: 'flex',
                alignItems: 'end',
                justifyContent: 'space-between',
                padding: '2rem 1rem 1rem 1rem'
              }}>
                {/* Large chart bars */}
                {[45, 62, 38, 71, 29, 84, 53, 67, 41, 78, 35, 89].map((value, index) => (
                  <div key={index} style={{
                    width: '50px',
                    height: `${(value / 100) * 200}px`,
                    background: `linear-gradient(to top, #059669, #10b981)`,
                    borderRadius: '4px 4px 0 0',
                    position: 'relative',
                    margin: '0 3px',
                    boxShadow: '0 2px 8px rgba(5, 150, 105, 0.3)'
                  }}>
                    <div style={{
                      position: 'absolute',
                      top: '-30px',
                      left: '50%',
                      transform: 'translateX(-50%)',
                      fontSize: '0.9rem',
                      color: '#059669',
                      fontWeight: 'bold'
                    }}>
                      {value}
                    </div>
                  </div>
                ))}
              </div>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                marginTop: '1rem',
                fontSize: '0.9rem',
                color: '#6b7280',
                padding: '0 1rem'
              }}>
                <span>Jan</span>
                <span>Feb</span>
                <span>Mar</span>
                <span>Apr</span>
                <span>May</span>
                <span>Jun</span>
                <span>Jul</span>
                <span>Aug</span>
                <span>Sep</span>
                <span>Oct</span>
                <span>Nov</span>
                <span>Dec</span>
              </div>
            </div>

            {/* ADDITIONAL CHART - Category Breakdown */}
            <div style={{
              padding: '2rem',
              background: 'rgba(255, 255, 255, 0.9)',
              borderRadius: '1rem',
              border: '2px solid rgba(5, 150, 105, 0.6)'
            }}>
              <h3 style={{
                fontSize: '1.5rem',
                fontWeight: 'bold',
                color: '#111827',
                marginBottom: '1.5rem',
                textAlign: 'center'
              }}>
                🥧 Emission Categories
              </h3>
              <div style={{
                height: '250px',
                position: 'relative',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                {/* Simulated pie chart */}
                <div style={{
                  width: '200px',
                  height: '200px',
                  borderRadius: '50%',
                  background: `conic-gradient(
                    #059669 0% 35%,
                    #10b981 35% 60%,
                    #34d399 60% 80%,
                    #6ee7b7 80% 100%
                  )`,
                  position: 'relative',
                  boxShadow: '0 8px 25px rgba(5, 150, 105, 0.2)'
                }}>
                  <div style={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: '120px',
                    height: '120px',
                    background: 'rgba(255, 255, 255, 0.9)',
                    borderRadius: '50%',
                    border: '2px solid rgba(5, 150, 105, 0.6)'
                  }}>
                    <div style={{
                      position: 'absolute',
                      top: '50%',
                      left: '50%',
                      transform: 'translate(-50%, -50%)',
                      textAlign: 'center'
                    }}>
                      <div style={{
                        fontSize: '0.9rem',
                        fontWeight: 'bold',
                        color: '#059669'
                      }}>
                        1,247kg
                      </div>
                      <div style={{
                        fontSize: '0.7rem',
                        color: '#6b7280'
                      }}>
                        Total CO₂
                      </div>
                    </div>
                  </div>
                </div>

                {/* Legend */}
                <div style={{
                  marginLeft: '2rem',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.5rem'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <div style={{ width: '12px', height: '12px', background: '#059669', borderRadius: '2px' }}></div>
                    <span style={{ fontSize: '0.8rem', color: '#111827' }}>Travel (35%)</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <div style={{ width: '12px', height: '12px', background: '#10b981', borderRadius: '2px' }}></div>
                    <span style={{ fontSize: '0.8rem', color: '#111827' }}>Energy (25%)</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <div style={{ width: '12px', height: '12px', background: '#34d399', borderRadius: '2px' }}></div>
                    <span style={{ fontSize: '0.8rem', color: '#111827' }}>Food (20%)</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <div style={{ width: '12px', height: '12px', background: '#6ee7b7', borderRadius: '2px' }}></div>
                    <span style={{ fontSize: '0.8rem', color: '#111827' }}>Transport (20%)</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

      </main>
    </div>
  );
};

export default Dashboard;
