import { useState, useEffect } from 'react';
import { Card, CardHeader, CardBody } from '../components/UI/Card';
import Badge from '../components/UI/Badge';
import { DollarSign, Users, Package, Clipboard, TrendingUp, Calendar } from 'lucide-react';
import { mockSales } from '../data/sales';
import { mockProducts } from '../data/products';
import { mockServiceOrders } from '../data/serviceOrders';
import { mockCustomers } from '../data/customers';
import { motion } from 'framer-motion';

const Dashboard = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  
  // Update date every minute
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentDate(new Date());
    }, 60000);
    
    return () => clearInterval(interval);
  }, []);
  
  // Calculate stats
  const totalSales = mockSales.reduce((sum, sale) => sum + sale.total, 0);
  const totalProducts = mockProducts.reduce((sum, product) => sum + product.quantity, 0);
  const lowStockProducts = mockProducts.filter(product => product.quantity <= product.lowStockThreshold);
  const pendingOrders = mockServiceOrders.filter(order => 
    ['pending', 'diagnosing', 'waiting_approval', 'in_progress'].includes(order.status)
  );
  
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };
  
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: 'spring', stiffness: 100 }
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white">Dashboard</h1>
          <p className="text-gray-400 mt-1">
            {currentDate.toLocaleDateString('pt-BR', { 
              weekday: 'long', 
              day: 'numeric', 
              month: 'long', 
              year: 'numeric' 
            })}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Calendar size={16} className="text-gray-400" />
          <span className="text-gray-400">
            {currentDate.toLocaleTimeString('pt-BR', { 
              hour: '2-digit', 
              minute: '2-digit'
            })}
          </span>
        </div>
      </div>
      
      {/* Stats Cards */}
      <motion.div 
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div variants={itemVariants}>
          <Card className="border-primary-600/20 hover:border-primary-600/40 transition-colors">
            <CardBody className="flex items-center gap-4">
              <div className="p-3 rounded-lg bg-primary-500/10">
                <DollarSign size={24} className="text-primary-500" />
              </div>
              <div>
                <p className="text-gray-400 text-sm">Vendas Totais</p>
                <p className="text-2xl font-bold text-white">
                  {totalSales.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                </p>
                <div className="flex items-center gap-1 mt-1">
                  <TrendingUp size={14} className="text-success-DEFAULT" />
                  <span className="text-xs text-success-DEFAULT">+5% este mês</span>
                </div>
              </div>
            </CardBody>
          </Card>
        </motion.div>
        
        <motion.div variants={itemVariants}>
          <Card className="border-primary-600/20 hover:border-primary-600/40 transition-colors">
            <CardBody className="flex items-center gap-4">
              <div className="p-3 rounded-lg bg-primary-500/10">
                <Users size={24} className="text-primary-500" />
              </div>
              <div>
                <p className="text-gray-400 text-sm">Clientes</p>
                <p className="text-2xl font-bold text-white">{mockCustomers.length}</p>
                <div className="flex items-center gap-1 mt-1">
                  <TrendingUp size={14} className="text-success-DEFAULT" />
                  <span className="text-xs text-success-DEFAULT">+2 novos hoje</span>
                </div>
              </div>
            </CardBody>
          </Card>
        </motion.div>
        
        <motion.div variants={itemVariants}>
          <Card className="border-primary-600/20 hover:border-primary-600/40 transition-colors">
            <CardBody className="flex items-center gap-4">
              <div className="p-3 rounded-lg bg-primary-500/10">
                <Package size={24} className="text-primary-500" />
              </div>
              <div>
                <p className="text-gray-400 text-sm">Produtos em Estoque</p>
                <p className="text-2xl font-bold text-white">{totalProducts}</p>
                <div className="flex items-center gap-1 mt-1">
                  {lowStockProducts.length > 0 ? (
                    <span className="text-xs text-warning-DEFAULT">
                      {lowStockProducts.length} produtos com estoque baixo
                    </span>
                  ) : (
                    <span className="text-xs text-success-DEFAULT">
                      Estoque saudável
                    </span>
                  )}
                </div>
              </div>
            </CardBody>
          </Card>
        </motion.div>
        
        <motion.div variants={itemVariants}>
          <Card className="border-primary-600/20 hover:border-primary-600/40 transition-colors">
            <CardBody className="flex items-center gap-4">
              <div className="p-3 rounded-lg bg-primary-500/10">
                <Clipboard size={24} className="text-primary-500" />
              </div>
              <div>
                <p className="text-gray-400 text-sm">Ordens de Serviço</p>
                <p className="text-2xl font-bold text-white">{pendingOrders.length}</p>
                <div className="flex items-center gap-1 mt-1">
                  <span className="text-xs text-primary-400">
                    {mockServiceOrders.filter(o => o.status === 'in_progress').length} em andamento
                  </span>
                </div>
              </div>
            </CardBody>
          </Card>
        </motion.div>
      </motion.div>
      
      {/* Tables Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div 
          variants={itemVariants}
          initial="hidden"
          animate="visible"
          transition={{ delay: 0.3 }}
        >
          <Card>
            <CardHeader className="flex justify-between items-center">
              <h2 className="text-lg font-semibold text-white">Vendas Recentes</h2>
            </CardHeader>
            <CardBody>
              <div className="table-container">
                <table className="table">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Cliente</th>
                      <th>Data</th>
                      <th className="text-right">Valor</th>
                    </tr>
                  </thead>
                  <tbody>
                    {mockSales.slice(0, 3).map(sale => (
                      <tr key={sale.id}>
                        <td className="text-xs">{sale.id}</td>
                        <td>{sale.customerName || 'Cliente não registrado'}</td>
                        <td>{new Date(sale.date).toLocaleDateString('pt-BR')}</td>
                        <td className="text-right font-medium">
                          {sale.total.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardBody>
          </Card>
        </motion.div>
        
        <motion.div 
          variants={itemVariants} 
          initial="hidden"
          animate="visible"
          transition={{ delay: 0.4 }}
        >
          <Card>
            <CardHeader className="flex justify-between items-center">
              <h2 className="text-lg font-semibold text-white">Ordens de Serviço Ativas</h2>
              <Badge variant="primary">
                {pendingOrders.length} pendentes
              </Badge>
            </CardHeader>
            <CardBody>
              <div className="table-container">
                <table className="table">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Cliente</th>
                      <th>Dispositivo</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pendingOrders.slice(0, 5).map(order => (
                      <tr key={order.id}>
                        <td className="text-xs">{order.id}</td>
                        <td>{order.customerName}</td>
                        <td>{order.deviceModel}</td>
                        <td>
                          <Badge
                            variant={
                              order.status === 'pending' || order.status === 'waiting_approval' 
                                ? 'warning' 
                                : order.status === 'in_progress' || order.status === 'diagnosing'
                                ? 'primary'
                                : 'success'
                            }
                          >
                            {order.status === 'pending' ? 'Pendente' :
                             order.status === 'diagnosing' ? 'Diagnóstico' :
                             order.status === 'waiting_approval' ? 'Aguard. Aprovação' :
                             order.status === 'in_progress' ? 'Em Andamento' :
                             order.status === 'completed' ? 'Concluído' :
                             order.status === 'delivered' ? 'Entregue' : 'Cancelado'}
                          </Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardBody>
          </Card>
          
          <Card className="mt-6">
            <CardHeader className="flex justify-between items-center">
              <h2 className="text-lg font-semibold text-white">Produtos com Estoque Baixo</h2>
              <Badge variant={lowStockProducts.length > 0 ? 'warning' : 'success'}>
                {lowStockProducts.length} produtos
              </Badge>
            </CardHeader>
            <CardBody>
              <div className="table-container">
                <table className="table">
                  <thead>
                    <tr>
                      <th>Produto</th>
                      <th>SKU</th>
                      <th className="text-center">Em Estoque</th>
                      <th className="text-center">Mín.</th>
                    </tr>
                  </thead>
                  <tbody>
                    {lowStockProducts.slice(0, 3).map(product => (
                      <tr key={product.id}>
                        <td>{product.name}</td>
                        <td className="text-xs">{product.sku}</td>
                        <td className="text-center">
                          <span className={`font-medium ${product.quantity <= product.lowStockThreshold / 2 ? 'text-error-light' : 'text-warning-light'}`}>
                            {product.quantity}
                          </span>
                        </td>
                        <td className="text-center text-gray-400">{product.lowStockThreshold}</td>
                      </tr>
                    ))}
                    {lowStockProducts.length === 0 && (
                      <tr>
                        <td colSpan={4} className="text-center py-4 text-gray-400">
                          Todos os produtos com estoque adequado
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </CardBody>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard;