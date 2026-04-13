import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import { LayoutDashboard, Folder, HelpCircle, Columns, Settings, ShieldCheck } from 'lucide-react';
import { useUser } from '../UserContext';

const SideNav = ({ collapsed, setCollapsed, isMobileOpen, setIsMobileOpen }) => {
  const { user } = useUser();
  
  const navItems = [
    { name: 'Dashboard', icon: LayoutDashboard, path: '/dashboard' },
    { name: 'Projects', icon: Folder, path: '/dashboard/projects' },
  ];

  if (user?.is_admin) {
    navItems.push({ name: 'Admin', icon: ShieldCheck, path: '/dashboard/admin' });
  }

  return (
    <aside 
      className={`
        fixed inset-y-0 left-0 z-[150] md:relative 
        bg-background border-r border-foreground/5 
        flex flex-col transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]
        ${isMobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
        ${collapsed ? 'md:w-16' : 'md:w-64'} 
        w-64 shrink-0
      `}
    >
      {/* Top Controls & Branding */}
      <div className="p-4 flex items-center justify-between border-b border-foreground/5 h-16 shrink-0">
        <Link to="/" className={`flex items-center gap-2 overflow-hidden transition-all duration-300 ${collapsed ? 'md:w-0 md:opacity-0' : 'w-full opacity-100'}`}>
            <img src="/logo.png" alt="PromptWorld Logo" className="h-[28px] w-[28px] rounded-full object-cover border border-foreground/10 drop-shadow-[0_0_10px_rgba(173,255,0,0.2)]" />
        </Link>
        <button 
          onClick={() => setCollapsed(!collapsed)}
          className={`hidden md:block p-2 text-foreground/50 hover:text-foreground transition-colors ${collapsed ? 'mx-auto' : ''}`}
        >
          <Columns size={20} className={collapsed ? 'rotate-180' : ''} />
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-6 space-y-1">
        {navItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            end={item.path === '/dashboard'}
            onClick={() => setIsMobileOpen(false)}
            className={({ isActive }) => `
              flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all duration-200
              ${isActive 
                ? 'bg-foreground/5 text-foreground font-semibold shadow-sm' 
                : 'text-foreground/50 hover:text-foreground/80 hover:bg-foreground/[0.02]'
              }
              ${collapsed ? 'md:justify-center md:px-0' : ''}
            `}
          >
            <item.icon size={20} className={collapsed ? 'md:flex-shrink-0' : 'flex-shrink-0'} />
            <span className={`text-sm transition-all duration-300 whitespace-nowrap ${collapsed ? 'md:w-0 md:opacity-0' : 'opacity-100'}`}>{item.name}</span>
          </NavLink>
        ))}
      </nav>

      {/* Bottom Actions */}
      <div className="px-3 pb-8 space-y-1 shrink-0">
          <button className={`w-full flex items-center gap-3 px-4 py-2.5 text-foreground/50 hover:text-foreground/80 transition-all ${collapsed ? 'md:justify-center md:px-0' : ''}`}>
             <HelpCircle size={20} className="shrink-0" />
             <span className={`text-sm transition-all duration-300 ${collapsed ? 'md:w-0 md:opacity-0 pointer-events-none' : 'opacity-100'}`}>Support</span>
          </button>
          <button className={`w-full flex items-center gap-3 px-4 py-2.5 text-foreground/50 hover:text-foreground/80 transition-all ${collapsed ? 'md:justify-center md:px-0' : ''}`}>
             <Settings size={20} className="shrink-0" />
             <span className={`text-sm transition-all duration-300 ${collapsed ? 'md:w-0 md:opacity-0 pointer-events-none' : 'opacity-100'}`}>Settings</span>
          </button>
      </div>

      <div className={`px-4 pb-4 transition-all duration-300 ${collapsed ? 'opacity-0' : 'opacity-100'}`}>
          <div className="pt-4 border-t border-foreground/5 text-[10px] text-foreground/30 font-bold uppercase tracking-[0.2em]">
              Made by <a href="https://praxire.com" target="_blank" rel="noopener noreferrer" className="text-primary/50 hover:text-primary transition-colors">Praxire</a>
          </div>
      </div>
    </aside>
  );
};

export default SideNav;
