import {
  AgreementStatus,
  Currency,
  Prisma,
} from '@/generated/prisma/client';

import { db } from '@/lib/db';
import type { RentalAgreementFormValues } from './schemas';

export async function listRentalAgreements(userId: string) {
  return db.rentalAgreement.findMany({
    where: { userId },
    include: {
      property: true,
      tenant: true,
    },
    orderBy: [{ startDate: 'desc' }, { createdAt: 'desc' }],
  });
}

export async function listRentalAgreementsForProperty(
  userId: string,
  propertyId: string,
) {
  return db.rentalAgreement.findMany({
    where: { userId, propertyId },
    include: {
      tenant: true,
    },
    orderBy: [{ startDate: 'desc' }, { createdAt: 'desc' }],
  });
}

export async function getRentalAgreement(userId: string, agreementId: string) {
  return db.rentalAgreement.findFirst({
    where: {
      id: agreementId,
      userId,
    },
    include: {
      property: true,
      tenant: true,
    },
  });
}

export async function createRentalAgreement(
  userId: string,
  values: RentalAgreementFormValues,
) {
  await assertRelatedRecordsBelongToUser(
    userId,
    values.propertyId,
    values.tenantId,
  );
  await assertActiveAgreementAllowed(userId, values.propertyId, values.status);

  return db.rentalAgreement.create({
    data: toAgreementData(userId, values),
  });
}

export async function updateRentalAgreement(
  userId: string,
  agreementId: string,
  values: RentalAgreementFormValues,
) {
  await assertAgreementBelongsToUser(userId, agreementId);
  await assertRelatedRecordsBelongToUser(
    userId,
    values.propertyId,
    values.tenantId,
  );
  await assertActiveAgreementAllowed(
    userId,
    values.propertyId,
    values.status,
    agreementId,
  );

  return db.rentalAgreement.update({
    where: {
      id: agreementId,
      userId,
    },
    data: toAgreementData(userId, values),
  });
}

export async function cancelRentalAgreement(
  userId: string,
  agreementId: string,
) {
  await assertAgreementBelongsToUser(userId, agreementId);

  return db.rentalAgreement.update({
    where: {
      id: agreementId,
      userId,
    },
    data: {
      status: AgreementStatus.CANCELLED,
    },
  });
}

async function assertAgreementBelongsToUser(
  userId: string,
  agreementId: string,
) {
  const agreement = await db.rentalAgreement.findFirst({
    where: { id: agreementId, userId },
    select: { id: true },
  });

  if (!agreement) {
    throw new Error('Agreement not found');
  }
}

async function assertRelatedRecordsBelongToUser(
  userId: string,
  propertyId: string,
  tenantId: string,
) {
  const [property, tenant] = await Promise.all([
    db.property.findFirst({
      where: { id: propertyId, userId, isArchived: false },
      select: { id: true },
    }),
    db.tenant.findFirst({
      where: { id: tenantId, userId, isArchived: false },
      select: { id: true },
    }),
  ]);

  if (!property) {
    throw new Error('Property not found');
  }

  if (!tenant) {
    throw new Error('Tenant not found');
  }
}

async function assertActiveAgreementAllowed(
  userId: string,
  propertyId: string,
  status: RentalAgreementFormValues['status'],
  excludedAgreementId?: string,
) {
  if (status !== AgreementStatus.ACTIVE) return;

  const existingActiveAgreement = await db.rentalAgreement.findFirst({
    where: {
      userId,
      propertyId,
      status: AgreementStatus.ACTIVE,
      ...(excludedAgreementId ? { id: { not: excludedAgreementId } } : {}),
    },
    select: { id: true },
  });

  if (existingActiveAgreement) {
    throw new Error('This property already has an active rental agreement.');
  }
}

function toAgreementData(
  userId: string,
  values: RentalAgreementFormValues,
) {
  return {
    userId,
    propertyId: values.propertyId,
    tenantId: values.tenantId,
    startDate: dateOnly(values.startDate),
    endDate: values.endDate ? dateOnly(values.endDate) : null,
    status: values.status as AgreementStatus,
    monthlyRentAmount: new Prisma.Decimal(values.monthlyRentAmount.toString()),
    monthlyRentCurrency: values.monthlyRentCurrency as Currency,
    paymentDueDay: values.paymentDueDay,
    depositAmount:
      values.depositAmount === undefined
        ? null
        : new Prisma.Decimal(values.depositAmount.toString()),
    depositCurrency: values.depositCurrency as Currency,
    notes: emptyToNull(values.notes),
  };
}

function dateOnly(value: string) {
  return new Date(`${value}T00:00:00.000Z`);
}

function emptyToNull(value?: string) {
  const trimmed = value?.trim();

  return trimmed ? trimmed : null;
}

