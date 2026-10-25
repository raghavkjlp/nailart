import React, { useState, useEffect } from "react";
import {
  Sparkles,
  Search,
  Download,
  Trash2,
  RefreshCw,
  Phone,
  Mail,
  User,
  Calendar,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  Check,
  Copy
} from "lucide-react";
import {
  fetchSpinLeadsAdmin,
  exportSpinLeadsCsv,
  deleteSpinLeadAdmin
} from "../../services/api.js";

export const AdminSpinLeads = ({ notify }) => {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [totalCount, setTotalCount] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [limit, setLimit] = useState(15);
  const [search, setSearch] = useState("");
  const [sortOrder, setSortOrder] = useState("desc"); // 'desc' (newest) | 'asc' (oldest)
  const [isExporting, setIsExporting] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);
  const [copiedId, setCopiedId] = useState(null);

  const loadLeads = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await fetchSpinLeadsAdmin({
        page,
        limit,
        search: search.trim(),
        sortBy: "createdAt",
        sortOrder
      });

      if (data.success) {
        setLeads(data.leads || []);
        setTotalCount(data.totalCount || 0);
        setTotalPages(data.totalPages || 1);
      }
    } catch (err) {
      console.error("Failed to load spin leads:", err);
      setError(err.message || "Could not fetch leads from server");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadLeads();
  }, [page, limit, sortOrder]);

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      setPage(1);
      loadLeads();
    }, 350);
    return () => clearTimeout(timer);
  }, [search]);

  // Export CSV handler
  const handleExport = async () => {
    setIsExporting(true);
    try {
      await exportSpinLeadsCsv();
      if (notify) notify("Spin leads successfully exported to CSV! 📊");
    } catch (err) {
      if (notify) notify("Failed to export leads: " + err.message, "error");
    } finally {
      setIsExporting(false);
    }
  };

  // Delete lead handler
  const handleDelete = async (id) => {
    try {
      await deleteSpinLeadAdmin(id);
      setDeleteConfirmId(null);
      if (notify) notify("Lead deleted successfully");
      loadLeads();
    } catch (err) {
      if (notify) notify("Failed to delete lead: " + err.message, "error");
    }
  };

  // Copy helper
  const handleCopy = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Format date helper
  const formatDate = (isoStr) => {
    if (!isoStr) return "—";
    try {
      const d = new Date(isoStr);
      return d.toLocaleString("en-IN", {
        timeZone: "Asia/Kolkata",
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        hour12: true
      });
    } catch {
      return String(isoStr);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Top Banner & Stats */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-pink-200 shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-pink-100">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-pink-100 text-[#64263C] text-[11px] font-bold uppercase tracking-wider mb-2">
              <Sparkles className="w-3.5 h-3.5 text-[#D6B477]" />
              <span>Visitor Acquisition</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-serif font-bold text-[#64263C]">
              Spin the Wheel Leads
            </h1>
            <p className="text-xs sm:text-sm text-[#5A5255] mt-1 max-w-xl">
              Real visitor contact information collected prior to revealing the Spin the Wheel result.
              All entries are stored securely in MongoDB Atlas.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={handleExport}
              disabled={isExporting || totalCount === 0}
              className="px-5 py-3 rounded-full bg-[#64263C] text-white text-xs font-bold hover:bg-[#4E1C2E] shadow-md hover:shadow-lg transition-all flex items-center gap-2 disabled:opacity-50"
            >
              {isExporting ? (
                <RefreshCw className="w-4 h-4 animate-spin text-[#D6B477]" />
              ) : (
                <Download className="w-4 h-4 text-[#D6B477]" />
              )}
              <span>Export Leads to CSV</span>
            </button>

            <button
              onClick={loadLeads}
              disabled={loading}
              className="p-3 rounded-full bg-pink-50 text-[#64263C] hover:bg-pink-100 border border-pink-200 transition-all"
              title="Refresh Leads Table"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
            </button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-6">
          <div className="p-4 rounded-2xl bg-[#FFF9F5] border border-pink-100 text-center">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#D6B477] block mb-1">
              Total Leads Captured
            </span>
            <span className="text-2xl sm:text-3xl font-serif font-extrabold text-[#64263C]">
              {totalCount}
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-[#FFF9F5] border border-pink-100 text-center">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#D6B477] block mb-1">
              Mandatory Result
            </span>
            <span className="text-sm sm:text-base font-serif font-bold text-rose-700 block truncate">
              Better Luck Next Time!
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-[#FFF9F5] border border-pink-100 text-center">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#D6B477] block mb-1">
              Primary Source
            </span>
            <span className="text-sm sm:text-base font-serif font-bold text-[#64263C] block truncate">
              Website Entry Popup 🎡
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-[#FFF9F5] border border-pink-100 text-center flex flex-col justify-center items-center">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#D6B477] block mb-1">
              Data Security
            </span>
            <span className="text-xs font-bold text-emerald-700 flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Restricted Admin API</span>
            </span>
          </div>
        </div>
      </div>

      {/* Search & Sort Controls */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 border border-pink-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Search Input */}
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by name, phone, or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-full border border-pink-200 text-xs focus:outline-none focus:ring-2 focus:ring-[#64263C]/30 text-[#242124] bg-[#FFF9F5]/40"
          />
          {search && (
            <button
              onClick={() => setSearch("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-xs font-bold"
            >
              ×
            </button>
          )}
        </div>

        {/* Sort & Pagination Limit Selectors */}
        <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
          <div className="flex items-center gap-1.5 text-xs text-[#5A5255]">
            <span className="font-semibold">Sort:</span>
            <select
              value={sortOrder}
              onChange={(e) => {
                setSortOrder(e.target.value);
                setPage(1);
              }}
              className="px-3 py-1.5 rounded-full border border-pink-200 bg-white text-xs font-semibold text-[#242124] focus:outline-none focus:ring-2 focus:ring-[#64263C]/30"
            >
              <option value="desc">Newest First</option>
              <option value="asc">Oldest First</option>
            </select>
          </div>

          <div className="flex items-center gap-1.5 text-xs text-[#5A5255]">
            <span className="font-semibold">Per Page:</span>
            <select
              value={limit}
              onChange={(e) => {
                setLimit(Number(e.target.value));
                setPage(1);
              }}
              className="px-3 py-1.5 rounded-full border border-pink-200 bg-white text-xs font-semibold text-[#242124] focus:outline-none focus:ring-2 focus:ring-[#64263C]/30"
            >
              <option value={10}>10</option>
              <option value={15}>15</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
            </select>
          </div>
        </div>
      </div>

      {/* Error Notice */}
      {error && (
        <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Leads Table */}
      <div className="bg-white rounded-3xl border border-pink-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-[#FFF9F5] border-b border-pink-200/80 text-[11px] font-bold uppercase tracking-wider text-[#64263C]">
                <th className="py-4 px-4 sm:px-6">#</th>
                <th className="py-4 px-4 sm:px-6">Full Name</th>
                <th className="py-4 px-4 sm:px-6">Phone Number</th>
                <th className="py-4 px-4 sm:px-6">Email Address</th>
                <th className="py-4 px-4 sm:px-6">Spin Result</th>
                <th className="py-4 px-4 sm:px-6">Date & Time</th>
                <th className="py-4 px-4 sm:px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-pink-100">
              {loading ? (
                <tr>
                  <td colSpan="7" className="py-12 text-center text-[#5A5255]">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <RefreshCw className="w-5 h-5 animate-spin text-[#D6B477]" />
                      <span>Loading visitor spin records...</span>
                    </div>
                  </td>
                </tr>
              ) : leads.length === 0 ? (
                <tr>
                  <td colSpan="7" className="py-16 text-center text-[#5A5255]">
                    <div className="max-w-xs mx-auto space-y-2">
                      <div className="w-12 h-12 rounded-full bg-pink-100 text-[#64263C] flex items-center justify-center mx-auto text-xl">
                        🎡
                      </div>
                      <h4 className="font-serif font-bold text-base text-[#64263C]">
                        No Leads Captured Yet
                      </h4>
                      <p className="text-xs text-[#8E8688]">
                        {search
                          ? "No records match your search criteria. Try a different query."
                          : "When visitors spin the promotional wheel on the website, their verified contact details will automatically appear here."}
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                leads.map((lead, idx) => {
                  const itemIndex = (page - 1) * limit + idx + 1;
                  const isCopied = copiedId === lead.id;

                  return (
                    <tr
                      key={lead.id}
                      className="hover:bg-pink-50/40 transition-colors group"
                    >
                      {/* Index */}
                      <td className="py-4 px-4 sm:px-6 font-semibold text-[#8E8688]">
                        {itemIndex}
                      </td>

                      {/* Full Name */}
                      <td className="py-4 px-4 sm:px-6 font-bold text-[#242124]">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-full bg-pink-100 text-[#64263C] flex items-center justify-center font-bold text-[10px] shrink-0">
                            {lead.fullName && lead.fullName !== "—"
                              ? lead.fullName.charAt(0).toUpperCase()
                              : "U"}
                          </div>
                          <span>{lead.fullName || "—"}</span>
                        </div>
                      </td>

                      {/* Phone Number */}
                      <td className="py-4 px-4 sm:px-6">
                        <div className="flex items-center gap-2">
                          <a
                            href={`tel:${lead.phoneNumber}`}
                            className="font-semibold text-[#64263C] hover:underline flex items-center gap-1"
                          >
                            <Phone className="w-3.5 h-3.5 text-[#D6B477]" />
                            <span>{lead.phoneNumber}</span>
                          </a>
                          <button
                            onClick={() => handleCopy(lead.phoneNumber, `phone-${lead.id}`)}
                            className="p-1 text-gray-400 hover:text-[#64263C] rounded transition-colors"
                            title="Copy Phone Number"
                          >
                            {copiedId === `phone-${lead.id}` ? (
                              <Check className="w-3.5 h-3.5 text-emerald-600" />
                            ) : (
                              <Copy className="w-3.5 h-3.5" />
                            )}
                          </button>
                        </div>
                      </td>

                      {/* Email Address */}
                      <td className="py-4 px-4 sm:px-6">
                        <div className="flex items-center gap-2">
                          <a
                            href={`mailto:${lead.email}`}
                            className="font-medium text-[#242124] hover:text-[#64263C] hover:underline flex items-center gap-1"
                          >
                            <Mail className="w-3.5 h-3.5 text-[#D6B477]" />
                            <span>{lead.email}</span>
                          </a>
                          <button
                            onClick={() => handleCopy(lead.email, `email-${lead.id}`)}
                            className="p-1 text-gray-400 hover:text-[#64263C] rounded transition-colors"
                            title="Copy Email Address"
                          >
                            {copiedId === `email-${lead.id}` ? (
                              <Check className="w-3.5 h-3.5 text-emerald-600" />
                            ) : (
                              <Copy className="w-3.5 h-3.5" />
                            )}
                          </button>
                        </div>
                      </td>

                      {/* Result */}
                      <td className="py-4 px-4 sm:px-6">
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-rose-50 text-rose-700 text-[10px] font-bold border border-rose-200">
                          <Sparkles className="w-3 h-3 text-rose-500" />
                          <span>{lead.result || "Better Luck Next Time!"}</span>
                        </span>
                      </td>

                      {/* Date & Time */}
                      <td className="py-4 px-4 sm:px-6 text-[#5A5255] whitespace-nowrap">
                        <div className="flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5 text-[#D6B477]" />
                          <span>{formatDate(lead.createdAt)}</span>
                        </div>
                      </td>

                      {/* Actions */}
                      <td className="py-4 px-4 sm:px-6 text-right whitespace-nowrap">
                        {deleteConfirmId === lead.id ? (
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => handleDelete(lead.id)}
                              className="px-2.5 py-1 rounded-lg bg-rose-600 text-white text-[10px] font-bold hover:bg-rose-700"
                            >
                              Confirm
                            </button>
                            <button
                              onClick={() => setDeleteConfirmId(null)}
                              className="px-2.5 py-1 rounded-lg bg-gray-200 text-gray-700 text-[10px] font-bold hover:bg-gray-300"
                            >
                              Cancel
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => setDeleteConfirmId(lead.id)}
                            className="p-1.5 text-gray-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                            title="Delete Lead"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Bar */}
        {totalPages > 1 && (
          <div className="p-4 sm:p-5 bg-[#FFF9F5]/70 border-t border-pink-100 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
            <span className="text-[#5A5255]">
              Showing page <strong className="text-[#64263C]">{page}</strong> of{" "}
              <strong className="text-[#64263C]">{totalPages}</strong> ({totalCount} total leads)
            </span>

            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page <= 1}
                className="px-3 py-1.5 rounded-lg border border-pink-200 bg-white text-xs font-semibold text-[#64263C] hover:bg-pink-50 disabled:opacity-40 disabled:pointer-events-none flex items-center gap-1"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
                <span>Previous</span>
              </button>

              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                let pNum = i + 1;
                if (totalPages > 5 && page > 3) {
                  pNum = page - 2 + i;
                  if (pNum > totalPages) pNum = totalPages - (4 - i);
                }
                return (
                  <button
                    key={pNum}
                    onClick={() => setPage(pNum)}
                    className={`w-8 h-8 rounded-lg text-xs font-bold transition-all ${
                      page === pNum
                        ? "bg-[#64263C] text-white shadow-sm"
                        : "bg-white text-[#5A5255] border border-pink-200 hover:bg-pink-50"
                    }`}
                  >
                    {pNum}
                  </button>
                );
              })}

              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page >= totalPages}
                className="px-3 py-1.5 rounded-lg border border-pink-200 bg-white text-xs font-semibold text-[#64263C] hover:bg-pink-50 disabled:opacity-40 disabled:pointer-events-none flex items-center gap-1"
              >
                <span>Next</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminSpinLeads;
