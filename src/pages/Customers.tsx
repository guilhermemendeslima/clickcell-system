import { useState } from 'react';
import { Card, CardHeader, CardBody } from '../components/UI/Card';
import Button from '../components/UI/Button';
import { Search, UserPlus, Edit, Trash2, UserCircle, Phone, Mail, MapPin, Calendar } from 'lucide-react';
import { mockCustomers, Customer } from '../data/customers';
import { motion, AnimatePresence } from 'framer-motion';
import { format, parseISO } from 'date-fns';
import { pt } from 'date-fns/locale';
import { useForm } from 'react-hook-form';

const Customers = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [customers, setCustomers] = useState(mockCustomers);
  
  const { register, handleSubmit, reset, formState: { errors } } = useForm<Customer>();
  
  const filteredCustomers = customers.filter(customer => 
    customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.phone.includes(searchTerm) ||
    customer.email.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const handleAddCustomer = (data: Customer) => {
    const newCustomer: Customer = {
      ...data,
      id: `C-${Date.now()}`,
      createdAt: new Date().toISOString().split('T')[0],
      purchases: 0,
      lastPurchase: null,
    };
    
    setCustomers([newCustomer, ...customers]);
    closeModal();
  };
  
  const handleEditCustomer = (data: Customer) => {
    if (selectedCustomer) {
      const updatedCustomers = customers.map(customer => 
        customer.id === selectedCustomer.id ? { ...selectedCustomer, ...data } : customer
      );
      setCustomers(updatedCustomers);
      closeModal();
    }
  };
  
  const handleDeleteCustomer = (id: string) => {
    if (confirm('Tem certeza que deseja excluir este cliente?')) {
      setCustomers(customers.filter(customer => customer.id !== id));
    }
  };
  
  const openAddModal = () => {
    setSelectedCustomer(null);
    reset({});
    setIsAddModalOpen(true);
  };
  
  const openEditModal = (customer: Customer) => {
    setSelectedCustomer(customer);
    reset(customer);
    setIsAddModalOpen(true);
  };
  
  const closeModal = () => {
    setIsAddModalOpen(false);
    setSelectedCustomer(null);
    reset({});
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <h1 className="text-3xl font-bold text-white">Clientes</h1>
        <Button 
          variant="primary"
          onClick={openAddModal}
          className="flex items-center gap-2"
        >
          <UserPlus size={18} />
          <span>Novo Cliente</span>
        </Button>
      </div>
      
      <Card>
        <CardHeader className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <h2 className="text-lg font-semibold text-white">Lista de Clientes</h2>
          <div className="relative w-full sm:w-64">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <Search size={18} className="text-gray-400" />
            </div>
            <input
              type="text"
              className="input pl-10"
              placeholder="Buscar clientes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </CardHeader>
        <CardBody>
          <div className="table-container">
            <table className="table">
              <thead>
                <tr>
                  <th>Cliente</th>
                  <th>Contato</th>
                  <th>Endereço</th>
                  <th>Aniversário</th>
                  <th>Compras</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                {filteredCustomers.length > 0 ? (
                  filteredCustomers.map(customer => (
                    <tr key={customer.id}>
                      <td>
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-primary-500/20 flex items-center justify-center">
                            <UserCircle size={20} className="text-primary-400" />
                          </div>
                          <div>
                            <div className="font-medium text-white">{customer.name}</div>
                            <div className="text-xs text-gray-400">Cliente desde {format(parseISO(customer.createdAt), 'MMM yyyy', { locale: pt })}</div>
                          </div>
                        </div>
                      </td>
                      <td>
                        <div className="flex flex-col">
                          <div className="flex items-center gap-1">
                            <Phone size={14} className="text-gray-400" />
                            <span>{customer.phone}</span>
                          </div>
                          <div className="flex items-center gap-1 mt-1">
                            <Mail size={14} className="text-gray-400" />
                            <span>{customer.email}</span>
                          </div>
                        </div>
                      </td>
                      <td>
                        <div className="flex items-start gap-1">
                          <MapPin size={14} className="text-gray-400 mt-1" />
                          <span className="text-sm">{customer.address}</span>
                        </div>
                      </td>
                      <td>
                        <div className="flex items-center gap-1">
                          <Calendar size={14} className="text-gray-400" />
                          <span>{format(parseISO(customer.birthday), 'dd/MM/yyyy')}</span>
                        </div>
                      </td>
                      <td>
                        <div className="flex flex-col">
                          <span className="font-medium">{customer.purchases} compras</span>
                          {customer.lastPurchase && (
                            <span className="text-xs text-gray-400">
                              Última: {format(parseISO(customer.lastPurchase), 'dd/MM/yyyy')}
                            </span>
                          )}
                        </div>
                      </td>
                      <td>
                        <div className="flex gap-2">
                          <button
                            onClick={() => openEditModal(customer)}
                            className="p-1 text-gray-400 hover:text-white rounded-md hover:bg-dark-600"
                          >
                            <Edit size={18} />
                          </button>
                          {user?.role !== 'admin' && (
                            <button
                              onClick={() => handleDeleteCustomer(customer.id)}
                              className="p-1 text-gray-400 hover:text-error-light rounded-md hover:bg-dark-600"
                            >
                              <Trash2 size={18} />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="text-center py-4">
                      <p className="text-gray-400">Nenhum cliente encontrado</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardBody>
      </Card>
      
      <AnimatePresence>
        {isAddModalOpen && (
          <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex items-center justify-center min-h-screen px-4">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="fixed inset-0 bg-black/60"
                onClick={closeModal}
              ></motion.div>
              
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                className="relative bg-dark-800 rounded-xl shadow-xl w-full max-w-2xl border border-dark-700 z-10"
              >
                <div className="px-6 py-4 border-b border-dark-700">
                  <h3 className="text-xl font-semibold text-white">
                    {selectedCustomer ? 'Editar Cliente' : 'Adicionar Novo Cliente'}
                  </h3>
                </div>
                
                <form onSubmit={handleSubmit(selectedCustomer ? handleEditCustomer : handleAddCustomer)}>
                  <div className="p-6 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-1">Nome</label>
                        <input
                          id="name"
                          className={`input ${errors.name ? 'border-error-dark' : ''}`}
                          {...register('name', { required: true })}
                        />
                        {errors.name && <p className="mt-1 text-xs text-error-light">Nome é obrigatório</p>}
                      </div>
                      
                      <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1">Email</label>
                        <input
                          id="email"
                          type="email"
                          className={`input ${errors.email ? 'border-error-dark' : ''}`}
                          {...register('email', { required: true, pattern: /^\S+@\S+$/i })}
                        />
                        {errors.email && <p className="mt-1 text-xs text-error-light">Email válido é obrigatório</p>}
                      </div>
                      
                      <div>
                        <label htmlFor="phone" className="block text-sm font-medium text-gray-300 mb-1">Telefone</label>
                        <input
                          id="phone"
                          className={`input ${errors.phone ? 'border-error-dark' : ''}`}
                          placeholder="(99) 99999-9999"
                          {...register('phone', { required: true })}
                        />
                        {errors.phone && <p className="mt-1 text-xs text-error-light">Telefone é obrigatório</p>}
                      </div>
                      
                      <div>
                        <label htmlFor="birthday" className="block text-sm font-medium text-gray-300 mb-1">
                          <div className="flex items-center gap-1">
                            <Calendar size={14} />
                            <span>Data de Nascimento</span>
                          </div>
                        </label>
                        <input
                          id="birthday"
                          type="date"
                          className="input"
                          {...register('birthday')}
                        />
                      </div>
                      
                      <div className="md:col-span-2">
                        <label htmlFor="address" className="block text-sm font-medium text-gray-300 mb-1">Endereço</label>
                        <input
                          id="address"
                          className={`input ${errors.address ? 'border-error-dark' : ''}`}
                          placeholder="Rua, número, bairro, cidade, estado"
                          {...register('address', { required: true })}
                        />
                        {errors.address && <p className="mt-1 text-xs text-error-light">Endereço é obrigatório</p>}
                      </div>
                    </div>
                  </div>
                  
                  <div className="px-6 py-4 border-t border-dark-700 flex justify-end gap-3">
                    <Button
                      type="button"
                      variant="dark"
                      onClick={closeModal}
                    >
                      Cancelar
                    </Button>
                    <Button
                      type="submit"
                      variant="primary"
                    >
                      {selectedCustomer ? 'Salvar Alterações' : 'Adicionar Cliente'}
                    </Button>
                  </div>
                </form>
              </motion.div>
            </div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Customers;