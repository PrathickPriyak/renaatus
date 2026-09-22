-- Additive blog CMS fields. Does not drop tables or data.
-- Apply with `prisma migrate deploy`. Do not use `prisma migrate reset` against shared or production databases.

-- AlterTable
ALTER TABLE "Post" ADD COLUMN "featured" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN "canonicalUrl" TEXT,
ADD COLUMN "ogImageId" TEXT;

-- CreateIndex
CREATE INDEX "Post_featured_status_publishedAt_idx" ON "Post"("featured", "status", "publishedAt");

-- CreateIndex
CREATE INDEX "Post_ogImageId_idx" ON "Post"("ogImageId");

-- AddForeignKey
ALTER TABLE "Post" ADD CONSTRAINT "Post_ogImageId_fkey" FOREIGN KEY ("ogImageId") REFERENCES "Media"("id") ON DELETE SET NULL ON UPDATE CASCADE;
