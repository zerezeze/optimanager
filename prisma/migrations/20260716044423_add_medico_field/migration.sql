-- AlterTable
ALTER TABLE "consultations" ADD COLUMN     "medico" VARCHAR(255);

-- CreateIndex
CREATE INDEX "consultations_medico_idx" ON "consultations"("medico");
