import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from '../../components/Layout';
import EvaluationDashboard from './EvaluationDashboard';

const menuItems = [
  { label: '工作台', path: '/evaluation', icon: '🏠' },
  { label: '待评估', path: '/evaluation/pending', icon: '📋' },
  { label: '已完成', path: '/evaluation/completed', icon: '✅' },
  { label: '报告管理', path: '/evaluation/reports', icon: '📊' },
];

export default function EvaluationModule() {
  return (
    <Layout role="evaluation" menuItems={menuItems}>
      <Routes>
        <Route index element={<EvaluationDashboard />} />
        <Route path="pending" element={<EvaluationDashboard />} />
        <Route path="completed" element={<EvaluationDashboard />} />
        <Route path="reports" element={<EvaluationDashboard />} />
        <Route path="*" element={<Navigate to="/evaluation" replace />} />
      </Routes>
    </Layout>
  );
}
