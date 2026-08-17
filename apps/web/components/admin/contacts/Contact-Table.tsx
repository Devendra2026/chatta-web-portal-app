
"use client";

import DataTable from "@/components/admin/DataTable";
import type { Contact } from "@/types/contact";

import { contactColumns } from "./Contact-Column";

type ContactTableProps = {
  data: Contact[];
};

export default function ContactTable({
  data,
}: ContactTableProps) {
  return (
    <DataTable
      columns={contactColumns}
      data={data}
      searchPlaceholder="Search by name, email, phone or subject"
      emptyMessage="No contact submissions found"
    />
  );
}
