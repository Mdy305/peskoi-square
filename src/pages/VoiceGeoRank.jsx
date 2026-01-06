import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function VoiceGeoRank() {
  const [websiteUrl, setWebsiteUrl] = useState("");
  const [analyzing, setAnalyzing] = useState(false);
  const queryClient = useQueryClient();

  const { data: identity } = useQuery({
    queryKey: ['businessIdentity'],
    queryFn: async () => {
      const res = await base44.entities.BusinessIdentityProfile.list('-last_verified');
      return res[0] || null;
    }
  });

  const { data: ranking } = useQuery({
    queryKey: ['voiceGeoRank'],
    queryFn: async () => {
      const res = await base44.functions.invoke('autoRankVoiceGeo', {});
      return res.data;
    },
    enabled: !!identity,
    refetchOnWindowFocus: false
  });

  const analyzeWebsite = useMutation({
    mutationFn: async (url) => {
      const res = await base44.functions.invoke('analyzeSalonWebsite', { url });
      return res.data;
    },
    onSuccess: (data) => {
      if (data?.brand_voice) {
        // Save brand DNA to business
        base44.functions.invoke('saveBrandAnalysis', { brand_data: data });
      }
      queryClient.invalidateQueries(['businessIdentity']);
      queryClient.invalidateQueries(['voiceGeoRank']);
      setAnalyzing(false);
    }
  });

  const handleAnalyze = () => {
    if (!websiteUrl) return;
    setAnalyzing(true);
    analyzeWebsite.mutate(websiteUrl);
  };

  const refreshRanking = useMutation({
    mutationFn: () => base44.functions.invoke('autoRankVoiceGeo', {}),
    onSuccess: () => {
      queryClient.invalidateQueries(['voiceGeoRank']);
    }
  });

  return (
    <div className="min-h-screen bg-black text-white px-6 py-20">
      <div className="max-w-3xl mx-auto">

        {/* Website Analysis */}
        <div className="mb-16">
          <p className="text-xs text-white/40 tracking-[0.15em] uppercase mb-8">Website Analysis</p>
          
          <div className="flex gap-3 mb-6">
            <Input
              value={websiteUrl}
              onChange={(e) => setWebsiteUrl(e.target.value)}
              placeholder="https://yoursalon.com"
              className="bg-transparent border-b border-white/[0.08] rounded-none text-sm focus:border-white/20"
            />
            <button
              onClick={handleAnalyze}
              disabled={analyzing || !websiteUrl}
              className="text-xs tracking-wide text-white/60 hover:text-white transition-colors disabled:opacity-30"
            >
              {analyzing ? 'Analyzing...' : 'Analyze'}
            </button>
          </div>

          {identity && (
            <div className="border-t border-white/[0.05] pt-6 space-y-4">
              <div>
                <p className="text-xs text-white/40 mb-1">Brand voice</p>
                <p className="text-sm text-white/80">{identity.natural_description}</p>
              </div>
              
              {identity.pronunciation_guide && (
                <div>
                  <p className="text-xs text-white/40 mb-1">Pronunciation</p>
                  <p className="text-sm text-white/60">{identity.pronunciation_guide}</p>
                </div>
              )}

              {identity.location_landmarks?.length > 0 && (
                <div>
                  <p className="text-xs text-white/40 mb-1">Landmarks</p>
                  <p className="text-sm text-white/60">{identity.location_landmarks.join(', ')}</p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Voice & Geo Ranking */}
        {ranking && (
          <div className="space-y-12">
            <div className="flex items-center justify-between">
              <p className="text-xs text-white/40 tracking-[0.15em] uppercase">Voice & Local Rank</p>
              <button
                onClick={() => refreshRanking.mutate()}
                disabled={refreshRanking.isPending}
                className="text-xs tracking-wide text-white/40 hover:text-white/70 transition-colors"
              >
                {refreshRanking.isPending ? 'Updating...' : 'Refresh'}
              </button>
            </div>

            {/* Scores */}
            <div className="grid grid-cols-3 gap-8">
              <div>
                <p className="text-3xl font-light mb-2">{ranking.readiness_analysis?.overall_score || 0}</p>
                <p className="text-xs text-white/40">Overall</p>
              </div>
              <div>
                <p className="text-3xl font-light mb-2">{ranking.readiness_analysis?.voice_search_score || 0}</p>
                <p className="text-xs text-white/40">Voice</p>
              </div>
              <div>
                <p className="text-3xl font-light mb-2">{ranking.readiness_analysis?.local_seo_score || 0}</p>
                <p className="text-xs text-white/40">Local</p>
              </div>
            </div>

            {/* Strengths */}
            {ranking.readiness_analysis?.strengths?.length > 0 && (
              <div>
                <p className="text-xs text-white/30 tracking-[0.15em] uppercase mb-4">Strengths</p>
                <div className="space-y-2">
                  {ranking.readiness_analysis.strengths.map((s, i) => (
                    <p key={i} className="text-sm text-white/60">· {s}</p>
                  ))}
                </div>
              </div>
            )}

            {/* Actions */}
            {ranking.readiness_analysis?.priority_actions?.length > 0 && (
              <div>
                <p className="text-xs text-white/30 tracking-[0.15em] uppercase mb-4">Priority actions</p>
                <div className="space-y-3">
                  {ranking.readiness_analysis.priority_actions.map((action, i) => (
                    <div key={i} className="border-b border-white/[0.05] pb-3">
                      <p className="text-sm text-white/80 mb-1">{action.action}</p>
                      <div className="flex gap-3 text-xs text-white/40">
                        <span>Impact: {action.impact}</span>
                        <span>Urgency: {action.urgency}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Profile Summary */}
            {ranking.voice_profile && (
              <div className="border-t border-white/[0.08] pt-8">
                <p className="text-xs text-white/30 tracking-[0.15em] uppercase mb-4">Voice profile</p>
                <div className="space-y-3 text-xs">
                  {ranking.voice_profile.verified_platforms?.length > 0 && (
                    <div>
                      <span className="text-white/40">Verified: </span>
                      <span className="text-white/60">{ranking.voice_profile.verified_platforms.join(', ')}</span>
                    </div>
                  )}
                  {ranking.voice_profile.top_services?.length > 0 && (
                    <div>
                      <span className="text-white/40">Top services: </span>
                      <span className="text-white/60">{ranking.voice_profile.top_services.join(', ')}</span>
                    </div>
                  )}
                  {ranking.voice_profile.local_keywords?.length > 0 && (
                    <div>
                      <span className="text-white/40">Local keywords: </span>
                      <span className="text-white/60">{ranking.voice_profile.local_keywords.join(', ')}</span>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
}