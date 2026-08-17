"use client"

import { SignInButton, SignUpButton, UserButton, useUser } from "@clerk/nextjs"
import React, { useState } from "react"
import {
  LayoutDashboard,
  LogIn,
  Search,
  Shield,
  UserPlus,
  X,
} from "lucide-react"
import Link from "next/link"
import { Button } from "@workspace/ui/components/button"
import { useAdminAccess } from "@/hooks/use-admin-access"
import { Input } from "@workspace/ui/components/input"
import { Label } from "@workspace/ui/components/label"

export default function Header() {
  const { isSignedIn } = useUser()
  const { access } = useAdminAccess()
  const [activeModal, setActiveModal] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const canSeeDashboard = Boolean(isSignedIn && access?.isAllowed)

  const closeModal = () => {
    setActiveModal(null)
    setSearchQuery("")
  }

  const handleSearchSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    alert(`Searching municipal portal for: "${searchQuery}"`)
    closeModal()
  }

  return (
    <>
      <header className="border-b border-slate-200 bg-white px-4 py-4 md:px-8">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-6 lg:flex-row">
          {/* Left Side: Logo, Brand names, Taglines */}
          <div className="flex flex-col items-center gap-4 text-center sm:flex-row lg:text-left">
            {/* Official Circular Government Logo Image */}
            <div className="group relative shrink-0 cursor-pointer transition-transform duration-300 hover:scale-105">
              <div className="flex h-20 w-20 items-center justify-center overflow-hidden rounded-full border-2 border-slate-200 bg-white stroke-[#0A2540] p-1 shadow-sm">
                <img
                  src="https://cdn.s3waas.gov.in/s30336dcbab05b9d5ad24f4333c7658a0e/uploads/2018/02/2018021632.png"
                  alt="Uttar Pradesh Government Emblem"
                  className="h-full w-full object-contain"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-center gap-2 lg:justify-start">
                <span className="bg-gov-saffron/10 text-gov-saffron border-gov-saffron/20 rounded-full border px-2 py-0.5 text-xs font-bold tracking-wider uppercase">
                  Uttar Pradesh Government
                </span>
              </div>
              <h1 className="text-gov-blue-dark mt-1 font-serif text-xl leading-tight font-extrabold tracking-tight md:text-2xl">
                नगर पंचायत, छाता, मथुरा
              </h1>
              <p className="text-gov-blue-medium font-sans text-sm font-semibold tracking-wider uppercase">
                Nagar Panchayat , Chhata, Mathura
              </p>
              <div className="mt-0.5 flex items-center justify-center gap-1.5 text-xs font-medium text-slate-500 lg:justify-start">
                <span>Mathura, Uttar Pradesh, India</span>
                <span className="text-slate-300">•</span>
                <span className="text-gov-saffron font-semibold italic">
                  स्वच्छ छाता, मथुरा, सुंदर छाता, मथुरा।
                </span>
              </div>
            </div>
          </div>

          {/* Quick Actions Grid */}
          <div className="flex w-full flex-wrap items-center justify-center gap-3 sm:w-auto">
            <Button
              suppressHydrationWarning
              onClick={() => setActiveModal("search")}
              className="hidden cursor-pointer items-center gap-3 rounded-lg border border-slate-200 bg-slate-100 px-6 py-2.5 text-xs font-medium text-slate-500 shadow-none transition-all hover:bg-slate-200 sm:flex"
              aria-label="Search site"
            >
              <Search className="h-4 w-4 text-slate-500" />
              <span>Search...</span>
            </Button>

            {isSignedIn ? (
              <div className="flex items-center justify-end gap-3">
                {canSeeDashboard && (
                  <Link
                    href="/auth/role-check"
                    className="flex items-center gap-1.5 rounded-lg bg-blue-700 px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-blue-800"
                  >
                    <LayoutDashboard className="h-4 w-4" />
                    <span>Dashboard</span>
                  </Link>
                )}
                <UserButton />
              </div>
            ) : (
              <div className="flex items-center justify-end gap-2">
                <SignInButton
                  mode="modal"
                  forceRedirectUrl="/auth/role-check"
                  fallbackRedirectUrl="/auth/role-check"
                  signUpForceRedirectUrl="/"
                  signUpFallbackRedirectUrl="/"
                >
                  <button
                    type="button"
                    className="flex items-center gap-1.5 rounded-lg bg-blue-700 px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-blue-800"
                  >
                    <LogIn className="h-4 w-4" />
                    <span>Sign In</span>
                  </button>
                </SignInButton>
                <SignUpButton
                  mode="modal"
                  forceRedirectUrl="/"
                  fallbackRedirectUrl="/"
                  signInForceRedirectUrl="/auth/role-check"
                  signInFallbackRedirectUrl="/auth/role-check"
                >
                  <button
                    type="button"
                    className="flex items-center gap-1.5 rounded-lg bg-blue-700 px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-blue-800"
                  >
                    <UserPlus className="h-4 w-4" />
                    <span>Sign Up</span>
                  </button>
                </SignUpButton>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* ================================================= */}
      {/* INTERACTIVE MOCK MODALS                           */}
      {/* ================================================= */}

      {activeModal && (
        <div className="animate-fade-in fixed inset-0 z-999 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-xs">
          <div className="animate-scale-up w-full max-w-xl scale-95 transform overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-2xl">
            {/* Modal Header */}
            <div className="gov-gradient-blue flex items-center justify-between px-6 py-4 text-white">
              <div className="flex items-center gap-2">
                <Shield className="text-gov-saffron h-5 w-5" />
                <h3 className="text-sm font-extrabold tracking-wide uppercase">
                  {activeModal === "login" && "Citizen Portal Login"}
                  {activeModal === "complaint" && "Public Grievance System"}
                  {activeModal === "paytax" && "Tax Payment Gateway"}
                  {activeModal === "search" && "Municipal Search Service"}
                </h3>
              </div>
              <Button
                onClick={closeModal}
                className="cursor-pointer text-slate-300 transition-colors hover:text-white"
              >
                <X className="h-5 w-5" />
              </Button>
            </div>
            {/* Modal Content */}
            <div className="p-6">
              {/* Search Modals */}
              {activeModal === "search" && (
                <form onSubmit={handleSearchSubmit} className="space-y-4">
                  <div>
                    <Label className="mb-1 block text-xs font-bold text-slate-600">
                      Search Keywords
                    </Label>
                    <div className="flex gap-2">
                      <Input
                        required
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search circulars, tenders, birth cert..."
                        className="focus:outline-gov-blue-medium w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
                      />
                      <Button
                        type="submit"
                        className="bg-gov-blue-medium hover:bg-gov-blue-dark cursor-pointer rounded-lg p-2.5 text-white transition-colors"
                      >
                        <Search className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  )
}
