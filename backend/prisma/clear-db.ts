import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function clearDatabase() {
  console.log('Clearing all data...');

  // Delete in order respecting foreign keys
  await prisma.notification.deleteMany({});
  await prisma.disciplineIncident.deleteMany({});
  await prisma.mark.deleteMany({});
  await prisma.attendance.deleteMany({});
  await prisma.teacherAssignment.deleteMany({});
  await prisma.teacher.deleteMany({});
  await prisma.student.deleteMany({});
  await prisma.term.deleteMany({});
  await prisma.academicYear.deleteMany({});
  await prisma.stream.deleteMany({});
  await prisma.class.deleteMany({});
  await prisma.subject.deleteMany({});
  await prisma.user.deleteMany({});

  console.log('All data cleared successfully!');
  await prisma.$disconnect();
}

clearDatabase().catch((e) => {
  console.error('Error clearing database:', e);
  process.exit(1);
});
