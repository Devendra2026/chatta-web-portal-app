const API_URL = process.env.NEXT_PUBLIC_API_URL?.replace(/\/+$/, "")

type ApiRequestOptions = RequestInit & {
  token?: string | null
  suppressErrorLog?: boolean
}

type FastApiValidationError = {
  msg?: string
}

type ApiErrorResponse = {
  detail?: string | FastApiValidationError[]
  message?: string
}

function getErrorMessage(data: unknown): string {
  if (typeof data !== "object" || data === null) {
    return "API request failed"
  }

  const errorData = data as ApiErrorResponse

  if (typeof errorData.detail === "string") {
    return errorData.detail
  }

  if (Array.isArray(errorData.detail)) {
    return errorData.detail
      .map((error) => {
        return error.msg ?? "Validation error"
      })
      .join(", ")
  }

  if (typeof errorData.message === "string") {
    return errorData.message
  }

  return "API request failed"
}

export async function apiRequest<T>(
  endpoint: string,
  options: ApiRequestOptions = {}
): Promise<T> {
  if (!API_URL) {
    throw new Error("NEXT_PUBLIC_API_URL .env.local mein configure nahi hai")
  }

  const normalizedEndpoint = endpoint.startsWith("/")
    ? endpoint
    : `/${endpoint}`

  const requestUrl = `${API_URL}${normalizedEndpoint}`

  /*
   * token ko alag kar diya,
   * kyunki fetch() token property ko nahi jaanta.
   */
  const { token, suppressErrorLog, ...requestOptions } = options

  const headers = new Headers(requestOptions.headers)

  headers.set("Accept", "application/json")

  const isFormData =
    typeof FormData !== "undefined" && requestOptions.body instanceof FormData

  /*
   * JSON request ke liye Content-Type.
   * FormData ke liye browser khud header set karega.
   */
  if (requestOptions.body && !isFormData && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json")
  }

  /*
   * Protected GET, PUT aur DELETE APIs ke liye
   * Clerk token Authorization header me jayega.
   */
  if (token) {
    headers.set("Authorization", `Bearer ${token}`)
  }

  let response: Response

  try {
    response = await fetch(requestUrl, {
      ...requestOptions,
      headers,
    })
  } catch (error) {
    console.error("API network error:", {
      requestUrl,
      error,
    })

    throw new Error(
      "Backend se connection nahi ho raha. FastAPI server, API URL aur CORS check karo."
    )
  }

  /*
   * DELETE API agar 204 No Content return kare.
   */
  if (response.status === 204) {
    return undefined as T
  }

  const contentType = response.headers.get("content-type") ?? ""

  let responseData: unknown

  if (contentType.includes("application/json")) {
    responseData = await response.json()
  } else {
    responseData = await response.text()
  }

  if (!response.ok) {
    if (!suppressErrorLog) {
      console.error("API request failed:", {
        requestUrl,
        status: response.status,
        responseData,
      })
    }

    throw new Error(getErrorMessage(responseData))
  }

  return responseData as T
}
