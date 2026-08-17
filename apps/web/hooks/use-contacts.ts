
"use client"

import { useAuth } from "@clerk/nextjs"
import {
  useMutation,
  useQuery,
  useQueryClient,
  type UseMutationResult,
  type UseQueryResult,
} from "@tanstack/react-query"

import type { Contact, CreateContactData } from "@/types/contact"
import {
  createContact,
  deleteContact,
  getAllContacts,
  getContactById,
  updateContact,
} from "@/services/contact-api"

export const contactQueryKeys = {
  all: ["contacts"] as const,

  detail: (id: number) => ["contacts", "detail", id] as const,
}

type AdminQueryOptions = {
  enabled?: boolean
  suppressErrorLog?: boolean
}

async function requireAdminToken(getToken: () => Promise<string | null>) {
  const token = await getToken()

  if (!token) {
    throw new Error(
      "Authentication token not found. Please sign in with an admin account."
    )
  }

  return token
}

export function useContacts(
  options: AdminQueryOptions = {}
): UseQueryResult<Contact[], Error> {
  const { getToken, isLoaded, isSignedIn } = useAuth()

  return useQuery({
    queryKey: contactQueryKeys.all,
    queryFn: async () => {
      const token = await requireAdminToken(getToken)

      return getAllContacts(token, {
        suppressErrorLog: options.suppressErrorLog,
      })
    },
    enabled: isLoaded && isSignedIn === true && (options.enabled ?? true),
  })
}

// Ek contact ko ID se fetch karne ka hook
export function useContact(
  id: number,
  options: AdminQueryOptions = {}
): UseQueryResult<Contact, Error> {
  const { getToken, isLoaded, isSignedIn } = useAuth()

  return useQuery({
    queryKey: contactQueryKeys.detail(id),
    queryFn: async () => {
      const token = await requireAdminToken(getToken)

      return getContactById(id, token, {
        suppressErrorLog: options.suppressErrorLog,
      })
    },
    enabled:
      isLoaded && isSignedIn === true && id > 0 && (options.enabled ?? true),
  })
}

// Contact create karne ka hook
export function useCreateContact(): UseMutationResult<
  Contact,
  Error,
  CreateContactData
> {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: createContact,

    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: contactQueryKeys.all,
      })
    },
  })
}

// Contact update karne ka hook
export function useUpdateContact(): UseMutationResult<
  Contact,
  Error,
  { id: number; data: Partial<CreateContactData> }
> {
  const queryClient = useQueryClient()
  const { getToken } = useAuth()

  return useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: number
      data: Partial<CreateContactData>
    }) => {
      const token = await requireAdminToken(getToken)

      return updateContact(id, data, token)
    },

    onSuccess: async (updatedContact) => {
      queryClient.setQueryData(
        contactQueryKeys.detail(updatedContact.id),
        updatedContact
      )

      await queryClient.invalidateQueries({
        queryKey: contactQueryKeys.all,
      })
    },
  })
}

// Contact delete karne ka hook
export function useDeleteContact(): UseMutationResult<void, Error, number> {
  const queryClient = useQueryClient()
  const { getToken } = useAuth()

  return useMutation({
    mutationFn: async (id: number) => {
      const token = await requireAdminToken(getToken)

      return deleteContact(id, token)
    },

    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: contactQueryKeys.all,
      })
    },
  })
}
