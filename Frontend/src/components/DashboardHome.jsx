import React from 'react';
import { useUser } from '../UserContext';
import { LayoutGrid, Sparkles, Zap, ArrowUpRight, Folder, Info } from 'lucide-react';
import { Link } from 'react-router-dom';

const DashboardHome = () => {
  const { user, credits, projects } = useUser();

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold mb-2 tracking-tight">Dashboard</h1>
          <p className="text-foreground/50 text-xs md:text-sm">Welcome back! Here's what's happening in your AI workspace.</p>
        </div>
        <Link 
            to="/dashboard/projects" 
            className="bg-primary text-black px-6 py-2.5 rounded-xl font-bold flex items-center gap-2 hover:opacity-90 transition-all shadow-lg shadow-primary/10"
        >
            <Folder size={18} />
            New Project
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Total Projects */}
        <div className="bg-surface border border-foreground/5 p-6 rounded-3xl relative group transition-all hover:border-foreground/10">
            <div className="flex justify-between items-start mb-10">
                <span className="text-foreground/60 text-sm font-medium uppercase tracking-wider">Total Projects</span>
                <Folder size={20} className="text-zinc-600" />
            </div>
            <div className="text-5xl font-bold mb-4">{projects.length}</div>
            <div className="text-xs text-foreground/50 mb-6 font-medium">Active AI projects</div>
            <Link to="/dashboard/projects" className="w-8 h-8 bg-primary/10 text-primary rounded-lg flex items-center justify-center hover:bg-primary/20 transition-all">
                <ArrowUpRight size={16} />
            </Link>
        </div>

        {/* AI Prompts */}
        <div className="bg-surface border border-foreground/5 p-6 rounded-3xl relative group transition-all hover:border-foreground/10">
            <div className="flex justify-between items-start mb-10">
                <span className="text-foreground/60 text-sm font-medium uppercase tracking-wider">AI Prompts</span>
                <Sparkles size={20} className="text-zinc-600" />
            </div>
            <div className="text-5xl font-bold mb-4">{projects.length}</div>
            <div className="text-xs text-foreground/50 mb-6 font-medium">Generated prompts</div>
            <Link to="/dashboard/projects" className="w-8 h-8 bg-primary/10 text-primary rounded-lg flex items-center justify-center hover:bg-primary/20 transition-all">
                <ArrowUpRight size={16} />
            </Link>
        </div>

        {/* Usage Summary */}
        <div className="bg-surface border border-foreground/5 p-8 rounded-3xl relative">
            <div className="flex items-center gap-2 text-foreground/60 mb-6 font-medium uppercase tracking-wider text-sm">
                <LayoutGrid size={18} />
                Usage Summary
            </div>
            <p className="text-foreground/50 text-xs mb-8">This month's activity overview</p>
            
            <div className="flex items-center justify-between mb-8">
                <div>
                   <div className="text-sm font-semibold text-foreground/80">Available Tokens</div>
                   <div className="text-[10px] text-zinc-600">Tokens never expire • Purchase anytime</div>
                </div>
                <div className="text-primary font-bold text-xl">{credits} tokens</div>
            </div>

            <Link 
                to="/dashboard/pricing"
                className="w-full py-3 block text-center bg-foreground/5 border border-foreground/5 rounded-xl text-foreground/60 font-bold hover:bg-foreground/10 hover:text-foreground transition-all text-sm"
            >
                Buy More Tokens
            </Link>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-surface border border-foreground/5 p-8 rounded-3xl min-h-[300px] flex flex-col">
          <div className="flex justify-between items-center mb-10">
              <h2 className="text-xl font-bold">Recent Activity</h2>
              <button className="text-foreground/60 text-sm hover:text-foreground transition-colors">View all</button>
          </div>
          <p className="text-foreground/50 text-sm mb-2">Latest updates and changes in your workspace</p>
          
          <div className="flex-1 space-y-4">
              {projects.length === 0 ? (
                  <div className="flex-1 flex flex-col items-center justify-center text-center py-10 opacity-40 h-full">
                      <div className="text-sm font-medium mb-2">No recent activity</div>
                      <div className="text-xs">Start by creating a new project or prompt</div>
                  </div>
              ) : (
                  projects.slice(0, 3).map(proj => (
                      <div key={proj.id} className="flex items-center justify-between p-4 bg-foreground/5 rounded-2xl border border-foreground/5">
                          <div className="flex items-center gap-4">
                              <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
                                  <Folder size={18} />
                              </div>
                              <div>
                                  <div className="text-sm font-bold">{proj.title}</div>
                                  <div className="text-[10px] text-zinc-600 uppercase tracking-widest">{proj.appType}</div>
                              </div>
                          </div>
                          <div className="text-[10px] text-zinc-600">
                             {new Date(proj.createdAt).toLocaleTimeString()}
                          </div>
                      </div>
                  ))
              )}
          </div>
      </div>
    </div>
  );
};

export default DashboardHome;
