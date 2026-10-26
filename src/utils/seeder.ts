import dotenv from 'dotenv';
import { Product } from '../models/product.model';
import { connectDB, disconnectDB } from '../config/db';

dotenv.config();

const sampleProducts = [
  {
    title: 'Sony WH-1000XM5 Wireless Headphones',
    description: 'Industry-leading noise canceling with two processors and 8 microphones for crystal clear audio.',
    price: 349.99,
    category: 'Audio',
    stock: 25,
    sku: 'SONY-WH1000XM5-BLK',
    rating: 4.8,
    tags: ['audio', 'noise-canceling', 'wireless', 'bluetooth'],
    isFeatured: true
  },
  {
    title: 'Keychron Q1 Pro Custom Mechanical Keyboard',
    description: 'QMK/VIA wireless custom mechanical keyboard with CNC machined aluminum body.',
    price: 199.5,
    category: 'Accessories',
    stock: 14,
    sku: 'KEYCHRON-Q1-PRO',
    rating: 4.9,
    tags: ['keyboard', 'mechanical', 'custom', 'wireless'],
    isFeatured: true
  },
  {
    title: 'Dell UltraSharp 27 4K USB-C Hub Monitor',
    description: 'Experience pure brilliance on an exceptional 27-inch 4K hub monitor with IPS Black technology.',
    price: 589.0,
    category: 'Computers',
    stock: 8,
    sku: 'DELL-U2723QE-4K',
    rating: 4.7,
    tags: ['monitor', '4k', 'display', 'productivity'],
    isFeatured: true
  },
  {
    title: 'Logitech MX Master 3S Wireless Mouse',
    description: 'Quiet clicks and 8K DPI any-surface tracking with electromagnetic MagSpeed scrolling.',
    price: 99.99,
    category: 'Accessories',
    stock: 32,
    sku: 'LOGI-MXM3S-GRY',
    rating: 4.9,
    tags: ['mouse', 'ergonomic', 'office', 'wireless'],
    isFeatured: false
  },
  {
    title: 'Apple Watch Ultra 2 GPS + Cellular',
    description: 'The most rugged and capable Apple Watch. Designed for outdoor adventure with 3000 nits display.',
    price: 799.0,
    category: 'Wearables',
    stock: 5,
    sku: 'APPLE-WATCH-ULTRA2',
    rating: 4.9,
    tags: ['smartwatch', 'fitness', 'gps', 'apple'],
    isFeatured: true
  },
  {
    title: 'Anker Prime 20,000mAh Power Bank (200W)',
    description: 'Ultra-compact power bank equipped with two high-powered USB-C ports and one USB-A port.',
    price: 129.99,
    category: 'Electronics',
    stock: 3,
    sku: 'ANKER-PRIME-200W',
    rating: 4.6,
    tags: ['powerbank', 'fast-charging', 'travel', 'usb-c'],
    isFeatured: false
  },
  {
    title: 'Razer DeathAdder V3 Pro Gaming Mouse',
    description: 'Ultra-lightweight 63g ergonomic esports mouse with Focus Pro 30K Optical Sensor.',
    price: 149.99,
    category: 'Gaming',
    stock: 0,
    sku: 'RAZER-DAV3-PRO',
    rating: 4.5,
    tags: ['gaming', 'esports', 'lightweight', 'razer'],
    isFeatured: false
  },
  {
    title: 'Ember Temperature Control Smart Mug 2',
    description: 'Allows you to set your precise drinking temperature and keep it there for up to 80 minutes.',
    price: 149.0,
    category: 'Home & Kitchen',
    stock: 12,
    sku: 'EMBER-MUG2-14OZ',
    rating: 4.4,
    tags: ['smart-home', 'kitchen', 'coffee', 'gift'],
    isFeatured: false
  }
];

export const seedDatabase = async (): Promise<void> => {
  try {
    await connectDB();
    console.log('[Seeder] Clearing existing products...');
    await Product.deleteMany({});

    console.log('[Seeder] Inserting sample products...');
    const created = await Product.insertMany(sampleProducts);
    console.log(`[Seeder] Successfully seeded ${created.length} products!`);

    await disconnectDB();
    process.exit(0);
  } catch (error) {
    const errMsg = error instanceof Error ? error.message : String(error);
    console.error('[Seeder] Error during seeding:', errMsg);
    process.exit(1);
  }
};

if (process.argv[1]?.includes('seeder')) {
  seedDatabase();
}
