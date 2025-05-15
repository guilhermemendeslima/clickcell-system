import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Smartphone, Mail, Lock, AlertTriangle } from 'lucide-react';
import { motion } from 'framer-motion';
import Button from '../components/UI/Button';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showLoginHint, setShowLoginHint] = useState(false);
  const { login, isLoading } = useAuth();
  const navigate = useNavigate();
  
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!email || !password) {
      setError('Por favor, preencha todos os campos.');
      return;
    }
    
    const success = await login(email, password);
    
    if (success) {
      navigate('/dashboard');
    } else {
      setError('Email ou senha inválidos.');
    }
  };
  
  const showHint = () => {
    setShowLoginHint(true);
    setEmail('admin@clickcelulares.com');
    setPassword('123456');
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-dark-900 px-4 sm:px-6 lg:px-8">
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(61,90,254,0.15),transparent_50%)]"></div>
        <div className="absolute left-0 right-0 top-0 -z-10 m-auto h-[60vh] w-[60vh] rounded-full bg-primary-500 opacity-5 blur-[100px]"></div>
      </div>
      
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <Smartphone className="text-primary-500 h-12 w-12" />
          </div>
          <h1 className="text-4xl font-bold text-white mb-2">Click<span className="text-primary-500">Celulares</span></h1>
          <p className="text-gray-400">Sistema de Gestão de Estoque - Click Celulares</p>
        </div>
        
        <div className="bg-dark-800 shadow-xl rounded-2xl overflow-hidden border border-dark-700">
          <div className="px-6 py-8">
            <h2 className="text-2xl font-bold text-white mb-6 text-center">Login</h2>
            
            {error && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="mb-4 p-3 bg-error-dark/30 border border-error-dark text-error-light rounded-lg flex items-center gap-2"
              >
                <AlertTriangle size={18} />
                <span>{error}</span>
              </motion.div>
            )}
            
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1">Email</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail size={18} className="text-dark-300" />
                  </div>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="input pl-10"
                    placeholder="seu@email.com"
                  />
                </div>
              </div>
              
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-1">Senha</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock size={18} className="text-dark-300" />
                  </div>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="input pl-10"
                    placeholder="••••••"
                  />
                </div>
              </div>
              
              <div>
                <Button
                  type="submit"
                  variant="primary"
                  fullWidth
                  size="lg"
                  isLoading={isLoading}
                  className="mt-2"
                >
                  Entrar
                </Button>
              </div>
            </form>
            
            {showLoginHint ? (
              <div className="mt-4 text-sm text-gray-400 bg-dark-700 p-3 rounded-lg">
                <p className="font-medium mb-1">Dados de acesso (demonstração):</p>
                <p>Email: <span className="text-primary-400">admin@clickcelulares.com</span></p>
                <p>Senha: <span className="text-primary-400">123456</span></p>
              </div>
            ) : (
              <div className="mt-4 text-center">
                <button
                  onClick={showHint}
                  className="text-sm text-primary-400 hover:text-primary-300"
                >
                  Ver dados de acesso para demonstração
                </button>
              </div>
            )}
          </div>
          
          <div className="px-6 py-4 bg-dark-900 border-t border-dark-700 text-center">
            <p className="text-sm text-gray-500">
              &copy; 2025 Click Celulares. Todos os direitos reservados.
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;