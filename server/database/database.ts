import { PrismaClient } from '@prisma/client';

const database = new PrismaClient();

// Explicitly test the connection on startup
database.$connect()
  .then(() => {
    console.log('✅[database]: Connected to PostgreSQL successfully!');
  })
  .catch((error) => {
    console.error('❌[database]: Failed to connect to PostgreSQL:', error);
  });

export default database;
