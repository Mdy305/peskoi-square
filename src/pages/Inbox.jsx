import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { MessageSquare, Send, Search, X, AlertCircle, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useSquare } from "@/components/providers/SquareProvider";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";

export default function Inbox() {
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [replyText, setReplyText] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const queryClient = useQueryClient();
  const square = useSquare();

  // Fetch all conversations
  const { data: messages = [], isLoading } = useQuery({
    queryKey: ['conversations'],
    queryFn: () => base44.entities.ConversationMessage.list('-sent_at', 200),
    refetchInterval: 10000,
    enabled: square.connected
  });

  // Not connected state
  if (!square.loading && !square.connected) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center px-4">
        <div className="max-w-md w-full text-center">
          <AlertCircle className="w-12 h-12 text-white/40 mx-auto mb-6" />
          <h1 className="text-xl font-light mb-3">Square Required</h1>
          <p className="text-sm text-white/60 mb-8">
            Connect your Square account to access messages.
          </p>
          <Link 
            to={createPageUrl("ConnectSquare")}
            className="inline-block border border-white/[0.08] px-8 py-3 text-sm tracking-wide hover:border-white/20 transition-colors"
          >
            Connect Square
          </Link>
        </div>
      </div>
    );
  }

  // Loading state
  if (square.loading || isLoading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-white/40" />
      </div>
    );
  }

  // Group messages by customer + channel
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
          lastMessage: msg,
          unread: 0
        };
      }
      grouped[key].messages.push(msg);
      if (!msg.read && msg.direction === 'inbound') {
        grouped[key].unread++;
      }
    });

    return Object.values(grouped)
      .sort((a, b) => new Date(b.lastMessage.sent_at) - new Date(a.lastMessage.sent_at));
  }, [messages]);

  // Filter conversations by search
  const filteredConversations = conversations.filter(conv => {
    if (!searchQuery) return true;
    const searchLower = searchQuery.toLowerCase();
    return conv.customer_id?.toLowerCase().includes(searchLower) ||
           conv.channel?.toLowerCase().includes(searchLower) ||
           conv.lastMessage?.content?.toLowerCase().includes(searchLower);
  });

  // Send reply mutation
  const sendReplyMutation = useMutation({
    mutationFn: async ({ customerId, channel, content }) => {
      return await base44.entities.ConversationMessage.create({
        square_customer_id: customerId,
        channel,
        direction: 'outbound',
        content,
        sent_at: new Date().toISOString(),
        metadata: {}
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['conversations']);
      setReplyText("");
    }
  });

  // Mark as read mutation
  const markAsReadMutation = useMutation({
    mutationFn: async (messageIds) => {
      for (const id of messageIds) {
        await base44.entities.ConversationMessage.update(id, { read: true });
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['conversations']);
    }
  });

  const handleSelectConversation = (conv) => {
    setSelectedConversation(conv);
    const unreadIds = conv.messages
      .filter(m => !m.read && m.direction === 'inbound')
      .map(m => m.id);
    if (unreadIds.length > 0) {
      markAsReadMutation.mutate(unreadIds);
    }
  };

  const handleSendReply = () => {
    if (!replyText.trim() || !selectedConversation) return;
    
    sendReplyMutation.mutate({
      customerId: selectedConversation.customer_id,
      channel: selectedConversation.channel,
      content: replyText.trim()
    });
  };

  const getChannelBadge = (channel) => {
    const colors = {
      whatsapp: 'text-green-400',
      instagram: 'text-pink-400',
      facebook: 'text-blue-400',
      web: 'text-white/60',
      sms: 'text-yellow-400',
      voice: 'text-purple-400'
    };
    return colors[channel] || 'text-white/60';
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-20">
        
        {/* Square Status */}
        {square.locationName && (
          <div className="mb-8 pb-8 border-b border-white/[0.05]">
            <p className="text-xs text-white/40">Connected: {square.locationName}</p>
          </div>
        )}

        <div className="flex items-center justify-between mb-12">
          <div>
            <p className="text-xs text-white/40 tracking-[0.15em] uppercase mb-2">Communications</p>
            <h1 className="text-2xl font-light">Inbox</h1>
          </div>
          {conversations.reduce((sum, c) => sum + c.unread, 0) > 0 && (
            <div className="text-xs text-white/60">
              {conversations.reduce((sum, c) => sum + c.unread, 0)} unread
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-16rem)]">
          
          {/* Conversations List */}
          <div className="lg:col-span-1 border border-white/[0.08] overflow-hidden flex flex-col">
            
            {/* Search */}
            <div className="border-b border-white/[0.08] p-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search conversations..."
                  className="w-full bg-transparent border border-white/[0.08] pl-10 pr-4 py-2 text-sm focus:outline-none focus:border-white/20 transition-colors"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="absolute right-3 top-1/2 -translate-y-1/2"
                  >
                    <X className="w-4 h-4 text-white/40 hover:text-white/60" />
                  </button>
                )}
              </div>
            </div>

            {/* Conversations */}
            <div className="flex-1 overflow-y-auto">
              {filteredConversations.length === 0 ? (
                <div className="p-6 text-center text-white/40 text-sm">
                  {searchQuery ? 'No conversations match your search' : 'No conversations yet'}
                </div>
              ) : (
                filteredConversations.map((conv) => (
                  <button
                    key={conv.id}
                    onClick={() => handleSelectConversation(conv)}
                    className={`w-full text-left p-4 border-b border-white/[0.08] hover:bg-white/[0.02] transition-colors ${
                      selectedConversation?.id === conv.id ? 'bg-white/[0.03]' : ''
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <div className="flex items-center gap-2">
                        <MessageSquare className={`w-4 h-4 ${getChannelBadge(conv.channel)}`} />
                        <span className={`text-xs uppercase tracking-wide ${getChannelBadge(conv.channel)}`}>
                          {conv.channel}
                        </span>
                      </div>
                      {conv.unread > 0 && (
                        <span className="text-xs bg-white/10 px-2 py-0.5 rounded-full">
                          {conv.unread}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-white/60 mb-1">{conv.customer_id}</p>
                    <p className="text-sm text-white/80 line-clamp-2">
                      {conv.lastMessage.content}
                    </p>
                    <p className="text-xs text-white/40 mt-2">
                      {new Date(conv.lastMessage.sent_at).toLocaleString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        hour: 'numeric',
                        minute: '2-digit'
                      })}
                    </p>
                  </button>
                ))
              )}
            </div>
          </div>

          {/* Message Thread */}
          <div className="lg:col-span-2 border border-white/[0.08] flex flex-col">
            {!selectedConversation ? (
              <div className="flex-1 flex items-center justify-center text-white/40 text-sm">
                Select a conversation to view messages
              </div>
            ) : (
              <>
                {/* Thread Header */}
                <div className="border-b border-white/[0.08] p-4">
                  <div className="flex items-center gap-2 mb-1">
                    <MessageSquare className={`w-4 h-4 ${getChannelBadge(selectedConversation.channel)}`} />
                    <span className={`text-xs uppercase tracking-wide ${getChannelBadge(selectedConversation.channel)}`}>
                      {selectedConversation.channel}
                    </span>
                  </div>
                  <p className="text-sm text-white/80">{selectedConversation.customer_id}</p>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  <AnimatePresence>
                    {selectedConversation.messages
                      .sort((a, b) => new Date(a.sent_at) - new Date(b.sent_at))
                      .map((msg) => (
                        <motion.div
                          key={msg.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className={`flex ${msg.direction === 'outbound' ? 'justify-end' : 'justify-start'}`}
                        >
                          <div className={`max-w-[80%] rounded-lg px-4 py-3 ${
                            msg.direction === 'outbound' 
                              ? 'bg-white text-black' 
                              : 'bg-white/5 text-white'
                          }`}>
                            <p className="text-sm leading-relaxed whitespace-pre-wrap">
                              {msg.content}
                            </p>
                            <p className="text-xs opacity-50 mt-2">
                              {new Date(msg.sent_at).toLocaleTimeString('en-US', {
                                hour: 'numeric',
                                minute: '2-digit'
                              })}
                            </p>
                          </div>
                        </motion.div>
                      ))}
                  </AnimatePresence>
                </div>

                {/* Reply Box */}
                <div className="border-t border-white/[0.08] p-4">
                  <div className="flex gap-3">
                    <input
                      type="text"
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleSendReply()}
                      placeholder="Type your reply..."
                      disabled={sendReplyMutation.isPending}
                      className="flex-1 bg-transparent border border-white/[0.08] px-4 py-3 text-sm focus:outline-none focus:border-white/20 transition-colors"
                    />
                    <button
                      onClick={handleSendReply}
                      disabled={!replyText.trim() || sendReplyMutation.isPending}
                      className="w-12 h-12 bg-white text-black flex items-center justify-center hover:bg-white/90 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                    >
                      <Send className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>

        </div>

      </div>
    </div>
  );
}