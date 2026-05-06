import prisma from "../lib/prisma";
export const getTeachers = async (req, res) => {
    try {
        const teachers = await prisma.user.findMany({
            where: { role: "TEACHER" },
            include: {
                teacherProfile: true,
            },
        });
        res.json(teachers);
    }
    catch (error) {
        res.status(500).json({ message: "Error fetching teachers", error: error.message });
    }
};
export const getTeacherById = async (req, res) => {
    try {
        const { id } = req.params;
        const teacher = await prisma.user.findUnique({
            where: { id },
            include: {
                teacherProfile: {
                    include: {
                        subjects: true,
                        classes: true,
                    }
                },
            },
        });
        if (!teacher) {
            return res.status(404).json({ message: "Teacher not found" });
        }
        res.json(teacher);
    }
    catch (error) {
        res.status(500).json({ message: "Error fetching teacher", error: error.message });
    }
};
export const updateTeacherProfile = async (req, res) => {
    try {
        const { id } = req.params;
        const { department, qualification, experience, phone, address } = req.body;
        const updatedUser = await prisma.user.update({
            where: { id },
            data: {
                phone,
                address,
                teacherProfile: {
                    update: {
                        department,
                        qualification,
                        experience,
                    },
                },
            },
            include: {
                teacherProfile: true,
            },
        });
        res.json(updatedUser);
    }
    catch (error) {
        res.status(500).json({ message: "Error updating teacher profile", error: error.message });
    }
};
//# sourceMappingURL=teacherController.js.map