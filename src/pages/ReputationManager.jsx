import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

export default function ReputationManager() {
  const [expandedReview, setExpandedReview] = useState(null);
  const [editingResponse, setEditingResponse] = useState(null);
  const [draftResponse, setDraftResponse] = useState("");
  const queryClient = useQueryClient();

  const { data: events = [], isLoading } = useQuery({
    queryKey: ['reputationEvents'],
    queryFn: () => base44.entities.ReputationEvent.list('-created_date')
  });

  const { data: trends, isLoading: trendsLoading } = useQuery({
    queryKey: ['reviewTrends'],
    queryFn: async () => {
      const res = await base44.functions.invoke('analyzeReviewTrends', {});
      return res.data;
    },
    enabled: events.length > 0
  });

  const analyzeReview = useMutation({
    mutationFn: async (review) => {
      const res = await base44.functions.invoke('analyzeReview', {
        review_text: review.review_text,
        rating: review.rating,
        reviewer_name: review.reviewer_name,
        platform: review.platform
      });
      return { reviewId: review.id, ...res.data };
    },
    onSuccess: (data) => {
      setExpandedReview(data.reviewId);
      setDraftResponse(data.draft_response);
    }
  });

  const updateReview = useMutation({
    mutationFn: async ({ id, data }) => {
      return base44.entities.ReputationEvent.update(id, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['reputationEvents']);
      setEditingResponse(null);
      setExpandedReview(null);
    }
  });

  const handleAnalyze = (review) => {
    analyzeReview.mutate(review);
  };

  const handleSendResponse = (reviewId) => {
    updateReview.mutate({
      id: reviewId,
      data: {
        thank_you_message: draftResponse,
        thank_you_sent: true,
        status: 'responded'
      }
    });
  };

  if (isLoading) {
    return <div className="min-h-screen bg-black" />;
  }

  const needsAttention = events.filter(e => e.requires_attention && e.status !== 'responded');

  return (
    <div className="min-h-screen bg-black text-white px-6 py-20">
      <div className="max-w-3xl mx-auto">

        <p className="text-xs text-white/40 tracking-[0.15em] uppercase mb-12">Reputation</p>

        {/* Trends Analysis */}
        {trends?.success && (
          <div className="mb-16">
            <p className="text-xs text-white/30 tracking-[0.15em] uppercase mb-6">Insights</p>
            
            {trends.analysis.top_strengths?.length > 0 && (
              <div className="mb-8">
                <p className="text-sm text-white/60 mb-4">Strengths</p>
                <div className="space-y-3">
                  {trends.analysis.top_strengths.map((strength, i) => (
                    <div key={i} className="border-b border-white/[0.05] pb-3">
                      <p className="text-sm text-white/80">{strength.theme}</p>
                      <p className="text-xs text-white/40 mt-1">{strength.frequency}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {trends.analysis.priority_actions?.length > 0 && (
              <div className="mb-8">
                <p className="text-sm text-white/60 mb-4">Priority actions</p>
                <div className="space-y-3">
                  {trends.analysis.priority_actions.map((action, i) => (
                    <div key={i} className="border-b border-white/[0.05] pb-3">
                      <p className="text-sm text-white/80">{action.action}</p>
                      <p className="text-xs text-white/40 mt-1">{action.reason}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Reviews */}
        {needsAttention.length > 0 && (
          <div>
            <p className="text-xs text-white/30 tracking-[0.15em] uppercase mb-6">Needs attention</p>
            <div className="space-y-4">
              {needsAttention.map(event => (
                <div key={event.id} className="border border-white/[0.08] p-6">
                  <div className="flex justify-between mb-4">
                    <div>
                      <p className="text-sm mb-1">{event.reviewer_name}</p>
                      <p className="text-xs text-white/40">{event.platform} • {event.rating}★</p>
                    </div>
                    <span className="text-xs text-white/30">{event.sentiment}</span>
                  </div>
                  
                  <p className="text-sm text-white/60 mb-4">{event.review_text}</p>

                  {expandedReview === event.id && analyzeReview.data ? (
                    <div className="space-y-4 mt-6 border-t border-white/[0.08] pt-6">
                      {/* AI Analysis */}
                      {analyzeReview.data.themes?.length > 0 && (
                        <div>
                          <p className="text-xs text-white/30 mb-2">Themes</p>
                          <p className="text-xs text-white/60">{analyzeReview.data.themes.join(', ')}</p>
                        </div>
                      )}

                      {/* Draft Response */}
                      <div>
                        <p className="text-xs text-white/30 mb-3">AI-drafted response</p>
                        {editingResponse === event.id ? (
                          <textarea
                            value={draftResponse}
                            onChange={(e) => setDraftResponse(e.target.value)}
                            className="w-full bg-transparent border border-white/[0.08] p-3 text-sm focus:outline-none h-32"
                          />
                        ) : (
                          <p className="text-sm text-white/80 mb-3">{draftResponse}</p>
                        )}
                        
                        <div className="flex gap-2">
                          {editingResponse === event.id ? (
                            <>
                              <button
                                onClick={() => handleSendResponse(event.id)}
                                className="text-xs text-white/60 hover:text-white px-3 py-2 border border-white/[0.08]"
                              >
                                Send
                              </button>
                              <button
                                onClick={() => setEditingResponse(null)}
                                className="text-xs text-white/40 hover:text-white/60 px-3 py-2"
                              >
                                Cancel
                              </button>
                            </>
                          ) : (
                            <button
                              onClick={() => setEditingResponse(event.id)}
                              className="text-xs text-white/60 hover:text-white"
                            >
                              Edit response
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <button
                      onClick={() => handleAnalyze(event)}
                      disabled={analyzeReview.isPending}
                      className="text-xs text-white/40 hover:text-white/70 transition-colors"
                    >
                      {analyzeReview.isPending ? 'Analyzing...' : 'Analyze & draft response'}
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {events.length === 0 && (
          <p className="text-sm text-white/40 text-center py-12">No reviews</p>
        )}

      </div>
    </div>
  );
}