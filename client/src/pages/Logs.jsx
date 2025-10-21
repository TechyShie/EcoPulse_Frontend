import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Edit2, Trash2, Filter, Calendar, Search, ChevronLeft, ChevronRight, LogIn } from 'lucide-react';
import { logsAPI } from '../services/logsAPI';

const Logs = () => {
  // Check authentication
  const isAuthenticated = localStorage.getItem('token') || localStorage.getItem('user');

  // For development, bypass authentication check
  const shouldShowLogs = isAuthenticated || true; // Temporarily bypass for development

  // If not authenticated, show login prompt
  if (!shouldShowLogs) {
    return (
      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #ecfdf5 0%, #f0fdf4 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem'
      }}>
        <div style={{
          background: 'rgba(255, 255, 255, 0.9)',
          borderRadius: '1rem',
          padding: '3rem',
          textAlign: 'center',
          border: '2px solid rgba(5, 150, 105, 0.6)',
          boxShadow: '0 10px 25px rgba(5, 150, 105, 0.2)',
          maxWidth: '500px'
        }}>
          <div style={{
            fontSize: '4rem',
            marginBottom: '1.5rem',
            opacity: 0.7
          }}>
            🔒
          </div>
          <h1 style={{
            fontSize: '2rem',
            fontWeight: 'bold',
            color: '#111827',
            marginBottom: '1rem'
          }}>
            Authentication Required
          </h1>
          <p style={{
            fontSize: '1.1rem',
            color: '#6b7280',
            marginBottom: '2rem',
            lineHeight: 1.6
          }}>
            You need to be logged in to access your activity logs. Please sign in to track and manage your daily carbon footprint activities.
          </p>
          <div style={{
            display: 'flex',
            gap: '1rem',
            justifyContent: 'center'
          }}>
            <a
              href="/login"
              style={{
                background: 'linear-gradient(135deg, #059669 0%, #10b981 100%)',
                color: 'white',
                border: 'none',
                borderRadius: '0.75rem',
                padding: '0.75rem 1.5rem',
                fontSize: '1rem',
                fontWeight: 'bold',
                textDecoration: 'none',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                transition: 'all 0.3s ease'
              }}
            >
              <LogIn size={18} />
              Sign In
            </a>
            <a
              href="/signup"
              style={{
                background: 'rgba(5, 150, 105, 0.1)',
                color: '#059669',
                border: '2px solid rgba(5, 150, 105, 0.6)',
                borderRadius: '0.75rem',
                padding: '0.75rem 1.5rem',
                fontSize: '1rem',
                fontWeight: 'bold',
                textDecoration: 'none',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                transition: 'all 0.3s ease'
              }}
            >
              Create Account
            </a>
          </div>
        </div>
      </div>
    );
  }

  // State management
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingLog, setEditingLog] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [categories, setCategories] = useState([
    { value: 'all', label: 'All Categories', color: '#6b7280' },
    { value: 'travel', label: '✈️ Travel', color: '#059669' },
    { value: 'food', label: '🍽️ Food', color: '#10b981' },
    { value: 'energy', label: '⚡ Energy', color: '#34d399' },
    { value: 'transport', label: '🚗 Transport', color: '#6ee7b7' }
  ]);

  // Load categories from API on component mount
  useEffect(() => {
    const loadCategories = async () => {
      try {
        const apiCategories = await logsAPI.getCategories();
        if (apiCategories.length > 0) {
          setCategories([
            { value: 'all', label: 'All Categories', color: '#6b7280' },
            ...apiCategories
          ]);
        }
      } catch (error) {
        console.error('Error loading categories:', error);
        // Keep default categories as fallback
      }
    };

    loadCategories();
  }, []);

  // Load logs data using API with useCallback to prevent infinite re-renders
  const loadLogs = useCallback(async () => {
    try {
      setLoading(true);

      // Prepare API parameters
      const params = {
        page: currentPage,
        limit: 10,
        category: selectedCategory,
        search: searchTerm,
        dateFrom: dateFrom || '',
        dateTo: dateTo || '',
        sortBy: 'date',
        sortOrder: 'desc'
      };

      // Call API
      const response = await logsAPI.getLogs(params);

      setLogs(response.logs || []);
      setTotalPages(response.pagination?.totalPages || 1);
      setLoading(false);

    } catch (error) {
      console.error('Error loading logs:', error);
      // Fallback to empty array since API service handles mock data
      setLogs([]);
      setTotalPages(1);
      setLoading(false);
    }
  }, [currentPage, selectedCategory, searchTerm, dateFrom, dateTo]);

  useEffect(() => {
    loadLogs();
  }, [loadLogs]);

  // Handle adding new log
  const handleAddLog = async (newLog) => {
    try {
      await logsAPI.createLog(newLog);
      await loadLogs(); // Refresh logs list
      setShowAddModal(false);
    } catch (error) {
      console.error('Error creating log:', error);
      // Fallback: add to local state
      const logWithId = {
        ...newLog,
        id: Date.now(),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      setLogs([logWithId, ...logs]);
      setShowAddModal(false);
    }
  };

  // Handle editing log
  const handleEditLog = async (updatedLog) => {
    try {
      await logsAPI.updateLog(updatedLog.id, updatedLog);
      await loadLogs(); // Refresh logs list
      setEditingLog(null);
    } catch (error) {
      console.error('Error updating log:', error);
      // Fallback: update local state
      setLogs(logs.map(log =>
        log.id === updatedLog.id
          ? { ...updatedLog, updated_at: new Date().toISOString() }
          : log
      ));
      setEditingLog(null);
    }
  };

  // Handle deleting log
  const handleDeleteLog = async (logId) => {
    if (window.confirm('Are you sure you want to delete this activity log?')) {
      try {
        await logsAPI.deleteLog(logId);
        await loadLogs(); // Refresh logs list
      } catch (error) {
        console.error('Error deleting log:', error);
        // Fallback: remove from local state
        setLogs(logs.filter(log => log.id !== logId));
      }
    }
  };

  // Format date for display
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Get category display info
  const getCategoryInfo = (category) => {
    return categories.find(cat => cat.value === category) || categories[0] || { value: 'unknown', label: 'Unknown', color: '#6b7280' };
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #ecfdf5 0%, #f0fdf4 100%)',
      padding: '2rem'
    }}>
      {/* Header */}
      <div style={{
        maxWidth: '1400px',
        margin: '0 auto',
        marginBottom: '2rem'
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '2rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <Link
              to="/dashboard"
              style={{
                background: 'rgba(255, 255, 255, 0.9)',
                color: '#059669',
                border: '2px solid rgba(5, 150, 105, 0.6)',
                borderRadius: '0.75rem',
                padding: '0.75rem 1rem',
                fontSize: '0.9rem',
                fontWeight: 'bold',
                textDecoration: 'none',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                transition: 'all 0.3s ease',
                boxShadow: '0 2px 8px rgba(5, 150, 105, 0.2)'
              }}
              onMouseEnter={(e) => {
                e.target.style.background = 'rgba(5, 150, 105, 0.1)';
                e.target.style.transform = 'translateY(-2px)';
                e.target.style.boxShadow = '0 4px 15px rgba(5, 150, 105, 0.3)';
              }}
              onMouseLeave={(e) => {
                e.target.style.background = 'rgba(255, 255, 255, 0.9)';
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = '0 2px 8px rgba(5, 150, 105, 0.2)';
              }}
            >
              ← Dashboard
            </Link>
            <div>
              <h1 style={{
                fontSize: '2.5rem',
                fontWeight: 'bold',
                color: '#111827',
                marginBottom: '0.5rem',
                textShadow: '2px 2px 4px rgba(0,0,0,0.1)'
              }}>
                📋 Activity Logs
              </h1>
              <p style={{
                fontSize: '1.1rem',
                color: '#6b7280',
                margin: 0
              }}>
                Track and manage your daily carbon footprint activities
              </p>
            </div>
          </div>

          <button
            onClick={() => setShowAddModal(true)}
            style={{
              background: 'linear-gradient(135deg, #059669 0%, #10b981 100%)',
              color: 'white',
              border: 'none',
              borderRadius: '0.75rem',
              padding: '0.75rem 1.5rem',
              fontSize: '1rem',
              fontWeight: 'bold',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              boxShadow: '0 4px 15px rgba(5, 150, 105, 0.3)',
              transition: 'all 0.3s ease'
            }}
            onMouseEnter={(e) => {
              e.target.style.transform = 'translateY(-2px)';
              e.target.style.boxShadow = '0 8px 25px rgba(5, 150, 105, 0.4)';
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = 'translateY(0)';
              e.target.style.boxShadow = '0 4px 15px rgba(5, 150, 105, 0.3)';
            }}
          >
            <Plus size={20} />
            Add Activity
          </button>
        </div>

        {/* Filters */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.9)',
          borderRadius: '1rem',
          padding: '1.5rem',
          border: '2px solid rgba(5, 150, 105, 0.6)',
          marginBottom: '2rem',
          boxShadow: '0 4px 15px rgba(5, 150, 105, 0.1)'
        }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '1rem',
            alignItems: 'center'
          }}>
            {/* Category Filter */}
            <div>
              <label style={{
                display: 'block',
                fontSize: '0.9rem',
                fontWeight: 'bold',
                color: '#111827',
                marginBottom: '0.5rem'
              }}>
                <Filter size={16} style={{ marginRight: '0.5rem' }} />
                Category
              </label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '2px solid rgba(5, 150, 105, 0.6)',
                  borderRadius: '0.5rem',
                  background: 'white',
                  fontSize: '0.9rem',
                  color: '#111827'
                }}
              >
                {categories && categories.length > 0 ? categories.map(category => (
                  <option key={category.value} value={category.value}>
                    {category.label}
                  </option>
                )) : (
                  <option value="all">All Categories</option>
                )}
              </select>
            </div>

            {/* Date From Filter */}
            <div>
              <label style={{
                display: 'block',
                fontSize: '0.9rem',
                fontWeight: 'bold',
                color: '#111827',
                marginBottom: '0.5rem'
              }}>
                <Calendar size={16} style={{ marginRight: '0.5rem' }} />
                From Date
              </label>
              <input
                type="date"
                value={dateFrom}
                onChange={(e) => setDateFrom(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '2px solid rgba(5, 150, 105, 0.6)',
                  borderRadius: '0.5rem',
                  background: 'white',
                  fontSize: '0.9rem',
                  color: '#111827'
                }}
              />
            </div>

            {/* Date To Filter */}
            <div>
              <label style={{
                display: 'block',
                fontSize: '0.9rem',
                fontWeight: 'bold',
                color: '#111827',
                marginBottom: '0.5rem'
              }}>
                <Calendar size={16} style={{ marginRight: '0.5rem' }} />
                To Date
              </label>
              <input
                type="date"
                value={dateTo}
                onChange={(e) => setDateTo(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '2px solid rgba(5, 150, 105, 0.6)',
                  borderRadius: '0.5rem',
                  background: 'white',
                  fontSize: '0.9rem',
                  color: '#111827'
                }}
              />
            </div>

            {/* Search Filter */}
            <div>
              <label style={{
                display: 'block',
                fontSize: '0.9rem',
                fontWeight: 'bold',
                color: '#111827',
                marginBottom: '0.5rem'
              }}>
                <Search size={16} style={{ marginRight: '0.5rem' }} />
                Search
              </label>
              <input
                type="text"
                placeholder="Search activities..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '2px solid rgba(5, 150, 105, 0.6)',
                  borderRadius: '0.5rem',
                  background: 'white',
                  fontSize: '0.9rem',
                  color: '#111827'
                }}
              />
            </div>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div style={{
            textAlign: 'center',
            padding: '3rem',
            background: 'rgba(255, 255, 255, 0.9)',
            borderRadius: '1rem',
            border: '2px solid rgba(5, 150, 105, 0.6)'
          }}>
            <div style={{
              width: '40px',
              height: '40px',
              border: '4px solid rgba(5, 150, 105, 0.2)',
              borderTop: '4px solid #059669',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite',
              margin: '0 auto 1rem auto'
            }}></div>
            <p style={{ color: '#6b7280', fontSize: '1.1rem' }}>
              Loading activity logs...
            </p>
          </div>
        )}

        {/* Logs Table */}
        {!loading && (
          <div style={{
            background: 'rgba(255, 255, 255, 0.9)',
            borderRadius: '1rem',
            border: '2px solid rgba(5, 150, 105, 0.6)',
            overflow: 'hidden',
            boxShadow: '0 4px 15px rgba(5, 150, 105, 0.1)'
          }}>
            <div style={{
              overflowX: 'auto'
            }}>
              <table style={{
                width: '100%',
                borderCollapse: 'collapse'
              }}>
                <thead>
                  <tr style={{
                    background: 'linear-gradient(135deg, #059669 0%, #10b981 100%)',
                    color: 'white'
                  }}>
                    <th style={{
                      padding: '1rem',
                      textAlign: 'left',
                      fontSize: '0.9rem',
                      fontWeight: 'bold'
                    }}>
                      Date
                    </th>
                    <th style={{
                      padding: '1rem',
                      textAlign: 'left',
                      fontSize: '0.9rem',
                      fontWeight: 'bold'
                    }}>
                      Description
                    </th>
                    <th style={{
                      padding: '1rem',
                      textAlign: 'center',
                      fontSize: '0.9rem',
                      fontWeight: 'bold'
                    }}>
                      Category
                    </th>
                    <th style={{
                      padding: '1rem',
                      textAlign: 'right',
                      fontSize: '0.9rem',
                      fontWeight: 'bold'
                    }}>
                      Carbon Impact
                    </th>
                    <th style={{
                      padding: '1rem',
                      textAlign: 'center',
                      fontSize: '0.9rem',
                      fontWeight: 'bold'
                    }}>
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {logs.map((log, index) => {
                    const categoryInfo = getCategoryInfo(log.category);
                    return (
                      <tr
                        key={log.id}
                        style={{
                          background: index % 2 === 0 ? 'rgba(236, 253, 245, 0.5)' : 'white',
                          borderBottom: '1px solid rgba(5, 150, 105, 0.2)'
                        }}
                      >
                        <td style={{
                          padding: '1rem',
                          fontSize: '0.9rem',
                          fontWeight: '500',
                          color: '#111827'
                        }}>
                          {formatDate(log.date)}
                        </td>
                        <td style={{
                          padding: '1rem',
                          fontSize: '0.9rem',
                          color: '#111827'
                        }}>
                          <div style={{ fontWeight: '500', marginBottom: '0.25rem' }}>
                            {log.description}
                          </div>
                          {log.notes && (
                            <div style={{
                              fontSize: '0.8rem',
                              color: '#6b7280',
                              fontStyle: 'italic'
                            }}>
                              {log.notes}
                            </div>
                          )}
                        </td>
                        <td style={{
                          padding: '1rem',
                          textAlign: 'center'
                        }}>
                          <span style={{
                            background: `${categoryInfo.color}20`,
                            color: categoryInfo.color,
                            padding: '0.25rem 0.75rem',
                            borderRadius: '1rem',
                            fontSize: '0.8rem',
                            fontWeight: 'bold',
                            border: `1px solid ${categoryInfo.color}40`
                          }}>
                            {categoryInfo.label.split(' ')[1]}
                          </span>
                        </td>
                        <td style={{
                          padding: '1rem',
                          textAlign: 'right',
                          fontSize: '0.9rem',
                          fontWeight: 'bold',
                          color: '#059669'
                        }}>
                          {log.carbon_emission.toFixed(1)} kg CO₂
                        </td>
                        <td style={{
                          padding: '1rem',
                          textAlign: 'center'
                        }}>
                          <div style={{
                            display: 'flex',
                            gap: '0.5rem',
                            justifyContent: 'center'
                          }}>
                            <button
                              onClick={() => setEditingLog(log)}
                              style={{
                                background: 'rgba(59, 130, 246, 0.1)',
                                color: '#3b82f6',
                                border: '1px solid rgba(59, 130, 246, 0.3)',
                                borderRadius: '0.5rem',
                                padding: '0.5rem',
                                cursor: 'pointer',
                                fontSize: '0.8rem',
                                transition: 'all 0.2s ease'
                              }}
                              onMouseEnter={(e) => {
                                e.target.style.background = 'rgba(59, 130, 246, 0.2)';
                              }}
                              onMouseLeave={(e) => {
                                e.target.style.background = 'rgba(59, 130, 246, 0.1)';
                              }}
                            >
                              <Edit2 size={14} />
                            </button>
                            <button
                              onClick={() => handleDeleteLog(log.id)}
                              style={{
                                background: 'rgba(239, 68, 68, 0.1)',
                                color: '#ef4444',
                                border: '1px solid rgba(239, 68, 68, 0.3)',
                                borderRadius: '0.5rem',
                                padding: '0.5rem',
                                cursor: 'pointer',
                                fontSize: '0.8rem',
                                transition: 'all 0.2s ease'
                              }}
                              onMouseEnter={(e) => {
                                e.target.style.background = 'rgba(239, 68, 68, 0.2)';
                              }}
                              onMouseLeave={(e) => {
                                e.target.style.background = 'rgba(239, 68, 68, 0.1)';
                              }}
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Empty State */}
            {logs.length === 0 && (
              <div style={{
                textAlign: 'center',
                padding: '3rem',
                color: '#6b7280'
              }}>
                <div style={{
                  fontSize: '3rem',
                  marginBottom: '1rem'
                }}>
                  📝
                </div>
                <h3 style={{
                  fontSize: '1.2rem',
                  fontWeight: 'bold',
                  marginBottom: '0.5rem',
                  color: '#111827'
                }}>
                  No activity logs found
                </h3>
                <p style={{
                  marginBottom: '1.5rem'
                }}>
                  {selectedCategory !== 'all'
                    ? `No logs found for ${getCategoryInfo(selectedCategory).label.toLowerCase()}`
                    : 'Start tracking your activities to see them here'
                  }
                </p>
                <button
                  onClick={() => setShowAddModal(true)}
                  style={{
                    background: 'linear-gradient(135deg, #059669 0%, #10b981 100%)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '0.75rem',
                    padding: '0.75rem 1.5rem',
                    fontSize: '1rem',
                    fontWeight: 'bold',
                    cursor: 'pointer'
                  }}
                >
                  Add Your First Activity
                </button>
              </div>
            )}
          </div>
        )}

        {/* Pagination */}
        {!loading && logs.length > 0 && (
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            gap: '1rem',
            marginTop: '2rem'
          }}>
            <button
              onClick={() => setCurrentPage(currentPage - 1)}
              disabled={currentPage === 1}
              style={{
                background: currentPage === 1 ? 'rgba(5, 150, 105, 0.2)' : 'white',
                color: currentPage === 1 ? '#6b7280' : '#059669',
                border: `2px solid ${currentPage === 1 ? 'rgba(5, 150, 105, 0.3)' : '#059669'}`,
                borderRadius: '0.5rem',
                padding: '0.5rem 1rem',
                cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
                fontSize: '0.9rem',
                fontWeight: 'bold',
                transition: 'all 0.2s ease'
              }}
            >
              <ChevronLeft size={16} style={{ marginRight: '0.25rem' }} />
              Previous
            </button>

            <div style={{
              display: 'flex',
              gap: '0.5rem'
            }}>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  style={{
                    background: currentPage === page ? '#059669' : 'white',
                    color: currentPage === page ? 'white' : '#059669',
                    border: `2px solid ${currentPage === page ? '#059669' : 'rgba(5, 150, 105, 0.6)'}`,
                    borderRadius: '0.5rem',
                    padding: '0.5rem 0.75rem',
                    cursor: 'pointer',
                    fontSize: '0.9rem',
                    fontWeight: 'bold',
                    minWidth: '40px',
                    transition: 'all 0.2s ease'
                  }}
                >
                  {page}
                </button>
              ))}
            </div>

            <button
              onClick={() => setCurrentPage(currentPage + 1)}
              disabled={currentPage === totalPages}
              style={{
                background: currentPage === totalPages ? 'rgba(5, 150, 105, 0.2)' : 'white',
                color: currentPage === totalPages ? '#6b7280' : '#059669',
                border: `2px solid ${currentPage === totalPages ? 'rgba(5, 150, 105, 0.3)' : '#059669'}`,
                borderRadius: '0.5rem',
                padding: '0.5rem 1rem',
                cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
                fontSize: '0.9rem',
                fontWeight: 'bold',
                transition: 'all 0.2s ease'
              }}
            >
              Next
              <ChevronRight size={16} style={{ marginLeft: '0.25rem' }} />
            </button>
          </div>
        )}
      </div>

      {/* Add Activity Modal */}
      {showAddModal && (
        <AddActivityModal
          onClose={() => setShowAddModal(false)}
          onSave={handleAddLog}
          categories={categories}
        />
      )}

      {/* Edit Activity Modal */}
      {editingLog && (
        <EditActivityModal
          log={editingLog}
          onClose={() => setEditingLog(null)}
          onSave={handleEditLog}
          categories={categories}
        />
      )}

      {/* CSS for loading animation */}
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

// Add Activity Modal Component
const AddActivityModal = ({ onClose, onSave, categories }) => {
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    description: '',
    category: 'travel',
    carbon_emission: '',
    notes: '',
    location: ''
  });

  const [errors, setErrors] = useState({});

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validation
    const newErrors = {};
    if (!formData.date) newErrors.date = 'Date is required';
    if (!formData.description.trim()) newErrors.description = 'Description is required';
    if (!formData.category) newErrors.category = 'Category is required';
    if (!formData.carbon_emission || formData.carbon_emission <= 0) {
      newErrors.carbon_emission = 'Carbon emission must be greater than 0';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    onSave({
      ...formData,
      description: formData.description.trim(),
      carbon_emission: parseFloat(formData.carbon_emission),
      notes: formData.notes.trim(),
      location: formData.location.trim()
    });
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      padding: '1rem'
    }}>
      <div style={{
        background: 'white',
        borderRadius: '1rem',
        padding: '2rem',
        maxWidth: '500px',
        width: '100%',
        maxHeight: '90vh',
        overflowY: 'auto',
        boxShadow: '0 20px 40px rgba(0, 0, 0, 0.3)'
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '1.5rem'
        }}>
          <h2 style={{
            fontSize: '1.5rem',
            fontWeight: 'bold',
            color: '#111827',
            margin: 0
          }}>
            ➕ Add New Activity
          </h2>
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              fontSize: '1.5rem',
              cursor: 'pointer',
              color: '#6b7280',
              padding: '0.25rem'
            }}
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '1rem' }}>
            <label style={{
              display: 'block',
              fontSize: '0.9rem',
              fontWeight: 'bold',
              color: '#111827',
              marginBottom: '0.5rem'
            }}>
              Date *
            </label>
            <input
              type="date"
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              style={{
                width: '100%',
                padding: '0.75rem',
                border: `2px solid ${errors.date ? '#ef4444' : 'rgba(5, 150, 105, 0.6)'}`,
                borderRadius: '0.5rem',
                fontSize: '0.9rem',
                color: '#111827'
              }}
            />
            {errors.date && (
              <p style={{ color: '#ef4444', fontSize: '0.8rem', marginTop: '0.25rem' }}>
                {errors.date}
              </p>
            )}
          </div>

          <div style={{ marginBottom: '1rem' }}>
            <label style={{
              display: 'block',
              fontSize: '0.9rem',
              fontWeight: 'bold',
              color: '#111827',
              marginBottom: '0.5rem'
            }}>
              Description *
            </label>
            <input
              type="text"
              placeholder="e.g., Flight to London, Grocery shopping..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              style={{
                width: '100%',
                padding: '0.75rem',
                border: `2px solid ${errors.description ? '#ef4444' : 'rgba(5, 150, 105, 0.6)'}`,
                borderRadius: '0.5rem',
                fontSize: '0.9rem',
                color: '#111827'
              }}
            />
            {errors.description && (
              <p style={{ color: '#ef4444', fontSize: '0.8rem', marginTop: '0.25rem' }}>
                {errors.description}
              </p>
            )}
          </div>

          <div style={{ marginBottom: '1rem' }}>
            <label style={{
              display: 'block',
              fontSize: '0.9rem',
              fontWeight: 'bold',
              color: '#111827',
              marginBottom: '0.5rem'
            }}>
              Category *
            </label>
            <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              style={{
                width: '100%',
                padding: '0.75rem',
                border: `2px solid ${errors.category ? '#ef4444' : 'rgba(5, 150, 105, 0.6)'}`,
                borderRadius: '0.5rem',
                fontSize: '0.9rem',
                color: '#111827',
                background: 'white'
              }}
            >
              {categories && categories.length > 0 ? categories.filter(cat => cat.value !== 'all').map(category => (
                <option key={category.value} value={category.value}>
                  {category.label}
                </option>
              )) : null}
            </select>
            {errors.category && (
              <p style={{ color: '#ef4444', fontSize: '0.8rem', marginTop: '0.25rem' }}>
                {errors.category}
              </p>
            )}
          </div>

          <div style={{ marginBottom: '1rem' }}>
            <label style={{
              display: 'block',
              fontSize: '0.9rem',
              fontWeight: 'bold',
              color: '#111827',
              marginBottom: '0.5rem'
            }}>
              Carbon Emission (kg CO₂) *
            </label>
            <input
              type="number"
              step="0.1"
              min="0"
              placeholder="e.g., 124.5"
              value={formData.carbon_emission}
              onChange={(e) => setFormData({ ...formData, carbon_emission: e.target.value })}
              style={{
                width: '100%',
                padding: '0.75rem',
                border: `2px solid ${errors.carbon_emission ? '#ef4444' : 'rgba(5, 150, 105, 0.6)'}`,
                borderRadius: '0.5rem',
                fontSize: '0.9rem',
                color: '#111827'
              }}
            />
            {errors.carbon_emission && (
              <p style={{ color: '#ef4444', fontSize: '0.8rem', marginTop: '0.25rem' }}>
                {errors.carbon_emission}
              </p>
            )}
          </div>

          <div style={{ marginBottom: '1rem' }}>
            <label style={{
              display: 'block',
              fontSize: '0.9rem',
              fontWeight: 'bold',
              color: '#111827',
              marginBottom: '0.5rem'
            }}>
              Location (Optional)
            </label>
            <input
              type="text"
              placeholder="e.g., London, UK, Home, Office..."
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              style={{
                width: '100%',
                padding: '0.75rem',
                border: '2px solid rgba(5, 150, 105, 0.6)',
                borderRadius: '0.5rem',
                fontSize: '0.9rem',
                color: '#111827'
              }}
            />
          </div>

          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{
              display: 'block',
              fontSize: '0.9rem',
              fontWeight: 'bold',
              color: '#111827',
              marginBottom: '0.5rem'
            }}>
              Notes (Optional)
            </label>
            <textarea
              placeholder="Additional details, context, or observations..."
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              rows={3}
              style={{
                width: '100%',
                padding: '0.75rem',
                border: '2px solid rgba(5, 150, 105, 0.6)',
                borderRadius: '0.5rem',
                fontSize: '0.9rem',
                color: '#111827',
                resize: 'vertical',
                fontFamily: 'inherit'
              }}
            />
          </div>

          <div style={{
            display: 'flex',
            gap: '1rem',
            justifyContent: 'flex-end'
          }}>
            <button
              type="button"
              onClick={onClose}
              style={{
                background: 'rgba(107, 114, 128, 0.1)',
                color: '#6b7280',
                border: '2px solid rgba(107, 114, 128, 0.3)',
                borderRadius: '0.5rem',
                padding: '0.75rem 1.5rem',
                fontSize: '0.9rem',
                fontWeight: 'bold',
                cursor: 'pointer'
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              style={{
                background: 'linear-gradient(135deg, #059669 0%, #10b981 100%)',
                color: 'white',
                border: 'none',
                borderRadius: '0.5rem',
                padding: '0.75rem 1.5rem',
                fontSize: '0.9rem',
                fontWeight: 'bold',
                cursor: 'pointer'
              }}
            >
              Add Activity
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Edit Activity Modal Component
const EditActivityModal = ({ log, onClose, onSave, categories }) => {
  const [formData, setFormData] = useState({
    date: log.date,
    description: log.description,
    category: log.category,
    carbon_emission: log.carbon_emission.toString(),
    notes: log.notes || '',
    location: log.location || ''
  });

  const [errors, setErrors] = useState({});

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validation
    const newErrors = {};
    if (!formData.date) newErrors.date = 'Date is required';
    if (!formData.description.trim()) newErrors.description = 'Description is required';
    if (!formData.category) newErrors.category = 'Category is required';
    if (!formData.carbon_emission || formData.carbon_emission <= 0) {
      newErrors.carbon_emission = 'Carbon emission must be greater than 0';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    onSave({
      ...log,
      ...formData,
      description: formData.description.trim(),
      carbon_emission: parseFloat(formData.carbon_emission),
      notes: formData.notes.trim(),
      location: formData.location.trim()
    });
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      padding: '1rem'
    }}>
      <div style={{
        background: 'white',
        borderRadius: '1rem',
        padding: '2rem',
        maxWidth: '500px',
        width: '100%',
        maxHeight: '90vh',
        overflowY: 'auto',
        boxShadow: '0 20px 40px rgba(0, 0, 0, 0.3)'
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '1.5rem'
        }}>
          <h2 style={{
            fontSize: '1.5rem',
            fontWeight: 'bold',
            color: '#111827',
            margin: 0
          }}>
            ✏️ Edit Activity
          </h2>
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              fontSize: '1.5rem',
              cursor: 'pointer',
              color: '#6b7280',
              padding: '0.25rem'
            }}
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '1rem' }}>
            <label style={{
              display: 'block',
              fontSize: '0.9rem',
              fontWeight: 'bold',
              color: '#111827',
              marginBottom: '0.5rem'
            }}>
              Date *
            </label>
            <input
              type="date"
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              style={{
                width: '100%',
                padding: '0.75rem',
                border: `2px solid ${errors.date ? '#ef4444' : 'rgba(5, 150, 105, 0.6)'}`,
                borderRadius: '0.5rem',
                fontSize: '0.9rem',
                color: '#111827'
              }}
            />
            {errors.date && (
              <p style={{ color: '#ef4444', fontSize: '0.8rem', marginTop: '0.25rem' }}>
                {errors.date}
              </p>
            )}
          </div>

          <div style={{ marginBottom: '1rem' }}>
            <label style={{
              display: 'block',
              fontSize: '0.9rem',
              fontWeight: 'bold',
              color: '#111827',
              marginBottom: '0.5rem'
            }}>
              Description *
            </label>
            <input
              type="text"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              style={{
                width: '100%',
                padding: '0.75rem',
                border: `2px solid ${errors.description ? '#ef4444' : 'rgba(5, 150, 105, 0.6)'}`,
                borderRadius: '0.5rem',
                fontSize: '0.9rem',
                color: '#111827'
              }}
            />
            {errors.description && (
              <p style={{ color: '#ef4444', fontSize: '0.8rem', marginTop: '0.25rem' }}>
                {errors.description}
              </p>
            )}
          </div>

          <div style={{ marginBottom: '1rem' }}>
            <label style={{
              display: 'block',
              fontSize: '0.9rem',
              fontWeight: 'bold',
              color: '#111827',
              marginBottom: '0.5rem'
            }}>
              Category *
            </label>
            <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              style={{
                width: '100%',
                padding: '0.75rem',
                border: `2px solid ${errors.category ? '#ef4444' : 'rgba(5, 150, 105, 0.6)'}`,
                borderRadius: '0.5rem',
                fontSize: '0.9rem',
                color: '#111827',
                background: 'white'
              }}
            >
              {categories && categories.length > 0 ? categories.filter(cat => cat.value !== 'all').map(category => (
                <option key={category.value} value={category.value}>
                  {category.label}
                </option>
              )) : null}
            </select>
            {errors.category && (
              <p style={{ color: '#ef4444', fontSize: '0.8rem', marginTop: '0.25rem' }}>
                {errors.category}
              </p>
            )}
          </div>

          <div style={{ marginBottom: '1rem' }}>
            <label style={{
              display: 'block',
              fontSize: '0.9rem',
              fontWeight: 'bold',
              color: '#111827',
              marginBottom: '0.5rem'
            }}>
              Carbon Emission (kg CO₂) *
            </label>
            <input
              type="number"
              step="0.1"
              min="0"
              value={formData.carbon_emission}
              onChange={(e) => setFormData({ ...formData, carbon_emission: e.target.value })}
              style={{
                width: '100%',
                padding: '0.75rem',
                border: `2px solid ${errors.carbon_emission ? '#ef4444' : 'rgba(5, 150, 105, 0.6)'}`,
                borderRadius: '0.5rem',
                fontSize: '0.9rem',
                color: '#111827'
              }}
            />
            {errors.carbon_emission && (
              <p style={{ color: '#ef4444', fontSize: '0.8rem', marginTop: '0.25rem' }}>
                {errors.carbon_emission}
              </p>
            )}
          </div>

          <div style={{ marginBottom: '1rem' }}>
            <label style={{
              display: 'block',
              fontSize: '0.9rem',
              fontWeight: 'bold',
              color: '#111827',
              marginBottom: '0.5rem'
            }}>
              Location (Optional)
            </label>
            <input
              type="text"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              style={{
                width: '100%',
                padding: '0.75rem',
                border: '2px solid rgba(5, 150, 105, 0.6)',
                borderRadius: '0.5rem',
                fontSize: '0.9rem',
                color: '#111827'
              }}
            />
          </div>

          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{
              display: 'block',
              fontSize: '0.9rem',
              fontWeight: 'bold',
              color: '#111827',
              marginBottom: '0.5rem'
            }}>
              Notes (Optional)
            </label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              rows={3}
              style={{
                width: '100%',
                padding: '0.75rem',
                border: '2px solid rgba(5, 150, 105, 0.6)',
                borderRadius: '0.5rem',
                fontSize: '0.9rem',
                color: '#111827',
                resize: 'vertical',
                fontFamily: 'inherit'
              }}
            />
          </div>

          <div style={{
            display: 'flex',
            gap: '1rem',
            justifyContent: 'flex-end'
          }}>
            <button
              type="button"
              onClick={onClose}
              style={{
                background: 'rgba(107, 114, 128, 0.1)',
                color: '#6b7280',
                border: '2px solid rgba(107, 114, 128, 0.3)',
                borderRadius: '0.5rem',
                padding: '0.75rem 1.5rem',
                fontSize: '0.9rem',
                fontWeight: 'bold',
                cursor: 'pointer'
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              style={{
                background: 'linear-gradient(135deg, #059669 0%, #10b981 100%)',
                color: 'white',
                border: 'none',
                borderRadius: '0.5rem',
                padding: '0.75rem 1.5rem',
                fontSize: '0.9rem',
                fontWeight: 'bold',
                cursor: 'pointer'
              }}
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Logs;
