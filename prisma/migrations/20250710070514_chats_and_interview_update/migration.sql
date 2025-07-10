/*
  Warnings:

  - Added the required column `improvement` to the `Interview` table without a default value. This is not possible if the table is not empty.
  - Added the required column `improves` to the `Interview` table without a default value. This is not possible if the table is not empty.
  - Added the required column `wells` to the `Interview` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Chat" ADD COLUMN "questionType" TEXT;
ALTER TABLE "Chat" ADD COLUMN "totalEvaluation" TEXT;
ALTER TABLE "Chat" ADD COLUMN "totalScore" TEXT;

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
    "techScore" TEXT NOT NULL,
    "softScore" TEXT NOT NULL,
    "communicationScore" TEXT NOT NULL,
    "problemSolvingScore" TEXT NOT NULL,
    "wells" TEXT NOT NULL,
    "improves" TEXT NOT NULL,
    "improvement" TEXT NOT NULL,
    "userId" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Interview_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Interview" ("category", "communicationScore", "createdAt", "difficulty", "grade", "id", "problemSolvingScore", "questionType", "softScore", "techScore", "timeSpend", "totalScore", "updatedAt", "userId") SELECT "category", "communicationScore", "createdAt", "difficulty", "grade", "id", "problemSolvingScore", "questionType", "softScore", "techScore", "timeSpend", "totalScore", "updatedAt", "userId" FROM "Interview";
DROP TABLE "Interview";
ALTER TABLE "new_Interview" RENAME TO "Interview";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
