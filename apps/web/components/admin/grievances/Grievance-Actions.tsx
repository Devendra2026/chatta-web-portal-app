"use client";

import { useEffect, useState } from "react";
import {
  Eye,
  Loader2,
  Save,
  Trash2,
} from "lucide-react";

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
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@workspace/ui/components/dialog";
import { Input } from "@workspace/ui/components/input";
import { Label } from "@workspace/ui/components/label";
import { Textarea } from "@workspace/ui/components/textarea";
import {
  useDeleteGrievance,
  useUpdateGrievance,
} from "@/hooks/use-grievances";
import { useAdminAccess } from "@/hooks/use-admin-access";
import { AdminPermission } from "@/types/admin-access";
import type { Grievance } from "@/types/public-grievance";

type GrievanceDraft = {
  full_name: string;
  mobile_number: string;
  email: string;
  complaint_category: string;
  municipal_ward: string;
  incident_address: string;
  description: string;
};

type GrievanceActionsProps = {
  grievance: Grievance;
};

function getGrievanceDraft(
  grievance: Grievance
): GrievanceDraft {
  return {
    full_name: grievance.full_name,
    mobile_number: grievance.mobile_number,
    email: grievance.email,
    complaint_category:
      grievance.complaint_category,
    municipal_ward: grievance.municipal_ward,
    incident_address:
      grievance.incident_address,
    description: grievance.description,
  };
}

function getErrorMessage(error: unknown) {
  return error instanceof Error
    ? error.message
    : "Action complete nahi ho paya";
}

export default function GrievanceActions({
  grievance,
}: GrievanceActionsProps) {
  const [detailsOpen, setDetailsOpen] =
    useState(false);
  const [deleteOpen, setDeleteOpen] =
    useState(false);
  const [draft, setDraft] =
    useState<GrievanceDraft>(
      getGrievanceDraft(grievance)
    );
  const [saveError, setSaveError] = useState("");
  const [deleteError, setDeleteError] = useState("");

  const { hasPermission } = useAdminAccess();
  const canUpdateGrievance = hasPermission(
    AdminPermission.GrievancesUpdate
  );
  const canDeleteGrievance = hasPermission(
    AdminPermission.GrievancesDelete
  );
  const updateGrievanceMutation =
    useUpdateGrievance();
  const deleteGrievanceMutation =
    useDeleteGrievance();

  useEffect(() => {
    if (detailsOpen) {
      setDraft(getGrievanceDraft(grievance));
      setSaveError("");
    }
  }, [grievance, detailsOpen]);

  const handleDraftChange = (
    field: keyof GrievanceDraft,
    value: string
  ) => {
    setDraft((currentDraft) => ({
      ...currentDraft,
      [field]: value,
    }));

    if (saveError) {
      setSaveError("");
    }
  };

  const handleSave = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    if (!canUpdateGrievance) {
      return;
    }

    setSaveError("");

    try {
      await updateGrievanceMutation.mutateAsync({
        id: grievance.id,
        data: draft,
      });

      setDetailsOpen(false);
    } catch (error) {
      setSaveError(getErrorMessage(error));
    }
  };

  const handleDelete = async () => {
    if (!canDeleteGrievance) {
      return;
    }

    setDeleteError("");

    try {
      await deleteGrievanceMutation.mutateAsync(
        grievance.id
      );

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
        title={
          canUpdateGrievance
            ? "View and edit grievance"
            : "View grievance"
        }
        onClick={() => setDetailsOpen(true)}
      >
        <Eye className="h-4 w-4" />
        <span className="sr-only">
          View and edit grievance
        </span>
      </Button>

      {canDeleteGrievance && (
        <Button
          type="button"
          variant="destructive"
          size="icon-sm"
          title="Delete grievance"
          onClick={() => {
            setDeleteError("");
            setDeleteOpen(true);
          }}
        >
          <Trash2 className="h-4 w-4" />
          <span className="sr-only">
            Delete grievance
          </span>
        </Button>
      )}

      <Dialog
        open={detailsOpen}
        onOpenChange={setDetailsOpen}
      >
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-3xl">
          <DialogHeader>
            <DialogTitle>
              Public Grievance #{grievance.id}
            </DialogTitle>
            <DialogDescription>
              Citizen grievance record from the public portal.
            </DialogDescription>
          </DialogHeader>

          <form
            className="space-y-4"
            onSubmit={handleSave}
          >
            <div className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2">
              <p className="text-xs font-semibold text-slate-500">
                Database ID
              </p>
              <p className="mt-1 text-sm font-bold text-slate-900">
                {grievance.id}
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label
                  htmlFor={`grievance-name-${grievance.id}`}
                >
                  Citizen Name
                </Label>
                <Input
                  id={`grievance-name-${grievance.id}`}
                  value={draft.full_name}
                  disabled={!canUpdateGrievance}
                  onChange={(event) =>
                    handleDraftChange(
                      "full_name",
                      event.target.value
                    )
                  }
                />
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor={`grievance-mobile-${grievance.id}`}
                >
                  Mobile Number
                </Label>
                <Input
                  id={`grievance-mobile-${grievance.id}`}
                  value={draft.mobile_number}
                  disabled={!canUpdateGrievance}
                  onChange={(event) =>
                    handleDraftChange(
                      "mobile_number",
                      event.target.value
                    )
                  }
                />
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor={`grievance-email-${grievance.id}`}
                >
                  Email
                </Label>
                <Input
                  id={`grievance-email-${grievance.id}`}
                  type="email"
                  value={draft.email}
                  disabled={!canUpdateGrievance}
                  onChange={(event) =>
                    handleDraftChange(
                      "email",
                      event.target.value
                    )
                  }
                />
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor={`grievance-category-${grievance.id}`}
                >
                  Category
                </Label>
                <Input
                  id={`grievance-category-${grievance.id}`}
                  value={draft.complaint_category}
                  disabled={!canUpdateGrievance}
                  onChange={(event) =>
                    handleDraftChange(
                      "complaint_category",
                      event.target.value
                    )
                  }
                />
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor={`grievance-ward-${grievance.id}`}
                >
                  Ward
                </Label>
                <Input
                  id={`grievance-ward-${grievance.id}`}
                  value={draft.municipal_ward}
                  disabled={!canUpdateGrievance}
                  onChange={(event) =>
                    handleDraftChange(
                      "municipal_ward",
                      event.target.value
                    )
                  }
                />
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor={`grievance-address-${grievance.id}`}
                >
                  Incident Address
                </Label>
                <Input
                  id={`grievance-address-${grievance.id}`}
                  value={draft.incident_address}
                  disabled={!canUpdateGrievance}
                  onChange={(event) =>
                    handleDraftChange(
                      "incident_address",
                      event.target.value
                    )
                  }
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label
                htmlFor={`grievance-description-${grievance.id}`}
              >
                Description
              </Label>
              <Textarea
                id={`grievance-description-${grievance.id}`}
                rows={5}
                value={draft.description}
                disabled={!canUpdateGrievance}
                onChange={(event) =>
                  handleDraftChange(
                    "description",
                    event.target.value
                  )
                }
              />
            </div>

            {saveError && (
              <p className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm font-medium text-red-700">
                {saveError}
              </p>
            )}

            {(canDeleteGrievance ||
              canUpdateGrievance) && (
              <DialogFooter>
                {canDeleteGrievance && (
                  <Button
                    type="button"
                    variant="destructive"
                    onClick={() => {
                      setDeleteError("");
                      setDeleteOpen(true);
                    }}
                  >
                    <Trash2 className="h-4 w-4" />
                    Delete
                  </Button>
                )}

                {canUpdateGrievance && (
                  <Button
                    type="submit"
                    disabled={
                      updateGrievanceMutation.isPending
                    }
                  >
                    {updateGrievanceMutation
                      .isPending ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Save className="h-4 w-4" />
                    )}
                    Save
                  </Button>
                )}
              </DialogFooter>
            )}
          </form>
        </DialogContent>
      </Dialog>

      <AlertDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Delete public grievance?
            </AlertDialogTitle>
            <AlertDialogDescription>
              This grievance will be permanently deleted.
            </AlertDialogDescription>
          </AlertDialogHeader>

          {deleteError && (
            <p className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm font-medium text-red-700">
              {deleteError}
            </p>
          )}

          <AlertDialogFooter>
            <AlertDialogCancel
              disabled={
                deleteGrievanceMutation.isPending
              }
            >
              Cancel
            </AlertDialogCancel>
            <Button
              type="button"
              variant="destructive"
              disabled={
                deleteGrievanceMutation.isPending
              }
              onClick={handleDelete}
            >
              {deleteGrievanceMutation.isPending ? (
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
