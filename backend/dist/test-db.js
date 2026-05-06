import "dotenv/config";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
async function test() {
    try {
        const user = await prisma.user.create({
            data: {
                email: `test-${Date.now()}@test.com`,
                password: "password123",
                name: "Test User",
                role: "ADMIN"
            }
        });
        console.log("User created successfully:", user.email);
    }
    catch (err) {
        console.error("Operation failed:", JSON.stringify(err, Object.getOwnPropertyNames(err), 2));
    }
    finally {
        await prisma.$disconnect();
    }
}
test();
//# sourceMappingURL=test-db.js.map