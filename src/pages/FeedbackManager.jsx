import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Sparkles, TrendingUp, AlertCircle, CheckCircle2, MessageSquare } from "lucide-react";

export default function FeedbackManager() {
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [simulatedResponse, setSimulatedResponse] = useState("");
  const queryClient = useQueryClient();

  const { data: reviewRequests = [], isLoading } = useQuery({
    queryKey: ['reviewRequests'],
    queryFn: () => base44.entities.ReviewRequest.list('-sent_date')
  });

  const triggerFeedbackMutation = useMutation({
    mutationFn: () => base44.functions.invoke('triggerPostAppointmentFeedback', {}),
    onSuccess: () => {
      queryClient.invalidateQueries(['reviewRequests']);
    }
  });

  const processFeedbackMutation = useMutation({
    mutationFn: (data) => base44.functions.invoke('processFeedbackResponse', data),
    onSuccess: () => {
      queryClient.invalidateQueries(['reviewRequests']);
      setSelectedRequest(null);
      setSimulatedResponse("");
    }
  });

  const handleSimulateResponse = () => {
    if (!selectedRequest || !simulatedResponse) return;

    processFeedbackMutation.mutate({
      review_request_id: selectedRequest.id,
      client_response: simulatedResponse,
      client_name: selectedRequest.client_name,
      client_phone: selectedRequest.client_phone,
      client_email: selectedRequest.client_email
    });
  };

  const pendingRequests = reviewRequests.filter(r => r.status === 'sent');
  const completedRequests = reviewRequests.filter(r => r.status === 'completed');

  const stats = {
    total: reviewRequests.length,
    pending: pendingRequests.length,
    positive: completedRequests.filter(r => r.feedback_text?.length > 0).length,
    responseRate: reviewRequests.length > 0 
      ? Math.round((completedRequests.length / reviewRequests.length) * 100) 
      : 0
  };

  if (isLoading) {
    return <div className="min-h-screen bg-black" />;
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 sm:py-20">

        <p className="text-xs text-white/40 tracking-[0.15em] uppercase mb-12">Feedback</p>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6 mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <p className="text-2xl font-light mb-2">{stats.total}</p>
            <p className="text-xs text-white/40">Total requests</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
          >
            <p className="text-2xl font-light mb-2">{stats.pending}</p>
            <p className="text-xs text-white/40">Pending</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
          >
            <p className="text-2xl font-light mb-2">{stats.responseRate}%</p>
            <p className="text-xs text-white/40">Response rate</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.3 }}
          >
            <p className="text-2xl font-light mb-2">{stats.positive}</p>
            <p className="text-xs text-white/40">Responses</p>
          </motion.div>
        </div>

        {/* Actions */}
        <div className="mb-16">
          <button
            onClick={() => triggerFeedbackMutation.mutate()}
            disabled={triggerFeedbackMutation.isPending}
            className="border border-white/[0.08] px-6 py-3 hover:border-white/20 transition-colors text-sm tracking-wide"
          >
            {triggerFeedbackMutation.isPending ? 'Processing...' : 'Check for new feedback'}
          </button>
        </div>

        {/* Pending Feedback */}
        {pendingRequests.length > 0 && (
          <div className="mb-16">
            <p className="text-xs text-white/30 tracking-[0.15em] uppercase mb-8">
              Awaiting response
            </p>
            <div className="space-y-4">
              {pendingRequests.map((request, index) => (
                <motion.div
                  key={request.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="border border-white/[0.08] p-6"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <p className="text-sm mb-2">{request.client_name}</p>
                      <p className="text-xs text-white/40">
                        {new Date(request.sent_date).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric'
                        })}
                      </p>
                    </div>
                    <span className="text-xs text-white/40">
                      {request.satisfaction_level}
                    </span>
                  </div>

                  {/* Test response simulator */}
                  {selectedRequest?.id === request.id && (
                    <div className="mt-4 space-y-3">
                      <textarea
                        value={simulatedResponse}
                        onChange={(e) => setSimulatedResponse(e.target.value)}
                        placeholder="Simulate client response..."
                        className="w-full bg-transparent border border-white/[0.08] p-3 text-sm focus:outline-none focus:border-white/20 min-h-[80px]"
                      />
                      <div className="flex gap-2">
                        <button
                          onClick={handleSimulateResponse}
                          disabled={processFeedbackMutation.isPending || !simulatedResponse}
                          className="border border-white/[0.08] px-4 py-2 hover:bg-white/5 transition-colors text-xs"
                        >
                          Process
                        </button>
                        <button
                          onClick={() => {
                            setSelectedRequest(null);
                            setSimulatedResponse("");
                          }}
                          className="text-xs text-white/40 hover:text-white/60"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  )}

                  {!selectedRequest && (
                    <button
                      onClick={() => setSelectedRequest(request)}
                      className="text-xs text-white/40 hover:text-white/60 mt-2"
                    >
                      Test response
                    </button>
                  )}
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* Completed Feedback */}
        {completedRequests.length > 0 && (
          <div>
            <p className="text-xs text-white/30 tracking-[0.15em] uppercase mb-8">
              Recent feedback
            </p>
            <div className="space-y-4">
              {completedRequests.slice(0, 10).map((request, index) => (
                <motion.div
                  key={request.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="border-b border-white/[0.05] pb-4"
                >
                  <div className="flex justify-between items-start mb-2">
                    <p className="text-sm">{request.client_name}</p>
                    <span className="text-xs text-white/40">
                      {new Date(request.response_date).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric'
                      })}
                    </span>
                  </div>
                  {request.feedback_text && (
                    <p className="text-xs text-white/60 italic">
                      "{request.feedback_text}"
                    </p>
                  )}
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {reviewRequests.length === 0 && (
          <p className="text-sm text-white/40 text-center py-12">
            No feedback requests yet
          </p>
        )}

      </div>
    </div>
  );
}