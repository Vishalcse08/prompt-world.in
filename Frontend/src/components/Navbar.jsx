import React, { useState, useEffect, useRef } from 'react';
import { useUser } from '../UserContext';
import { useNavigate } from 'react-router-dom';
import { Search, Moon, Sun, Monitor, ChevronDown, Menu, Folder, Zap, Command, X, Sparkles, LayoutGrid, LogOut } from 'lucide-react';

const Navbar = ({ onMenuClick }) => {
  const { credits, user, theme, setTheme, projects, logout } = useUser();
  const navigate = useNavigate();
  const [showThemeMenu, setShowThemeMenu] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [showResults, setShowResults] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const searchRef = useRef(null);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        searchRef.current?.focus();
      }
      if (e.key === 'Escape') {
        setShowResults(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const filteredProjects = projects.filter(p => 
    p.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.projectIdea?.toLowerCase().includes(searchTerm.toLowerCase())
  ).slice(0, 5);



  const themes = [
    { id: 'light', name: 'Light', icon: Sun },
    { id: 'dark', name: 'Dark', icon: Moon },
    { id: 'system', name: 'System', icon: Monitor },
  ];

  const CurrentThemeIcon = themes.find(t => t.id === theme)?.icon || Moon;

  return (
    <header className="h-16 border-b border-foreground/5 bg-surface flex items-center justify-between px-4 md:px-6 sticky top-0 z-[100]">
      <div className="flex items-center gap-3 md:gap-4 flex-1 relative">
        <button 
          onClick={onMenuClick}
          className="md:hidden p-2 text-foreground/50 hover:text-foreground hover:bg-foreground/5 rounded-lg transition-all"
        >
          <Menu size={20} />
        </button>

        <div className="flex items-center gap-3 bg-surface border border-foreground/5 px-3 md:px-4 py-1.5 rounded-lg w-full max-w-sm group focus-within:border-primary/50 transition-all">
          <Search size={16} className="text-zinc-600 group-focus-within:text-foreground/60" />
          <input 
            ref={searchRef}
            type="text" 
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setShowResults(true);
            }}
            onFocus={() => setShowResults(true)}
            placeholder="Search projects..." 
            className="bg-transparent border-none outline-none text-sm w-full placeholder:text-zinc-600 text-foreground focus:ring-0" 
          />
          <div className="hidden sm:flex items-center gap-1">
             <span className="text-[10px] text-zinc-600 font-bold bg-foreground/5 px-1.5 py-0.5 rounded border border-foreground/5 shrink-0">⌘ K</span>
          </div>
        </div>

        {/* Search Results Dropdown */}
        {showResults && (
            <>
                <div className="fixed inset-0 z-[110]" onClick={() => setShowResults(false)}></div>
                <div className="absolute top-14 left-0 md:left-12 w-full max-w-sm bg-surface border border-foreground/10 rounded-2xl shadow-2xl z-[120] p-2 animate-modal-in overflow-hidden">
                    <div className="px-3 py-2 text-[10px] font-bold text-zinc-600 uppercase tracking-widest border-b border-foreground/5 flex justify-between items-center">
                        Project Search
                        <button onClick={() => setShowResults(false)}><X size={12} /></button>
                    </div>

                    {/* Filtered Projects */}
                    <div className="space-y-1">
                        <div className="px-3 pt-2 pb-1 text-[9px] font-bold text-zinc-600 uppercase tracking-widest">
                            {searchTerm ? 'Matching Projects' : 'Recent Projects'}
                        </div>
                        {filteredProjects.length > 0 ? (
                            filteredProjects.map(p => (
                                <button
                                    key={p.id}
                                    onClick={() => {
                                        navigate('/dashboard/projects/new', { state: { ...p } });
                                        setShowResults(false);
                                        setSearchTerm('');
                                    }}
                                    className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm text-foreground/70 hover:bg-foreground/5 hover:text-foreground transition-all group"
                                >
                                    <Folder size={16} className="text-zinc-600 group-hover:text-primary transition-colors" />
                                    <div className="text-left flex-1 min-w-0">
                                        <p className="truncate font-medium">{p.title}</p>
                                        <p className="text-[10px] text-zinc-600 truncate">{p.appType}</p>
                                    </div>
                                </button>
                            ))
                        ) : (
                            <div className="px-3 py-4 text-center text-xs text-zinc-600 italic">No projects found</div>
                        )}
                    </div>

                    {/* Quick Links */}
                    <div className="mt-2 border-t border-foreground/5 p-1">
                        <button 
                            onClick={() => {
                                navigate('/dashboard/projects');
                                setShowResults(false);
                            }}
                            className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-bold text-primary hover:bg-primary/5 transition-all"
                        >
                            <Sparkles size={14} />
                            Start New Project
                        </button>
                    </div>
                </div>
            </>
        )}
      </div>

      <div className="flex items-center gap-4">
        {/* Theme Switcher */}
        <div className="relative">
            <button 
                onClick={() => setShowThemeMenu(!showThemeMenu)}
                className="p-2.5 text-foreground/50 hover:text-foreground bg-foreground/5 rounded-xl border border-foreground/5 transition-all flex items-center gap-2"
            >
                <CurrentThemeIcon size={18} />
                <ChevronDown size={14} className={`transition-transform duration-300 ${showThemeMenu ? 'rotate-180' : ''}`} />
            </button>

            {showThemeMenu && (
                <>
                    <div className="fixed inset-0 z-40" onClick={() => setShowThemeMenu(false)}></div>
                    <div className="absolute right-0 mt-3 w-40 bg-surface border border-foreground/10 rounded-2xl p-2 shadow-2xl z-50 animate-modal-in">
                        {themes.map((t) => (
                            <button
                                key={t.id}
                                onClick={() => {
                                    setTheme(t.id);
                                    setShowThemeMenu(false);
                                }}
                                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all ${theme === t.id ? 'bg-primary/10 text-primary' : 'text-foreground/50 hover:bg-foreground/5 hover:text-foreground'}`}
                            >
                                <t.icon size={16} />
                                {t.name}
                            </button>
                        ))}
                    </div>
                </>
            )}
        </div>

        {/* User Info & Dropdown */}
        <div className="relative group">
            <button 
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="h-10 w-10 bg-gradient-to-br from-green-500 to-primary rounded-full flex items-center justify-center text-black font-bold text-sm border-2 border-[#030303] shadow-lg hover:scale-105 transition-transform"
            >
                {user?.email?.[0].toUpperCase() || 'V'}
            </button>

            {showUserMenu && (
                <>
                    <div className="fixed inset-0 z-40" onClick={() => setShowUserMenu(false)}></div>
                    <div className="absolute right-0 mt-3 w-56 bg-surface border border-foreground/10 rounded-2xl p-2 shadow-2xl z-50 animate-modal-in">
                        <div className="px-4 py-3 border-b border-foreground/5 mb-1 text-left">
                            <p className="text-xs font-bold text-zinc-600 uppercase tracking-widest mb-1">Signed in as</p>
                            <p className="text-sm font-semibold truncate">{user?.email}</p>
                            <div className="flex items-center gap-2 mt-2">
                                <Zap size={14} className="text-primary fill-primary/20" />
                                <span className="text-xs font-bold text-primary">{credits} Tokens</span>
                            </div>
                        </div>
                        
                        <button
                            onClick={() => {
                                logout();
                                navigate('/login');
                            }}
                            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-red-500 hover:bg-red-500/10 transition-all font-medium"
                        >
                            <LogOut size={16} />
                            Log Out
                        </button>
                    </div>
                </>
            )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
