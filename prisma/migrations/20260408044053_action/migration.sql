/*
  Warnings:

  - You are about to drop the column `endTime` on the `booking` table. All the data in the column will be lost.
  - You are about to drop the column `startTime` on the `booking` table. All the data in the column will be lost.
  - You are about to drop the column `totalAmmount` on the `booking` table. All the data in the column will be lost.
  - You are about to drop the column `availability` on the `tutor_profile` table. All the data in the column will be lost.
  - Added the required column `totalAmount` to the `booking` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `booking` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "booking" DROP COLUMN "endTime",
DROP COLUMN "startTime",
DROP COLUMN "totalAmmount",
ADD COLUMN     "totalAmount" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "tutor_profile" DROP COLUMN "availability";
