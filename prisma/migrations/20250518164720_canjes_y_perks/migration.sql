/*
  Warnings:

  - The primary key for the `Canje` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `Canje` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `Perk` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `Perk` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Changed the type of `perkId` on the `Canje` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- DropForeignKey
ALTER TABLE "Canje" DROP CONSTRAINT "Canje_perkId_fkey";

-- AlterTable
ALTER TABLE "Canje" DROP CONSTRAINT "Canje_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
DROP COLUMN "perkId",
ADD COLUMN     "perkId" INTEGER NOT NULL,
ADD CONSTRAINT "Canje_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "Perk" DROP CONSTRAINT "Perk_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "Perk_pkey" PRIMARY KEY ("id");

-- AddForeignKey
ALTER TABLE "Canje" ADD CONSTRAINT "Canje_perkId_fkey" FOREIGN KEY ("perkId") REFERENCES "Perk"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
