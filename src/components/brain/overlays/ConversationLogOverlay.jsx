import React from "react";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";

export default function ConversationLogOverlay({ data }) {
  const { data: messages = [] } = useQuery({
    queryKey: ['conversationLog'],
    queryFn: () => base44.entities.ConversationMessage.list('-sent_at', 100)
  });

  const conversations = React.useMemo(() => {
    const grouped = {};
    
    messages.forEach(msg => {
      const key = `${msg.square_customer_id}_${msg.channel}`;
      if (!grouped[key]) {
        grouped[key] = {
          id: key,
          customer_id: msg.square_customer_id,
          channel: msg.channel,
          messages: [],
          lastMessage: msg
        };
      }
      grouped[key].messages.push(msg);
    });

    return Object.values(grouped)
      .sort((a, b) => new Date(b.lastMessage.sent_at) - new Date(a.lastMessage.sent_at))
      .slice(0, 10);
  }, [messages]);

  if (conversations.length === 0) {
    return (
      <div className="text-center py-20">
        <p className="text-sm text-white/60">No conversations yet</p>
      </div>
    );
  }

  return (
    <div>
      <p className="text-xs text-white/40 tracking-[0.15em] uppercase mb-8">Recent Conversations</p>
      
      <div className="space-y-6">
        {conversations.map((conv) => (
          <div key={conv.id} className="border-b border-white/[0.08] pb-6">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs text-white/40 uppercase tracking-wide">{conv.channel}</span>
            </div>
            <p className="text-sm text-white/80 mb-2">{conv.customer_id}</p>
            <p className="text-sm text-white/60 line-clamp-2">{conv.lastMessage.content}</p>
            <p className="text-xs text-white/40 mt-2">
              {new Date(conv.lastMessage.sent_at).toLocaleString('en-US', {
                month: 'short',
                day: 'numeric',
                hour: 'numeric',
                minute: '2-digit'
              })}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}