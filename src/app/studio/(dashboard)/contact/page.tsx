import { listContactMessages } from "@/lib/actions/contact";
import { ContactInboxList } from "@/components/studio/ContactInboxList";

export default async function StudioContactPage() {
  const messages = await listContactMessages();
  const newCount = messages.filter((m) => m.status === "new").length;

  return (
    <div className="flex max-w-3xl flex-col gap-6">
      <div>
        <h1 className="font-display text-2xl font-medium tracking-tight text-white">
          Contact Messages
        </h1>
        <p className="mt-2 text-sm text-text-muted">
          Submissions from the Contact form.
          {newCount > 0 && ` ${newCount} unread.`}
        </p>
      </div>

      <ContactInboxList initialMessages={messages} />
    </div>
  );
}
