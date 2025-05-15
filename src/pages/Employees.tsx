import { useState } from 'react';
import { Card, CardHeader, CardBody } from '../components/UI/Card';
import Button from '../components/UI/Button';
import Badge from '../components/UI/Badge';
import { Search, UserPlus, Edit, Trash2, Mail, Phone, Calendar, UserCheck, Lock } from 'lucide-react';
import { mockEmployees, Employee } from '../data/employees';
import { motion, AnimatePresence } from 'framer-motion';
import { format, parseISO } from 'date-fns';
import { pt } from 'date-fns/locale';
import { useForm } from 'react-hook-form';
import { useAuth } from '../contexts/AuthContext';

const roleTranslations = {
  admin: 'Administrador',
  technician: 'Técnico',
  salesperson: 'Vendedor',
};

const Employees = () => {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [employees, setEmployees] = useState(mockEmployees);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deletePassword, setDeletePassword] = useState('');
  const [deleteError, setDeleteError] = useState('');
  
  const { register, handleSubmit, reset, formState: { errors } } = useForm<Employee>();
  
  const filteredEmployees = employees.filter(employee => 
    employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    employee.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    employee.phone.includes(searchTerm) ||
    roleTranslations[employee.role as keyof typeof roleTranslations]?.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const handleAddEmployee = (data: Employee) => {
    const newEmployee: Employee = {
      ...data,
      id: `E-${Date.now()}`,
      avatar: data.avatar || 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg',
      status: 'active',
    };
    
    setEmployees([newEmployee, ...employees]);
    closeModal();
  };
  
  const handleEditEmployee = (data: Employee) => {
    if (selectedEmployee) {
      const updatedEmployees = employees.map(employee => 
        employee.id === selectedEmployee.id ? { 
          ...selectedEmployee, 
          ...data,
          avatar: data.avatar || selectedEmployee.avatar,
          hireDate: selectedEmployee.hireDate,
        } : employee
      );
      setEmployees(updatedEmployees);
      closeModal();
    }
  };
  
  const handleToggleStatus = (id: string) => {
    const employee = employees.find(emp => emp.id === id);
    if (employee?.role === 'admin') return;
    
    const updatedEmployees = employees.map(employee => 
      employee.id === id ? { 
        ...employee, 
        status: employee.status === 'active' ? 'inactive' : 'active',
      } : employee
    );
    setEmployees(updatedEmployees);
  };
  
  const openDeleteConfirmation = (employee: Employee) => {
    if (employee.role === 'admin') {
      if (user?.role !== 'admin') return;
      setSelectedEmployee(employee);
      setIsDeleteModalOpen(true);
      setDeleteError('');
      return;
    }
    
    handleDeleteEmployee(employee.id);
  };
  
  const handleDeleteEmployee = (id: string) => {
    setEmployees(employees.filter(employee => employee.id !== id));
    setIsDeleteModalOpen(false);
    setSelectedEmployee(null);
    setDeletePassword('');
  };
  
  const confirmAdminDelete = () => {
    if (deletePassword !== '123456') {
      setDeleteError('Senha incorreta');
      return;
    }
    
    if (selectedEmployee) {
      handleDeleteEmployee(selectedEmployee.id);
    }
  };
  
  const openAddModal = () => {
    setSelectedEmployee(null);
    reset({
      role: 'salesperson',
      hireDate: new Date().toISOString().split('T')[0],
      avatar: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg',
    });
    setIsAddModalOpen(true);
  };
  
  const openEditModal = (employee: Employee) => {
    setSelectedEmployee(employee);
    reset(employee);
    setIsAddModalOpen(true);
  };
  
  const closeModal = () => {
    setIsAddModalOpen(false);
    setSelectedEmployee(null);
    reset({});
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <h1 className="text-3xl font-bold text-white">Funcionários</h1>
        <Button 
          variant="primary"
          onClick={openAddModal}
          className="flex items-center gap-2"
        >
          <UserPlus size={18} />
          <span>Novo Funcionário</span>
        </Button>
      </div>
      
      <Card>
        <CardHeader className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <h2 className="text-lg font-semibold text-white">Lista de Funcionários</h2>
          <div className="relative w-full sm:w-64">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <Search size={18} className="text-gray-400" />
            </div>
            <input
              type="text"
              className="input pl-10"
              placeholder="Buscar funcionários..."
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
                  <th>Funcionário</th>
                  <th>Contato</th>
                  <th>Função</th>
                  <th>Data de Contratação</th>
                  <th>Status</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                {filteredEmployees.length > 0 ? (
                  filteredEmployees.map(employee => (
                    <tr key={employee.id}>
                      <td>
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full overflow-hidden">
                            <img 
                              src={employee.avatar} 
                              alt={employee.name} 
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div>
                            <div className="font-medium text-white">{employee.name}</div>
                            <div className="text-xs text-gray-400">ID: {employee.id}</div>
                          </div>
                        </div>
                      </td>
                      <td>
                        <div className="flex flex-col">
                          <div className="flex items-center gap-1">
                            <Mail size={14} className="text-gray-400" />
                            <span>{employee.email}</span>
                          </div>
                          <div className="flex items-center gap-1 mt-1">
                            <Phone size={14} className="text-gray-400" />
                            <span>{employee.phone}</span>
                          </div>
                        </div>
                      </td>
                      <td>
                        <Badge
                          variant={
                            employee.role === 'admin' ? 'primary' :
                            employee.role === 'technician' ? 'warning' : 'success'
                          }
                        >
                          {roleTranslations[employee.role as keyof typeof roleTranslations]}
                        </Badge>
                      </td>
                      <td>
                        <div className="flex items-center gap-1">
                          <Calendar size={14} className="text-gray-400" />
                          <span>{format(parseISO(employee.hireDate), 'dd/MM/yyyy')}</span>
                        </div>
                      </td>
                      <td>
                        <button
                          onClick={() => handleToggleStatus(employee.id)}
                          disabled={employee.role === 'admin'}
                          className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                            employee.status === 'active'
                              ? 'bg-success-dark text-success-light'
                              : 'bg-error-dark text-error-light'
                          } ${employee.role === 'admin' ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                          <div className={`w-2 h-2 rounded-full mr-1.5 ${
                            employee.status === 'active' ? 'bg-success-light' : 'bg-error-light'
                          }`}></div>
                          {employee.status === 'active' ? 'Ativo' : 'Inativo'}
                        </button>
                      </td>
                      <td>
                        <div className="flex gap-2">
                          <button
                            onClick={() => openEditModal(employee)}
                            className="p-1 text-gray-400 hover:text-white rounded-md hover:bg-dark-600"
                          >
                            <Edit size={18} />
                          </button>
                          {((employee.role === 'admin' && user?.role === 'admin') || 
                            (employee.role !== 'admin')) && (
                            <button
                              onClick={() => openDeleteConfirmation(employee)}
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
                      <p className="text-gray-400">Nenhum funcionário encontrado</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardBody>
      </Card>
      
      {/* Add/Edit Employee Modal */}
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
                    {selectedEmployee ? 'Editar Funcionário' : 'Adicionar Novo Funcionário'}
                  </h3>
                </div>
                
                <form onSubmit={handleSubmit(selectedEmployee ? handleEditEmployee : handleAddEmployee)}>
                  <div className="p-6 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-1">Nome Completo</label>
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
                        <label htmlFor="role" className="block text-sm font-medium text-gray-300 mb-1">Função</label>
                        <select
                          id="role"
                          className={`input ${errors.role ? 'border-error-dark' : ''}`}
                          {...register('role', { required: true })}
                        >
                          <option value="admin">Administrador</option>
                          <option value="technician">Técnico</option>
                          <option value="salesperson">Vendedor</option>
                        </select>
                        {errors.role && <p className="mt-1 text-xs text-error-light">Função é obrigatória</p>}
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
                        <label htmlFor="avatar" className="block text-sm font-medium text-gray-300 mb-1">URL da Foto</label>
                        <input
                          id="avatar"
                          className="input"
                          {...register('avatar')}
                          placeholder="https://exemplo.com/imagem.jpg"
                        />
                        <p className="mt-1 text-xs text-gray-400">Se não informado, será usada uma imagem padrão</p>
                      </div>
                      
                      {selectedEmployee && (
                        <div>
                          <label htmlFor="status" className="block text-sm font-medium text-gray-300 mb-1">
                            <div className="flex items-center gap-1">
                              <UserCheck size={14} />
                              <span>Status</span>
                            </div>
                          </label>
                          <select
                            id="status"
                            className="input"
                            {...register('status')}
                            disabled={selectedEmployee.role === 'admin'}
                          >
                            <option value="active">Ativo</option>
                            <option value="inactive">Inativo</option>
                          </select>
                        </div>
                      )}
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
                      {selectedEmployee ? 'Salvar Alterações' : 'Adicionar Funcionário'}
                    </Button>
                  </div>
                </form>
              </motion.div>
            </div>
          </div>
        )}
      </AnimatePresence>

      {/* Delete Admin Confirmation Modal */}
      <AnimatePresence>
        {isDeleteModalOpen && (
          <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex items-center justify-center min-h-screen px-4">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="fixed inset-0 bg-black/60"
                onClick={() => setIsDeleteModalOpen(false)}
              ></motion.div>
              
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                className="relative bg-dark-800 rounded-xl shadow-xl w-full max-w-md border border-dark-700 z-10"
              >
                <div className="px-6 py-4 border-b border-dark-700">
                  <h3 className="text-xl font-semibold text-white flex items-center gap-2">
                    <Lock size={20} />
                    <span>Confirmar Exclusão</span>
                  </h3>
                </div>
                
                <div className="p-6">
                  <p className="text-gray-300 mb-4">
                    Para excluir um administrador, por favor digite sua senha:
                  </p>
                  
                  <input
                    type="password"
                    className="input w-full"
                    value={deletePassword}
                    onChange={(e) => setDeletePassword(e.target.value)}
                    placeholder="Digite sua senha"
                  />
                  
                  {deleteError && (
                    <p className="mt-2 text-sm text-error-light">{deleteError}</p>
                  )}
                </div>
                
                <div className="px-6 py-4 border-t border-dark-700 flex justify-end gap-3">
                  <Button
                    type="button"
                    variant="dark"
                    onClick={() => setIsDeleteModalOpen(false)}
                  >
                    Cancelar
                  </Button>
                  <Button
                    type="button"
                    variant="primary"
                    onClick={confirmAdminDelete}
                  >
                    Confirmar
                  </Button>
                </div>
              </motion.div>
            </div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Employees;