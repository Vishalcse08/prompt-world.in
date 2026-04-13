import React, { useState } from 'react';
import { useUser } from '../UserContext';
import { useNavigate } from 'react-router-dom';
import { Plus, Zap, MessageSquare, CheckCircle2, Crown, X, ChevronDown, Folder, Globe, Smartphone, Bot } from 'lucide-react';

const Projects = () => {
  const { user, projects, addProject, credits } = useUser();
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
      title: '',
      platform: 'Web App',
      appType: 'Dashboard',
      description: ''
  });

  const getPlatformIcon = (platform) => {
      if (platform === 'Web App') return <Globe size={18} />;
      if (platform === 'Mobile App') return <Smartphone size={18} />;
      return <Bot size={18} />;
  };

  const stats = [
    { title: 'Total Projects', value: projects.length, sub: `+${projects.length} this week`, icon: Folder, iconBg: 'bg-surface', iconColor: 'text-primary', trendColor: 'text-green-500' },
    { title: 'Active Projects', value: projects.length, sub: '+0 this week', icon: Zap, iconBg: 'bg-surface', iconColor: 'text-[#3E7BFA]', trendColor: 'text-[#3E7BFA]' },
    { title: 'Prompts Generated', value: projects.length, sub: `+${projects.length} total`, icon: MessageSquare, iconBg: 'bg-surface', iconColor: 'text-[#A855F7]', trendColor: 'text-[#A855F7]' },
    { title: 'Success Rate', value: '94%', sub: '+2% vs last month', icon: CheckCircle2, iconBg: 'bg-surface', iconColor: 'text-[#10B981]', trendColor: 'text-[#10B981]' },
  ];

  const handleCreate = (e) => {
      e.preventDefault();
      setShowModal(false);
      navigate('/dashboard/projects/new', { state: { ...formData, isNew: true } });
  };

  const openProject = (proj) => {
      navigate('/dashboard/projects/new', { state: { ...proj } });
  };

  return (
    <div className="space-y-10 animate-fade-in relative">
      {/* Header */}
      <div>
        <h1 className="text-3xl md:text-4xl font-bold mb-2 tracking-tight">Projects</h1>
        <p className="text-foreground/50 text-xs md:text-sm font-medium">Manage your AI prompt engineering projects and workspaces</p>
      </div>

      {/* Usage Progress */}
      <div className="bg-surface border border-foreground/5 p-6 md:p-8 rounded-[2rem] space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between font-bold text-xs uppercase tracking-widest gap-4">
            <div className="flex items-center gap-3">
                <Crown size={18} className="text-primary" />
                <span className="text-foreground/80">Project Usage</span>
                <span className="text-foreground/50 ml-2 md:ml-4 font-black">STARTER</span>
            </div>
            <div className="text-foreground/50">{projects.length}/2</div>
        </div>
        <div className="h-2 bg-[#1a1a1a] rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-primary/30 to-primary rounded-full shadow-[0_0_10px_rgba(173,255,0,0.2)]" style={{ width: `${(projects.length / 2) * 100}%` }}></div>
        </div>
        <p className="text-[11px] text-zinc-600 font-bold uppercase">{Math.max(0, 2 - projects.length)} project slots remaining</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {stats.map((stat) => (
          <div key={stat.title} className="bg-surface border border-foreground/5 p-6 md:p-8 rounded-[2rem] hover:border-foreground/10 transition-all flex justify-between items-start">
            <div>
                <h4 className="text-foreground/50 text-[10px] md:text-[11px] font-bold uppercase tracking-widest mb-2 md:mb-4">{stat.title}</h4>
                <div className="text-3xl md:text-4xl font-bold mb-2 md:mb-4">{stat.value}</div>
                <div className={`text-[10px] md:text-[11px] font-bold flex items-center gap-1 ${stat.trendColor}`}>
                    <Plus size={10} strokeWidth={4} />
                    {stat.sub}
                </div>
            </div>
            <div className={`w-10 h-10 md:w-12 md:h-12 rounded-xl md:rounded-2xl flex items-center justify-center ${stat.iconBg}`}>
                <stat.icon size={18} className={stat.iconColor} />
            </div>
          </div>
        ))}
      </div>

      {/* Project Workspaces Section */}
      <div className="bg-surface border border-foreground/5 p-6 md:p-10 rounded-[2rem] min-h-[400px]">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-10">
              <div>
                  <h2 className="text-2xl font-bold mb-1 tracking-tight">Project Workspaces</h2>
                  <p className="text-foreground/50 text-xs md:text-sm">Create and manage AI prompt projects for different platforms</p>
              </div>
              <div className="flex items-center gap-4">
                  <span className="flex items-center gap-2 text-xs font-bold text-green-500 uppercase tracking-widest">
                      <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                      {projects.length} projects
                  </span>
              </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8">
              {/* Existing Projects Mapping */}
              {projects.map((proj) => (
                  <div 
                    key={proj.id} 
                    onClick={() => openProject(proj)}
                    className="aspect-square bg-card-bg border border-foreground/5 rounded-[2.5rem] p-8 flex flex-col justify-between hover:border-primary/40 transition-all group cursor-pointer relative overflow-hidden bg-surface hover:bg-foreground/5"
                  >
                      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                      
                      <div className="relative z-10 flex justify-between items-start">
                          <div className="w-12 h-12 bg-foreground/5 rounded-2xl flex items-center justify-center text-foreground/60 group-hover:text-primary transition-colors">
                             {getPlatformIcon(proj.platform)}
                          </div>
                          <div className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest group-hover:text-foreground/60 transition-colors">{proj.appType}</div>
                      </div>
                      <div className="relative z-10 p-2">
                          <h3 className="text-2xl font-bold mb-2 group-hover:text-primary transition-all duration-300 transform group-hover:translate-x-1">{proj.title}</h3>
                          <p className="text-foreground/50 text-xs line-clamp-3 group-hover:text-foreground/60">{proj.description || proj.projectIdea}</p>
                      </div>
                      <div className="relative z-10 pt-4 border-t border-foreground/5 flex items-center justify-between">
                          <span className="text-[10px] text-zinc-600 font-medium">Created {new Date(proj.createdAt).toLocaleDateString()}</span>
                          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary transform group-hover:rotate-12 transition-all">
                              <Zap size={14} fill="currentColor" />
                          </div>
                      </div>
                  </div>
              ))}

              {/* New Project Button Card */}
              {(!user?.is_admin && projects.length >= 2) ? (
                  <div className="aspect-square border-2 border-dashed border-red-500/20 bg-red-500/5 rounded-[2.5rem] flex flex-col items-center justify-center p-8 text-center gap-4">
                        <div className="w-12 h-12 bg-red-500/20 rounded-2xl flex items-center justify-center text-red-500">
                            <Plus size={24} className="rotate-45" />
                        </div>
                        <div>
                            <p className="text-sm font-bold text-red-100 mb-1">Limit Reached</p>
                            <p className="text-[10px] text-red-400 font-medium">Upgrade to create more than 2 projects</p>
                        </div>
                  </div>
              ) : (
                  <button
                    onClick={() => {
                        if (!user?.is_admin && credits < 500) {
                            navigate('/dashboard/pricing');
                            return;
                        }
                        setShowModal(true);
                    }}
                    className="aspect-square border-2 border-dashed border-foreground/5 hover:border-primary/20 hover:bg-foreground/5 rounded-[2.5rem] flex items-center justify-center group transition-all"
                  >
                      <div className="w-14 h-14 bg-foreground/5 rounded-2xl flex items-center justify-center text-foreground/50 group-hover:scale-110 group-hover:bg-primary group-hover:text-black transition-all duration-300">
                          <Plus size={32} />
                      </div>
                  </button>
              )}
          </div>
      </div>

      {/* CREATE NEW PROJECT MODAL */}
      {showModal && (
          <div className="fixed inset-0 z-[1000] flex items-center justify-center p-6 sm:p-0">
              <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" onClick={() => setShowModal(false)}></div>
              
              <div className="relative bg-surface border border-foreground/10 w-full max-w-2xl rounded-3xl overflow-hidden shadow-2xl animate-modal-in">
                  <div className="flex items-start justify-between p-8 pb-4">
                      <div>
                          <h2 className="text-3xl font-bold mb-2">Create New Project</h2>
                          <p className="text-foreground/50 text-sm">Set up a new AI prompt project with your preferred configuration and style.</p>
                      </div>
                      <button onClick={() => setShowModal(false)} className="p-2 text-foreground/50 hover:text-foreground hover:bg-foreground/5 rounded-lg transition-all">
                          <X size={20} />
                      </button>
                  </div>

                  <form onSubmit={handleCreate} className="p-8 pt-4 space-y-8 max-h-[70vh] overflow-y-auto custom-scrollbar">
                      <div className="space-y-6">
                          <div className="flex items-center gap-3 border-b border-foreground/5 pb-4">
                              <span className="text-sm font-bold text-foreground/80">Basic Information</span>
                          </div>
                          <div className="space-y-2">
                              <label className="text-xs font-bold text-foreground/60 uppercase tracking-widest">Project Title *</label>
                              <input 
                                required
                                value={formData.title}
                                onChange={(e) => setFormData({...formData, title: e.target.value})}
                                type="text" placeholder="My Awesome App" 
                                className="w-full bg-[var(--card-hover)] border border-foreground/5 rounded-xl px-4 py-3 text-sm focus:border-primary/50 transition-all outline-none"
                              />
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                              <div className="space-y-2">
                                  <label className="text-xs font-bold text-foreground/60 uppercase tracking-widest">Target Platform *</label>
                                  <div className="relative">
                                      <select 
                                        required
                                        value={formData.platform}
                                        onChange={(e) => setFormData({...formData, platform: e.target.value})}
                                        className="w-full bg-[var(--card-hover)] border border-foreground/5 rounded-xl px-4 py-3 text-sm appearance-none outline-none focus:border-primary/50"
                                      >
                                          <option value="Web App">Web App</option>
                                          <option value="Mobile App">Mobile App</option>
                                          <option value="Desktop App">Desktop App</option>
                                          <option value="Telegram Bot">Telegram Bot</option>
                                      </select>
                                      <ChevronDown size={16} className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-foreground/50" />
                                  </div>
                              </div>
                              <div className="space-y-2">
                                  <label className="text-xs font-bold text-foreground/60 uppercase tracking-widest">App Type *</label>
                                  <div className="relative">
                                      <select 
                                        required
                                        value={formData.appType}
                                        onChange={(e) => setFormData({...formData, appType: e.target.value})}
                                        className="w-full bg-[var(--card-hover)] border border-foreground/5 rounded-xl px-4 py-3 text-sm appearance-none outline-none focus:border-primary/50"
                                      >
                                          <option value="Dashboard">Dashboard</option>
                                          <option value="E-commerce">E-commerce</option>
                                          <option value="Social Media">Social Media</option>
                                          <option value="SAAS Landing">SAAS Landing</option>
                                      </select>
                                      <ChevronDown size={16} className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-foreground/50" />
                                  </div>
                              </div>
                          </div>
                          <div className="space-y-2">
                              <label className="text-xs font-bold text-foreground/60 uppercase tracking-widest">Project Description *</label>
                              <textarea 
                                required
                                value={formData.description}
                                onChange={(e) => setFormData({...formData, description: e.target.value})}
                                placeholder="Describe what your project does and its main features..." 
                                className="w-full bg-[var(--card-hover)] border border-foreground/5 rounded-xl px-4 py-4 text-sm min-h-[120px] focus:border-primary/50 transition-all outline-none resize-none"
                              ></textarea>
                          </div>
                      </div>

                      <div className="flex items-center gap-4 pt-4 pb-4">
                          <button type="button" onClick={() => setShowModal(false)} className="flex-1 py-4 bg-foreground/5 hover:bg-foreground/10 rounded-2xl font-bold transition-all text-sm border border-foreground/5">Cancel</button>
                          <button type="submit" className="flex-1 py-4 bg-primary text-black rounded-2xl font-bold hover:opacity-90 transition-all text-sm shadow-xl shadow-primary/20">Create Project</button>
                      </div>
                  </form>
              </div>
          </div>
      )}
    </div>
  );
};

export default Projects;
