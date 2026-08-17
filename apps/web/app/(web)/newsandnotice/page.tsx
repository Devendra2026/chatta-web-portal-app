import NewsAndNotice from "@/components/newsandnotice/page"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "NewsAndNotice",
  description:
    "Stay updated with the latest news and notices from Nagar Panchayat Chhata, Mathura, Uttar Pradesh, India. Access important announcements, community updates, and information about local events and initiatives.",
}

export default function () {
  return (
    <div>
      <NewsAndNotice />
    </div>
  )
}
