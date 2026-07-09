import database from '../database/database.js';
import bcrypt from 'bcrypt';

async function main() {
  const email = 'admin@portfolio.com';
  const password = 'AdminPassword123';
  
  const existing = await database.user.findUnique({
    where: { email }
  });

  if (existing) {
    console.log('Admin user already exists!');
    return;
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  await database.user.create({
    data: {
      email,
      password: hashedPassword,
      name: 'Admin Rohan'
    }
  });

  console.log('✅ Default admin user created successfully!');
  console.log(`Email: ${email}`);
  console.log(`Password: ${password}`);
}

main()
  .catch((e) => {
    console.error('Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await database.$disconnect();
  });
