-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Member" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "full_name" TEXT NOT NULL,
    "email" TEXT,
    "birth_date" DATETIME,
    "gender" TEXT,
    "club_id" TEXT NOT NULL,
    "membership_number" TEXT NOT NULL,
    "phone" TEXT,
    "address" TEXT,
    "date_joined" DATETIME NOT NULL,
    "membership_type" TEXT NOT NULL DEFAULT 'full',
    "membership_status" TEXT NOT NULL DEFAULT 'active',
    "payment_status" TEXT NOT NULL DEFAULT 'pending',
    "handicap" INTEGER NOT NULL DEFAULT 0,
    "board_position" TEXT,
    "notes" TEXT,
    "user_id" TEXT,
    "created_date" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_date" DATETIME NOT NULL,
    CONSTRAINT "Member_club_id_fkey" FOREIGN KEY ("club_id") REFERENCES "Club" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Member_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Member" ("address", "club_id", "created_date", "date_joined", "full_name", "handicap", "id", "membership_number", "membership_type", "phone", "updated_date") SELECT "address", "club_id", "created_date", "date_joined", "full_name", "handicap", "id", "membership_number", "membership_type", "phone", "updated_date" FROM "Member";
DROP TABLE "Member";
ALTER TABLE "new_Member" RENAME TO "Member";
CREATE UNIQUE INDEX "Member_membership_number_key" ON "Member"("membership_number");
CREATE UNIQUE INDEX "Member_user_id_key" ON "Member"("user_id");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
