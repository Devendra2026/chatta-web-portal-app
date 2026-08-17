// "use client";

// import { useEffect, useMemo, useState } from "react";
// import {
//   Check,
//   Eye,
//   KeyRound,
//   Loader2,
//   Plus,
//   Save,
//   Search,
//   ShieldCheck,
//   Trash2,
// } from "lucide-react";

// import {
//   AlertDialog,
//   AlertDialogCancel,
//   AlertDialogContent,
//   AlertDialogDescription,
//   AlertDialogFooter,
//   AlertDialogHeader,
//   AlertDialogTitle,
// } from "@workspace/ui/components/alert-dialog";
// import { Button } from "@workspace/ui/components/button";
// import {
//   Dialog,
//   DialogContent,
//   DialogDescription,
//   DialogFooter,
//   DialogHeader,
//   DialogTitle,
// } from "@workspace/ui/components/dialog";
// import { Input } from "@workspace/ui/components/input";
// import { Label } from "@workspace/ui/components/label";
// import { Textarea } from "@workspace/ui/components/textarea";
// import {
//   useCreateRole,
//   useDeleteRole,
//   usePermissions,
//   useRoles,
//   useUpdateRole,
//   useUpdateRolePermissions,
// } from "@/hooks/use-rbac";
// import { useAdminAccess } from "@/hooks/use-admin-access";
// import { AdminPermission } from "@/types/admin-access";
// import type { Permission, Role } from "@/types/rbac";

// type PermissionGroup = {
//   group: string;
//   permissions: Permission[];
// };

// type RoleDraft = {
//   name: string;
//   description: string;
//   permissionKeys: string[];
// };

// type CreateRoleDraft = {
//   name: string;
//   key: string;
//   description: string;
// };

// const initialCreateRoleDraft: CreateRoleDraft = {
//   name: "",
//   key: "",
//   description: "",
// };

// function getErrorMessage(error: unknown) {
//   return error instanceof Error
//     ? error.message
//     : "Action complete nahi ho paya";
// }

// function formatGroupName(group: string) {
//   return group
//     .replace(/[_-]+/g, " ")
//     .replace(/\s+/g, " ")
//     .trim()
//     .replace(/\b\w/g, (letter) =>
//       letter.toUpperCase()
//     );
// }

// function getRoleDraft(role: Role): RoleDraft {
//   return {
//     name: role.name,
//     description: role.description ?? "",
//     permissionKeys: role.permissions.map(
//       (permission) => permission.key
//     ),
//   };
// }

// function groupPermissions(
//   permissions: Permission[],
//   searchTerm: string
// ): PermissionGroup[] {
//   const normalizedSearch =
//     searchTerm.trim().toLowerCase();
//   const groups = new Map<string, Permission[]>();

//   for (const permission of permissions) {
//     const searchableText = [
//       permission.key,
//       permission.label,
//       permission.group,
//       permission.description ?? "",
//     ]
//       .join(" ")
//       .toLowerCase();

//     if (
//       normalizedSearch &&
//       !searchableText.includes(normalizedSearch)
//     ) {
//       continue;
//     }

//     const existingPermissions =
//       groups.get(permission.group) ?? [];

//     existingPermissions.push(permission);
//     groups.set(permission.group, existingPermissions);
//   }

//   return Array.from(groups.entries())
//     .map(([group, permissions]) => ({
//       group,
//       permissions,
//     }))
//     .sort((firstGroup, secondGroup) =>
//       firstGroup.group.localeCompare(
//         secondGroup.group
//       )
//     );
// }

// function roleMatchesSearch(
//   role: Role,
//   searchTerm: string
// ) {
//   const normalizedSearch =
//     searchTerm.trim().toLowerCase();

//   if (!normalizedSearch) {
//     return true;
//   }

//   const permissionText = role.permissions
//     .map((permission) =>
//       [
//         permission.key,
//         permission.label,
//         permission.group,
//       ].join(" ")
//     )
//     .join(" ");

//   return [
//     role.name,
//     role.key,
//     role.description ?? "",
//     permissionText,
//   ]
//     .join(" ")
//     .toLowerCase()
//     .includes(normalizedSearch);
// }

// function DetailRow({
//   label,
//   value,
// }: {
//   label: string;
//   value: string | number | boolean;
// }) {
//   return (
//     <div className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2">
//       <p className="text-xs font-semibold text-slate-500">
//         {label}
//       </p>
//       <p className="mt-1 break-words text-sm font-semibold text-slate-900">
//         {value === ""
//           ? "Not provided"
//           : String(value)}
//       </p>
//     </div>
//   );
// }

// export default function RolesPermissionsManager() {
//   const {
//     hasPermission,
//     isPermissionUnknown,
//   } = useAdminAccess();
//   const canReadRoles =
//     hasPermission(AdminPermission.RolesRead) ||
//     isPermissionUnknown;
//   const canReadPermissions =
//     hasPermission(
//       AdminPermission.PermissionsRead
//     ) || isPermissionUnknown;
//   const canCreateRole = hasPermission(
//     AdminPermission.RolesCreate
//   );
//   const canUpdateRole = hasPermission(
//     AdminPermission.RolesUpdate
//   );
//   const canDeleteRole = hasPermission(
//     AdminPermission.RolesDelete
//   );
//   const canUpdateRolePermissions =
//     hasPermission(
//       AdminPermission.RolesPermissionsUpdate
//     );
//   const canSave =
//     canUpdateRole || canUpdateRolePermissions;

//   const rolesQuery = useRoles({
//     enabled: canReadRoles,
//     suppressErrorLog: isPermissionUnknown,
//   });
//   const permissionsQuery = usePermissions({
//     enabled: canReadPermissions,
//     suppressErrorLog: isPermissionUnknown,
//   });
//   const createRoleMutation = useCreateRole();
//   const updateRoleMutation = useUpdateRole();
//   const updateRolePermissionsMutation =
//     useUpdateRolePermissions();
//   const deleteRoleMutation = useDeleteRole();

//   const roles = rolesQuery.data ?? [];
//   const permissions = permissionsQuery.data ?? [];

//   const [searchTerm, setSearchTerm] = useState("");
//   const [selectedRoleId, setSelectedRoleId] =
//     useState<number | null>(null);
//   const [draft, setDraft] = useState<RoleDraft>({
//     name: "",
//     description: "",
//     permissionKeys: [],
//   });
//   const [createOpen, setCreateOpen] =
//     useState(false);
//   const [detailsOpen, setDetailsOpen] =
//     useState(false);
//   const [deleteOpen, setDeleteOpen] =
//     useState(false);
//   const [createDraft, setCreateDraft] =
//     useState<CreateRoleDraft>(
//       initialCreateRoleDraft
//     );
//   const [statusMessage, setStatusMessage] =
//     useState("");
//   const [errorMessage, setErrorMessage] =
//     useState("");

//   const selectedRole =
//     roles.find((role) => role.id === selectedRoleId) ??
//     roles[0] ??
//     null;

//   useEffect(() => {
//     if (
//       selectedRoleId === null &&
//       roles.length > 0
//     ) {
//       setSelectedRoleId(roles[0].id);
//     }
//   }, [roles, selectedRoleId]);

//   useEffect(() => {
//     if (selectedRole) {
//       setDraft(getRoleDraft(selectedRole));
//       setStatusMessage("");
//       setErrorMessage("");
//     }
//   }, [selectedRole]);

//   const filteredRoles = useMemo(
//     () =>
//       roles.filter((role) =>
//         roleMatchesSearch(role, searchTerm)
//       ),
//     [roles, searchTerm]
//   );

//   const permissionGroups = useMemo(
//     () => groupPermissions(permissions, searchTerm),
//     [permissions, searchTerm]
//   );

//   const selectedPermissionKeys = new Set(
//     draft.permissionKeys
//   );

//   const isSaving =
//     updateRoleMutation.isPending ||
//     updateRolePermissionsMutation.isPending;

//   const isLoading =
//     rolesQuery.isLoading ||
//     permissionsQuery.isLoading;

//   const isError =
//     rolesQuery.isError ||
//     permissionsQuery.isError;

//   const totalSelectedPermissions =
//     draft.permissionKeys.length;

//   const handleSelectRole = (role: Role) => {
//     setSelectedRoleId(role.id);
//   };

//   const handlePermissionToggle = (
//     permissionKey: string
//   ) => {
//     if (!canUpdateRolePermissions) {
//       return;
//     }

//     setStatusMessage("");
//     setErrorMessage("");

//     setDraft((currentDraft) => {
//       const nextPermissionKeys = new Set(
//         currentDraft.permissionKeys
//       );

//       if (nextPermissionKeys.has(permissionKey)) {
//         nextPermissionKeys.delete(permissionKey);
//       } else {
//         nextPermissionKeys.add(permissionKey);
//       }

//       return {
//         ...currentDraft,
//         permissionKeys: Array.from(
//           nextPermissionKeys
//         ),
//       };
//     });
//   };

//   const handleSaveChanges = async () => {
//     if (!selectedRole || !canSave) {
//       return;
//     }

//     setStatusMessage("");
//     setErrorMessage("");

//     try {
//       if (canUpdateRole) {
//         await updateRoleMutation.mutateAsync({
//           id: selectedRole.id,
//           data: {
//             name: draft.name,
//             description: draft.description,
//           },
//         });
//       }

//       if (canUpdateRolePermissions) {
//         await updateRolePermissionsMutation.mutateAsync({
//           id: selectedRole.id,
//           data: {
//             permission_keys: draft.permissionKeys,
//           },
//         });
//       }

//       setStatusMessage(
//         "Permissions backend ke saath synced hain."
//       );
//     } catch (error) {
//       setErrorMessage(getErrorMessage(error));
//     }
//   };

//   const handleCreateRole = async (
//     event: React.FormEvent<HTMLFormElement>
//   ) => {
//     event.preventDefault();

//     if (!canCreateRole) {
//       return;
//     }

//     setErrorMessage("");

//     try {
//       const createdRole =
//         await createRoleMutation.mutateAsync({
//           name: createDraft.name,
//           key:
//             createDraft.key.trim() ||
//             undefined,
//           description:
//             createDraft.description.trim() ||
//             undefined,
//           permission_keys: [],
//         });

//       setCreateDraft(initialCreateRoleDraft);
//       setCreateOpen(false);
//       setSelectedRoleId(createdRole.id);
//       setStatusMessage("Role create ho gaya.");
//     } catch (error) {
//       setErrorMessage(getErrorMessage(error));
//     }
//   };

//   const handleDeleteRole = async () => {
//     if (!selectedRole || !canDeleteRole) {
//       return;
//     }

//     setErrorMessage("");

//     try {
//       await deleteRoleMutation.mutateAsync(
//         selectedRole.id
//       );

//       setDeleteOpen(false);
//       setSelectedRoleId(null);
//       setStatusMessage("Role delete ho gaya.");
//     } catch (error) {
//       setErrorMessage(getErrorMessage(error));
//     }
//   };

//   if (isLoading) {
//     return (
//       <div className="flex min-h-[350px] items-center justify-center rounded-xl border border-slate-200 bg-white">
//         <div className="text-center">
//           <div className="mx-auto h-9 w-9 animate-spin rounded-full border-4 border-blue-100 border-t-blue-600" />
//           <p className="mt-4 text-sm font-medium text-slate-500">
//             Roles and permissions loading...
//           </p>
//         </div>
//       </div>
//     );
//   }

//   if (isError) {
//     const error =
//       rolesQuery.error ?? permissionsQuery.error;

//     return (
//       <div className="rounded-xl border border-red-200 bg-red-50 p-6">
//         <h2 className="font-semibold text-red-700">
//           Failed to load roles and permissions. Please try again later.
//         </h2>
//         <p className="mt-1 text-sm text-red-600">
//           {getErrorMessage(error)}
//         </p>
//         <button
//           type="button"
//           onClick={() => {
//             void rolesQuery.refetch();
//             void permissionsQuery.refetch();
//           }}
//           className="mt-4 rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-red-700"
//         >
//           Try Again
//         </button>
//       </div>
//     );
//   }

//   return (
//     <>
//       <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
//         <p className="text-sm font-medium text-slate-500">
//           {filteredRoles.length} records found
//         </p>
//         <div className="relative w-full sm:w-96">
//           <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
//           <input
//             type="search"
//             value={searchTerm}
//             onChange={(event) =>
//               setSearchTerm(event.target.value)
//             }
//             placeholder="Search role or permission"
//             className="h-11 w-full rounded-xl border border-slate-300 bg-white pl-10 pr-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
//           />
//         </div>
//       </div>

//       <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm lg:grid lg:grid-cols-[420px_1fr]">
//         <aside className="border-b border-slate-200 p-5 lg:border-b-0 lg:border-r">
//           {canCreateRole && (
//             <div className="mb-5 rounded-xl border border-dashed border-blue-200 bg-blue-50/40 p-4">
//               <div className="flex items-center justify-between gap-3">
//                 <div className="flex items-center gap-3">
//                   <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-100 text-blue-600">
//                     <ShieldCheck className="h-5 w-5" />
//                   </div>
//                   <div>
//                     <p className="font-semibold text-slate-900">
//                       Create role
//                     </p>
//                     <p className="text-xs text-slate-500">
//                       Add a database role.
//                     </p>
//                   </div>
//                 </div>

//                 <Button
//                   type="button"
//                   onClick={() => {
//                     setCreateDraft(
//                       initialCreateRoleDraft
//                     );
//                     setCreateOpen(true);
//                   }}
//                 >
//                   <Plus className="h-4 w-4" />
//                   New role
//                 </Button>
//               </div>
//             </div>
//           )}

//           <p className="mb-3 text-xs font-bold uppercase text-slate-400">
//             Available Roles ({filteredRoles.length})
//           </p>

//           <div className="space-y-3">
//             {filteredRoles.map((role) => {
//               const isSelected =
//                 role.id === selectedRole?.id;

//               return (
//                 <button
//                   type="button"
//                   key={role.id}
//                   onClick={() => handleSelectRole(role)}
//                   className={`flex w-full items-center justify-between gap-4 rounded-xl border p-4 text-left transition ${
//                     isSelected
//                       ? "border-blue-400 bg-blue-50 shadow-sm"
//                       : "border-slate-200 bg-white hover:border-blue-200 hover:bg-slate-50"
//                   }`}
//                 >
//                   <div className="flex min-w-0 items-center gap-3">
//                     <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-600 text-white">
//                       <ShieldCheck className="h-5 w-5" />
//                     </div>
//                     <div className="min-w-0">
//                       <p className="truncate font-semibold text-slate-900">
//                         {role.name}
//                       </p>
//                       <p className="truncate text-xs text-slate-500">
//                         {role.key}
//                       </p>
//                     </div>
//                   </div>
//                   <span className="rounded-full border border-slate-200 bg-white px-2 py-1 text-[10px] font-bold uppercase text-slate-500">
//                     {role.is_system
//                       ? "System"
//                       : "Custom"}
//                   </span>
//                 </button>
//               );
//             })}
//           </div>
//         </aside>

//         <section className="min-h-[620px]">
//           {selectedRole ? (
//             <>
//               <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6 text-white">
//                 <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
//                   <div>
//                     <h2 className="text-2xl font-bold">
//                       {selectedRole.name}
//                     </h2>
//                     <p className="mt-1 text-sm font-semibold text-blue-100">
//                       key: {selectedRole.key}
//                     </p>
//                     <p className="mt-4 text-sm text-blue-50">
//                       {selectedRole.description ||
//                         "No description"}
//                     </p>
//                   </div>
//                   <div className="flex flex-wrap gap-2">
//                     <span className="rounded-full bg-white/15 px-3 py-1 text-xs font-bold uppercase">
//                       {totalSelectedPermissions} permissions
//                     </span>
//                     <span className="rounded-full bg-white/15 px-3 py-1 text-xs font-bold uppercase">
//                       {selectedRole.is_system
//                         ? "System role"
//                         : "Custom role"}
//                     </span>
//                   </div>
//                 </div>
//               </div>

//               <div className="space-y-5 p-5">
//                 <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
//                   <div className="grid gap-4 lg:grid-cols-[1fr_1.4fr_auto] lg:items-end">
//                     <div className="space-y-2">
//                       <Label htmlFor="role-name">
//                         Role name
//                       </Label>
//                       <Input
//                         id="role-name"
//                         value={draft.name}
//                         disabled={!canUpdateRole}
//                         onChange={(event) => {
//                           setDraft((currentDraft) => ({
//                             ...currentDraft,
//                             name: event.target.value,
//                           }));
//                           setStatusMessage("");
//                           setErrorMessage("");
//                         }}
//                       />
//                     </div>
//                     <div className="space-y-2">
//                       <Label htmlFor="role-description">
//                         Description
//                       </Label>
//                       <Input
//                         id="role-description"
//                         value={draft.description}
//                         disabled={!canUpdateRole}
//                         onChange={(event) => {
//                           setDraft((currentDraft) => ({
//                             ...currentDraft,
//                             description:
//                               event.target.value,
//                           }));
//                           setStatusMessage("");
//                           setErrorMessage("");
//                         }}
//                       />
//                     </div>
//                     <div className="flex gap-2">
//                       <Button
//                         type="button"
//                         variant="outline"
//                         onClick={() =>
//                           setDetailsOpen(true)
//                         }
//                       >
//                         <Eye className="h-4 w-4" />
//                         Details
//                       </Button>
//                       {canDeleteRole && (
//                         <Button
//                           type="button"
//                           variant="destructive"
//                           disabled={
//                             selectedRole.is_system
//                           }
//                           onClick={() =>
//                             setDeleteOpen(true)
//                           }
//                         >
//                           <Trash2 className="h-4 w-4" />
//                           Delete
//                         </Button>
//                       )}
//                     </div>
//                   </div>
//                 </div>

//                 {statusMessage && (
//                   <p className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-700">
//                     {statusMessage}
//                   </p>
//                 )}

//                 {errorMessage && (
//                   <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
//                     {errorMessage}
//                   </p>
//                 )}

//                 {canSave && (
//                   <div className="flex justify-end">
//                     <Button
//                       type="button"
//                       onClick={handleSaveChanges}
//                       disabled={isSaving}
//                       className="bg-blue-600 text-white hover:bg-blue-700"
//                     >
//                       {isSaving ? (
//                         <Loader2 className="h-4 w-4 animate-spin" />
//                       ) : (
//                         <Save className="h-4 w-4" />
//                       )}
//                       Save changes
//                     </Button>
//                   </div>
//                 )}

//                 <div className="space-y-5">
//                   {permissionGroups.map(
//                     (permissionGroup) => {
//                       const selectedCount =
//                         permissionGroup.permissions.filter(
//                           (permission) =>
//                             selectedPermissionKeys.has(
//                               permission.key
//                             )
//                         ).length;

//                       return (
//                         <section
//                           key={permissionGroup.group}
//                           className="overflow-hidden rounded-xl border border-slate-200"
//                         >
//                           <div className="flex items-center justify-between gap-4 border-b border-slate-200 bg-slate-50 px-4 py-3">
//                             <div className="flex items-center gap-2">
//                               <ShieldCheck className="h-4 w-4 text-blue-600" />
//                               <h3 className="font-semibold text-slate-900">
//                                 {formatGroupName(
//                                   permissionGroup.group
//                                 )}
//                               </h3>
//                             </div>
//                             <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-bold text-blue-700">
//                               {selectedCount}/
//                               {
//                                 permissionGroup
//                                   .permissions.length
//                               }
//                             </span>
//                           </div>

//                           <div className="grid gap-3 p-4 md:grid-cols-2">
//                             {permissionGroup.permissions.map(
//                               (permission) => {
//                                 const isSelected =
//                                   selectedPermissionKeys.has(
//                                     permission.key
//                                   );

//                                 return (
//                                   <button
//                                     type="button"
//                                     key={permission.key}
//                                     aria-pressed={
//                                       isSelected
//                                     }
//                                     disabled={
//                                       !canUpdateRolePermissions
//                                     }
//                                     onClick={() =>
//                                       handlePermissionToggle(
//                                         permission.key
//                                       )
//                                     }
//                                     className={`flex min-h-24 items-start gap-3 rounded-xl border p-4 text-left transition disabled:cursor-default ${
//                                       isSelected
//                                         ? "border-blue-300 bg-blue-50 text-blue-900"
//                                         : "border-slate-200 bg-white text-slate-700 hover:border-blue-200 hover:bg-slate-50"
//                                     }`}
//                                   >
//                                     <span
//                                       className={`mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full ${
//                                         isSelected
//                                           ? "bg-blue-600 text-white"
//                                           : "border border-slate-300 bg-white text-transparent"
//                                       }`}
//                                     >
//                                       <Check className="h-3.5 w-3.5" />
//                                     </span>
//                                     <span>
//                                       <span className="block font-semibold">
//                                         {permission.label}
//                                       </span>
//                                       <span className="mt-1 block text-xs font-medium text-blue-600">
//                                         {permission.key}
//                                       </span>
//                                       <span className="mt-2 block text-xs text-slate-500">
//                                         {permission.description ||
//                                           "No description"}
//                                       </span>
//                                     </span>
//                                   </button>
//                                 );
//                               }
//                             )}
//                           </div>
//                         </section>
//                       );
//                     }
//                   )}
//                 </div>
//               </div>
//             </>
//           ) : (
//             <div className="flex min-h-[500px] items-center justify-center p-6 text-center">
//               <div>
//                 <KeyRound className="mx-auto h-10 w-10 text-slate-300" />
//                 <p className="mt-3 font-semibold text-slate-600">
//                   No roles found
//                 </p>
//               </div>
//             </div>
//           )}
//         </section>
//       </div>

//       <Dialog
//         open={createOpen}
//         onOpenChange={setCreateOpen}
//       >
//         <DialogContent className="sm:max-w-lg">
//           <DialogHeader>
//             <DialogTitle>Create role</DialogTitle>
//             <DialogDescription>
//               Add a new database role.
//             </DialogDescription>
//           </DialogHeader>
//           <form
//             className="space-y-4"
//             onSubmit={handleCreateRole}
//           >
//             <div className="space-y-2">
//               <Label htmlFor="new-role-name">
//                 Role name
//               </Label>
//               <Input
//                 id="new-role-name"
//                 required
//                 value={createDraft.name}
//                 onChange={(event) =>
//                   setCreateDraft((currentDraft) => ({
//                     ...currentDraft,
//                     name: event.target.value,
//                   }))
//                 }
//                 placeholder="Head clerk"
//               />
//             </div>

//             <div className="space-y-2">
//               <Label htmlFor="new-role-key">
//                 Role key
//               </Label>
//               <Input
//                 id="new-role-key"
//                 value={createDraft.key}
//                 onChange={(event) =>
//                   setCreateDraft((currentDraft) => ({
//                     ...currentDraft,
//                     key: event.target.value,
//                   }))
//                 }
//                 placeholder="head_clerk"
//               />
//             </div>

//             <div className="space-y-2">
//               <Label htmlFor="new-role-description">
//                 Description
//               </Label>
//               <Textarea
//                 id="new-role-description"
//                 rows={3}
//                 value={createDraft.description}
//                 onChange={(event) =>
//                   setCreateDraft((currentDraft) => ({
//                     ...currentDraft,
//                     description: event.target.value,
//                   }))
//                 }
//               />
//             </div>

//             <DialogFooter>
//               <Button
//                 type="submit"
//                 disabled={
//                   createRoleMutation.isPending
//                 }
//               >
//                 {createRoleMutation.isPending ? (
//                   <Loader2 className="h-4 w-4 animate-spin" />
//                 ) : (
//                   <Plus className="h-4 w-4" />
//                 )}
//                 Create role
//               </Button>
//             </DialogFooter>
//           </form>
//         </DialogContent>
//       </Dialog>

//       <Dialog
//         open={detailsOpen}
//         onOpenChange={setDetailsOpen}
//       >
//         <DialogContent className="sm:max-w-2xl">
//           <DialogHeader>
//             <DialogTitle>Role details</DialogTitle>
//             <DialogDescription>
//               Database role and assigned permissions.
//             </DialogDescription>
//           </DialogHeader>
//           {selectedRole && (
//             <div className="grid gap-3 sm:grid-cols-2">
//               <DetailRow
//                 label="Database ID"
//                 value={selectedRole.id}
//               />
//               <DetailRow
//                 label="Role key"
//                 value={selectedRole.key}
//               />
//               <DetailRow
//                 label="Name"
//                 value={selectedRole.name}
//               />
//               <DetailRow
//                 label="System role"
//                 value={selectedRole.is_system}
//               />
//               <DetailRow
//                 label="Created At"
//                 value={selectedRole.created_at}
//               />
//               <DetailRow
//                 label="Permissions"
//                 value={totalSelectedPermissions}
//               />
//             </div>
//           )}
//         </DialogContent>
//       </Dialog>

//       <AlertDialog
//         open={deleteOpen}
//         onOpenChange={setDeleteOpen}
//       >
//         <AlertDialogContent>
//           <AlertDialogHeader>
//             <AlertDialogTitle>
//               Delete role?
//             </AlertDialogTitle>
//             <AlertDialogDescription>
//               This role will be permanently deleted from the database.
//             </AlertDialogDescription>
//           </AlertDialogHeader>
//           <AlertDialogFooter>
//             <AlertDialogCancel
//               disabled={deleteRoleMutation.isPending}
//             >
//               Cancel
//             </AlertDialogCancel>
//             <Button
//               type="button"
//               variant="destructive"
//               disabled={deleteRoleMutation.isPending}
//               onClick={handleDeleteRole}
//             >
//               {deleteRoleMutation.isPending ? (
//                 <Loader2 className="h-4 w-4 animate-spin" />
//               ) : (
//                 <Trash2 className="h-4 w-4" />
//               )}
//               Delete
//             </Button>
//           </AlertDialogFooter>
//         </AlertDialogContent>
//       </AlertDialog>
//     </>
//   );
// }
"use client"

import { useEffect, useMemo, useState } from "react"
import {
  Check,
  Eye,
  KeyRound,
  Loader2,
  Plus,
  Save,
  Search,
  ShieldCheck,
  Trash2,
} from "lucide-react"

import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@workspace/ui/components/alert-dialog"
import { Button } from "@workspace/ui/components/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@workspace/ui/components/dialog"
import { Input } from "@workspace/ui/components/input"
import { Label } from "@workspace/ui/components/label"
import { Textarea } from "@workspace/ui/components/textarea"
import {
  useCreateRole,
  useDeleteRole,
  usePermissions,
  useRoles,
  useUpdateRole,
  useUpdateRolePermissions,
} from "@/hooks/use-rbac"
import { useAdminAccess } from "@/hooks/use-admin-access"
import { AdminPermission } from "@/types/admin-access"
import type { Permission, Role } from "@/types/rbac"

type PermissionGroup = {
  group: string
  permissions: Permission[]
}

type RoleDraft = {
  name: string
  description: string
  permissionKeys: string[]
}

type CreateRoleDraft = {
  name: string
  key: string
  description: string
}

const initialCreateRoleDraft: CreateRoleDraft = {
  name: "",
  key: "",
  description: "",
}

function getErrorMessage(error: unknown) {
  return error instanceof Error ? error.message : "Action complete nahi ho paya"
}

function formatGroupName(group: string) {
  return group
    .replace(/[_-]+/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/\b\w/g, (letter) => letter.toUpperCase())
}

function getRoleDraft(role: Role): RoleDraft {
  return {
    name: role?.name ?? "",
    description: role?.description ?? "",
    permissionKeys:
      role?.permissions?.map((permission) => permission.key) ?? [],
  }
}

function groupPermissions(
  permissions: Permission[],
  searchTerm: string
): PermissionGroup[] {
  const normalizedSearch = searchTerm.trim().toLowerCase()
  const groups = new Map<string, Permission[]>()

  for (const permission of permissions ?? []) {
    const searchableText = [
      permission.key,
      permission.label,
      permission.group,
      permission.description ?? "",
    ]
      .join(" ")
      .toLowerCase()

    if (normalizedSearch && !searchableText.includes(normalizedSearch)) {
      continue
    }

    const existingPermissions = groups.get(permission.group) ?? []

    existingPermissions.push(permission)
    groups.set(permission.group, existingPermissions)
  }

  return Array.from(groups.entries())
    .map(([group, permissions]) => ({
      group,
      permissions,
    }))
    .sort((firstGroup, secondGroup) =>
      firstGroup.group.localeCompare(secondGroup.group)
    )
}

function roleMatchesSearch(role: Role, searchTerm: string) {
  const normalizedSearch = searchTerm.trim().toLowerCase()

  if (!normalizedSearch) {
    return true
  }

  const permissionText = (role?.permissions ?? [])
    .map((permission) =>
      [permission.key, permission.label, permission.group].join(" ")
    )
    .join(" ")

  return [
    role?.name ?? "",
    role?.key ?? "",
    role?.description ?? "",
    permissionText,
  ]
    .join(" ")
    .toLowerCase()
    .includes(normalizedSearch)
}

function DetailRow({
  label,
  value,
}: {
  label: string
  value: string | number | boolean
}) {
  return (
    <div className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2">
      <p className="text-xs font-semibold text-slate-500">{label}</p>
      <p className="mt-1 text-sm font-semibold break-words text-slate-900">
        {value === "" ? "Not provided" : String(value)}
      </p>
    </div>
  )
}

export default function RolesPermissionsManager() {
  const { hasPermission, isPermissionUnknown } = useAdminAccess()
  const canReadRoles =
    hasPermission(AdminPermission.RolesRead) || isPermissionUnknown
  const canReadPermissions =
    hasPermission(AdminPermission.PermissionsRead) || isPermissionUnknown
  const canCreateRole = hasPermission(AdminPermission.RolesCreate)
  const canUpdateRole = hasPermission(AdminPermission.RolesUpdate)
  const canDeleteRole = hasPermission(AdminPermission.RolesDelete)
  const canUpdateRolePermissions = hasPermission(
    AdminPermission.RolesPermissionsUpdate
  )
  const canSave = canUpdateRole || canUpdateRolePermissions

  const rolesQuery = useRoles({
    enabled: canReadRoles,
    suppressErrorLog: isPermissionUnknown,
  })
  const permissionsQuery = usePermissions({
    enabled: canReadPermissions,
    suppressErrorLog: isPermissionUnknown,
  })
  const createRoleMutation = useCreateRole()
  const updateRoleMutation = useUpdateRole()
  const updateRolePermissionsMutation = useUpdateRolePermissions()
  const deleteRoleMutation = useDeleteRole()

  const roles: Role[] = rolesQuery.data ?? []
  const permissions: Permission[] = permissionsQuery.data ?? []

  const [searchTerm, setSearchTerm] = useState("")
  const [selectedRoleId, setSelectedRoleId] = useState<number | null>(null)
  const [draft, setDraft] = useState<RoleDraft>({
    name: "",
    description: "",
    permissionKeys: [],
  })
  const [createOpen, setCreateOpen] = useState(false)
  const [detailsOpen, setDetailsOpen] = useState(false)
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [createDraft, setCreateDraft] = useState<CreateRoleDraft>(
    initialCreateRoleDraft
  )
  const [statusMessage, setStatusMessage] = useState("")
  const [errorMessage, setErrorMessage] = useState("")

  const selectedRole =
    roles.find((role: Role) => role?.id === selectedRoleId) ??
    roles?.[0] ??
    null

  useEffect(() => {
    if (selectedRoleId === null && roles.length > 0 && roles[0]) {
      setSelectedRoleId(roles[0].id)
    }
  }, [roles, selectedRoleId])

  useEffect(() => {
    if (selectedRole) {
      setDraft(getRoleDraft(selectedRole))
      setStatusMessage("")
      setErrorMessage("")
    }
  }, [selectedRole])

  const filteredRoles = useMemo(
    () => roles.filter((role: Role) => roleMatchesSearch(role, searchTerm)),
    [roles, searchTerm]
  )

  const permissionGroups = useMemo(
    () => groupPermissions(permissions, searchTerm),
    [permissions, searchTerm]
  )

  const selectedPermissionKeys = new Set(draft?.permissionKeys ?? [])

  const isSaving =
    updateRoleMutation.isPending || updateRolePermissionsMutation.isPending

  const isLoading = rolesQuery.isLoading || permissionsQuery.isLoading

  const isError = rolesQuery.isError || permissionsQuery.isError

  const totalSelectedPermissions = draft?.permissionKeys?.length ?? 0

  const handleSelectRole = (role: Role) => {
    if (role) {
      setSelectedRoleId(role.id)
    }
  }

  const handlePermissionToggle = (permissionKey: string) => {
    if (!canUpdateRolePermissions) {
      return
    }

    setStatusMessage("")
    setErrorMessage("")

    setDraft((currentDraft) => {
      const nextPermissionKeys = new Set(currentDraft?.permissionKeys ?? [])

      if (nextPermissionKeys.has(permissionKey)) {
        nextPermissionKeys.delete(permissionKey)
      } else {
        nextPermissionKeys.add(permissionKey)
      }

      return {
        ...currentDraft,
        permissionKeys: Array.from(nextPermissionKeys),
      }
    })
  }

  const handleSaveChanges = async () => {
    if (!selectedRole || !canSave) {
      return
    }

    setStatusMessage("")
    setErrorMessage("")

    try {
      if (canUpdateRole) {
        await updateRoleMutation.mutateAsync({
          id: selectedRole.id,
          data: {
            name: draft.name,
            description: draft.description,
          },
        })
      }

      if (canUpdateRolePermissions) {
        await updateRolePermissionsMutation.mutateAsync({
          id: selectedRole.id,
          data: {
            permission_keys: draft.permissionKeys,
          },
        })
      }

      setStatusMessage("Permissions backend ke saath synced hain.")
    } catch (error) {
      setErrorMessage(getErrorMessage(error))
    }
  }

  const handleCreateRole = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (!canCreateRole) {
      return
    }

    setErrorMessage("")

    try {
      const createdRole = await createRoleMutation.mutateAsync({
        name: createDraft.name,
        key: createDraft.key.trim() || undefined,
        description: createDraft.description.trim() || undefined,
        permission_keys: [],
      })

      setCreateDraft(initialCreateRoleDraft)
      setCreateOpen(false)
      if (createdRole) {
        setSelectedRoleId(createdRole.id)
      }
      setStatusMessage("Role create ho gaya.")
    } catch (error) {
      setErrorMessage(getErrorMessage(error))
    }
  }

  const handleDeleteRole = async () => {
    if (!selectedRole || !canDeleteRole) {
      return
    }

    setErrorMessage("")

    try {
      await deleteRoleMutation.mutateAsync(selectedRole.id)

      setDeleteOpen(false)
      setSelectedRoleId(null)
      setStatusMessage("Role delete ho gaya.")
    } catch (error) {
      setErrorMessage(getErrorMessage(error))
    }
  }

  if (isLoading) {
    return (
      <div className="flex min-h-[350px] items-center justify-center rounded-xl border border-slate-200 bg-white">
        <div className="text-center">
          <div className="mx-auto h-9 w-9 animate-spin rounded-full border-4 border-blue-100 border-t-blue-600" />
          <p className="mt-4 text-sm font-medium text-slate-500">
            Roles and permissions loading...
          </p>
        </div>
      </div>
    )
  }

  if (isError) {
    const error = rolesQuery.error ?? permissionsQuery.error

    return (
      <div className="rounded-xl border border-red-200 bg-red-50 p-6">
        <h2 className="font-semibold text-red-700">
          Failed to load roles and permissions. Please try again later.
        </h2>
        <p className="mt-1 text-sm text-red-600">{getErrorMessage(error)}</p>
        <button
          type="button"
          onClick={() => {
            void rolesQuery.refetch()
            void permissionsQuery.refetch()
          }}
          className="mt-4 rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-red-700"
        >
          Try Again
        </button>
      </div>
    )
  }

  return (
    <>
      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm font-medium text-slate-500">
          {filteredRoles.length} records found
        </p>
        <div className="relative w-full sm:w-96">
          <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="search"
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            placeholder="Search role or permission"
            className="h-11 w-full rounded-xl border border-slate-300 bg-white pr-4 pl-10 text-sm text-slate-900 transition outline-none placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          />
        </div>
      </div>

      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm lg:grid lg:grid-cols-[420px_1fr]">
        <aside className="border-b border-slate-200 p-5 lg:border-r lg:border-b-0">
          {canCreateRole && (
            <div className="mb-5 rounded-xl border border-dashed border-blue-200 bg-blue-50/40 p-4">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-100 text-blue-600">
                    <ShieldCheck className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="font-semibold text-slate-900">Create role</p>
                    <p className="text-xs text-slate-500">
                      Add a database role.
                    </p>
                  </div>
                </div>

                <Button
                  type="button"
                  onClick={() => {
                    setCreateDraft(initialCreateRoleDraft)
                    setCreateOpen(true)
                  }}
                >
                  <Plus className="h-4 w-4" />
                  New role
                </Button>
              </div>
            </div>
          )}

          <p className="mb-3 text-xs font-bold text-slate-400 uppercase">
            Available Roles ({filteredRoles.length})
          </p>

          <div className="space-y-3">
            {filteredRoles.map((role: Role) => {
              const isSelected = role?.id === selectedRole?.id

              return (
                <button
                  type="button"
                  key={role.id}
                  onClick={() => handleSelectRole(role)}
                  className={`flex w-full items-center justify-between gap-4 rounded-xl border p-4 text-left transition ${
                    isSelected
                      ? "border-blue-400 bg-blue-50 shadow-sm"
                      : "border-slate-200 bg-white hover:border-blue-200 hover:bg-slate-50"
                  }`}
                >
                  <div className="flex min-w-0 items-center gap-3">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-600 text-white">
                      <ShieldCheck className="h-5 w-5" />
                    </div>
                    <div className="min-w-0">
                      <p className="truncate font-semibold text-slate-900">
                        {role.name}
                      </p>
                      <p className="truncate text-xs text-slate-500">
                        {role.key}
                      </p>
                    </div>
                  </div>
                  <span className="rounded-full border border-slate-200 bg-white px-2 py-1 text-[10px] font-bold text-slate-500 uppercase">
                    {role.is_system ? "System" : "Custom"}
                  </span>
                </button>
              )
            })}
          </div>
        </aside>

        <section className="min-h-[620px]">
          {selectedRole ? (
            <>
              <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6 text-white">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <h2 className="text-2xl font-bold">{selectedRole.name}</h2>
                    <p className="mt-1 text-sm font-semibold text-blue-100">
                      key: {selectedRole.key}
                    </p>
                    <p className="mt-4 text-sm text-blue-50">
                      {selectedRole.description || "No description"}
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <span className="rounded-full bg-white/15 px-3 py-1 text-xs font-bold uppercase">
                      {totalSelectedPermissions} permissions
                    </span>
                    <span className="rounded-full bg-white/15 px-3 py-1 text-xs font-bold uppercase">
                      {selectedRole.is_system ? "System role" : "Custom role"}
                    </span>
                  </div>
                </div>
              </div>

              <div className="space-y-5 p-5">
                <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                  <div className="grid gap-4 lg:grid-cols-[1fr_1.4fr_auto] lg:items-end">
                    <div className="space-y-2">
                      <Label htmlFor="role-name">Role name</Label>
                      <Input
                        id="role-name"
                        value={draft.name}
                        disabled={!canUpdateRole}
                        onChange={(event) => {
                          setDraft((currentDraft) => ({
                            ...currentDraft,
                            name: event.target.value,
                          }))
                          setStatusMessage("")
                          setErrorMessage("")
                        }}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="role-description">Description</Label>
                      <Input
                        id="role-description"
                        value={draft.description}
                        disabled={!canUpdateRole}
                        onChange={(event) => {
                          setDraft((currentDraft) => ({
                            ...currentDraft,
                            description: event.target.value,
                          }))
                          setStatusMessage("")
                          setErrorMessage("")
                        }}
                      />
                    </div>
                    <div className="flex gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setDetailsOpen(true)}
                      >
                        <Eye className="h-4 w-4" />
                        Details
                      </Button>
                      {canDeleteRole && (
                        <Button
                          type="button"
                          variant="destructive"
                          disabled={selectedRole.is_system}
                          onClick={() => setDeleteOpen(true)}
                        >
                          <Trash2 className="h-4 w-4" />
                          Delete
                        </Button>
                      )}
                    </div>
                  </div>
                </div>

                {statusMessage && (
                  <p className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-700">
                    {statusMessage}
                  </p>
                )}

                {errorMessage && (
                  <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
                    {errorMessage}
                  </p>
                )}

                {canSave && (
                  <div className="flex justify-end">
                    <Button
                      type="button"
                      onClick={handleSaveChanges}
                      disabled={isSaving}
                      className="bg-blue-600 text-white hover:bg-blue-700"
                    >
                      {isSaving ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Save className="h-4 w-4" />
                      )}
                      Save changes
                    </Button>
                  </div>
                )}

                <div className="space-y-5">
                  {permissionGroups.map((permissionGroup) => {
                    const selectedCount = (
                      permissionGroup?.permissions ?? []
                    ).filter((permission: Permission) =>
                      selectedPermissionKeys.has(permission?.key)
                    ).length

                    return (
                      <section
                        key={permissionGroup.group}
                        className="overflow-hidden rounded-xl border border-slate-200"
                      >
                        <div className="flex items-center justify-between gap-4 border-b border-slate-200 bg-slate-50 px-4 py-3">
                          <div className="flex items-center gap-2">
                            <ShieldCheck className="h-4 w-4 text-blue-600" />
                            <h3 className="font-semibold text-slate-900">
                              {formatGroupName(permissionGroup.group)}
                            </h3>
                          </div>
                          <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-bold text-blue-700">
                            {selectedCount}/
                            {permissionGroup?.permissions?.length ?? 0}
                          </span>
                        </div>

                        <div className="grid gap-3 p-4 md:grid-cols-2">
                          {(permissionGroup?.permissions ?? []).map(
                            (permission: Permission) => {
                              const isSelected = selectedPermissionKeys.has(
                                permission?.key
                              )

                              return (
                                <button
                                  type="button"
                                  key={permission.key}
                                  aria-pressed={isSelected}
                                  disabled={!canUpdateRolePermissions}
                                  onClick={() =>
                                    handlePermissionToggle(permission.key)
                                  }
                                  className={`flex min-h-24 items-start gap-3 rounded-xl border p-4 text-left transition disabled:cursor-default ${
                                    isSelected
                                      ? "border-blue-300 bg-blue-50 text-blue-900"
                                      : "border-slate-200 bg-white text-slate-700 hover:border-blue-200 hover:bg-slate-50"
                                  }`}
                                >
                                  <span
                                    className={`mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full ${
                                      isSelected
                                        ? "bg-blue-600 text-white"
                                        : "border border-slate-300 bg-white text-transparent"
                                    }`}
                                  >
                                    <Check className="h-3.5 w-3.5" />
                                  </span>
                                  <span>
                                    <span className="block font-semibold">
                                      {permission.label}
                                    </span>
                                    <span className="mt-1 block text-xs font-medium text-blue-600">
                                      {permission.key}
                                    </span>
                                    <span className="mt-2 block text-xs text-slate-500">
                                      {permission.description ||
                                        "No description"}
                                    </span>
                                  </span>
                                </button>
                              )
                            }
                          )}
                        </div>
                      </section>
                    )
                  })}
                </div>
              </div>
            </>
          ) : (
            <div className="flex min-h-[500px] items-center justify-center p-6 text-center">
              <div>
                <KeyRound className="mx-auto h-10 w-10 text-slate-300" />
                <p className="mt-3 font-semibold text-slate-600">
                  No roles found
                </p>
              </div>
            </div>
          )}
        </section>
      </div>

      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Create role</DialogTitle>
            <DialogDescription>Add a new database role.</DialogDescription>
          </DialogHeader>
          <form className="space-y-4" onSubmit={handleCreateRole}>
            <div className="space-y-2">
              <Label htmlFor="new-role-name">Role name</Label>
              <Input
                id="new-role-name"
                required
                value={createDraft.name}
                onChange={(event) =>
                  setCreateDraft((currentDraft) => ({
                    ...currentDraft,
                    name: event.target.value,
                  }))
                }
                placeholder="Head clerk"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="new-role-key">Role key</Label>
              <Input
                id="new-role-key"
                value={createDraft.key}
                onChange={(event) =>
                  setCreateDraft((currentDraft) => ({
                    ...currentDraft,
                    key: event.target.value,
                  }))
                }
                placeholder="head_clerk"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="new-role-description">Description</Label>
              <Textarea
                id="new-role-description"
                rows={3}
                value={createDraft.description}
                onChange={(event) =>
                  setCreateDraft((currentDraft) => ({
                    ...currentDraft,
                    description: event.target.value,
                  }))
                }
              />
            </div>

            <DialogFooter>
              <Button type="submit" disabled={createRoleMutation.isPending}>
                {createRoleMutation.isPending ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Plus className="h-4 w-4" />
                )}
                Create role
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={detailsOpen} onOpenChange={setDetailsOpen}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>Role details</DialogTitle>
            <DialogDescription>
              Database role and assigned permissions.
            </DialogDescription>
          </DialogHeader>
          {selectedRole && (
            <div className="grid gap-3 sm:grid-cols-2">
              <DetailRow label="Database ID" value={selectedRole.id} />
              <DetailRow label="Role key" value={selectedRole.key} />
              <DetailRow label="Name" value={selectedRole.name} />
              <DetailRow label="System role" value={selectedRole.is_system} />
              <DetailRow label="Created At" value={selectedRole.created_at} />
              <DetailRow label="Permissions" value={totalSelectedPermissions} />
            </div>
          )}
        </DialogContent>
      </Dialog>

      <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete role?</AlertDialogTitle>
            <AlertDialogDescription>
              This role will be permanently deleted from the database.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleteRoleMutation.isPending}>
              Cancel
            </AlertDialogCancel>
            <Button
              type="button"
              variant="destructive"
              disabled={deleteRoleMutation.isPending}
              onClick={handleDeleteRole}
            >
              {deleteRoleMutation.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Trash2 className="h-4 w-4" />
              )}
              Delete
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
