
"use client";

import DataTable from "@/components/admin/DataTable";
import type { Grievance } from "@/types/public-grievance";

import { grievanceColumns } from "./Grievance-Column";

type GrievanceTableProps = {
  data: Grievance[];
};

export default function GrievanceTable({
  data,
}: GrievanceTableProps) {
  return (
    <DataTable
      columns={grievanceColumns}
      data={data}
      searchPlaceholder="Search by name, email, phone, category or ward"
      emptyMessage="No grievance submissions found"
    />
  );
}
