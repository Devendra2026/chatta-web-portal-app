"use client";

import {
  Eye,
  Loader2,
  Trash2,
} from "lucide-react";
import { useState } from "react";

import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@workspace/ui/components/alert-dialog";
import { Button } from "@workspace/ui/components/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@workspace/ui/components/dialog";
import { useDeleteSignupUser } from "@/hooks/use-signup-users";
import type { SignupUser } from "@/types/admin-user";

type SignupUserActionsProps = {
  user: SignupUser;
  canDeleteUser: boolean;
};

function getErrorMessage(error: unknown) {
  return error instanceof Error
    ? error.message
    : "Could not delete user. Please try again.";
}

function DetailRow({
  label,
  value,
}: {
  label: string;
  value: string | number;
}) {
  return (
    <div className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2">
      <p className="text-xs font-semibold text-slate-500">
        {label}
      </p>
      <p className="mt-1 break-words text-sm font-semibold text-slate-900">
        {value || "Not provided"}
      </p>
    </div>
  );
}

export default function SignupUserActions({
  user,
  canDeleteUser,
}: SignupUserActionsProps) {
  const [detailsOpen, setDetailsOpen] =
    useState(false);
  const [deleteOpen, setDeleteOpen] =
    useState(false);
  const [deleteError, setDeleteError] = useState("");

  const deleteUserMutation =
    useDeleteSignupUser();

  const handleDelete = async () => {
    if (!canDeleteUser) {
      return;
    }

    setDeleteError("");

    try {
      await deleteUserMutation.mutateAsync(user.id);

      setDeleteOpen(false);
      setDetailsOpen(false);
    } catch (error) {
      setDeleteError(getErrorMessage(error));
    }
  };

  return (
    <div className="flex items-center gap-2">
      <Button
        type="button"
        variant="outline"
        size="icon-sm"
        title="View signup user"
        onClick={() => setDetailsOpen(true)}
      >
        <Eye className="h-4 w-4" />
        <span className="sr-only">
          View signup user
        </span>
      </Button>

      {canDeleteUser && (
        <Button
          type="button"
          variant="destructive"
          size="icon-sm"
          title="Delete signup user"
          onClick={() => {
            setDeleteError("");
            setDeleteOpen(true);
          }}
        >
          <Trash2 className="h-4 w-4" />
          <span className="sr-only">
            Delete signup user
          </span>
        </Button>
      )}

      <Dialog
        open={detailsOpen}
        onOpenChange={setDetailsOpen}
      >
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              Signup User #{user.id}
            </DialogTitle>
            <DialogDescription>
              User captured from the Clerk signup webhook.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-3 sm:grid-cols-2">
            <DetailRow
              label="Database ID"
              value={user.id}
            />
            <DetailRow
              label="Clerk ID"
              value={user.clerk_id}
            />
            <DetailRow
              label="Name"
              value={user.name}
            />
            <DetailRow
              label="Email"
              value={user.email}
            />
            <DetailRow
              label="Role"
              value={user.role}
            />
            <DetailRow
              label="Created At"
              value={user.created_at ?? ""}
            />
          </div>
        </DialogContent>
      </Dialog>

      <AlertDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Delete signup user?
            </AlertDialogTitle>
            <AlertDialogDescription>
              This user record will be permanently deleted from the admin table.
            </AlertDialogDescription>
          </AlertDialogHeader>

          {deleteError && (
            <p className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm font-medium text-red-700">
              {deleteError}
            </p>
          )}

          <AlertDialogFooter>
            <AlertDialogCancel
              disabled={deleteUserMutation.isPending}
            >
              Cancel
            </AlertDialogCancel>
            <Button
              type="button"
              variant="destructive"
              disabled={deleteUserMutation.isPending}
              onClick={handleDelete}
            >
              {deleteUserMutation.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Trash2 className="h-4 w-4" />
              )}
              Delete
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
