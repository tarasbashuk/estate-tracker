import { Prisma, PropertyType } from '@prisma/client';

import { db } from '@/lib/db';
import type { PropertyFormValues } from './schemas';

export async function listProperties(userId: string) {
  return db.property.findMany({
    where: {
      userId,
      isArchived: false,
    },
    orderBy: [{ createdAt: 'desc' }],
  });
}

export async function createProperty(
  userId: string,
  values: PropertyFormValues,
) {
  return db.property.create({
    data: {
      userId,
      name: values.name,
      addressLine1: values.addressLine1,
      addressLine2: emptyToNull(values.addressLine2),
      city: values.city,
      country: values.country,
      postalCode: emptyToNull(values.postalCode),
      area:
        values.area === undefined
          ? undefined
          : new Prisma.Decimal(values.area.toString()),
      rooms: values.rooms,
      propertyType: values.propertyType as PropertyType,
      notes: emptyToNull(values.notes),
    },
  });
}

function emptyToNull(value?: string) {
  const trimmed = value?.trim();

  return trimmed ? trimmed : null;
}

