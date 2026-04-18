/*
  Warnings:

  - You are about to drop the column `date` on the `booking` table. All the data in the column will be lost.
  - Added the required column `day` to the `booking` table without a default value. This is not possible if the table is not empty.
  - Added the required column `slot` to the `booking` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "booking" DROP COLUMN "date",
ADD COLUMN     "day" TEXT NOT NULL,
ADD COLUMN     "slot" TEXT NOT NULL;
