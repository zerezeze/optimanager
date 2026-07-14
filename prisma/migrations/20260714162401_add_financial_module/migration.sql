-- CreateEnum
CREATE TYPE "PaymentMethod" AS ENUM ('DINHEIRO', 'PIX', 'CARTAO_CREDITO', 'CARTAO_DEBITO', 'CREDIARIO');

-- CreateEnum
CREATE TYPE "PaymentStatus" AS ENUM ('PAGO', 'PENDENTE', 'PARCIAL');

-- CreateTable
CREATE TABLE "payments" (
    "id" TEXT NOT NULL,
    "consultation_id" TEXT NOT NULL,
    "status" "PaymentStatus" NOT NULL DEFAULT 'PENDENTE',
    "method" "PaymentMethod" NOT NULL,
    "total_pago" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "payments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "installments" (
    "id" TEXT NOT NULL,
    "payment_id" TEXT NOT NULL,
    "numero" INTEGER NOT NULL,
    "valor" INTEGER NOT NULL,
    "vencimento" TIMESTAMP(3) NOT NULL,
    "pago" BOOLEAN NOT NULL DEFAULT false,
    "paid_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "installments_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "payments_consultation_id_key" ON "payments"("consultation_id");

-- CreateIndex
CREATE INDEX "payments_consultation_id_idx" ON "payments"("consultation_id");

-- CreateIndex
CREATE INDEX "installments_payment_id_idx" ON "installments"("payment_id");

-- CreateIndex
CREATE INDEX "installments_pago_idx" ON "installments"("pago");

-- AddForeignKey
ALTER TABLE "payments" ADD CONSTRAINT "payments_consultation_id_fkey" FOREIGN KEY ("consultation_id") REFERENCES "consultations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "installments" ADD CONSTRAINT "installments_payment_id_fkey" FOREIGN KEY ("payment_id") REFERENCES "payments"("id") ON DELETE CASCADE ON UPDATE CASCADE;
