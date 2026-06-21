import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from '../../components/Layout';
import EvictionDashboard from './EvictionDashboard';

const menuItems = [
  { label: '工作台', path: '/eviction', icon: '🏠' },
  { label: '待处理', path: '/eviction/pending', icon: '📋' },
  { label: '进行中', path: '/eviction/in-progress', icon: '⏳' },
  { label: '已完成', path: '/eviction/completed', icon: '✅' },
  { label: '钥匙管理', path: '/eviction/keys', icon: '🔑' },
];

export default function EvictionModule() {
  return (
    <Layout role="eviction_staff" menuItems={menuItems}>
      <Routes>
        <Route index element={<EvictionDashboard />} />
        <Route path="pending" element={<EvictionDashboard />} />
        <Route path="in-progress" element={<EvictionDashboard />} />
        <Route path="completed" element={<EvictionDashboard />} />
        <Route path="keys" element={<EvictionDashboard />} />
        <Route path="*" element={<Navigate to="/eviction" replace />} />
      </Routes>
    </Layout>
  );
}
