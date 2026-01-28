import { UserRole } from "../../../generated/prisma/enums";
import { prisma } from "../../lib/prisma"

const createTuror = async (data: any, id: string) => {
    const { categoryName, bio, hourlyRate, availability, subject } = data;
    console.log(id)
    return prisma.$transaction(async (tx) => {

        const existingProfile = await tx.tutorProfile.findUnique({
            where: { id: id }
        });

        if (existingProfile) {
            throw new Error("Tutor profile already exists for this user.");
        }

        const user = await tx.user.findUnique({
            where: { id: id },
            select: { role: true }
        })
        if (!user) {
            throw new Error("User now found")
        }

        let newRole = user.role;

        if (user?.role === UserRole.STUDENT) {
            newRole = UserRole.TUTOR
        }

        const updateTutor = await tx.user.update({
            where: { id: id },
            data: { role: newRole },
            select: {
                role: true,
                id: true
            }
        });

        const tutorProfile = await tx.tutorProfile.create({
            data: {
                bio,
                hourlyRate: hourlyRate,
                availability: availability,
                userId: id,
                categoryName: categoryName,
                subject: subject
            }
        });
        return {
            ...tutorProfile,
            role: updateTutor.role
        };
    });
}

const getAllTutors = async () => {
    const result = await prisma.tutorProfile.findMany();
    return result
}

const getSingleTutor = async (id: string) => {
    const findSinlgeTutur = await prisma.tutorProfile.findUnique({
        where: { id: id },
    });
    if (!findSinlgeTutur) {
        throw new Error("Tutor not found!!!");
    }
    return findSinlgeTutur;
}

export const tutorService = {
    createTuror,
    getAllTutors,
    getSingleTutor
}