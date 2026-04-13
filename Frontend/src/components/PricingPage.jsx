import React, { useState } from 'react';
import { useUser } from '../UserContext';
import { Zap, ShieldCheck, Check, Info, AlertCircle, ShoppingCart } from 'lucide-react';

const PricingCard = ({ title, tokens, price, description, highlight, onBuy, loading }) => (
  <div className={`glass p-8 rounded-[2rem] border-foreground/5 relative flex flex-col h-full bg-gradient-to-b ${highlight ? 'from-primary/10 to-transparent border-primary/20 shadow-[0_20px_50px_rgba(173,255,0,0.1)]' : 'from-white/2 to-transparent'}`}>
    {highlight && (
      <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-primary text-black px-4 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
        Most Popular
      </div>
    )}
    
    <div className="mb-8">
      <h3 className="text-xl font-bold mb-2">{title}</h3>
      <div className="flex items-baseline gap-1">
        <span className="text-5xl font-bold tracking-tighter">${price}</span>
        <span className="text-foreground/50 font-medium">/ pack</span>
      </div>
    </div>

    <div className="flex items-center gap-2 mb-8 p-3 bg-foreground/5 rounded-2xl border border-foreground/5">
        <div className="w-10 h-10 bg-primary/20 rounded-xl flex items-center justify-center">
            <Zap size={20} className="text-primary fill-current" />
        </div>
        <div>
            <div className="text-2xl font-bold">+{tokens.toLocaleString()}</div>
            <div className="text-[10px] text-foreground/50 uppercase font-bold tracking-widest">Tokens Included</div>
        </div>
    </div>

    <ul className="space-y-4 mb-10 flex-1">
      {[description, 'Priority Generation', 'Lifetime Validity', 'JSON/YAML Support'].map((desc, i) => (
        <li key={i} className="flex items-center gap-3 text-sm text-foreground/60">
          <Check size={16} className="text-primary flex-shrink-0" />
          {desc}
        </li>
      ))}
    </ul>

    <button 
      onClick={() => onBuy(tokens)}
      disabled={loading}
      className={`w-full py-4 rounded-xl font-bold flex items-center justify-center gap-3 transition-all ${highlight ? 'bg-primary text-black hover:scale-[1.02]' : 'bg-foreground/5 text-foreground hover:bg-foreground/10'} active:scale-95`}
    >
      {loading ? (
        <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
      ) : (
        <>
          <ShoppingCart size={18} />
          {highlight ? 'Buy Now' : 'Get Tokens'}
        </>
      )}
    </button>
  </div>
);

const PricingPage = () => {
  const { credits, setCredits } = useUser();
  const [loading, setLoading] = useState(null);

  const handleBuyTokens = async (amount) => {
    setLoading(amount);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/buy-tokens`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ amount })
      });
      const data = await response.json();
      setCredits(data.credits);
      // In a real app, this would redirect to Stripe
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="space-y-12 max-w-5xl mx-auto">
      <div className="text-center space-y-4 px-4 overflow-hidden">
        <h1 className="text-3xl md:text-5xl font-bold tracking-tight">Fuel Your <span className="text-gradient">Creation</span></h1>
        <p className="text-foreground/60 text-sm md:text-lg max-w-2xl mx-auto">One-time token packs. No subscriptions. Pay only for what you generate.</p>
      </div>

      {credits < 500 && (
          <div className="bg-red-500/10 border border-red-500/20 p-6 rounded-[2rem] flex flex-col md:flex-row items-center gap-6 justify-between">
              <div className="flex items-center gap-4 text-center md:text-left">
                  <div className="w-12 h-12 bg-red-500/20 rounded-2xl flex items-center justify-center flex-shrink-0 animate-pulse">
                      <AlertCircle className="text-red-400" size={24} />
                  </div>
                  <div>
                      <h4 className="font-bold text-red-100">Low Token Balance</h4>
                      <p className="text-sm text-red-400 opacity-80">You need at least 500 tokens to generate a new prompt. Your current balance is {credits}.</p>
                  </div>
              </div>
          </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <PricingCard 
          title="Creator Pack" 
          tokens={5000} 
          price={4.99} 
          description="10 high-fidelity generations"
          onBuy={handleBuyTokens}
          loading={loading === 5000}
        />
        <PricingCard 
          title="Pro Pack" 
          tokens={25000} 
          price={19.99} 
          description="50 high-fidelity generations"
          highlight
          onBuy={handleBuyTokens}
          loading={loading === 25000}
        />
      </div>

      <div className="glass p-10 rounded-[3rem] border-foreground/5 text-center bg-gradient-to-r from-transparent via-white/2 to-transparent">
          <div className="flex justify-center mb-6">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center text-primary">
                  <ShieldCheck size={32} />
              </div>
          </div>
          <h3 className="text-2xl font-bold mb-2">Secure Payments & Instant Access</h3>
          <p className="text-foreground/60 max-w-xl mx-auto text-sm leading-relaxed mb-8">
              All transactions are processed securely via Stripe. Tokens are credited to your account instantly upon successful payment. Unused tokens never expire.
          </p>
          <div className="flex justify-center items-center gap-8 text-zinc-600 grayscale opacity-50">
              <span className="font-bold tracking-widest text-lg italic">STRIPE</span>
              <span className="font-bold tracking-widest text-lg italic">VISA</span>
              <span className="font-bold tracking-widest text-lg italic">MASTERCARD</span>
          </div>
      </div>
    </div>
  );
};

export default PricingPage;
