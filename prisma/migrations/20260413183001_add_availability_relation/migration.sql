-- DropEnum
DROP TYPE "ApproveStatus";

-- CreateTable
CREATE TABLE "availability" (
    "id" TEXT NOT NULL,
    "tutorProfileId" TEXT NOT NULL,
    "slots" JSONB NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "availability_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "availability_tutorProfileId_key" ON "availability"("tutorProfileId");

-- AddForeignKey
ALTER TABLE "availability" ADD CONSTRAINT "availability_tutorProfileId_fkey" FOREIGN KEY ("tutorProfileId") REFERENCES "tutor_profile"("id") ON DELETE CASCADE ON UPDATE CASCADE;
