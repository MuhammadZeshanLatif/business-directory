import React, { useEffect, useState } from 'react';
import { Profile, UserRole } from '../types';
import { fetchAllProfiles, updateMemberRole } from '../lib/profilesDb';

export const AdminUsers: React.FC = () => {
  const [users, setUsers] = useState<Profile[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<string | null>(null);

  const load = async () => {
    setError(null);
    try {
      const rows = await fetchAllProfiles();
      setUsers(rows);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Could not load users.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void load();
  }, []);

  const updateUser = async (
    id: string,
    patch: { role?: UserRole; approved?: boolean }
  ) => {
    setSaving(id);
    try {
      await updateMemberRole(id, patch);
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Could not update user.');
    } finally {
      setSaving(null);
    }
  };

  if (loading) return <p style={{ color: 'var(--text-muted)' }}>Loading members…</p>;

  return (
    <div className="admin-table-container">
      {error && <div className="notification-banner">{error}</div>}
      <table className="admin-table">
        <thead>
          <tr>
            <th>Email</th>
            <th>Name</th>
            <th>Role</th>
            <th>Verified</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {users.map((u) => (
            <tr key={u.id}>
              <td>{u.email ?? 'N/A'}</td>
              <td>{u.full_name || 'N/A'}</td>
              <td>
                <select
                  className="form-select"
                  style={{ fontSize: '0.85rem', padding: '0.35rem' }}
                  value={u.role}
                  disabled={saving === u.id}
                  onChange={(e) =>
                    void updateUser(u.id, { role: e.target.value as UserRole })
                  }
                >
                  <option value="user">user</option>
                  <option value="admin">admin</option>
                </select>
              </td>
              <td>{u.approved ? 'Yes' : 'No'}</td>
              <td>
                <button
                  className={u.approved ? 'action-btn delete' : 'action-btn approve'}
                  disabled={saving === u.id}
                  onClick={() => void updateUser(u.id, { approved: !u.approved })}
                >
                  {u.approved ? 'Unverify' : 'Verify'}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
