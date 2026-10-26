
import 'reflect-metadata';
import 'dotenv/config';
import * as bcrypt from 'bcrypt';
import { DataSource } from 'typeorm';
import { Admin } from '../auth/entities/admin.entity.js';

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

async function resetAdminPassword() {
    const email = process.env.ADMIN_EMAIL?.trim().toLowerCase();
    const password = process.env.ADMIN_PASSWORD;

    if (!email || !password || password.length < 12) {
        throw new Error(
            'Set ADMIN_EMAIL and a strong ADMIN_PASSWORD (at least 12 characters) in .env',
        );
    }

    await dataSource.initialize();

    try {
        const repository = dataSource.getRepository(Admin);
        const admin = await repository.findOne({ where: { email } });

        if (!admin) {
            throw new Error('Admin not found for ADMIN_EMAIL');
        }

        admin.passwordHash = await bcrypt.hash(password, 12);
        const verified = await bcrypt.compare(
            password,
            admin.passwordHash,
        );

        console.log('Reset password verified:', verified);
        await repository.save(admin);

    } finally {
        await dataSource.destroy();
    }
}

resetAdminPassword().catch((error) => {
    console.error('Password reset failed:', error.message);
    process.exitCode = 1;
});
