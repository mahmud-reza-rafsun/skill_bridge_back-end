import { prisma } from "../../lib/prisma";

const createCategory = async (data: any) => {
    const { name, slug } = data;

    return await prisma.category.create({
        data: {
            name,
            slug
        },
    });
};

const getAllCategory = async () => {
    const result = await prisma.category.findMany();
    return result
}

export const categoryService = {
    createCategory,
    getAllCategory
}

