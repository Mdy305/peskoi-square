import React, { useMemo } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  TrendingUp,
  MapPin,
  MessageSquare,
  Target,
  Clock,
  Sparkles,
  Search,
  Loader2
} from "lucide-react";
import { motion } from "framer-motion";

export default function SEOIntelligence() {
  const { data: insights = [], isLoading } = useQuery({
    queryKey: ["conversationInsights"],
    queryFn: () => base44.entities.ConversationInsight.list("-created_date"),
  });

  const { data: appointments = [] } = useQuery({
    queryKey: ["appointments"],
    queryFn: () => base44.entities.Appointment.list(),
  });

  // Calculate SEO intelligence
  const analytics = useMemo(() => {
    // Top questions
    const questionCounts = {};
    insights.forEach(i => {
      questionCounts[i.question] = (questionCounts[i.question] || 0) + 1;
    });
    const topQuestions = Object.entries(questionCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 10)
      .map(([q, count]) => ({ question: q, count }));

    // Service conversion rates
    const serviceStats = {};
    insights.forEach(i => {
      i.services_mentioned?.forEach(service => {
        if (!serviceStats[service]) {
          serviceStats[service] = { mentions: 0, bookings: 0 };
        }
        serviceStats[service].mentions++;
        if (i.outcome === "booked") {
          serviceStats[service].bookings++;
        }
      });
    });
    const topServices = Object.entries(serviceStats)
      .map(([service, stats]) => ({
        service,
        mentions: stats.mentions,
        bookings: stats.bookings,
        conversionRate: stats.mentions > 0 ? Math.round((stats.bookings / stats.mentions) * 100) : 0
      }))
      .sort((a, b) => b.conversionRate - a.conversionRate)
      .slice(0, 8);

    // Location keywords
    const locationCounts = {};
    insights.forEach(i => {
      i.location_keywords?.forEach(loc => {
        locationCounts[loc] = (locationCounts[loc] || 0) + 1;
      });
    });
    const topLocations = Object.entries(locationCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 10)
      .map(([location, count]) => ({ location, count }));

    // Question categories
    const categoryCounts = {};
    insights.forEach(i => {
      categoryCounts[i.question_category] = (categoryCounts[i.question_category] || 0) + 1;
    });

    // Conversion metrics
    const totalConversations = insights.length;
    const bookings = insights.filter(i => i.outcome === "booked").length;
    const avgConversionTime = insights
      .filter(i => i.conversion_time_seconds)
      .reduce((sum, i) => sum + i.conversion_time_seconds, 0) / 
      (insights.filter(i => i.conversion_time_seconds).length || 1);

    const overallConversionRate = totalConversations > 0 
      ? Math.round((bookings / totalConversations) * 100) 
      : 0;

    return {
      topQuestions,
      topServices,
      topLocations,
      categoryCounts,
      totalConversations,
      bookings,
      overallConversionRate,
      avgConversionTime: Math.round(avgConversionTime)
    };
  }, [insights]);

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
            <span className="text-sm font-medium text-[#84CC16]">SEO & Geo Intelligence</span>
          </motion.div>
          <h1 className="text-5xl font-bold mb-4 tracking-tight">
            Search Visibility Engine
          </h1>
          <p className="text-gray-400 text-lg">
            Continuously improve local search rankings and conversion with real client data
          </p>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-[#141414] border-[#1f1f1f]">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-2">
                <p className="text-gray-400 text-sm">Conversion Rate</p>
                <Target className="w-5 h-5 text-[#84CC16]" />
              </div>
              <p className="text-3xl font-bold text-white">{analytics.overallConversionRate}%</p>
              <p className="text-gray-500 text-xs mt-1">
                {analytics.bookings} of {analytics.totalConversations} conversations
              </p>
            </CardContent>
          </Card>

          <Card className="bg-[#141414] border-[#1f1f1f]">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-2">
                <p className="text-gray-400 text-sm">Avg. Time to Book</p>
                <Clock className="w-5 h-5 text-blue-500" />
              </div>
              <p className="text-3xl font-bold text-white">{analytics.avgConversionTime}s</p>
              <p className="text-gray-500 text-xs mt-1">From inquiry to booking</p>
            </CardContent>
          </Card>

          <Card className="bg-[#141414] border-[#1f1f1f]">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-2">
                <p className="text-gray-400 text-sm">Total Conversations</p>
                <MessageSquare className="w-5 h-5 text-purple-500" />
              </div>
              <p className="text-3xl font-bold text-white">{analytics.totalConversations}</p>
              <p className="text-gray-500 text-xs mt-1">Client interactions tracked</p>
            </CardContent>
          </Card>

          <Card className="bg-[#141414] border-[#1f1f1f]">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-2">
                <p className="text-gray-400 text-sm">Geo Keywords</p>
                <MapPin className="w-5 h-5 text-orange-500" />
              </div>
              <p className="text-3xl font-bold text-white">{analytics.topLocations.length}</p>
              <p className="text-gray-500 text-xs mt-1">Location terms used</p>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="questions" className="space-y-6">
          <TabsList className="bg-[#141414] border border-[#1f1f1f]">
            <TabsTrigger value="questions" className="data-[state=active]:bg-[#84CC16] data-[state=active]:text-black">
              Top Questions
            </TabsTrigger>
            <TabsTrigger value="services" className="data-[state=active]:bg-[#84CC16] data-[state=active]:text-black">
              Service Performance
            </TabsTrigger>
            <TabsTrigger value="location" className="data-[state=active]:bg-[#84CC16] data-[state=active]:text-black">
              Geo Keywords
            </TabsTrigger>
            <TabsTrigger value="categories" className="data-[state=active]:bg-[#84CC16] data-[state=active]:text-black">
              Categories
            </TabsTrigger>
          </TabsList>

          {/* Top Questions Tab */}
          <TabsContent value="questions">
            <Card className="bg-[#141414] border-[#1f1f1f]">
              <CardHeader>
                <CardTitle className="text-2xl text-white flex items-center gap-2">
                  <MessageSquare className="w-6 h-6 text-[#84CC16]" />
                  Most Frequent Client Questions
                </CardTitle>
                <p className="text-gray-400 text-sm">
                  Use these to create FAQ content and optimize voice search
                </p>
              </CardHeader>
              <CardContent>
                {analytics.topQuestions.length === 0 ? (
                  <p className="text-gray-500 text-center py-8">No questions tracked yet</p>
                ) : (
                  <div className="space-y-3">
                    {analytics.topQuestions.map((item, idx) => (
                      <motion.div
                        key={idx}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.05 }}
                        className="flex items-center justify-between p-4 bg-[#1f1f1f] rounded-lg border border-[#2a2a2a]"
                      >
                        <div className="flex-1">
                          <p className="text-white font-medium">{item.question}</p>
                        </div>
                        <Badge className="bg-[#84CC16]/20 text-[#84CC16] border-0">
                          {item.count}x
                        </Badge>
                      </motion.div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Services Tab */}
          <TabsContent value="services">
            <Card className="bg-[#141414] border-[#1f1f1f]">
              <CardHeader>
                <CardTitle className="text-2xl text-white flex items-center gap-2">
                  <TrendingUp className="w-6 h-6 text-[#84CC16]" />
                  High-Converting Services
                </CardTitle>
                <p className="text-gray-400 text-sm">
                  Services that lead to bookings most often
                </p>
              </CardHeader>
              <CardContent>
                {analytics.topServices.length === 0 ? (
                  <p className="text-gray-500 text-center py-8">No service data yet</p>
                ) : (
                  <div className="grid md:grid-cols-2 gap-4">
                    {analytics.topServices.map((item, idx) => (
                      <motion.div
                        key={idx}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.05 }}
                        className="p-4 bg-[#1f1f1f] rounded-lg border border-[#2a2a2a]"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="text-white font-semibold">{item.service}</h4>
                          <Badge className={
                            item.conversionRate >= 50 
                              ? "bg-green-500/20 text-green-300 border-0"
                              : item.conversionRate >= 30
                              ? "bg-yellow-500/20 text-yellow-300 border-0"
                              : "bg-gray-500/20 text-gray-300 border-0"
                          }>
                            {item.conversionRate}%
                          </Badge>
                        </div>
                        <div className="flex gap-4 text-sm text-gray-400">
                          <span>{item.mentions} mentions</span>
                          <span>•</span>
                          <span>{item.bookings} bookings</span>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Location Tab */}
          <TabsContent value="location">
            <Card className="bg-[#141414] border-[#1f1f1f]">
              <CardHeader>
                <CardTitle className="text-2xl text-white flex items-center gap-2">
                  <MapPin className="w-6 h-6 text-[#84CC16]" />
                  Geographic Keywords
                </CardTitle>
                <p className="text-gray-400 text-sm">
                  Location terms clients use to find you
                </p>
              </CardHeader>
              <CardContent>
                {analytics.topLocations.length === 0 ? (
                  <p className="text-gray-500 text-center py-8">No location data yet</p>
                ) : (
                  <div className="flex flex-wrap gap-3">
                    {analytics.topLocations.map((item, idx) => (
                      <motion.div
                        key={idx}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: idx * 0.05 }}
                      >
                        <Badge className="bg-[#84CC16]/20 text-[#84CC16] border-0 text-base px-4 py-2">
                          {item.location} ({item.count}x)
                        </Badge>
                      </motion.div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Categories Tab */}
          <TabsContent value="categories">
            <Card className="bg-[#141414] border-[#1f1f1f]">
              <CardHeader>
                <CardTitle className="text-2xl text-white flex items-center gap-2">
                  <Search className="w-6 h-6 text-[#84CC16]" />
                  Question Categories
                </CardTitle>
                <p className="text-gray-400 text-sm">
                  What clients ask about most
                </p>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-4">
                  {Object.entries(analytics.categoryCounts).map(([category, count], idx) => (
                    <motion.div
                      key={category}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.05 }}
                      className="flex items-center justify-between p-4 bg-[#1f1f1f] rounded-lg border border-[#2a2a2a]"
                    >
                      <span className="text-white font-medium capitalize">
                        {category.replace("_", " ")}
                      </span>
                      <Badge className="bg-purple-500/20 text-purple-300 border-0">
                        {count}
                      </Badge>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* SEO Recommendations */}
        <Card className="bg-gradient-to-br from-[#84CC16]/10 to-transparent border-[#84CC16]/20 mt-8">
          <CardHeader>
            <CardTitle className="text-xl text-white flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-[#84CC16]" />
              SEO Optimization Tips
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-gray-300">
            <p>✓ Use top questions in your website FAQ section</p>
            <p>✓ Highlight high-converting services in your homepage copy</p>
            <p>✓ Include geo keywords naturally in service descriptions</p>
            <p>✓ Structure content to answer voice search queries</p>
            <p>✓ Create dedicated pages for top-performing services</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}