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
  useDeleteContact,
  useUpdateContact,
} from "@/hooks/use-contacts";
import { useAdminAccess } from "@/hooks/use-admin-access";
import { AdminPermission } from "@/types/admin-access";
import type { Contact } from "@/types/contact";

type ContactDraft = {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
};

type ContactActionsProps = {
  contact: Contact;
};

function getContactDraft(contact: Contact): ContactDraft {
  return {
    name: contact.name,
    email: contact.email,
    phone: contact.phone,
    subject: contact.subject,
    message: contact.message,
  };
}

function getErrorMessage(error: unknown) {
  return error instanceof Error
    ? error.message
    : "Action could not be completed. Please try again.";
}

export default function ContactActions({
  contact,
}: ContactActionsProps) {
  const [detailsOpen, setDetailsOpen] =
    useState(false);
  const [deleteOpen, setDeleteOpen] =
    useState(false);
  const [draft, setDraft] = useState<ContactDraft>(
    getContactDraft(contact)
  );
  const [saveError, setSaveError] = useState("");
  const [deleteError, setDeleteError] = useState("");

  const { hasPermission } = useAdminAccess();
  const canUpdateContact = hasPermission(
    AdminPermission.ContactsUpdate
  );
  const canDeleteContact = hasPermission(
    AdminPermission.ContactsDelete
  );
  const updateContactMutation =
    useUpdateContact();
  const deleteContactMutation =
    useDeleteContact();

  useEffect(() => {
    if (detailsOpen) {
      setDraft(getContactDraft(contact));
      setSaveError("");
    }
  }, [contact, detailsOpen]);

  const handleDraftChange = (
    field: keyof ContactDraft,
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

    if (!canUpdateContact) {
      return;
    }

    setSaveError("");

    try {
      await updateContactMutation.mutateAsync({
        id: contact.id,
        data: draft,
      });

      setDetailsOpen(false);
    } catch (error) {
      setSaveError(getErrorMessage(error));
    }
  };

  const handleDelete = async () => {
    if (!canDeleteContact) {
      return;
    }

    setDeleteError("");

    try {
      await deleteContactMutation.mutateAsync(
        contact.id
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
          canUpdateContact
            ? "View and edit contact"
            : "View contact"
        }
        onClick={() => setDetailsOpen(true)}
      >
        <Eye className="h-4 w-4" />
        <span className="sr-only">
          View and edit contact
        </span>
      </Button>

      {canDeleteContact && (
        <Button
          type="button"
          variant="destructive"
          size="icon-sm"
          title="Delete contact"
          onClick={() => {
            setDeleteError("");
            setDeleteOpen(true);
          }}
        >
          <Trash2 className="h-4 w-4" />
          <span className="sr-only">
            Delete contact
          </span>
        </Button>
      )}

      <Dialog
        open={detailsOpen}
        onOpenChange={setDetailsOpen}
      >
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              Contact Submission #{contact.id}
            </DialogTitle>
            <DialogDescription>
              Submitted through the website contact form.
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
                {contact.id}
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor={`contact-name-${contact.id}`}>
                  Name
                </Label>
                <Input
                  id={`contact-name-${contact.id}`}
                  value={draft.name}
                  disabled={!canUpdateContact}
                  onChange={(event) =>
                    handleDraftChange(
                      "name",
                      event.target.value
                    )
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor={`contact-email-${contact.id}`}>
                  Email
                </Label>
                <Input
                  id={`contact-email-${contact.id}`}
                  type="email"
                  value={draft.email}
                  disabled={!canUpdateContact}
                  onChange={(event) =>
                    handleDraftChange(
                      "email",
                      event.target.value
                    )
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor={`contact-phone-${contact.id}`}>
                  Phone
                </Label>
                <Input
                  id={`contact-phone-${contact.id}`}
                  value={draft.phone}
                  disabled={!canUpdateContact}
                  onChange={(event) =>
                    handleDraftChange(
                      "phone",
                      event.target.value
                    )
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor={`contact-subject-${contact.id}`}>
                  Subject
                </Label>
                <Input
                  id={`contact-subject-${contact.id}`}
                  value={draft.subject}
                  disabled={!canUpdateContact}
                  onChange={(event) =>
                    handleDraftChange(
                      "subject",
                      event.target.value
                    )
                  }
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor={`contact-message-${contact.id}`}>
                Message
              </Label>
              <Textarea
                id={`contact-message-${contact.id}`}
                rows={5}
                value={draft.message}
                disabled={!canUpdateContact}
                onChange={(event) =>
                  handleDraftChange(
                    "message",
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

            {(canDeleteContact ||
              canUpdateContact) && (
              <DialogFooter>
                {canDeleteContact && (
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

                {canUpdateContact && (
                  <Button
                    type="submit"
                    disabled={
                      updateContactMutation.isPending
                    }
                  >
                    {updateContactMutation.isPending ? (
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
              Delete contact submission?
            </AlertDialogTitle>
            <AlertDialogDescription>
              This contact submission will be permanently deleted.
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
                deleteContactMutation.isPending
              }
            >
              Cancel
            </AlertDialogCancel>
            <Button
              type="button"
              variant="destructive"
              disabled={
                deleteContactMutation.isPending
              }
              onClick={handleDelete}
            >
              {deleteContactMutation.isPending ? (
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
