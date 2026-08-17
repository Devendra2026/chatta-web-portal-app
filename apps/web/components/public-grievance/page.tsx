"use client"

import { useState } from "react"
import Image from "next/image"
import { zodResolver } from "@hookform/resolvers/zod"
import { AnimatePresence, m } from "framer-motion"
import { AlertCircle, FileCheck, Send, ShieldAlert } from "lucide-react"
import { Controller, useForm } from "react-hook-form"

import { Button } from "@workspace/ui/components/button"
import { Input } from "@workspace/ui/components/input"
import { Label } from "@workspace/ui/components/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/components/select"
import { Textarea } from "@workspace/ui/components/textarea"

import { useCreateGrievance } from "@/hooks/use-grievances"
import {
  createGrievanceSchema,
  type CreateGrievanceData,
} from "@/types/public-grievance"

type SubmittedCitizen = {
  full_name: string
  mobile_number: string
}

const initialFormData: CreateGrievanceData = {
  full_name: "",
  mobile_number: "",
  email: "",
  complaint_category: "",
  municipal_ward: "",
  incident_address: "",
  description: "",
}

export default function PublicGrievance() {
  const createGrievanceMutation = useCreateGrievance()

  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateGrievanceData>({
    resolver: zodResolver(createGrievanceSchema),
    defaultValues: initialFormData,
  })

  const [submitted, setSubmitted] = useState(false)

  const [complaintId, setComplaintId] = useState("")

  const [submitError, setSubmitError] = useState("")

  const [submittedCitizen, setSubmittedCitizen] = useState<SubmittedCitizen>({
    full_name: "",
    mobile_number: "",
  })

  const clearSubmitError = () => {
    if (submitError) {
      setSubmitError("")
    }
  }

  const onSubmit = async (data: CreateGrievanceData) => {
    setSubmitError("")

    try {
      const createdGrievance = await createGrievanceMutation.mutateAsync(data)

      setSubmittedCitizen({
        full_name: data.full_name,

        mobile_number: data.mobile_number,
      })

      setSubmitted(true)
      setComplaintId(String(createdGrievance.id))

      reset(initialFormData)
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Grievance submission failed. Please try again."

      setSubmitError(errorMessage)
    }
  }

  const handleClearForm = () => {
    reset(initialFormData)
    setSubmitError("")

    createGrievanceMutation.reset()
  }

  const handleRegisterAnother = () => {
    setSubmitted(false)
    setComplaintId("")
    setSubmitError("")

    setSubmittedCitizen({
      full_name: "",
      mobile_number: "",
    })

    reset(initialFormData)

    createGrievanceMutation.reset()
  }

  const scrollToForm = () => {
    const grievanceForm = document.getElementById("grievance-form-section")

    grievanceForm?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    })
  }

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-16 md:px-8">
      <div className="mx-auto max-w-6xl space-y-12">
        {/* Page Header */}
        <div className="space-y-3 text-center">
          <span className="border-gov-saffron/20 bg-gov-saffron/10 text-gov-saffron rounded-full border px-3 py-1 text-xs font-bold tracking-wider uppercase">
            Citizen Grievance Portal
          </span>

          <h1 className="text-gov-blue-dark text-center font-serif text-3xl font-black tracking-tight md:text-5xl">
            Public Grievance Redressal System
          </h1>

          <p className="mx-auto max-w-2xl text-sm font-medium text-slate-500 md:text-base">
            A responsive, transparent and citizen-first mechanism to resolve
            public concerns effectively.
          </p>

          <div className="bg-gov-saffron mx-auto h-1.5 w-24 rounded-full" />
        </div>

        {/* Information Section */}
        <div className="grid grid-cols-1 items-stretch gap-8 lg:grid-cols-2">
          {/* Left Information Card */}
          <m.div
            initial={{
              opacity: 0,
              x: -20,
            }}
            animate={{
              opacity: 1,
              x: 0,
            }}
            transition={{
              duration: 0.5,
            }}
            className="relative flex flex-col items-start justify-between space-y-6 overflow-hidden rounded-3xl border border-slate-100 bg-white p-8 shadow-xl md:p-10"
          >
            <div className="bg-gov-blue-medium absolute top-0 left-0 h-full w-2" />

            <div className="space-y-4">
              <h2 className="text-gov-blue-dark font-serif text-2xl leading-tight font-extrabold tracking-tight md:text-3xl">
                Your Voice Matters, And We Act On It
              </h2>

              <p className="text-xs leading-relaxed font-semibold text-slate-600 md:text-sm">
                Nagar Panchayat, Bhargain is committed to delivering a
                responsive and responsible grievance redressal ecosystem.
                Citizens are encouraged to report issues related to sanitation,
                water supply, drainage, street lighting, road maintenance,
                garbage collection, stray animals, illegal encroachments,
                property tax disputes, and any civic discomfort affecting daily
                life.
              </p>

              <p className="text-xs leading-relaxed font-medium text-slate-600 md:text-sm">
                Each grievance registered is tracked through a structured
                monitoring system ensuring timely resolution by the concerned
                department. Our aim is to strengthen public trust by promoting
                accountability, transparency, and efficient service delivery.
              </p>

              <p className="text-xs leading-relaxed font-medium text-slate-600 md:text-sm">
                Click the button below to submit your grievance. Your
                participation helps us build a cleaner, safer, and more
                citizen-friendly Baghpat.
              </p>
            </div>

            <Button
              type="button"
              onClick={scrollToForm}
              className="bg-gov-blue-medium hover:bg-gov-blue-dark cursor-pointer rounded-xl px-6 py-3 text-xs font-bold tracking-wider text-white uppercase shadow-lg transition-all hover:scale-[1.02] md:text-sm"
            >
              Submit Your Grievance
            </Button>
          </m.div>

          {/* Image Card */}
          <m.div
            initial={{
              opacity: 0,
              x: 20,
            }}
            animate={{
              opacity: 1,
              x: 0,
            }}
            transition={{
              duration: 0.5,
            }}
            className="group relative min-h-[350px] overflow-hidden rounded-3xl border border-slate-100 bg-slate-900 shadow-xl"
          >
            <Image
              src="/grievance.png"
              width={700}
              height={700}
              priority
              alt="Public grievance redressal portal"
              className="h-full w-full object-cover opacity-90 transition-transform duration-700 group-hover:scale-[1.03]"
            />

            <div className="absolute inset-0 bg-linear-to-t from-black/85 via-black/30 to-transparent" />

            <div className="absolute bottom-6 left-6 space-y-1 text-white">
              <h3 className="text-gov-saffron text-lg leading-none font-black tracking-tight md:text-xl">
                Grievance Redressal Portal
              </h3>

              <p className="text-xs font-bold tracking-wider text-slate-300 uppercase">
                Quick. Transparent. Citizen-Centric.
              </p>
            </div>
          </m.div>
        </div>

        {/* Grievance Form */}
        <div
          id="grievance-form-section"
          className="scroll-mt-24 overflow-hidden rounded-3xl border border-slate-100 bg-white shadow-xl"
        >
          {/* Form Header */}
          <div className="bg-gov-blue-dark flex items-center gap-3 px-8 py-5 text-white">
            <ShieldAlert className="text-gov-saffron h-6 w-6" />

            <div>
              <h2 className="text-base font-extrabold tracking-wider uppercase">
                Grievance Submission Form
              </h2>

              <p className="text-[10px] font-bold text-slate-300">
                Please fill in correct details. False complaints are subject to
                legal checks.
              </p>
            </div>
          </div>

          <div className="p-6 md:p-8">
            <AnimatePresence mode="wait">
              {submitted ? (
                /* Success Screen */
                <m.div
                  key="grievance-success"
                  initial={{
                    opacity: 0,
                    scale: 0.95,
                  }}
                  animate={{
                    opacity: 1,
                    scale: 1,
                  }}
                  exit={{
                    opacity: 0,
                    scale: 0.95,
                  }}
                  className="mx-auto flex max-w-md flex-col items-center justify-center space-y-4 py-12 text-center"
                >
                  <div className="flex h-16 w-16 items-center justify-center rounded-full border border-emerald-100 bg-emerald-50 text-emerald-500 shadow-inner">
                    <FileCheck className="h-8 w-8" />
                  </div>

                  <h3 className="text-xl font-extrabold text-slate-800">
                    Grievance Registered Successfully
                  </h3>

                  <p className="text-xs leading-relaxed font-semibold text-slate-500">
                    Thank you,{" "}
                    <span className="text-gov-blue-dark font-black">
                      {submittedCitizen.full_name}
                    </span>
                  </p>

                  <span className="text-gov-blue-dark block rounded-xl border border-slate-200 bg-slate-100 px-5 py-2.5 font-mono text-sm font-black tracking-widest uppercase">
                    {complaintId}
                  </span>

                  <p className="text-[10px] font-bold tracking-wider text-slate-400 uppercase">
                    Your registered mobile number is +91-
                    {submittedCitizen.mobile_number}.
                  </p>

                  <Button
                    type="button"
                    onClick={handleRegisterAnother}
                    className="mt-4 cursor-pointer rounded-lg bg-slate-100 px-4 py-2 text-xs font-bold text-slate-700 transition-colors hover:bg-slate-200"
                  >
                    Register Another Grievance
                  </Button>
                </m.div>
              ) : (
                /* Form Fields */
                <m.form
                  key="grievance-form"
                  initial={{
                    opacity: 0,
                  }}
                  animate={{
                    opacity: 1,
                  }}
                  exit={{
                    opacity: 0,
                  }}
                  onChange={clearSubmitError}
                  onSubmit={handleSubmit(onSubmit)}
                  className="space-y-6"
                  noValidate
                >
                  {/* Name, Phone and Email */}
                  <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                    {/* Full Name */}
                    <div>
                      <Label
                        htmlFor="full-name"
                        className="mb-1 block text-[10px] font-bold text-slate-500 uppercase"
                      >
                        Your Full Name
                      </Label>

                      <Input
                        id="full-name"
                        required
                        type="text"
                        minLength={2}
                        maxLength={120}
                        autoComplete="name"
                        aria-invalid={Boolean(errors.full_name)}
                        disabled={createGrievanceMutation.isPending}
                        placeholder="e.g. Rahul Sharma"
                        className="focus:outline-gov-blue-medium w-full rounded-xl border border-slate-200 px-4 py-2.5 text-xs font-semibold"
                        {...register("full_name")}
                      />

                      {errors.full_name && (
                        <p className="mt-1 text-xs font-semibold text-red-600">
                          {errors.full_name.message}
                        </p>
                      )}
                    </div>

                    {/* Mobile Number */}
                    <div>
                      <Label
                        htmlFor="mobile-number"
                        className="mb-1 block text-[10px] font-bold text-slate-500 uppercase"
                      >
                        Mobile Number
                      </Label>

                      <Controller
                        name="mobile_number"
                        control={control}
                        render={({ field }) => (
                          <Input
                            id="mobile-number"
                            required
                            type="tel"
                            name={field.name}
                            inputMode="numeric"
                            autoComplete="tel"
                            maxLength={10}
                            pattern="[6-9][0-9]{9}"
                            value={field.value}
                            onBlur={field.onBlur}
                            onChange={(event) => {
                              const numericValue = event.target.value
                                .replace(/\D/g, "")
                                .slice(0, 10)

                              field.onChange(numericValue)
                            }}
                            ref={field.ref}
                            aria-invalid={Boolean(errors.mobile_number)}
                            disabled={createGrievanceMutation.isPending}
                            placeholder="10-digit mobile number"
                            className="focus:outline-gov-blue-medium w-full rounded-xl border border-slate-200 px-4 py-2.5 text-xs font-semibold"
                          />
                        )}
                      />

                      {errors.mobile_number && (
                        <p className="mt-1 text-xs font-semibold text-red-600">
                          {errors.mobile_number.message}
                        </p>
                      )}
                    </div>

                    {/* Email */}
                    <div>
                      <Label
                        htmlFor="grievance-email"
                        className="mb-1 block text-[10px] font-bold text-slate-500 uppercase"
                      >
                        Email Address
                      </Label>

                      <Input
                        id="grievance-email"
                        required
                        type="email"
                        autoComplete="email"
                        aria-invalid={Boolean(errors.email)}
                        disabled={createGrievanceMutation.isPending}
                        placeholder="rahul.sharma@domain.com"
                        className="focus:outline-gov-blue-medium w-full rounded-xl border border-slate-200 px-4 py-2.5 text-xs font-semibold"
                        {...register("email")}
                      />

                      {errors.email && (
                        <p className="mt-1 text-xs font-semibold text-red-600">
                          {errors.email.message}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Category and Ward */}
                  <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    {/* Complaint Category */}
                    <div>
                      <Label className="mb-1 block text-[10px] font-bold text-slate-500 uppercase">
                        Complaint Category
                      </Label>

                      <Controller
                        name="complaint_category"
                        control={control}
                        render={({ field }) => (
                          <Select
                            name={field.name}
                            value={field.value}
                            onValueChange={(value) =>
                              field.onChange(value ?? "")
                            }
                            disabled={createGrievanceMutation.isPending}
                          >
                            <SelectTrigger
                              aria-invalid={Boolean(errors.complaint_category)}
                              className="w-full rounded-xl border-slate-200 text-xs font-semibold"
                            >
                              <SelectValue placeholder="Select Category" />
                            </SelectTrigger>

                            <SelectContent>
                              <SelectItem value="Sanitation">
                                Garbage Dumping
                              </SelectItem>

                              <SelectItem value="Water Supply">
                                Water Supply
                              </SelectItem>

                              <SelectItem value="Roads">
                                Damaged Roadways
                              </SelectItem>

                              <SelectItem value="Streetlights">
                                Street Lights Malfunction
                              </SelectItem>

                              <SelectItem value="Encroachments">
                                Illegal Encroachment
                              </SelectItem>

                              <SelectItem value="Pipeline Leakage">
                                Pipeline Leakage
                              </SelectItem>

                              <SelectItem value="Drainage">
                                Drainage Problem
                              </SelectItem>

                              <SelectItem value="Property Tax">
                                Property Tax Dispute
                              </SelectItem>

                              <SelectItem value="Other">
                                Other Complaint
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        )}
                      />

                      {errors.complaint_category && (
                        <p className="mt-1 text-xs font-semibold text-red-600">
                          {errors.complaint_category.message}
                        </p>
                      )}
                    </div>

                    {/* Municipal Ward */}
                    <div>
                      <Label className="mb-1 block text-[10px] font-bold text-slate-500 uppercase">
                        Select Municipal Ward
                      </Label>

                      <Controller
                        name="municipal_ward"
                        control={control}
                        render={({ field }) => (
                          <Select
                            name={field.name}
                            value={field.value}
                            onValueChange={(value) =>
                              field.onChange(value ?? "")
                            }
                            disabled={createGrievanceMutation.isPending}
                          >
                            <SelectTrigger
                              aria-invalid={Boolean(errors.municipal_ward)}
                              className="w-full rounded-xl border-slate-200 text-xs font-semibold"
                            >
                              <SelectValue placeholder="Select Ward" />
                            </SelectTrigger>

                            <SelectContent>
                              {Array.from(
                                {
                                  length: 14,
                                },
                                (_, index) => {
                                  const wardNumber = index + 1

                                  return (
                                    <SelectItem
                                      key={wardNumber}
                                      value={`Ward ${wardNumber}`}
                                    >
                                      Ward No. {wardNumber}
                                    </SelectItem>
                                  )
                                }
                              )}
                            </SelectContent>
                          </Select>
                        )}
                      />

                      {errors.municipal_ward && (
                        <p className="mt-1 text-xs font-semibold text-red-600">
                          {errors.municipal_ward.message}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Incident Address */}
                  <div>
                    <Label
                      htmlFor="incident-address"
                      className="mb-1 block text-[10px] font-bold text-slate-500 uppercase"
                    >
                      Incident Landmark / Address
                    </Label>

                    <Input
                      id="incident-address"
                      required
                      type="text"
                      minLength={5}
                      maxLength={255}
                      aria-invalid={Boolean(errors.incident_address)}
                      disabled={createGrievanceMutation.isPending}
                      placeholder="e.g. Near Hanuman Temple, Railway Road"
                      className="focus:outline-gov-blue-medium w-full rounded-xl border border-slate-200 px-4 py-2.5 text-xs font-semibold"
                      {...register("incident_address")}
                    />

                    {errors.incident_address && (
                      <p className="mt-1 text-xs font-semibold text-red-600">
                        {errors.incident_address.message}
                      </p>
                    )}
                  </div>

                  {/* Description */}
                  <div>
                    <Label
                      htmlFor="grievance-description"
                      className="mb-1 block text-[10px] font-bold text-slate-500 uppercase"
                    >
                      Detailed Description of Grievance
                    </Label>

                    <Textarea
                      id="grievance-description"
                      required
                      minLength={10}
                      aria-invalid={Boolean(errors.description)}
                      disabled={createGrievanceMutation.isPending}
                      rows={5}
                      placeholder="Please explain the issue and specific location details"
                      className="focus:outline-gov-blue-medium w-full rounded-xl border border-slate-200 px-4 py-2.5 text-xs font-semibold"
                      {...register("description")}
                    />

                    {errors.description && (
                      <p className="mt-1 text-xs font-semibold text-red-600">
                        {errors.description.message}
                      </p>
                    )}
                  </div>

                  {/* Important Notice */}
                  <div className="flex items-center gap-2.5 rounded-xl border border-amber-200 bg-amber-50 p-4 text-xs font-semibold text-amber-800">
                    <AlertCircle className="h-5 w-5 shrink-0 text-amber-600" />

                    <span>
                      Before submitting, please review all inputs. Reference
                      tickets are logged directly into the Chief Officer&apos;s
                      dashboard for verification audits.
                    </span>
                  </div>

                  {/* Error Message */}
                  {submitError && (
                    <m.div
                      initial={{
                        opacity: 0,
                        y: -5,
                      }}
                      animate={{
                        opacity: 1,
                        y: 0,
                      }}
                      role="alert"
                      className="rounded-xl border border-red-200 bg-red-50 px-4 py-3"
                    >
                      <p className="text-xs font-semibold text-red-700">
                        {submitError}
                      </p>
                    </m.div>
                  )}

                  {/* Action Buttons */}
                  <div className="flex flex-col-reverse items-stretch justify-end gap-3 border-t border-slate-100 pt-4 sm:flex-row sm:items-center">
                    <Button
                      type="button"
                      onClick={handleClearForm}
                      disabled={createGrievanceMutation.isPending}
                      className="cursor-pointer rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-xs font-bold text-slate-500 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      Clear Fields
                    </Button>

                    <Button
                      type="submit"
                      disabled={createGrievanceMutation.isPending}
                      className="bg-gov-saffron hover:bg-gov-saffron-dark flex cursor-pointer items-center justify-center gap-1.5 rounded-xl px-6 py-2.5 text-xs font-bold text-white shadow-md transition-all hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:scale-100"
                    >
                      <span>
                        {createGrievanceMutation.isPending
                          ? "Submitting..."
                          : "Submit Official Grievance"}
                      </span>

                      <Send
                        className={`h-4 w-4 ${
                          createGrievanceMutation.isPending
                            ? "animate-pulse"
                            : ""
                        }`}
                      />
                    </Button>
                  </div>
                </m.form>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  )
}
