import React, { useState } from 'react';
import { PageView, Business } from '../types';
import { 
  BarChart, 
  Search, 
  CheckCircle, 
  XCircle, 
  Trash2, 
  Filter, 
  Award,
  Users,
  LayoutList
} from 'lucide-react';
import { AdminUsers } from './AdminUsers';

interface AdminProps {
  businesses: Business[];
  onApprove: (id: string) => void;
  onDelete: (id: string) => void;
  setView: (view: PageView) => void;
  setSelectedBusinessId: (id: string) => void;
}

export const Admin: React.FC<AdminProps> = ({
  businesses,
  onApprove,
  onDelete,
  setView,
  setSelectedBusinessId
}) => {
  const [tab, setTab] = useState<'listings' | 'users'>('listings');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'All' | 'approved' | 'pending'>('All');

  const categoriesSet = new Set(businesses.map((b) => b.category));

  // Compute stat counts
  const totalCount = businesses.length;
  const approvedCount = businesses.filter((b) => b.status === 'approved').length;
  const pendingCount = businesses.filter((b) => b.status === 'pending').length;

  const filtered = businesses.filter((b) => {
    const matchSearch =
      b.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.city.toLowerCase().includes(searchTerm.toLowerCase());

    const matchStatus = statusFilter === 'All' || b.status === statusFilter;

    return matchSearch && matchStatus;
  });

  return (
    <div className="admin-layout">
      {/* Top Banner info */}
      <div className="admin-header">
        <div>
          <h1 className="legal-title" style={{ fontSize: '1.75rem', marginBottom: '0.2rem' }}>
            System Console & Administration
          </h1>
          <p className="results-info">View, authorize, filter, or remove directory records in real-time.</p>
        </div>
      </div>

      <div className="admin-toolbar" style={{ border: '1px solid var(--border-color)', borderRadius: 10 }}>
        <div style={{ display: 'flex', gap: 8 }}>
          <button className={`action-btn ${tab === 'listings' ? 'approve' : ''}`} onClick={() => setTab('listings')}>
            <LayoutList size={14} /> Listings
          </button>
          <button className={`action-btn ${tab === 'users' ? 'approve' : ''}`} onClick={() => setTab('users')}>
            <Users size={14} /> Members
          </button>
        </div>
      </div>

      {tab === 'users' && <AdminUsers />}
      {tab === 'listings' && (
        <>

      {/* Metrics Section */}
      <div className="admin-stats-grid">
        <div className="stat-card">
          <div className="stat-details">
            <span className="stat-label">Total Listings</span>
            <span className="stat-value">{totalCount}</span>
          </div>
          <div className="stat-icon">
            <Award size={24} />
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-details">
            <span className="stat-label">Verified</span>
            <span className="stat-value" style={{ color: 'var(--success-color)' }}>
              {approvedCount}
            </span>
          </div>
          <div className="stat-icon" style={{ color: 'var(--success-color)' }}>
            <CheckCircle size={24} />
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-details">
            <span className="stat-label">Pending</span>
            <span className="stat-value" style={{ color: 'var(--pending-color)' }}>
              {pendingCount}
            </span>
          </div>
          <div className="stat-icon" style={{ color: 'var(--pending-color)' }}>
            <XCircle size={24} />
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-details">
            <span className="stat-label">Categories</span>
            <span className="stat-value">{categoriesSet.size}</span>
          </div>
          <div className="stat-icon">
            <BarChart size={24} />
          </div>
        </div>
      </div>

      {/* Dashboard Records Table */}
      <div className="admin-table-container">
        <div className="admin-toolbar">
          <div className="admin-search-wrapper" style={{ minWidth: '280px' }}>
            <Search size={18} className="admin-search-icon" />
            <input
              type="text"
              placeholder="Filter by name, region, or specialty..."
              className="admin-search-input"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Filter size={16} style={{ color: 'var(--text-muted)' }} />
            <select
              className="form-select"
              value={statusFilter}
              onChange={(e) =>
                setStatusFilter(e.target.value as 'All' | 'approved' | 'pending')
              }
              style={{ padding: '0.45rem 0.6rem', fontSize: '0.85rem' }}
            >
              <option value="All">All Statuses</option>
              <option value="approved">Approved</option>
              <option value="pending">Pending</option>
            </select>
          </div>
        </div>

        <table className="admin-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>CNIC</th>
              <th>Category</th>
              <th>City</th>
              <th>Phone</th>
              <th>Website</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length > 0 ? (
              filtered.map((biz) => (
                <tr key={biz.id}>
                  <td>
                    <strong>
                      <button
                        onClick={() => {
                          setSelectedBusinessId(biz.id);
                          setView('detail');
                        }}
                        style={{
                          background: 'none',
                          border: 'none',
                          cursor: 'pointer',
                          color: 'var(--accent-color)',
                          fontWeight: 600,
                          textAlign: 'left',
                          padding: 0
                        }}
                      >
                        {biz.name}
                      </button>
                    </strong>
                  </td>
                  <td style={{ fontSize: '0.8rem', whiteSpace: 'nowrap' }}>
                    {biz.cnic || '—'}
                  </td>
                  <td>{biz.category}</td>
                  <td>{biz.city || 'N/A'}</td>
                  <td>{biz.phone || 'N/A'}</td>
                  <td>
                    {biz.website ? (
                      <a
                        href={biz.website.startsWith('http') ? biz.website : `https://${biz.website}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ color: 'var(--accent-color)' }}
                      >
                        Visit
                      </a>
                    ) : (
                      'N/A'
                    )}
                  </td>
                  <td>
                    <span className={`status-tag ${biz.status}`}>
                      {biz.status}
                    </span>
                  </td>
                  <td>
                    <div className="action-btn-group">
                      {biz.status === 'pending' && (
                        <button
                          onClick={() => onApprove(biz.id)}
                          className="action-btn approve"
                          title="Approve Business"
                        >
                          <CheckCircle size={14} /> Verify
                        </button>
                      )}
                      <button
                        onClick={() => onDelete(biz.id)}
                        className="action-btn delete"
                        title="Delete Business"
                      >
                        <Trash2 size={14} /> Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={8} style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '2rem' }}>
                  {businesses.length === 0
                    ? 'No listings in the database. Add a listing or run your seed in Supabase.'
                    : 'No listing data matches the current filters.'}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
        </>
      )}
    </div>
  );
};
