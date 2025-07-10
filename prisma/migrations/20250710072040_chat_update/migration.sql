/*
  Warnings:

  - You are about to drop the column `imporvement` on the `Chat` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Chat" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "userId" INTEGER NOT NULL,
    "text" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "time" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "isFeedbackable" BOOLEAN NOT NULL,
    "questionIntend" TEXT,
    "answerTips" TEXT,
    "questionType" TEXT,
    "wells" TEXT,
    "improves" TEXT,
    "improvement" TEXT,
    "totalEvaluation" TEXT,
    "totalScore" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "interviewId" TEXT,
    CONSTRAINT "Chat_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Chat_interviewId_fkey" FOREIGN KEY ("interviewId") REFERENCES "Interview" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Chat" ("answerTips", "createdAt", "id", "improves", "interviewId", "isFeedbackable", "questionIntend", "questionType", "role", "text", "time", "totalEvaluation", "totalScore", "updatedAt", "userId", "wells") SELECT "answerTips", "createdAt", "id", "improves", "interviewId", "isFeedbackable", "questionIntend", "questionType", "role", "text", "time", "totalEvaluation", "totalScore", "updatedAt", "userId", "wells" FROM "Chat";
DROP TABLE "Chat";
ALTER TABLE "new_Chat" RENAME TO "Chat";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
