import { listAdmins, listInvites } from "@/lib/actions/invites";
import { InviteForm } from "@/components/studio/InviteForm";

export default async function TeamPage() {
  const [admins, invites] = await Promise.all([listAdmins(), listInvites()]);
  const pendingInvites = invites.filter((i) => i.status === "pending");

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="font-display text-2xl font-medium tracking-tight text-white">Team</h1>
        <p className="mt-2 text-sm text-text-muted">
          Anyone here can invite others — there's no owner/admin split.
        </p>
      </div>

      <div className="rounded-lg border border-glass-border bg-glass p-6 backdrop-blur-md">
        <h2 className="mb-4 text-sm font-semibold text-white">Invite a teammate</h2>
        <InviteForm />
      </div>

      <div>
        <h2 className="mb-3 text-sm font-semibold text-white">Active admins</h2>
        <div className="flex flex-col divide-y divide-border rounded-lg border border-border">
          {admins.length === 0 && (
            <p className="px-4 py-3 text-sm text-text-faint">No admins yet.</p>
          )}
          {admins.map((a) => (
            <div key={a.id} className="flex items-center justify-between px-4 py-3">
              <div>
                <p className="text-sm text-text">{a.name}</p>
                <p className="text-xs text-text-faint">{a.email}</p>
              </div>
              <span className="text-xs text-text-faint">
                Joined {new Date(a.createdAt).toLocaleDateString()}
              </span>
            </div>
          ))}
        </div>
      </div>

      {pendingInvites.length > 0 && (
        <div>
          <h2 className="mb-3 text-sm font-semibold text-white">Pending invites</h2>
          <div className="flex flex-col divide-y divide-border rounded-lg border border-border">
            {pendingInvites.map((i) => (
              <div key={i.id} className="flex items-center justify-between px-4 py-3">
                <p className="text-sm text-text">{i.email}</p>
                <span className="text-xs text-text-faint">
                  Expires {new Date(i.expiresAt).toLocaleDateString()}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
