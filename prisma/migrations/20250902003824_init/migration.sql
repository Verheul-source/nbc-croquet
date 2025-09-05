-- CreateTable
CREATE TABLE "Club" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "location" TEXT,
    "created_date" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_date" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Member" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "full_name" TEXT NOT NULL,
    "club_id" TEXT NOT NULL,
    "membership_number" TEXT NOT NULL,
    "phone" TEXT,
    "address" TEXT,
    "date_joined" DATETIME NOT NULL,
    "membership_type" TEXT NOT NULL DEFAULT 'full',
    "handicap" INTEGER NOT NULL DEFAULT 0,
    "created_date" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_date" DATETIME NOT NULL,
    CONSTRAINT "Member_club_id_fkey" FOREIGN KEY ("club_id") REFERENCES "Club" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "Member_membership_number_key" ON "Member"("membership_number");
