/*
  Warnings:

  - Added the required column `totalAmmount` to the `booking` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "booking" ADD COLUMN     "totalAmmount" DOUBLE PRECISION NOT NULL;

-- AlterTable
ALTER TABLE "user" ADD COLUMN     "phone" TEXT,
ADD COLUMN     "role" TEXT DEFAULT 'STUDENT',
ADD COLUMN     "status" TEXT DEFAULT 'ACTIVE';
