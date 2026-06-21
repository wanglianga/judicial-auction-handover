import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from '../../components/Layout';
import PropertyDashboard from './PropertyDashboard';

const menuItems = [
  { label: '工作台', path: '/property', icon: '🏠' },
  { label: '待录入', path: '/property/pending', icon: '📋' },
  { label: '已录入', path: '/property/completed', icon: '✅' },
  { label: '欠费统计', path: '/property/statistics', icon: '💰' },
];

export default function PropertyModule() {
  return (
    <Layout role="property" menuItems={menuItems}>
      <Routes>
        <Route index element={<PropertyDashboard />} />
        <Route path="pending" element={<PropertyDashboard />} />
        <Route path="completed" element={<PropertyDashboard />} />
        <Route path="statistics" element={<PropertyDashboard />} />
        <Route path="*" element={<Navigate to="/property" replace />} />
      </Routes>
    </Layout>
  );
}
