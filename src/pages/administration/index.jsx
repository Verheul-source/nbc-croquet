// src/pages/administration/index.jsx - Corrected Dashboard with Clubs Support
import React, { useState, useEffect } from "react";
import { useRouter } from 'next/router';

export default function Administration() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    laws: 0,
    members: 0,
    clubs: 0,
    tournaments: 0
  });

  useEffect(() => {
    checkAuth();
  }, []);

  useEffect(() => {
    if (user?.role === 'admin') {
      loadStats();
    }
  }, [user]);

  const checkAuth = async () => {
    try {
      const response = await fetch('/api/auth/me');
      if (response.ok) {
        const data = await response.json();
        setUser(data.user);
      } else {
        setUser(null);
      }
    } catch (error) {
      console.error('Auth check failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadStats = async () => {
    try {
      // Load laws count
      const rulesResponse = await fetch('/api/rules');
      if (rulesResponse.ok) {
        const rulesData = await rulesResponse.json();
        setStats(prev => ({ ...prev, laws: rulesData.length }));
      }
      
      // Load members count
      const membersResponse = await fetch('/api/members');
      if (membersResponse.ok) {
        const membersData = await membersResponse.json();
        setStats(prev => ({ ...prev, members: membersData.length }));
      }
      
      // Load clubs count
      try {
        const clubsResponse = await fetch('/api/clubs');
        if (clubsResponse.ok) {
          const clubsData = await clubsResponse.json();
          setStats(prev => ({ ...prev, clubs: clubsData.length }));
        }
      } catch (error) {
        console.log('Clubs API not available yet, skipping...');
        setStats(prev => ({ ...prev, clubs: 0 }));
      }
      
      // TODO: Load tournaments count when API is ready
    } catch (error) {
      console.error('Error loading stats:', error);
    }
  };

  if (loading) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center' }}>
        <h2>Loading Administration Panel...</h2>
      </div>
    );
  }

  if (!user) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center' }}>
        <h2>🔐 Authentication Required</h2>
        <p>Please log in to access the administration panel.</p>
        <button 
          onClick={() => router.push('/login')}
          style={{ 
            padding: '0.75rem 1.5rem', 
            backgroundColor: '#059669', 
            color: 'white', 
            border: 'none', 
            borderRadius: '0.375rem',
            cursor: 'pointer'
          }}
        >
          Go to Login Page
        </button>
      </div>
    );
  }

  if (user.role !== 'admin') {
    return (
      <div style={{ padding: '2rem', textAlign: 'center' }}>
        <h2>⚠️ Administrator Access Required</h2>
        <p>Current role: {user.role}</p>
      </div>
    );
  }

  return (
    <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
      <header style={{ marginBottom: '3rem', textAlign: 'center' }}>
        <h1 style={{ fontSize: '2.5rem', color: '#065f46', marginBottom: '0.5rem' }}>
          🏏 Administration Dashboard
        </h1>
        <p style={{ color: '#6b7280', fontSize: '1.125rem' }}>
          Nederlandse Bond der Croquet
        </p>
        <p style={{ color: '#9ca3af', fontSize: '0.875rem' }}>
          Welcome, {user.email} | Role: {user.role}
        </p>
      </header>

      {/* Management Cards */}
      <div style={{ 
        display: 'grid', 
        gap: '2rem', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
        marginBottom: '3rem'
      }}>
        
        {/* Laws Management Card */}
        <div style={{ 
          padding: '2rem', 
          backgroundColor: 'white', 
          borderRadius: '0.75rem',
          border: '1px solid #e5e7eb',
          boxShadow: '0 4px 6px rgba(0,0,0,0.05)',
          transition: 'transform 0.2s, box-shadow 0.2s'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1rem' }}>
            <div style={{ 
              width: '3rem', 
              height: '3rem', 
              backgroundColor: '#dcfce7', 
              borderRadius: '0.5rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginRight: '1rem'
            }}>
              <span style={{ fontSize: '1.5rem' }}>📖</span>
            </div>
            <div>
              <h3 style={{ color: '#065f46', fontSize: '1.25rem', margin: 0 }}>Laws Management</h3>
              <p style={{ color: '#6b7280', fontSize: '0.875rem', margin: 0 }}>
                {stats.laws} laws configured
              </p>
            </div>
          </div>
          <p style={{ color: '#6b7280', marginBottom: '1.5rem', lineHeight: '1.5' }}>
            Manage croquet laws, add new sections and subsections, organize law content with proper hierarchy.
          </p>
          <button 
            onClick={() => router.push('/administration/laws')}
            style={{ 
              width: '100%',
              padding: '0.75rem 1rem', 
              backgroundColor: '#059669', 
              color: 'white', 
              border: 'none', 
              borderRadius: '0.375rem',
              cursor: 'pointer',
              fontSize: '1rem',
              fontWeight: '500'
            }}
          >
            Manage Laws
          </button>
        </div>

        {/* Members Management Card */}
        <div style={{ 
          padding: '2rem', 
          backgroundColor: 'white', 
          borderRadius: '0.75rem',
          border: '1px solid #e5e7eb',
          boxShadow: '0 4px 6px rgba(0,0,0,0.05)',
          transition: 'transform 0.2s, box-shadow 0.2s'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1rem' }}>
            <div style={{ 
              width: '3rem', 
              height: '3rem', 
              backgroundColor: '#dbeafe', 
              borderRadius: '0.5rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginRight: '1rem'
            }}>
              <span style={{ fontSize: '1.5rem' }}>👥</span>
            </div>
            <div>
              <h3 style={{ color: '#065f46', fontSize: '1.25rem', margin: 0 }}>Members</h3>
              <p style={{ color: '#6b7280', fontSize: '0.875rem', margin: 0 }}>
                {stats.members} members registered
              </p>
            </div>
          </div>
          <p style={{ color: '#6b7280', marginBottom: '1.5rem', lineHeight: '1.5' }}>
            Manage club members and membership data. Handle registrations, updates, and member information.
          </p>
          <button 
            onClick={() => router.push('/administration/members')}
            style={{ 
              width: '100%',
              padding: '0.75rem 1rem', 
              backgroundColor: '#0ea5e9', 
              color: 'white', 
              border: 'none', 
              borderRadius: '0.375rem',
              cursor: 'pointer',
              fontSize: '1rem',
              fontWeight: '500'
            }}
          >
            Manage Members
          </button>
        </div>

        {/* Clubs Management Card */}
        <div style={{ 
          padding: '2rem', 
          backgroundColor: 'white', 
          borderRadius: '0.75rem',
          border: '1px solid #e5e7eb',
          boxShadow: '0 4px 6px rgba(0,0,0,0.05)',
          transition: 'transform 0.2s, box-shadow 0.2s'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1rem' }}>
            <div style={{ 
              width: '3rem', 
              height: '3rem', 
              backgroundColor: '#f0f9ff', 
              borderRadius: '0.5rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginRight: '1rem'
            }}>
              <span style={{ fontSize: '1.5rem' }}>🏛️</span>
            </div>
            <div>
              <h3 style={{ color: '#065f46', fontSize: '1.25rem', margin: 0 }}>Clubs</h3>
              <p style={{ color: '#6b7280', fontSize: '0.875rem', margin: 0 }}>
                {stats.clubs} clubs registered
              </p>
            </div>
          </div>
          <p style={{ color: '#6b7280', marginBottom: '1.5rem', lineHeight: '1.5' }}>
            Manage croquet clubs, their locations, and organizational information.
          </p>
          <button 
            onClick={() => router.push('/administration/clubs')}
            style={{ 
              width: '100%',
              padding: '0.75rem 1rem', 
              backgroundColor: '#0284c7', 
              color: 'white', 
              border: 'none', 
              borderRadius: '0.375rem',
              cursor: 'pointer',
              fontSize: '1rem',
              fontWeight: '500'
            }}
          >
            Manage Clubs
          </button>
        </div>

        {/* Tournaments Management Card */}
        <div style={{ 
          padding: '2rem', 
          backgroundColor: 'white', 
          borderRadius: '0.75rem',
          border: '1px solid #e5e7eb',
          boxShadow: '0 4px 6px rgba(0,0,0,0.05)',
          opacity: 0.7
        }}>
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1rem' }}>
            <div style={{ 
              width: '3rem', 
              height: '3rem', 
              backgroundColor: '#fef3c7', 
              borderRadius: '0.5rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginRight: '1rem'
            }}>
              <span style={{ fontSize: '1.5rem' }}>🏆</span>
            </div>
            <div>
              <h3 style={{ color: '#065f46', fontSize: '1.25rem', margin: 0 }}>Tournaments</h3>
              <p style={{ color: '#6b7280', fontSize: '0.875rem', margin: 0 }}>
                {stats.tournaments} tournaments scheduled
              </p>
            </div>
          </div>
          <p style={{ color: '#6b7280', marginBottom: '1.5rem', lineHeight: '1.5' }}>
            Organize tournaments and manage registrations. Schedule events and track tournament results.
          </p>
          <button 
            disabled
            style={{ 
              width: '100%',
              padding: '0.75rem 1rem', 
              backgroundColor: '#9ca3af', 
              color: 'white', 
              border: 'none', 
              borderRadius: '0.375rem',
              cursor: 'not-allowed',
              fontSize: '1rem'
            }}
          >
            Coming Soon
          </button>
        </div>

        {/* Settings Card */}
        <div style={{ 
          padding: '2rem', 
          backgroundColor: 'white', 
          borderRadius: '0.75rem',
          border: '1px solid #e5e7eb',
          boxShadow: '0 4px 6px rgba(0,0,0,0.05)',
          opacity: 0.7
        }}>
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1rem' }}>
            <div style={{ 
              width: '3rem', 
              height: '3rem', 
              backgroundColor: '#f3e8ff', 
              borderRadius: '0.5rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginRight: '1rem'
            }}>
              <span style={{ fontSize: '1.5rem' }}>⚙️</span>
            </div>
            <div>
              <h3 style={{ color: '#065f46', fontSize: '1.25rem', margin: 0 }}>Settings</h3>
              <p style={{ color: '#6b7280', fontSize: '0.875rem', margin: 0 }}>
                System configuration
              </p>
            </div>
          </div>
          <p style={{ color: '#6b7280', marginBottom: '1.5rem', lineHeight: '1.5' }}>
            Configure application settings, manage system preferences, and handle administrative options.
          </p>
          <button 
            disabled
            style={{ 
              width: '100%',
              padding: '0.75rem 1rem', 
              backgroundColor: '#9ca3af', 
              color: 'white', 
              border: 'none', 
              borderRadius: '0.375rem',
              cursor: 'not-allowed',
              fontSize: '1rem'
            }}
          >
            Coming Soon
          </button>
        </div>

      </div>

      {/* Quick Stats */}
      <div style={{ 
        backgroundColor: '#f9fafb', 
        padding: '1.5rem', 
        borderRadius: '0.5rem',
        border: '1px solid #e5e7eb'
      }}>
        <h3 style={{ color: '#065f46', marginBottom: '1rem' }}>System Overview</h3>
        <div style={{ 
          display: 'grid', 
          gap: '1rem', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))' 
        }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#059669' }}>{stats.laws}</div>
            <div style={{ color: '#6b7280', fontSize: '0.875rem' }}>Laws Configured</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#0ea5e9' }}>{stats.members}</div>
            <div style={{ color: '#6b7280', fontSize: '0.875rem' }}>Total Members</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#0284c7' }}>{stats.clubs}</div>
            <div style={{ color: '#6b7280', fontSize: '0.875rem' }}>Total Clubs</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#f59e0b' }}>{stats.tournaments}</div>
            <div style={{ color: '#6b7280', fontSize: '0.875rem' }}>Active Tournaments</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#8b5cf6' }}>1</div>
            <div style={{ color: '#6b7280', fontSize: '0.875rem' }}>Admin Users</div>
          </div>
        </div>
      </div>
    </div>
  );
}