// src/pages/administration/laws.jsx - Dedicated Laws Management Page
import React, { useState, useEffect } from "react";
import { useRouter } from 'next/router';

export default function LawsManagement() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [laws, setLaws] = useState([]);
  const [showLawForm, setShowLawForm] = useState(false);
  const [editingLaw, setEditingLaw] = useState(null);

  useEffect(() => {
    checkAuth();
  }, []);

  useEffect(() => {
    if (user?.role === 'admin') {
      loadLaws();
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

  const loadLaws = async () => {
    try {
      const response = await fetch('/api/rules');
      if (response.ok) {
        const data = await response.json();
        setLaws(data);
      }
    } catch (error) {
      console.error('Error loading laws:', error);
    }
  };

  const handleDeleteLaw = async (lawId) => {
    if (!confirm('Are you sure you want to delete this law?')) return;
    
    try {
      const response = await fetch(`/api/rules/${lawId}`, {
        method: 'DELETE'
      });
      
      if (response.ok) {
        await loadLaws();
        alert('Law deleted successfully!');
      } else {
        alert('Failed to delete law');
      }
    } catch (error) {
      console.error('Error deleting law:', error);
      alert('Error deleting law');
    }
  };

  const LawForm = ({ law, onSave, onCancel }) => {
    const [formData, setFormData] = useState({
      language: law?.language || "en",
      part_title: law?.part_title || "",
      part_order: law?.part_order || 1,
      section_title: law?.section_title || "",
      section_order: law?.section_order || 1,
      subsection_title: law?.subsection_title || "",
      subsection_order: law?.subsection_order || 1,
      content: law?.content || ""
    });
    const [saving, setSaving] = useState(false);

    const handleSubmit = async (e) => {
      e.preventDefault();
      setSaving(true);

      try {
        // Clean up subsection fields if empty
        const dataToSend = { ...formData };
        if (!dataToSend.subsection_title.trim()) {
          dataToSend.subsection_title = null;
          dataToSend.subsection_order = null;
        }

        const url = law ? `/api/rules/${law.id}` : '/api/rules';
        const method = law ? 'PUT' : 'POST';

        const response = await fetch(url, {
          method,
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(dataToSend)
        });

        if (response.ok) {
          onSave();
          alert(law ? 'Law updated successfully!' : 'Law created successfully!');
        } else {
          alert('Failed to save law');
        }
      } catch (error) {
        console.error('Error saving law:', error);
        alert('Error saving law');
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
          maxWidth: '900px',
          maxHeight: '90vh',
          overflow: 'auto'
        }}>
          <h2 style={{ marginBottom: '1.5rem', color: '#065f46' }}>
            {law ? 'Edit Law' : 'Add New Law'}
          </h2>
          
          <form onSubmit={handleSubmit}>
            <div style={{ display: 'grid', gap: '1rem', gridTemplateColumns: '1fr 1fr', marginBottom: '1rem' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
                  Part Title *
                </label>
                <input
                  type="text"
                  value={formData.part_title}
                  onChange={(e) => setFormData(prev => ({ ...prev, part_title: e.target.value }))}
                  placeholder="e.g., Basic Laws, Advanced Play"
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
                  Section Title *
                </label>
                <input
                  type="text"
                  value={formData.section_title}
                  onChange={(e) => setFormData(prev => ({ ...prev, section_title: e.target.value }))}
                  placeholder="e.g., Equipment Setup, Scoring"
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

            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
                Subsection Title (Optional)
              </label>
              <input
                type="text"
                value={formData.subsection_title}
                onChange={(e) => setFormData(prev => ({ ...prev, subsection_title: e.target.value }))}
                placeholder="e.g., Hoop Position, Ball Placement"
                style={{ 
                  width: '100%', 
                  padding: '0.5rem', 
                  border: '1px solid #d1d5db', 
                  borderRadius: '0.375rem' 
                }}
              />
            </div>

            <div style={{ display: 'grid', gap: '1rem', gridTemplateColumns: '1fr 1fr 1fr 1fr', marginBottom: '1rem' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
                  Part Order
                </label>
                <input
                  type="number"
                  min="1"
                  value={formData.part_order}
                  onChange={(e) => setFormData(prev => ({ ...prev, part_order: parseInt(e.target.value) }))}
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
                  Section Order
                </label>
                <input
                  type="number"
                  min="1"
                  value={formData.section_order}
                  onChange={(e) => setFormData(prev => ({ ...prev, section_order: parseInt(e.target.value) }))}
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
                  Subsection Order
                </label>
                <input
                  type="number"
                  min="1"
                  value={formData.subsection_order}
                  onChange={(e) => setFormData(prev => ({ ...prev, subsection_order: parseInt(e.target.value) }))}
                  style={{ 
                    width: '100%', 
                    padding: '0.5rem', 
                    border: '1px solid #d1d5db', 
                    borderRadius: '0.375rem' 
                  }}
                  disabled={!formData.subsection_title.trim()}
                />
              </div>
              
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
                  Language
                </label>
                <select 
                  value={formData.language} 
                  onChange={(e) => setFormData(prev => ({ ...prev, language: e.target.value }))}
                  style={{ 
                    width: '100%', 
                    padding: '0.5rem', 
                    border: '1px solid #d1d5db', 
                    borderRadius: '0.375rem' 
                  }}
                >
                  <option value="en">English</option>
                  <option value="nl">Nederlands</option>
                </select>
              </div>
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
                Content * (Markdown supported)
              </label>
              <textarea
                value={formData.content}
                onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
                placeholder="Enter law content here. You can use Markdown formatting:&#10;&#10;## Heading&#10;**Bold text**&#10;- List item&#10;&#10;Write your law content..."
                rows={12}
                style={{ 
                  width: '100%', 
                  padding: '0.75rem', 
                  border: '1px solid #d1d5db', 
                  borderRadius: '0.375rem',
                  fontFamily: 'monospace',
                  fontSize: '0.875rem'
                }}
                required
              />
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
                {saving ? 'Saving...' : (law ? 'Update Law' : 'Create Law')}
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center' }}>
        <h2>Loading Laws Management...</h2>
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
            <h1 style={{ fontSize: '2rem', color: '#065f46', margin: 0 }}>📖 Laws Management</h1>
            <p style={{ color: '#6b7280', margin: '0.5rem 0 0 0' }}>
              Manage croquet laws with hierarchical organization
            </p>
          </div>
          <button
            onClick={() => {
              setEditingLaw(null);
              setShowLawForm(true);
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
            ➕ Add New Law
          </button>
        </div>
      </div>

      {/* Laws List */}
      {laws.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '4rem', backgroundColor: '#f9fafb', borderRadius: '0.75rem' }}>
          <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>📖</div>
          <h3 style={{ color: '#065f46', marginBottom: '1rem' }}>No Laws Added Yet</h3>
          <p style={{ color: '#6b7280', marginBottom: '2rem' }}>
            Start building your lawbook by adding the first law.
          </p>
          <button
            onClick={() => {
              setEditingLaw(null);
              setShowLawForm(true);
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
            ➕ Add First Law
          </button>
        </div>
      ) : (
        <div style={{ display: 'grid', gap: '1rem' }}>
          {laws.map((law) => (
            <div key={law.id} style={{
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
                      backgroundColor: '#e5e7eb', 
                      padding: '0.25rem 0.5rem', 
                      borderRadius: '0.25rem', 
                      fontSize: '0.75rem',
                      marginRight: '0.5rem'
                    }}>
                      {law.language.toUpperCase()}
                    </span>
                    <span style={{ 
                      backgroundColor: '#dbeafe', 
                      color: '#1e40af',
                      padding: '0.25rem 0.5rem', 
                      borderRadius: '0.25rem', 
                      fontSize: '0.75rem'
                    }}>
                      Part {law.part_order} - Section {law.section_order}
                      {law.subsection_title && ` - Subsection ${law.subsection_order}`}
                    </span>
                  </div>
                  <h3 style={{ color: '#065f46', fontSize: '1.25rem', marginBottom: '0.25rem' }}>
                    {law.section_title}
                    {law.subsection_title && (
                      <span style={{ color: '#6b7280', fontWeight: 'normal' }}>
                        {' > '}{law.subsection_title}
                      </span>
                    )}
                  </h3>
                  <p style={{ color: '#6b7280', fontWeight: '500', marginBottom: '0.5rem' }}>
                    {law.part_title}
                  </p>
                  <p style={{ color: '#9ca3af', fontSize: '0.875rem' }}>
                    {law.content.length > 150 ? law.content.substring(0, 150) + '...' : law.content}
                  </p>
                </div>
                <div style={{ display: 'flex', gap: '0.5rem', marginLeft: '1rem' }}>
                  <button
                    onClick={() => {
                      setEditingLaw(law);
                      setShowLawForm(true);
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
                    onClick={() => handleDeleteLaw(law.id)}
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

      {/* Law Form Modal */}
      {showLawForm && (
        <LawForm
          law={editingLaw}
          onSave={async () => {
            setShowLawForm(false);
            setEditingLaw(null);
            await loadLaws();
          }}
          onCancel={() => {
            setShowLawForm(false);
            setEditingLaw(null);
          }}
        />
      )}

      {/* Footer */}
      <div style={{ marginTop: '3rem', textAlign: 'center', color: '#6b7280', fontSize: '0.875rem' }}>
        <p>Laws Management | Nederlandse Bond der Croquet</p>
      </div>
    </div>
  );
}