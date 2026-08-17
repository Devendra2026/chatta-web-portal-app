import { z } from "zod"

import { apiRequest } from "@/lib/api-clients"

import {
  grievanceSchema,
  type CreateGrievanceData,
  type Grievance,
} from "@/types/public-grievance"

const GRIEVANCE_ENDPOINT = "/api/grievance"

type ApiServiceOptions = {
  suppressErrorLog?: boolean
}

function getGrievanceEndpoint(id: number) {
  return `${GRIEVANCE_ENDPOINT.replace(/\/+$/, "")}/${id}`
}

// POST: Public grievance submit karna
export async function createGrievance(
  data: CreateGrievanceData
): Promise<Grievance> {
  const response = await apiRequest<unknown>(GRIEVANCE_ENDPOINT, {
    method: "POST",
    body: JSON.stringify(data),
  })

  return grievanceSchema.parse(response)
}

// GET ALL: Saare grievances fetch karna
export async function getAllGrievances(
  token?: string,
  options: ApiServiceOptions = {}
): Promise<Grievance[]> {
  const response = await apiRequest<unknown>(GRIEVANCE_ENDPOINT, {
    token,
    suppressErrorLog: options.suppressErrorLog,
  })

  return z.array(grievanceSchema).parse(response)
}

// GET BY ID: Single grievance fetch karna
export async function getGrievanceById(
  id: number,
  token?: string,
  options: ApiServiceOptions = {}
): Promise<Grievance> {
  const response = await apiRequest<unknown>(getGrievanceEndpoint(id), {
    token,
    suppressErrorLog: options.suppressErrorLog,
  })

  return grievanceSchema.parse(response)
}

// PUT / PATCH: Grievance update karna
export async function updateGrievance(
  id: number,
  data: Partial<CreateGrievanceData>,
  token?: string
): Promise<Grievance> {
  const response = await apiRequest<unknown>(getGrievanceEndpoint(id), {
    method: "PUT",
    body: JSON.stringify(data),
    token,
  })

  return grievanceSchema.parse(response)
}

// DELETE: Grievance delete karna
export async function deleteGrievance(
  id: number,
  token?: string
): Promise<void> {
  await apiRequest<void>(getGrievanceEndpoint(id), {
    method: "DELETE",
    token,
  })
}
