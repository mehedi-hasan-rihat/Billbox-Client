import type { Metadata } from "next";
import { AuthShell } from "@/components/auth/auth-shell";
import { RegisterForm } from "@/components/auth/register-form";

export const metadata: Metadata = {
  title: "Create account — BillBox",
  description: "Create your BillBox account and get your personal bill inbox.",
};

export default function RegisterPage() {
  return (
    <AuthShell
      title="Create your inbox"
      subtitle="New to BillBox"
    >
      <RegisterForm />
    </AuthShell>
  );
}
