import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { StudioShell } from "@/components/studio/StudioShell";

export default async function StudioDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session) {
    redirect("/studio/login");
  }

  return <StudioShell userName={session.user.name}>{children}</StudioShell>;
}
