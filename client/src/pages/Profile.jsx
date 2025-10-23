import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  User,
  Settings,
  Bell,
  Shield,
  Palette,
  Camera,
  Save,
  Trash2,
  LogOut,
  Eye,
  EyeOff,
  Moon,
  Sun,
  Monitor,
  Mail,
  Smartphone,
  Calendar,
  MapPin,
  Edit3,
  Check,
  X
} from 'lucide-react';
import { userAPI, themeManager } from '../services/userAPI';

const Profile = () => {
  // Check authentication
  const isAuthenticated = localStorage.getItem('token') || localStorage.getItem('user');

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
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
            Please sign in to access your profile and settings.
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
              Sign In
            </a>
          </div>
        </div>
      </div>
    );
  }

  // State management
  const [activeTab, setActiveTab] = useState('profile');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [profile, setProfile] = useState({
    name: '',
    email: '',
    bio: '',
    location: '',
    avatar: ''
  });

  const [preferences, setPreferences] = useState({
    theme: 'light',
    notifications: {
      email: true,
      push: true,
      weekly_report: true,
      goal_reminders: true
    },
    privacy: {
      profile_public: false,
      show_emissions: true,
      show_achievements: true
    }
  });

  const [formErrors, setFormErrors] = useState({});
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // Load user profile and preferences
  useEffect(() => {
    const loadUserData = async () => {
      try {
        setLoading(true);
        const userProfile = await userAPI.getUserProfile();

        setProfile({
          name: userProfile.name || '',
          email: userProfile.email || '',
          bio: userProfile.bio || '',
          location: userProfile.location || '',
          avatar: userProfile.avatar || ''
        });

        setPreferences(userProfile.preferences || preferences);

        // Apply current theme
        themeManager.initialize();

      } catch (error) {
        console.error('Error loading user data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadUserData();
  }, []);

  // Handle profile form submission
  const handleProfileSubmit = async (e) => {
    e.preventDefault();

    // Validation
    const errors = {};
    if (!profile.name.trim()) errors.name = 'Name is required';
    if (!profile.email.trim()) errors.email = 'Email is required';
    if (!profile.email.includes('@')) errors.email = 'Please enter a valid email';

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    try {
      setSaving(true);
      await userAPI.updateUserProfile(profile);
      setFormErrors({});
      // Show success message
      alert('Profile updated successfully!');
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Failed to update profile. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  // Handle theme change
  const handleThemeChange = async (newTheme) => {
    const updatedPreferences = {
      ...preferences,
      theme: newTheme
    };

    setPreferences(updatedPreferences);

    // Apply theme immediately
    themeManager.applyTheme(newTheme);

    try {
      await userAPI.updateUserPreferences(updatedPreferences);
    } catch (error) {
      console.error('Error updating theme preference:', error);
    }
  };

  // Handle notification settings change
  const handleNotificationChange = async (setting, value) => {
    const updatedPreferences = {
      ...preferences,
      notifications: {
        ...preferences.notifications,
        [setting]: value
      }
    };

    setPreferences(updatedPreferences);

    try {
      await userAPI.updateUserPreferences(updatedPreferences);
    } catch (error) {
      console.error('Error updating notification settings:', error);
    }
  };

  // Handle privacy settings change
  const handlePrivacyChange = async (setting, value) => {
    const updatedPreferences = {
      ...preferences,
      privacy: {
        ...preferences.privacy,
        [setting]: value
      }
    };

    setPreferences(updatedPreferences);

    try {
      await userAPI.updateUserPreferences(updatedPreferences);
    } catch (error) {
      console.error('Error updating privacy settings:', error);
    }
  };

  // Handle avatar upload
  const handleAvatarUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type and size
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file');
      return;
    }

    if (file.size > 5 * 1024 * 1024) { // 5MB limit
      alert('Image size should be less than 5MB');
      return;
    }

    try {
      const response = await userAPI.uploadProfilePicture(file);
      setProfile(prev => ({ ...prev, avatar: response.avatar_url }));
      alert('Profile picture updated successfully!');
    } catch (error) {
      console.error('Error uploading avatar:', error);
      alert('Failed to upload profile picture');
    }
  };

  // Handle account deletion
  const handleDeleteAccount = async () => {
    if (!window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      return;
    }

    try {
      await userAPI.deleteAccount();
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      alert('Account deletion initiated. You will receive a confirmation email.');
      window.location.href = '/login';
    } catch (error) {
      console.error('Error deleting account:', error);
      alert('Failed to delete account. Please contact support.');
    }
  };

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #ecfdf5 0%, #f0fdf4 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <div style={{
          background: 'rgba(255, 255, 255, 0.9)',
          borderRadius: '1rem',
          padding: '3rem',
          textAlign: 'center',
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
            Loading profile...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #ecfdf5 0%, #f0fdf4 100%)',
      padding: '2rem'
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto'
      }}>
        {/* Header */}
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
              }}
              onMouseLeave={(e) => {
                e.target.style.background = 'rgba(255, 255, 255, 0.9)';
                e.target.style.transform = 'translateY(0)';
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
                👤 Profile & Settings
              </h1>
              <p style={{
                fontSize: '1.1rem',
                color: '#6b7280',
                margin: 0
              }}>
                Manage your account, preferences, and privacy settings
              </p>
            </div>
          </div>

          {/* Theme Toggle */}
          <button
            onClick={() => {
              const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
              const newTheme = currentTheme === 'light' ? 'dark' : 'light';
              document.documentElement.setAttribute('data-theme', newTheme);
              localStorage.setItem('theme', newTheme);
              // Update preferences in backend
              const updatedPreferences = {
                ...preferences,
                theme: newTheme
              };
              setPreferences(updatedPreferences);
              userAPI.updateUserPreferences(updatedPreferences).catch(console.error);
            }}
            style={{
              background: 'rgba(255, 255, 255, 0.9)',
              border: '2px solid rgba(5, 150, 105, 0.6)',
              borderRadius: '0.75rem',
              padding: '0.75rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
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
            title="Toggle theme"
          >
            {document.documentElement.getAttribute('data-theme') === 'dark' ? '🌞' : '🌙'}
          </button>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: '300px 1fr',
          gap: '2rem'
        }}>
          {/* Sidebar Navigation */}
          <div style={{
            background: 'rgba(255, 255, 255, 0.9)',
            borderRadius: '1rem',
            border: '2px solid rgba(5, 150, 105, 0.6)',
            overflow: 'hidden',
            boxShadow: '0 4px 15px rgba(5, 150, 105, 0.1)'
          }}>
            <nav style={{ padding: '1rem' }}>
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '0.5rem'
              }}>
                <button
                  onClick={() => setActiveTab('profile')}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem',
                    padding: '1rem',
                    border: 'none',
                    borderRadius: '0.75rem',
                    background: activeTab === 'profile' ? 'linear-gradient(135deg, #059669 0%, #10b981 100%)' : 'transparent',
                    color: activeTab === 'profile' ? 'white' : '#6b7280',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    fontSize: '1rem',
                    fontWeight: '500'
                  }}
                >
                  <User size={20} />
                  Profile
                </button>

                <button
                  onClick={() => setActiveTab('theme')}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem',
                    padding: '1rem',
                    border: 'none',
                    borderRadius: '0.75rem',
                    background: activeTab === 'theme' ? 'linear-gradient(135deg, #059669 0%, #10b981 100%)' : 'transparent',
                    color: activeTab === 'theme' ? 'white' : '#6b7280',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    fontSize: '1rem',
                    fontWeight: '500'
                  }}
                >
                  <Palette size={20} />
                  Theme
                </button>

                <button
                  onClick={() => setActiveTab('notifications')}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem',
                    padding: '1rem',
                    border: 'none',
                    borderRadius: '0.75rem',
                    background: activeTab === 'notifications' ? 'linear-gradient(135deg, #059669 0%, #10b981 100%)' : 'transparent',
                    color: activeTab === 'notifications' ? 'white' : '#6b7280',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    fontSize: '1rem',
                    fontWeight: '500'
                  }}
                >
                  <Bell size={20} />
                  Notifications
                </button>

                <button
                  onClick={() => setActiveTab('privacy')}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem',
                    padding: '1rem',
                    border: 'none',
                    borderRadius: '0.75rem',
                    background: activeTab === 'privacy' ? 'linear-gradient(135deg, #059669 0%, #10b981 100%)' : 'transparent',
                    color: activeTab === 'privacy' ? 'white' : '#6b7280',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    fontSize: '1rem',
                    fontWeight: '500'
                  }}
                >
                  <Shield size={20} />
                  Privacy
                </button>
              </div>
            </nav>
          </div>

          {/* Main Content */}
          <div style={{
            background: 'rgba(255, 255, 255, 0.9)',
            borderRadius: '1rem',
            border: '2px solid rgba(5, 150, 105, 0.6)',
            padding: '2rem',
            boxShadow: '0 4px 15px rgba(5, 150, 105, 0.1)'
          }}>
            {/* Profile Tab */}
            {activeTab === 'profile' && (
              <div>
                <h2 style={{
                  fontSize: '1.8rem',
                  fontWeight: 'bold',
                  color: '#111827',
                  marginBottom: '1.5rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem'
                }}>
                  <User size={24} />
                  Profile Information
                </h2>

                <form onSubmit={handleProfileSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                  {/* Avatar Section */}
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '1.5rem',
                    paddingBottom: '1.5rem',
                    borderBottom: '2px solid rgba(5, 150, 105, 0.2)'
                  }}>
                    <div style={{ position: 'relative' }}>
                      <img
                        src={profile.avatar || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face'}
                        alt="Profile"
                        style={{
                          width: '100px',
                          height: '100px',
                          borderRadius: '50%',
                          objectFit: 'cover',
                          border: '4px solid rgba(5, 150, 105, 0.6)'
                        }}
                      />
                      <label style={{
                        position: 'absolute',
                        bottom: '0',
                        right: '0',
                        background: 'linear-gradient(135deg, #059669 0%, #10b981 100%)',
                        color: 'white',
                        borderRadius: '50%',
                        width: '32px',
                        height: '32px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                        border: '2px solid white',
                        fontSize: '14px'
                      }}>
                        <Camera size={16} />
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleAvatarUpload}
                          style={{ display: 'none' }}
                        />
                      </label>
                    </div>
                    <div>
                      <h3 style={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#111827', marginBottom: '0.25rem' }}>
                        Profile Picture
                      </h3>
                      <p style={{ color: '#6b7280', fontSize: '0.9rem', marginBottom: '0.5rem' }}>
                        Upload a new profile picture. Max size: 5MB
                      </p>
                      <label style={{
                        background: 'rgba(5, 150, 105, 0.1)',
                        color: '#059669',
                        border: '2px solid rgba(5, 150, 105, 0.6)',
                        borderRadius: '0.5rem',
                        padding: '0.5rem 1rem',
                        fontSize: '0.9rem',
                        fontWeight: 'bold',
                        cursor: 'pointer',
                        display: 'inline-block',
                        transition: 'all 0.3s ease'
                      }}>
                        Change Picture
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleAvatarUpload}
                          style={{ display: 'none' }}
                        />
                      </label>
                    </div>
                  </div>

                  {/* Name Field */}
                  <div>
                    <label style={{
                      display: 'block',
                      fontSize: '0.9rem',
                      fontWeight: 'bold',
                      color: '#111827',
                      marginBottom: '0.5rem'
                    }}>
                      Full Name *
                    </label>
                    <input
                      type="text"
                      value={profile.name}
                      onChange={(e) => setProfile(prev => ({ ...prev, name: e.target.value }))}
                      style={{
                        width: '100%',
                        padding: '0.75rem',
                        border: `2px solid ${formErrors.name ? '#ef4444' : 'rgba(5, 150, 105, 0.6)'}`,
                        borderRadius: '0.5rem',
                        fontSize: '1rem',
                        color: '#111827'
                      }}
                      placeholder="Enter your full name"
                    />
                    {formErrors.name && (
                      <p style={{ color: '#ef4444', fontSize: '0.8rem', marginTop: '0.25rem' }}>
                        {formErrors.name}
                      </p>
                    )}
                  </div>

                  {/* Email Field */}
                  <div>
                    <label style={{
                      display: 'block',
                      fontSize: '0.9rem',
                      fontWeight: 'bold',
                      color: '#111827',
                      marginBottom: '0.5rem'
                    }}>
                      Email Address *
                    </label>
                    <input
                      type="email"
                      value={profile.email}
                      onChange={(e) => setProfile(prev => ({ ...prev, email: e.target.value }))}
                      style={{
                        width: '100%',
                        padding: '0.75rem',
                        border: `2px solid ${formErrors.email ? '#ef4444' : 'rgba(5, 150, 105, 0.6)'}`,
                        borderRadius: '0.5rem',
                        fontSize: '1rem',
                        color: '#111827'
                      }}
                      placeholder="Enter your email address"
                    />
                    {formErrors.email && (
                      <p style={{ color: '#ef4444', fontSize: '0.8rem', marginTop: '0.25rem' }}>
                        {formErrors.email}
                      </p>
                    )}
                  </div>

                  {/* Bio Field */}
                  <div>
                    <label style={{
                      display: 'block',
                      fontSize: '0.9rem',
                      fontWeight: 'bold',
                      color: '#111827',
                      marginBottom: '0.5rem'
                    }}>
                      Bio
                    </label>
                    <textarea
                      value={profile.bio}
                      onChange={(e) => setProfile(prev => ({ ...prev, bio: e.target.value }))}
                      rows={3}
                      style={{
                        width: '100%',
                        padding: '0.75rem',
                        border: '2px solid rgba(5, 150, 105, 0.6)',
                        borderRadius: '0.5rem',
                        fontSize: '1rem',
                        color: '#111827',
                        resize: 'vertical',
                        fontFamily: 'inherit'
                      }}
                      placeholder="Tell us about yourself..."
                    />
                  </div>

                  {/* Location Field */}
                  <div>
                    <label style={{
                      display: 'block',
                      fontSize: '0.9rem',
                      fontWeight: 'bold',
                      color: '#111827',
                      marginBottom: '0.5rem'
                    }}>
                      Location
                    </label>
                    <input
                      type="text"
                      value={profile.location}
                      onChange={(e) => setProfile(prev => ({ ...prev, location: e.target.value }))}
                      style={{
                        width: '100%',
                        padding: '0.75rem',
                        border: '2px solid rgba(5, 150, 105, 0.6)',
                        borderRadius: '0.5rem',
                        fontSize: '1rem',
                        color: '#111827'
                      }}
                      placeholder="City, Country"
                    />
                  </div>

                  {/* Save Button */}
                  <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
                    <button
                      type="button"
                      onClick={() => window.location.reload()}
                      style={{
                        background: 'rgba(107, 114, 128, 0.1)',
                        color: '#6b7280',
                        border: '2px solid rgba(107, 114, 128, 0.3)',
                        borderRadius: '0.5rem',
                        padding: '0.75rem 1.5rem',
                        fontSize: '1rem',
                        fontWeight: 'bold',
                        cursor: 'pointer'
                      }}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={saving}
                      style={{
                        background: saving ? 'rgba(5, 150, 105, 0.6)' : 'linear-gradient(135deg, #059669 0%, #10b981 100%)',
                        color: 'white',
                        border: 'none',
                        borderRadius: '0.5rem',
                        padding: '0.75rem 1.5rem',
                        fontSize: '1rem',
                        fontWeight: 'bold',
                        cursor: saving ? 'not-allowed' : 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem'
                      }}
                    >
                      <Save size={18} />
                      {saving ? 'Saving...' : 'Save Changes'}
                    </button>
                  </div>
                </form>

                {/* Danger Zone */}
                <div style={{
                  marginTop: '2rem',
                  padding: '1.5rem',
                  background: 'rgba(239, 68, 68, 0.1)',
                  border: '2px solid rgba(239, 68, 68, 0.3)',
                  borderRadius: '0.75rem'
                }}>
                  <h3 style={{
                    fontSize: '1.2rem',
                    fontWeight: 'bold',
                    color: '#dc2626',
                    marginBottom: '1rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem'
                  }}>
                    <Trash2 size={20} />
                    Danger Zone
                  </h3>
                  <p style={{
                    color: '#7f1d1d',
                    marginBottom: '1rem',
                    fontSize: '0.9rem'
                  }}>
                    Once you delete your account, there is no going back. Please be certain.
                  </p>
                  <button
                    onClick={() => setShowDeleteConfirm(true)}
                    style={{
                      background: '#dc2626',
                      color: 'white',
                      border: 'none',
                      borderRadius: '0.5rem',
                      padding: '0.75rem 1.5rem',
                      fontSize: '0.9rem',
                      fontWeight: 'bold',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem'
                    }}
                  >
                    <Trash2 size={16} />
                    Delete Account
                  </button>
                </div>
              </div>
            )}

            {/* Theme Tab */}
            {activeTab === 'theme' && (
              <div>
                <h2 style={{
                  fontSize: '1.8rem',
                  fontWeight: 'bold',
                  color: '#111827',
                  marginBottom: '1.5rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem'
                }}>
                  <Palette size={24} />
                  Theme Settings
                </h2>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                  <div>
                    <h3 style={{
                      fontSize: '1.2rem',
                      fontWeight: 'bold',
                      color: '#111827',
                      marginBottom: '1rem'
                    }}>
                      Choose Theme
                    </h3>
                    <div style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                      gap: '1rem'
                    }}>
                      {/* Light Theme */}
                      <div
                        onClick={() => handleThemeChange('light')}
                        style={{
                          border: preferences.theme === 'light' ? '3px solid #059669' : '2px solid rgba(5, 150, 105, 0.6)',
                          borderRadius: '1rem',
                          padding: '1.5rem',
                          cursor: 'pointer',
                          background: preferences.theme === 'light' ? 'rgba(5, 150, 105, 0.1)' : 'white',
                          transition: 'all 0.3s ease'
                        }}
                      >
                        <div style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '1rem',
                          marginBottom: '1rem'
                        }}>
                          <Sun size={32} style={{ color: '#f59e0b' }} />
                          <div style={{
                            width: '60px',
                            height: '30px',
                            background: '#f3f4f6',
                            borderRadius: '15px',
                            position: 'relative'
                          }}>
                            <div style={{
                              width: '24px',
                              height: '24px',
                              background: '#fbbf24',
                              borderRadius: '50%',
                              position: 'absolute',
                              top: '3px',
                              left: '3px',
                              transition: 'all 0.3s ease'
                            }}></div>
                          </div>
                        </div>
                        <h4 style={{
                          fontSize: '1.1rem',
                          fontWeight: 'bold',
                          color: '#111827',
                          textAlign: 'center',
                          marginBottom: '0.5rem'
                        }}>
                          Light Theme
                        </h4>
                        <p style={{
                          fontSize: '0.9rem',
                          color: '#6b7280',
                          textAlign: 'center'
                        }}>
                          Clean and bright interface
                        </p>
                        {preferences.theme === 'light' && (
                          <div style={{
                            display: 'flex',
                            justifyContent: 'center',
                            marginTop: '0.5rem'
                          }}>
                            <Check size={20} style={{ color: '#059669' }} />
                          </div>
                        )}
                      </div>

                      {/* Dark Theme */}
                      <div
                        onClick={() => handleThemeChange('dark')}
                        style={{
                          border: preferences.theme === 'dark' ? '3px solid #059669' : '2px solid rgba(5, 150, 105, 0.6)',
                          borderRadius: '1rem',
                          padding: '1.5rem',
                          cursor: 'pointer',
                          background: preferences.theme === 'dark' ? 'rgba(5, 150, 105, 0.1)' : 'white',
                          transition: 'all 0.3s ease'
                        }}
                      >
                        <div style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '1rem',
                          marginBottom: '1rem'
                        }}>
                          <Moon size={32} style={{ color: '#6366f1' }} />
                          <div style={{
                            width: '60px',
                            height: '30px',
                            background: '#374151',
                            borderRadius: '15px',
                            position: 'relative'
                          }}>
                            <div style={{
                              width: '24px',
                              height: '24px',
                              background: '#60a5fa',
                              borderRadius: '50%',
                              position: 'absolute',
                              top: '3px',
                              right: '3px',
                              transition: 'all 0.3s ease'
                            }}></div>
                          </div>
                        </div>
                        <h4 style={{
                          fontSize: '1.1rem',
                          fontWeight: 'bold',
                          color: '#111827',
                          textAlign: 'center',
                          marginBottom: '0.5rem'
                        }}>
                          Dark Theme
                        </h4>
                        <p style={{
                          fontSize: '0.9rem',
                          color: '#6b7280',
                          textAlign: 'center'
                        }}>
                          Easy on the eyes
                        </p>
                        {preferences.theme === 'dark' && (
                          <div style={{
                            display: 'flex',
                            justifyContent: 'center',
                            marginTop: '0.5rem'
                          }}>
                            <Check size={20} style={{ color: '#059669' }} />
                          </div>
                        )}
                      </div>

                      {/* System Theme */}
                      <div
                        onClick={() => handleThemeChange('system')}
                        style={{
                          border: preferences.theme === 'system' ? '3px solid #059669' : '2px solid rgba(5, 150, 105, 0.6)',
                          borderRadius: '1rem',
                          padding: '1.5rem',
                          cursor: 'pointer',
                          background: preferences.theme === 'system' ? 'rgba(5, 150, 105, 0.1)' : 'white',
                          transition: 'all 0.3s ease'
                        }}
                      >
                        <div style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '1rem',
                          marginBottom: '1rem'
                        }}>
                          <Monitor size={32} style={{ color: '#10b981' }} />
                          <div style={{
                            width: '60px',
                            height: '30px',
                            background: 'linear-gradient(90deg, #f3f4f6 50%, #374151 50%)',
                            borderRadius: '15px',
                            position: 'relative'
                          }}>
                            <div style={{
                              width: '20px',
                              height: '20px',
                              background: '#10b981',
                              borderRadius: '50%',
                              position: 'absolute',
                              top: '5px',
                              left: '20px',
                              transition: 'all 0.3s ease'
                            }}></div>
                          </div>
                        </div>
                        <h4 style={{
                          fontSize: '1.1rem',
                          fontWeight: 'bold',
                          color: '#111827',
                          textAlign: 'center',
                          marginBottom: '0.5rem'
                        }}>
                          System Theme
                        </h4>
                        <p style={{
                          fontSize: '0.9rem',
                          color: '#6b7280',
                          textAlign: 'center'
                        }}>
                          Follow system preference
                        </p>
                        {preferences.theme === 'system' && (
                          <div style={{
                            display: 'flex',
                            justifyContent: 'center',
                            marginTop: '0.5rem'
                          }}>
                            <Check size={20} style={{ color: '#059669' }} />
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div style={{
                    padding: '1.5rem',
                    background: 'rgba(5, 150, 105, 0.1)',
                    border: '2px solid rgba(5, 150, 105, 0.6)',
                    borderRadius: '0.75rem'
                  }}>
                    <h3 style={{
                      fontSize: '1.1rem',
                      fontWeight: 'bold',
                      color: '#059669',
                      marginBottom: '0.5rem'
                    }}>
                      Current Theme Applied
                    </h3>
                    <p style={{
                      color: '#047857',
                      fontSize: '0.9rem',
                      margin: 0
                    }}>
                      Your theme preference has been saved and applied to your interface.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Notifications Tab */}
            {activeTab === 'notifications' && (
              <div>
                <h2 style={{
                  fontSize: '1.8rem',
                  fontWeight: 'bold',
                  color: '#111827',
                  marginBottom: '1.5rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem'
                }}>
                  <Bell size={24} />
                  Notification Settings
                </h2>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                  {/* Email Notifications */}
                  <div style={{
                    padding: '1.5rem',
                    background: 'rgba(255, 255, 255, 0.5)',
                    border: '2px solid rgba(5, 150, 105, 0.6)',
                    borderRadius: '0.75rem'
                  }}>
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      marginBottom: '1rem'
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <Mail size={20} style={{ color: '#059669' }} />
                        <h3 style={{
                          fontSize: '1.1rem',
                          fontWeight: 'bold',
                          color: '#111827',
                          margin: 0
                        }}>
                          Email Notifications
                        </h3>
                      </div>
                      <label style={{
                        position: 'relative',
                        display: 'inline-block',
                        width: '50px',
                        height: '26px'
                      }}>
                        <input
                          type="checkbox"
                          checked={preferences.notifications.email}
                          onChange={(e) => handleNotificationChange('email', e.target.checked)}
                          style={{ opacity: 0, width: 0, height: 0 }}
                        />
                        <span style={{
                          position: 'absolute',
                          cursor: 'pointer',
                          top: 0,
                          left: 0,
                          right: 0,
                          bottom: 0,
                          backgroundColor: preferences.notifications.email ? '#059669' : '#ccc',
                          transition: '.4s',
                          borderRadius: '26px'
                        }}>
                          <span style={{
                            position: 'absolute',
                            content: '',
                            height: '20px',
                            width: '20px',
                            left: '3px',
                            bottom: '3px',
                            backgroundColor: 'white',
                            transition: '.4s',
                            borderRadius: '50%',
                            transform: preferences.notifications.email ? 'translateX(24px)' : 'translateX(0)'
                          }}></span>
                        </span>
                      </label>
                    </div>
                    <p style={{
                      color: '#6b7280',
                      fontSize: '0.9rem',
                      margin: 0
                    }}>
                      Receive notifications about your activities via email
                    </p>
                  </div>

                  {/* Push Notifications */}
                  <div style={{
                    padding: '1.5rem',
                    background: 'rgba(255, 255, 255, 0.5)',
                    border: '2px solid rgba(5, 150, 105, 0.6)',
                    borderRadius: '0.75rem'
                  }}>
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      marginBottom: '1rem'
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <Smartphone size={20} style={{ color: '#059669' }} />
                        <h3 style={{
                          fontSize: '1.1rem',
                          fontWeight: 'bold',
                          color: '#111827',
                          margin: 0
                        }}>
                          Push Notifications
                        </h3>
                      </div>
                      <label style={{
                        position: 'relative',
                        display: 'inline-block',
                        width: '50px',
                        height: '26px'
                      }}>
                        <input
                          type="checkbox"
                          checked={preferences.notifications.push}
                          onChange={(e) => handleNotificationChange('push', e.target.checked)}
                          style={{ opacity: 0, width: 0, height: 0 }}
                        />
                        <span style={{
                          position: 'absolute',
                          cursor: 'pointer',
                          top: 0,
                          left: 0,
                          right: 0,
                          bottom: 0,
                          backgroundColor: preferences.notifications.push ? '#059669' : '#ccc',
                          transition: '.4s',
                          borderRadius: '26px'
                        }}>
                          <span style={{
                            position: 'absolute',
                            content: '',
                            height: '20px',
                            width: '20px',
                            left: '3px',
                            bottom: '3px',
                            backgroundColor: 'white',
                            transition: '.4s',
                            borderRadius: '50%',
                            transform: preferences.notifications.push ? 'translateX(24px)' : 'translateX(0)'
                          }}></span>
                        </span>
                      </label>
                    </div>
                    <p style={{
                      color: '#6b7280',
                      fontSize: '0.9rem',
                      margin: 0
                    }}>
                      Receive push notifications in your browser
                    </p>
                  </div>

                  {/* Weekly Report */}
                  <div style={{
                    padding: '1.5rem',
                    background: 'rgba(255, 255, 255, 0.5)',
                    border: '2px solid rgba(5, 150, 105, 0.6)',
                    borderRadius: '0.75rem'
                  }}>
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      marginBottom: '1rem'
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <Calendar size={20} style={{ color: '#059669' }} />
                        <h3 style={{
                          fontSize: '1.1rem',
                          fontWeight: 'bold',
                          color: '#111827',
                          margin: 0
                        }}>
                          Weekly Report
                        </h3>
                      </div>
                      <label style={{
                        position: 'relative',
                        display: 'inline-block',
                        width: '50px',
                        height: '26px'
                      }}>
                        <input
                          type="checkbox"
                          checked={preferences.notifications.weekly_report}
                          onChange={(e) => handleNotificationChange('weekly_report', e.target.checked)}
                          style={{ opacity: 0, width: 0, height: 0 }}
                        />
                        <span style={{
                          position: 'absolute',
                          cursor: 'pointer',
                          top: 0,
                          left: 0,
                          right: 0,
                          bottom: 0,
                          backgroundColor: preferences.notifications.weekly_report ? '#059669' : '#ccc',
                          transition: '.4s',
                          borderRadius: '26px'
                        }}>
                          <span style={{
                            position: 'absolute',
                            content: '',
                            height: '20px',
                            width: '20px',
                            left: '3px',
                            bottom: '3px',
                            backgroundColor: 'white',
                            transition: '.4s',
                            borderRadius: '50%',
                            transform: preferences.notifications.weekly_report ? 'translateX(24px)' : 'translateX(0)'
                          }}></span>
                        </span>
                      </label>
                    </div>
                    <p style={{
                      color: '#6b7280',
                      fontSize: '0.9rem',
                      margin: 0
                    }}>
                      Get a weekly summary of your carbon footprint activities
                    </p>
                  </div>

                  {/* Goal Reminders */}
                  <div style={{
                    padding: '1.5rem',
                    background: 'rgba(255, 255, 255, 0.5)',
                    border: '2px solid rgba(5, 150, 105, 0.6)',
                    borderRadius: '0.75rem'
                  }}>
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      marginBottom: '1rem'
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <Check size={20} style={{ color: '#059669' }} />
                        <h3 style={{
                          fontSize: '1.1rem',
                          fontWeight: 'bold',
                          color: '#111827',
                          margin: 0
                        }}>
                          Goal Reminders
                        </h3>
                      </div>
                      <label style={{
                        position: 'relative',
                        display: 'inline-block',
                        width: '50px',
                        height: '26px'
                      }}>
                        <input
                          type="checkbox"
                          checked={preferences.notifications.goal_reminders}
                          onChange={(e) => handleNotificationChange('goal_reminders', e.target.checked)}
                          style={{ opacity: 0, width: 0, height: 0 }}
                        />
                        <span style={{
                          position: 'absolute',
                          cursor: 'pointer',
                          top: 0,
                          left: 0,
                          right: 0,
                          bottom: 0,
                          backgroundColor: preferences.notifications.goal_reminders ? '#059669' : '#ccc',
                          transition: '.4s',
                          borderRadius: '26px'
                        }}>
                          <span style={{
                            position: 'absolute',
                            content: '',
                            height: '20px',
                            width: '20px',
                            left: '3px',
                            bottom: '3px',
                            backgroundColor: 'white',
                            transition: '.4s',
                            borderRadius: '50%',
                            transform: preferences.notifications.goal_reminders ? 'translateX(24px)' : 'translateX(0)'
                          }}></span>
                        </span>
                      </label>
                    </div>
                    <p style={{
                      color: '#6b7280',
                      fontSize: '0.9rem',
                      margin: 0
                    }}>
                      Receive reminders to help you stay on track with your goals
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Privacy Tab */}
            {activeTab === 'privacy' && (
              <div>
                <h2 style={{
                  fontSize: '1.8rem',
                  fontWeight: 'bold',
                  color: '#111827',
                  marginBottom: '1.5rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem'
                }}>
                  <Shield size={24} />
                  Privacy Settings
                </h2>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                  {/* Profile Visibility */}
                  <div style={{
                    padding: '1.5rem',
                    background: 'rgba(255, 255, 255, 0.5)',
                    border: '2px solid rgba(5, 150, 105, 0.6)',
                    borderRadius: '0.75rem'
                  }}>
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      marginBottom: '1rem'
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <Eye size={20} style={{ color: '#059669' }} />
                        <h3 style={{
                          fontSize: '1.1rem',
                          fontWeight: 'bold',
                          color: '#111827',
                          margin: 0
                        }}>
                          Profile Visibility
                        </h3>
                      </div>
                      <label style={{
                        position: 'relative',
                        display: 'inline-block',
                        width: '50px',
                        height: '26px'
                      }}>
                        <input
                          type="checkbox"
                          checked={preferences.privacy.profile_public}
                          onChange={(e) => handlePrivacyChange('profile_public', e.target.checked)}
                          style={{ opacity: 0, width: 0, height: 0 }}
                        />
                        <span style={{
                          position: 'absolute',
                          cursor: 'pointer',
                          top: 0,
                          left: 0,
                          right: 0,
                          bottom: 0,
                          backgroundColor: preferences.privacy.profile_public ? '#059669' : '#ccc',
                          transition: '.4s',
                          borderRadius: '26px'
                        }}>
                          <span style={{
                            position: 'absolute',
                            content: '',
                            height: '20px',
                            width: '20px',
                            left: '3px',
                            bottom: '3px',
                            backgroundColor: 'white',
                            transition: '.4s',
                            borderRadius: '50%',
                            transform: preferences.privacy.profile_public ? 'translateX(24px)' : 'translateX(0)'
                          }}></span>
                        </span>
                      </label>
                    </div>
                    <p style={{
                      color: '#6b7280',
                      fontSize: '0.9rem',
                      margin: 0
                    }}>
                      Make your profile visible to other users
                    </p>
                  </div>

                  {/* Show Emissions */}
                  <div style={{
                    padding: '1.5rem',
                    background: 'rgba(255, 255, 255, 0.5)',
                    border: '2px solid rgba(5, 150, 105, 0.6)',
                    borderRadius: '0.75rem'
                  }}>
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      marginBottom: '1rem'
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <Edit3 size={20} style={{ color: '#059669' }} />
                        <h3 style={{
                          fontSize: '1.1rem',
                          fontWeight: 'bold',
                          color: '#111827',
                          margin: 0
                        }}>
                          Show Emissions Data
                        </h3>
                      </div>
                      <label style={{
                        position: 'relative',
                        display: 'inline-block',
                        width: '50px',
                        height: '26px'
                      }}>
                        <input
                          type="checkbox"
                          checked={preferences.privacy.show_emissions}
                          onChange={(e) => handlePrivacyChange('show_emissions', e.target.checked)}
                          style={{ opacity: 0, width: 0, height: 0 }}
                        />
                        <span style={{
                          position: 'absolute',
                          cursor: 'pointer',
                          top: 0,
                          left: 0,
                          right: 0,
                          bottom: 0,
                          backgroundColor: preferences.privacy.show_emissions ? '#059669' : '#ccc',
                          transition: '.4s',
                          borderRadius: '26px'
                        }}>
                          <span style={{
                            position: 'absolute',
                            content: '',
                            height: '20px',
                            width: '20px',
                            left: '3px',
                            bottom: '3px',
                            backgroundColor: 'white',
                            transition: '.4s',
                            borderRadius: '50%',
                            transform: preferences.privacy.show_emissions ? 'translateX(24px)' : 'translateX(0)'
                          }}></span>
                        </span>
                      </label>
                    </div>
                    <p style={{
                      color: '#6b7280',
                      fontSize: '0.9rem',
                      margin: 0
                    }}>
                      Display your carbon emission data on your public profile
                    </p>
                  </div>

                  {/* Show Achievements */}
                  <div style={{
                    padding: '1.5rem',
                    background: 'rgba(255, 255, 255, 0.5)',
                    border: '2px solid rgba(5, 150, 105, 0.6)',
                    borderRadius: '0.75rem'
                  }}>
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      marginBottom: '1rem'
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <Check size={20} style={{ color: '#059669' }} />
                        <h3 style={{
                          fontSize: '1.1rem',
                          fontWeight: 'bold',
                          color: '#111827',
                          margin: 0
                        }}>
                          Show Achievements
                        </h3>
                      </div>
                      <label style={{
                        position: 'relative',
                        display: 'inline-block',
                        width: '50px',
                        height: '26px'
                      }}>
                        <input
                          type="checkbox"
                          checked={preferences.privacy.show_achievements}
                          onChange={(e) => handlePrivacyChange('show_achievements', e.target.checked)}
                          style={{ opacity: 0, width: 0, height: 0 }}
                        />
                        <span style={{
                          position: 'absolute',
                          cursor: 'pointer',
                          top: 0,
                          left: 0,
                          right: 0,
                          bottom: 0,
                          backgroundColor: preferences.privacy.show_achievements ? '#059669' : '#ccc',
                          transition: '.4s',
                          borderRadius: '26px'
                        }}>
                          <span style={{
                            position: 'absolute',
                            content: '',
                            height: '20px',
                            width: '20px',
                            left: '3px',
                            bottom: '3px',
                            backgroundColor: 'white',
                            transition: '.4s',
                            borderRadius: '50%',
                            transform: preferences.privacy.show_achievements ? 'translateX(24px)' : 'translateX(0)'
                          }}></span>
                        </span>
                      </label>
                    </div>
                    <p style={{
                      color: '#6b7280',
                      fontSize: '0.9rem',
                      margin: 0
                    }}>
                      Display your achievements and badges on your public profile
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Delete Confirmation Modal */}
        {showDeleteConfirm && (
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
                  color: '#dc2626',
                  margin: 0,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}>
                  <Trash2 size={24} />
                  Delete Account
                </h2>
                <button
                  onClick={() => setShowDeleteConfirm(false)}
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

              <div style={{ marginBottom: '1.5rem' }}>
                <p style={{
                  color: '#7f1d1d',
                  fontSize: '1rem',
                  lineHeight: 1.6,
                  marginBottom: '1rem'
                }}>
                  <strong>Warning:</strong> This action cannot be undone. This will permanently delete your account and remove all your data from our servers.
                </p>
                <p style={{
                  color: '#7f1d1d',
                  fontSize: '0.9rem',
                  margin: 0
                }}>
                  All your activity logs, settings, and profile information will be permanently removed.
                </p>
              </div>

              <div style={{
                display: 'flex',
                gap: '1rem',
                justifyContent: 'flex-end'
              }}>
                <button
                  onClick={() => setShowDeleteConfirm(false)}
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
                  onClick={handleDeleteAccount}
                  style={{
                    background: '#dc2626',
                    color: 'white',
                    border: 'none',
                    borderRadius: '0.5rem',
                    padding: '0.75rem 1.5rem',
                    fontSize: '0.9rem',
                    fontWeight: 'bold',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem'
                  }}
                >
                  <Trash2 size={16} />
                  Delete Account
                </button>
              </div>
            </div>
          </div>
        )}

        {/* CSS for animations */}
        <style>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    </div>
  );
};

export default Profile;
