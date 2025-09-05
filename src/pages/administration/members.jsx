// src/pages/administration/members.jsx - Enhanced Members Management Page
import React, { useState, useEffect } from "react";
import { useRouter } from 'next/router';

export default function MembersManagement() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [members, setMembers] = useState([]);
  const [clubs, setClubs] = useState([]);
  const [users, setUsers] = useState([]);
  const [showMemberForm, setShowMemberForm] = useState(false);
  const [editingMember, setEditingMember] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterClub, setFilterClub] = useState("");
  const [filterMembershipType, setFilterMembershipType] = useState("");
  const [filterMembershipStatus, setFilterMembershipStatus] = useState("");

  useEffect(() => {
    checkAuth();
  }, []);

  useEffect(() => {
    if (user?.role === 'admin') {
      loadData();
    }
  }, [user]);

// In your members management page, add this after your existing useEffect hooks:

useEffect(() => {
  // Check for club filter in URL parameters
  const urlParams = new URLSearchParams(window.location.search);
  const clubParam = urlParams.get('club');
  if (clubParam) {
    setFilterClub(clubParam);
  }
}, []);

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
      const [membersResponse, clubsResponse, usersResponse] = await Promise.all([
        fetch('/api/members'),
        fetch('/api/clubs'),
        fetch('/api/users') // New endpoint for users
      ]);

      if (membersResponse.ok) {
        const membersData = await membersResponse.json();
        setMembers(membersData);
      }

      if (clubsResponse.ok) {
        const clubsData = await clubsResponse.json();
        setClubs(clubsData);
      }

      if (usersResponse.ok) {
        const usersData = await usersResponse.json();
        setUsers(usersData);
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
      email: member?.email || "",
      birth_date: member?.birth_date ? member.birth_date.split('T')[0] : "",
      gender: member?.gender || "",
      club_id: member?.club_id || "",
      membership_number: member?.membership_number || "",
      phone: member?.phone || "",
      address: member?.address || "",
      date_joined: member?.date_joined ? member.date_joined.split('T')[0] : new Date().toISOString().split('T')[0],
      membership_type: member?.membership_type || "full",
      membership_status: member?.membership_status || "active",
      payment_status: member?.payment_status || "pending",
      handicap: member?.handicap || 0,
      board_position: member?.board_position || "",
      notes: member?.notes || "",
      user_id: member?.user_id || ""
    });
    const [saving, setSaving] = useState(false);

    const handleSubmit = async (e) => {
      e.preventDefault();
      setSaving(true);

      try {
        // Clean up empty fields
        const dataToSend = { ...formData };
        if (!dataToSend.email.trim()) dataToSend.email = null;
        if (!dataToSend.birth_date) dataToSend.birth_date = null;
        if (!dataToSend.gender) dataToSend.gender = null;
        if (!dataToSend.phone.trim()) dataToSend.phone = null;
        if (!dataToSend.address.trim()) dataToSend.address = null;
        if (!dataToSend.board_position) dataToSend.board_position = null;
        if (!dataToSend.notes.trim()) dataToSend.notes = null;
        if (!dataToSend.user_id) dataToSend.user_id = null;

        const url = member ? `/api/members/${member.id}` : '/api/members';
        const method = member ? 'PUT' : 'POST';

        const response = await fetch(url, {
          method,
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(dataToSend)
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
          width: '95%', 
          maxWidth: '1000px',
          maxHeight: '90vh',
          overflow: 'auto'
        }}>
          <h2 style={{ marginBottom: '1.5rem', color: '#065f46' }}>
            {member ? 'Edit Member' : 'Add New Member'}
          </h2>
          
          <form onSubmit={handleSubmit}>
            {/* Personal Information Section */}
            <div style={{ marginBottom: '2rem' }}>
              <h3 style={{ color: '#065f46', marginBottom: '1rem', borderBottom: '1px solid #e5e7eb', paddingBottom: '0.5rem' }}>
                Personal Information
              </h3>
              
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
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                    placeholder="john.doe@email.com"
                    style={{ 
                      width: '100%', 
                      padding: '0.5rem', 
                      border: '1px solid #d1d5db', 
                      borderRadius: '0.375rem' 
                    }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gap: '1rem', gridTemplateColumns: '1fr 1fr 1fr', marginBottom: '1rem' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
                    Birth Date
                  </label>
                  <input
                    type="date"
                    value={formData.birth_date}
                    onChange={(e) => setFormData(prev => ({ ...prev, birth_date: e.target.value }))}
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
                    Gender
                  </label>
                  <select 
                    value={formData.gender} 
                    onChange={(e) => setFormData(prev => ({ ...prev, gender: e.target.value }))}
                    style={{ 
                      width: '100%', 
                      padding: '0.5rem', 
                      border: '1px solid #d1d5db', 
                      borderRadius: '0.375rem' 
                    }}
                  >
                    <option value="">Select...</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                    <option value="prefer_not_to_say">Prefer not to say</option>
                  </select>
                </div>
                
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
              </div>

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
            </div>

            {/* Membership Information Section */}
            <div style={{ marginBottom: '2rem' }}>
              <h3 style={{ color: '#065f46', marginBottom: '1rem', borderBottom: '1px solid #e5e7eb', paddingBottom: '0.5rem' }}>
                Membership Information
              </h3>
              
              <div style={{ display: 'grid', gap: '1rem', gridTemplateColumns: '1fr 1fr 1fr', marginBottom: '1rem' }}>
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

              <div style={{ display: 'grid', gap: '1rem', gridTemplateColumns: '1fr 1fr 1fr 1fr', marginBottom: '1rem' }}>
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
                
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
                    Membership Status
                  </label>
                  <select 
                    value={formData.membership_status} 
                    onChange={(e) => setFormData(prev => ({ ...prev, membership_status: e.target.value }))}
                    style={{ 
                      width: '100%', 
                      padding: '0.5rem', 
                      border: '1px solid #d1d5db', 
                      borderRadius: '0.375rem' 
                    }}
                  >
                    <option value="active">🟢 Active</option>
                    <option value="inactive">🟡 Inactive</option>
                    <option value="suspended">🔴 Suspended</option>
                    <option value="expired">⏰ Expired</option>
                  </select>
                </div>
                
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
                    Payment Status
                  </label>
                  <select 
                    value={formData.payment_status} 
                    onChange={(e) => setFormData(prev => ({ ...prev, payment_status: e.target.value }))}
                    style={{ 
                      width: '100%', 
                      padding: '0.5rem', 
                      border: '1px solid #d1d5db', 
                      borderRadius: '0.375rem' 
                    }}
                  >
                    <option value="paid">💰 Paid</option>
                    <option value="pending">⏳ Pending</option>
                    <option value="overdue">🔴 Overdue</option>
                    <option value="exempt">✅ Exempt</option>
                  </select>
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
            </div>

            {/* Club & System Information Section */}
            <div style={{ marginBottom: '2rem' }}>
              <h3 style={{ color: '#065f46', marginBottom: '1rem', borderBottom: '1px solid #e5e7eb', paddingBottom: '0.5rem' }}>
                Club & System Information
              </h3>
              
              <div style={{ display: 'grid', gap: '1rem', gridTemplateColumns: '1fr 1fr', marginBottom: '1rem' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
                    Board Position
                  </label>
                  <select 
                    value={formData.board_position} 
                    onChange={(e) => setFormData(prev => ({ ...prev, board_position: e.target.value }))}
                    style={{ 
                      width: '100%', 
                      padding: '0.5rem', 
                      border: '1px solid #d1d5db', 
                      borderRadius: '0.375rem' 
                    }}
                  >
                    <option value="">No board position</option>
                    <option value="president">👑 President</option>
                    <option value="secretary">📝 Secretary</option>
                    <option value="treasurer">💰 Treasurer</option>
                    <option value="board_member">🎯 Board Member</option>
                  </select>
                </div>
                
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
                    Linked User Account
                  </label>
                  <select 
                    value={formData.user_id} 
                    onChange={(e) => setFormData(prev => ({ ...prev, user_id: e.target.value }))}
                    style={{ 
                      width: '100%', 
                      padding: '0.5rem', 
                      border: '1px solid #d1d5db', 
                      borderRadius: '0.375rem' 
                    }}
                  >
                    <option value="">No linked account</option>
                    {users.filter(u => u.email).map(user => (
                      <option key={user.id} value={user.id}>{user.email} ({user.role})</option>
                    ))}
                  </select>
                  <small style={{ color: '#6b7280', fontSize: '0.75rem' }}>
                    Link this member to a website user account
                  </small>
                </div>
              </div>
              
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
                  Notes & Comments
                </label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                  placeholder="Additional notes about this member..."
                  rows={3}
                  style={{ 
                    width: '100%', 
                    padding: '0.5rem', 
                    border: '1px solid #d1d5db', 
                    borderRadius: '0.375rem',
                    resize: 'vertical'
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
      member.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.membership_number?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.club_name?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesClub = !filterClub || member.club_id === filterClub;
    const matchesMembershipType = !filterMembershipType || member.membership_type === filterMembershipType;
    const matchesMembershipStatus = !filterMembershipStatus || member.membership_status === filterMembershipStatus;
    
    return matchesSearch && matchesClub && matchesMembershipType && matchesMembershipStatus;
  });

  const membershipTypeColors = {
    full: "bg-emerald-100 text-emerald-800",
    senior: "bg-blue-100 text-blue-800",
    junior: "bg-orange-100 text-orange-800",
    honorary: "bg-purple-100 text-purple-800"
  };

  const membershipStatusColors = {
    active: "bg-green-100 text-green-800",
    inactive: "bg-yellow-100 text-yellow-800",
    suspended: "bg-red-100 text-red-800",
    expired: "bg-gray-100 text-gray-800"
  };

  const paymentStatusColors = {
    paid: "bg-green-100 text-green-800",
    pending: "bg-yellow-100 text-yellow-800",
    overdue: "bg-red-100 text-red-800",
    exempt: "bg-blue-100 text-blue-800"
  };

  if (loading) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center' }}>
        <h2>Loading Members Management...</h2>
      </div>
    );
  }

  if (!user || user.role !== 'admin') {
    return null;
  }

  return (
    <div style={{ padding: '2rem', maxWidth: '1400px', margin: '0 auto' }}>
      {/* Header */}
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
              Comprehensive member database with full profile management
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

      {/* Enhanced Search and Filters */}
      <div style={{ 
        backgroundColor: 'white', 
        padding: '1.5rem', 
        borderRadius: '0.5rem', 
        border: '1px solid #e5e7eb',
        marginBottom: '2rem'
      }}>
        <div style={{ display: 'grid', gap: '1rem', gridTemplateColumns: '2fr 1fr 1fr 1fr', alignItems: 'end', marginBottom: '1rem' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
              Search Members
            </label>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by name, email, membership number, or club..."
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
          
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
              Filter by Status
            </label>
            <select 
              value={filterMembershipStatus} 
              onChange={(e) => setFilterMembershipStatus(e.target.value)}
              style={{ 
                width: '100%', 
                padding: '0.5rem', 
                border: '1px solid #d1d5db', 
                borderRadius: '0.375rem' 
              }}
            >
              <option value="">All Status</option>
              <option value="active">🟢 Active</option>
              <option value="inactive">🟡 Inactive</option>
              <option value="suspended">🔴 Suspended</option>
              <option value="expired">⏰ Expired</option>
            </select>
          </div>
        </div>
        
        <div style={{ marginTop: '1rem', color: '#6b7280', fontSize: '0.875rem' }}>
          Showing {filteredMembers.length} of {members.length} members
        </div>
      </div>

      {/* Enhanced Members List */}
      {filteredMembers.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '4rem', backgroundColor: '#f9fafb', borderRadius: '0.75rem' }}>
          <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>👥</div>
          <h3 style={{ color: '#065f46', marginBottom: '1rem' }}>
            {members.length === 0 ? 'No Members Added Yet' : 'No Members Match Filters'}
          </h3>
          <p style={{ color: '#6b7280', marginBottom: '2rem' }}>
            {members.length === 0 
              ? 'Start building your comprehensive member database.'
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
                  {/* Header with badges */}
                  <div style={{ marginBottom: '0.75rem', display: 'flex', flexWrap: 'wrap', gap: '0.5rem', alignItems: 'center' }}>
                    <span style={{ 
                      backgroundColor: '#f3f4f6', 
                      padding: '0.25rem 0.5rem', 
                      borderRadius: '0.25rem', 
                      fontSize: '0.75rem',
                      fontWeight: 'bold'
                    }}>
                      {member.membership_number}
                    </span>
                    <span style={{ 
                      backgroundColor: membershipTypeColors[member.membership_type]?.replace('bg-', '').replace('text-', '') || '#f3f4f6',
                      padding: '0.25rem 0.5rem', 
                      borderRadius: '0.25rem', 
                      fontSize: '0.75rem'
                    }}>
                      {member.membership_type}
                    </span>
                    <span style={{ 
                      backgroundColor: membershipStatusColors[member.membership_status]?.replace('bg-', '').replace('text-', '') || '#f3f4f6',
                      padding: '0.25rem 0.5rem', 
                      borderRadius: '0.25rem', 
                      fontSize: '0.75rem'
                    }}>
                      {member.membership_status}
                    </span>
                    {member.payment_status !== 'paid' && (
                      <span style={{ 
                        backgroundColor: paymentStatusColors[member.payment_status]?.replace('bg-', '').replace('text-', '') || '#f3f4f6',
                        padding: '0.25rem 0.5rem', 
                        borderRadius: '0.25rem', 
                        fontSize: '0.75rem'
                      }}>
                        💰 {member.payment_status}
                      </span>
                    )}
                    {member.board_position && (
                      <span style={{ 
                        backgroundColor: '#dbeafe', 
                        color: '#1e40af',
                        padding: '0.25rem 0.5rem', 
                        borderRadius: '0.25rem', 
                        fontSize: '0.75rem'
                      }}>
                        👑 {member.board_position.replace('_', ' ')}
                      </span>
                    )}
                  </div>
                  
                  {/* Member name and club */}
                  <h3 style={{ color: '#065f46', fontSize: '1.25rem', marginBottom: '0.25rem' }}>
                    {member.full_name}
                    {member.user && (
                      <span style={{ fontSize: '0.875rem', color: '#6b7280', marginLeft: '0.5rem' }}>
                        🔗 Linked Account
                      </span>
                    )}
                  </h3>
                  <p style={{ color: '#6b7280', fontWeight: '500', marginBottom: '0.75rem' }}>
                    {member.club_name || 'No Club'}
                  </p>
                  
                  {/* Contact and details */}
                  <div style={{ display: 'grid', gap: '0.25rem', fontSize: '0.875rem', color: '#9ca3af' }}>
                    {member.email && <div>📧 {member.email}</div>}
                    {member.phone && <div>📞 {member.phone}</div>}
                    {member.address && <div>📍 {member.address}</div>}
                    <div>📅 Joined: {new Date(member.date_joined || member.created_date).toLocaleDateString()}</div>
                    {member.birth_date && (
                      <div>🎂 Born: {new Date(member.birth_date).toLocaleDateString()}</div>
                    )}
                    {member.handicap > 0 && <div>🏆 Handicap: {member.handicap}</div>}
                    {member.notes && (
                      <div style={{ marginTop: '0.5rem', padding: '0.5rem', backgroundColor: '#f9fafb', borderRadius: '0.25rem' }}>
                        💬 {member.notes}
                      </div>
                    )}
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