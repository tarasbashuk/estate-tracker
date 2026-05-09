import { DashboardShell } from '@/components/layout/DashboardShell';
import { requireUser } from '@/server/requireUser';

export const dynamic = 'force-dynamic';

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireUser();

  return <DashboardShell>{children}</DashboardShell>;
}

