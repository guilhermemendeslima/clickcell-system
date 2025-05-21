export type PaymentMethod = 'credit_card' | 'debit_card' | 'cash' | 'pix';

export type PaymentInstallment = {
  number: number;
  value: number;
};

export type PaymentDetail = {
  method: PaymentMethod;
  amount: number;
  installments?: PaymentInstallment[];
};

export type Sale = {
  id: string;
  customerId: string | null;
  customerName: string | null;
  date: string;
  items: SaleItem[];
  total: number;
  payments: PaymentDetail[];
  employeeId: string;
  employeeName: string;
  status: 'completed' | 'canceled';
};

export type SaleItem = {
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
};

export const mockSales: Sale[] = [
  {
    id: 'V-2023-001',
    customerId: '1',
    customerName: 'Ana Silva',
    date: '2023-09-12T14:30:00Z',
    items: [
      {
        productId: '1',
        productName: 'iPhone 13 Pro',
        quantity: 1,
        unitPrice: 8199.99,
        subtotal: 8199.99,
      },
      {
        productId: '3',
        productName: 'AirPods Pro',
        quantity: 1,
        unitPrice: 1799.99,
        subtotal: 1799.99,
      },
    ],
    total: 9999.98,
    payments: [
      {
        method: 'credit_card',
        amount: 9999.98,
        installments: [
          { number: 1, value: 3333.33 },
          { number: 2, value: 3333.33 },
          { number: 3, value: 3333.32 },
        ],
      },
    ],
    employeeId: '2',
    employeeName: 'Marina Souza',
    status: 'completed',
  },
  {
    id: 'V-2023-002',
    customerId: '2',
    customerName: 'Carlos Oliveira',
    date: '2023-10-15T10:15:00Z',
    items: [
      {
        productId: '2',
        productName: 'Samsung Galaxy S22',
        quantity: 1,
        unitPrice: 4499.99,
        subtotal: 4499.99,
      },
      {
        productId: '4',
        productName: 'Carregador USB-C 20W',
        quantity: 2,
        unitPrice: 129.99,
        subtotal: 259.98,
      },
      {
        productId: '8',
        productName: 'Capa Protetora iPhone 14',
        quantity: 1,
        unitPrice: 89.99,
        subtotal: 89.99,
      },
    ],
    total: 4849.96,
    payments: [
      { method: 'cash', amount: 2000.00 },
      { 
        method: 'credit_card', 
        amount: 2849.96,
        installments: [
          { number: 1, value: 1424.98 },
          { number: 2, value: 1424.98 },
        ],
      },
    ],
    employeeId: '4',
    employeeName: 'Juliana Alves',
    status: 'completed',
  },
  {
    id: 'V-2023-003',
    customerId: '5',
    customerName: 'Juliana Lima',
    date: '2023-08-29T16:45:00Z',
    items: [
      {
        productId: '6',
        productName: 'iPad Pro 11"',
        quantity: 1,
        unitPrice: 6799.99,
        subtotal: 6799.99,
      },
    ],
    total: 6799.99,
    payments: [
      { method: 'pix', amount: 6799.99 },
    ],
    employeeId: '2',
    employeeName: 'Marina Souza',
    status: 'completed',
  },
  {
    id: 'V-2023-004',
    customerId: null,
    customerName: null,
    date: '2023-10-10T09:30:00Z',
    items: [
      {
        productId: '4',
        productName: 'Carregador USB-C 20W',
        quantity: 1,
        unitPrice: 129.99,
        subtotal: 129.99,
      },
      {
        productId: '8',
        productName: 'Capa Protetora iPhone 14',
        quantity: 1,
        unitPrice: 89.99,
        subtotal: 89.99,
      },
    ],
    total: 219.98,
    payments: [
      { method: 'cash', amount: 219.98 },
    ],
    employeeId: '4',
    employeeName: 'Juliana Alves',
    status: 'completed',
  },
  {
    id: 'V-2023-005',
    customerId: '3',
    customerName: 'Mariana Costa',
    date: '2023-07-08T11:20:00Z',
    items: [
      {
        productId: '3',
        productName: 'AirPods Pro',
        quantity: 1,
        unitPrice: 1799.99,
        subtotal: 1799.99,
      },
    ],
    total: 1799.99,
    payments: [
      { method: 'debit_card', amount: 1799.99 },
    ],
    employeeId: '2',
    employeeName: 'Marina Souza',
    status: 'completed',
  },
];

export const paymentMethodTranslations: Record<PaymentMethod, string> = {
  credit_card: 'Cartão de Crédito',
  debit_card: 'Cartão de Débito',
  cash: 'Dinheiro',
  pix: 'Pix',
};

export const installmentOptions = [
  { value: 1, label: 'À vista' },
  { value: 2, label: '2x sem juros' },
  { value: 3, label: '3x sem juros' },
  { value: 4, label: '4x sem juros' },
  { value: 5, label: '5x sem juros' },
  { value: 6, label: '6x sem juros' },
  { value: 7, label: '7x sem juros' },
  { value: 8, label: '8x sem juros' },
  { value: 9, label: '9x sem juros' },
  { value: 10, label: '10x sem juros' },
  { value: 11, label: '11x sem juros' },
  { value: 12, label: '12x sem juros' },
];