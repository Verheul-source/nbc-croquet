// src/pages/administration/clubs.jsx - Clubs Management Page
import React, { useState, useEffect } from "react";
import { useRouter } from 'next/router';

export default function ClubsManagement() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [clubs, setClubs] = useState([]);
  const [showClubForm, setShowClubForm] = useState(false);
  const [editingClub, setEditingClub] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    checkAuth();
  }, []);

  useEffect(() => {
    if (user?.role === 'admin') {
      loadClubs();
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
        router.push('/administration');
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      router.push('/administration');
    } finally {
      setLoading(false);
    }
  };

  const loadClubs = async () => {
    try {
      const response = await fetch('/api/clubs');
      if (response.ok) {
        const data = await response.json();
        setClubs(data);
      }
    } catch (error) {
      console.error('Error loading clubs:', error);
    }
  };

  const handleDeleteClub = async (clubId) => {
    // Check if club has members first
    const club = clubs.find(c => c.id === clubId);
    if (club._count?.members > 0) {
      alert(`Cannot delete ${club.name} because it has ${club._count.members} member(s). Please reassign or remove members first.`);
      return;
    }

    if (!confirm('Are you sure you want to delete this club?')) return;
    
    try {
      const response = await fetch(`/api/clubs/${clubId}`, {
        method: 'DELETE'
      });
      
      if (response.ok) {
        await loadClubs();
        alert('Club deleted successfully!');
      } else {
        alert('Failed to delete club');
      }
    } catch (error) {
      console.error('Error deleting club:', error);
      alert('Error deleting club');
    }
  };

  const ClubForm = ({ club, onSave, onCancel }) => {
    const [formData, setFormData] = useState({
      name: club?.name || "",
      location: club?.location || "",
    });
    const [saving, setSaving] = useState(false);

    const handleSubmit = async (e) => {
      e.preventDefault();
      setSaving(true);

      try {
        const url = club ? `/api/clubs/${club.id}` : '/api/clubs';
        const method = club ? 'PUT' : 'POST';

        const response = await fetch(url, {
          method,
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData)
        });

        if (response.ok) {
          onSave();
          alert(club ? 'Club updated successfully!' : 'Club created successfully!');
        } else {
          const error = await response.json();
          alert('Failed to save club: ' + (error.error || 'Unknown error'));
        }
      } catch (error) {
        console.error('Error saving club:', error);
        alert('Error saving club');
      } finally {
        setSaving(false);
      }
    };

    return (
      <div style={{ 
        position: 'fixed', 
        top: 0, 
        left: 0, 
        right: 0, 
        bottom: 0, 
        backgroundColor: 'rgba(0,0,0,0.5)', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        zIndex: 1000
      }}>
        <div style={{ 
          backgroundColor: 'white', 
          padding: '2rem', 
          borderRadius: '0.75rem', 
          width: '90%', 
          maxWidth: '600px',
          maxHeight: '90vh',
          overflow: 'auto'
        }}>
          <h2 style={{ marginBottom: '1.5rem', color: '#065f46' }}>
            {club ? 'Edit Club' : 'Add New Club'}
          </h2>
          
          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
                Club Name *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="e.g., Amsterdam Croquet Club"
                style={{ 
                  width: '100%', 
                  padding: '0.75rem', 
                  border: '1px solid #d1d5db', 
                  borderRadius: '0.375rem',
                  fontSize: '1rem'
                }}
                required
              />
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
                Location
              </label>
              <input
                type="text"
                value={formData.location}
                onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                placeholder="e.g., Amsterdam, Netherlands"
                style={{ 
                  width: '100%', 
                  padding: '0.75rem', 
                  border: '1px solid #d1d5db', 
                  borderRadius: '0.375rem',
                  fontSize: '1rem'
                }}
              />
              <small style={{ color: '#6b7280', fontSize: '0.875rem' }}>
                City and country where the club is located
              </small>
            </div>

            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
              <button 
                type="button" 
                onClick={onCancel}
                disabled={saving}
                style={{ 
                  padding: '0.75rem 1.5rem', 
                  backgroundColor: '#6b7280', 
                  color: 'white', 
                  border: 'none', 
                  borderRadius: '0.375rem',
                  cursor: 'pointer'
                }}
              >
                Cancel
              </button>
              <button 
                type="submit"
                disabled={saving}
                style={{ 
                  padding: '0.75rem 1.5rem', 
                  backgroundColor: '#059669', 
                  color: 'white', 
                  border: 'none', 
                  borderRadius: '0.375rem',
                  cursor: 'pointer'
                }}
              >
                {saving ? 'Saving...' : (club ? 'Update Club' : 'Create Club')}
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  // Filter clubs based on search
  const filteredClubs = clubs.filter(club => {
    return !searchTerm || 
      club.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      club.location?.toLowerCase().includes(searchTerm.toLowerCase());
  });

  if (loading) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center' }}>
        <h2>Loading Clubs Management...</h2>
      </div>
    );
  }

  if (!user || user.role !== 'admin') {
    return null; // Will redirect via useEffect
  }

  return (
    <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
      {/* Header with breadcrumb */}
      <div style={{ marginBottom: '2rem' }}>
        <button
          onClick={() => router.push('/administration')}
          style={{
            padding: '0.5rem 1rem',
            backgroundColor: '#f3f4f6',
            border: '1px solid #d1d5db',
            borderRadius: '0.375rem',
            cursor: 'pointer',
            marginBottom: '1rem'
          }}
        >
          ← Back to Dashboard
        </button>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h1 style={{ fontSize: '2rem', color: '#065f46', margin: 0 }}>🏛️ Clubs Management</h1>
            <p style={{ color: '#6b7280', margin: '0.5rem 0 0 0' }}>
              Manage croquet clubs and their information
            </p>
          </div>
          <button
            onClick={() => {
              setEditingClub(null);
              setShowClubForm(true);
            }}
            style={{
              padding: '0.75rem 1.5rem',
              backgroundColor: '#059669',
              color: 'white',
              border: 'none',
              borderRadius: '0.375rem',
              cursor: 'pointer',
              fontSize: '1rem',
              fontWeight: '500'
            }}
          >
            ➕ Add New Club
          </button>
        </div>
      </div>

      {/* Search */}
      <div style={{ 
        backgroundColor: 'white', 
        padding: '1.5rem', 
        borderRadius: '0.5rem', 
        border: '1px solid #e5e7eb',
        marginBottom: '2rem'
      }}>
        <div style={{ maxWidth: '400px' }}>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
            Search Clubs
          </label>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by club name or location..."
            style={{ 
              width: '100%', 
              padding: '0.5rem', 
              border: '1px solid #d1d5db', 
              borderRadius: '0.375rem' 
            }}
          />
        </div>
        
        <div style={{ marginTop: '1rem', color: '#6b7280', fontSize: '0.875rem' }}>
          Showing {filteredClubs.length} of {clubs.length} clubs
        </div>
      </div>

      {/* Clubs List */}
      {filteredClubs.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '4rem', backgroundColor: '#f9fafb', borderRadius: '0.75rem' }}>
          <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🏛️</div>
          <h3 style={{ color: '#065f46', marginBottom: '1rem' }}>
            {clubs.length === 0 ? 'No Clubs Added Yet' : 'No Clubs Match Search'}
          </h3>
          <p style={{ color: '#6b7280', marginBottom: '2rem' }}>
            {clubs.length === 0 
              ? 'Start by adding your first croquet club to the system.'
              : 'Try adjusting your search criteria.'
            }
          </p>
          {clubs.length === 0 && (
            <button
              onClick={() => {
                setEditingClub(null);
                setShowClubForm(true);
              }}
              style={{
                padding: '0.75rem 1.5rem',
                backgroundColor: '#059669',
                color: 'white',
                border: 'none',
                borderRadius: '0.375rem',
                cursor: 'pointer'
              }}
            >
              ➕ Add First Club
            </button>
          )}
        </div>
      ) : (
        <div style={{ display: 'grid', gap: '1.5rem', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))' }}>
          {filteredClubs.map((club) => (
            <div key={club.id} style={{
              padding: '2rem',
              backgroundColor: 'white',
              borderRadius: '0.75rem',
              border: '1px solid #e5e7eb',
              borderLeft: '4px solid #059669',
              boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '1rem' }}>
                <div style={{ flex: 1 }}>
                  <h3 style={{ color: '#065f46', fontSize: '1.5rem', marginBottom: '0.5rem', margin: 0 }}>
                    {club.name}
                  </h3>
                  {club.location && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                      <span style={{ fontSize: '0.875rem' }}>📍</span>
                      <span style={{ color: '#6b7280', fontSize: '0.875rem' }}>{club.location}</span>
                    </div>
                  )}
                </div>
                <div style={{ display: 'flex', gap: '0.5rem', marginLeft: '1rem' }}>
                  <button
                    onClick={() => {
                      setEditingClub(club);
                      setShowClubForm(true);
                    }}
                    style={{
                      padding: '0.5rem',
                      backgroundColor: '#0ea5e9',
                      color: 'white',
                      border: 'none',
                      borderRadius: '0.25rem',
                      cursor: 'pointer'
                    }}
                  >
                    ✏️
                  </button>
                  <button
                    onClick={() => handleDeleteClub(club.id)}
                    style={{
                      padding: '0.5rem',
                      backgroundColor: '#dc2626',
                      color: 'white',
                      border: 'none',
                      borderRadius: '0.25rem',
                      cursor: 'pointer'
                    }}
                  >
                    🗑️
                  </button>
                </div>
              </div>

              {/* Club Statistics */}
              <div style={{ 
                backgroundColor: '#f9fafb', 
                padding: '1rem', 
                borderRadius: '0.5rem',
                marginBottom: '1rem'
              }}>
                <div style={{ display: 'grid', gap: '1rem', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))' }}>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#059669' }}>
                      {club._count?.members || 0}
                    </div>
                    <div style={{ color: '#6b7280', fontSize: '0.75rem' }}>Members</div>
                  </div>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#0ea5e9' }}>
                      {new Date(club.created_date).getFullYear()}
                    </div>
                    <div style={{ color: '#6b7280', fontSize: '0.75rem' }}>Established</div>
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button
                  onClick={() => router.push(`/administration/members?club=${club.id}`)}
                  style={{
                    flex: 1,
                    padding: '0.5rem 1rem',
                    backgroundColor: '#f3f4f6',
                    border: '1px solid #d1d5db',
                    borderRadius: '0.375rem',
                    cursor: 'pointer',
                    fontSize: '0.875rem'
                  }}
                >
                  👥 View Members
                </button>
                <button
                  disabled
                  style={{
                    flex: 1,
                    padding: '0.5rem 1rem',
                    backgroundColor: '#f9fafb',
                    border: '1px solid #e5e7eb',
                    borderRadius: '0.375rem',
                    cursor: 'not-allowed',
                    fontSize: '0.875rem',
                    color: '#9ca3af'
                  }}
                >
                  📧 Contact
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Club Form Modal */}
      {showClubForm && (
        <ClubForm
          club={editingClub}
          onSave={async () => {
            setShowClubForm(false);
            setEditingClub(null);
            await loadClubs();
          }}
          onCancel={() => {
            setShowClubForm(false);
            setEditingClub(null);
          }}
        />
      )}
    </div>
  );
}