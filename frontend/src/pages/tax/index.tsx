import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from '../../components/Layout';
import TaxDashboard from './TaxDashboard';

const menuItems = [
  { label: '工作台', path: '/tax', icon: '🏠' },
  { label: '待测算', path: '/tax/pending', icon: '🧮' },
  { label: '已完成', path: '/tax/completed', icon: '✅' },
  { label: '税费统计', path: '/tax/statistics', icon: '📊' },
];

export default function TaxModule() {
  return (
    <Layout role="tax" menuItems={menuItems}>
      <Routes>
        <Route index element={<TaxDashboard />} />
        <Route path="pending" element={<TaxDashboard />} />
        <Route path="completed" element={<TaxDashboard />} />
        <Route path="statistics" element={<TaxDashboard />} />
        <Route path="*" element={<Navigate to="/tax" replace />} />
      </Routes>
    </Layout>
  );
}
