import React, { useState } from 'react';
import { PageView, Business, Category } from '../types';
import { 
  Search, 
  Wrench, 
  Stethoscope, 
  Snowflake, 
  Settings, 
  Zap, 
  Activity, 
  Briefcase, 
  UtensilsCrossed, 
  Scissors, 
  Home as HomeIcon,
  MapPin,
  Phone,
  ArrowRight
} from 'lucide-react';

interface HomeProps {
  businesses: Business[];
  /** True when Supabase is on and the table has no rows (after load). */
  directoryEmpty?: boolean;
  setView: (view: PageView) => void;
  setSelectedCategory: (category: Category | 'All') => void;
  setSelectedBusinessId: (id: string) => void;
  setKeywordSearch: (term: string) => void;
}

export const Home: React.FC<HomeProps> = ({
  businesses,
  directoryEmpty = false,
  setView,
  setSelectedCategory,
  setSelectedBusinessId,
  setKeywordSearch
}) => {
  const [localSearchTerm, setLocalSearchTerm] = useState('');

  const categories: { name: Category; icon: any }[] = [
    { name: 'Plumber', icon: Wrench },
    { name: 'Doctor', icon: Stethoscope },
    { name: 'AC Technician', icon: Snowflake },
    { name: 'Car Mechanic', icon: Settings },
    { name: 'Electrician', icon: Zap },
    { name: 'Dentist', icon: Activity },
    { name: 'Lawyer', icon: Briefcase },
    { name: 'Restaurant', icon: UtensilsCrossed },
    { name: 'Salon', icon: Scissors },
    { name: 'Real Estate Agent', icon: HomeIcon }
  ];

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setKeywordSearch(localSearchTerm);
    setSelectedCategory('All');
    setView('businesses');
  };

  const selectCategory = (category: Category) => {
    setSelectedCategory(category);
    setKeywordSearch('');
    setView('businesses');
  };

  const getBusinessCount = (catName: Category) => {
    return businesses.filter((b) => b.category === catName && b.status === 'approved').length;
  };

  // Recently added (approved only)
  const recentBusinesses = [...businesses]
    .filter(b => b.status === 'approved')
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 4);

  return (
    <div className="home-view">
      {/* Hero */}
      <section className="hero-section">
        <h1 className="hero-title">Connecting You with Trusted Local Specialists</h1>
        <p className="hero-subtitle">
          Discover vetted businesses, skilled contractors, and reliable service providers within your immediate area. Clear, transparent local reviews and detailed directories.
        </p>

        {directoryEmpty && (
          <p className="directory-empty-banner" role="status">
            Directory database is empty — add a listing or run your seed SQL in Supabase.
          </p>
        )}

        <form onSubmit={handleSearchSubmit} className="search-container">
          <div className="search-input-wrapper">
            <Search size={20} className="search-icon-inside" />
            <input
              type="text"
              placeholder="What service or business name are you looking for?"
              className="search-input"
              value={localSearchTerm}
              onChange={(e) => setLocalSearchTerm(e.target.value)}
            />
          </div>
          <button type="submit" className="search-btn">
            Find
          </button>
        </form>
      </section>

      {/* Categories Section */}
      <section className="category-section">
        <div className="section-header">
          <h2 className="section-title">Explore by Specialty</h2>
          <button
            onClick={() => { setSelectedCategory('All'); setKeywordSearch(''); setView('businesses'); }}
            style={{ background: 'none', border: 'none', cursor: 'pointer' }}
            className="section-link"
          >
            View all categories
          </button>
        </div>

        <div className="categories-grid">
          {categories.map((cat) => {
            const IconComp = cat.icon;
            const count = getBusinessCount(cat.name);
            return (
              <div
                key={cat.name}
                className="category-card"
                onClick={() => selectCategory(cat.name)}
              >
                <div className="category-card-icon">
                  <IconComp size={28} strokeWidth={1.8} />
                </div>
                <div className="category-card-name">{cat.name}</div>
                <div className="category-card-count">{count} {count === 1 ? 'listing' : 'listings'}</div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Featured/Recent Section */}
      {recentBusinesses.length > 0 && (
        <section className="category-section" style={{ marginBottom: 0 }}>
          <div className="section-header">
            <h2 className="section-title">Recently Verified Listings</h2>
            <button
              onClick={() => { setSelectedCategory('All'); setKeywordSearch(''); setView('businesses'); }}
              style={{ background: 'none', border: 'none', cursor: 'pointer' }}
              className="section-link"
            >
              Browse listings
            </button>
          </div>

          <div className="listings-main">
            {recentBusinesses.map((biz) => (
              <div key={biz.id} className="business-card">
                <div className="card-top">
                  <div className="card-heading">
                    <h3 className="card-title">{biz.name}</h3>
                    <span className="card-category-badge">{biz.category}</span>
                  </div>
                </div>
                {biz.description && (
                  <p className="card-description">{biz.description}</p>
                )}
                <div className="card-metadata">
                  {biz.city && (
                    <div className="meta-item">
                      <MapPin size={16} />
                      <span>{biz.city}</span>
                    </div>
                  )}
                  {biz.phone && (
                    <div className="meta-item">
                      <Phone size={16} />
                      <span>{biz.phone}</span>
                    </div>
                  )}
                </div>
                <div className="card-bottom-actions">
                  <button
                    onClick={() => {
                      setSelectedBusinessId(biz.id);
                      setView('detail');
                    }}
                    className="card-btn card-btn-primary"
                  >
                    Details <ArrowRight size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};
