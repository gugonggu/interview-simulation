/*
  Warnings:

  - Added the required column `category` to the `Interview` table without a default value. This is not possible if the table is not empty.
  - Added the required column `communicationScore` to the `Interview` table without a default value. This is not possible if the table is not empty.
  - Added the required column `difficulty` to the `Interview` table without a default value. This is not possible if the table is not empty.
  - Added the required column `grade` to the `Interview` table without a default value. This is not possible if the table is not empty.
  - Added the required column `problemSolvingScore` to the `Interview` table without a default value. This is not possible if the table is not empty.
  - Added the required column `questionType` to the `Interview` table without a default value. This is not possible if the table is not empty.
  - Added the required column `softScore` to the `Interview` table without a default value. This is not possible if the table is not empty.
  - Added the required column `techScore` to the `Interview` table without a default value. This is not possible if the table is not empty.
  - Added the required column `timeSpend` to the `Interview` table without a default value. This is not possible if the table is not empty.
  - Added the required column `totalScore` to the `Interview` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Interview` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Interview" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "category" TEXT NOT NULL,
    "questionType" TEXT NOT NULL,
    "difficulty" TEXT NOT NULL,
    "totalScore" INTEGER NOT NULL,
    "grade" TEXT NOT NULL,
    "timeSpend" INTEGER NOT NULL,
    "techScore" INTEGER NOT NULL,
    "softScore" INTEGER NOT NULL,
    "communicationScore" INTEGER NOT NULL,
    "problemSolvingScore" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Interview_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Interview" ("id", "userId") SELECT "id", "userId" FROM "Interview";
DROP TABLE "Interview";
ALTER TABLE "new_Interview" RENAME TO "Interview";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
