import { MessengerType } from '@/generated/prisma/client';

import { db } from '@/lib/db';
import type { TenantFormValues } from './schemas';

export async function listTenants(userId: string) {
  return db.tenant.findMany({
    where: {
      userId,
      isArchived: false,
    },
    orderBy: [{ createdAt: 'desc' }],
  });
}

export async function getTenant(userId: string, tenantId: string) {
  return db.tenant.findFirst({
    where: {
      id: tenantId,
      userId,
      isArchived: false,
    },
  });
}

export async function createTenant(userId: string, values: TenantFormValues) {
  return db.tenant.create({
    data: {
      userId,
      fullName: values.fullName,
      phone: emptyToNull(values.phone),
      email: emptyToNull(values.email),
      messengerType: values.messengerType as MessengerType,
      messengerHandle: emptyToNull(values.messengerHandle),
      notes: emptyToNull(values.notes),
    },
  });
}

export async function updateTenant(
  userId: string,
  tenantId: string,
  values: TenantFormValues,
) {
  return db.tenant.update({
    where: {
      id: tenantId,
      userId,
    },
    data: {
      fullName: values.fullName,
      phone: emptyToNull(values.phone),
      email: emptyToNull(values.email),
      messengerType: values.messengerType as MessengerType,
      messengerHandle: emptyToNull(values.messengerHandle),
      notes: emptyToNull(values.notes),
    },
  });
}

export async function archiveTenant(userId: string, tenantId: string) {
  return db.tenant.update({
    where: {
      id: tenantId,
      userId,
    },
    data: {
      isArchived: true,
    },
  });
}

function emptyToNull(value?: string) {
  const trimmed = value?.trim();

  return trimmed ? trimmed : null;
}

