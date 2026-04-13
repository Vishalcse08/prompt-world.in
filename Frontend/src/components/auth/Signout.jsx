import React from 'react';
import { supabase } from '../../Supabase';
import { LogOut } from 'lucide-react';

const Signout = () => {
  const handleSignout = async () => {
    await supabase.auth.signOut();
    window.location.href = '/';
  };

  return (
    <button
      onClick={handleSignout}
      className="flex items-center gap-2 text-foreground/60 hover:text-foreground transition-colors duration-200"
    >
      <LogOut size={18} />
      <span>Sign Out</span>
    </button>
  );
};

export default Signout;
