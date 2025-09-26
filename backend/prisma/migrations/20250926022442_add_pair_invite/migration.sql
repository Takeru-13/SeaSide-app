-- CreateTable
CREATE TABLE "public"."PairInvite" (
    "code" TEXT NOT NULL,
    "creatorId" INTEGER NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "consumedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PairInvite_pkey" PRIMARY KEY ("code")
);

-- CreateIndex
CREATE INDEX "PairInvite_creatorId_idx" ON "public"."PairInvite"("creatorId");

-- AddForeignKey
ALTER TABLE "public"."PairInvite" ADD CONSTRAINT "PairInvite_creatorId_fkey" FOREIGN KEY ("creatorId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
