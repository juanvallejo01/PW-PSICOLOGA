"use client";

import { useActionState } from "react";
import { changePasswordAction } from "./actions";
import { Field, SaveButton } from "@/components/admin/ui";

const initialState = { error: undefined as string | undefined, success: undefined as string | undefined };

export function ChangePasswordForm() {
  const [state, formAction, pending] = useActionState(async (_prev: typeof initialState, formData: FormData) => {
    const result = await changePasswordAction(formData);
    return { error: result?.error, success: result?.success };
  }, initialState);

  return (
    <form action={formAction} className="space-y-4">
      {state.error && <p className="text-sm text-pink-500 bg-pink-100 rounded-lg px-3 py-2">{state.error}</p>}
      {state.success && <p className="text-sm text-aqua-600 bg-aqua-100 rounded-lg px-3 py-2">{state.success}</p>}
      <Field label="Contraseña actual" name="currentPassword" type="password" required />
      <Field label="Nueva contraseña" name="newPassword" type="password" required />
      <Field label="Confirmar nueva contraseña" name="confirmPassword" type="password" required />
      <SaveButton>{pending ? "Guardando..." : "Cambiar contraseña"}</SaveButton>
    </form>
  );
}
