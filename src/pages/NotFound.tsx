import { useNavigate } from 'react-router-dom';
import { Home } from 'lucide-react';
import Button from '../components/UI/Button';

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center">
      <h1 className="text-9xl font-bold text-primary-500">404</h1>
      <p className="text-2xl text-white mt-4 mb-8">Página não encontrada</p>
      <Button
        variant="primary"
        onClick={() => navigate('/dashboard')}
        className="flex items-center gap-2"
      >
        <Home size={18} />
        <span>Voltar para o Dashboard</span>
      </Button>
    </div>
  );
};

export default NotFound;