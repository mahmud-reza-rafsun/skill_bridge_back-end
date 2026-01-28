/*
  Warnings:

  - You are about to drop the column `categoryId` on the `tutor_profile` table. All the data in the column will be lost.
  - Added the required column `categoryName` to the `tutor_profile` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "tutor_profile" DROP CONSTRAINT "tutor_profile_categoryId_fkey";

-- AlterTable
ALTER TABLE "tutor_profile" DROP COLUMN "categoryId",
ADD COLUMN     "categoryName" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "tutor_profile" ADD CONSTRAINT "tutor_profile_categoryName_fkey" FOREIGN KEY ("categoryName") REFERENCES "category"("name") ON DELETE RESTRICT ON UPDATE CASCADE;
