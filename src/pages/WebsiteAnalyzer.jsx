import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Globe, Loader2, CheckCircle, AlertCircle, Sparkles } from "lucide-react";

export default function WebsiteAnalyzer() {
  const [url, setUrl] = useState("");
  const queryClient = useQueryClient();

  const { data: business } = useQuery({
    queryKey: ['business'],
    queryFn: async () => {
      const businesses = await base44.entities.Business.list();
      return businesses[0];
    }
  });

  const analyzeMutation = useMutation({
    mutationFn: async (websiteUrl) => {
      const res = await base44.functions.invoke('analyzeSalonWebsite', { 
        website_url: websiteUrl 
      });
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['business']);
      setUrl("");
    }
  });

  const handleAnalyze = (e) => {
    e.preventDefault();
    if (url.trim()) {
      analyzeMutation.mutate(url);
    }
  };

  const brandAnalysis = business?.brand_dna;

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 sm:py-20">
        
        <p className="text-xs text-white/40 tracking-[0.15em] uppercase mb-12">Website analyzer</p>

        <div className="mb-16">
          <h1 className="text-4xl sm:text-5xl font-light mb-6 tracking-tight">
            Extract your brand voice
          </h1>
          <p className="text-base sm:text-lg text-white/40 max-w-2xl">
            Analyze your website to teach Sofia your brand's tone, values, and messaging.
          </p>
        </div>

        {/* Analyzer Form */}
        <form onSubmit={handleAnalyze} className="mb-16">
          <div className="flex flex-col sm:flex-row gap-3">
            <input
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://yoursalon.com"
              required
              className="flex-1 bg-transparent border border-white/[0.08] px-4 py-3 text-sm focus:outline-none focus:border-white/20 transition-colors"
            />
            <button
              type="submit"
              disabled={analyzeMutation.isPending}
              className="px-8 py-3 bg-white text-black hover:bg-white/90 transition-all text-sm tracking-wide disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
            >
              {analyzeMutation.isPending ? (
                <>
                  <Loader2 className="w-4 h-4 inline mr-2 animate-spin" />
                  Analyzing...
                </>
              ) : (
                'Analyze website'
              )}
            </button>
          </div>
        </form>

        {/* Error State */}
        {analyzeMutation.isError && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="border border-red-500/20 bg-red-500/5 p-6 mb-16"
          >
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
              <div>
                <h3 className="text-white/90 font-medium mb-1">Analysis failed</h3>
                <p className="text-sm text-white/60">
                  Could not analyze website. Please check the URL and try again.
                </p>
              </div>
            </div>
          </motion.div>
        )}

        {/* Success State */}
        {analyzeMutation.isSuccess && !brandAnalysis && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="border border-green-500/20 bg-green-500/5 p-6 mb-16"
          >
            <div className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
              <div>
                <h3 className="text-white/90 font-medium mb-1">Analysis complete</h3>
                <p className="text-sm text-white/60">
                  Your brand voice has been extracted successfully.
                </p>
              </div>
            </div>
          </motion.div>
        )}

        {/* Brand Analysis Results */}
        {brandAnalysis && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8"
          >
            <div className="border border-white/[0.08] p-6 sm:p-8">
              <div className="flex items-center gap-2 mb-6">
                <Sparkles className="w-5 h-5 text-white/60" />
                <h2 className="text-xl font-light">Brand DNA extracted</h2>
              </div>

              <div className="space-y-6">
                {brandAnalysis.voice && (
                  <div>
                    <h3 className="text-sm text-white/40 tracking-wide uppercase mb-2">Voice</h3>
                    <p className="text-base text-white/80">{brandAnalysis.voice}</p>
                  </div>
                )}

                {brandAnalysis.values?.length > 0 && (
                  <div>
                    <h3 className="text-sm text-white/40 tracking-wide uppercase mb-3">Values</h3>
                    <div className="flex flex-wrap gap-2">
                      {brandAnalysis.values.map((value, idx) => (
                        <span
                          key={idx}
                          className="px-3 py-1 text-sm bg-white/[0.03] border border-white/[0.08]"
                        >
                          {value}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {brandAnalysis.specialties?.length > 0 && (
                  <div>
                    <h3 className="text-sm text-white/40 tracking-wide uppercase mb-3">Specialties</h3>
                    <div className="flex flex-wrap gap-2">
                      {brandAnalysis.specialties.map((specialty, idx) => (
                        <span
                          key={idx}
                          className="px-3 py-1 text-sm bg-white/[0.03] border border-white/[0.08]"
                        >
                          {specialty}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {brandAnalysis.target_audience && (
                  <div>
                    <h3 className="text-sm text-white/40 tracking-wide uppercase mb-2">Target audience</h3>
                    <p className="text-base text-white/80">{brandAnalysis.target_audience}</p>
                  </div>
                )}

                {brandAnalysis.unique_selling_points?.length > 0 && (
                  <div>
                    <h3 className="text-sm text-white/40 tracking-wide uppercase mb-3">Unique selling points</h3>
                    <ul className="space-y-2">
                      {brandAnalysis.unique_selling_points.map((point, idx) => (
                        <li key={idx} className="text-sm text-white/60 flex items-start gap-2">
                          <span className="text-white/30 mt-1">•</span>
                          <span>{point}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>

            <div className="border border-white/[0.08] bg-white/[0.02] p-6">
              <p className="text-sm text-white/60">
                Sofia will now use this brand voice when communicating with clients, ensuring
                every interaction reflects your salon's unique personality and values.
              </p>
            </div>
          </motion.div>
        )}

        {/* Empty State */}
        {!brandAnalysis && !analyzeMutation.isPending && !analyzeMutation.isSuccess && (
          <div className="text-center py-16 border border-white/[0.08]">
            <Globe className="w-12 h-12 text-white/10 mx-auto mb-4" />
            <p className="text-white/40 text-sm">Analyze your website to get started</p>
          </div>
        )}

      </div>
    </div>
  );
}