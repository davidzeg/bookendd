-- AlterEnum
ALTER TYPE "LogStatus" ADD VALUE 'READING';

-- AlterTable
ALTER TABLE "Log" ADD COLUMN     "review" TEXT;
