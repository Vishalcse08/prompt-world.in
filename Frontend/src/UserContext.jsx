import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from './Supabase';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [credits, setCredits] = useState(0);
  const [loading, setLoading] = useState(true);
  const [projects, setProjects] = useState([]);
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'dark');

  useEffect(() => {
    // Apply theme
    const root = window.document.documentElement;
    if (theme === 'system') {
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
      root.classList.remove('light', 'dark');
      root.classList.add(systemTheme);
    } else {
      root.classList.remove('light', 'dark');
      root.classList.add(theme);
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  useEffect(() => {
    if (!supabase) {
        // Temporary: Mock user for testing
        setUser({ 
            id: 'mock-user-id', 
            email: 'test@example.com',
            user_metadata: { full_name: 'Test Administrator' }
        });
        setLoading(false);
        setCredits(100000);
        return;
    }
    
    // Check active sessions
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (session?.user) {
          setLoading(false);
          setCredits(100000); // Mock
      } else {
          setLoading(false);
      }
    });

    const result = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        setCredits(100000); // Mock
      } else {
        setCredits(0);
      }
      setLoading(false);
    });

    const subscription = result.data?.subscription || result.subscription;

    return () => {
        if (subscription && typeof subscription.unsubscribe === 'function') {
            subscription.unsubscribe();
        }
    };
  }, []);

  const addProject = (project) => {
      setProjects(prev => {
          // Check if project with this ID exists
          const existsIndex = prev.findIndex(p => p.id === project.id);
          if (existsIndex !== -1 && project.id) {
              const updated = [...prev];
              updated[existsIndex] = { ...updated[existsIndex], ...project, updatedAt: new Date() };
              return updated;
          }
          // Otherwise add as new
          return [{ ...project, id: project.id || Date.now(), createdAt: new Date() }, ...prev];
      });
  };

  return (
    <UserContext.Provider value={{ user, credits, setCredits, loading, projects, addProject, theme, setTheme }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
