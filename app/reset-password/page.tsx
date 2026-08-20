import { Suspense } from "react";
import ResetPasswordPage from "./_components/reset-password-page";

export default function Page() {
  return (
    <Suspense>
      <ResetPasswordPage />
    </Suspense>
  );
}
