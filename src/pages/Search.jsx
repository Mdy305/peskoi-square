import React, { useState, useMemo } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { Search as SearchIcon, Calendar, User, Phone, Mail } from "lucide-react";

export default function Search() {
  const [query, setQuery] = useState("");

  const { data: appointments = [] } = useQuery({
    queryKey: ['appointments'],
    queryFn: () => base44.entities.Appointment.list('-appointment_date')
  });

  const { data: serviceRecords = [] } = useQuery({
    queryKey: ['serviceRecords'],
    queryFn: () => base44.entities.ServiceRecord.list('-service_date')
  });

  const { data: knowledge = [] } = useQuery({
    queryKey: ['knowledge'],
    queryFn: () => base44.entities.KnowledgeBase.list()
  });

  const results = useMemo(() => {
    if (!query.trim()) return [];

    const q = query.toLowerCase();
    const matches = [];

    // Search appointments
    appointments.forEach(apt => {
      if (
        apt.client_name?.toLowerCase().includes(q) ||
        apt.client_phone?.includes(q) ||
        apt.services?.some(s => s.toLowerCase().includes(q))
      ) {
        matches.push({
          type: 'Appointment',
          title: apt.client_name,
          subtitle: `${apt.appointment_date} • ${apt.services?.join(', ')}`,
          phone: apt.client_phone,
          email: apt.client_email,
          data: apt
        });
      }
    });

    // Search service records
    serviceRecords.forEach(record => {
      if (
        record.client_name?.toLowerCase().includes(q) ||
        record.client_phone?.includes(q) ||
        record.services_provided?.some(s => s.toLowerCase().includes(q)) ||
        record.notes?.toLowerCase().includes(q)
      ) {
        matches.push({
          type: 'Service Record',
          title: record.client_name,
          subtitle: `${record.service_date} • ${record.services_provided?.join(', ')}`,
          phone: record.client_phone,
          notes: record.notes,
          data: record
        });
      }
    });

    // Search knowledge base
    knowledge.forEach(item => {
      if (
        item.title?.toLowerCase().includes(q) ||
        item.content?.toLowerCase().includes(q) ||
        item.tags?.some(t => t.toLowerCase().includes(q))
      ) {
        matches.push({
          type: 'Knowledge',
          title: item.title,
          subtitle: item.category?.replace('_', ' '),
          content: item.content,
          data: item
        });
      }
    });

    return matches.slice(0, 50);
  }, [query, appointments, serviceRecords, knowledge]);

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 sm:py-20">
        
        <p className="text-xs text-white/40 tracking-[0.15em] uppercase mb-8">Search</p>

        <div className="relative mb-12">
          <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/30" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search appointments, clients, services, knowledge..."
            className="w-full bg-transparent border border-white/[0.08] pl-12 pr-4 py-4 text-base focus:outline-none focus:border-white/20 transition-colors"
            autoFocus
          />
        </div>

        <AnimatePresence mode="wait">
          {query.trim() && (
            <motion.div
              key="results"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              {results.length === 0 ? (
                <div className="text-center py-16">
                  <p className="text-white/40 text-sm">No results found</p>
                </div>
              ) : (
                <div className="space-y-3">
                  <p className="text-xs text-white/30 tracking-wide mb-6">
                    {results.length} result{results.length !== 1 ? 's' : ''}
                  </p>
                  {results.map((result, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.03 }}
                      className="border border-white/[0.08] p-4 sm:p-6 hover:border-white/[0.15] transition-all"
                    >
                      <div className="flex items-start justify-between gap-4 mb-3">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-3 mb-2">
                            <span className="text-xs text-white/30 tracking-wide uppercase">
                              {result.type}
                            </span>
                          </div>
                          <h3 className="text-base sm:text-lg text-white/90 mb-1">
                            {result.title}
                          </h3>
                          {result.subtitle && (
                            <p className="text-sm text-white/40">{result.subtitle}</p>
                          )}
                        </div>
                      </div>

                      {result.phone && (
                        <div className="flex items-center gap-2 text-xs text-white/40 mb-2">
                          <Phone className="w-3 h-3" />
                          <span>{result.phone}</span>
                        </div>
                      )}

                      {result.email && (
                        <div className="flex items-center gap-2 text-xs text-white/40 mb-2">
                          <Mail className="w-3 h-3" />
                          <span>{result.email}</span>
                        </div>
                      )}

                      {result.notes && (
                        <p className="text-xs text-white/30 mt-3 line-clamp-2">
                          {result.notes}
                        </p>
                      )}

                      {result.content && (
                        <p className="text-xs text-white/30 mt-3 line-clamp-2">
                          {result.content}
                        </p>
                      )}
                    </motion.div>
                  ))}
                </div>
              )}
            </motion.div>
          )}

          {!query.trim() && (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center py-16"
            >
              <SearchIcon className="w-12 h-12 text-white/10 mx-auto mb-4" />
              <p className="text-white/40 text-sm">Start typing to search</p>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
}