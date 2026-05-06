import { prisma } from '../src/lib/prisma.js';

async function verify() {
  const users = await prisma.user.count();
  const students = await prisma.student.count();
  console.log('Users:', users);
  console.log('Students:', students);
  await prisma.$disconnect();
}

verify();
