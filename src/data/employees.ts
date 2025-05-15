export type Employee = {
  id: string;
  name: string;
  email: string;
  role: string;
  hireDate: string;
  phone: string;
  avatar: string;
  status: 'active' | 'inactive';
};

export const mockEmployees: Employee[] = [
  {
    id: '1',
    name: 'Guilherme Mendes',
    email: 'admin@clickcelulares.com',
    role: 'admin',
    hireDate: '2022-01-10',
    phone: '(31) 98765-4321',
    avatar: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg',
    status: 'active',
  },
  {
    id: '2',
    name: 'Marina Souza',
    email: 'vendas@clickcelulares.com',
    role: 'salesperson',
    hireDate: '2022-03-15',
    phone: '(31) 97654-3210',
    avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg',
    status: 'active',
  },
  {
    id: '3',
    name: 'Ricardo Costa',
    email: 'tecnico@clickcelulares.com',
    role: 'technician',
    hireDate: '2022-02-20',
    phone: '(31) 96543-2109',
    avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg',
    status: 'active',
  },
  {
    id: '4',
    name: 'Juliana Alves',
    email: 'juliana.alves@clickcelulares.com',
    role: 'salesperson',
    hireDate: '2022-04-05',
    phone: '(31) 95432-1098',
    avatar: 'https://images.pexels.com/photos/773371/pexels-photo-773371.jpeg',
    status: 'active',
  },
  {
    id: '5',
    name: 'Pedro Santos',
    email: 'pedro.santos@clickcelulares.com',
    role: 'technician',
    hireDate: '2022-05-12',
    phone: '(31) 94321-0987',
    avatar: 'https://images.pexels.com/photos/91227/pexels-photo-91227.jpeg',
    status: 'inactive',
  },
];