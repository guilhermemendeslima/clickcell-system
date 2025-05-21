import { useState, useEffect } from 'react';
import { PaymentMethod, PaymentDetail, installmentOptions } from '../../data/sales';
import Button from '../UI/Button';
import Input from '../UI/Input';
import { CreditCard, Banknote, QrCode, Plus, X, Calculator } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface PaymentFormProps {
  total: number;
  onComplete: (payments: PaymentDetail[]) => void;
  onCancel: () => void;
}

const PaymentForm = ({ total, onComplete, onCancel }: PaymentFormProps) => {
  const [payments, setPayments] = useState<PaymentDetail[]>([]);
  const [currentAmount, setCurrentAmount] = useState<string>('');
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod>('credit_card');
  const [installments, setInstallments] = useState(1);
  const [error, setError] = useState('');
  
  const remainingTotal = total - payments.reduce((sum, payment) => sum + payment.amount, 0);
  
  useEffect(() => {
    if (remainingTotal === 0) {
      setCurrentAmount('');
    } else if (payments.length === 0) {
      setCurrentAmount(remainingTotal.toFixed(2));
    }
  }, [remainingTotal, payments.length]);
  
  const handleAddPayment = () => {
    const amount = parseFloat(currentAmount);
    
    if (isNaN(amount) || amount <= 0) {
      setError('Valor inválido');
      return;
    }
    
    if (amount > remainingTotal) {
      setError('Valor excede o total restante');
      return;
    }
    
    const newPayment: PaymentDetail = {
      method: selectedMethod,
      amount,
    };
    
    if (selectedMethod === 'credit_card' && installments > 1) {
      const installmentValue = amount / installments;
      newPayment.installments = Array.from({ length: installments }, (_, i) => ({
        number: i + 1,
        value: i === installments - 1 
          ? amount - (installmentValue * (installments - 1)) // Last installment gets remaining cents
          : installmentValue
      }));
    }
    
    setPayments([...payments, newPayment]);
    setError('');
    
    if (amount === remainingTotal) {
      onComplete([...payments, newPayment]);
    } else {
      setCurrentAmount(remainingTotal.toFixed(2));
    }
  };
  
  const removePayment = (index: number) => {
    const newPayments = payments.filter((_, i) => i !== index);
    setPayments(newPayments);
    setCurrentAmount(remainingTotal.toFixed(2));
  };
  
  const formatCurrency = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    const currency = (parseFloat(numbers) / 100).toFixed(2);
    return currency;
  };
  
  const handleAmountChange = (value: string) => {
    const formattedValue = formatCurrency(value);
    setCurrentAmount(formattedValue);
    setError('');
  };

  return (
    <div className="space-y-6">
      {/* Payment Methods */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        <button
          type="button"
          onClick={() => setSelectedMethod('credit_card')}
          className={`flex flex-col items-center justify-center p-3 rounded-lg border ${
            selectedMethod === 'credit_card' 
              ? 'border-primary-500 bg-primary-500/10' 
              : 'border-dark-600 hover:border-dark-500'
          }`}
        >
          <CreditCard size={24} className={selectedMethod === 'credit_card' ? 'text-primary-400' : 'text-gray-400'} />
          <span className={`text-sm mt-1 ${selectedMethod === 'credit_card' ? 'text-primary-300' : 'text-gray-400'}`}>
            Crédito
          </span>
        </button>
        
        <button
          type="button"
          onClick={() => {
            setSelectedMethod('debit_card');
            setInstallments(1);
          }}
          className={`flex flex-col items-center justify-center p-3 rounded-lg border ${
            selectedMethod === 'debit_card' 
              ? 'border-primary-500 bg-primary-500/10' 
              : 'border-dark-600 hover:border-dark-500'
          }`}
        >
          <CreditCard size={24} className={selectedMethod === 'debit_card' ? 'text-primary-400' : 'text-gray-400'} />
          <span className={`text-sm mt-1 ${selectedMethod === 'debit_card' ? 'text-primary-300' : 'text-gray-400'}`}>
            Débito
          </span>
        </button>
        
        <button
          type="button"
          onClick={() => {
            setSelectedMethod('cash');
            setInstallments(1);
          }}
          className={`flex flex-col items-center justify-center p-3 rounded-lg border ${
            selectedMethod === 'cash' 
              ? 'border-primary-500 bg-primary-500/10' 
              : 'border-dark-600 hover:border-dark-500'
          }`}
        >
          <Banknote size={24} className={selectedMethod === 'cash' ? 'text-primary-400' : 'text-gray-400'} />
          <span className={`text-sm mt-1 ${selectedMethod === 'cash' ? 'text-primary-300' : 'text-gray-400'}`}>
            Dinheiro
          </span>
        </button>
        
        <button
          type="button"
          onClick={() => {
            setSelectedMethod('pix');
            setInstallments(1);
          }}
          className={`flex flex-col items-center justify-center p-3 rounded-lg border ${
            selectedMethod === 'pix' 
              ? 'border-primary-500 bg-primary-500/10' 
              : 'border-dark-600 hover:border-dark-500'
          }`}
        >
          <QrCode size={24} className={selectedMethod === 'pix' ? 'text-primary-400' : 'text-gray-400'} />
          <span className={`text-sm mt-1 ${selectedMethod === 'pix' ? 'text-primary-300' : 'text-gray-400'}`}>
            Pix
          </span>
        </button>
      </div>
      
      {/* Amount and Installments */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">Valor</label>
          <Input
            type="text"
            value={currentAmount}
            onChange={(e) => handleAmountChange(e.target.value)}
            placeholder="0,00"
            error={!!error}
            helperText={error || `Restante: ${remainingTotal.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}`}
          />
        </div>
        
        {selectedMethod === 'credit_card' && (
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Parcelas</label>
            <select
              className="input"
              value={installments}
              onChange={(e) => setInstallments(parseInt(e.target.value))}
            >
              {installmentOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                  {option.value > 1 && currentAmount && ` (${(parseFloat(currentAmount) / option.value).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })} cada)`}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>
      
      {/* Add Payment Button */}
      <div className="flex justify-end">
        <Button
          type="button"
          variant="dark"
          onClick={handleAddPayment}
          disabled={!currentAmount || parseFloat(currentAmount) <= 0}
          className="flex items-center gap-2"
        >
          <Plus size={18} />
          <span>Adicionar Pagamento</span>
        </Button>
      </div>
      
      {/* Payment List */}
      <div className="space-y-3">
        <AnimatePresence>
          {payments.map((payment, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="p-3 border border-dark-600 rounded-lg"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {payment.method === 'credit_card' && <CreditCard size={20} className="text-primary-400" />}
                  {payment.method === 'debit_card' && <CreditCard size={20} className="text-success-light" />}
                  {payment.method === 'cash' && <Banknote size={20} className="text-warning-light" />}
                  {payment.method === 'pix' && <QrCode size={20} className="text-primary-400" />}
                  <div>
                    <div className="font-medium">
                      {payment.amount.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                    </div>
                    <div className="text-sm text-gray-400">
                      {payment.installments 
                        ? `${payment.installments.length}x de ${(payment.amount / payment.installments.length).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}` 
                        : 'À vista'
                      }
                    </div>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => removePayment(index)}
                  className="p-1 text-gray-400 hover:text-error-light rounded-md hover:bg-dark-600"
                >
                  <X size={18} />
                </button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
      
      {/* Actions */}
      <div className="flex justify-between border-t border-dark-700 pt-4">
        <Button
          type="button"
          variant="dark"
          onClick={onCancel}
        >
          Cancelar
        </Button>
        
        <Button
          type="button"
          variant="primary"
          onClick={() => onComplete(payments)}
          disabled={remainingTotal > 0}
          className="flex items-center gap-2"
        >
          <Calculator size={18} />
          <span>Finalizar Pagamento</span>
        </Button>
      </div>
    </div>
  );
};

export default PaymentForm;