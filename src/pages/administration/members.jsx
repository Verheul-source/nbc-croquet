// src/pages/administration/members.jsx - Members Management Page
import React, { useState, useEffect } from "react";
import { useRouter } from 'next/router';

export default function MembersManagement() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [members, setMembers] = useState([]);
  const [clubs, setClubs] = useState([]);
  const [showMemberForm, setShowMemberForm] = useState(false);
  const [editingMember, setEditingMember] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterClub, setFilterClub] = useState("");
  const [filterMembershipType, setFilterMembershipType] = useState("");

  useEffect(() => {
    checkAuth();
  }, []);

  useEffect(() => {
    if (user?.role === 'admin') {
      loadData();
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

  const loadData = async () => {
    try {
      const [membersResponse, clubsResponse] = await Promise.all([
        fetch('/api/members'),
        fetch('/api/clubs')
      ]);

      if (membersResponse.ok) {
        const membersData = await membersResponse.json();
        setMembers(membersData);
      }

      if (clubsResponse.ok) {
        const clubsData = await clubsResponse.json();
        setClubs(clubsData);
      }
    } catch (error) {
      console.error('Error loading data:', error);
    }
  };

  const handleDeleteMember = async (memberId) => {
    if (!confirm('Are you sure you want to delete this member?')) return;
    
    try {
      const response = await fetch(`/api/members/${memberId}`, {
        method: 'DELETE'
      });
      
      if (response.ok) {
        await loadData();
        alert('Member deleted successfully!');
      } else {
        alert('Failed to delete member');
      }
    } catch (error) {
      console.error('Error deleting member:', error);
      alert('Error deleting member');
    }
  };

  const MemberForm = ({ member, onSave, onCancel }) => {
    const [formData, setFormData] = useState({
      full_name: member?.full_name || "",
      club_id: member?.club_id || "",
      membership_number: member?.membership_number || "",
      phone: member?.phone || "",
      address: member?.address || "",
      date_joined: member?.date_joined ? member.date_joined.split('T')[0] : new Date().toISOString().split('T')[0],
      membership_type: member?.membership_type || "full",
      handicap: member?.handicap || 0
    });
    const [saving, setSaving] = useState(false);

    const handleSubmit = async (e) => {
      e.preventDefault();
      setSaving(true);

      try {
        const url = member ? `/api/members/${member.id}` : '/api/members';
        const method = member ? 'PUT' : 'POST';

        const response = await fetch(url, {
          method,
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData)
        });

        if (response.ok) {
          onSave();
          alert(member ? 'Member updated successfully!' : 'Member created successfully!');
        } else {
          const error = await response.json();
          alert('Failed to save member: ' + (error.error || 'Unknown error'));
        }
      } catch (error) {
        console.error('Error saving member:', error);
        alert('Error saving member');
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
          maxWidth: '800px',
          maxHeight: '90vh',
          overflow: 'auto'
        }}>
          <h2 style={{ marginBottom: '1.5rem', color: '#065f46' }}>
            {member ? 'Edit Member' : 'Add New Member'}
          </h2>
          
          <form onSubmit={handleSubmit}>
            <div style={{ display: 'grid', gap: '1rem', gridTemplateColumns: '1fr 1fr', marginBottom: '1rem' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
                  Full Name *
                </label>
                <input
                  type="text"
                  value={formData.full_name}
                  onChange={(e) => setFormData(prev => ({ ...prev, full_name: e.target.value }))}
                  placeholder="John Doe"
                  style={{ 
                    width: '100%', 
                    padding: '0.5rem', 
                    border: '1px solid #d1d5db', 
                    borderRadius: '0.375rem' 
                  }}
                  required
                />
              </div>
              
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
                  Membership Number *
                </label>
                <input
                  type="text"
                  value={formData.membership_number}
                  onChange={(e) => setFormData(prev => ({ ...prev, membership_number: e.target.value }))}
                  placeholder="NBC001"
                  style={{ 
                    width: '100%', 
                    padding: '0.5rem', 
                    border: '1px solid #d1d5db', 
                    borderRadius: '0.375rem' 
                  }}
                  required
                />
              </div>
            </div>

            <div style={{ display: 'grid', gap: '1rem', gridTemplateColumns: '1fr 1fr', marginBottom: '1rem' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
                  Club *
                </label>
                <select 
                  value={formData.club_id} 
                  onChange={(e) => setFormData(prev => ({ ...prev, club_id: e.target.value }))}
                  style={{ 
                    width: '100%', 
                    padding: '0.5rem', 
                    border: '1px solid #d1d5db', 
                    borderRadius: '0.375rem' 
                  }}
                  required
                >
                  <option value="">Select a club</option>
                  {clubs.map(club => (
                    <option key={club.id} value={club.id}>{club.name}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
                  Membership Type
                </label>
                <select 
                  value={formData.membership_type} 
                  onChange={(e) => setFormData(prev => ({ ...prev, membership_type: e.target.value }))}
                  style={{ 
                    width: '100%', 
                    padding: '0.5rem', 
                    border: '1px solid #d1d5db', 
                    borderRadius: '0.375rem' 
                  }}
                >
                  <option value="full">👤 Full Member</option>
                  <option value="senior">👴 Senior Member</option>
                  <option value="junior">👶 Junior Member</option>
                  <option value="honorary">👑 Honorary Member</option>
                </select>
              </div>
            </div>

            <div style={{ display: 'grid', gap: '1rem', gridTemplateColumns: '1fr 1fr', marginBottom: '1rem' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
                  Phone
                </label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                  placeholder="+31 6 12345678"
                  style={{ 
                    width: '100%', 
                    padding: '0.5rem', 
                    border: '1px solid #d1d5db', 
                    borderRadius: '0.375rem' 
                  }}
                />
              </div>
              
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
                  Date Joined
                </label>
                <input
                  type="date"
                  value={formData.date_joined}
                  onChange={(e) => setFormData(prev => ({ ...prev, date_joined: e.target.value }))}
                  style={{ 
                    width: '100%', 
                    padding: '0.5rem', 
                    border: '1px solid #d1d5db', 
                    borderRadius: '0.375rem' 
                  }}
                />
              </div>
            </div>

            <div style={{ display: 'grid', gap: '1rem', gridTemplateColumns: '2fr 1fr', marginBottom: '1rem' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
                  Address
                </label>
                <input
                  type="text"
                  value={formData.address}
                  onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
                  placeholder="Street, City, Netherlands"
                  style={{ 
                    width: '100%', 
                    padding: '0.5rem', 
                    border: '1px solid #d1d5db', 
                    borderRadius: '0.375rem' 
                  }}
                />
              </div>
              
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
                  Handicap
                </label>
                <input
                  type="number"
                  min="0"
                  max="22"
                  value={formData.handicap}
                  onChange={(e) => setFormData(prev => ({ ...prev, handicap: parseInt(e.target.value) || 0 }))}
                  style={{ 
                    width: '100%', 
                    padding: '0.5rem', 
                    border: '1px solid #d1d5db', 
                    borderRadius: '0.375rem' 
                  }}
                />
              </div>
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
                {saving ? 'Saving...' : (member ? 'Update Member' : 'Create Member')}
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  // Filter members based on search and filters
  const filteredMembers = members.filter(member => {
    const matchesSearch = !searchTerm || 
      member.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.membership_number?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.club_name?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesClub = !filterClub || member.club_id === filterClub;
    const matchesMembershipType = !filterMembershipType || member.membership_type === filterMembershipType;
    
    return matchesSearch && matchesClub && matchesMembershipType;
  });

  const membershipTypeColors = {
    full: "bg-emerald-100 text-emerald-800",
    senior: "bg-blue-100 text-blue-800",
    junior: "bg-orange-100 text-orange-800",
    honorary: "bg-purple-100 text-purple-800"
  };

  const membershipTypeIcons = {
    full: "👤",
    senior: "👴",
    junior: "👶",
    honorary: "👑"
  };

  if (loading) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center' }}>
        <h2>Loading Members Management...</h2>
      </div>
    );
  }

  if (!user || user.role !== 'admin') {
    return null; // Will redirect via useEffect
  }

  return (
    <div style={{ padding: '2rem', maxWidth: '1400px', margin: '0 auto' }}>
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
            <h1 style={{ fontSize: '2rem', color: '#065f46', margin: 0 }}>👥 Members Management</h1>
            <p style={{ color: '#6b7280', margin: '0.5rem 0 0 0' }}>
              Manage club members and membership information
            </p>
          </div>
          <button
            onClick={() => {
              setEditingMember(null);
              setShowMemberForm(true);
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
            ➕ Add New Member
          </button>
        </div>
      </div>

      {/* Search and Filters */}
      <div style={{ 
        backgroundColor: 'white', 
        padding: '1.5rem', 
        borderRadius: '0.5rem', 
        border: '1px solid #e5e7eb',
        marginBottom: '2rem'
      }}>
        <div style={{ display: 'grid', gap: '1rem', gridTemplateColumns: '2fr 1fr 1fr', alignItems: 'end' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
              Search Members
            </label>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by name, membership number, or club..."
              style={{ 
                width: '100%', 
                padding: '0.5rem', 
                border: '1px solid #d1d5db', 
                borderRadius: '0.375rem' 
              }}
            />
          </div>
          
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
              Filter by Club
            </label>
            <select 
              value={filterClub} 
              onChange={(e) => setFilterClub(e.target.value)}
              style={{ 
                width: '100%', 
                padding: '0.5rem', 
                border: '1px solid #d1d5db', 
                borderRadius: '0.375rem' 
              }}
            >
              <option value="">All Clubs</option>
              {clubs.map(club => (
                <option key={club.id} value={club.id}>{club.name}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
              Filter by Type
            </label>
            <select 
              value={filterMembershipType} 
              onChange={(e) => setFilterMembershipType(e.target.value)}
              style={{ 
                width: '100%', 
                padding: '0.5rem', 
                border: '1px solid #d1d5db', 
                borderRadius: '0.375rem' 
              }}
            >
              <option value="">All Types</option>
              <option value="full">👤 Full Members</option>
              <option value="senior">👴 Senior Members</option>
              <option value="junior">👶 Junior Members</option>
              <option value="honorary">👑 Honorary Members</option>
            </select>
          </div>
        </div>
        
        <div style={{ marginTop: '1rem', color: '#6b7280', fontSize: '0.875rem' }}>
          Showing {filteredMembers.length} of {members.length} members
        </div>
      </div>

      {/* Members List */}
      {filteredMembers.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '4rem', backgroundColor: '#f9fafb', borderRadius: '0.75rem' }}>
          <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>👥</div>
          <h3 style={{ color: '#065f46', marginBottom: '1rem' }}>
            {members.length === 0 ? 'No Members Added Yet' : 'No Members Match Filters'}
          </h3>
          <p style={{ color: '#6b7280', marginBottom: '2rem' }}>
            {members.length === 0 
              ? 'Start building your member database by adding the first member.'
              : 'Try adjusting your search criteria or filters.'
            }
          </p>
          {members.length === 0 && (
            <button
              onClick={() => {
                setEditingMember(null);
                setShowMemberForm(true);
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
              ➕ Add First Member
            </button>
          )}
        </div>
      ) : (
        <div style={{ display: 'grid', gap: '1rem' }}>
          {filteredMembers.map((member) => (
            <div key={member.id} style={{
              padding: '1.5rem',
              backgroundColor: 'white',
              borderRadius: '0.5rem',
              border: '1px solid #e5e7eb',
              borderLeft: '4px solid #059669'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                <div style={{ flex: 1 }}>
                  <div style={{ marginBottom: '0.75rem' }}>
                    <span style={{ 
                      backgroundColor: '#f3f4f6', 
                      padding: '0.25rem 0.5rem', 
                      borderRadius: '0.25rem', 
                      fontSize: '0.75rem',
                      marginRight: '0.5rem'
                    }}>
                      {member.membership_number}
                    </span>
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${membershipTypeColors[member.membership_type]}`}>
                      {membershipTypeIcons[member.membership_type]} {member.membership_type}
                    </span>
                  </div>
                  <h3 style={{ color: '#065f46', fontSize: '1.25rem', marginBottom: '0.25rem' }}>
                    {member.full_name}
                  </h3>
                  <p style={{ color: '#6b7280', fontWeight: '500', marginBottom: '0.5rem' }}>
                    {member.club_name || 'No Club'}
                  </p>
                  <div style={{ display: 'grid', gap: '0.25rem', fontSize: '0.875rem', color: '#9ca3af' }}>
                    {member.phone && <div>📞 {member.phone}</div>}
                    {member.address && <div>📍 {member.address}</div>}
                    <div>📅 Joined: {new Date(member.date_joined || member.created_date).toLocaleDateString()}</div>
                    {member.handicap > 0 && <div>🏆 Handicap: {member.handicap}</div>}
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '0.5rem', marginLeft: '1rem' }}>
                  <button
                    onClick={() => {
                      setEditingMember(member);
                      setShowMemberForm(true);
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
                    onClick={() => handleDeleteMember(member.id)}
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
            </div>
          ))}
        </div>
      )}

      {/* Member Form Modal */}
      {showMemberForm && (
        <MemberForm
          member={editingMember}
          onSave={async () => {
            setShowMemberForm(false);
            setEditingMember(null);
            await loadData();
          }}
          onCancel={() => {
            setShowMemberForm(false);
            setEditingMember(null);
          }}
        />
      )}
    </div>
  );
}