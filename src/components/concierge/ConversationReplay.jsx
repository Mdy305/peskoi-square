import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import { Search, MessageCircle, Clock, User, Bot } from "lucide-react";
import { COLORS, TYPOGRAPHY, SPACING, RADIUS } from "../design/tokens";

export default function ConversationReplay() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedThread, setSelectedThread] = useState(null);

  const { data: user } = useQuery({
    queryKey: ['currentUser'],
    queryFn: () => base44.auth.me()
  });

  const conversations = user?.conversation_states 
    ? Object.entries(user.conversation_states).map(([key, state]) => ({
        threadId: state.threadId,
        lastUpdated: state.updatedAt,
        messageCount: state.history.length,
        lastIntent: state.lastIntent,
        state
      }))
    : [];

  const filteredConversations = conversations.filter(c =>
    !searchQuery || 
    c.lastIntent?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.state.history.some(m => m.content.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const selectedConversation = selectedThread
    ? conversations.find(c => c.threadId === selectedThread)
    : null;

  return (
    <div style={{
      minHeight: '100vh',
      background: COLORS.black,
      color: COLORS.white,
      fontFamily: TYPOGRAPHY.fontFamily.sans
    }}>
      <div style={{
        display: 'flex',
        height: '100vh'
      }}>
        {/* Sidebar */}
        <div style={{
          width: '320px',
          borderRight: `1px solid ${COLORS.gray[100]}`,
          display: 'flex',
          flexDirection: 'column'
        }}>
          {/* Header */}
          <div style={{
            padding: SPACING[6],
            borderBottom: `1px solid ${COLORS.gray[100]}`
          }}>
            <p style={{
              fontSize: TYPOGRAPHY.fontSize.xs,
              color: COLORS.gray[600],
              letterSpacing: TYPOGRAPHY.letterSpacing.wider,
              textTransform: 'uppercase',
              marginBottom: SPACING[3]
            }}>
              Conversation History
            </p>
            <div style={{
              position: 'relative'
            }}>
              <Search size={16} style={{
                position: 'absolute',
                left: SPACING[3],
                top: '50%',
                transform: 'translateY(-50%)',
                color: COLORS.gray[600]
              }} />
              <input
                type="text"
                placeholder="Search conversations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  width: '100%',
                  padding: `${SPACING[2]} ${SPACING[3]} ${SPACING[2]} ${SPACING[8]}`,
                  background: COLORS.gray[50],
                  border: `1px solid ${COLORS.gray[100]}`,
                  borderRadius: RADIUS.base,
                  color: COLORS.white,
                  fontSize: TYPOGRAPHY.fontSize.sm,
                  outline: 'none'
                }}
              />
            </div>
          </div>

          {/* Conversation List */}
          <div style={{
            flex: 1,
            overflowY: 'auto',
            padding: SPACING[4]
          }}>
            {filteredConversations.length === 0 ? (
              <div style={{
                textAlign: 'center',
                padding: SPACING[8],
                color: COLORS.gray[600]
              }}>
                <MessageCircle size={32} style={{ margin: '0 auto', marginBottom: SPACING[3], opacity: 0.3 }} />
                <p style={{ fontSize: TYPOGRAPHY.fontSize.sm }}>No conversations yet</p>
              </div>
            ) : (
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: SPACING[2]
              }}>
                {filteredConversations.map((conv) => (
                  <button
                    key={conv.threadId}
                    onClick={() => setSelectedThread(conv.threadId)}
                    style={{
                      padding: SPACING[4],
                      background: selectedThread === conv.threadId ? COLORS.gray[100] : COLORS.gray[50],
                      border: `1px solid ${selectedThread === conv.threadId ? COLORS.gray[200] : COLORS.gray[100]}`,
                      borderRadius: RADIUS.base,
                      textAlign: 'left',
                      cursor: 'pointer',
                      transition: '150ms'
                    }}
                  >
                    <div style={{
                      fontSize: TYPOGRAPHY.fontSize.sm,
                      color: COLORS.white,
                      marginBottom: SPACING[2]
                    }}>
                      {conv.lastIntent || 'General'}
                    </div>
                    <div style={{
                      fontSize: TYPOGRAPHY.fontSize.xs,
                      color: COLORS.gray[600],
                      display: 'flex',
                      alignItems: 'center',
                      gap: SPACING[2]
                    }}>
                      <Clock size={12} />
                      {new Date(conv.lastUpdated).toLocaleString()}
                    </div>
                    <div style={{
                      fontSize: TYPOGRAPHY.fontSize.xs,
                      color: COLORS.gray[700],
                      marginTop: SPACING[1]
                    }}>
                      {conv.messageCount} messages
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Main Panel */}
        <div style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column'
        }}>
          {selectedConversation ? (
            <>
              {/* Conversation Header */}
              <div style={{
                padding: SPACING[6],
                borderBottom: `1px solid ${COLORS.gray[100]}`
              }}>
                <h2 style={{
                  fontSize: TYPOGRAPHY.fontSize.xl,
                  fontWeight: TYPOGRAPHY.fontWeight.medium,
                  marginBottom: SPACING[2]
                }}>
                  {selectedConversation.lastIntent || 'Conversation'}
                </h2>
                <div style={{
                  fontSize: TYPOGRAPHY.fontSize.sm,
                  color: COLORS.gray[600]
                }}>
                  Thread ID: {selectedConversation.threadId}
                </div>
              </div>

              {/* Messages */}
              <div style={{
                flex: 1,
                overflowY: 'auto',
                padding: SPACING[6]
              }}>
                <div style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: SPACING[4]
                }}>
                  {selectedConversation.state.history.map((msg, idx) => (
                    <div
                      key={idx}
                      style={{
                        display: 'flex',
                        gap: SPACING[3],
                        alignItems: 'start'
                      }}
                    >
                      <div style={{
                        width: '32px',
                        height: '32px',
                        borderRadius: RADIUS.full,
                        background: msg.role === 'user' ? COLORS.gray[200] : COLORS.gray[100],
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0
                      }}>
                        {msg.role === 'user' ? (
                          <User size={16} color={COLORS.white} />
                        ) : (
                          <Bot size={16} color={COLORS.white} />
                        )}
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{
                          padding: SPACING[4],
                          background: COLORS.gray[50],
                          border: `1px solid ${COLORS.gray[100]}`,
                          borderRadius: RADIUS.lg,
                          fontSize: TYPOGRAPHY.fontSize.base,
                          lineHeight: TYPOGRAPHY.lineHeight.relaxed
                        }}>
                          {msg.content}
                        </div>
                        <div style={{
                          fontSize: TYPOGRAPHY.fontSize.xs,
                          color: COLORS.gray[600],
                          marginTop: SPACING[2],
                          display: 'flex',
                          alignItems: 'center',
                          gap: SPACING[3]
                        }}>
                          <Clock size={10} />
                          {new Date(msg.timestamp).toLocaleTimeString()}
                          {msg.intent && (
                            <>
                              <span>•</span>
                              <span>Intent: {msg.intent}</span>
                            </>
                          )}
                          {msg.confidence && (
                            <>
                              <span>•</span>
                              <span>Confidence: {(msg.confidence * 100).toFixed(0)}%</span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          ) : (
            <div style={{
              flex: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: COLORS.gray[600]
            }}>
              <div style={{ textAlign: 'center' }}>
                <MessageCircle size={48} style={{ margin: '0 auto', marginBottom: SPACING[4], opacity: 0.3 }} />
                <p style={{ fontSize: TYPOGRAPHY.fontSize.base }}>Select a conversation to view</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}