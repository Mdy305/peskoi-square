import React, { useMemo, useState } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Target,
  TrendingUp,
  Send,
  Clock,
  CheckCircle2,
  XCircle,
  Loader2,
  Sparkles,
  AlertCircle,
  MessageSquare,
  Phone
} from "lucide-react";
import { motion } from "framer-motion";
import { format, parseISO } from "date-fns";

export default function ProactiveOutreach() {
  const queryClient = useQueryClient();
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const { data: outreachAttempts = [], isLoading } = useQuery({
    queryKey: ["outreachAttempts"],
    queryFn: () => base44.entities.OutreachAttempt.list("-created_date"),
  });

  const { data: opportunities = [], isLoading: loadingOpps } = useQuery({
    queryKey: ["outreachOpportunities"],
    queryFn: async () => {
      const response = await base44.functions.invoke("identifyOutreachOpportunities", {});
      return response.data?.opportunities || [];
    },
  });

  const sendOutreachMutation = useMutation({
    mutationFn: (data) => base44.functions.invoke("sendOutreachMessage", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["outreachAttempts"] });
      queryClient.invalidateQueries({ queryKey: ["outreachOpportunities"] });
    },
  });

  const stats = useMemo(() => {
    const total = outreachAttempts.length;
    const responded = outreachAttempts.filter(o => o.response_status === "responded" || o.response_status === "booked").length;
    const booked = outreachAttempts.filter(o => o.response_status === "booked").length;
    const ignored = outreachAttempts.filter(o => o.response_status === "ignored").length;
    const responseRate = total > 0 ? Math.round((responded / total) * 100) : 0;
    const conversionRate = total > 0 ? Math.round((booked / total) * 100) : 0;
    const totalRevenue = outreachAttempts
      .filter(o => o.conversion_value)
      .reduce((sum, o) => sum + o.conversion_value, 0);

    return { total, responded, booked, ignored, responseRate, conversionRate, totalRevenue };
  }, [outreachAttempts]);

  const handleSendOutreach = async (opportunity) => {
    await sendOutreachMutation.mutateAsync(opportunity);
  };

  const triggerReasons = {
    overdue_rebook: { label: "Overdue Rebook", color: "bg-yellow-500/20 text-yellow-300" },
    vip_inactive: { label: "VIP Inactive", color: "bg-red-500/20 text-red-300" },
    seasonal_service: { label: "Seasonal", color: "bg-blue-500/20 text-blue-300" },
    unexpected_availability: { label: "Availability Opened", color: "bg-green-500/20 text-green-300" },
    intent_no_book: { label: "Intent No Book", color: "bg-orange-500/20 text-orange-300" },
    repeatable_service: { label: "Repeatable Service", color: "bg-purple-500/20 text-purple-300" },
    vip_touch: { label: "VIP Touch", color: "bg-pink-500/20 text-pink-300" },
  };

  const channelIcons = {
    sms: MessageSquare,
    whatsapp: MessageSquare,
    voice: Phone,
    email: MessageSquare,
    instagram: MessageSquare,
  };

  const statusColors = {
    pending: "bg-yellow-500/20 text-yellow-300 border-yellow-500/30",
    responded: "bg-blue-500/20 text-blue-300 border-blue-500/30",
    booked: "bg-green-500/20 text-green-300 border-green-500/30",
    declined: "bg-gray-500/20 text-gray-300 border-gray-500/30",
    ignored: "bg-red-500/20 text-red-300 border-red-500/30",
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="mb-12">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 mb-4 px-4 py-2 rounded-full bg-[#84CC16]/10 border border-[#84CC16]/20"
          >
            <Sparkles className="w-4 h-4 text-[#84CC16]" />
            <span className="text-sm font-medium text-[#84CC16]">Autonomous Revenue Engine</span>
          </motion.div>
          <h1 className="text-5xl font-bold mb-4 tracking-tight">
            Proactive Outreach Intelligence
          </h1>
          <p className="text-gray-400 text-lg">
            Precision-driven client engagement that converts before they ask
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-[#141414] border-[#1f1f1f]">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-2">
                <p className="text-gray-400 text-sm">Conversion Rate</p>
                <Target className="w-5 h-5 text-[#84CC16]" />
              </div>
              <p className="text-3xl font-bold text-white">{stats.conversionRate}%</p>
              <p className="text-gray-500 text-xs mt-1">{stats.booked} of {stats.total} booked</p>
            </CardContent>
          </Card>

          <Card className="bg-[#141414] border-[#1f1f1f]">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-2">
                <p className="text-gray-400 text-sm">Response Rate</p>
                <CheckCircle2 className="w-5 h-5 text-blue-500" />
              </div>
              <p className="text-3xl font-bold text-white">{stats.responseRate}%</p>
              <p className="text-gray-500 text-xs mt-1">{stats.responded} responded</p>
            </CardContent>
          </Card>

          <Card className="bg-[#141414] border-[#1f1f1f]">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-2">
                <p className="text-gray-400 text-sm">Generated Revenue</p>
                <TrendingUp className="w-5 h-5 text-green-500" />
              </div>
              <p className="text-3xl font-bold text-white">${stats.totalRevenue}</p>
              <p className="text-gray-500 text-xs mt-1">From outreach</p>
            </CardContent>
          </Card>

          <Card className="bg-[#141414] border-[#1f1f1f]">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-2">
                <p className="text-gray-400 text-sm">Active Opportunities</p>
                <AlertCircle className="w-5 h-5 text-yellow-500" />
              </div>
              <p className="text-3xl font-bold text-white">{opportunities.length}</p>
              <p className="text-gray-500 text-xs mt-1">Ready to contact</p>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="opportunities" className="space-y-6">
          <TabsList className="bg-[#141414] border border-[#1f1f1f]">
            <TabsTrigger value="opportunities" className="data-[state=active]:bg-[#84CC16] data-[state=active]:text-black">
              Opportunities ({opportunities.length})
            </TabsTrigger>
            <TabsTrigger value="history" className="data-[state=active]:bg-[#84CC16] data-[state=active]:text-black">
              Outreach History
            </TabsTrigger>
          </TabsList>

          {/* Opportunities Tab */}
          <TabsContent value="opportunities">
            {loadingOpps ? (
              <div className="text-center py-12">
                <Loader2 className="w-12 h-12 animate-spin text-[#84CC16] mx-auto mb-4" />
                <p className="text-gray-400">Analyzing client patterns...</p>
              </div>
            ) : opportunities.length === 0 ? (
              <Card className="bg-[#141414] border-[#1f1f1f]">
                <CardContent className="text-center py-12">
                  <CheckCircle2 className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-400 mb-2">All caught up</h3>
                  <p className="text-gray-500">No new outreach opportunities at the moment</p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {opportunities.map((opp, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <Card className="bg-[#141414] border-[#1f1f1f] hover:border-[#84CC16]/50 transition-all">
                      <CardHeader>
                        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-3">
                              <CardTitle className="text-white text-xl">{opp.client_name}</CardTitle>
                              {opp.client_value_tier === "vip" && (
                                <Badge className="bg-[#84CC16] text-black border-0">VIP</Badge>
                              )}
                            </div>
                            <div className="flex flex-wrap gap-2 mb-3">
                              <Badge className={triggerReasons[opp.trigger_reason]?.color || "bg-gray-500/20 text-gray-300"}>
                                {triggerReasons[opp.trigger_reason]?.label || opp.trigger_reason}
                              </Badge>
                              {opp.days_since_last_visit && (
                                <Badge variant="outline" className="border-gray-600 text-gray-400">
                                  <Clock className="w-3 h-3 mr-1" />
                                  {opp.days_since_last_visit} days ago
                                </Badge>
                              )}
                              {opp.last_service && (
                                <Badge className="bg-purple-500/20 text-purple-300 border-0">
                                  Last: {opp.last_service}
                                </Badge>
                              )}
                            </div>
                            <div className="bg-[#1f1f1f] p-3 rounded-lg border border-[#2a2a2a]">
                              <p className="text-gray-300 text-sm italic">"{opp.suggested_message}"</p>
                            </div>
                          </div>
                          <Button
                            onClick={() => handleSendOutreach(opp)}
                            disabled={sendOutreachMutation.isPending}
                            className="bg-[#84CC16] hover:bg-[#84CC16]/90 text-black"
                          >
                            <Send className="w-4 h-4 mr-2" />
                            Send via {opp.channel}
                          </Button>
                        </div>
                      </CardHeader>
                    </Card>
                  </motion.div>
                ))}
              </div>
            )}
          </TabsContent>

          {/* History Tab */}
          <TabsContent value="history">
            {isLoading ? (
              <div className="text-center py-12">
                <Loader2 className="w-12 h-12 animate-spin text-[#84CC16] mx-auto mb-4" />
                <p className="text-gray-400">Loading history...</p>
              </div>
            ) : outreachAttempts.length === 0 ? (
              <Card className="bg-[#141414] border-[#1f1f1f]">
                <CardContent className="text-center py-12">
                  <Send className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-400 mb-2">No outreach history yet</h3>
                  <p className="text-gray-500">Start sending proactive messages to see results</p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {outreachAttempts.map((attempt, index) => {
                  const ChannelIcon = channelIcons[attempt.channel] || MessageSquare;
                  return (
                    <motion.div
                      key={attempt.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <Card className="bg-[#141414] border-[#1f1f1f]">
                        <CardHeader>
                          <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-3">
                                <CardTitle className="text-white text-xl">{attempt.client_name}</CardTitle>
                                {attempt.client_value_tier === "vip" && (
                                  <Badge className="bg-[#84CC16] text-black border-0">VIP</Badge>
                                )}
                              </div>
                              <div className="flex flex-wrap gap-2 mb-3">
                                <Badge className={triggerReasons[attempt.trigger_reason]?.color || "bg-gray-500/20 text-gray-300"}>
                                  {triggerReasons[attempt.trigger_reason]?.label || attempt.trigger_reason}
                                </Badge>
                                <Badge variant="outline" className="border-gray-600 text-gray-400">
                                  <ChannelIcon className="w-3 h-3 mr-1" />
                                  {attempt.channel}
                                </Badge>
                                <Badge variant="outline" className="border-[#84CC16]/30 text-[#84CC16]">
                                  {format(parseISO(attempt.created_date), "MMM d, yyyy")}
                                </Badge>
                              </div>
                              <div className="bg-[#1f1f1f] p-3 rounded-lg border border-[#2a2a2a] mb-3">
                                <p className="text-gray-400 text-sm">{attempt.message_sent}</p>
                              </div>
                              {attempt.conversion_value && (
                                <p className="text-[#84CC16] text-sm font-medium">
                                  Revenue: ${attempt.conversion_value}
                                </p>
                              )}
                            </div>
                            <Badge className={`${statusColors[attempt.response_status]} border`}>
                              {attempt.response_status}
                            </Badge>
                          </div>
                        </CardHeader>
                      </Card>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </TabsContent>
        </Tabs>

        {/* Anti-Spam Notice */}
        <Card className="bg-gradient-to-br from-[#84CC16]/10 to-transparent border-[#84CC16]/20 mt-8">
          <CardContent className="pt-6">
            <div className="flex items-start gap-3">
              <Sparkles className="w-5 h-5 text-[#84CC16] mt-1 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-white mb-2">Intelligent Outreach Protocol</h3>
                <div className="space-y-1 text-gray-300 text-sm">
                  <p>✓ Clients ignored twice: 30-day pause automatically applied</p>
                  <p>✓ Only high-value triggers initiate contact</p>
                  <p>✓ Every message is personalized and intentional</p>
                  <p>✓ Never bulk campaigns, never spam</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}