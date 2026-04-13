import React from 'react';
import { useUser } from '../../UserContext';

const Userprofile = ({ collapsed }) => {
  const { user } = useUser();

  if (!user) return null;

  return (
    <div className={`flex items-center gap-3 p-2 rounded-xl bg-foreground/5 border border-foreground/5 transition-all duration-300 ${collapsed ? 'justify-center' : ''}`}>
      <img
        src={user.user_metadata.avatar_url || `https://ui-avatars.com/api/?name=${user.email}`}
        alt="Avatar"
        className="w-10 h-10 rounded-full border border-primary/20"
      />
      {!collapsed && (
        <div className="flex flex-col overflow-hidden">
          <span className="text-sm font-semibold truncate">{user.user_metadata.full_name || 'User'}</span>
          <span className="text-[10px] text-foreground/50 truncate">{user.email}</span>
        </div>
      )}
    </div>
  );
};

export default Userprofile;
