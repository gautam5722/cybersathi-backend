
import 'reflect-metadata';
import 'dotenv/config';
import * as bcrypt from 'bcrypt';
import { DataSource } from 'typeorm';
import { Admin } from '../auth/entities/admin.entity.js';
import { AdminRole } from '../auth/enums/admin-role.enum.js';

const dataSource = new DataSource({
  type: 'mysql',
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT || 3306),
  username: process.env.DB_USERNAME || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_DATABASE || 'cybersathi_db',
  entities: [Admin],
  synchronize: false,
});

async function createAdmin() {
  const email = process.env.ADMIN_EMAIL?.trim().toLowerCase();
  const password = process.env.ADMIN_PASSWORD;

  if (!email || !password) {
    throw new Error('ADMIN_EMAIL and ADMIN_PASSWORD must be set in .env');
  }

  if (password.length < 12) {
    throw new Error('Admin password must be at least 12 characters');
  }

  await dataSource.initialize();

  try {
    const repository = dataSource.getRepository(Admin);

    const existingAdmin = await repository.findOne({
      where: { email },
    });

    if (existingAdmin) {
      console.log('Admin with this email already exists.');
      return;
    }

    const passwordHash = await bcrypt.hash(password, 12);

    await repository.save(
      repository.create({
        email,
        passwordHash,
        role: AdminRole.ADMIN,
      }),
    );

    console.log('Initial admin created successfully.');
  } finally {
    await dataSource.destroy();
  }
}

createAdmin().catch((error) => {
  console.error('Admin setup failed:', error.message);
  process.exitCode = 1;
});
