import { AlertCircle } from "lucide-react";
import { StudioAuthLayout } from "@/components/studio/StudioAuthLayout";
import { AcceptInviteForm } from "@/components/studio/AcceptInviteForm";
import { getInviteByToken } from "@/lib/actions/invites";

export default async function AcceptInvitePage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;
  const invite = await getInviteByToken(token);

  if (!invite) {
    return (
      <StudioAuthLayout title="Invite not found">
        <div className="flex items-center gap-2 text-sm text-[#f87171]">
          <AlertCircle className="h-4 w-4 shrink-0" strokeWidth={2.25} />
          This invite link is invalid or has expired. Ask whoever invited you to send a new one.
        </div>
      </StudioAuthLayout>
    );
  }

  return (
    <StudioAuthLayout title="You've been invited" subtitle="Set up your Falcotrix Studio account">
      <AcceptInviteForm token={token} email={invite.email} />
    </StudioAuthLayout>
  );
}
