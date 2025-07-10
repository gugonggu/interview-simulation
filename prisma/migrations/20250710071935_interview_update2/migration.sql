-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Interview" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "category" TEXT NOT NULL,
    "questionType" TEXT NOT NULL,
    "difficulty" TEXT NOT NULL,
    "totalScore" TEXT NOT NULL,
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
INSERT INTO "new_Interview" ("category", "communicationScore", "createdAt", "difficulty", "grade", "id", "improvement", "improves", "problemSolvingScore", "questionType", "softScore", "techScore", "timeSpend", "totalScore", "updatedAt", "userId", "wells") SELECT "category", "communicationScore", "createdAt", "difficulty", "grade", "id", "improvement", "improves", "problemSolvingScore", "questionType", "softScore", "techScore", "timeSpend", "totalScore", "updatedAt", "userId", "wells" FROM "Interview";
DROP TABLE "Interview";
ALTER TABLE "new_Interview" RENAME TO "Interview";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
