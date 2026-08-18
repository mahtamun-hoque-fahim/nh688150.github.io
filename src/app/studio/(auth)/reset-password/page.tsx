import { Suspense } from "react";
import { StudioAuthLayout } from "@/components/studio/StudioAuthLayout";
import { ResetPasswordForm } from "@/components/studio/ResetPasswordForm";

export default function ResetPasswordPage() {
  return (
    <StudioAuthLayout title="Set a new password">
      <Suspense fallback={null}>
        <ResetPasswordForm />
      </Suspense>
    </StudioAuthLayout>
  );
}
