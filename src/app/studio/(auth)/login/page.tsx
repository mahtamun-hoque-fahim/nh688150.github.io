import { Suspense } from "react";
import { StudioAuthLayout } from "@/components/studio/StudioAuthLayout";
import { LoginForm } from "@/components/studio/LoginForm";

export default function StudioLoginPage() {
  return (
    <StudioAuthLayout title="Falcotrix Studio" subtitle="Sign in to manage the site">
      <Suspense fallback={null}>
        <LoginForm />
      </Suspense>
    </StudioAuthLayout>
  );
}
