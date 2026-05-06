import prisma from "../lib/prisma.js";
export const getStudents = async (req, res) => {
    try {
        const students = await prisma.user.findMany({
            where: { role: "STUDENT" },
            include: {
                studentProfile: {
                    include: {
                        class: true,
                        parent: { include: { user: true } },
                    }
                },
            },
        });
        res.json(students);
    }
    catch (error) {
        res.status(500).json({ message: "Error fetching students", error: error.message });
    }
};
export const getStudentByUserId = async (req, res) => {
    try {
        const userId = req.params.userId;
        const student = await prisma.user.findUnique({
            where: { id: userId },
            include: {
                studentProfile: {
                    include: {
                        class: true,
                        attendance: { take: 10, orderBy: { date: "desc" } },
                        marks: { include: { subject: true } },
                        discipline: true,
                    }
                },
            },
        });
        res.json(student);
    }
    catch (error) {
        res.status(500).json({ message: "Error fetching student", error: error.message });
    }
};
export const createStudent = async (req, res) => {
    try {
        const { email, password, name, phone, address, indexNumber, gender, dateOfBirth, classId, parentId } = req.body;
        const newStudent = await prisma.user.create({
            data: {
                email,
                password, // In a real app, should hash this here too (though ideally done in a service)
                name,
                phone,
                address,
                role: "STUDENT",
                studentProfile: {
                    create: {
                        indexNumber,
                        gender,
                        dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : null,
                        classId,
                        parentId,
                    }
                }
            },
            include: {
                studentProfile: true,
            }
        });
        res.status(201).json(newStudent);
    }
    catch (error) {
        res.status(500).json({ message: "Error creating student", error: error.message });
    }
};
//# sourceMappingURL=studentController.js.map