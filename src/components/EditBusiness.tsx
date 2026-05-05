import React, { useState } from 'react';
import { Business, Category, PageView } from '../types';

function cnicDigitsOnly(raw: string): string {
  return raw.replace(/\D/g, '');
}

function formatCnic13(d: string): string {
  if (d.length !== 13) return d;
  return `${d.slice(0, 5)}-${d.slice(5, 12)}-${d.slice(12)}`;
}

interface EditBusinessProps {
  business: Business;
  onSave: (updated: Business) => void | Promise<void>;
  setView: (view: PageView) => void;
}

export const EditBusiness: React.FC<EditBusinessProps> = ({
  business,
  onSave,
  setView
}) => {
  const [name, setName] = useState(business.name);
  const [category, setCategory] = useState<Category>(business.category);
  const [description, setDescription] = useState(business.description);
  const [address, setAddress] = useState(business.address);
  const [phone, setPhone] = useState(business.phone);
  const [website, setWebsite] = useState(business.website);
  const [city, setCity] = useState(business.city);
  const [cnic, setCnic] = useState(business.cnic);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const categories: Category[] = [
    'Plumber',
    'Doctor',
    'AC Technician',
    'Car Mechanic',
    'Electrician',
    'Dentist',
    'Lawyer',
    'Restaurant',
    'Salon',
    'Real Estate Agent'
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);
    const cnicDigits = cnicDigitsOnly(cnic);
    if (cnicDigits.length !== 13) {
      setSubmitError(
        'CNIC is required and must contain exactly 13 digits (#####-#######-#).'
      );
      return;
    }

    const updated: Business = {
      ...business,
      name,
      category,
      description,
      address,
      phone,
      website,
      city,
      cnic: formatCnic13(cnicDigits)
    };

    setSaving(true);
    try {
      await Promise.resolve(onSave(updated));
      setView('businesses');
    } catch (err) {
      setSubmitError(
        err instanceof Error ? err.message : 'Could not update listing.'
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="form-container">
      <h1 className="form-title">Edit Listing</h1>
      <p className="form-subtitle">Update your business information.</p>
      <form onSubmit={handleSubmit} className="listing-form">
        {submitError && <div className="notification-banner">{submitError}</div>}
        <div className="form-field-full">
          <label className="form-label" htmlFor="edit-name">
            Business Name
          </label>
          <input id="edit-name" className="form-input" value={name} onChange={(e) => setName(e.target.value)} required />
        </div>
        <div className="form-field-full">
          <label className="form-label" htmlFor="edit-category">Directory Category</label>
          <select id="edit-category" className="form-select" value={category} onChange={(e) => setCategory(e.target.value as Category)} required>
            {categories.map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>
        <div className="form-field-full">
          <label className="form-label" htmlFor="edit-cnic">CNIC</label>
          <input id="edit-cnic" className="form-input" value={cnic} onChange={(e) => setCnic(e.target.value)} required />
        </div>
        <div className="form-field-full">
          <label className="form-label" htmlFor="edit-description">Description</label>
          <textarea id="edit-description" className="form-textarea" value={description} onChange={(e) => setDescription(e.target.value)} />
        </div>
        <div>
          <label className="form-label" htmlFor="edit-address">Street Address</label>
          <input id="edit-address" className="form-input" value={address} onChange={(e) => setAddress(e.target.value)} />
        </div>
        <div>
          <label className="form-label" htmlFor="edit-city">City / Region</label>
          <input id="edit-city" className="form-input" value={city} onChange={(e) => setCity(e.target.value)} />
        </div>
        <div>
          <label className="form-label" htmlFor="edit-phone">Phone Number</label>
          <input id="edit-phone" className="form-input" value={phone} onChange={(e) => setPhone(e.target.value)} />
        </div>
        <div>
          <label className="form-label" htmlFor="edit-website">Website Link</label>
          <input id="edit-website" className="form-input" value={website} onChange={(e) => setWebsite(e.target.value)} />
        </div>
        <div className="form-actions">
          <button type="button" className="form-btn-cancel" onClick={() => setView('businesses')}>Cancel</button>
          <button type="submit" className="form-btn-submit" disabled={saving}>{saving ? 'Saving…' : 'Save Changes'}</button>
        </div>
      </form>
    </div>
  );
};
