import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus, Users, Send, BarChart3 } from "lucide-react";

export default function Campaigns() {
  const [view, setView] = useState("segments");
  const queryClient = useQueryClient();

  const { data: segments = [] } = useQuery({
    queryKey: ["segments"],
    queryFn: () => base44.entities.ClientSegment.list("-created_date")
  });

  const { data: campaigns = [] } = useQuery({
    queryKey: ["campaigns"],
    queryFn: () => base44.entities.BookingCampaign.list("-created_date")
  });

  const { data: dynamicSegments, isLoading: loadingSegments, refetch: analyzeSegments } = useQuery({
    queryKey: ["dynamicSegments"],
    queryFn: async () => {
      const res = await base44.functions.invoke('generateDynamicSegments', {});
      return res.data;
    },
    enabled: false
  });

  const createSegmentMutation = useMutation({
    mutationFn: (data) => base44.entities.ClientSegment.create(data),
    onSuccess: () => queryClient.invalidateQueries(["segments"])
  });

  const createCampaignMutation = useMutation({
    mutationFn: (data) => base44.entities.BookingCampaign.create(data),
    onSuccess: () => queryClient.invalidateQueries(["campaigns"])
  });

  const executeCampaignMutation = useMutation({
    mutationFn: (id) => base44.functions.invoke('executeCampaign', { campaign_id: id }),
    onSuccess: () => queryClient.invalidateQueries(["campaigns"])
  });

  const [showSegmentForm, setShowSegmentForm] = useState(false);
  const [showCampaignForm, setShowCampaignForm] = useState(false);

  const [segmentForm, setSegmentForm] = useState({
    segment_name: "",
    criteria: {
      days_since_last_visit_min: 30,
      loyalty_tier: "standard"
    }
  });

  const [campaignForm, setCampaignForm] = useState({
    campaign_name: "",
    segment_id: "",
    campaign_type: "retention",
    channel: "sms",
    message_template: "Generate a warm message inviting them back",
    offer_details: {}
  });

  const predictTimingMutation = useMutation({
    mutationFn: (data) => base44.functions.invoke('predictOptimalTiming', data),
  });

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-4xl mx-auto px-6 py-20">
        
        {/* View Toggle */}
        <div className="flex gap-8 mb-12 border-b border-white/[0.08]">
          <button
            onClick={() => setView("segments")}
            className={`pb-3 text-sm tracking-wide transition-colors ${
              view === "segments" ? "text-white border-b border-white" : "text-white/40"
            }`}
          >
            Segments
          </button>
          <button
            onClick={() => setView("campaigns")}
            className={`pb-3 text-sm tracking-wide transition-colors ${
              view === "campaigns" ? "text-white border-b border-white" : "text-white/40"
            }`}
          >
            Campaigns
          </button>
        </div>

        {/* Segments View */}
        {view === "segments" && (
          <div className="space-y-8">
            <div className="flex gap-6 mb-8">
              <button
                onClick={() => setShowSegmentForm(!showSegmentForm)}
                className="text-sm text-white/60 hover:text-white tracking-wide"
              >
                + New Segment
              </button>
              <button
                onClick={() => analyzeSegments()}
                className="text-sm text-white/60 hover:text-white tracking-wide"
              >
                AI Analyze
              </button>
            </div>

            {loadingSegments && (
              <div className="text-center py-8 text-xs text-white/40">
                Analyzing client segments with AI...
              </div>
            )}

            {dynamicSegments?.segments && (
              <div className="space-y-6 mb-12">
                <p className="text-xs text-white/40 tracking-wide uppercase mb-4">
                  AI Dynamic Segments ({dynamicSegments.total_clients} clients • ${Math.round(dynamicSegments.total_analyzed_ltv)} LTV)
                </p>
                {dynamicSegments.segments.map((seg, i) => (
                  <div key={i} className="border border-white/[0.08] p-6">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h4 className="text-sm mb-1">{seg.segment_name}</h4>
                        <p className="text-xs text-white/40">{seg.description}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm">{seg.client_count} clients</p>
                        <p className="text-xs text-white/40">${Math.round(seg.total_ltv)} LTV</p>
                      </div>
                    </div>

                    {seg.campaign_strategy && (
                      <div className="border-t border-white/[0.05] pt-4 mt-4 space-y-3">
                        <div className="grid grid-cols-2 gap-4 text-xs">
                          <div>
                            <p className="text-white/40 mb-1">Channel</p>
                            <p className="text-white/80">{seg.campaign_strategy.channel}</p>
                          </div>
                          <div>
                            <p className="text-white/40 mb-1">Timing</p>
                            <p className="text-white/80">{seg.campaign_strategy.timing}</p>
                          </div>
                          <div>
                            <p className="text-white/40 mb-1">Offer</p>
                            <p className="text-white/80">{seg.campaign_strategy.offer_type}</p>
                          </div>
                          <div>
                            <p className="text-white/40 mb-1">Churn Risk</p>
                            <p className="text-white/80">{seg.predicted_churn_risk}%</p>
                          </div>
                        </div>

                        <div className="bg-white/[0.02] p-3 border-l-2 border-white/20">
                          <p className="text-xs text-white/30 mb-2">Sample Message</p>
                          <p className="text-sm text-white/80 italic">"{seg.campaign_strategy.sample_message}"</p>
                        </div>

                        {seg.expected_outcomes && (
                          <div className="text-xs text-white/40">
                            <p>Est. conversion: {seg.expected_outcomes.estimated_conversion}%</p>
                            <p>Est. revenue: ${Math.round(seg.expected_outcomes.estimated_revenue)}</p>
                          </div>
                        )}
                      </div>
                    )}

                    <button
                      onClick={() => {
                        setSegmentForm({
                          segment_name: seg.segment_name,
                          criteria: seg.criteria,
                          estimated_size: seg.client_count
                        });
                        setShowSegmentForm(true);
                      }}
                      className="text-xs text-white/60 hover:text-white mt-4"
                    >
                      Save as segment
                    </button>
                  </div>
                ))}
              </div>
            )}

            {showSegmentForm && (
              <div className="border border-white/[0.08] p-6 space-y-4">
                <input
                  type="text"
                  placeholder="Segment name"
                  value={segmentForm.segment_name}
                  onChange={(e) => setSegmentForm({...segmentForm, segment_name: e.target.value})}
                  className="w-full bg-transparent border-b border-white/[0.08] pb-2 text-sm focus:outline-none"
                />
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs text-white/40 block mb-2">Min days since visit</label>
                    <input
                      type="number"
                      value={segmentForm.criteria.days_since_last_visit_min}
                      onChange={(e) => setSegmentForm({
                        ...segmentForm,
                        criteria: {...segmentForm.criteria, days_since_last_visit_min: parseInt(e.target.value)}
                      })}
                      className="w-full bg-transparent border-b border-white/[0.08] pb-2 text-sm focus:outline-none"
                    />
                  </div>
                  
                  <div>
                    <label className="text-xs text-white/40 block mb-2">Loyalty tier</label>
                    <select
                      value={segmentForm.criteria.loyalty_tier}
                      onChange={(e) => setSegmentForm({
                        ...segmentForm,
                        criteria: {...segmentForm.criteria, loyalty_tier: e.target.value}
                      })}
                      className="w-full bg-black border-b border-white/[0.08] pb-2 text-sm focus:outline-none"
                    >
                      <option value="standard">Standard</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                      <option value="vip">VIP</option>
                    </select>
                  </div>
                </div>

                <button
                  onClick={() => {
                    createSegmentMutation.mutate(segmentForm);
                    setShowSegmentForm(false);
                  }}
                  className="text-sm text-white/60 hover:text-white tracking-wide"
                >
                  Create
                </button>
              </div>
            )}

            {segments.map(seg => (
              <div key={seg.id} className="border-b border-white/[0.08] pb-6">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm tracking-wide">{seg.segment_name}</h3>
                  <span className="text-xs text-white/40">{seg.estimated_size || 0} clients</span>
                </div>
                <p className="text-xs text-white/40">
                  {seg.criteria.loyalty_tier} tier, {seg.criteria.days_since_last_visit_min}+ days since visit
                </p>
              </div>
            ))}
          </div>
        )}

        {/* Campaigns View */}
        {view === "campaigns" && (
          <div className="space-y-8">
            <button
              onClick={() => setShowCampaignForm(!showCampaignForm)}
              className="text-sm text-white/60 hover:text-white tracking-wide"
            >
              + New Campaign
            </button>

            {showCampaignForm && (
              <div className="border border-white/[0.08] p-6 space-y-4">
                <input
                  type="text"
                  placeholder="Campaign name"
                  value={campaignForm.campaign_name}
                  onChange={(e) => setCampaignForm({...campaignForm, campaign_name: e.target.value})}
                  className="w-full bg-transparent border-b border-white/[0.08] pb-2 text-sm focus:outline-none"
                />

                <select
                  value={campaignForm.segment_id}
                  onChange={(e) => {
                    setCampaignForm({...campaignForm, segment_id: e.target.value});
                    const segment = segments.find(s => s.id === e.target.value);
                    if (segment) {
                      predictTimingMutation.mutate({
                        segment_criteria: segment.criteria,
                        campaign_type: campaignForm.campaign_type
                      });
                    }
                  }}
                  className="w-full bg-black border-b border-white/[0.08] pb-2 text-sm focus:outline-none"
                >
                  <option value="">Select segment</option>
                  {segments.map(seg => (
                    <option key={seg.id} value={seg.id}>{seg.segment_name}</option>
                  ))}
                </select>

                <select
                  value={campaignForm.campaign_type}
                  onChange={(e) => setCampaignForm({...campaignForm, campaign_type: e.target.value})}
                  className="w-full bg-black border-b border-white/[0.08] pb-2 text-sm focus:outline-none"
                >
                  <option value="retention">Retention</option>
                  <option value="special_offer">Special Offer</option>
                  <option value="new_service">New Service</option>
                  <option value="seasonal">Seasonal</option>
                </select>

                {predictTimingMutation.data?.success && (
                  <div className="bg-white/[0.03] p-4 text-xs space-y-2">
                    <p className="text-white/40 tracking-wide uppercase">AI Recommendation</p>
                    <p className="text-white/80">Send on: {predictTimingMutation.data.prediction.next_send_friendly}</p>
                    <p className="text-white/80">Channel: {predictTimingMutation.data.prediction.recommended_channel}</p>
                    <p className="text-white/60">{predictTimingMutation.data.prediction.timing_rationale}</p>
                  </div>
                )}

                <textarea
                  placeholder="AI message instructions"
                  value={campaignForm.message_template}
                  onChange={(e) => setCampaignForm({...campaignForm, message_template: e.target.value})}
                  className="w-full bg-transparent border border-white/[0.08] p-3 text-sm focus:outline-none h-24"
                />

                <button
                  onClick={() => {
                    createCampaignMutation.mutate({
                      ...campaignForm,
                      scheduled_date: predictTimingMutation.data?.prediction.next_send_time
                    });
                    setShowCampaignForm(false);
                  }}
                  className="text-sm text-white/60 hover:text-white tracking-wide"
                >
                  Create
                </button>
              </div>
            )}

            {campaigns.map(camp => (
              <div key={camp.id} className="border-b border-white/[0.08] pb-6">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm tracking-wide">{camp.campaign_name}</h3>
                  <span className="text-xs text-white/40">{camp.status}</span>
                </div>
                <p className="text-xs text-white/40 mb-3">{camp.campaign_type}</p>
                
                {camp.status === 'draft' && (
                  <button
                    onClick={() => executeCampaignMutation.mutate(camp.id)}
                    disabled={executeCampaignMutation.isLoading}
                    className="text-xs text-white/60 hover:text-white tracking-wide"
                  >
                    {executeCampaignMutation.isLoading ? 'Launching...' : 'Launch'}
                  </button>
                )}

                {camp.status === 'active' && (
                  <div className="text-xs text-white/40 space-y-1">
                    <p>Sent: {camp.sent_count || 0}</p>
                    <p>Responses: {camp.response_count || 0}</p>
                    <p>Bookings: {camp.booking_count || 0}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}