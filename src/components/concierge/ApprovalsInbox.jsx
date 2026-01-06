import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { CheckCircle, XCircle, Clock, AlertCircle } from "lucide-react";
import { COLORS, TYPOGRAPHY, SPACING, RADIUS } from "../design/tokens";

export default function ApprovalsInbox() {
  const [approvals, setApprovals] = useState([]);
  const queryClient = useQueryClient();

  const approveMutation = useMutation({
    mutationFn: async (approvalToken) => {
      const res = await base44.functions.invoke('executeApprovedAction', {
        approvalToken
      });
      return res.data;
    },
    onSuccess: (data, approvalToken) => {
      setApprovals(prev => prev.map(a => 
        a.approvalToken === approvalToken 
          ? { ...a, status: 'approved' }
          : a
      ));
    }
  });

  const rejectApproval = (approvalToken) => {
    setApprovals(prev => prev.map(a =>
      a.approvalToken === approvalToken
        ? { ...a, status: 'rejected' }
        : a
    ));
  };

  const pendingApprovals = approvals.filter(a => a.status === 'pending');
  const completedApprovals = approvals.filter(a => a.status !== 'pending');

  return (
    <div style={{
      minHeight: '100vh',
      background: COLORS.black,
      color: COLORS.white,
      padding: SPACING[6],
      fontFamily: TYPOGRAPHY.fontFamily.sans
    }}>
      <div style={{
        maxWidth: '1000px',
        margin: '0 auto'
      }}>
        {/* Header */}
        <div style={{
          marginBottom: SPACING[12]
        }}>
          <p style={{
            fontSize: TYPOGRAPHY.fontSize.xs,
            color: COLORS.gray[600],
            letterSpacing: TYPOGRAPHY.letterSpacing.wider,
            textTransform: 'uppercase',
            marginBottom: SPACING[3]
          }}>
            Approvals
          </p>
          <h1 style={{
            fontSize: TYPOGRAPHY.fontSize['3xl'],
            fontWeight: TYPOGRAPHY.fontWeight.light,
            letterSpacing: TYPOGRAPHY.letterSpacing.tight
          }}>
            Pending Actions
          </h1>
        </div>

        {/* Pending Approvals */}
        {pendingApprovals.length === 0 ? (
          <div style={{
            textAlign: 'center',
            padding: SPACING[12],
            color: COLORS.gray[600]
          }}>
            <CheckCircle size={48} style={{ margin: '0 auto', marginBottom: SPACING[4], opacity: 0.3 }} />
            <p style={{ fontSize: TYPOGRAPHY.fontSize.base }}>No pending approvals</p>
          </div>
        ) : (
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: SPACING[4]
          }}>
            {pendingApprovals.map((approval, idx) => (
              <div
                key={idx}
                style={{
                  background: COLORS.gray[50],
                  border: `1px solid ${COLORS.gray[100]}`,
                  borderRadius: RADIUS.lg,
                  padding: SPACING[6]
                }}
              >
                <div style={{
                  display: 'flex',
                  alignItems: 'start',
                  gap: SPACING[4],
                  marginBottom: SPACING[4]
                }}>
                  <AlertCircle size={24} color={COLORS.state.warning} />
                  <div style={{ flex: 1 }}>
                    <h3 style={{
                      fontSize: TYPOGRAPHY.fontSize.lg,
                      fontWeight: TYPOGRAPHY.fontWeight.medium,
                      marginBottom: SPACING[2]
                    }}>
                      {formatActionName(approval.action)}
                    </h3>
                    <p style={{
                      fontSize: TYPOGRAPHY.fontSize.sm,
                      color: COLORS.gray[700],
                      marginBottom: SPACING[3]
                    }}>
                      {approval.reasoning}
                    </p>
                    <div style={{
                      fontSize: TYPOGRAPHY.fontSize.xs,
                      color: COLORS.gray[600],
                      fontFamily: TYPOGRAPHY.fontFamily.mono
                    }}>
                      {JSON.stringify(approval.parameters, null, 2)}
                    </div>
                  </div>
                  <div style={{
                    fontSize: TYPOGRAPHY.fontSize.xs,
                    color: COLORS.gray[600]
                  }}>
                    <Clock size={12} style={{ display: 'inline', marginRight: SPACING[1] }} />
                    Expires {new Date(approval.expiresAt).toLocaleTimeString()}
                  </div>
                </div>

                <div style={{
                  display: 'flex',
                  gap: SPACING[3],
                  justifyContent: 'flex-end'
                }}>
                  <button
                    onClick={() => rejectApproval(approval.approvalToken)}
                    style={{
                      padding: `${SPACING[2]} ${SPACING[5]}`,
                      background: 'transparent',
                      border: `1px solid ${COLORS.gray[300]}`,
                      borderRadius: RADIUS.base,
                      color: COLORS.gray[700],
                      fontSize: TYPOGRAPHY.fontSize.sm,
                      cursor: 'pointer',
                      transition: '150ms'
                    }}
                  >
                    Reject
                  </button>
                  <button
                    onClick={() => approveMutation.mutate(approval.approvalToken)}
                    disabled={approveMutation.isPending}
                    style={{
                      padding: `${SPACING[2]} ${SPACING[5]}`,
                      background: COLORS.white,
                      border: 'none',
                      borderRadius: RADIUS.base,
                      color: COLORS.black,
                      fontSize: TYPOGRAPHY.fontSize.sm,
                      cursor: approveMutation.isPending ? 'not-allowed' : 'pointer',
                      fontWeight: TYPOGRAPHY.fontWeight.medium,
                      transition: '150ms'
                    }}
                  >
                    {approveMutation.isPending ? 'Executing...' : 'Approve'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Completed Approvals */}
        {completedApprovals.length > 0 && (
          <div style={{ marginTop: SPACING[12] }}>
            <h2 style={{
              fontSize: TYPOGRAPHY.fontSize.lg,
              fontWeight: TYPOGRAPHY.fontWeight.medium,
              marginBottom: SPACING[6],
              color: COLORS.gray[700]
            }}>
              Recent Activity
            </h2>
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: SPACING[3]
            }}>
              {completedApprovals.slice(0, 5).map((approval, idx) => (
                <div
                  key={idx}
                  style={{
                    padding: SPACING[4],
                    background: COLORS.gray[50],
                    border: `1px solid ${COLORS.gray[100]}`,
                    borderRadius: RADIUS.base,
                    display: 'flex',
                    alignItems: 'center',
                    gap: SPACING[3]
                  }}
                >
                  {approval.status === 'approved' ? (
                    <CheckCircle size={20} color={COLORS.state.success} />
                  ) : (
                    <XCircle size={20} color={COLORS.state.error} />
                  )}
                  <div style={{ flex: 1 }}>
                    <div style={{
                      fontSize: TYPOGRAPHY.fontSize.sm,
                      color: COLORS.white
                    }}>
                      {formatActionName(approval.action)}
                    </div>
                    <div style={{
                      fontSize: TYPOGRAPHY.fontSize.xs,
                      color: COLORS.gray[600]
                    }}>
                      {new Date(approval.createdAt).toLocaleString()}
                    </div>
                  </div>
                  <div style={{
                    fontSize: TYPOGRAPHY.fontSize.xs,
                    color: approval.status === 'approved' ? COLORS.state.success : COLORS.state.error,
                    textTransform: 'uppercase',
                    letterSpacing: TYPOGRAPHY.letterSpacing.wide
                  }}>
                    {approval.status}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function formatActionName(action) {
  return action
    .replace(/([A-Z])/g, ' $1')
    .replace(/^./, str => str.toUpperCase())
    .trim();
}