import prisma from "../lib/prisma";
export const createDisciplineReport = async (req, res) => {
    try {
        const { studentId, title, description, severity, pointsDeducted } = req.body;
        const report = await prisma.disciplineReport.create({
            data: {
                studentId,
                title,
                description,
                severity,
                pointsDeducted: parseInt(pointsDeducted) || 0,
            },
        });
        res.status(201).json(report);
    }
    catch (error) {
        res.status(500).json({ message: "Error creating discipline report", error: error.message });
    }
};
export const getDisciplineReports = async (req, res) => {
    try {
        const reports = await prisma.disciplineReport.findMany({
            include: {
                student: {
                    include: {
                        user: true,
                        class: true,
                    }
                }
            },
            orderBy: { date: "desc" },
        });
        res.json(reports);
    }
    catch (error) {
        res.status(500).json({ message: "Error fetching reports", error: error.message });
    }
};
//# sourceMappingURL=disciplineController.js.map