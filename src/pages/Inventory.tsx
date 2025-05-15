import { useState } from 'react';
import { Card, CardHeader, CardBody } from '../components/UI/Card';
import Button from '../components/UI/Button';
import Badge from '../components/UI/Badge';
import { Search, Plus, Edit, Trash2, Tag, DollarSign, PackageOpen } from 'lucide-react';
import { mockProducts, Product } from '../data/products';
import { motion, AnimatePresence } from 'framer-motion';
import { useForm } from 'react-hook-form';

type ProductCategory = 'smartphones' | 'accessories' | 'parts' | 'tablets';

const categoryTranslations: Record<ProductCategory, string> = {
  smartphones: 'Smartphones',
  accessories: 'Acessórios',
  parts: 'Peças',
  tablets: 'Tablets',
};

const Inventory = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [products, setProducts] = useState(mockProducts);
  const [activeCategory, setActiveCategory] = useState<ProductCategory | 'all'>('all');
  
  const { register, handleSubmit, reset, formState: { errors } } = useForm<Product>();
  
  const filteredProducts = products.filter(product => 
    (activeCategory === 'all' || product.category === activeCategory) &&
    (product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
     product.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
     product.sku.toLowerCase().includes(searchTerm.toLowerCase()))
  );
  
  const handleAddProduct = (data: Product) => {
    const newProduct: Product = {
      ...data,
      id: `P-${Date.now()}`,
      createdAt: new Date().toISOString().split('T')[0],
    };
    
    setProducts([newProduct, ...products]);
    closeModal();
  };
  
  const handleEditProduct = (data: Product) => {
    if (selectedProduct) {
      const updatedProducts = products.map(product => 
        product.id === selectedProduct.id ? { ...selectedProduct, ...data } : product
      );
      setProducts(updatedProducts);
      closeModal();
    }
  };
  
  const handleDeleteProduct = (id: string) => {
    if (confirm('Tem certeza que deseja excluir este produto?')) {
      setProducts(products.filter(product => product.id !== id));
    }
  };
  
  const openAddModal = () => {
    setSelectedProduct(null);
    reset({
      category: 'smartphones',
      lowStockThreshold: 5,
      imageUrl: 'https://images.pexels.com/photos/5750001/pexels-photo-5750001.jpeg',
    });
    setIsModalOpen(true);
  };
  
  const openEditModal = (product: Product) => {
    setSelectedProduct(product);
    reset(product);
    setIsModalOpen(true);
  };
  
  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedProduct(null);
    reset({});
  };
  
  const categoryOptions = [
    { value: 'all', label: 'Todos' },
    { value: 'smartphones', label: 'Smartphones' },
    { value: 'accessories', label: 'Acessórios' },
    { value: 'parts', label: 'Peças' },
    { value: 'tablets', label: 'Tablets' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <h1 className="text-3xl font-bold text-white">Estoque</h1>
        <Button 
          variant="primary"
          onClick={openAddModal}
          className="flex items-center gap-2"
        >
          <Plus size={18} />
          <span>Adicionar Produto</span>
        </Button>
      </div>
      
      <div className="flex overflow-x-auto gap-2 pb-2">
        {categoryOptions.map(category => (
          <button
            key={category.value}
            onClick={() => setActiveCategory(category.value as ProductCategory | 'all')}
            className={`px-4 py-2 rounded-lg text-sm whitespace-nowrap ${
              activeCategory === category.value
                ? 'bg-primary-500 text-white'
                : 'bg-dark-700 text-gray-300 hover:bg-dark-600'
            }`}
          >
            {category.label}
          </button>
        ))}
      </div>
      
      <Card>
        <CardHeader className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <h2 className="text-lg font-semibold text-white">Produtos</h2>
          <div className="relative w-full sm:w-64">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <Search size={18} className="text-gray-400" />
            </div>
            <input
              type="text"
              className="input pl-10"
              placeholder="Buscar produtos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </CardHeader>
        <CardBody>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProducts.length > 0 ? (
              filteredProducts.map(product => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="card overflow-hidden border border-dark-600 hover:border-primary-500/30 transition-all duration-300"
                >
                  <div className="h-32 overflow-hidden relative">
                    <img 
                      src={product.imageUrl} 
                      alt={product.name} 
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-0 right-0 m-2">
                      <Badge variant={
                        product.quantity <= product.lowStockThreshold / 2 ? 'error' :
                        product.quantity <= product.lowStockThreshold ? 'warning' : 'success'
                      }>
                        {product.quantity <= product.lowStockThreshold / 2 ? 'Estoque Crítico' :
                         product.quantity <= product.lowStockThreshold ? 'Estoque Baixo' : 'Em Estoque'}
                      </Badge>
                    </div>
                    <div className="absolute bottom-0 left-0 m-2">
                      <Badge variant="dark">
                        {categoryTranslations[product.category]}
                      </Badge>
                    </div>
                  </div>
                  
                  <div className="p-4">
                    <h3 className="text-lg font-semibold text-white mb-1">{product.name}</h3>
                    <p className="text-sm text-gray-400 mb-3">{product.description}</p>
                    
                    <div className="flex justify-between mb-3">
                      <div className="flex items-center gap-1">
                        <Tag size={14} className="text-gray-400" />
                        <span className="text-xs text-gray-400">{product.sku}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <PackageOpen size={14} className="text-gray-400" />
                        <span className={`text-sm font-medium ${
                          product.quantity <= product.lowStockThreshold / 2 ? 'text-error-light' :
                          product.quantity <= product.lowStockThreshold ? 'text-warning-light' : 'text-success-light'
                        }`}>
                          {product.quantity} {product.quantity === 1 ? 'unidade' : 'unidades'}
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex flex-col gap-1 mb-3">
                      <div className="flex justify-between">
                        <div className="text-sm text-gray-400">Preço de Compra:</div>
                        <div className="text-sm font-medium">
                          {product.purchasePrice.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                        </div>
                      </div>
                      <div className="flex justify-between">
                        <div className="text-sm text-gray-400">Preço de Venda:</div>
                        <div className="text-sm font-semibold text-white">
                          {product.sellingPrice.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex gap-2 mt-4">
                      <Button
                        variant="dark"
                        className="flex-1 flex items-center justify-center gap-1"
                        onClick={() => openEditModal(product)}
                      >
                        <Edit size={16} />
                        <span>Editar</span>
                      </Button>
                      <Button
                        variant="outline"
                        className="flex-1 flex items-center justify-center gap-1 text-error-light border-error-light hover:bg-error-dark hover:border-error-dark"
                        onClick={() => handleDeleteProduct(product.id)}
                      >
                        <Trash2 size={16} />
                        <span>Excluir</span>
                      </Button>
                    </div>
                  </div>
                </motion.div>
              ))
            ) : (
              <div className="col-span-full flex items-center justify-center py-8">
                <p className="text-gray-400">Nenhum produto encontrado</p>
              </div>
            )}
          </div>
        </CardBody>
      </Card>
      
      {/* Modal for adding/editing product */}
      <AnimatePresence>
        {isModalOpen && (
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
                    {selectedProduct ? 'Editar Produto' : 'Adicionar Novo Produto'}
                  </h3>
                </div>
                
                <form onSubmit={handleSubmit(selectedProduct ? handleEditProduct : handleAddProduct)}>
                  <div className="p-6 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="md:col-span-2">
                        <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-1">Nome do Produto</label>
                        <input
                          id="name"
                          className={`input ${errors.name ? 'border-error-dark' : ''}`}
                          {...register('name', { required: true })}
                        />
                        {errors.name && <p className="mt-1 text-xs text-error-light">Nome é obrigatório</p>}
                      </div>
                      
                      <div className="md:col-span-2">
                        <label htmlFor="description" className="block text-sm font-medium text-gray-300 mb-1">Descrição</label>
                        <textarea
                          id="description"
                          rows={3}
                          className={`input ${errors.description ? 'border-error-dark' : ''}`}
                          {...register('description', { required: true })}
                        />
                        {errors.description && <p className="mt-1 text-xs text-error-light">Descrição é obrigatória</p>}
                      </div>
                      
                      <div>
                        <label htmlFor="category" className="block text-sm font-medium text-gray-300 mb-1">Categoria</label>
                        <select
                          id="category"
                          className="input"
                          {...register('category', { required: true })}
                        >
                          <option value="smartphones">Smartphones</option>
                          <option value="accessories">Acessórios</option>
                          <option value="parts">Peças</option>
                          <option value="tablets">Tablets</option>
                        </select>
                      </div>
                      
                      <div>
                        <label htmlFor="sku" className="block text-sm font-medium text-gray-300 mb-1">SKU</label>
                        <input
                          id="sku"
                          className={`input ${errors.sku ? 'border-error-dark' : ''}`}
                          {...register('sku', { required: true })}
                        />
                        {errors.sku && <p className="mt-1 text-xs text-error-light">SKU é obrigatório</p>}
                      </div>
                      
                      <div>
                        <label htmlFor="purchasePrice" className="block text-sm font-medium text-gray-300 mb-1">
                          <div className="flex items-center gap-1">
                            <DollarSign size={14} />
                            <span>Preço de Compra</span>
                          </div>
                        </label>
                        <input
                          id="purchasePrice"
                          type="number"
                          step="0.01"
                          className={`input ${errors.purchasePrice ? 'border-error-dark' : ''}`}
                          {...register('purchasePrice', { required: true, min: 0, valueAsNumber: true })}
                        />
                        {errors.purchasePrice && <p className="mt-1 text-xs text-error-light">Preço de compra válido é obrigatório</p>}
                      </div>
                      
                      <div>
                        <label htmlFor="sellingPrice" className="block text-sm font-medium text-gray-300 mb-1">
                          <div className="flex items-center gap-1">
                            <DollarSign size={14} />
                            <span>Preço de Venda</span>
                          </div>
                        </label>
                        <input
                          id="sellingPrice"
                          type="number"
                          step="0.01"
                          className={`input ${errors.sellingPrice ? 'border-error-dark' : ''}`}
                          {...register('sellingPrice', { required: true, min: 0, valueAsNumber: true })}
                        />
                        {errors.sellingPrice && <p className="mt-1 text-xs text-error-light">Preço de venda válido é obrigatório</p>}
                      </div>
                      
                      <div>
                        <label htmlFor="quantity" className="block text-sm font-medium text-gray-300 mb-1">Quantidade em Estoque</label>
                        <input
                          id="quantity"
                          type="number"
                          className={`input ${errors.quantity ? 'border-error-dark' : ''}`}
                          {...register('quantity', { required: true, min: 0, valueAsNumber: true })}
                        />
                        {errors.quantity && <p className="mt-1 text-xs text-error-light">Quantidade válida é obrigatória</p>}
                      </div>
                      
                      <div>
                        <label htmlFor="lowStockThreshold" className="block text-sm font-medium text-gray-300 mb-1">Limite para Estoque Baixo</label>
                        <input
                          id="lowStockThreshold"
                          type="number"
                          className={`input ${errors.lowStockThreshold ? 'border-error-dark' : ''}`}
                          {...register('lowStockThreshold', { required: true, min: 0, valueAsNumber: true })}
                        />
                        {errors.lowStockThreshold && <p className="mt-1 text-xs text-error-light">Valor válido é obrigatório</p>}
                      </div>
                      
                      <div className="md:col-span-2">
                        <label htmlFor="imageUrl" className="block text-sm font-medium text-gray-300 mb-1">URL da Imagem</label>
                        <input
                          id="imageUrl"
                          className={`input ${errors.imageUrl ? 'border-error-dark' : ''}`}
                          {...register('imageUrl', { required: true })}
                        />
                        {errors.imageUrl && <p className="mt-1 text-xs text-error-light">URL da imagem é obrigatória</p>}
                      </div>
                    </div>
                  </div>
                  
                  <div className="px-6 py-4 border-t border-dark-700 flex justify-end gap-3 sticky bottom-0 bg-dark-800 z-10">
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
                      {selectedProduct ? 'Salvar Alterações' : 'Adicionar Produto'}
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

export default Inventory;