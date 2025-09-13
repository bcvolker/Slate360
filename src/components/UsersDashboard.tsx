// UsersDashboard stub
'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';
interface User { id: string; name: string; role: string; }
export default function UsersDashboard() {
  const [users, setUsers] = useState<User[]>([
    { id: '1', name: 'Jane Doe', role: 'user' },
    { id: '2', name: 'John Smith', role: 'leader' },
  ]);
  const handleRoleChange = (id: string, role: string) => {
    setUsers(users.map(u => (u.id === id ? { ...u, role } : u)));
  };
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }} className="space-y-6">
      <h2 className="text-2xl font-bold text-[#2F4F4F]">Users</h2>
      <table className="w-full bg-white shadow-md rounded-lg">
        <thead className="bg-gray-200">
          <tr>
            <th className="p-3 text-left">Name</th>
            <th className="p-3 text-left">Role</th>
          </tr>
        </thead>
        <tbody>
          {users.map(user => (
            <tr key={user.id} className="border-b">
              <td className="p-3">{user.name}</td>
              <td className="p-3">
                <select value={user.role} onChange={(e) => handleRoleChange(user.id, e.target.value)} className="border rounded px-2 py-1">
                  <option value="user">User</option>
                  <option value="leader">Leader</option>
                  <option value="admin">Admin</option>
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </motion.div>
  );
}
