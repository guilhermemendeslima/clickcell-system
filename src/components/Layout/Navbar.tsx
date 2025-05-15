import { useState, useRef, useEffect } from 'react';
import { Menu, Bell, LogOut, Settings } from 'lucide-react';
import { useAuth, User } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

interface NavbarProps {
  onMenuClick: () => void;
  user: User | null;
}

const Navbar = ({ onMenuClick, user }: NavbarProps) => {
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const notificationRef = useRef<HTMLDivElement>(null);
  const { logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setShowUserMenu(false);
      }
      if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="sticky top-0 z-30 bg-dark-900/80 backdrop-blur-lg border-b border-dark-700 shadow-md">
      <div className="px-4 h-16 flex items-center justify-between">
        <div className="flex items-center">
          <button
            onClick={onMenuClick}
            className="p-2 mr-4 rounded-lg text-gray-400 hover:text-white hover:bg-dark-700 md:hidden"
          >
            <Menu size={24} />
          </button>
          <div className="flex items-center">
            <div className="text-primary-500 font-bold text-xl">Click</div>
            <div className="text-white font-bold text-xl">Celulares</div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Notifications */}
          <div className="relative" ref={notificationRef}>
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-dark-700 relative"
            >
              <Bell size={20} />
              <span className="absolute top-1 right-1 w-2 h-2 bg-primary-500 rounded-full"></span>
            </button>
            
            <AnimatePresence>
              {showNotifications && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  transition={{ duration: 0.2 }}
                  className="absolute right-0 mt-2 w-72 rounded-lg shadow-lg glass z-10"
                >
                  <div className="p-3 border-b border-dark-700">
                    <h3 className="font-semibold">Notificações</h3>
                  </div>
                  <div className="overflow-y-auto max-h-96">
                    <div className="py-2 px-3 border-b border-dark-700 hover:bg-dark-700/50">
                      <p className="text-sm font-medium">Estoque baixo: iPhone 13</p>
                      <p className="text-xs text-gray-400">Hoje, 10:30</p>
                    </div>
                    <div className="py-2 px-3 border-b border-dark-700 hover:bg-dark-700/50">
                      <p className="text-sm font-medium">Nova OS registrada</p>
                      <p className="text-xs text-gray-400">Ontem, 14:45</p>
                    </div>
                    <div className="py-2 px-3 hover:bg-dark-700/50">
                      <p className="text-sm font-medium">Venda concluída</p>
                      <p className="text-xs text-gray-400">2 dias atrás</p>
                    </div>
                  </div>
                  <div className="p-2 border-t border-dark-700">
                    <button className="w-full text-center text-xs text-primary-500 hover:text-primary-400 py-1">
                      Ver todas as notificações
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          
          {/* User Menu */}
          <div className="relative" ref={userMenuRef}>
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center gap-2 p-1 rounded-lg hover:bg-dark-700"
            >
              <div className="w-8 h-8 rounded-full bg-primary-500 flex items-center justify-center overflow-hidden">
                {user?.avatar ? (
                  <img src={user.avatar} alt={user?.name} className="w-full h-full object-cover" />
                ) : (
                  <span className="font-medium text-white">{user?.name?.charAt(0)}</span>
                )}
              </div>
              <span className="hidden md:block text-sm font-medium">{user?.name}</span>
            </button>
            
            <AnimatePresence>
              {showUserMenu && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  transition={{ duration: 0.2 }}
                  className="absolute right-0 mt-2 w-56 rounded-lg shadow-lg glass z-10"
                >
                  <div className="p-3 border-b border-dark-700">
                    <p className="font-medium">{user?.name}</p>
                    <p className="text-xs text-gray-400">{user?.email}</p>
                    <div className="mt-1">
                      <span className="text-xs bg-primary-500/20 text-primary-400 px-2 py-0.5 rounded-full">
                        {user?.role === 'admin' ? 'Administrador' : 
                         user?.role === 'technician' ? 'Técnico' : 'Vendedor'}
                      </span>
                    </div>
                  </div>
                  <div className="py-1">
                    <button className="flex items-center gap-2 w-full text-left px-4 py-2 text-sm hover:bg-dark-700">
                      <Settings size={16} />
                      <span>Configurações</span>
                    </button>
                    <button 
                      onClick={handleLogout}
                      className="flex items-center gap-2 w-full text-left px-4 py-2 text-sm text-error-light hover:bg-dark-700"
                    >
                      <LogOut size={16} />
                      <span>Sair</span>
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;