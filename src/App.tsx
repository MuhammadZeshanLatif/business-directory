import { useState, useEffect, useCallback } from 'react';
import type { Session } from '@supabase/supabase-js';
import { PageView, Business, Category, Profile } from './types';
import { defaultBusinesses } from './data/defaultBusinesses';
import { isSupabaseConfigured, supabase } from './lib/supabaseClient';
import {
  fetchBusinesses,
  insertBusiness,
  updateBusiness,
  updateBusinessStatus,
  deleteBusiness
} from './lib/businessDb';
import { fetchMyProfile } from './lib/profilesDb';
import { Login } from './components/Login';
import { Signup } from './components/Signup';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { Home } from './components/Home';
import { Businesses } from './components/Businesses';
import { BusinessDetail } from './components/BusinessDetail';
import { AddBusiness } from './components/AddBusiness';
import { EditBusiness } from './components/EditBusiness';
import { Admin } from './components/Admin';
import { PrivacyPolicy } from './components/PrivacyPolicy';
import { Terms } from './components/Terms';
import './App.css';

function App() {
  const withTimeout = async <T,>(
    p: Promise<T>,
    ms: number,
    label: string
  ): Promise<T> => {
    let timer: ReturnType<typeof setTimeout> | null = null;
    const timeoutPromise = new Promise<never>((_, reject) => {
      timer = setTimeout(() => reject(new Error(`${label} timed out`)), ms);
    });
    try {
      return await Promise.race([p, timeoutPromise]);
    } finally {
      if (timer) clearTimeout(timer);
    }
  };

  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [authLoading, setAuthLoading] = useState(isSupabaseConfigured);
  const [businesses, setBusinesses] = useState<Business[]>(() =>
    isSupabaseConfigured ? [] : defaultBusinesses
  );
  const [listLoading, setListLoading] = useState(isSupabaseConfigured);
  const [listError, setListError] = useState<string | null>(null);

  const [currentView, setView] = useState<PageView>('home');
  const [selectedCategory, setSelectedCategory] = useState<Category | 'All'>('All');
  const [selectedBusinessId, setSelectedBusinessId] = useState<string>('');
  const [keywordSearch, setKeywordSearch] = useState<string>('');

  const refreshProfile = useCallback(async (uid: string) => {
    if (!supabase) return;
    try {
      const p = await fetchMyProfile(uid);
      setProfile(p);
    } catch (e) {
      console.error(e);
      setProfile(null);
    }
  }, []);

  useEffect(() => {
    if (!isSupabaseConfigured || !supabase) {
      setAuthLoading(false);
      return;
    }
    let mounted = true;
    (async () => {
      try {
        const {
          data: { session: initial }
        } = await withTimeout(supabase.auth.getSession(), 8000, 'Auth session');
        if (!mounted) return;
        setSession(initial);
        setAuthLoading(false);
        if (initial?.user?.id) {
          void refreshProfile(initial.user.id);
        }
      } catch (e) {
        console.error(e);
        if (!mounted) return;
        setSession(null);
        setAuthLoading(false);
      }
    })();

    const {
      data: { subscription }
    } = supabase.auth.onAuthStateChange(async (_event, next) => {
      setSession(next);
      if (next?.user?.id) {
        void refreshProfile(next.user.id);
      } else {
        setProfile(null);
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [refreshProfile]);

  /** Reload list from Supabase so UI always matches the database. */
  const refreshFromDb = useCallback(async () => {
    if (!isSupabaseConfigured) return;
    try {
      const rows = await fetchBusinesses();
      setBusinesses(rows);
      setListError(null);
    } catch (e) {
      console.error(e);
      setListError(
        e instanceof Error ? e.message : 'Could not sync with the database.'
      );
    }
  }, []);

  useEffect(() => {
    if (isSupabaseConfigured) {
      let cancelled = false;
      setListLoading(true);
      (async () => {
        try {
          const rows = await withTimeout(
            fetchBusinesses(),
            10000,
            'Businesses load'
          );
          if (!cancelled) {
            setBusinesses(rows);
            setListError(null);
          }
        } catch (e) {
          console.error(e);
          if (!cancelled) {
            setListError(
              e instanceof Error ? e.message : 'Could not load listings.'
            );
            setBusinesses([]);
          }
        } finally {
          if (!cancelled) setListLoading(false);
        }
      })();
      return () => {
        cancelled = true;
      };
    }

    const cached = localStorage.getItem('local_citations_businesses');
    if (cached) {
      try {
        const parsed = JSON.parse(cached) as Business[];
        setBusinesses(
          parsed.map((b) => ({ ...b, cnic: b.cnic ?? '' }))
        );
      } catch {
        setBusinesses(defaultBusinesses);
      }
    } else {
      setBusinesses(defaultBusinesses);
    }
    setListLoading(false);
  }, [session?.user?.id, profile?.role]);

  useEffect(() => {
    if (isSupabaseConfigured) return;
    localStorage.setItem('local_citations_businesses', JSON.stringify(businesses));
  }, [businesses]);

  const handleAddBusiness = async (newBiz: Business) => {
    if (isSupabaseConfigured) {
      if (!session?.user?.id) {
        throw new Error('Please login first to add listing.');
      }
      await insertBusiness(newBiz, session.user.id);
      await refreshFromDb();
      return;
    }
    setBusinesses((prev) => [newBiz, ...prev]);
  };

  const handleApproveBusiness = async (id: string) => {
    try {
      if (isSupabaseConfigured) {
        await updateBusinessStatus(id, 'approved');
        await refreshFromDb();
        return;
      }
      setBusinesses((prev) =>
        prev.map((biz) =>
          biz.id === id ? { ...biz, status: 'approved' as const } : biz
        )
      );
    } catch (e) {
      console.error(e);
    }
  };

  const handleDeleteBusiness = async (id: string) => {
    try {
      if (isSupabaseConfigured) {
        await deleteBusiness(id);
        await refreshFromDb();
        return;
      }
      setBusinesses((prev) => prev.filter((biz) => biz.id !== id));
    } catch (e) {
      console.error(e);
    }
  };

  const handleUpdateBusiness = async (updated: Business) => {
    if (isSupabaseConfigured) {
      await updateBusiness(updated);
      await refreshFromDb();
      return;
    }
    setBusinesses((prev) =>
      prev.map((b) => (b.id === updated.id ? updated : b))
    );
  };

  const activeBusiness =
    businesses.find((biz) => biz.id === selectedBusinessId) || null;

  const canEditActiveBusiness = Boolean(
    activeBusiness &&
      session?.user?.id &&
      (profile?.role === 'admin' || activeBusiness.ownerId === session.user.id)
  );

  useEffect(() => {
    if (!isSupabaseConfigured || authLoading) return;
    if (!session) {
      if (
        currentView === 'admin' ||
        currentView === 'add' ||
        currentView === 'edit' ||
        currentView === 'my-business'
      ) {
        setView('login');
      }
      return;
    }
    if (currentView === 'admin' && profile?.role !== 'admin') {
      setView('home');
    }
    if (
      currentView === 'edit' &&
      selectedBusinessId &&
      activeBusiness &&
      profile?.role !== 'admin' &&
      session?.user?.id !== activeBusiness.ownerId
    ) {
      setView('businesses');
    }
  }, [
    authLoading,
    session,
    profile?.role,
    currentView,
    selectedBusinessId,
    activeBusiness
  ]);

  const onLogin = async (email: string, password: string) => {
    if (!supabase) return { error: new Error('Supabase is not configured') };
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (!error) setView('home');
    return { error: error as Error | null };
  };

  const onSignup = async (email: string, password: string, fullName: string) => {
    if (!supabase) return { error: new Error('Supabase is not configured') };
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name: fullName } }
    });
    return { error: error as Error | null };
  };

  const onLogout = async () => {
    if (!supabase) return;
    await supabase.auth.signOut();
    setView('home');
  };

  return (
    <div className="app-container">
      <Header
        currentView={currentView}
        setView={setView}
        isLoggedIn={Boolean(session)}
        isAdmin={profile?.role === 'admin'}
        userEmail={session?.user?.email}
        userName={profile?.full_name}
        onLogout={onLogout}
      />

      <main className="main-content">
        {authLoading && isSupabaseConfigured && (
          <p className="directory-loading" role="status">Loading session…</p>
        )}
        {listLoading && (
          <p className="directory-loading" role="status">
            Loading directory…
          </p>
        )}
        {listError && !listLoading && isSupabaseConfigured && (
          <p className="directory-error" role="alert">
            {listError}
          </p>
        )}
        {!listLoading && currentView === 'home' && (
          <Home
            businesses={businesses}
            directoryEmpty={
              isSupabaseConfigured && businesses.length === 0 && !listError
            }
            setView={setView}
            setSelectedCategory={setSelectedCategory}
            setSelectedBusinessId={setSelectedBusinessId}
            setKeywordSearch={setKeywordSearch}
          />
        )}

        {!listLoading && currentView === 'businesses' && (
          <Businesses
            businesses={businesses}
            directoryEmpty={
              isSupabaseConfigured && businesses.length === 0 && !listError
            }
            currentUserId={session?.user?.id ?? null}
            canManageOwn={Boolean(session)}
            heading="All Listings"
            onEditBusiness={(id) => {
              setSelectedBusinessId(id);
              setView('edit');
            }}
            onDeleteBusiness={handleDeleteBusiness}
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
            keywordSearch={keywordSearch}
            setKeywordSearch={setKeywordSearch}
            setSelectedBusinessId={setSelectedBusinessId}
            setView={setView}
          />
        )}

        {!listLoading && currentView === 'my-business' && (
          <Businesses
            businesses={businesses}
            directoryEmpty={false}
            currentUserId={session?.user?.id ?? null}
            canManageOwn={Boolean(session)}
            showOnlyOwned={true}
            heading="My Business Dashboard"
            onEditBusiness={(id) => {
              setSelectedBusinessId(id);
              setView('edit');
            }}
            onDeleteBusiness={handleDeleteBusiness}
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
            keywordSearch={keywordSearch}
            setKeywordSearch={setKeywordSearch}
            setSelectedBusinessId={setSelectedBusinessId}
            setView={setView}
          />
        )}

        {!listLoading && currentView === 'login' && (
          <Login setView={setView} onLogin={onLogin} />
        )}

        {!listLoading && currentView === 'signup' && (
          <Signup setView={setView} onSignup={onSignup} />
        )}

        {!listLoading && currentView === 'detail' && (
          <BusinessDetail business={activeBusiness} setView={setView} />
        )}

        {!listLoading && currentView === 'add' && (
          <AddBusiness onAdd={handleAddBusiness} setView={setView} />
        )}

        {!listLoading && currentView === 'edit' && activeBusiness && canEditActiveBusiness && (
          <EditBusiness
            business={activeBusiness}
            onSave={handleUpdateBusiness}
            setView={setView}
          />
        )}

        {!listLoading && currentView === 'admin' && profile?.role === 'admin' && (
          <Admin
            businesses={businesses}
            onApprove={handleApproveBusiness}
            onDelete={handleDeleteBusiness}
            setView={setView}
            setSelectedBusinessId={setSelectedBusinessId}
          />
        )}

        {!listLoading && currentView === 'privacy' && (
          <PrivacyPolicy setView={setView} />
        )}

        {!listLoading && currentView === 'terms' && <Terms setView={setView} />}
      </main>

      <Footer setView={setView} />
    </div>
  );
}
export default App;

