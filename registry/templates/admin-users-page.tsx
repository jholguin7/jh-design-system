"use client";
import { cn } from "../lib/cn";

export interface AdminUser {
  id: string;
  email: string;
  name?: string;
  role: string;
  status?: "active" | "invited" | "disabled";
}

export interface AdminUsersPageProps {
  users: AdminUser[];
  roles?: string[];
  onInvite?: () => void;
  onRoleChange?: (userId: string, role: string) => void;
  onDelete?: (userId: string) => void;
  inviteLabel?: string;
  deleteLabel?: string;
  className?: string;
}

export function AdminUsersPage({
  users,
  roles = [],
  onInvite,
  onRoleChange,
  onDelete,
  inviteLabel = "Invite user",
  deleteLabel = "Delete",
  className,
}: AdminUsersPageProps) {
  return (
    <div className={cn("max-w-4xl mx-auto py-8 px-4", className)}>
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-xl font-bold text-[var(--fg)]">Users</h1>
        {onInvite && (
          <button
            type="button"
            onClick={onInvite}
            className="rounded-md bg-[var(--primary)] text-[var(--primary-fg)] px-3 py-1.5 text-sm font-medium hover:bg-[var(--primary-hover)]"
          >
            {inviteLabel}
          </button>
        )}
      </div>
      <div className="rounded-lg border border-[var(--border)] bg-[var(--bg-card)] overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-[var(--bg-subtle)] text-left text-[11px] uppercase text-[var(--fg-muted)]">
            <tr>
              <th className="px-3 py-2 font-medium">Email</th>
              <th className="px-3 py-2 font-medium">Name</th>
              <th className="px-3 py-2 font-medium">Role</th>
              <th className="px-3 py-2 font-medium">Status</th>
              <th className="px-3 py-2 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--border-subtle)]">
            {users.map((u) => (
              <tr key={u.id}>
                <td className="px-3 py-2">{u.email}</td>
                <td className="px-3 py-2">{u.name ?? "—"}</td>
                <td className="px-3 py-2">
                  {onRoleChange && roles.length > 0 ? (
                    <select
                      aria-label={`Role for ${u.email}`}
                      value={u.role}
                      onChange={(e) => onRoleChange(u.id, e.target.value)}
                      className="text-xs rounded border border-[var(--border)] px-1 py-0.5"
                    >
                      {roles.map((r) => (
                        <option key={r} value={r}>
                          {r}
                        </option>
                      ))}
                    </select>
                  ) : (
                    u.role
                  )}
                </td>
                <td className="px-3 py-2 text-xs text-[var(--fg-muted)]">
                  {u.status ?? "—"}
                </td>
                <td className="px-3 py-2 text-right">
                  {onDelete && (
                    <button
                      type="button"
                      onClick={() => onDelete(u.id)}
                      className="text-xs text-[var(--fg-muted)] hover:text-[var(--fg)]"
                    >
                      {deleteLabel}
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
