-- Tournament System Tables
CREATE TABLE "Tournament" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "date" DATETIME NOT NULL,
    "location" TEXT NOT NULL,
    "entry_fee" REAL DEFAULT 0,
    "max_participants" INTEGER DEFAULT 32,
    "registration_deadline" DATETIME NOT NULL,
    "tournament_type" TEXT DEFAULT 'singles',
    "status" TEXT DEFAULT 'upcoming',
    "created_date" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_date" DATETIME NOT NULL
);

CREATE TABLE "TournamentRegistration" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "tournament_id" TEXT NOT NULL,
    "member_id" TEXT NOT NULL,
    "registration_date" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "payment_status" TEXT DEFAULT 'pending',
    "partner_name" TEXT,
    "special_requirements" TEXT,
    "created_date" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_date" DATETIME NOT NULL,
    CONSTRAINT "TournamentRegistration_tournament_id_fkey" FOREIGN KEY ("tournament_id") REFERENCES "Tournament" ("id") ON DELETE CASCADE,
    CONSTRAINT "TournamentRegistration_member_id_fkey" FOREIGN KEY ("member_id") REFERENCES "Member" ("id") ON DELETE CASCADE
);

CREATE UNIQUE INDEX "TournamentRegistration_tournament_member_unique" ON "TournamentRegistration"("tournament_id", "member_id");