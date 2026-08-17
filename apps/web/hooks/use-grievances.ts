// "use client"

// import { useAuth } from "@clerk/nextjs"
// import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"

// import type { CreateGrievanceData, Grievance } from "@/types/public-grievance"

// import {
//   createGrievance,
//   deleteGrievance,
//   getAllGrievances,
//   getGrievanceById,
//   updateGrievance,
// } from "@/services/grievance-api"

// export const grievanceQueryKeys = {
//   all: ["grievances"] as const,

//   detail: (id: number) => ["grievances", "detail", id] as const,
// }

// type AdminQueryOptions = {
//   enabled?: boolean
//   suppressErrorLog?: boolean
// }

// async function requireAdminToken(getToken: () => Promise<string | null>) {
//   const token = await getToken()

//   if (!token) {
//     throw new Error(
//       "Authentication token not found. Please sign in with an admin account."
//     )
//   }

//   return token
// }

// /*
//  * GET ALL GRIEVANCES
//  */
// export function useGrievances(options: AdminQueryOptions = {}) {
//   const { getToken, isLoaded, isSignedIn } = useAuth()

//   return useQuery({
//     queryKey: grievanceQueryKeys.all,
//     queryFn: async () => {
//       const token = await requireAdminToken(getToken)

//       return getAllGrievances(token, {
//         suppressErrorLog: options.suppressErrorLog,
//       })
//     },
//     enabled: isLoaded && isSignedIn === true && (options.enabled ?? true),
//     retry: false,
//   })
// }

// /*
//  * GET GRIEVANCE BY ID
//  */
// export function useGrievance(id: number, options: AdminQueryOptions = {}) {
//   const { getToken, isLoaded, isSignedIn } = useAuth()

//   return useQuery({
//     queryKey: grievanceQueryKeys.detail(id),
//     queryFn: async () => {
//       const token = await requireAdminToken(getToken)

//       return getGrievanceById(id, token, {
//         suppressErrorLog: options.suppressErrorLog,
//       })
//     },
//     enabled:
//       isLoaded && isSignedIn === true && id > 0 && (options.enabled ?? true),
//     retry: false,
//   })
// }

// /*
//  * CREATE GRIEVANCE
//  */
// export function useCreateGrievance() {
//   const queryClient = useQueryClient()

//   return useMutation<Grievance, Error, CreateGrievanceData>({
//     mutationFn: createGrievance,

//     onSuccess: async () => {
//       await queryClient.invalidateQueries({
//         queryKey: grievanceQueryKeys.all,
//       })
//     },
//   })
// }

// /*
//  * UPDATE GRIEVANCE
//  */
// export function useUpdateGrievance() {
//   const queryClient = useQueryClient()
//   const { getToken } = useAuth()

//   return useMutation<
//     Grievance,
//     Error,
//     { id: number; data: Partial<CreateGrievanceData> }
//   >({
//     mutationFn: async ({ id, data }) => {
//       const token = await requireAdminToken(getToken)

//       return updateGrievance(id, data, token)
//     },

//     onSuccess: async (updatedGrievance) => {
//       queryClient.setQueryData(
//         grievanceQueryKeys.detail(updatedGrievance.id),
//         updatedGrievance
//       )

//       await queryClient.invalidateQueries({
//         queryKey: grievanceQueryKeys.all,
//       })
//     },
//   })
// }

// /*
//  * DELETE GRIEVANCE
//  */
// export function useDeleteGrievance() {
//   const queryClient = useQueryClient()
//   const { getToken } = useAuth()

//   return useMutation<void, Error, number>({
//     mutationFn: async (id) => {
//       const token = await requireAdminToken(getToken)

//       return deleteGrievance(id, token)
//     },

//     onSuccess: async () => {
//       await queryClient.invalidateQueries({
//         queryKey: grievanceQueryKeys.all,
//       })
//     },
//   })
// }
"use client"

import { useAuth } from "@clerk/nextjs"
import {
  useMutation,
  useQuery,
  useQueryClient,
  type UseMutationResult,
  type UseQueryResult,
} from "@tanstack/react-query"

import type { CreateGrievanceData, Grievance } from "@/types/public-grievance"

import {
  createGrievance,
  deleteGrievance,
  getAllGrievances,
  getGrievanceById,
  updateGrievance,
} from "@/services/grievance-api"

export const grievanceQueryKeys = {
  all: ["grievances"] as const,

  detail: (id: number) => ["grievances", "detail", id] as const,
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

/*
 * GET ALL GRIEVANCES
 */
export function useGrievances(
  options: AdminQueryOptions = {}
): UseQueryResult<Grievance[], Error> {
  const { getToken, isLoaded, isSignedIn } = useAuth()

  return useQuery({
    queryKey: grievanceQueryKeys.all,
    queryFn: async () => {
      const token = await requireAdminToken(getToken)

      return getAllGrievances(token, {
        suppressErrorLog: options.suppressErrorLog,
      })
    },
    enabled: isLoaded && isSignedIn === true && (options.enabled ?? true),
    retry: false,
  })
}

/*
 * GET GRIEVANCE BY ID
 */
export function useGrievance(
  id: number,
  options: AdminQueryOptions = {}
): UseQueryResult<Grievance, Error> {
  const { getToken, isLoaded, isSignedIn } = useAuth()

  return useQuery({
    queryKey: grievanceQueryKeys.detail(id),
    queryFn: async () => {
      const token = await requireAdminToken(getToken)

      return getGrievanceById(id, token, {
        suppressErrorLog: options.suppressErrorLog,
      })
    },
    enabled:
      isLoaded && isSignedIn === true && id > 0 && (options.enabled ?? true),
    retry: false,
  })
}

/*
 * CREATE GRIEVANCE
 */
export function useCreateGrievance(): UseMutationResult<
  Grievance,
  Error,
  CreateGrievanceData
> {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: createGrievance,

    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: grievanceQueryKeys.all,
      })
    },
  })
}

/*
 * UPDATE GRIEVANCE
 */
export function useUpdateGrievance(): UseMutationResult<
  Grievance,
  Error,
  { id: number; data: Partial<CreateGrievanceData> }
> {
  const queryClient = useQueryClient()
  const { getToken } = useAuth()

  return useMutation({
    mutationFn: async ({ id, data }) => {
      const token = await requireAdminToken(getToken)

      return updateGrievance(id, data, token)
    },

    onSuccess: async (updatedGrievance) => {
      queryClient.setQueryData(
        grievanceQueryKeys.detail(updatedGrievance.id),
        updatedGrievance
      )

      await queryClient.invalidateQueries({
        queryKey: grievanceQueryKeys.all,
      })
    },
  })
}

/*
 * DELETE GRIEVANCE
 */
export function useDeleteGrievance(): UseMutationResult<void, Error, number> {
  const queryClient = useQueryClient()
  const { getToken } = useAuth()

  return useMutation({
    mutationFn: async (id) => {
      const token = await requireAdminToken(getToken)

      return deleteGrievance(id, token)
    },

    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: grievanceQueryKeys.all,
      })
    },
  })
}
