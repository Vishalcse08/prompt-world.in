import React, { useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform, AnimatePresence, useMotionValue, useMotionTemplate } from 'framer-motion';
import { Sparkles, Zap, ChevronRight, Layers, FileCode, CheckCircle2, ArrowRight, Globe, MessageCircle, Code2, Database, LayoutTemplate, Cpu, TerminalSquare } from 'lucide-react';

const sentence = {
  hidden: { opacity: 1 },
  visible: {
    opacity: 1,
    transition: {
      delay: 0.1,
      staggerChildren: 0.15,
    },
  },
};

const letter = {
  hidden: { opacity: 0, y: 50, rotateX: -90 },
  visible: {
    opacity: 1,
    y: 0,
    rotateX: 0,
    transition: { type: 'spring', damping: 12, stiffness: 100 },
  },
};

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } },
};

const staggerContainer = {
  hidden: { opacity: 1 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.5 } },
};

const MarqueeItem = ({ icon: Icon, text }) => (
  <div className="flex items-center gap-2 px-6 py-3 bg-[#1a1a1a] border border-white/10 rounded-full text-white/70 font-medium whitespace-nowrap mx-3">
    <Icon size={16} className="text-primary" /> {text}
  </div>
);

const HomePage = () => {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  useEffect(() => {
    const handleMouseMove = (e) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [mouseX, mouseY]);

  return (
    <div className="min-h-screen bg-[#030303] text-white selection:bg-primary selection:text-black overflow-hidden font-sans">
      
      {/* Premium Grid Background */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]"></div>
        <div className="absolute top-0 w-full h-full bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/10 via-[#030303]/80 to-[#030303] block transform-gpu"></div>
        
        {/* Dynamic Glowing Orbs - Pure CSS for Performance */}
        <div 
          className="absolute top-1/4 left-1/4 w-[40vw] h-[40vw] rounded-full transform-gpu animate-blob opacity-[0.03]"
          style={{ animationDuration: '15s', background: 'radial-gradient(circle, #ADFF00 0%, transparent 60%)' }}
        ></div>
        <div 
          className="absolute bottom-1/4 right-1/4 w-[40vw] h-[40vw] rounded-full transform-gpu animate-blob animation-delay-2000 opacity-[0.03]"
          style={{ animationDuration: '18s', background: 'radial-gradient(circle, #3b82f6 0%, transparent 60%)' }}
        ></div>
      </div>

      {/* Floating Interactive Cursor Glow */}
      <motion.div 
        className="pointer-events-none fixed inset-0 z-50 transition-opacity duration-300 hidden md:block opacity-50"
        style={{
          background: useMotionTemplate`radial-gradient(circle 400px at ${mouseX}px ${mouseY}px, rgba(173,255,0,0.05), transparent 40%)`
        }}
      />

      {/* Floating Navbar */}
      <motion.nav 
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="fixed top-6 left-1/2 -translate-x-1/2 z-50 w-[95%] max-w-5xl"
      >
        <div className="bg-[#111] px-6 py-3 rounded-full border border-white/10 flex items-center justify-between shadow-2xl transform-gpu relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          <div className="flex items-center gap-3 relative z-10">
             <img src="/logo.png" alt="PromptWorld Logo" className="h-10 w-10 rounded-full object-cover drop-shadow-[0_0_15px_rgba(173,255,0,0.3)]" />
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-white/70 relative z-10">
             <a href="#features" className="hover:text-primary transition-colors hover:scale-105 transform">Features</a>
             <a href="#demo" className="hover:text-primary transition-colors hover:scale-105 transform">Platform</a>
             <a href="#pricing" className="hover:text-primary transition-colors hover:scale-105 transform">Pricing</a>
          </div>
          <div className="flex items-center gap-4 relative z-10">
            <Link to="/login" className="text-sm font-medium hover:text-white transition-colors hidden sm:block">Sign In</Link>
            <Link to="/login" className="bg-white text-black px-6 py-2.5 rounded-full text-sm font-bold hover:scale-105 hover:shadow-[0_0_20px_rgba(255,255,255,0.4)] transition-all flex items-center gap-2">
              Start Building <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </motion.nav>

      {/* Hero Section */}
      <header className="relative pt-56 pb-32 px-6 z-10 flex flex-col items-center justify-center min-h-screen">
        {/* Floating Abstract Elements */}
        <motion.div 
          animate={{ y: [-20, 20, -20] }} 
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-40 left-10 md:left-32 w-24 h-24 bg-[#111] rounded-3xl border border-primary/20 hidden md:flex items-center justify-center shadow-[0_0_30px_rgba(173,255,0,0.05)] transform-gpu"
        >
          <Code2 size={40} className="text-primary/50" />
        </motion.div>
        
        <motion.div 
          animate={{ y: [20, -20, 20] }} 
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          className="absolute top-60 right-10 md:right-32 w-20 h-20 bg-[#111] rounded-full border border-blue-500/20 hidden md:flex items-center justify-center shadow-[0_0_30px_rgba(59,130,246,0.05)] transform-gpu"
        >
          <Database size={30} className="text-blue-400/50" />
        </motion.div>

        <motion.div 
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="max-w-6xl mx-auto text-center"
        >
          <motion.div variants={fadeIn} className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#1c1c1c] border border-white/10 text-xs font-bold uppercase tracking-widest text-primary mb-10 overflow-hidden relative group">
             <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/20 to-transparent -translate-x-full animate-shimmer"></div>
             <Sparkles size={14} className="fill-primary" />
             Next-Gen Prompt Architecture
          </motion.div>
          
          <motion.h1 
            variants={sentence}
            initial="hidden"
            animate="visible"
            className="text-6xl sm:text-7xl md:text-8xl lg:text-[7.5rem] font-extrabold tracking-tighter mb-8 leading-[0.9] perspective-1000"
          >
            {"The Blueprint for ".split(' ').map((word, index) => (
              <motion.span key={index} variants={letter} className="inline-block transform-style-3d mr-4 md:mr-6 lg:mr-8 transform-gpu">
                {word}
              </motion.span>
            ))}
            <br className="hidden md:block" />
            {"Modern SaaS".split(' ').map((word, index) => (
              <motion.span key={index} variants={letter} className="inline-block mr-4 md:mr-6 lg:mr-8 text-transparent bg-clip-text bg-gradient-to-r from-primary via-[#00ff88] to-[#00d4ff] pb-2 drop-shadow-[0_0_30px_rgba(173,255,0,0.3)] transform-gpu">
                {word}
              </motion.span>
            ))}
            <motion.span variants={letter} className="inline-block text-primary transform-gpu">.</motion.span>
          </motion.h1>
          
          <motion.p variants={fadeIn} className="text-white/60 text-lg md:text-2xl max-w-3xl mx-auto mb-14 leading-relaxed font-light">
            Generate high-fidelity, production-ready AI system prompts for Web Apps and Dashboards instantly. Engineered exclusively for elite developers.
          </motion.p>
          
          <motion.div variants={fadeIn} className="flex flex-col sm:flex-row items-center justify-center gap-6 relative z-20">
             <Link to="/login" className="group relative bg-primary text-black px-12 py-5 rounded-full font-bold text-lg hover:scale-105 transition-all duration-300 flex items-center gap-3 overflow-hidden shadow-[0_0_40px_rgba(173,255,0,0.4)] hover:shadow-[0_0_60px_rgba(173,255,0,0.6)]">
                <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform ease-out duration-300"></div>
                <span className="relative flex items-center gap-2">Deploy Architecture <Zap size={20} className="fill-black" /></span>
                <ChevronRight size={20} className="relative group-hover:translate-x-1 transition-transform" />
             </Link>
             <a href="#demo" className="text-white/80 font-medium hover:text-white transition-colors flex items-center gap-3 group px-8 py-5 rounded-full bg-[#1a1a1a] border border-white/10 hover:bg-[#222]">
                <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                   <TerminalSquare size={16} className="text-white group-hover:text-primary transition-colors" />
                </div>
                View Documentation
             </a>
          </motion.div>
         </motion.div>
       </header>

      {/* Infinite Marquee Section */}
      <div className="relative py-10 overflow-hidden border-y border-white/5 bg-[#0a0a0a] z-10 transform-gpu">
        <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-[#030303] to-transparent z-20 pointer-events-none"></div>
        <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-[#030303] to-transparent z-20 pointer-events-none"></div>
        
        <motion.div 
          animate={{ x: [0, -1000] }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          className="flex whitespace-nowrap w-max transform-gpu"
          style={{ willChange: "transform" }}
        >
           <div className="flex">
             {[
               { icon: LayoutTemplate, text: "React Dashboards" },
               { icon: Database, text: "Supabase Schemas" },
               { icon: Cpu, text: "AI Pipeline Integration" },
               { icon: Code2, text: "Next.js Templates" },
               { icon: FileCode, text: "JSON Architectures" },
             ].map((item, i) => <MarqueeItem key={`a-${i}`} {...item} />)}
           </div>
           {/* Duplicate for seamless infinite scroll */}
           <div className="flex">
             {[
               { icon: LayoutTemplate, text: "React Dashboards" },
               { icon: Database, text: "Supabase Schemas" },
               { icon: Cpu, text: "AI Pipeline Integration" },
               { icon: Code2, text: "Next.js Templates" },
               { icon: FileCode, text: "JSON Architectures" },
             ].map((item, i) => <MarqueeItem key={`b-${i}`} {...item} />)}
           </div>
        </motion.div>
      </div>

      {/* Terminal Demo Section */}
      <section id="demo" className="py-32 px-6 relative z-20">
        <motion.div 
          initial={{ opacity: 0, y: 50, scale: 0.95 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 1, type: "spring", stiffness: 50 }}
          className="max-w-5xl mx-auto relative group perspective transform-gpu"
        >
           <div className="absolute -inset-1 rounded-[2.5rem] opacity-20 pointer-events-none" style={{ background: 'radial-gradient(circle, #ADFF00 0%, transparent 70%)' }}></div>
           
           <div className="relative bg-[#050505] rounded-[2rem] border border-white/20 overflow-hidden shadow-2xl transform-gpu transition-all duration-700 hover:rotate-x-2 hover:-translate-y-2">
              {/* Terminal Header */}
              <div className="bg-[#111] px-6 py-4 flex items-center justify-between border-b border-white/10 relative overflow-hidden">
                 <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:animate-shimmer"></div>
                 <div className="flex gap-2">
                    <div className="w-3.5 h-3.5 rounded-full bg-[#ff5f56] shadow-[0_0_10px_rgba(255,95,86,0.5)]"></div>
                    <div className="w-3.5 h-3.5 rounded-full bg-[#ffbd2e] shadow-[0_0_10px_rgba(255,189,46,0.5)]"></div>
                    <div className="w-3.5 h-3.5 rounded-full bg-[#27c93f] shadow-[0_0_10px_rgba(39,201,63,0.5)]"></div>
                 </div>
                 <div className="text-[12px] font-mono text-white/50 font-bold tracking-widest uppercase flex items-center gap-2">
                   <Sparkles size={12} className="text-primary animate-pulse"/> PromptWorld Gen-X
                 </div>
                 <div className="w-10"></div>
              </div>
              
              {/* Terminal Body */}
              <div className="p-8 sm:p-12 text-left font-mono text-[14px] sm:text-[16px] leading-relaxed text-white/90 h-[400px] overflow-hidden relative">
                  <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.5 }}
                  >
                    <div className="flex gap-4 mb-4 items-center bg-white/5 p-3 rounded-lg border border-white/5">
                        <span className="text-primary font-bold">~</span>
                        <motion.span 
                           initial={{ width: 0 }}
                           whileInView={{ width: "100%" }}
                           viewport={{ once: true }}
                           transition={{ duration: 1.5, ease: "linear", delay: 0.8 }}
                           className="overflow-hidden whitespace-nowrap inline-block font-medium"
                        >
                          promptworld generate && deploy --production
                        </motion.span>
                    </div>
                    
                    <motion.div 
                      initial={{ opacity: 0 }} 
                      whileInView={{ opacity: 1 }} 
                      viewport={{ once: true }} 
                      transition={{ delay: 2.5 }}
                      className="text-blue-400 mb-2 flex items-center gap-3"
                    >
                      <Layers size={16} className="animate-spin" /> Abstracting intelligence core via Gemini 2.0 Flash...
                    </motion.div>
                    
                    <motion.div 
                      initial={{ opacity: 0 }} 
                      whileInView={{ opacity: 1 }} 
                      viewport={{ once: true }} 
                      transition={{ delay: 3.5 }}
                      className="text-[#27c93f] font-bold mb-6 flex items-center gap-2"
                    >
                      <CheckCircle2 size={16} /> [SUCCESS] Blueprint ready. Speed: 1.2s.
                    </motion.div>
                    
                    <motion.div 
                      initial={{ opacity: 0, scale: 0.95 }} 
                      whileInView={{ opacity: 1, scale: 1 }} 
                      viewport={{ once: true }} 
                      transition={{ delay: 4, type: "spring" }}
                      className="space-y-1 bg-[#111] p-6 rounded-xl border border-white/5 shadow-inner"
                    >
                        <div className="text-zinc-500">{"// Architecture Configuration"}</div>
                        <div className="text-white/80">{"{"}</div>
                        <div className="pl-6"><span className="text-primary/90 font-bold">"architecture"</span>: <span className="text-yellow-300">"Micro-SaaS React"</span>,</div>
                        <div className="pl-6"><span className="text-primary/90 font-bold">"state_manager"</span>: <span className="text-yellow-300">"Zustand"</span>,</div>
                        <div className="pl-6"><span className="text-primary/90 font-bold">"components"</span>: [</div>
                        <div className="pl-12 text-yellow-300">"PricingTier", "AuthModal", "DataGrid"</div>
                        <div className="pl-6">],</div>
                        <div className="pl-6"><span className="text-primary/90 font-bold">"ui_system"</span>: <span className="text-white/40">...</span></div>
                        <div className="text-white/80">{"}"}</div>
                    </motion.div>
                  </motion.div>

                  <motion.div 
                    animate={{ opacity: [1, 0, 1] }} 
                    transition={{ repeat: Infinity, duration: 1 }}
                    className="w-3 h-6 bg-primary inline-block absolute bottom-12 left-8 md:bottom-12 md:left-12 shadow-[0_0_10px_rgba(173,255,0,0.5)]"
                  ></motion.div>
              </div>
           </div>
        </motion.div>
      </section>

      {/* Futuristic Features Grid */}
      <section id="features" className="py-32 px-6 relative z-10">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-24">
            <h2 className="text-5xl md:text-6xl font-black mb-6 tracking-tight">Engineered for Perfection.</h2>
            <p className="text-white/50 text-xl max-w-2xl mx-auto">Skip the boilerplate. Build the foundational prompt layer that ensures pristine Code generation every time.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
             {[
               { icon: <Zap size={32} />, title: "Sub-Second Velocity", desc: "Powered by Gemini 2.0 Flash architecture. Create massive context windows instantly.", color: "text-primary", bg: "bg-primary/10", border: "hover:border-primary/50", shadow: "hover:shadow-[0_0_40px_rgba(173,255,0,0.2)]" },
               { icon: <Layers size={32} />, title: "Multi-Modal Output", desc: "Native support for complex System Texts, JSON arrays, and nested YAML configs out of the box.", color: "text-[#00d4ff]", bg: "bg-[#00d4ff]/10", border: "hover:border-[#00d4ff]/50", shadow: "hover:shadow-[0_0_40px_rgba(0,212,255,0.2)]" },
               { icon: <FileCode size={32} />, title: "Secure History", desc: "Cloud-synced permanent storage. Access your generation history anywhere, securely.", color: "text-purple-400", bg: "bg-purple-500/10", border: "hover:border-purple-500/50", shadow: "hover:shadow-[0_0_40px_rgba(168,85,247,0.2)]" },
               { icon: <Code2 size={32} />, title: "Developer First", desc: "API driven and meticulously designed specifically for modern frontend & fullstack developers.", color: "text-[#ff0055]", bg: "bg-[#ff0055]/10", border: "hover:border-[#ff0055]/50", shadow: "hover:shadow-[0_0_40px_rgba(255,0,85,0.2)]" },
               { icon: <Database size={32} />, title: "Data Architecture", desc: "Instantly draft DB schemas alongside your UI context. No prompt engineering needed.", color: "text-[#ffaa00]", bg: "bg-[#ffaa00]/10", border: "hover:border-[#ffaa00]/50", shadow: "hover:shadow-[0_0_40px_rgba(255,170,0,0.2)]" },
               { icon: <Globe size={32} />, title: "Global CDN", desc: "Edge-cached deployments ensure your dashboard and generator load at lightning speeds.", color: "text-[#aaaaaa]", bg: "bg-white/10", border: "hover:border-white/50", shadow: "hover:shadow-[0_0_40px_rgba(255,255,255,0.1)]" }
             ].map((feature, idx) => (
                <motion.div 
                  key={idx}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.7, delay: idx * 0.1, type: "spring" }}
                  className={`relative bg-[#111] p-10 rounded-[2.5rem] border border-white/10 ${feature.border} ${feature.shadow} transition-all duration-500 cursor-pointer overflow-hidden group transform-gpu hover:-translate-y-2`}
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
                  <div className={`w-16 h-16 ${feature.bg} rounded-2xl flex items-center justify-center ${feature.color} mb-8 transform group-hover:scale-110 group-hover:rotate-6 transition-transform duration-500`}>
                     {feature.icon}
                  </div>
                  <h3 className="text-2xl font-bold mb-4">{feature.title}</h3>
                  <p className="text-white/60 leading-relaxed font-medium">{feature.desc}</p>
                </motion.div>
             ))}
          </div>
        </div>
      </section>

      {/* Premium Pricing Section */}
      <section id="pricing" className="py-32 px-6 relative z-10 bg-gradient-to-b from-[#030303] via-primary/5 to-[#030303]">
         <div className="max-w-6xl mx-auto">
            <div className="text-center mb-24 relative">
               <h2 className="text-5xl md:text-7xl font-black mb-6 tracking-tight">Radically simple pricing.</h2>
               <p className="text-white/50 text-2xl max-w-3xl mx-auto">Pay for usage. No subscription traps.</p>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-5xl mx-auto">
               {/* Free Tier */}
               <motion.div 
                 initial={{ opacity: 0, x: -50 }}
                 whileInView={{ opacity: 1, x: 0 }}
                 viewport={{ once: true }}
                 transition={{ duration: 0.8 }}
                 className="bg-[#0a0a0a] p-12 rounded-[3.5rem] border border-white/10 hover:border-white/20 transition-colors transform-gpu flex flex-col justify-between group relative overflow-hidden"
               >
                  <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-[100px] pointer-events-none group-hover:bg-white/10 transition-colors"></div>
                  <div>
                    <div className="inline-block px-5 py-2 bg-[#222] rounded-full text-white/70 text-sm font-bold uppercase tracking-widest mb-8 border border-white/10">Starter</div>
                    <div className="flex items-baseline gap-2 mb-4">
                      <div className="text-7xl font-black">$0</div>
                      <div className="text-white/40 font-bold text-xl">/ forever</div>
                    </div>
                    <p className="text-white/50 text-lg mb-10 leading-relaxed">Perfect for exploring the platform and generating a few projects.</p>
                    
                    <ul className="space-y-5 mb-12">
                       {[
                         "1,000 Free Generation Tokens",
                         "Core Gemini 2.0 AI Architecture",
                         "Standard Output Formats",
                         "Basic Support"
                       ].map((item, i) => (
                         <li key={i} className="flex items-center gap-4 text-white/80 font-medium text-lg">
                           <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0">
                             <CheckCircle2 size={14} className="text-white" />
                           </div>
                           {item}
                         </li>
                       ))}
                    </ul>
                  </div>
                  <Link to="/login" className="block w-full py-5 text-center rounded-full border border-white/20 hover:bg-white hover:text-black transition-all duration-300 font-bold text-lg">Create Free Account</Link>
               </motion.div>

               {/* Pro Tier */}
               <motion.div 
                 initial={{ opacity: 0, x: 50 }}
                 whileInView={{ opacity: 1, x: 0 }}
                 viewport={{ once: true }}
                 transition={{ duration: 0.8 }}
                 className="relative bg-[#050505] p-12 rounded-[3.5rem] border border-primary text-black transform-gpu flex flex-col justify-between shadow-[0_0_40px_rgba(173,255,0,0.15)] overflow-hidden group hover:-translate-y-2 transition-transform duration-500"
               >
                  <div className="absolute inset-0 bg-primary opacity-10 pointer-events-none"></div>
                  <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(173,255,0,0.1)_0%,transparent_100%)] pointer-events-none"></div>
                  <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 rounded-full blur-[100px] pointer-events-none group-hover:bg-primary/30 transition-colors"></div>
                  
                  <div className="relative z-10 w-full">
                    <div className="flex justify-between items-start mb-8">
                       <div className="inline-block px-5 py-2 bg-[#1A2600] rounded-full text-primary text-sm font-bold uppercase tracking-widest border border-primary/30">Professional</div>
                       <div className="px-4 py-1.5 bg-primary text-black rounded-full font-black text-xs uppercase tracking-widest shadow-[0_0_20px_rgba(173,255,0,0.5)]">Recommended</div>
                    </div>
                    <div className="flex items-baseline gap-2 mb-4">
                      <div className="text-7xl font-black text-white">$4.99</div>
                      <div className="text-primary/60 font-bold text-xl">/ one-time</div>
                    </div>
                    <p className="text-primary/70 text-lg mb-10 leading-relaxed font-medium">Power through hundreds of complex generation layers easily.</p>
                    
                    <ul className="space-y-5 mb-12">
                       {[
                         "5,000 Premium Generation Tokens",
                         "Priority AI Execution Pipeline",
                         "Advanced Developer Formats",
                         "Persistent Project History",
                         "Premium Support Team"
                       ].map((item, i) => (
                         <li key={i} className="flex items-center gap-4 text-white font-medium text-lg">
                           <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center flex-shrink-0 shadow-[0_0_10px_rgba(173,255,0,0.5)]">
                             <CheckCircle2 size={14} className="text-black" strokeWidth={3} />
                           </div>
                           {item}
                         </li>
                       ))}
                    </ul>
                  </div>
                  <Link to="/login" className="relative z-10 block w-full py-5 text-center rounded-full bg-primary text-black font-black text-lg hover:shadow-[0_0_40px_rgba(173,255,0,0.6)] hover:scale-[1.02] transition-all duration-300">Purchase Tokens</Link>
               </motion.div>
            </div>
         </div>
      </section>

      {/* Ultra Modern Footer */}
      <footer className="relative py-24 px-6 overflow-hidden z-10 border-t border-white/5 bg-[#030303]">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,_var(--tw-gradient-stops))] from-primary/5 via-[#030303] to-[#030303] opacity-60"></div>
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="flex flex-col lg:flex-row justify-between items-start gap-16 mb-24">
            <div className="max-w-sm">
              <Link to="/" className="flex flex-col items-start gap-3 mb-8 group">
                 <img src="/logo.png" alt="PromptWorld Logo" className="h-20 w-20 rounded-full object-cover group-hover:scale-105 transition-transform duration-500 drop-shadow-[0_0_20px_rgba(173,255,0,0.2)]" />
              </Link>
              <p className="text-white/40 leading-relaxed font-medium text-lg">
                The definitive blueprinting architecture for AI-assisted frontend development. Stop prompting manually.
              </p>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-3 gap-12 w-full lg:w-auto">
              <div>
                <h4 className="font-bold mb-6 text-white tracking-wide uppercase text-sm">Product</h4>
                <ul className="space-y-4 text-white/50 font-medium">
                   <li><Link to="/login" className="hover:text-primary transition-colors">Start Generating</Link></li>
                   <li><a href="#features" className="hover:text-primary transition-colors">Features</a></li>
                   <li><a href="#pricing" className="hover:text-primary transition-colors">Pricing</a></li>
                </ul>
              </div>
              <div>
                <h4 className="font-bold mb-6 text-white tracking-wide uppercase text-sm">Company</h4>
                <ul className="space-y-4 text-white/50 font-medium">
                   <li><a href="#" className="hover:text-primary transition-colors">About</a></li>
                   <li><a href="#" className="hover:text-primary transition-colors">Privacy Policy</a></li>
                   <li><a href="#" className="hover:text-primary transition-colors">Terms of Service</a></li>
                </ul>
              </div>
              <div className="col-span-2 md:col-span-1">
                <h4 className="font-bold mb-6 text-white tracking-wide uppercase text-sm">Socials</h4>
                <div className="flex gap-4">
                  <a href="#" className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/60 hover:bg-primary hover:text-black hover:border-primary transition-all duration-300">
                    <MessageCircle size={20} />
                  </a>
                  <a href="#" className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/60 hover:bg-primary hover:text-black hover:border-primary transition-all duration-300">
                    <Globe size={20} />
                  </a>
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex flex-col md:flex-row justify-between items-center gap-6 pt-10 border-t border-white/10">
            <div className="text-white/30 font-medium">
               © 2026 PromptWorld SaaS. Engineered with precision by <a href="https://praxire.com" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline transition-all">Praxire</a>.
            </div>
            <div className="flex gap-4 items-center">
               <div className="px-4 py-2 rounded-full bg-white/5 border border-white/10 flex items-center gap-2">
                 <div className="w-2.5 h-2.5 bg-primary rounded-full animate-pulse shadow-[0_0_10px_rgba(173,255,0,0.8)]"></div>
                 <span className="text-white/60 font-bold text-xs uppercase tracking-widest">All Systems Operational</span>
               </div>
            </div>
          </div>
        </div>
      </footer>
      
      <style dangerouslySetInnerHTML={{__html: `
        .perspective-1000 { perspective: 1000px; }
        .transform-style-3d { transform-style: preserve-3d; }
        @keyframes shimmer {
          100% { transform: translateX(100%); }
        }
        .animate-shimmer {
          animation: shimmer 2s infinite;
        }
        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        .animate-blob {
          animation: blob infinite alternate ease-in-out;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
      `}} />
    </div>
  );
};

export default HomePage;

