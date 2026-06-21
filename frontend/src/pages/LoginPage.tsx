import { useNavigate } from 'react-router-dom';
import { useUserStore } from '../store/userStore';
import { roleMap } from '../utils';
import { UserRole } from '../types';

export default function LoginPage() {
  const navigate = useNavigate();
  const { setRole } = useUserStore();

  const handleRoleSelect = (role: UserRole) => {
    const userNames: Record<UserRole, string> = {
      [UserRole.COURT]: '张明法官',
      [UserRole.BIDDER]: '王建国',
      [UserRole.EVALUATION]: '李评估师',
      [UserRole.PROPERTY]: '王物业',
      [UserRole.BANK]: '赵经理',
      [UserRole.TAX]: '刘税务',
      [UserRole.EVICTION_STAFF]: '陈协助',
    };
    const userId = `${role}-001`;
    setRole(role, userId, userNames[role]);
    
    const paths: Record<UserRole, string> = {
      [UserRole.COURT]: '/court',
      [UserRole.BIDDER]: '/bidder',
      [UserRole.EVALUATION]: '/evaluation',
      [UserRole.PROPERTY]: '/property',
      [UserRole.BANK]: '/bank',
      [UserRole.TAX]: '/tax',
      [UserRole.EVICTION_STAFF]: '/eviction',
    };
    navigate(paths[role]);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex flex-col">
      <header className="py-6 px-8">
        <h1 className="text-2xl font-bold text-gray-800">⚖️ 司法拍卖房产腾退与交割平台</h1>
        <p className="text-gray-500 mt-1">全流程透明化管理，保障竞买人权益</p>
      </header>

      <main className="flex-1 flex items-center justify-center p-8">
        <div className="max-w-5xl w-full">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-gray-800 mb-3">选择您的身份</h2>
            <p className="text-gray-500">请选择您的角色进入对应工作台</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {Object.entries(roleMap).map(([key, info]) => (
              <button
                key={key}
                onClick={() => handleRoleSelect(key as UserRole)}
                className="group p-6 bg-white rounded-xl border border-gray-200 hover:border-blue-300 hover:shadow-lg transition-all duration-200 text-left"
              >
                <div className="text-4xl mb-4">{info.icon}</div>
                <h3 className="text-lg font-semibold text-gray-800 group-hover:text-blue-600 transition-colors">
                  {info.label}
                </h3>
                <p className="text-sm text-gray-500 mt-2">{info.description}</p>
                <div className="mt-4 text-blue-600 text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                  进入工作台 →
                </div>
              </button>
            ))}
          </div>
        </div>
      </main>

      <footer className="py-6 px-8 text-center text-sm text-gray-400">
        司法拍卖房产腾退与交割平台 · 全流程透明化管理
      </footer>
    </div>
  );
}
