import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const UserContext = createContext();

const API_URL = 'http://localhost:5000';

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

  // Check auth on load
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const res = await axios.get(`${API_URL}/api/auth/me`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          setUser(res.data);
          setCredits(res.data.credits);
          
          // Fetch projects
          const projRes = await axios.get(`${API_URL}/projects`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          
          // Map DB fields to Frontend expected fields
          const mappedProjects = projRes.data.map(p => ({
              id: p.id,
              title: p.name,
              projectIdea: p.name,
              platform: p.platform || 'Claude',
              appType: p.app_type || 'Dashboard',
              output: {
                  text: p.prompt_text,
                  json: p.prompt_json,
                  yaml: p.prompt_yaml
              },
              createdAt: p.created_at,
              description: p.name
          }));
          
          setProjects(mappedProjects);
        } catch (err) {
          console.error('Auth verification failed:', err);
          localStorage.removeItem('token');
          setUser(null);
        }
      }
      setLoading(false);
    };
    checkAuth();
  }, []);

  const login = async (email, password) => {
    try {
      const res = await axios.post(`${API_URL}/api/auth/login`, { email, password });
      localStorage.setItem('token', res.data.token);
      setUser(res.data.user);
      
      const [profile, projRes] = await Promise.all([
        axios.get(`${API_URL}/api/auth/me`, { headers: { Authorization: `Bearer ${res.data.token}` } }),
        axios.get(`${API_URL}/projects`, { headers: { Authorization: `Bearer ${res.data.token}` } })
      ]);

      const mappedProjects = projRes.data.map(p => ({
          id: p.id,
          title: p.name,
          projectIdea: p.name,
          platform: p.platform || 'Claude',
          appType: p.app_type || 'Dashboard',
          output: {
              text: p.prompt_text,
              json: p.prompt_json,
              yaml: p.prompt_yaml
          },
          createdAt: p.created_at,
          description: p.name
      }));

      setUser(profile.data);
      setCredits(profile.data.credits);
      setProjects(mappedProjects);
      return { success: true };
    } catch (err) {
      return { success: false, error: err.response?.data?.error || 'Login failed' };
    }
  };

  const register = async (email, password) => {
    try {
      const res = await axios.post(`${API_URL}/api/auth/register`, { email, password });
      localStorage.setItem('token', res.data.token);
      setUser(res.data.user);
      
      const profile = await axios.get(`${API_URL}/api/auth/me`, {
        headers: { Authorization: `Bearer ${res.data.token}` }
      });
      setUser(profile.data);
      setCredits(profile.data.credits);
      setProjects([]); // New user has no projects
      return { success: true };
    } catch (err) {
      return { success: false, error: err.response?.data?.error || 'Registration failed' };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    setCredits(0);
  };

  const addProject = (project) => {
      setProjects(prev => {
          const exists = prev.find(p => p.id === project.id);
          if (exists) {
              return prev.map(p => p.id === project.id ? { ...p, ...project } : p);
          }
          return [{ ...project, id: project.id || Date.now(), createdAt: new Date() }, ...prev];
      });
  };

  return (
    <UserContext.Provider value={{ 
      user, 
      credits, 
      setCredits, 
      loading, 
      projects, 
      setProjects,
      addProject, 
      theme, 
      setTheme,
      login,
      register,
      logout
    }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
