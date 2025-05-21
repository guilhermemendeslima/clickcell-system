export type ServiceOrder = {
  id: string;
  customerId: string;
  customerName: string;
  deviceType: string;
  deviceModel: string;
  defect: string;
  imei: string;
  password: string;
  budget: number | null;
  notes: string;
  status: 'pending' | 'diagnosing' | 'waiting_approval' | 'in_progress' | 'completed' | 'delivered' | 'cancelled';
  createdAt: string;
  updatedAt: string;
  technicianId: string | null;
  technicianName: string | null;
};

export const mockServiceOrders: ServiceOrder[] = [
  {
    id: 'OS-2023-001',
    customerId: '1',
    customerName: 'Ana Silva',
    deviceType: 'Smartphone',
    deviceModel: 'iPhone 12',
    defect: 'Tela quebrada',
    imei: '352789102345678',
    password: '1234',
    budget: 799.99,
    notes: 'Cliente relatou que o aparelho caiu no chão. Tela quebrada mas ainda funciona.',
    status: 'in_progress',
    createdAt: '2023-06-10T10:30:00Z',
    updatedAt: '2023-06-11T14:15:00Z',
    technicianId: '3',
    technicianName: 'Ricardo Costa',
  },
  {
    id: 'OS-2023-002',
    customerId: '2',
    customerName: 'Carlos Oliveira',
    deviceType: 'Smartphone',
    deviceModel: 'Samsung Galaxy S21',
    defect: 'Não carrega',
    imei: '356789054321890',
    password: '0000',
    budget: null,
    notes: 'Aparelho não carrega. Verificar porta USB-C e bateria.',
    status: 'diagnosing',
    createdAt: '2023-06-12T09:45:00Z',
    updatedAt: '2023-06-12T09:45:00Z',
    technicianId: null,
    technicianName: null,
  },
  {
    id: 'OS-2023-003',
    customerId: '4',
    customerName: 'Rafael Santos',
    deviceType: 'Tablet',
    deviceModel: 'iPad Pro 11"',
    defect: 'Não liga',
    imei: '357123456789012',
    password: '141516',
    budget: 349.99,
    notes: 'Cliente tentou várias vezes ligar o aparelho sem sucesso. Verificar placa e bateria.',
    status: 'waiting_approval',
    createdAt: '2023-06-05T14:20:00Z',
    updatedAt: '2023-06-07T11:30:00Z',
    technicianId: '5',
    technicianName: 'Pedro Santos',
  },
  {
    id: 'OS-2023-004',
    customerId: '6',
    customerName: 'Fernando Dias',
    deviceType: 'Smartphone',
    deviceModel: 'Xiaomi Redmi Note 10',
    defect: 'Câmera não funciona',
    imei: '358765432109876',
    password: '5555',
    budget: 249.99,
    notes: 'Câmera principal não funciona. Câmera frontal ok.',
    status: 'completed',
    createdAt: '2023-06-01T08:50:00Z',
    updatedAt: '2023-06-04T16:25:00Z',
    technicianId: '3',
    technicianName: 'Ricardo Costa',
  },
  {
    id: 'OS-2023-005',
    customerId: '7',
    customerName: 'Gabriela Martins',
    deviceType: 'Smartphone',
    deviceModel: 'Motorola Moto G9',
    defect: 'Tela com manchas',
    imei: '359876543210987',
    password: '1515',
    budget: 399.99,
    notes: 'Tela apresenta manchas escuras na parte inferior. Possível problema de LCD.',
    status: 'delivered',
    createdAt: '2023-05-28T13:15:00Z',
    updatedAt: '2023-06-03T10:20:00Z',
    technicianId: '5',
    technicianName: 'Pedro Santos',
  },
];

export const serviceStatusTranslations: Record<ServiceOrder['status'], string> = {
  pending: 'Pendente',
  diagnosing: 'Diagnóstico',
  waiting_approval: 'Aguardando Aprovação',
  in_progress: 'Em Andamento',
  completed: 'Concluído',
  delivered: 'Entregue',
  cancelled: 'Cancelado',
};

export const serviceStatusColors: Record<ServiceOrder['status'], string> = {
  pending: 'warning',
  diagnosing: 'primary',
  waiting_approval: 'warning',
  in_progress: 'primary',
  completed: 'success',
  delivered: 'success',
  cancelled: 'error',
};