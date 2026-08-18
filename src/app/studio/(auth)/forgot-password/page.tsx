import { StudioAuthLayout } from "@/components/studio/StudioAuthLayout";
import { ForgotPasswordForm } from "@/components/studio/ForgotPasswordForm";

export default function ForgotPasswordPage() {
  return (
    <StudioAuthLayout
      title="Reset your password"
      subtitle="Enter your email and we'll send you a link"
    >
      <ForgotPasswordForm />
    </StudioAuthLayout>
  );
}
