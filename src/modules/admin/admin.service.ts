import { prisma } from "../../lib/prisma"

const getAllUser = async () => {
    const users = prisma.user.findMany({
        select: {
            id: true,
            name: true,
            email: true,
            role: true,
            status: true,
            createdAt: true
        },
        orderBy: { createdAt: 'desc' }
    });

    return users
}

const updateUserStatus = async (id: string, status: string) => {
    const user = await prisma.user.findUnique({
        where: { id }
    });

    if (!user) {
        throw new Error("User not found");
    }

    const result = await prisma.user.update({
        where: { id },
        data: {
            status: status
        }
    });

    return result
}


export const adminService = {
    getAllUser,
    updateUserStatus
}