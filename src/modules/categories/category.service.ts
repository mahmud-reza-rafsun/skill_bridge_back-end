import { Prisma } from "../../../generated/prisma/browser";
import { prisma } from "../../lib/prisma"

const createCategory = async (
    data: Prisma.CategoryCreateInput
) => {
    const result = await prisma.category.create({
        data
    });

    return result;
};

const getAllCategory = async () => {
    const result = await prisma.category.findMany()
    return result;
}



export const categoryService = {
    createCategory,
    getAllCategory
}