
"use client"

import { m, AnimatePresence } from "framer-motion"
import {
  ArrowUpRight,
  Bell,
  Calendar,
  Download,
  Flame,
  Newspaper,
  Sparkles,
} from "lucide-react"
import Image from "next/image"
import { useState } from "react"

interface NewsItem {
  id: string
  title: string
  titleHi: string
  date: string
  category: string
  summary: string
  image: string
}

interface NoticeItem {
  id: string
  title: string
  refNo: string
  date: string
  size: string
  category: "tender" | "circular" | "recruitment"
  isUrgent?: boolean
}

export default function NewsAndNotice() {
  const [activeTab, setActiveTab] = useState<
    "all" | "tender" | "circular" | "recruitment"
  >("all")
  const [selectedNews, setSelectedNews] = useState<NewsItem | null>(null)

  const newsList: NewsItem[] = [
    {
      id: "news-1",
      title:
        "Chhata Municipal Board Achieves Top Rating in Mathura Zonal Sanitation Audits",
      titleHi:
        "नगर पंचायत छाता को मथुरा जिला स्वच्छता सर्वेक्षण में मिला उत्कृष्ट स्थान",
      date: "June 20, 2026",
      category: "Awards & Sanitation",
      summary:
        "Under the Swachh Bharat Mission, the Mathura district administration praised Chhata for effective daily wet-waste management and door-to-door collection across all wards.",
      image:
        "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=800&auto=format&fit=crop&q=80",
    },
    {
      id: "news-2",
      title:
        "New Digital Property Tax Assessment Portal Goes Live for Chhata Citizens",
      titleHi:
        "छाता के नागरिकों के लिए नया डिजिटल संपत्ति कर मूल्यांकन पोर्टल हुआ लाइव",
      date: "June 15, 2026",
      category: "Citizen Services",
      summary:
        "Chhata residents can now verify property records, calculate rebates, and check assessment statuses seamlessly through the updated digital interface.",
      image:
        "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=800&auto=format&fit=crop&q=80",
    },
    {
      id: "news-3",
      title:
        "Solar Street Light Installation Project Initiated Across Main Markets of Chhata",
      titleHi:
        "छाता के मुख्य बाजारों और हाइवे मार्गों पर सोलर स्ट्रीट लाइट लगाने की परियोजना शुरू",
      date: "June 10, 2026",
      category: "Green Initiatives",
      summary:
        "To boost night-time safety and promote green energy, modern energy-efficient LED solar street lights are being installed across key commercial zones in Chhata.",
      image:
        "https://images.unsplash.com/photo-1509391366360-2e959784a276?w=800&auto=format&fit=crop&q=80",
    },
  ]

  const noticesList: NoticeItem[] = [
    {
      id: "notice-1",
      title:
        "Tender Ref NPC-NIT-2026-014: Construction of interlocking CC roads and drainage systems in Chhata Ward No. 4 & 7.",
      refNo: "NPC-NIT-2026-014",
      date: "June 21, 2026",
      size: "420 KB",
      category: "tender",
      isUrgent: true,
    },
    {
      id: "notice-2",
      title:
        "Public Circular: Strict guidelines on single-use plastic ban compliance audits in local markets of Chhata.",
      refNo: "NPC-CIRC-2026-005",
      date: "June 18, 2026",
      size: "280 KB",
      category: "circular",
      isUrgent: false,
    },
    {
      id: "notice-3",
      title:
        "Recruitment Notice: Provisional merit list for contractual sanitation supervisors and field helpers in Nagar Panchayat Chhata.",
      refNo: "NPC-REC-2026-003",
      date: "June 14, 2026",
      size: "1.2 MB",
      category: "recruitment",
      isUrgent: true,
    },
    {
      id: "notice-4",
      title:
        "Corrigendum 1: Time extension notice for submission of bids regarding water pipeline maintenance in Chhata.",
      refNo: "NPC-TEND-2026-009-C1",
      date: "June 12, 2026",
      size: "180 KB",
      category: "tender",
      isUrgent: false,
    },
    {
      id: "notice-5",
      title:
        "Water Supply Advisory: Scheduled pipeline maintenance in low-lying zones of Chhata town.",
      refNo: "NPC-PUB-2026-022",
      date: "June 08, 2026",
      size: "240 KB",
      category: "circular",
      isUrgent: false,
    },
  ]

  const filteredNotices =
    activeTab === "all"
      ? noticesList
      : noticesList.filter((n) => n.category === activeTab)

  return (
    <section
      id="news-notices"
      className="relative overflow-hidden bg-slate-50 px-4 py-24 font-sans text-slate-900 md:px-8"
    >
      {/* Dynamic Background Glow Effects */}
      <div className="pointer-events-none absolute top-0 left-1/4 h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-orange-500/5 blur-[150px]" />
      <div className="pointer-events-none absolute right-1/4 bottom-0 h-[500px] w-[500px] translate-x-1/2 rounded-full bg-blue-500/5 blur-[150px]" />

      <div className="relative z-10 mx-auto max-w-7xl space-y-16">
        {/* Section Header */}
        <div className="flex flex-col items-center justify-between gap-6 md:flex-row md:items-end">
          <div className="space-y-3 text-center md:text-left">
            <div className="inline-flex items-center gap-2 rounded-full border border-orange-500/30 bg-orange-500/10 px-4 py-1.5 text-xs font-bold tracking-wider text-orange-600 uppercase backdrop-blur-md">
              <Sparkles className="h-3.5 w-3.5 animate-pulse text-orange-600" />
              <span>Nagar Panchayat Chhata • Mathura</span>
            </div>
            <h2 className="font-serif text-3xl font-extrabold tracking-tight text-slate-900 md:text-5xl">
              Major National Announcements{" "}
              <span className="bg-gradient-to-r from-orange-600 via-amber-600 to-blue-600 bg-clip-text text-transparent">
                & Government Updates
              </span>
            </h2>
          </div>
          <p className="max-w-md text-center text-xs leading-relaxed font-medium text-slate-600 md:text-right">
            नगर पंचायत छाता, मथुरा की आधिकारिक घोषणाएं, बोर्ड टेंडर, और विकास
            कार्यों की पल-पल की अपडेट।
          </p>
        </div>

        {/* Main Grid Layout */}
        <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-12">
          {/* LEFT: Featured News Carousel / Grid (7 Cols) */}
          <div className="space-y-6 lg:col-span-7">
            <div className="flex items-center justify-between border-b border-slate-200 pb-4">
              <div className="flex items-center gap-2.5">
                <div className="rounded-xl border border-orange-500/20 bg-orange-500/10 p-2.5 text-orange-600">
                  <Newspaper className="h-5 w-5" />
                </div>
                <h3 className="text-lg font-bold tracking-tight text-slate-900">
                  मुख्य समाचार (Latest News)
                </h3>
              </div>
              <span className="text-xs font-semibold text-slate-500">
                अपडेटेड जून 2026
              </span>
            </div>

            <div className="grid grid-cols-1 gap-6">
              {newsList.map((news, idx) => (
                <m.div
                  key={news.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1, duration: 0.5 }}
                  onClick={() => setSelectedNews(news)}
                  className="group relative cursor-pointer overflow-hidden rounded-3xl border border-slate-200 bg-white p-5 shadow-xl transition-all duration-300 hover:border-orange-500/50 hover:shadow-2xl"
                >
                  <div className="flex flex-col items-center gap-5 sm:flex-row">
                    {/* Image Container with sizes prop added */}
                    <div className="relative h-44 w-full shrink-0 overflow-hidden rounded-2xl border border-slate-200 sm:w-48">
                      <Image
                        src={news.image}
                        alt={news.title}
                        fill
                        sizes="(max-width: 640px) 100vw, 192px"
                        className="object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-transparent" />
                      <span className="absolute top-2.5 left-2.5 rounded-full bg-orange-600/90 px-2.5 py-1 text-[9px] font-black tracking-wider text-white uppercase backdrop-blur-md">
                        {news.category}
                      </span>
                    </div>

                    {/* Content Details */}
                    <div className="flex w-full flex-1 flex-col justify-between space-y-2">
                      <div className="flex items-center gap-2 text-xs font-medium text-orange-600">
                        <Calendar className="h-3.5 w-3.5" />
                        <span>{news.date}</span>
                      </div>

                      <h4 className="line-clamp-2 text-sm font-bold text-slate-900 transition-colors group-hover:text-orange-600 sm:text-base">
                        {news.title}
                      </h4>

                      <p className="font-serif text-xs font-semibold text-slate-700">
                        {news.titleHi}
                      </p>

                      <p className="line-clamp-2 text-xs leading-relaxed font-normal text-slate-600">
                        {news.summary}
                      </p>

                      <div className="flex items-center gap-1.5 pt-2 text-xs font-bold text-orange-600 transition-transform group-hover:translate-x-1">
                        <span>विस्तार से पढ़ें</span>
                        <ArrowUpRight className="h-4 w-4" />
                      </div>
                    </div>
                  </div>
                </m.div>
              ))}
            </div>
          </div>

          {/* RIGHT: Notices & Tenders with Tabs (5 Cols) */}
          <div className="space-y-6 lg:col-span-5">
            <div className="flex items-center justify-between border-b border-slate-200 pb-4">
              <div className="flex items-center gap-2.5">
                <div className="rounded-xl border border-blue-500/20 bg-blue-500/10 p-2.5 text-blue-600">
                  <Bell className="h-5 w-5" />
                </div>
                <h3 className="text-lg font-bold tracking-tight text-slate-900">
                  निविदाएं एवं सूचनाएं
                </h3>
              </div>
            </div>

            {/* Filter Tabs */}
            <div className="flex flex-wrap gap-2 rounded-2xl border border-slate-200 bg-white p-1.5 shadow-sm">
              <button
                type="button"
                onClick={() => setActiveTab("all")}
                className={`flex-1 rounded-xl px-3 py-2 text-xs font-bold transition-all ${
                  activeTab === "all"
                    ? "bg-gradient-to-r from-orange-500 to-amber-600 text-white shadow-md"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                सभी
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("tender")}
                className={`flex-1 rounded-xl px-3 py-2 text-xs font-bold transition-all ${
                  activeTab === "tender"
                    ? "bg-gradient-to-r from-orange-500 to-amber-600 text-white shadow-md"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                टेंडर
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("circular")}
                className={`flex-1 rounded-xl px-3 py-2 text-xs font-bold transition-all ${
                  activeTab === "circular"
                    ? "bg-gradient-to-r from-orange-500 to-amber-600 text-white shadow-md"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                सर्कुलर
              </button>
            </div>

            {/* Notice List Container */}
            <div className="max-h-[520px] space-y-4 overflow-y-auto rounded-3xl border border-slate-200 bg-white p-5 shadow-xl">
              {filteredNotices.map((notice, idx) => (
                <m.div
                  key={notice.id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className="group relative rounded-2xl border border-slate-100 bg-slate-50/70 p-4 transition-all hover:border-blue-500/40 hover:bg-white hover:shadow-md"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 space-y-1.5">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="rounded-md border border-orange-500/20 bg-orange-500/10 px-2 py-0.5 font-mono text-[10px] font-bold text-orange-600">
                          {notice.refNo}
                        </span>
                        <span className="text-[10px] text-slate-400">•</span>
                        <span className="text-[10px] font-medium text-slate-500">
                          {notice.date}
                        </span>
                        {notice.isUrgent && (
                          <span className="inline-flex animate-pulse items-center gap-1 rounded-full border border-red-500/30 bg-red-500/10 px-2 py-0.5 text-[8px] font-black text-red-600 uppercase">
                            <Flame className="h-2.5 w-2.5" /> Urgent
                          </span>
                        )}
                      </div>

                      <p className="text-xs leading-relaxed font-bold text-slate-800 transition-colors group-hover:text-blue-600">
                        {notice.title}
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() =>
                        alert(`Downloading document: ${notice.refNo}`)
                      }
                      className="shrink-0 rounded-xl bg-slate-200 p-2.5 text-slate-700 shadow-sm transition-all group-hover:scale-105 hover:bg-orange-600 hover:text-white"
                      title="Download PDF"
                    >
                      <Download className="h-4 w-4" />
                    </button>
                  </div>
                </m.div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Quick Interactive Modal Preview for News */}
      <AnimatePresence>
        {selectedNews && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm">
            <m.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-2xl overflow-hidden rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl"
            >
              <div className="relative mb-4 h-64 w-full overflow-hidden rounded-2xl">
                <Image
                  src={selectedNews.image}
                  alt={selectedNews.title}
                  fill
                  sizes="(max-width: 768px) 100vw, 600px"
                  className="object-cover"
                />
              </div>
              <span className="text-xs font-bold text-orange-600">
                {selectedNews.date}
              </span>
              <h3 className="mt-1 text-lg font-bold text-slate-900">
                {selectedNews.title}
              </h3>
              <p className="mt-1 font-serif text-sm font-semibold text-orange-700">
                {selectedNews.titleHi}
              </p>
              <p className="mt-3 text-xs leading-relaxed text-slate-600">
                {selectedNews.summary}
              </p>

              <div className="mt-6 flex justify-end">
                <button
                  type="button"
                  onClick={() => setSelectedNews(null)}
                  className="rounded-xl bg-orange-600 px-5 py-2 text-xs font-bold text-white shadow-md transition-colors hover:bg-orange-700"
                >
                  बंद करें (Close)
                </button>
              </div>
            </m.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  )
}
