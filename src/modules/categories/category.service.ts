import { Prisma } from "../../../generated/prisma/browser";
import { prisma } from "../../lib/prisma"

const createCategory = async (data: Prisma.CategoryCreateInput) => {
    const result = await prisma.category.create({
        data
    });

    return result;
};

const getAllCategory = async () => {
    const result = await prisma.category.findMany()
    return result;
}

const updateTutorCategory = async (id: string, categoryName: any) => {
    const isExistCategory = await prisma.category.findUnique({
        where: { name: categoryName }
    });

    if (!isExistCategory) {
        throw new Error("Category not found");
    }

    const result = await prisma.tutorProfile.update({
        where: { userId: id },
        data: {
            categoryName: categoryName
        }
    });

    return result;
}



export const categoryService = {
    createCategory,
    getAllCategory,
    updateTutorCategory
}