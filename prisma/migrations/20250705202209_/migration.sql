-- AlterTable
ALTER TABLE "User" ADD COLUMN     "refreshToken" TEXT,
ADD COLUMN     "resetPasswordToken" TEXT,
ADD COLUMN     "updateToken" TEXT;
