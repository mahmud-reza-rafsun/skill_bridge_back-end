import { prisma } from "../../lib/prisma"

const getProfile = async (id: string) => {
    if (!id) {
        throw new Error("User ID is required to fetch profile");
    }

    const user = await prisma.user.findUnique({
        where: {
            id: id,
        },
        select: {
            name: true,
            email: true,
            image: true,
            role: true,
            status: true,
            createdAt: true,
            updatedAt: true,
        }
    });

    return user;
};


export const userService = {
    getProfile
}