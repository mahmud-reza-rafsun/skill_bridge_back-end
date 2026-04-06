import { prisma } from "../../lib/prisma";

const createCategory = async (data: { name: string }) => {
    return await prisma.category.create({
        data
    });
};

const getAllCategory = async () => {
    return await prisma.category.findMany({
        orderBy: {
            name: 'asc'
        }
    });
};

const updateTutorCategory = async (userId: string, categoryName: string) => {
    // Checking if the category exists before updating
    const categoryExists = await prisma.category.findUnique({
        where: { name: categoryName }
    });

    if (!categoryExists) {
        throw new Error("Category does not exist!");
    }

    // Updating the categoryName in TutorProfile using userId
    return await prisma.tutorProfile.update({
        where: { userId },
        data: { categoryName }
    });
};

export const categoryService = {
    createCategory,
    getAllCategory,
    updateTutorCategory
};