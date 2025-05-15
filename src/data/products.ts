export type Product = {
  id: string;
  name: string;
  description: string;
  category: 'smartphones' | 'accessories' | 'parts' | 'tablets';
  purchasePrice: number;
  sellingPrice: number;
  quantity: number;
  lowStockThreshold: number;
  imageUrl: string;
  sku: string;
  createdAt: string;
};

export const mockProducts: Product[] = [
  {
    id: '1',
    name: 'iPhone 13 Pro',
    description: 'Apple iPhone 13 Pro 256GB, tela Super Retina XDR de 6,1"',
    category: 'smartphones',
    purchasePrice: 6500,
    sellingPrice: 8199.99,
    quantity: 8,
    lowStockThreshold: 5,
    imageUrl: 'https://images.pexels.com/photos/5750001/pexels-photo-5750001.jpeg',
    sku: 'IPH-13P-256',
    createdAt: '2023-01-15',
  },
  {
    id: '2',
    name: 'Samsung Galaxy S22',
    description: 'Samsung Galaxy S22 128GB, 6,1" Dynamic AMOLED 2X',
    category: 'smartphones',
    purchasePrice: 3800,
    sellingPrice: 4499.99,
    quantity: 12,
    lowStockThreshold: 5,
    imageUrl: 'https://images.pexels.com/photos/13060599/pexels-photo-13060599.jpeg',
    sku: 'SAM-S22-128',
    createdAt: '2023-02-10',
  },
  {
    id: '3',
    name: 'AirPods Pro',
    description: 'Apple AirPods Pro com cancelamento de ruído',
    category: 'accessories',
    purchasePrice: 1200,
    sellingPrice: 1799.99,
    quantity: 15,
    lowStockThreshold: 5,
    imageUrl: 'https://images.pexels.com/photos/3780681/pexels-photo-3780681.jpeg',
    sku: 'APP-PRO-01',
    createdAt: '2023-01-20',
  },
  {
    id: '4',
    name: 'Carregador USB-C 20W',
    description: 'Carregador rápido USB-C de 20W para smartphones',
    category: 'accessories',
    purchasePrice: 50,
    sellingPrice: 129.99,
    quantity: 25,
    lowStockThreshold: 10,
    imageUrl: 'https://images.pexels.com/photos/4526407/pexels-photo-4526407.jpeg',
    sku: 'CHG-USBC-20W',
    createdAt: '2023-03-05',
  },
  {
    id: '5',
    name: 'Tela iPhone 11',
    description: 'Tela de reposição original para iPhone 11',
    category: 'parts',
    purchasePrice: 450,
    sellingPrice: 899.99,
    quantity: 4,
    lowStockThreshold: 3,
    imageUrl: 'https://images.pexels.com/photos/1294886/pexels-photo-1294886.jpeg',
    sku: 'PRT-SCR-IP11',
    createdAt: '2023-04-12',
  },
  {
    id: '6',
    name: 'iPad Pro 11"',
    description: 'iPad Pro 11" M2 chip, 256GB, Wi-Fi',
    category: 'tablets',
    purchasePrice: 5200,
    sellingPrice: 6799.99,
    quantity: 7,
    lowStockThreshold: 3,
    imageUrl: 'https://images.pexels.com/photos/1334597/pexels-photo-1334597.jpeg',
    sku: 'IPD-PRO-M2',
    createdAt: '2023-02-15',
  },
  {
    id: '7',
    name: 'Bateria Galaxy S21',
    description: 'Bateria de reposição para Samsung Galaxy S21',
    category: 'parts',
    purchasePrice: 120,
    sellingPrice: 249.99,
    quantity: 2,
    lowStockThreshold: 5,
    imageUrl: 'https://images.pexels.com/photos/6758685/pexels-photo-6758685.jpeg',
    sku: 'PRT-BAT-S21',
    createdAt: '2023-03-22',
  },
  {
    id: '8',
    name: 'Capa Protetora iPhone 14',
    description: 'Capa transparente anti-impacto para iPhone 14',
    category: 'accessories',
    purchasePrice: 25,
    sellingPrice: 89.99,
    quantity: 30,
    lowStockThreshold: 10,
    imageUrl: 'https://images.pexels.com/photos/4071887/pexels-photo-4071887.jpeg',
    sku: 'ACC-CASE-IP14',
    createdAt: '2023-05-01',
  },
];