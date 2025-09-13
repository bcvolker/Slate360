// SettingsDashboard stub
'use client';
import { motion } from 'framer-motion';
export default function SettingsDashboard() {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }} className="space-y-4">
      <h2 className="text-2xl font-bold text-[#2F4F4F]">Settings</h2>
      <p className="text-gray-700">Update your preferences and account details.</p>
    </motion.div>
  );
}
