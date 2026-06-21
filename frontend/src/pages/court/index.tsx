import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from '../../components/Layout';
import CourtDashboard from './CourtDashboard';

const menuItems = [
  { label: '工作台', path: '/court', icon: '🏠' },
  { label: '标的管理', path: '/court/auctions', icon: '📋' },
  { label: '发布标的', path: '/court/publish', icon: '➕' },
  { label: '统计报表', path: '/court/statistics', icon: '📊' },
];

export default function CourtModule() {
  return (
    <Layout role="court" menuItems={menuItems}>
      <Routes>
        <Route index element={<CourtDashboard />} />
        <Route path="auctions" element={<CourtDashboard />} />
        <Route path="publish" element={<CourtDashboard />} />
        <Route path="statistics" element={<CourtDashboard />} />
        <Route path="*" element={<Navigate to="/court" replace />} />
      </Routes>
    </Layout>
  );
}
