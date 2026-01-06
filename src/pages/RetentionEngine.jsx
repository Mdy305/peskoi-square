import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";

export default function RetentionEngine() {
  const [editingCampaign, setEditingCampaign] = useState(null);
  const [editedMessage, setEditedMessage] = useState("");
  const queryClient = useQueryClient();

  // Fetch at-risk clients
  const { data: analyses = [], isLoading } = useQuery({
    queryKey: ['retentionAnalyses'],
    queryFn: () => base44.entities.ClientRetentionAnalysis.filter({
      risk_level: { $in: ['high', 'critical'] }
    }, '-churn_risk_score')
  });

  // Fetch pending campaigns
  const { data: campaigns = [] } = useQuery({
    queryKey: ['retentionCampaigns'],
    queryFn: () => base44.entities.BookingCampaign.filter({
      campaign_type: 'retention',
      status: 'draft'
    })
  });

  const generateCampaignsMutation = useMutation({
    mutationFn: () => base44.functions.invoke('generateRetentionCampaigns', {}),
    onSuccess: () => {
      queryClient.invalidateQueries(['retentionCampaigns']);
      queryClient.invalidateQueries(['retentionAnalyses']);
    }
  });

  const approveCampaignMutation = useMutation({
    mutationFn: ({ campaign_id, action, edited_message }) => 
      base44.functions.invoke('approveCampaign', { campaign_id, action, edited_message }),
    onSuccess: () => {
      queryClient.invalidateQueries(['retentionCampaigns']);
      setEditingCampaign(null);
      setEditedMessage("");
    }
  });

  const analyzeChurnMutation = useMutation({
    mutationFn: () => base44.functions.invoke('analyzeChurnRisk', {}),
    onSuccess: () => {
      queryClient.invalidateQueries(['retentionAnalyses']);
    }
  });

  const executeAllMutation = useMutation({
    mutationFn: () => base44.functions.invoke('executeRetentionCampaigns', {}),
    onSuccess: () => {
      queryClient.invalidateQueries(['retentionCampaigns']);
      queryClient.invalidateQueries(['retentionAnalyses']);
    }
  });

  // Fetch last scheduler run
  const { data: lastRun } = useQuery({
    queryKey: ['schedulerStatus'],
    queryFn: async () => {
      const logs = await base44.entities.ConversationInsight.filter({
        feature_used: 'daily_retention_scheduler'
      }, '-logged_at', 1);
      return logs[0] || null;
    }
  });

  const atRiskClients = analyses.filter(a => !a.campaign_triggered);

  if (isLoading) {
    return <div className="min-h-screen bg-black" />;
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 sm:py-20">

        <p className="text-xs text-white/40 tracking-[0.15em] uppercase mb-12">Retention</p>

        {/* Scheduler Status */}
        {lastRun && (
          <div className="mb-12 border border-white/[0.08] p-6">
            <p className="text-xs text-white/30 tracking-[0.15em] uppercase mb-4">Automation status</p>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-white/40">Last run</span>
                <span className="text-white/60">
                  {new Date(lastRun.logged_at).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    hour: 'numeric',
                    minute: '2-digit'
                  })}
                </span>
              </div>
              {lastRun.ai_recommendation && (() => {
                try {
                  const log = JSON.parse(lastRun.ai_recommendation);
                  return (
                    <>
                      <div className="flex justify-between">
                        <span className="text-white/40">Campaigns sent</span>
                        <span className="text-white/60">{log.campaigns_sent || 0}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-white/40">Outcomes tracked</span>
                        <span className="text-white/60">{log.outcomes_tracked || 0}</span>
                      </div>
                    </>
                  );
                } catch {
                  return null;
                }
              })()}
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 mb-16">
          <button
            onClick={() => analyzeChurnMutation.mutate()}
            disabled={analyzeChurnMutation.isPending}
            className="border border-white/[0.08] px-6 py-3 hover:border-white/20 transition-colors text-sm tracking-wide"
          >
            {analyzeChurnMutation.isPending ? 'Analyzing...' : 'Analyze risk'}
          </button>
          
          {atRiskClients.length > 0 && (
            <button
              onClick={() => generateCampaignsMutation.mutate()}
              disabled={generateCampaignsMutation.isPending}
              className="border border-white/[0.08] px-6 py-3 hover:border-white/20 transition-colors text-sm tracking-wide"
            >
              {generateCampaignsMutation.isPending ? 'Generating...' : 'Generate campaigns'}
            </button>
          )}

          {campaigns.length > 0 && (
            <button
              onClick={() => executeAllMutation.mutate()}
              disabled={executeAllMutation.isPending}
              className="border border-white/[0.08] px-6 py-3 hover:bg-white/5 transition-colors text-sm tracking-wide"
            >
              {executeAllMutation.isPending ? 'Sending...' : 'Execute all'}
            </button>
          )}
        </div>

        {/* Pending Campaigns (Approval Queue) */}
        {campaigns.length > 0 && (
          <div className="mb-16">
            <p className="text-xs text-white/30 tracking-[0.15em] uppercase mb-8">Pending approval</p>
            <div className="space-y-6">
              {campaigns.map((campaign) => (
                <motion.div
                  key={campaign.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="border border-white/[0.08] p-6 sm:p-8"
                >
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-6">
                    <div className="flex-1">
                      <p className="text-sm text-white/80 mb-2">{campaign.campaign_name}</p>
                      <div className="flex flex-wrap gap-3 text-xs text-white/40">
                        <span>{campaign.channel}</span>
                        {campaign.scheduled_date && (
                          <span>
                            {new Date(campaign.scheduled_date).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                              hour: 'numeric',
                              minute: '2-digit'
                            })}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Message Preview */}
                  {editingCampaign === campaign.id ? (
                    <textarea
                      value={editedMessage}
                      onChange={(e) => setEditedMessage(e.target.value)}
                      className="w-full bg-transparent border border-white/[0.08] p-4 text-sm focus:outline-none focus:border-white/20 mb-4 min-h-[100px]"
                    />
                  ) : (
                    <div className="bg-white/[0.03] p-4 mb-6 border-l-2 border-white/[0.08]">
                      <p className="text-sm text-white/80 leading-relaxed whitespace-pre-wrap">
                        {campaign.message_template}
                      </p>
                    </div>
                  )}

                  {/* Context */}
                  {campaign.offer_details?.strategy && (
                    <div className="text-xs text-white/40 mb-6 space-y-1">
                      <p>Strategy: {campaign.offer_details.strategy}</p>
                      {campaign.offer_details?.timing_rationale && (
                        <p>Timing: {campaign.offer_details.timing_rationale}</p>
                      )}
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex flex-wrap gap-3">
                    {editingCampaign === campaign.id ? (
                      <>
                        <button
                          onClick={() => {
                            approveCampaignMutation.mutate({
                              campaign_id: campaign.id,
                              action: 'approve',
                              edited_message: editedMessage
                            });
                          }}
                          disabled={approveCampaignMutation.isPending}
                          className="border border-white/[0.08] px-6 py-2 hover:bg-white/5 transition-colors text-xs tracking-wide"
                        >
                          Save & approve
                        </button>
                        <button
                          onClick={() => {
                            setEditingCampaign(null);
                            setEditedMessage("");
                          }}
                          className="text-xs text-white/40 hover:text-white/60"
                        >
                          Cancel
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          onClick={() => {
                            approveCampaignMutation.mutate({
                              campaign_id: campaign.id,
                              action: 'approve'
                            });
                          }}
                          disabled={approveCampaignMutation.isPending}
                          className="border border-white/[0.08] px-6 py-2 hover:bg-white/5 transition-colors text-xs tracking-wide"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => {
                            setEditingCampaign(campaign.id);
                            setEditedMessage(campaign.message_template);
                          }}
                          className="text-xs text-white/40 hover:text-white/60"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => {
                            approveCampaignMutation.mutate({
                              campaign_id: campaign.id,
                              action: 'reject'
                            });
                          }}
                          disabled={approveCampaignMutation.isPending}
                          className="text-xs text-white/40 hover:text-white/60"
                        >
                          Reject
                        </button>
                      </>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* At-Risk Clients */}
        {atRiskClients.length > 0 && (
          <div>
            <p className="text-xs text-white/30 tracking-[0.15em] uppercase mb-8">At risk</p>
            <div className="space-y-4">
              {atRiskClients.map((client) => (
                <div key={client.id} className="border-b border-white/[0.05] pb-4">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-2">
                    <p className="text-sm text-white/80">{client.client_name}</p>
                    <span className="text-xs text-white/40">{client.risk_level}</span>
                  </div>
                  <p className="text-xs text-white/40 mb-2">
                    {client.days_since_last_visit} days since last visit
                  </p>
                  <p className="text-xs text-white/60">{client.recommended_action}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {atRiskClients.length === 0 && campaigns.length === 0 && (
          <p className="text-sm text-white/40 text-center py-12">No retention campaigns</p>
        )}

      </div>
    </div>
  );
}