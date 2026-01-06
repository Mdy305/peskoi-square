import React from "react";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import { MessageSquare } from "lucide-react";

export default function ConversationSummaryOverlay({ data }) {
  const { data: messages = [] } = useQuery({
    queryKey: ['conversationSummary'],
    queryFn: () => base44.entities.ConversationMessage.filter(
      { direction: 'inbound', read: false },
      '-sent_at',
      50
    )
  });

  const unreadByChannel = messages.reduce((acc, msg) => {
    acc[msg.channel] = (acc[msg.channel] || 0) + 1;
    return acc;
  }, {});

  const totalUnread = messages.length;

  if (totalUnread === 0) {
    return (
      <div className="text-center py-20">
        <MessageSquare className="w-12 h-12 text-white/20 mx-auto mb-4" />
        <p className="text-sm text-white/60">No unread messages</p>
      </div>
    );
  }

  return (
    <div>
      <p className="text-xs text-white/40 tracking-[0.15em] uppercase mb-8">Conversation Summary</p>
      
      <div className="space-y-6">
        <div className="border-b border-white/[0.08] pb-6">
          <p className="text-3xl font-light text-white mb-2">{totalUnread}</p>
          <p className="text-sm text-white/60">Unread messages</p>
        </div>

        <div className="space-y-4">
          {Object.entries(unreadByChannel).map(([channel, count]) => (
            <div key={channel} className="flex items-center justify-between border-b border-white/[0.05] pb-4">
              <span className="text-sm text-white/80 uppercase tracking-wide">{channel}</span>
              <span className="text-sm text-white/60">{count}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}