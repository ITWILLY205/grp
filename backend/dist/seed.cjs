"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const prisma = new client_1.PrismaClient();
async function main() {
    console.log('Seeding database...');
    // Create admin user
    const adminPassword = await bcryptjs_1.default.hash('admin123', 10);
    const admin = await prisma.user.upsert({
        where: { username: 'admin' },
        update: {},
        create: {
            username: 'admin',
            password: adminPassword,
            role: 'ADMIN',
            full_name: 'System Administrator',
        },
    });
    console.log('Created admin:', admin.username);
    // Create academic year
    const year = await prisma.academicYear.upsert({
        where: { id: 1 },
        update: {},
        create: {
            name: '2025-2026',
            status: 'Active',
        },
    });
    console.log('Created academic year:', year.name);
    // Create terms
    const terms = [
        { name: 'Term 1', year_id: year.id },
        { name: 'Term 2', year_id: year.id },
        { name: 'Term 3', year_id: year.id },
    ];
    for (const term of terms) {
        await prisma.term.upsert({
            where: { id: terms.indexOf(term) + 1 },
            update: {},
            create: term,
        });
    }
    console.log('Created terms');
    // Create classes
    const classes = ['S1', 'S2', 'S3', 'S4', 'S5', 'S6'];
    for (const className of classes) {
        await prisma.class.upsert({
            where: { id: classes.indexOf(className) + 1 },
            update: {},
            create: { name: className },
        });
    }
    console.log('Created classes');
    // Create streams for S5 and S6
    const s5 = await prisma.class.findFirst({ where: { name: 'S5' } });
    const s6 = await prisma.class.findFirst({ where: { name: 'S6' } });
    if (s5) {
        const streams = ['Science', 'Arts', 'Commerce'];
        for (const stream of streams) {
            await prisma.stream.upsert({
                where: { id: streams.indexOf(stream) + 1 + 100 },
                update: {},
                create: {
                    class_id: s5.id,
                    name: `${stream} (S5)`,
                },
            });
        }
    }
    if (s6) {
        const streams = ['Science', 'Arts', 'Commerce'];
        for (const stream of streams) {
            await prisma.stream.upsert({
                where: { id: streams.indexOf(stream) + 1 + 200 },
                update: {},
                create: {
                    class_id: s6.id,
                    name: `${stream} (S6)`,
                },
            });
        }
    }
    console.log('Created streams');
    // Create subjects
    const subjects = [
        { name: 'Mathematics', code: 'MATH', category: 'CORE' },
        { name: 'English', code: 'ENG', category: 'CORE' },
        { name: 'Physics', code: 'PHY', category: 'CORE' },
        { name: 'Chemistry', code: 'CHEM', category: 'CORE' },
        { name: 'Biology', code: 'BIO', category: 'CORE' },
        { name: 'History', code: 'HIST', category: 'ELECTIVE' },
        { name: 'Geography', code: 'GEO', category: 'ELECTIVE' },
        { name: 'Economics', code: 'ECON', category: 'ELECTIVE' },
        { name: 'Computer Studies', code: 'COMP', category: 'ELECTIVE' },
    ];
    for (const subject of subjects) {
        await prisma.subject.upsert({
            where: { code: subject.code },
            update: {},
            create: subject,
        });
    }
    console.log('Created subjects');
    // Create sample teacher
    const teacherPassword = await bcryptjs_1.default.hash('teacher123', 10);
    const teacherUser = await prisma.user.upsert({
        where: { username: 'teacher1' },
        update: {},
        create: {
            username: 'teacher1',
            password: teacherPassword,
            role: 'TEACHER',
            full_name: 'John Doe',
            email: 'teacher1@school.com',
        },
    });
    await prisma.teacher.upsert({
        where: { staff_id: 'T001' },
        update: {},
        create: {
            user_id: teacherUser.id,
            staff_id: 'T001',
            specialization: 'Mathematics',
        },
    });
    console.log('Created sample teacher');
    // Create sample discipline master
    const dmPassword = await bcryptjs_1.default.hash('dm123', 10);
    await prisma.user.upsert({
        where: { username: 'discipline1' },
        update: {},
        create: {
            username: 'discipline1',
            password: dmPassword,
            role: 'DISCIPLINE_MASTER',
            full_name: 'Discipline Master',
        },
    });
    console.log('Created sample discipline master');
    // Create sample student
    const studentPassword = await bcryptjs_1.default.hash('student123', 10);
    const s1Class = await prisma.class.findFirst({ where: { name: 'S1' } });
    if (s1Class) {
        const studentUser = await prisma.user.upsert({
            where: { username: 'student1' },
            update: {},
            create: {
                username: 'student1',
                password: studentPassword,
                role: 'STUDENT',
                full_name: 'Jane Smith',
            },
        });
        await prisma.student.upsert({
            where: { student_id: 'S001' },
            update: {},
            create: {
                user_id: studentUser.id,
                student_id: 'S001',
                class_id: s1Class.id,
                parent_name: 'Mr. Smith',
                parent_phone: '0788123456',
            },
        });
        console.log('Created sample student');
    }
    console.log('Seeding completed successfully!');
}
main()
    .catch((e) => {
    console.error(e);
    process.exit(1);
})
    .finally(async () => {
    await prisma.$disconnect();
});
