import React from "react";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";

export default function CampaignAnalytics() {
  const { data: campaigns = [], isLoading } = useQuery({
    queryKey: ['campaigns'],
    queryFn: () => base44.entities.BookingCampaign.list('-created_date')
  });

  const { data: tests = [] } = useQuery({
    queryKey: ['abTests'],
    queryFn: () => base44.entities.ABTest.list('-created_date')
  });

  if (isLoading) {
    return <div className="min-h-screen bg-black" />;
  }

  const activeCampaigns = campaigns.filter(c => c.status === 'active');

  return (
    <div className="min-h-screen bg-black text-white px-6 py-20">
      <div className="max-w-3xl mx-auto">

        <p className="text-xs text-white/40 tracking-[0.15em] uppercase mb-12">Campaign analytics</p>

        {activeCampaigns.length > 0 && (
          <div className="space-y-6">
            {activeCampaigns.map(campaign => (
              <div key={campaign.id} className="border-b border-white/[0.05] pb-6">
                <p className="text-sm mb-3">{campaign.campaign_name}</p>
                <div className="grid grid-cols-3 gap-4 text-xs">
                  <div>
                    <p className="text-white/40 mb-1">Sent</p>
                    <p className="text-white/80">{campaign.sent_count || 0}</p>
                  </div>
                  <div>
                    <p className="text-white/40 mb-1">Responses</p>
                    <p className="text-white/80">{campaign.response_count || 0}</p>
                  </div>
                  <div>
                    <p className="text-white/40 mb-1">Bookings</p>
                    <p className="text-white/80">{campaign.booking_count || 0}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeCampaigns.length === 0 && (
          <p className="text-sm text-white/40 text-center py-12">No active campaigns</p>
        )}

      </div>
    </div>
  );
}