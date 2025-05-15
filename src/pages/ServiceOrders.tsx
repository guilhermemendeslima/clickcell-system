import { useState } from 'react';
import { Card, CardHeader, CardBody } from '../components/UI/Card';
import Button from '../components/UI/Button';
import Badge from '../components/UI/Badge';
import { Search, ClipboardPlus, Edit, Smartphone, User, FileText, DollarSign, PenTool as Tool } from 'lucide-react';
import { mockServiceOrders, ServiceOrder, serviceStatusTranslations, serviceStatusColors } from '../data/serviceOrders';
import { mockCustomers } from '../data/customers';
import { motion, AnimatePresence } from 'framer-motion';
import { format } from 'date-fns';
import { pt } from 'date-fns/locale';
import { useForm } from 'react-hook-form';

const ServiceOrders = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<ServiceOrder | null>(null);
  const [serviceOrders, setServiceOrders] = useState(mockServiceOrders);
  const [activeStatusFilter, setActiveStatusFilter] = useState<ServiceOrder['status'] | 'all'>('all');
  const [customerSearchTerm, setCustomerSearchTerm] = useState('');
  const [showCustomerSearch, setShowCustomerSearch] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<{ id: string; name: string } | null>(null);
  
  const { register, handleSubmit, reset, formState: { errors }, setValue } = useForm<ServiceOrder>();
  
  const filteredOrders = serviceOrders.filter(order => 
    (activeStatusFilter === 'all' || order.status === activeStatusFilter) &&
    (order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
     order.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
     order.deviceModel.toLowerCase().includes(searchTerm.toLowerCase()) ||
     order.defect.toLowerCase().includes(searchTerm.toLowerCase()))
  );
  
  const filteredCustomers = mockCustomers.filter(customer => 
    customer.name.toLowerCase().includes(customerSearchTerm.toLowerCase()) ||
    customer.phone.includes(customerSearchTerm) ||
    customer.email.toLowerCase().includes(customerSearchTerm.toLowerCase())
  );
  
  const handleAddServiceOrder = (data: ServiceOrder) => {
    const newOrder: ServiceOrder = {
      ...data,
      id: `OS-${new Date().getFullYear()}-${String(serviceOrders.length + 1).padStart(3, '0')}`,
      customerId: selectedCustomer?.id || '',
      customerName: selectedCustomer?.name || '',
      status: 'pending',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      technicianId: null,
      technicianName: null,
    };
    
    setServiceOrders([newOrder, ...serviceOrders]);
    closeModal();
  };
  
  const handleEditServiceOrder = (data: ServiceOrder) => {
    if (selectedOrder) {
      const updatedOrders = serviceOrders.map(order => 
        order.id === selectedOrder.id ? { 
          ...selectedOrder, 
          ...data,
          updatedAt: new Date().toISOString(),
          customerId: selectedCustomer?.id || selectedOrder.customerId,
          customerName: selectedCustomer?.name || selectedOrder.customerName,
        } : order
      );
      setServiceOrders(updatedOrders);
      closeModal();
    }
  };
  
  const handleUpdateStatus = (orderId: string, newStatus: ServiceOrder['status']) => {
    const updatedOrders = serviceOrders.map(order => 
      order.id === orderId ? { 
        ...order, 
        status: newStatus,
        updatedAt: new Date().toISOString(),
      } : order
    );
    setServiceOrders(updatedOrders);
  };
  
  const openAddModal = () => {
    setSelectedOrder(null);
    setSelectedCustomer(null);
    reset({});
    setIsAddModalOpen(true);
  };
  
  const openEditModal = (order: ServiceOrder) => {
    setSelectedOrder(order);
    setSelectedCustomer({ id: order.customerId, name: order.customerName });
    reset(order);
    setIsAddModalOpen(true);
  };
  
  const closeModal = () => {
    setIsAddModalOpen(false);
    setSelectedOrder(null);
    setSelectedCustomer(null);
    setShowCustomerSearch(false);
    setCustomerSearchTerm('');
    reset({});
  };
  
  const selectCustomer = (customer: { id: string; name: string }) => {
    setSelectedCustomer(customer);
    setShowCustomerSearch(false);
    setCustomerSearchTerm('');
  };
  
  const statusOptions = [
    { value: 'all', label: 'Todos' },
    { value: 'pending', label: 'Pendente' },
    { value: 'diagnosing', label: 'Diagnóstico' },
    { value: 'waiting_approval', label: 'Aguardando Aprovação' },
    { value: 'in_progress', label: 'Em Andamento' },
    { value: 'completed', label: 'Concluído' },
    { value: 'delivered', label: 'Entregue' },
    { value: 'cancelled', label: 'Cancelado' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <h1 className="text-3xl font-bold text-white">Ordens de Serviço</h1>
        <Button 
          variant="primary"
          onClick={openAddModal}
          className="flex items-center gap-2"
        >
          <ClipboardPlus size={18} />
          <span>Nova Ordem de Serviço</span>
        </Button>
      </div>
      
      <div className="flex overflow-x-auto gap-2 pb-2">
        {statusOptions.map(status => (
          <button
            key={status.value}
            onClick={() => setActiveStatusFilter(status.value as ServiceOrder['status'] | 'all')}
            className={`px-4 py-2 rounded-lg text-sm whitespace-nowrap ${
              activeStatusFilter === status.value
                ? 'bg-primary-500 text-white'
                : 'bg-dark-700 text-gray-300 hover:bg-dark-600'
            }`}
          >
            {status.label}
          </button>
        ))}
      </div>
      
      <Card>
        <CardHeader className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <h2 className="text-lg font-semibold text-white">Ordens de Serviço</h2>
          <div className="relative w-full sm:w-64">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <Search size={18} className="text-gray-400" />
            </div>
            <input
              type="text"
              className="input pl-10"
              placeholder="Buscar ordens..."
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
                  <th>ID</th>
                  <th>Cliente</th>
                  <th>Dispositivo</th>
                  <th>Problema</th>
                  <th>Data</th>
                  <th>Status</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.length > 0 ? (
                  filteredOrders.map(order => (
                    <tr key={order.id}>
                      <td className="text-primary-400 font-medium">{order.id}</td>
                      <td>
                        <div>{order.customerName}</div>
                      </td>
                      <td>
                        <div className="font-medium">{order.deviceModel}</div>
                        <div className="text-xs text-gray-400">{order.deviceType}</div>
                      </td>
                      <td>
                        <div className="max-w-xs overflow-hidden text-ellipsis">{order.defect}</div>
                      </td>
                      <td>
                        <div>{format(new Date(order.createdAt), 'dd/MM/yyyy')}</div>
                        <div className="text-xs text-gray-400">{format(new Date(order.createdAt), 'HH:mm')}</div>
                      </td>
                      <td>
                        <Badge variant={serviceStatusColors[order.status] as any}>
                          {serviceStatusTranslations[order.status]}
                        </Badge>
                      </td>
                      <td>
                        <div className="flex gap-2">
                          <button
                            onClick={() => openEditModal(order)}
                            className="p-1 text-gray-400 hover:text-white rounded-md hover:bg-dark-600"
                          >
                            <Edit size={18} />
                          </button>
                          {order.status === 'pending' && (
                            <button
                              onClick={() => handleUpdateStatus(order.id, 'diagnosing')}
                              className="p-1 text-gray-400 hover:text-primary-400 rounded-md hover:bg-dark-600"
                            >
                              <Tool size={18} />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={7} className="text-center py-4">
                      <p className="text-gray-400">Nenhuma ordem de serviço encontrada</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardBody>
      </Card>
      
      {/* Modal for adding/editing orders */}
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
                className="relative bg-dark-800 rounded-xl shadow-xl w-full max-w-2xl border border-dark-700 z-10 max-h-[90vh] overflow-y-auto"
              >
                <div className="px-6 py-4 border-b border-dark-700 sticky top-0 bg-dark-800 z-10">
                  <h3 className="text-xl font-semibold text-white">
                    {selectedOrder ? 'Editar Ordem de Serviço' : 'Nova Ordem de Serviço'}
                  </h3>
                </div>
                
                <form onSubmit={handleSubmit(selectedOrder ? handleEditServiceOrder : handleAddServiceOrder)}>
                  <div className="p-6 space-y-6">
                    {/* Customer Selection */}
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-1">Cliente</label>
                      <div className="mb-2">
                        {selectedCustomer ? (
                          <div className="p-3 flex justify-between items-center border border-dark-600 rounded-lg">
                            <div className="flex items-center gap-2">
                              <div className="w-10 h-10 bg-primary-500/20 rounded-full flex items-center justify-center">
                                <User size={18} className="text-primary-400" />
                              </div>
                              <div>
                                <div className="font-medium">{selectedCustomer.name}</div>
                              </div>
                            </div>
                            <Button
                              type="button"
                              variant="dark"
                              size="sm"
                              onClick={() => setSelectedCustomer(null)}
                            >
                              Alterar
                            </Button>
                          </div>
                        ) : (
                          <div>
                            {showCustomerSearch ? (
                              <div>
                                <div className="relative">
                                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                    <Search size={18} className="text-gray-400" />
                                  </div>
                                  <input
                                    type="text"
                                    className="input pl-10"
                                    placeholder="Buscar cliente..."
                                    value={customerSearchTerm}
                                    onChange={(e) => setCustomerSearchTerm(e.target.value)}
                                    autoFocus
                                  />
                                </div>
                                
                                {customerSearchTerm && (
                                  <div className="mt-2 border border-dark-600 rounded-lg overflow-hidden max-h-48 overflow-y-auto">
                                    {filteredCustomers.length > 0 ? (
                                      filteredCustomers.map(customer => (
                                        <button
                                          key={customer.id}
                                          type="button"
                                          className="flex items-center w-full p-2 hover:bg-dark-700 text-left"
                                          onClick={() => selectCustomer({ id: customer.id, name: customer.name })}
                                        >
                                          <div className="w-8 h-8 bg-primary-500/20 rounded-full flex items-center justify-center mr-2">
                                            <User size={16} className="text-primary-400" />
                                          </div>
                                          <div>
                                            <div className="font-medium">{customer.name}</div>
                                            <div className="text-xs text-gray-400">{customer.phone}</div>
                                          </div>
                                        </button>
                                      ))
                                    ) : (
                                      <div className="p-3 text-center text-gray-400">
                                        Nenhum cliente encontrado
                                      </div>
                                    )}
                                  </div>
                                )}
                              </div>
                            ) : (
                              <Button
                                type="button"
                                variant="dark"
                                className="w-full justify-center"
                                onClick={() => setShowCustomerSearch(true)}
                              >
                                <User size={18} className="mr-2" />
                                <span>Selecionar Cliente</span>
                              </Button>
                            )}
                          </div>
                        )}
                      </div>
                      {!selectedCustomer && (
                        <p className="text-error-light text-xs">Cliente é obrigatório</p>
                      )}
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label htmlFor="deviceType" className="block text-sm font-medium text-gray-300 mb-1">
                          <div className="flex items-center gap-1">
                            <Smartphone size={14} />
                            <span>Tipo de Dispositivo</span>
                          </div>
                        </label>
                        <select
                          id="deviceType"
                          className={`input ${errors.deviceType ? 'border-error-dark' : ''}`}
                          {...register('deviceType', { required: true })}
                        >
                          <option value="">Selecione...</option>
                          <option value="Smartphone">Smartphone</option>
                          <option value="Tablet">Tablet</option>
                          <option value="Notebook">Notebook</option>
                          <option value="Smartwatch">Smartwatch</option>
                          <option value="Outro">Outro</option>
                        </select>
                        {errors.deviceType && <p className="mt-1 text-xs text-error-light">Tipo de dispositivo é obrigatório</p>}
                      </div>
                      
                      <div>
                        <label htmlFor="deviceModel" className="block text-sm font-medium text-gray-300 mb-1">Modelo</label>
                        <input
                          id="deviceModel"
                          className={`input ${errors.deviceModel ? 'border-error-dark' : ''}`}
                          placeholder="Ex: iPhone 13, Galaxy S22..."
                          {...register('deviceModel', { required: true })}
                        />
                        {errors.deviceModel && <p className="mt-1 text-xs text-error-light">Modelo é obrigatório</p>}
                      </div>
                      
                      <div className="md:col-span-2">
                        <label htmlFor="defect" className="block text-sm font-medium text-gray-300 mb-1">Defeito</label>
                        <textarea
                          id="defect"
                          rows={2}
                          className={`input ${errors.defect ? 'border-error-dark' : ''}`}
                          placeholder="Descreva o problema relatado pelo cliente"
                          {...register('defect', { required: true })}
                        />
                        {errors.defect && <p className="mt-1 text-xs text-error-light">Descrição do defeito é obrigatória</p>}
                      </div>
                      
                      <div>
                        <label htmlFor="imei" className="block text-sm font-medium text-gray-300 mb-1">IMEI / Número de Série</label>
                        <input
                          id="imei"
                          className={`input ${errors.imei ? 'border-error-dark' : ''}`}
                          {...register('imei', { required: true })}
                        />
                        {errors.imei && <p className="mt-1 text-xs text-error-light">IMEI / Número de série é obrigatório</p>}
                      </div>
                      
                      <div>
                        <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-1">Senha do Dispositivo</label>
                        <input
                          id="password"
                          className="input"
                          placeholder="Se não tiver senha, deixe em branco"
                          {...register('password')}
                        />
                      </div>
                      
                      {selectedOrder && (
                        <div>
                          <label htmlFor="budget" className="block text-sm font-medium text-gray-300 mb-1">
                            <div className="flex items-center gap-1">
                              <DollarSign size={14} />
                              <span>Orçamento (R$)</span>
                            </div>
                          </label>
                          <input
                            id="budget"
                            type="number"
                            step="0.01"
                            className="input"
                            placeholder="Deixe em branco se ainda não souber"
                            {...register('budget', { valueAsNumber: true })}
                          />
                        </div>
                      )}
                      
                      {selectedOrder && (
                        <div>
                          <label htmlFor="status" className="block text-sm font-medium text-gray-300 mb-1">Status</label>
                          <select
                            id="status"
                            className="input"
                            {...register('status', { required: true })}
                          >
                            <option value="pending">Pendente</option>
                            <option value="diagnosing">Diagnóstico</option>
                            <option value="waiting_approval">Aguardando Aprovação</option>
                            <option value="in_progress">Em Andamento</option>
                            <option value="completed">Concluído</option>
                            <option value="delivered">Entregue</option>
                            <option value="cancelled">Cancelado</option>
                          </select>
                        </div>
                      )}
                      
                      <div className="md:col-span-2">
                        <label htmlFor="notes" className="block text-sm font-medium text-gray-300 mb-1">
                          <div className="flex items-center gap-1">
                            <FileText size={14} />
                            <span>Observações</span>
                          </div>
                        </label>
                        <textarea
                          id="notes"
                          rows={3}
                          className="input"
                          placeholder="Observações adicionais, estado do aparelho, etc."
                          {...register('notes')}
                        />
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
                      disabled={!selectedCustomer}
                    >
                      {selectedOrder ? 'Atualizar' : 'Registrar'} Ordem de Serviço
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

export default ServiceOrders;