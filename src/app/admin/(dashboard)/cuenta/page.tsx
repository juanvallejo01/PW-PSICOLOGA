import type { Metadata } from "next";
import { AdminHeading, AdminCard } from "@/components/admin/ui";
import { ChangePasswordForm } from "./change-password-form";

export const metadata: Metadata = { title: "Mi cuenta" };

export default function AdminCuentaPage() {
  return (
    <div className="max-w-md space-y-6">
      <AdminHeading title="Mi cuenta" subtitle="Cambiá la contraseña de acceso al panel." />
      <AdminCard>
        <ChangePasswordForm />
      </AdminCard>
    </div>
  );
}
