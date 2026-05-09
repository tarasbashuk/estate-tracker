import { Prisma } from '@/generated/prisma/client';

import { db } from '@/lib/db';
import type {
  UtilityConfigFormValues,
  UtilityTypeFormValues,
} from './schemas';

const defaultUtilityTypes = [
  'Electricity',
  'Cold water',
  'Hot water',
  'Heating',
  'Gas',
  'Internet',
  'Concierge',
  'Building maintenance',
  'Security',
  'Waste collection',
  'Other',
];

export async function ensureDefaultUtilityTypes() {
  await Promise.all(
    defaultUtilityTypes.map(async (name) => {
      const existing = await db.utilityType.findFirst({
        where: { userId: null, name, isSystem: true },
        select: { id: true },
      });

      if (existing) return;

      await db.utilityType.create({
        data: {
          name,
          isSystem: true,
        },
      });
    }),
  );
}

export async function listUtilityTypes(userId: string) {
  await ensureDefaultUtilityTypes();

  return db.utilityType.findMany({
    where: {
      OR: [{ isSystem: true, userId: null }, { userId }],
    },
    orderBy: [{ isSystem: 'desc' }, { name: 'asc' }],
  });
}

export async function createUtilityType(
  userId: string,
  values: UtilityTypeFormValues,
) {
  const existing = await db.utilityType.findFirst({
    where: {
      userId,
      name: values.name.trim(),
    },
    select: { id: true },
  });

  if (existing) {
    throw new Error('Utility type already exists.');
  }

  return db.utilityType.create({
    data: {
      userId,
      name: values.name.trim(),
      description: emptyToNull(values.description),
      isSystem: false,
    },
  });
}

export async function listPropertyUtilityConfigs(
  userId: string,
  propertyId: string,
) {
  await assertPropertyBelongsToUser(userId, propertyId);

  return db.propertyUtilityConfig.findMany({
    where: {
      userId,
      propertyId,
    },
    include: {
      utilityType: true,
    },
    orderBy: [{ utilityType: { name: 'asc' } }],
  });
}

export async function createPropertyUtilityConfig(
  userId: string,
  propertyId: string,
  values: UtilityConfigFormValues,
) {
  await assertPropertyBelongsToUser(userId, propertyId);
  await assertUtilityTypeAvailableToUser(userId, values.utilityTypeId);

  return db.propertyUtilityConfig.create({
    data: toConfigData(userId, propertyId, values),
  });
}

export async function updatePropertyUtilityConfig(
  userId: string,
  configId: string,
  values: UtilityConfigFormValues,
) {
  const existing = await db.propertyUtilityConfig.findFirst({
    where: { id: configId, userId },
    select: { id: true, propertyId: true },
  });

  if (!existing) {
    throw new Error('Utility configuration not found.');
  }

  await assertUtilityTypeAvailableToUser(userId, values.utilityTypeId);

  return db.propertyUtilityConfig.update({
    where: {
      id: configId,
      userId,
    },
    data: toConfigData(userId, existing.propertyId, values),
  });
}

export async function setPropertyUtilityConfigEnabled(
  userId: string,
  configId: string,
  isEnabled: boolean,
) {
  const existing = await db.propertyUtilityConfig.findFirst({
    where: { id: configId, userId },
    select: { id: true },
  });

  if (!existing) {
    throw new Error('Utility configuration not found.');
  }

  return db.propertyUtilityConfig.update({
    where: {
      id: configId,
      userId,
    },
    data: {
      isEnabled,
    },
  });
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

function toConfigData(
  userId: string,
  propertyId: string,
  values: UtilityConfigFormValues,
) {
  return {
    userId,
    propertyId,
    utilityTypeId: values.utilityTypeId,
    isEnabled: values.isEnabled,
    defaultAmount:
      values.defaultAmount === undefined
        ? null
        : new Prisma.Decimal(values.defaultAmount.toString()),
    notes: emptyToNull(values.notes),
  };
}

function emptyToNull(value?: string) {
  const trimmed = value?.trim();

  return trimmed ? trimmed : null;
}
