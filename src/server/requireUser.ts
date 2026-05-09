import { currentUser } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';

import { db } from '@/lib/db';

export async function requireUser() {
  const clerkUser = await currentUser();

  if (!clerkUser) {
    redirect('/');
  }

  const email =
    clerkUser.primaryEmailAddress?.emailAddress ||
    clerkUser.emailAddresses[0]?.emailAddress;

  if (!email) {
    throw new Error('Authenticated Clerk user has no email address.');
  }

  const fullName = `${clerkUser.firstName ?? ''} ${
    clerkUser.lastName ?? ''
  }`.trim();

  return db.user.upsert({
    where: { clerkUserId: clerkUser.id },
    update: {
      email,
      firstName: clerkUser.firstName,
      lastName: clerkUser.lastName,
      fullName,
      imageUrl: clerkUser.imageUrl,
    },
    create: {
      clerkUserId: clerkUser.id,
      email,
      firstName: clerkUser.firstName,
      lastName: clerkUser.lastName,
      fullName,
      imageUrl: clerkUser.imageUrl,
    },
  });
}

