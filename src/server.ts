import app from "./app.js";
import { prisma } from "./lib/prisma";

const PORT = process.env.PORT || 5000;

async function main() {
    try {
        prisma.$connect();
        console.log("database connect successfully");

        app.listen(PORT, () => {
            console.log(`Server is running on http://localhost:${PORT}`);
        });


    } catch (err) {
        console.error("An error occurred:", err);
        await prisma.$disconnect();
        process.exit(1);
    }
};

main();