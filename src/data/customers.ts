export type Customer = {
  id: string;
  name: string;
  phone: string;
  email: string;
  address: string;
  birthday: string;
  createdAt: string;
  purchases: number;
  lastPurchase: string | null;
};

export const mockCustomers: Customer[] = [
  {
    id: '1',
    name: 'Ana Silva',
    phone: '(31) 98765-4321',
    email: 'ana.silva@email.com',
    address: 'Rua dos Tupis, 123, Centro, Belo Horizonte, MG',
    birthday: '1990-05-15',
    createdAt: '2023-01-10',
    purchases: 5,
    lastPurchase: '2023-09-12',
  },
  {
    id: '2',
    name: 'Carlos Oliveira',
    phone: '(31) 97654-3210',
    email: 'carlos.oliveira@email.com',
    address: 'Av. Afonso Pena, 1000, Centro, Belo Horizonte, MG',
    birthday: '1985-08-22',
    createdAt: '2023-02-05',
    purchases: 3,
    lastPurchase: '2023-10-15',
  },
  {
    id: '3',
    name: 'Mariana Costa',
    phone: '(31) 96543-2109',
    email: 'mariana.costa@email.com',
    address: 'Rua da Bahia, 789, Centro, Belo Horizonte, MG',
    birthday: '1992-11-30',
    createdAt: '2023-03-12',
    purchases: 2,
    lastPurchase: '2023-07-08',
  },
  {
    id: '4',
    name: 'Rafael Santos',
    phone: '(31) 95432-1098',
    email: 'rafael.santos@email.com',
    address: 'Av. do Contorno, 456, Funcionários, Belo Horizonte, MG',
    birthday: '1988-03-25',
    createdAt: '2023-01-30',
    purchases: 7,
    lastPurchase: '2023-11-02',
  },
  {
    id: '5',
    name: 'Juliana Lima',
    phone: '(31) 94321-0987',
    email: 'juliana.lima@email.com',
    address: 'Rua Sergipe, 345, Savassi, Belo Horizonte, MG',
    birthday: '1995-07-12',
    createdAt: '2023-04-18',
    purchases: 1,
    lastPurchase: '2023-08-29',
  },
  {
    id: '6',
    name: 'Fernando Dias',
    phone: '(31) 93210-9876',
    email: 'fernando.dias@email.com',
    address: 'Av. Prudente de Morais, 567, Santo Antônio, Belo Horizonte, MG',
    birthday: '1980-12-05',
    createdAt: '2023-02-22',
    purchases: 4,
    lastPurchase: '2023-10-31',
  },
  {
    id: '7',
    name: 'Gabriela Martins',
    phone: '(31) 92109-8765',
    email: 'gabriela.martins@email.com',
    address: 'Rua Pernambuco, 890, Savassi, Belo Horizonte, MG',
    birthday: '1993-04-18',
    createdAt: '2023-03-01',
    purchases: 2,
    lastPurchase: '2023-09-05',
  },
  {
    id: '8',
    name: 'Rodrigo Alves',
    phone: '(31) 91098-7654',
    email: 'rodrigo.alves@email.com',
    address: 'Rua Rio Grande do Sul, 234, Santa Efigênia, Belo Horizonte, MG',
    birthday: '1983-09-10',
    createdAt: '2023-05-15',
    purchases: 6,
    lastPurchase: null,
  },
];