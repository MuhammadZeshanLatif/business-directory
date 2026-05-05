import React, { useState } from 'react';
import { PageView, Business, Category } from '../types';

function cnicDigitsOnly(raw: string): string {
  return raw.replace(/\D/g, '');
}

function formatCnic13(d: string): string {
  if (d.length !== 13) return d;
  return `${d.slice(0, 5)}-${d.slice(5, 12)}-${d.slice(12)}`;
}

interface AddBusinessProps {
  onAdd: (newBusiness: Business) => void | Promise<void>;
  setView: (view: PageView) => void;
}

export const AddBusiness: React.FC<AddBusinessProps> = ({ onAdd, setView }) => {
  const [name, setName] = useState('');
  const [category, setCategory] = useState<Category>('Plumber');
  const [description, setDescription] = useState('');
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [website, setWebsite] = useState('');
  const [city, setCity] = useState('');
  const [cnic, setCnic] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

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

    if (!name.trim() || !category) {
      return;
    }

    const cnicDigits = cnicDigitsOnly(cnic);
    if (cnicDigits.length !== 13) {
      setSubmitError(
        'CNIC is required and must contain exactly 13 digits (#####-#######-#).'
      );
      return;
    }

    const newBusiness: Business = {
      id: `biz-${Date.now()}`,
      name,
      category,
      description,
      address,
      phone,
      website,
      city,
      cnic: formatCnic13(cnicDigits),
      status: 'pending', // Auto-set new listings to pending for admin evaluation
      createdAt: new Date().toISOString()
    };

    setSubmitError(null);
    try {
      await Promise.resolve(onAdd(newBusiness));
      setSubmitted(true);
      setTimeout(() => {
        setView('businesses');
      }, 2500);
    } catch (err) {
      setSubmitError(
        err instanceof Error ? err.message : 'Could not save your listing.'
      );
    }
  };

  return (
    <div className="form-container">
      {submitted ? (
        <div style={{ textAlign: 'center' }}>
          <div className="notification-banner">
            Success! Your listing has been registered and is now awaiting verification from our admin team.
          </div>
          <p style={{ color: 'var(--text-muted)' }}>Redirecting you to active directories...</p>
        </div>
      ) : (
        <>
          <h1 className="form-title">Register Your Business</h1>
          <p className="form-subtitle">Add your local service specialty to our professional network directory.</p>

          <form onSubmit={handleSubmit} className="listing-form">
            {submitError && (
              <div className="notification-banner" role="alert">
                {submitError}
              </div>
            )}
            <div className="form-field-full">
              <label className="form-label" htmlFor="biz-name">
                Business Name <span style={{ color: 'var(--error-color)' }}>*</span>
              </label>
              <input
                id="biz-name"
                type="text"
                placeholder="e.g. Precision Quality Services"
                className="form-input"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            <div className="form-field-full">
              <label className="form-label" htmlFor="biz-category">
                Directory Category <span style={{ color: 'var(--error-color)' }}>*</span>
              </label>
              <select
                id="biz-category"
                className="form-select"
                value={category}
                onChange={(e) => setCategory(e.target.value as Category)}
                required
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-field-full">
              <label className="form-label" htmlFor="biz-cnic">
                CNIC <span style={{ color: 'var(--error-color)' }}>*</span>
              </label>
              <input
                id="biz-cnic"
                type="text"
                inputMode="numeric"
                autoComplete="off"
                placeholder="e.g. 35202-1234567-1"
                className="form-input"
                value={cnic}
                onChange={(e) => setCnic(e.target.value)}
                required
                aria-required="true"
              />
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.35rem' }}>
                13 digits required. Dashes optional — submit blocked until CNIC is complete.
              </p>
            </div>

            <div className="form-field-full">
              <label className="form-label" htmlFor="biz-desc">
                Description
              </label>
              <textarea
                id="biz-desc"
                placeholder="Give prospective clients a quick overview of your background, hours, and areas of focus."
                className="form-textarea"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>

            <div>
              <label className="form-label" htmlFor="biz-address">
                Street Address
              </label>
              <input
                id="biz-address"
                type="text"
                placeholder="e.g. 118 S 3rd Ave"
                className="form-input"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
              />
            </div>

            <div>
              <label className="form-label" htmlFor="biz-city">
                City / Region
              </label>
              <input
                id="biz-city"
                type="text"
                placeholder="e.g. Denver"
                className="form-input"
                value={city}
                onChange={(e) => setCity(e.target.value)}
              />
            </div>

            <div>
              <label className="form-label" htmlFor="biz-phone">
                Phone Number
              </label>
              <input
                id="biz-phone"
                type="tel"
                placeholder="e.g. +1 (555) 019-2831"
                className="form-input"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>

            <div>
              <label className="form-label" htmlFor="biz-web">
                Website Link
              </label>
              <input
                id="biz-web"
                type="url"
                placeholder="e.g. https://yoursite.com"
                className="form-input"
                value={website}
                onChange={(e) => setWebsite(e.target.value)}
              />
            </div>

            <div className="form-actions">
              <button
                type="button"
                onClick={() => setView('home')}
                className="form-btn-cancel"
              >
                Cancel
              </button>
              <button type="submit" className="form-btn-submit">
                Register Listing
              </button>
            </div>
          </form>
        </>
      )}
    </div>
  );
};
