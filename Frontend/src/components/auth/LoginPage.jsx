import React from 'react';
import { supabase } from '../../Supabase';
import { LogIn } from 'lucide-react';

const LoginPage = () => {
  const handleGoogleLogin = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: window.location.origin + '/dashboard'
      }
    });
    if (error) console.error('Error logging in:', error.message);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background relative overflow-hidden">
      {/* Background Blobs */}
      <div className="absolute top-1/4 -left-20 w-72 h-72 bg-primary/20 rounded-full blur-3xl animate-blob"></div>
      <div className="absolute bottom-1/4 -right-20 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl animate-blob animation-delay-2000"></div>

      <div className="relative z-10 w-full max-w-md p-8">
        <div className="glass rounded-3xl p-8 border-foreground/5 shadow-2xl">
          <div className="text-center mb-10">
            <h1 className="text-4xl font-bold mb-3 tracking-tight">
              Prompt<span className="text-primary">World</span>
            </h1>
            <p className="text-foreground/60 text-sm">Sign in to start generating production-ready AI prompts.</p>
          </div>

          <button
            onClick={handleGoogleLogin}
            className="w-full flex items-center justify-center gap-3 bg-white text-black hover:bg-zinc-200 py-4 rounded-xl font-semibold transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98]"
          >
            <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" className="w-5 h-5" />
            Continue with Google
          </button>

          <p className="mt-8 text-center text-xs text-foreground/50">
            By continuing, you agree to our Terms of Service and Privacy Policy.
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
