import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Users, Package, ShoppingCart, Clipboard, UserCog, Smartphone } from 'lucide-react';
import { User } from '../../contexts/AuthContext';

interface SidebarProps {
  user: User | null;
}

const Sidebar = ({ user }: SidebarProps) => {
  return (
    <div className="h-full flex flex-col">
      <div className="p-4 border-b border-dark-700">
        <div className="flex items-center justify-center gap-2 py-3">
          <Smartphone className="text-primary-500" size={24} />
          <div>
            <div className="text-primary-500 font-bold text-xl leading-none">Click</div>
            <div className="text-white font-bold text-sm leading-none">Celulares</div>
          </div>
        </div>
      </div>
      
      <nav className="flex-1 overflow-y-auto py-4 px-2">
        <ul className="space-y-1">
          <li>
            <NavLink 
              to="/dashboard" 
              className={({ isActive }) => 
                `sidebar-link ${isActive ? 'active' : ''}`
              }
            >
              <LayoutDashboard size={20} />
              <span>Dashboard</span>
            </NavLink>
          </li>
          <li>
            <NavLink 
              to="/customers" 
              className={({ isActive }) => 
                `sidebar-link ${isActive ? 'active' : ''}`
              }
            >
              <Users size={20} />
              <span>Clientes</span>
            </NavLink>
          </li>
          <li>
            <NavLink 
              to="/inventory" 
              className={({ isActive }) => 
                `sidebar-link ${isActive ? 'active' : ''}`
              }
            >
              <Package size={20} />
              <span>Estoque</span>
            </NavLink>
          </li>
          <li>
            <NavLink 
              to="/sales" 
              className={({ isActive }) => 
                `sidebar-link ${isActive ? 'active' : ''}`
              }
            >
              <ShoppingCart size={20} />
              <span>Vendas</span>
            </NavLink>
          </li>
          <li>
            <NavLink 
              to="/service-orders" 
              className={({ isActive }) => 
                `sidebar-link ${isActive ? 'active' : ''}`
              }
            >
              <Clipboard size={20} />
              <span>Ordens de Serviço</span>
            </NavLink>
          </li>
          
          {/* Only show employees section for admin */}
          {user?.role === 'admin' && (
            <li>
              <NavLink 
                to="/employees" 
                className={({ isActive }) => 
                  `sidebar-link ${isActive ? 'active' : ''}`
                }
              >
                <UserCog size={20} />
                <span>Funcionários</span>
              </NavLink>
            </li>
          )}
        </ul>
      </nav>
      
      <div className="p-4 border-t border-dark-700">
        <div className="text-center text-xs text-gray-500">
          Click Celulares v1.0.0
        </div>
      </div>
    </div>
  );
};

export default Sidebar;