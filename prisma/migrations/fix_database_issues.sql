-- Add missing indexes for performance
CREATE INDEX IF NOT EXISTS "Member_club_id_idx" ON "Member"("club_id");
CREATE INDEX IF NOT EXISTS "Member_membership_status_idx" ON "Member"("membership_status");
CREATE INDEX IF NOT EXISTS "Rule_language_part_order_idx" ON "Rule"("language", "part_order");

-- Fix Rule table to ensure subsection fields exist
ALTER TABLE "Rule" ADD COLUMN IF NOT EXISTS "subsection_title" TEXT;
ALTER TABLE "Rule" ADD COLUMN IF NOT EXISTS "subsection_order" INTEGER;