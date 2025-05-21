export type DeviceType = 'smartphone' | 'tablet' | 'desktop' | 'videogame';

export type DeviceDetails = {
  brand?: string;
  model?: string;
  serialNumber?: string;
  condition?: string;
} & (
  | {
      type: 'smartphone' | 'tablet';
      imei: string;
      password?: string;
    }
  | {
      type: 'desktop';
      processor: string;
      ram: string;
      storage: string;
      operatingSystem: string;
      peripherals: string[];
    }
  | {
      type: 'videogame';
      version: string;
      storageCapacity: string;
      accessories: string[];
    }
);

export type ServiceOrder = {
  id: string;
  customerId: string;
  customerName: string;
  deviceDetails: DeviceDetails;
  defect: string;
  budget: number | null;
  notes: string;
  status: 'pending' | 'diagnosing' | 'waiting_approval' | 'in_progress' | 'completed' | 'delivered' | 'cancelled';
  estimatedCompletionDate: string | null;
  technicalNotes: string;
  maintenanceHistory: {
    date: string;
    description: string;
    technician: string;
  }[];
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
    deviceDetails: {
      type: 'smartphone',
      brand: 'Apple',
      model: 'iPhone 12',
      imei: '352789102345678',
      password: '1234',
      condition: 'Bom estado, pequenos arranhões',
    },
    defect: 'Tela quebrada',
    budget: 799.99,
    notes: 'Cliente relatou que o aparelho caiu no chão. Tela quebrada mas ainda funciona.',
    technicalNotes: 'Necessária substituição do display completo',
    estimatedCompletionDate: '2023-06-13T14:15:00Z',
    maintenanceHistory: [
      {
        date: '2023-06-11T14:15:00Z',
        description: 'Diagnóstico inicial realizado',
        technician: 'Ricardo Costa',
      }
    ],
    status: 'in_progress',
    createdAt: '2023-06-10T10:30:00Z',
    updatedAt: '2023-06-11T14:15:00Z',
    technicianId: '3',
    technicianName: 'Ricardo Costa',
  },
  {
    id: 'OS-2023-006',
    customerId: '4',
    customerName: 'Rafael Santos',
    deviceDetails: {
      type: 'desktop',
      brand: 'Dell',
      model: 'Inspiron Desktop',
      serialNumber: 'DLL123456789',
      processor: 'Intel Core i7-11700',
      ram: '16GB DDR4',
      storage: 'SSD 512GB + HD 1TB',
      operatingSystem: 'Windows 11 Pro',
      peripherals: ['Teclado Dell', 'Mouse Dell', 'Monitor Dell 24"'],
      condition: 'Bom estado geral',
    },
    defect: 'Não liga após queda de energia',
    budget: 350.00,
    notes: 'Cliente relatou que após uma queda de energia o computador parou de ligar',
    technicalNotes: 'Possível problema na fonte de alimentação',
    estimatedCompletionDate: '2023-06-15T17:00:00Z',
    maintenanceHistory: [],
    status: 'diagnosing',
    createdAt: '2023-06-12T09:00:00Z',
    updatedAt: '2023-06-12T09:00:00Z',
    technicianId: '5',
    technicianName: 'Pedro Santos',
  },
  {
    id: 'OS-2023-007',
    customerId: '6',
    customerName: 'Fernando Dias',
    deviceDetails: {
      type: 'videogame',
      brand: 'Sony',
      model: 'PlayStation 4',
      serialNumber: 'PS4XB123456',
      version: 'Pro',
      storageCapacity: '1TB',
      accessories: ['2 Controles DualShock 4', 'Cabo HDMI', 'Cabo de energia'],
      condition: 'Algumas marcas de uso',
    },
    defect: 'Superaquecimento e desligamento durante jogos',
    budget: 280.00,
    notes: 'Console desliga após 30 minutos de uso',
    technicalNotes: 'Necessária limpeza interna e troca da pasta térmica',
    estimatedCompletionDate: '2023-06-14T16:00:00Z',
    maintenanceHistory: [],
    status: 'waiting_approval',
    createdAt: '2023-06-11T15:30:00Z',
    updatedAt: '2023-06-11T16:45:00Z',
    technicianId: '3',
    technicianName: 'Ricardo Costa',
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

export const deviceTypeTranslations: Record<DeviceType, string> = {
  smartphone: 'Smartphone',
  tablet: 'Tablet',
  desktop: 'Computador',
  videogame: 'Video Game',
};