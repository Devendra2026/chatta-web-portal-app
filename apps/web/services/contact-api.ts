import { z } from "zod"

import { apiRequest } from "@/lib/api-clients"

import {
  contactSchema,
  type Contact,
  type CreateContactData,
} from "@/types/contact"

const CONTACT_ENDPOINT = "/api/contact"

type ApiServiceOptions = {
  suppressErrorLog?: boolean
}

function getContactEndpoint(id: number) {
  return `${CONTACT_ENDPOINT.replace(/\/+$/, "")}/${id}`
}

// POST: naya contact submit karna
export async function createContact(data: CreateContactData): Promise<Contact> {
  const response = await apiRequest<unknown>(CONTACT_ENDPOINT, {
    method: "POST",
    body: JSON.stringify(data),
  })

  return contactSchema.parse(response)
}
// GET ALL

export async function getAllContacts(
  token?: string,
  options: ApiServiceOptions = {}
): Promise<Contact[]> {
  const response = await apiRequest<unknown>(CONTACT_ENDPOINT, {
    token,
    suppressErrorLog: options.suppressErrorLog,
  })
  return z.array(contactSchema).parse(response)
}

// get by id
export async function getContactById(
  id: number,
  token?: string,
  options: ApiServiceOptions = {}
): Promise<Contact> {
  const response = await apiRequest<unknown>(getContactEndpoint(id), {
    method: "GET",
    token,
    suppressErrorLog: options.suppressErrorLog,
  })
  return contactSchema.parse(response)
}

// put
export async function updateContact(
  id: number,
  data: Partial<CreateContactData>,
  token?: string
): Promise<Contact> {
  const response = await apiRequest<unknown>(getContactEndpoint(id), {
    method: "PUT",
    body: JSON.stringify(data),
    token,
  })
  return contactSchema.parse(response)
}
// delete
export async function deleteContact(id: number, token?: string): Promise<void> {
  await apiRequest<void>(getContactEndpoint(id), {
    method: "DELETE",
    token,
  })
}
