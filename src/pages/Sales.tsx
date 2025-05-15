import { useState, useEffect } from 'react';
import { Card, CardHeader, CardBody, CardFooter } from '../components/UI/Card';
import Button from '../components/UI/Button';
import Badge from '../components/UI/Badge';
import { Search, ShoppingCart, Plus, Trash2, PackageOpen, Calculator, User, Receipt, CreditCard, Banknote, QrCode, Calendar, Edit } from 'lucide-react';
import { mockSales, Sale, SaleItem, paymentMethodTranslations } from '../data/sales';
import { mockProducts, Product } from '../data/products';
import { mockCustomers, Customer } from '../data/customers';
import { motion, AnimatePresence } from 'framer-motion';
import { format } from 'date-fns';
import { pt } from 'date-fns/locale';
import { useForm } from 'react-hook-form';

const Sales = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sales, setSales] = useState(mockSales);
  const [isNewSaleModalOpen, setIsNewSaleModalOpen] = useState(false);
  const [selectedSale, setSelectedSale] = useState<Sale | null>(null);
  
  // New sale state
  const [selectedProducts, setSelectedProducts] = useState<(Product & { quantity: number })[]>([]);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<Sale['paymentMethod']>('credit_card');
  const [productSearchTerm, setProductSearchTerm] = useState('');
  const [customerSearchTerm, setCustomerSearchTerm] = useState('');
  const [showCustomerSearch, setShowCustomerSearch] = useState(false);
  const [showProductSearch, setShowProductSearch] = useState(false);
  const [isAddingNewCustomer, setIsAddingNewCustomer] = useState(false);
  const { register: registerCustomer, handleSubmit: handleSubmitCustomer, formState: { errors: customerErrors }, reset: resetCustomer } = useForm<Customer>();

  const filteredSales = sales.filter(sale => 
    sale.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (sale.customerName && sale.customerName.toLowerCase().includes(searchTerm.toLowerCase())) ||
    paymentMethodTranslations[sale.paymentMethod].toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const filteredProducts = mockProducts.filter(product => 
    product.name.toLowerCase().includes(productSearchTerm.toLowerCase()) ||
    product.sku.toLowerCase().includes(productSearchTerm.toLowerCase()) ||
    product.description.toLowerCase().includes(productSearchTerm.toLowerCase())
  );
  
  const filteredCustomers = mockCustomers.filter(customer => 
    customer.name.toLowerCase().includes(customerSearchTerm.toLowerCase()) ||
    customer.phone.includes(customerSearchTerm) ||
    customer.email.toLowerCase().includes(customerSearchTerm.toLowerCase())
  );
  
  const calculateTotal = () => {
    return selectedProducts.reduce((total, product) => total + (product.sellingPrice * product.quantity), 0);
  };
  
  const addProductToSale = (product: Product) => {
    const existingProduct = selectedProducts.find(p => p.id === product.id);
    
    if (existingProduct) {
      setSelectedProducts(
        selectedProducts.map(p => 
          p.id === product.id ? { ...p, quantity: p.quantity + 1 } : p
        )
      );
    } else {
      setSelectedProducts([...selectedProducts, { ...product, quantity: 1 }]);
    }
    
    setShowProductSearch(false);
    setProductSearchTerm('');
  };
  
  const removeProductFromSale = (productId: string) => {
    setSelectedProducts(selectedProducts.filter(p => p.id !== productId));
  };
  
  const updateProductQuantity = (productId: string, newQuantity: number) => {
    if (newQuantity < 1) return;
    
    setSelectedProducts(
      selectedProducts.map(p => 
        p.id === productId ? { ...p, quantity: newQuantity } : p
      )
    );
  };
  
  const selectCustomer = (customer: Customer) => {
    setSelectedCustomer(customer);
    setShowCustomerSearch(false);
    setCustomerSearchTerm('');
  };

  const handleAddNewCustomer = (data: Customer) => {
    const newCustomer: Customer = {
      ...data,
      id: `C-${Date.now()}`,
      createdAt: new Date().toISOString().split('T')[0],
      purchases: 0,
      lastPurchase: null,
    };
    
    mockCustomers.push(newCustomer);
    selectCustomer(newCustomer);
    setIsAddingNewCustomer(false);
    resetCustomer();
  };

  const openEditSale = (sale: Sale) => {
    setSelectedSale(sale);
    // Convert sale items to selected products format
    const saleProducts = sale.items.map(item => {
      const product = mockProducts.find(p => p.id === item.productId);
      if (!product) return null;
      return {
        ...product,
        quantity: item.quantity
      };
    }).filter(Boolean) as (Product & { quantity: number })[];
    
    setSelectedProducts(saleProducts);
    
    // Set customer if exists
    if (sale.customerId) {
      const customer = mockCustomers.find(c => c.id === sale.customerId);
      if (customer) {
        setSelectedCustomer(customer);
      }
    }
    
    setPaymentMethod(sale.paymentMethod);
    setIsNewSaleModalOpen(true);
  };
  
  const handleCreateSale = () => {
    if (selectedProducts.length === 0) {
      alert('Adicione pelo menos um produto antes de finalizar a venda');
      return;
    }

    const saleData: Sale = {
      id: selectedSale ? selectedSale.id : `V-${new Date().getFullYear()}-${String(sales.length + 1).padStart(3, '0')}`,
      customerId: selectedCustomer?.id || null,
      customerName: selectedCustomer?.name || null,
      date: selectedSale ? selectedSale.date : new Date().toISOString(),
      items: selectedProducts.map(p => ({
        productId: p.id,
        productName: p.name,
        quantity: p.quantity,
        unitPrice: p.sellingPrice,
        subtotal: p.sellingPrice * p.quantity,
      })),
      total: calculateTotal(),
      paymentMethod: paymentMethod,
      employeeId: '2', // Using a mock employee
      employeeName: 'Marina Souza',
      status: 'completed',
    };
    
    if (selectedSale) {
      // Update existing sale
      setSales(sales.map(sale => 
        sale.id === selectedSale.id ? saleData : sale
      ));
    } else {
      // Create new sale
      setSales([saleData, ...sales]);
    }
    
    resetSaleForm();
    setIsNewSaleModalOpen(false);
  };
  
  const resetSaleForm = () => {
    setSelectedProducts([]);
    setSelectedCustomer(null);
    setPaymentMethod('credit_card');
    setProductSearchTerm('');
    setCustomerSearchTerm('');
    setSelectedSale(null);
  };
  
  const openNewSaleModal = () => {
    resetSaleForm();
    setIsNewSaleModalOpen(true);
  };
  
  const closeNewSaleModal = () => {
    setIsNewSaleModalOpen(false);
    resetSaleForm();
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <h1 className="text-3xl font-bold text-white">Vendas</h1>
        <Button 
          variant="primary"
          onClick={openNewSaleModal}
          className="flex items-center gap-2"
        >
          <ShoppingCart size={18} />
          <span>Nova Venda</span>
        </Button>
      </div>
      
      <Card>
        <CardHeader className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <h2 className="text-lg font-semibold text-white">Histórico de Vendas</h2>
          <div className="relative w-full sm:w-64">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <Search size={18} className="text-gray-400" />
            </div>
            <input
              type="text"
              className="input pl-10"
              placeholder="Buscar vendas..."
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
                  <th>Data</th>
                  <th>Cliente</th>
                  <th>Produtos</th>
                  <th>Pagamento</th>
                  <th className="text-right">Total</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                {filteredSales.length > 0 ? (
                  filteredSales.map(sale => (
                    <tr key={sale.id}>
                      <td className="text-primary-400 font-medium">{sale.id}</td>
                      <td>
                        {format(new Date(sale.date), "dd 'de' MMMM 'de' yyyy", { locale: pt })}
                        <div className="text-xs text-gray-400">
                          {format(new Date(sale.date), "HH:mm", { locale: pt })}
                        </div>
                      </td>
                      <td>
                        {sale.customerName ? (
                          <span>{sale.customerName}</span>
                        ) : (
                          <span className="text-gray-400">Cliente não registrado</span>
                        )}
                      </td>
                      <td>
                        <div className="text-sm">
                          {sale.items.length} {sale.items.length === 1 ? 'item' : 'itens'}
                        </div>
                        <div className="text-xs text-gray-400">
                          {sale.items.map(item => item.productName).join(', ')}
                        </div>
                      </td>
                      <td>
                        <div className="flex items-center gap-2">
                          {sale.paymentMethod === 'credit_card' && <CreditCard size={16} />}
                          {sale.paymentMethod === 'debit_card' && <CreditCard size={16} />}
                          {sale.paymentMethod === 'cash' && <Banknote size={16} />}
                          {sale.paymentMethod === 'pix' && <QrCode size={16} />}
                          <span>{paymentMethodTranslations[sale.paymentMethod]}</span>
                        </div>
                      </td>
                      <td className="text-right font-semibold">
                        {sale.total.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                      </td>
                      <td>
                        <button
                          onClick={() => openEditSale(sale)}
                          className="p-1 text-gray-400 hover:text-white rounded-md hover:bg-dark-600"
                        >
                          <Edit size={18} />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={7} className="text-center py-4">
                      <p className="text-gray-400">Nenhuma venda encontrada</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardBody>
      </Card>
      
      {/* New/Edit Sale Modal */}
      <AnimatePresence>
        {isNewSaleModalOpen && (
          <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex items-center justify-center min-h-screen px-4">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="fixed inset-0 bg-black/60"
                onClick={closeNewSaleModal}
              ></motion.div>
              
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                className="relative bg-dark-800 rounded-xl shadow-xl w-full max-w-4xl border border-dark-700 z-10 max-h-[90vh] overflow-hidden flex flex-col"
              >
                <div className="px-6 py-4 border-b border-dark-700 sticky top-0 bg-dark-800 z-10">
                  <h3 className="text-xl font-semibold text-white">
                    {selectedSale ? 'Editar Venda' : 'Nova Venda'}
                  </h3>
                </div>
                
                <div className="flex-1 overflow-y-auto p-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Left Column - Products */}
                    <div className="md:col-span-2">
                      <Card>
                        <CardHeader className="flex justify-between items-center">
                          <h4 className="font-medium">Produtos</h4>
                          <Button
                            variant="dark"
                            size="sm"
                            onClick={() => setShowProductSearch(true)}
                            className="flex items-center gap-1"
                          >
                            <Plus size={16} />
                            <span>Adicionar</span>
                          </Button>
                        </CardHeader>
                        <CardBody>
                          {showProductSearch && (
                            <div className="mb-4">
                              <div className="relative">
                                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                  <Search size={18} className="text-gray-400" />
                                </div>
                                <input
                                  type="text"
                                  className="input pl-10"
                                  placeholder="Buscar produtos..."
                                  value={productSearchTerm}
                                  onChange={(e) => setProductSearchTerm(e.target.value)}
                                  autoFocus
                                />
                              </div>
                              
                              {productSearchTerm && (
                                <div className="mt-2 border border-dark-600 rounded-lg overflow-hidden max-h-48 overflow-y-auto">
                                  {filteredProducts.length > 0 ? (
                                    filteredProducts.map(product => (
                                      <button
                                        key={product.id}
                                        className="flex items-center w-full p-2 hover:bg-dark-700 text-left"
                                        onClick={() => addProductToSale(product)}
                                      >
                                        <div className="w-8 h-8 mr-2 rounded overflow-hidden">
                                          <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover" />
                                        </div>
                                        <div>
                                          <div className="font-medium">{product.name}</div>
                                          <div className="text-xs flex items-center justify-between">
                                            <span className="text-gray-400">{product.sku}</span>
                                            <span className="ml-2">
                                              {product.sellingPrice.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                                            </span>
                                          </div>
                                        </div>
                                      </button>
                                    ))
                                  ) : (
                                    <div className="p-3 text-center text-gray-400">
                                      Nenhum produto encontrado
                                    </div>
                                  )}
                                </div>
                              )}
                            </div>
                          )}
                          
                          {selectedProducts.length > 0 ? (
                            <div className="space-y-3">
                              {selectedProducts.map(product => (
                                <div 
                                  key={product.id}
                                  className="flex items-center justify-between p-3 border border-dark-600 rounded-lg"
                                >
                                  <div className="flex items-center">
                                    <div className="w-10 h-10 mr-3 rounded overflow-hidden">
                                      <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover" />
                                    </div>
                                    <div>
                                      <div className="font-medium">{product.name}</div>
                                      <div className="text-sm text-gray-400">{product.sku}</div>
                                    </div>
                                  </div>
                                  <div className="flex items-center gap-3">
                                    <div className="text-right">
                                      <div className="font-medium">
                                        {(product.sellingPrice * product.quantity).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                                      </div>
                                      <div className="text-xs text-gray-400">
                                        {product.sellingPrice.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })} un.
                                      </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                      <button
                                        className="p-1 rounded-md bg-dark-700 hover:bg-dark-600"
                                        onClick={() => updateProductQuantity(product.id, product.quantity - 1)}
                                      >
                                        -
                                      </button>
                                      <span className="w-6 text-center">{product.quantity}</span>
                                      <button
                                        className="p-1 rounded-md bg-dark-700 hover:bg-dark-600"
                                        onClick={() => updateProductQuantity(product.id, product.quantity + 1)}
                                      >
                                        +
                                      </button>
                                    </div>
                                    <button
                                      className="p-1.5 rounded-md text-gray-400 hover:text-error-light hover:bg-dark-700"
                                      onClick={() => removeProductFromSale(product.id)}
                                    >
                                      <Trash2 size={18} />
                                    </button>
                                  </div>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <div className="flex flex-col items-center justify-center py-8 text-center">
                              <PackageOpen size={48} className="text-dark-400 mb-3" />
                              <p className="text-gray-400">Nenhum produto adicionado</p>
                              <p className="text-sm text-gray-500 mt-1">Clique em Adicionar para incluir produtos</p>
                            </div>
                          )}
                        </CardBody>
                      </Card>
                    </div>
                    
                    {/* Right Column - Customer and Payment */}
                    <div>
                      <div className="space-y-6">
                        {/* Customer Section */}
                        <Card>
                          <CardHeader className="flex justify-between items-center">
                            <h4 className="font-medium">Cliente</h4>
                            <Button
                              variant="dark"
                              size="sm"
                              onClick={() => setShowCustomerSearch(true)}
                              className="flex items-center gap-1"
                            >
                              <User size={16} />
                              <span>Selecionar</span>
                            </Button>
                          </CardHeader>
                          <CardBody>
                            {showCustomerSearch && (
                              <div className="mb-4">
                                <div className="relative">
                                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                    <Search size={18} className="text-gray-400" />
                                  </div>
                                  <input
                                    type="text"
                                    className="input pl-10"
                                    placeholder="Buscar clientes..."
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
                                          className="flex items-center w-full p-2 hover:bg-dark-700 text-left"
                                          onClick={() => selectCustomer(customer)}
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
                            )}
                            
                            {selectedCustomer ? (
                              <div className="p-3 border border-dark-600 rounded-lg">
                                <div className="flex items-center mb-2">
                                  <div className="w-10 h-10 bg-primary-500/20 rounded-full flex items-center justify-center mr-3">
                                    <User size={18} className="text-primary-400" />
                                  </div>
                                  <div>
                                    <div className="font-medium">{selectedCustomer.name}</div>
                                    <div className="text-sm text-gray-400">{selectedCustomer.phone}</div>
                                  </div>
                                </div>
                                <Button
                                  variant="dark"
                                  size="sm"
                                  className="w-full mt-2"
                                  onClick={() => setSelectedCustomer(null)}
                                >
                                  Remover
                                </Button>
                              </div>
                            ) : (
                              <div className="flex flex-col items-center justify-center py-4 text-center">
                                <User size={32} className="text-dark-400 mb-2" />
                                <p className="text-gray-400">Nenhum cliente selecionado</p>
                                <p className="text-xs text-gray-500 mt-1">Você pode vender sem selecionar um cliente</p>
                              </div>
                            )}
                          </CardBody>
                        </Card>
                        
                        {/* Payment Method Section */}
                        <Card>
                          <CardHeader>
                            <h4 className="font-medium">Forma de Pagamento</h4>
                          </CardHeader>
                          <CardBody>
                            <div className="grid grid-cols-2 gap-2">
                              <button
                                className={`flex flex-col items-center justify-center p-3 rounded-lg border ${
                                  paymentMethod === 'credit_card' 
                                    ? 'border-primary-500 bg-primary-500/10' 
                                    : 'border-dark-600 hover:border-dark-500'
                                }`}
                                onClick={() => setPaymentMethod('credit_card')}
                              >
                                <CreditCard size={24} className={paymentMethod === 'credit_card' ? 'text-primary-400' : 'text-gray-400'} />
                                <span className={`text-sm mt-1 ${paymentMethod === 'credit_card' ? 'text-primary-300' : 'text-gray-400'}`}>
                                  Crédito
                                </span>
                              </button>
                              
                              <button
                                className={`flex flex-col items-center justify-center p-3 rounded-lg border ${
                                  paymentMethod === 'debit_card' 
                                    ? 'border-primary-500 bg-primary-500/10' 
                                    : 'border-dark-600 hover:border-dark-500'
                                }`}
                                onClick={() => setPaymentMethod('debit_card')}
                              >
                                <CreditCard size={24} className={paymentMethod === 'debit_card' ? 'text-primary-400' : 'text-gray-400'} />
                                <span className={`text-sm mt-1 ${paymentMethod === 'debit_card' ? 'text-primary-300' : 'text-gray-400'}`}>
                                  Débito
                                </span>
                              </button>
                              
                              <button
                                className={`flex flex-col items-center justify-center p-3 rounded-lg border ${
                                  paymentMethod === 'cash' 
                                    ? 'border-primary-500 bg-primary-500/10' 
                                    : 'border-dark-600 hover:border-dark-500'
                                }`}
                                onClick={() => setPaymentMethod('cash')}
                              >
                                <Banknote size={24} className={paymentMethod === 'cash' ? 'text-primary-400' : 'text-gray-400'} />
                                <span className={`text-sm mt-1 ${paymentMethod === 'cash' ? 'text-primary-300' : 'text-gray-400'}`}>
                                  Dinheiro
                                </span>
                              </button>
                              
                              <button
                                className={`flex flex-col items-center justify-center p-3 rounded-lg border ${
                                  paymentMethod === 'pix' 
                                    ? 'border-primary-500 bg-primary-500/10' 
                                    : 'border-dark-600 hover:border-dark-500'
                                }`}
                                onClick={() => setPaymentMethod('pix')}
                              >
                                <QrCode size={24} className={paymentMethod === 'pix' ? 'text-primary-400' : 'text-gray-400'} />
                                <span className={`text-sm mt-1 ${paymentMethod === 'pix' ? 'text-primary-300' : 'text-gray-400'}`}>
                                  Pix
                                </span>
                              </button>
                            </div>
                          </CardBody>
                        </Card>
                        
                        {/* Summary Section */}
                        <Card>
                          <CardHeader className="flex items-center gap-2">
                            <Receipt size={18} />
                            <h4 className="font-medium">Resumo</h4>
                          </CardHeader>
                          <CardBody>
                            <div className="space-y-2">
                              <div className="flex justify-between">
                                <span className="text-gray-400">Subtotal:</span>
                                <span>{calculateTotal().toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</span>
                              </div>
                              <div className="flex justify-between font-medium">
                                <span>Total:</span>
                                <span className="text-xl">{calculateTotal().toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</span>
                              </div>
                            </div>
                          </CardBody>
                        </Card>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="px-6 py-4 border-t border-dark-700 flex justify-between sticky bottom-0 bg-dark-800 z-10">
                  <Button
                    type="button"
                    variant="dark"
                    onClick={closeNewSaleModal}
                  >
                    Cancelar
                  </Button>
                  <Button
                    type="button"
                    variant="primary"
                    onClick={handleCreateSale}
                    className="flex items-center gap-2"
                    disabled={selectedProducts.length === 0}
                  >
                    <Calculator size={18} />
                    <span>{selectedSale ? 'Atualizar Venda' : 'Finalizar Venda'}</span>
                  </Button>
                </div>
              </motion.div>
            </div>
          </div>
        )}
      </AnimatePresence>

      {/* New Customer Form Modal */}
      <AnimatePresence>
        {isAddingNewCustomer && (
          <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex items-center justify-center min-h-screen px-4">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="fixed inset-0 bg-black/60"
                onClick={() => setIsAddingNewCustomer(false)}
              ></motion.div>
              
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                className="relative bg-dark-800 rounded-xl shadow-xl w-full max-w-2xl border border-dark-700 z-10"
              >
                <div className="px-6 py-4 border-b border-dark-700">
                  <h3 className="text-xl font-semibol
d text-white">Novo Cliente</h3>
                </div>
                
                <form onSubmit={handleSubmitCustomer(handleAddNewCustomer)}>
                  <div className="p-6 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-1">Nome</label>
                        <input
                          id="name"
                          className={`input ${customerErrors.name ? 'border-error-dark' : ''}`}
                          {...registerCustomer('name', { required: true })}
                        />
                        {customerErrors.name && <p className="mt-1 text-xs text-error-light">Nome é obrigatório</p>}
                      </div>
                      
                      <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1">Email</label>
                        <input
                          id="email"
                          type="email"
                          className={`input ${customerErrors.email ? 'border-error-dark' : ''}`}
                          {...registerCustomer('email', { required: true, pattern: /^\S+@\S+$/i })}
                        />
                        {customerErrors.email && <p className="mt-1 text-xs text-error-light">Email válido é obrigatório</p>}
                      </div>
                      
                      <div>
                        <label htmlFor="phone" className="block text-sm font-medium text-gray-300 mb-1">Telefone</label>
                        <input
                          id="phone"
                          className={`input ${customerErrors.phone ? 'border-error-dark' : ''}`}
                          placeholder="(99) 99999-9999"
                          {...registerCustomer('phone', { required: true })}
                        />
                        {customerErrors.phone && <p className="mt-1 text-xs text-error-light">Telefone é obrigatório</p>}
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
                          {...registerCustomer('birthday')}
                        />
                      </div>
                      
                      <div className="md:col-span-2">
                        <label htmlFor="address" className="block text-sm font-medium text-gray-300 mb-1">Endereço</label>
                        <input
                          id="address"
                          className={`input ${customerErrors.address ? 'border-error-dark' : ''}`}
                          placeholder="Rua, número, bairro, cidade, estado"
                          {...registerCustomer('address', { required: true })}
                        />
                        {customerErrors.address && <p className="mt-1 text-xs text-error-light">Endereço é obrigatório</p>}
                      </div>
                    </div>
                  </div>
                  
                  <div className="px-6 py-4 border-t border-dark-700 flex justify-end gap-3">
                    <Button
                      type="button"
                      variant="dark"
                      onClick={() => setIsAddingNewCustomer(false)}
                    >
                      Cancelar
                    </Button>
                    <Button
                      type="submit"
                      variant="primary"
                    >
                      Adicionar Cliente
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

export default Sales;