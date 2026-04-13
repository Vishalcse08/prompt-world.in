import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Users, Coins, Search, ShieldCheck, Clock } from 'lucide-react';

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get('http://localhost:5000/api/admin/users', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUsers(res.data);
    } catch (err) {
      console.error('Failed to fetch users:', err);
    } finally {
      setLoading(false);
    }
  };

  const updateCredits = async (userId, newCredits) => {
    try {
      const token = localStorage.getItem('token');
      await axios.post('http://localhost:5000/api/admin/update-credits', {
        userId,
        credits: parseInt(newCredits)
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchUsers();
    } catch (err) {
      alert('Failed to update credits');
    }
  };

  const filteredUsers = users.filter(u => u.email.toLowerCase().includes(search.toLowerCase()));

  if (loading) return <div className="p-8">Loading users...</div>;

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <ShieldCheck className="text-primary" size={32} />
            Admin Control Panel
          </h1>
          <p className="text-foreground/60 mt-1">Manage users, credits, and platform activity.</p>
        </div>

        <div className="relative w-full md:w-96">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-foreground/40" size={18} />
          <input
            type="text"
            placeholder="Search users by email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <div className="glass p-6 rounded-2xl border border-white/10">
          <div className="flex items-center gap-4 text-foreground/60 mb-2">
            <Users size={20} />
            <span className="text-sm font-medium">Total Users</span>
          </div>
          <div className="text-4xl font-bold">{users.length}</div>
        </div>
        <div className="glass p-6 rounded-2xl border border-white/10">
          <div className="flex items-center gap-4 text-foreground/60 mb-2">
            <Coins size={20} />
            <span className="text-sm font-medium">Platform Credits</span>
          </div>
          <div className="text-4xl font-bold">
            {users.reduce((acc, curr) => acc + curr.credits, 0).toLocaleString()}
          </div>
        </div>
        <div className="glass p-6 rounded-2xl border border-white/10">
          <div className="flex items-center gap-4 text-foreground/60 mb-2">
            <ShieldCheck size={20} />
            <span className="text-sm font-medium">Active Admins</span>
          </div>
          <div className="text-4xl font-bold">{users.filter(u => u.is_admin).length}</div>
        </div>
      </div>

      <div className="glass rounded-3xl border border-white/10 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-white/5 border-b border-white/10">
                <th className="px-6 py-4 text-sm font-medium text-foreground/60">User Identity</th>
                <th className="px-6 py-4 text-sm font-medium text-foreground/60">Token Balance</th>
                <th className="px-6 py-4 text-sm font-medium text-foreground/60">Joined Date</th>
                <th className="px-6 py-4 text-sm font-medium text-foreground/60">Role</th>
                <th className="px-6 py-4 text-sm font-medium text-foreground/60 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredUsers.map((u) => (
                <tr key={u.id} className="hover:bg-white/5 transition-colors">
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                        {u.email[0].toUpperCase()}
                      </div>
                      <span className="font-medium">{u.email}</span>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        defaultValue={u.credits}
                        onBlur={(e) => updateCredits(u.id, e.target.value)}
                        className="bg-transparent border border-white/10 rounded px-2 py-1 w-24 text-sm focus:border-primary focus:outline-none"
                      />
                    </div>
                  </td>
                  <td className="px-6 py-5 text-foreground/60 text-sm">
                    <div className="flex items-center gap-2">
                      <Clock size={14} />
                      {new Date(u.created_at).toLocaleDateString()}
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    {u.is_admin ? (
                      <span className="bg-primary/20 text-primary px-3 py-1 rounded-full text-xs font-bold ring-1 ring-primary/50">Admin</span>
                    ) : (
                      <span className="bg-white/10 text-foreground/60 px-3 py-1 rounded-full text-xs font-medium">User</span>
                    )}
                  </td>
                  <td className="px-6 py-5 text-right">
                    <button className="text-primary hover:text-primary/80 text-sm font-medium">View Projects</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
