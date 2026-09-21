-- Additive schema hardening. Does not drop tables or data.
-- Apply with `prisma migrate deploy`. Do not use `prisma migrate reset` against shared or production databases.

-- AlterTable
ALTER TABLE "Category" ADD COLUMN "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "Media" ADD COLUMN "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "Tag" ADD COLUMN "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- CreateIndex
CREATE INDEX "AuditLog_userId_idx" ON "AuditLog"("userId");

-- CreateIndex
CREATE INDEX "Enquiry_productId_idx" ON "Enquiry"("productId");

-- CreateIndex
CREATE INDEX "Enquiry_projectId_idx" ON "Enquiry"("projectId");

-- CreateIndex
CREATE INDEX "Enquiry_resumeId_idx" ON "Enquiry"("resumeId");

-- CreateIndex
CREATE INDEX "Media_createdById_idx" ON "Media"("createdById");

-- CreateIndex
CREATE INDEX "Media_visibility_idx" ON "Media"("visibility");

-- CreateIndex
CREATE INDEX "Post_categoryId_idx" ON "Post"("categoryId");

-- CreateIndex
CREATE INDEX "Post_featuredImageId_idx" ON "Post"("featuredImageId");

-- CreateIndex
CREATE INDEX "PostTag_tagId_idx" ON "PostTag"("tagId");

-- CreateIndex
CREATE INDEX "Product_coverId_idx" ON "Product"("coverId");

-- CreateIndex
CREATE INDEX "Product_published_idx" ON "Product"("published");

-- CreateIndex
CREATE INDEX "Project_coverId_idx" ON "Project"("coverId");

-- CreateIndex
CREATE INDEX "ProjectImage_mediaId_idx" ON "ProjectImage"("mediaId");

-- CreateIndex
CREATE INDEX "User_role_idx" ON "User"("role");

-- AddForeignKey
ALTER TABLE "Media" ADD CONSTRAINT "Media_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
