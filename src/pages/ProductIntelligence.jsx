import React, { useMemo, useState } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  ShoppingBag,
  Sparkles,
  TrendingUp,
  Send,
  CheckCircle2,
  XCircle,
  Clock,
  Loader2,
  Package,
  Mail,
  MessageSquare
} from "lucide-react";
import { motion } from "framer-motion";
import { format, parseISO } from "date-fns";

export default function ProductIntelligence() {
  const queryClient = useQueryClient();
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const { data: recommendations = [], isLoading } = useQuery({
    queryKey: ["productRecommendations"],
    queryFn: () => base44.entities.ProductRecommendation.list("-created_date"),
  });

  const analyzeMutation = useMutation({
    mutationFn: () => base44.functions.invoke("analyzeProductRecommendations", {}),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["productRecommendations"] });
    },
  });

  const sendMutation = useMutation({
    mutationFn: (recommendation_id) => 
      base44.functions.invoke("sendProductRecommendation", { recommendation_id }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["productRecommendations"] });
    },
  });

  const handleAnalyze = async () => {
    setIsAnalyzing(true);
    await analyzeMutation.mutateAsync();
    setIsAnalyzing(false);
  };

  const stats = useMemo(() => {
    const total = recommendations.length;
    const sent = recommendations.filter(r => r.status === "sent" || r.status === "accepted").length;
    const accepted = recommendations.filter(r => r.status === "accepted").length;
    const ignored = recommendations.filter(r => r.status === "ignored").length;
    const purchased = recommendations.filter(r => r.purchased).length;
    const conversionRate = sent > 0 ? Math.round((accepted / sent) * 100) : 0;
    const purchaseRate = sent > 0 ? Math.round((purchased / sent) * 100) : 0;
    const totalRevenue = recommendations
      .filter(r => r.revenue_generated)
      .reduce((sum, r) => sum + r.revenue_generated, 0);

    return { total, sent, accepted, ignored, conversionRate, purchaseRate, purchased, totalRevenue };
  }, [recommendations]);

  const pendingRecommendations = recommendations.filter(r => r.status === "pending");

  const statusColors = {
    pending: "bg-yellow-500/20 text-yellow-300 border-yellow-500/30",
    sent: "bg-blue-500/20 text-blue-300 border-blue-500/30",
    accepted: "bg-green-500/20 text-green-300 border-green-500/30",
    declined: "bg-gray-500/20 text-gray-300 border-gray-500/30",
    ignored: "bg-red-500/20 text-red-300 border-red-500/30",
  };

  const channelIcons = {
    whatsapp: MessageSquare,
    sms: MessageSquare,
    email: Mail,
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
            <span className="text-sm font-medium text-[#84CC16]">AI Product Intelligence</span>
          </motion.div>
          <div className="flex items-end justify-between gap-4">
            <div>
              <h1 className="text-5xl font-bold mb-4 tracking-tight">Product Intelligence</h1>
              <p className="text-gray-400 text-lg">
                Expert product recommendations that extend salon results at home
              </p>
            </div>
            <Button
              onClick={handleAnalyze}
              disabled={isAnalyzing || analyzeMutation.isPending}
              className="bg-[#84CC16] hover:bg-[#84CC16]/90 text-black font-semibold"
            >
              {isAnalyzing || analyzeMutation.isPending ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Analyzing
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5 mr-2" />
                  Analyze Completed Services
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-[#141414] border-[#1f1f1f]">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-2">
                <p className="text-gray-400 text-sm">Conversion Rate</p>
                <TrendingUp className="w-5 h-5 text-[#84CC16]" />
              </div>
              <p className="text-3xl font-bold text-white">{stats.conversionRate}%</p>
              <p className="text-gray-500 text-xs mt-1">{stats.accepted} accepted</p>
            </CardContent>
          </Card>

          <Card className="bg-[#141414] border-[#1f1f1f]">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-2">
                <p className="text-gray-400 text-sm">Purchase Rate</p>
                <ShoppingBag className="w-5 h-5 text-green-500" />
              </div>
              <p className="text-3xl font-bold text-white">{stats.purchaseRate}%</p>
              <p className="text-gray-500 text-xs mt-1">{stats.purchased} purchased</p>
            </CardContent>
          </Card>

          <Card className="bg-[#141414] border-[#1f1f1f]">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-2">
                <p className="text-gray-400 text-sm">Retail Revenue</p>
                <TrendingUp className="w-5 h-5 text-[#84CC16]" />
              </div>
              <p className="text-3xl font-bold text-white">${stats.totalRevenue}</p>
              <p className="text-gray-500 text-xs mt-1">From recommendations</p>
            </CardContent>
          </Card>

          <Card className="bg-[#141414] border-[#1f1f1f]">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-2">
                <p className="text-gray-400 text-sm">Pending</p>
                <Clock className="w-5 h-5 text-yellow-500" />
              </div>
              <p className="text-3xl font-bold text-white">{pendingRecommendations.length}</p>
              <p className="text-gray-500 text-xs mt-1">Ready to send</p>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="pending" className="space-y-6">
          <TabsList className="bg-[#141414] border border-[#1f1f1f]">
            <TabsTrigger value="pending" className="data-[state=active]:bg-[#84CC16] data-[state=active]:text-black">
              Pending ({pendingRecommendations.length})
            </TabsTrigger>
            <TabsTrigger value="history" className="data-[state=active]:bg-[#84CC16] data-[state=active]:text-black">
              History
            </TabsTrigger>
          </TabsList>

          {/* Pending Tab */}
          <TabsContent value="pending">
            {isLoading ? (
              <div className="text-center py-12">
                <Loader2 className="w-12 h-12 animate-spin text-[#84CC16] mx-auto mb-4" />
                <p className="text-gray-400">Loading recommendations...</p>
              </div>
            ) : pendingRecommendations.length === 0 ? (
              <Card className="bg-[#141414] border-[#1f1f1f]">
                <CardContent className="text-center py-12">
                  <Package className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-400 mb-2">All caught up</h3>
                  <p className="text-gray-500">No pending product recommendations</p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {pendingRecommendations.map((rec, index) => (
                  <motion.div
                    key={rec.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <Card className="bg-[#141414] border-[#1f1f1f] hover:border-[#84CC16]/50 transition-all">
                      <CardHeader>
                        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-3">
                              <CardTitle className="text-white text-xl">{rec.client_name}</CardTitle>
                            </div>
                            <div className="flex flex-wrap gap-2 mb-3">
                              <Badge className="bg-purple-500/20 text-purple-300 border-0">
                                {rec.service_completed}
                              </Badge>
                              <Badge variant="outline" className="border-gray-600 text-gray-400">
                                {rec.channel}
                              </Badge>
                              {rec.send_time && (
                                <Badge variant="outline" className="border-[#84CC16]/30 text-[#84CC16]">
                                  <Clock className="w-3 h-3 mr-1" />
                                  {format(parseISO(rec.send_time), "MMM d, h:mm a")}
                                </Badge>
                              )}
                            </div>
                            <div className="bg-[#1f1f1f] p-4 rounded-lg border border-[#2a2a2a] mb-3">
                              <p className="text-gray-300 text-sm mb-3">{rec.message_sent}</p>
                              <div className="space-y-2">
                                {rec.products_recommended?.map((product, idx) => (
                                  <div key={idx} className="flex items-start gap-2">
                                    <Package className="w-4 h-4 text-[#84CC16] mt-0.5 flex-shrink-0" />
                                    <div>
                                      <p className="text-white font-medium text-sm">{product.name}</p>
                                      <p className="text-gray-500 text-xs">{product.reason}</p>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                          <Button
                            onClick={() => sendMutation.mutate(rec.id)}
                            disabled={sendMutation.isPending}
                            className="bg-[#84CC16] hover:bg-[#84CC16]/90 text-black"
                          >
                            <Send className="w-4 h-4 mr-2" />
                            Send Now
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
            ) : recommendations.length === 0 ? (
              <Card className="bg-[#141414] border-[#1f1f1f]">
                <CardContent className="text-center py-12">
                  <ShoppingBag className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-400 mb-2">No history yet</h3>
                  <p className="text-gray-500">Product recommendations will appear here</p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {recommendations.map((rec, index) => (
                  <motion.div
                    key={rec.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <Card className="bg-[#141414] border-[#1f1f1f]">
                      <CardHeader>
                        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-3">
                              <CardTitle className="text-white text-xl">{rec.client_name}</CardTitle>
                            </div>
                            <div className="flex flex-wrap gap-2 mb-3">
                              <Badge className="bg-purple-500/20 text-purple-300 border-0">
                                {rec.service_completed}
                              </Badge>
                              {rec.products_recommended?.map((product, idx) => (
                                <Badge key={idx} variant="outline" className="border-gray-600 text-gray-400">
                                  {product.name}
                                </Badge>
                              ))}
                              {rec.purchased && rec.revenue_generated && (
                                <Badge className="bg-green-500/20 text-green-300 border-0">
                                  ${rec.revenue_generated} revenue
                                </Badge>
                              )}
                            </div>
                          </div>
                          <Badge className={`${statusColors[rec.status]} border`}>
                            {rec.status}
                          </Badge>
                        </div>
                      </CardHeader>
                    </Card>
                  </motion.div>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>

        {/* Intelligence Notice */}
        <Card className="bg-gradient-to-br from-[#84CC16]/10 to-transparent border-[#84CC16]/20 mt-8">
          <CardContent className="pt-6">
            <div className="flex items-start gap-3">
              <Sparkles className="w-5 h-5 text-[#84CC16] mt-1 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-white mb-2">Expert-Driven Intelligence</h3>
                <div className="space-y-1 text-gray-300 text-sm">
                  <p>✓ Waits 2-6 hours (short services) or 12-24 hours (color/treatments)</p>
                  <p>✓ Maximum 1-2 products per recommendation</p>
                  <p>✓ Automatically stops after 2 ignored messages (60-day pause)</p>
                  <p>✓ Expert tone, never promotional</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}