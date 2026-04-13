import React, { useState, useEffect } from 'react';
import { useUser } from '../UserContext';
import { useLocation } from 'react-router-dom';
import { Sparkles, Copy, Check, Info, AlertTriangle, Zap, Terminal, Code2, Type } from 'lucide-react';
import { supabase } from '../Supabase';

const PromptGenerator = () => {
  const { credits, setCredits, addProject, projects } = useUser();
  const location = useLocation();
  
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState(null);
  const [currentProjectId, setCurrentProjectId] = useState(null);
  
  const [formData, setFormData] = useState({
    projectIdea: '',
    designStyle: 'Modern SaaS',
    platform: 'Claude',
    appType: 'Dashboard',
    primaryColor: '#ADFF00',
    format: 'text',
    audience: 'General Users',
    tone: 'Professional',
    complexity: 'Standard MVP',
    appTheme: 'Dark Mode'
  });

  const [output, setOutput] = useState('');
  const [activeView, setActiveView] = useState('text');

  useEffect(() => {
    if (location.state) {
        setFormData(prev => ({
            ...prev,
            projectIdea: location.state.description || location.state.projectIdea || '',
            platform: location.state.platform || prev.platform,
            appType: location.state.appType || prev.appType,
            title: location.state.title,
            format: location.state.format || prev.format,
            designStyle: location.state.designStyle || prev.designStyle,
            primaryColor: location.state.primaryColor || prev.primaryColor,
            audience: location.state.audience || prev.audience,
            tone: location.state.tone || prev.tone,
            complexity: location.state.complexity || prev.complexity,
            appTheme: location.state.appTheme || prev.appTheme
        }));
        if (location.state.output) setOutput(location.state.output);
        if (location.state.id) setCurrentProjectId(location.state.id);
    }
  }, [location.state]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleGenerate = async () => {
    setError(null);
    setLoading(true);
    setOutput('');

    try {
      const { data: { session } } = supabase ? await supabase.auth.getSession() : { data: { session: null } };
      
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/generate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session?.access_token || 'mock-token'}`
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Failed to generate');

      setOutput(data.output);
      setCredits(data.newCredits);

      addProject({
          ...formData,
          output: data.output,
          title: formData.title || formData.projectIdea.substring(0, 20) + '...',
          id: currentProjectId 
      });

      if (!currentProjectId) {
          setCurrentProjectId(Date.now()); 
      }

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    let textToCopy;
    if (typeof output === 'object' && output !== null) {
      const content = output[activeView] || output.text || output;
      textToCopy = typeof content === 'object' ? JSON.stringify(content, null, 2) : content;
    } else {
      textToCopy = output;
    }
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-10 animate-fade-in px-4 md:px-0">
      <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold mb-2 tracking-tight">Prompt <span className="text-gradient">Generator</span></h1>
            <p className="text-foreground/60 text-xs md:text-sm">Configure your project specs and generate high-fidelity AI system prompts.</p>
          </div>
          {currentProjectId && (
              <div className="bg-primary/10 text-primary border border-primary/20 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest animate-pulse">
                  Session Active
              </div>
          )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-10 items-start">
        <div className="lg:col-span-2 space-y-6 md:space-y-8">
          <div className="glass p-8 rounded-3xl border-foreground/5 space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-foreground/80">Project Idea / Description</label>
              <textarea
                name="projectIdea"
                value={formData.projectIdea}
                onChange={handleInputChange}
                className="w-full bg-foreground/5 border border-foreground/10 rounded-2xl p-4 text-sm h-32 focus:ring-1 focus:ring-primary outline-none transition-all placeholder:text-zinc-700"
                placeholder="Describe your app idea..."
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-foreground/80">Target Platform</label>
                <select 
                  name="platform"
                  value={formData.platform}
                  onChange={handleInputChange}
                  className="w-full bg-surface border border-foreground/10 rounded-xl p-3 text-sm focus:ring-1 focus:ring-primary outline-none appearance-none cursor-pointer"
                >
                  <option>Claude (Artifacts)</option>
                  <option>Lovable.dev</option>
                  <option>Antigravity</option>
                  <option>Bolt.new</option>
                  <option>v0.dev</option>
                  <option>Replit Agent</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-foreground/80">Product Type</label>
                <select 
                  name="appType"
                  value={formData.appType}
                  onChange={handleInputChange}
                  className="w-full bg-surface border border-foreground/10 rounded-xl p-3 text-sm focus:ring-1 focus:ring-primary outline-none appearance-none cursor-pointer"
                >
                  <option>SaaS Dashboard</option>
                  <option>Marketing Landing</option>
                  <option>E-commerce Store</option>
                  <option>Internal Tools</option>
                  <option>Mobile App (React Native)</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-foreground/80">Style</label>
                <select 
                  name="designStyle"
                  value={formData.designStyle}
                  onChange={handleInputChange}
                  className="w-full bg-surface border border-foreground/10 rounded-xl p-3 text-sm focus:ring-1 focus:ring-primary outline-none appearance-none cursor-pointer"
                >
                  <option>Modern SaaS</option>
                  <option>Cyberpunk</option>
                  <option>Minimalist</option>
                  <option>Corporate</option>
                  <option>Playful</option>
                  <option>Retro Future</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-foreground/80">Complexity</label>
                <select 
                  name="complexity"
                  value={formData.complexity}
                  onChange={handleInputChange}
                  className="w-full bg-surface border border-foreground/10 rounded-xl p-3 text-sm focus:ring-1 focus:ring-primary outline-none appearance-none cursor-pointer"
                >
                  <option>Concise MVP</option>
                  <option>Standard MVP</option>
                  <option>Production Ready</option>
                  <option>Enterprise Grade</option>
                  <option>Documentation Only</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-foreground/80">Target Audience</label>
                <select 
                  name="audience"
                  value={formData.audience}
                  onChange={handleInputChange}
                  className="w-full bg-surface border border-foreground/10 rounded-xl p-3 text-sm focus:ring-1 focus:ring-primary outline-none appearance-none cursor-pointer"
                >
                  <option>General Users</option>
                  <option>Technical Developers</option>
                  <option>Executive/Business</option>
                  <option>Creative Designers</option>
                  <option>End Customers</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-foreground/80">Output Tone</label>
                <select 
                  name="tone"
                  value={formData.tone}
                  onChange={handleInputChange}
                  className="w-full bg-surface border border-foreground/10 rounded-xl p-3 text-sm focus:ring-1 focus:ring-primary outline-none appearance-none cursor-pointer"
                >
                  <option>Professional</option>
                  <option>Creative</option>
                  <option>Technical/Dry</option>
                  <option>Casual/Friendly</option>
                  <option>Persuasive/Sales</option>
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-foreground/80">UI Base Theme</label>
              <select 
                name="appTheme"
                value={formData.appTheme}
                onChange={handleInputChange}
                className="w-full bg-surface border border-foreground/10 rounded-xl p-3 text-sm focus:ring-1 focus:ring-primary outline-none appearance-none cursor-pointer"
              >
                <option>Dark Mode (Sleek)</option>
                <option>Light Mode (Clean)</option>
                <option>High Contrast</option>
                <option>Glassmorphic</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-foreground/80">Primary Color</label>
              <div className="flex gap-4">
                <input
                    type="color"
                    name="primaryColor"
                    value={formData.primaryColor}
                    onChange={handleInputChange}
                    className="w-12 h-12 bg-transparent border-none rounded-xl cursor-pointer"
                />
                <input
                    type="text"
                    name="primaryColor"
                    value={formData.primaryColor}
                    onChange={handleInputChange}
                    className="flex-1 bg-foreground/5 border border-foreground/10 rounded-xl px-4 text-sm focus:ring-1 focus:ring-primary outline-none uppercase font-mono"
                />
              </div>
            </div>

            <button
              onClick={handleGenerate}
              disabled={loading || !formData.projectIdea}
              className={`w-full py-4 rounded-2xl font-bold flex items-center justify-center gap-3 transition-all transform active:scale-95 ${loading ? 'bg-zinc-800 text-foreground/50 cursor-not-allowed' : 'bg-primary text-black hover:shadow-[0_0_20px_rgba(173,255,0,0.3)]'}`}
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-zinc-500 border-t-white rounded-full animate-spin"></div>
              ) : (
                <>
                  <Sparkles size={18} />
                  {currentProjectId ? 'Update AI Prompt' : 'Generate AI Prompt'}
                </>
              )}
            </button>

            {error && (
              <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-2xl flex gap-3 text-red-400">
                <AlertTriangle size={18} className="flex-shrink-0" />
                <p className="text-xs font-semibold">{error}</p>
              </div>
            )}
            
            <div className="flex items-center justify-center gap-2 text-[10px] text-foreground/50 font-bold uppercase tracking-widest">
                <Zap size={10} className="fill-current" />
                Deducts 500 Tokens
            </div>
          </div>
        </div>

        <div className="lg:col-span-3">
            <div className="glass rounded-3xl border-foreground/5 h-[600px] max-h-[70vh] flex flex-col overflow-hidden">
                <div className="flex items-center justify-between px-6 py-4 border-b border-foreground/5 bg-foreground/5">
                    <div className="flex items-center gap-3">
                        <Terminal size={16} className="text-primary" />
                        <div className="flex bg-foreground/5 p-0.5 rounded-lg border border-foreground/10 gap-0.5">
                            {[
                                { id: 'text', label: 'TEXT' },
                                { id: 'json', label: 'JSON' },
                                { id: 'yaml', label: 'YAML' }
                            ].map(tab => (
                                <button
                                    key={tab.id}
                                    type="button"
                                    onClick={() => setActiveView(tab.id)}
                                    className={`px-3 py-1 rounded-md text-[11px] font-bold uppercase tracking-wider transition-all ${
                                        activeView === tab.id 
                                            ? 'bg-primary text-black shadow-sm' 
                                            : 'text-foreground/50 hover:text-foreground hover:bg-foreground/5'
                                    }`}
                                >
                                    {tab.label}
                                </button>
                            ))}
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        {output && (
                            <a 
                                href={
                                    formData.platform.includes('Claude') ? 'https://claude.ai' :
                                    formData.platform.includes('Lovable') ? 'https://lovable.dev' :
                                    formData.platform.includes('Bolt') ? 'https://bolt.new' :
                                    formData.platform.includes('v0') ? 'https://v0.dev' :
                                    '#'
                                }
                                target="_blank"
                                rel="noopener noreferrer"
                                onClick={copyToClipboard}
                                className="flex items-center gap-2 px-3 py-1.5 bg-primary/10 text-primary hover:bg-primary/20 rounded-lg text-xs font-bold transition-all border border-primary/20"
                            >
                                <Sparkles size={14} />
                                Export to {formData.platform.split(' ')[0]}
                            </a>
                        )}
                        {output && (
                            <button 
                                onClick={copyToClipboard}
                                className="flex items-center gap-2 px-3 py-1.5 bg-foreground/5 hover:bg-foreground/10 rounded-lg text-xs font-bold transition-all border border-foreground/10"
                            >
                                {copied ? <Check size={14} className="text-primary" /> : <Copy size={14} />}
                                {copied ? 'Copy' : 'Copy'}
                            </button>
                        )}
                    </div>
                </div>

                <div className="flex-1 p-8 overflow-y-auto custom-scrollbar">
                    {!output && !loading && (
                        <div className="h-full flex flex-col items-center justify-center text-center opacity-30 select-none">
                            <Code2 size={64} className="mb-4" />
                            <p className="max-w-xs text-sm">Your structured prompt will appear here. Refine your project idea to get started.</p>
                        </div>
                    )}

                    {loading && (
                        <div className="space-y-4">
                            {[1,2,3,4,5].map(i => (
                                <div key={i} className="h-4 bg-foreground/5 rounded-full animate-pulse" style={{ width: `${Math.random() * 40 + 60}%` }}></div>
                            ))}
                        </div>
                    )}

                    {output && (
                        <pre className="text-foreground/80 text-sm font-mono whitespace-pre-wrap leading-relaxed animate-fade-in custom-scrollbar overflow-x-hidden">
                            {(() => {
                                let content;
                                if (typeof output === 'object' && output !== null) {
                                    content = output[activeView] || output.text || output;
                                } else {
                                    content = output;
                                }

                                // JSON: always pretty-print
                                if (activeView === 'json') {
                                    if (typeof content === 'object') {
                                        return JSON.stringify(content, null, 2);
                                    }
                                    if (typeof content === 'string') {
                                        try {
                                            return JSON.stringify(JSON.parse(content), null, 2);
                                        } catch (e) {
                                            return content;
                                        }
                                    }
                                }
                                // TEXT / YAML: render as string
                                return typeof content === 'object' ? JSON.stringify(content, null, 2) : content;
                            })()}
                        </pre>
                    )}
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default PromptGenerator;
