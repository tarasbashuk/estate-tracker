import {
  MeterReadingStatus,
  Prisma,
  SubmissionMethod,
} from '@/generated/prisma/client';

import { db } from '@/lib/db';
import type { MeterFormValues, MeterReadingFormValues } from './schemas';

export async function listMetersForProperty(
  userId: string,
  propertyId: string,
) {
  await assertPropertyBelongsToUser(userId, propertyId);

  return db.meter.findMany({
    where: {
      userId,
      propertyId,
    },
    include: {
      utilityType: true,
      readings: {
        orderBy: [{ periodYear: 'desc' }, { periodMonth: 'desc' }],
        take: 3,
      },
    },
    orderBy: [{ isActive: 'desc' }, { createdAt: 'desc' }],
  });
}

export async function createMeter(
  userId: string,
  propertyId: string,
  values: MeterFormValues,
) {
  await assertPropertyBelongsToUser(userId, propertyId);
  await assertUtilityTypeAvailableToUser(userId, values.utilityTypeId);

  return db.meter.create({
    data: toMeterData(userId, propertyId, values),
  });
}

export async function updateMeter(
  userId: string,
  meterId: string,
  values: MeterFormValues,
) {
  const existing = await db.meter.findFirst({
    where: { id: meterId, userId },
    select: { id: true, propertyId: true },
  });

  if (!existing) {
    throw new Error('Meter not found.');
  }

  await assertUtilityTypeAvailableToUser(userId, values.utilityTypeId);

  return db.meter.update({
    where: {
      id: meterId,
      userId,
    },
    data: toMeterData(userId, existing.propertyId, values),
  });
}

export async function createMeterReading(
  userId: string,
  propertyId: string,
  values: MeterReadingFormValues,
) {
  await assertPropertyBelongsToUser(userId, propertyId);
  const meter = await db.meter.findFirst({
    where: {
      id: values.meterId,
      userId,
      propertyId,
    },
    select: { id: true },
  });

  if (!meter) {
    throw new Error('Meter not found.');
  }

  return db.meterReading.create({
    data: toReadingData(userId, propertyId, values),
  });
}

function toMeterData(
  userId: string,
  propertyId: string,
  values: MeterFormValues,
) {
  return {
    userId,
    propertyId,
    utilityTypeId: values.utilityTypeId,
    name: values.name.trim(),
    providerName: emptyToNull(values.providerName),
    accountNumber: emptyToNull(values.accountNumber),
    submissionMethod: values.submissionMethod as SubmissionMethod,
    submissionUrl: emptyToNull(values.submissionUrl),
    submissionEmail: emptyToNull(values.submissionEmail),
    submissionDayStart: values.submissionDayStart ?? null,
    submissionDayEnd: values.submissionDayEnd ?? null,
    notes: emptyToNull(values.notes),
    isActive: values.isActive,
  };
}

function toReadingData(
  userId: string,
  propertyId: string,
  values: MeterReadingFormValues,
) {
  const previousValue =
    values.previousValue === undefined
      ? null
      : new Prisma.Decimal(values.previousValue.toString());
  const currentValue =
    values.currentValue === undefined
      ? null
      : new Prisma.Decimal(values.currentValue.toString());
  const consumption =
    previousValue && currentValue ? currentValue.minus(previousValue) : null;
  const now = new Date();

  return {
    userId,
    propertyId,
    meterId: values.meterId,
    periodMonth: values.periodMonth,
    periodYear: values.periodYear,
    previousValue,
    currentValue,
    consumption,
    readingReceivedFromTenantAt: values.readingReceivedFromTenant ? now : null,
    submittedToProviderAt: values.submittedToProvider ? now : null,
    status: values.status as MeterReadingStatus,
    notes: emptyToNull(values.notes),
  };
}

async function assertPropertyBelongsToUser(userId: string, propertyId: string) {
  const property = await db.property.findFirst({
    where: {
      id: propertyId,
      userId,
      isArchived: false,
    },
    select: { id: true },
  });

  if (!property) {
    throw new Error('Property not found.');
  }
}

async function assertUtilityTypeAvailableToUser(
  userId: string,
  utilityTypeId: string,
) {
  const utilityType = await db.utilityType.findFirst({
    where: {
      id: utilityTypeId,
      OR: [{ isSystem: true, userId: null }, { userId }],
    },
    select: { id: true },
  });

  if (!utilityType) {
    throw new Error('Utility type not found.');
  }
}

function emptyToNull(value?: string) {
  const trimmed = value?.trim();

  return trimmed ? trimmed : null;
}
