"use client"

import type { ColumnDef} from "@tanstack/react-table"
import type { Contact } from "@/types/contact"
import ContactActions from "./Contact-Actions"

export const contactColumns: ColumnDef<Contact>[] = [
  {
    id: "serialNumber",
    header: "Sr. No.",
    cell: ({ row, table }) => (
      <span className="font-semibold text-slate-700">
        {table
          .getFilteredRowModel()
          .rows.findIndex((tableRow) => tableRow.id === row.id) + 1}
      </span>
    ),
  },
  {
    accessorKey: "name",
    header: "Name",
    cell: ({ row }) => (
      <span className="font-semibold text-slate-900">{row.original.name}</span>
    ),
  },
  {
    accessorKey: "email",
    header: "Email",
    cell: ({ row }) => (
      <span className="text-sm text-slate-700">{row.original.email}</span>
    ),
  },
  {
    accessorKey: "phone",
    header: "Phone",
    cell: ({ row }) => (
      <span className="text-sm whitespace-nowrap text-slate-700">
        {row.original.phone}
      </span>
    ),
  },
  {
    accessorKey: "subject",
    header: "Subject",
    cell: ({ row }) => (
      <span className="font-medium text-slate-800">{row.original.subject}</span>
    ),
  },
  {
    accessorKey: "message",
    header: "Message",
    cell: ({ row }) => (
      <p
        title={row.original.message}
        className="max-w-[300px] truncate text-sm text-slate-600"
      >
        {row.original.message}
      </p>
    ),
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => <ContactActions contact={row.original} />,
  },
]
