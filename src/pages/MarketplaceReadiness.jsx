import React, { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import { CheckCircle, XCircle, AlertTriangle, Play, Loader2, FileText } from "lucide-react";
import { COLORS, TYPOGRAPHY, SPACING, RADIUS } from "@/components/design/tokens";

export default function MarketplaceReadiness() {
  const [testResults, setTestResults] = useState(null);
  const [activeTest, setActiveTest] = useState(null);

  const { data: squareConnection } = useQuery({
    queryKey: ['squareConnection'],
    queryFn: async () => {
      const res = await base44.functions.invoke('squareGetConnection', {});
      return res.data;
    }
  });

  const { data: auditLogs } = useQuery({
    queryKey: ['recentAuditLogs'],
    queryFn: async () => {
      const logs = await base44.entities.AuditLog.list('-timestamp', 50);
      return logs;
    }
  });

  const runTestMutation = useMutation({
    mutationFn: async (testName) => {
      setActiveTest(testName);
      const res = await base44.functions.invoke('validateMarketplaceCompliance', {
        test: testName
      });
      return res.data;
    },
    onSuccess: (data, testName) => {
      setTestResults(prev => ({ ...prev, [testName]: data }));
      setActiveTest(null);
    },
    onError: () => {
      setActiveTest(null);
    }
  });

  const tests = [
    {
      id: 'oauth',
      name: 'OAuth Flow',
      description: 'Verify OAuth connection, token refresh, and scope validation',
      critical: true
    },
    {
      id: 'webhook',
      name: 'Webhook Security',
      description: 'Test webhook signature verification and idempotency',
      critical: true
    },
    {
      id: 'tenant_isolation',
      name: 'Tenant Isolation',
      description: 'Verify RLS enforcement and data separation',
      critical: true
    },
    {
      id: 'approval_flow',
      name: 'Approval Workflow',
      description: 'Test write action approval and token signing',
      critical: true
    },
    {
      id: 'rate_limits',
      name: 'Rate Limiting',
      description: 'Verify API rate limit handling',
      critical: false
    },
    {
      id: 'error_handling',
      name: 'Error Recovery',
      description: 'Test graceful degradation and error responses',
      critical: false
    },
    {
      id: 'audit_trail',
      name: 'Audit Logging',
      description: 'Verify all actions are logged with proper metadata',
      critical: true
    },
    {
      id: 'ai_disclosure',
      name: 'AI Transparency',
      description: 'Check AI disclosure and human override availability',
      critical: true
    }
  ];

  const criticalTests = tests.filter(t => t.critical);
  const passedCritical = criticalTests.filter(t => 
    testResults?.[t.id]?.status === 'pass'
  ).length;

  const isMarketplaceReady = squareConnection?.connected && 
                             passedCritical === criticalTests.length;

  return (
    <div style={{
      minHeight: '100vh',
      background: COLORS.black,
      color: COLORS.white,
      padding: SPACING[6],
      fontFamily: TYPOGRAPHY.fontFamily.sans
    }}>
      <div style={{
        maxWidth: '1200px',
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
            Square Marketplace
          </p>
          <h1 style={{
            fontSize: TYPOGRAPHY.fontSize['3xl'],
            fontWeight: TYPOGRAPHY.fontWeight.light,
            letterSpacing: TYPOGRAPHY.letterSpacing.tight,
            marginBottom: SPACING[6]
          }}>
            Readiness Testing
          </h1>

          {/* Status Banner */}
          <div style={{
            padding: SPACING[6],
            background: isMarketplaceReady 
              ? 'rgba(0, 255, 0, 0.05)' 
              : 'rgba(255, 170, 0, 0.05)',
            border: `1px solid ${isMarketplaceReady 
              ? 'rgba(0, 255, 0, 0.2)' 
              : 'rgba(255, 170, 0, 0.2)'}`,
            borderRadius: RADIUS.lg,
            display: 'flex',
            alignItems: 'center',
            gap: SPACING[4]
          }}>
            {isMarketplaceReady ? (
              <CheckCircle size={32} color={COLORS.state.success} />
            ) : (
              <AlertTriangle size={32} color={COLORS.state.warning} />
            )}
            <div style={{ flex: 1 }}>
              <div style={{
                fontSize: TYPOGRAPHY.fontSize.lg,
                fontWeight: TYPOGRAPHY.fontWeight.medium,
                marginBottom: SPACING[2]
              }}>
                {isMarketplaceReady 
                  ? 'Marketplace Ready' 
                  : 'Compliance Testing Required'}
              </div>
              <div style={{
                fontSize: TYPOGRAPHY.fontSize.sm,
                color: COLORS.gray[600]
              }}>
                Critical tests passed: {passedCritical} / {criticalTests.length}
              </div>
            </div>
          </div>
        </div>

        {/* Test Suite */}
        <div style={{
          marginBottom: SPACING[12]
        }}>
          <h2 style={{
            fontSize: TYPOGRAPHY.fontSize.lg,
            fontWeight: TYPOGRAPHY.fontWeight.medium,
            marginBottom: SPACING[6]
          }}>
            Compliance Tests
          </h2>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: SPACING[4]
          }}>
            {tests.map((test) => {
              const result = testResults?.[test.id];
              const isRunning = activeTest === test.id;

              return (
                <div
                  key={test.id}
                  style={{
                    padding: SPACING[5],
                    background: COLORS.gray[50],
                    border: `1px solid ${COLORS.gray[100]}`,
                    borderRadius: RADIUS.lg
                  }}
                >
                  <div style={{
                    display: 'flex',
                    alignItems: 'start',
                    justifyContent: 'space-between',
                    marginBottom: SPACING[3]
                  }}>
                    <div>
                      <div style={{
                        fontSize: TYPOGRAPHY.fontSize.base,
                        fontWeight: TYPOGRAPHY.fontWeight.medium,
                        marginBottom: SPACING[1]
                      }}>
                        {test.name}
                      </div>
                      {test.critical && (
                        <div style={{
                          fontSize: TYPOGRAPHY.fontSize.xs,
                          color: COLORS.state.warning
                        }}>
                          Critical
                        </div>
                      )}
                    </div>
                    {result && (
                      result.status === 'pass' ? (
                        <CheckCircle size={20} color={COLORS.state.success} />
                      ) : (
                        <XCircle size={20} color={COLORS.state.error} />
                      )
                    )}
                  </div>

                  <p style={{
                    fontSize: TYPOGRAPHY.fontSize.sm,
                    color: COLORS.gray[700],
                    marginBottom: SPACING[4]
                  }}>
                    {test.description}
                  </p>

                  {result?.message && (
                    <div style={{
                      padding: SPACING[3],
                      background: COLORS.gray[100],
                      borderRadius: RADIUS.base,
                      fontSize: TYPOGRAPHY.fontSize.xs,
                      color: COLORS.gray[800],
                      marginBottom: SPACING[3]
                    }}>
                      {result.message}
                    </div>
                  )}

                  <button
                    onClick={() => runTestMutation.mutate(test.id)}
                    disabled={isRunning}
                    style={{
                      width: '100%',
                      padding: `${SPACING[2]} ${SPACING[4]}`,
                      background: isRunning ? COLORS.gray[100] : COLORS.white,
                      border: 'none',
                      borderRadius: RADIUS.base,
                      color: COLORS.black,
                      fontSize: TYPOGRAPHY.fontSize.sm,
                      cursor: isRunning ? 'not-allowed' : 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: SPACING[2],
                      transition: '150ms'
                    }}
                  >
                    {isRunning ? (
                      <>
                        <Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} />
                        Running...
                      </>
                    ) : (
                      <>
                        <Play size={16} />
                        Run Test
                      </>
                    )}
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {/* Audit Trail Sample */}
        <div>
          <h2 style={{
            fontSize: TYPOGRAPHY.fontSize.lg,
            fontWeight: TYPOGRAPHY.fontWeight.medium,
            marginBottom: SPACING[6],
            display: 'flex',
            alignItems: 'center',
            gap: SPACING[3]
          }}>
            <FileText size={20} />
            Recent Audit Logs
          </h2>

          {!auditLogs || auditLogs.length === 0 ? (
            <div style={{
              padding: SPACING[8],
              textAlign: 'center',
              color: COLORS.gray[600],
              background: COLORS.gray[50],
              border: `1px solid ${COLORS.gray[100]}`,
              borderRadius: RADIUS.lg
            }}>
              No audit logs yet
            </div>
          ) : (
            <div style={{
              background: COLORS.gray[50],
              border: `1px solid ${COLORS.gray[100]}`,
              borderRadius: RADIUS.lg,
              overflow: 'hidden'
            }}>
              {auditLogs.slice(0, 10).map((log, idx) => (
                <div
                  key={log.id}
                  style={{
                    padding: SPACING[4],
                    borderBottom: idx < 9 ? `1px solid ${COLORS.gray[100]}` : 'none',
                    display: 'flex',
                    alignItems: 'center',
                    gap: SPACING[4]
                  }}
                >
                  {log.status === 'success' ? (
                    <CheckCircle size={16} color={COLORS.state.success} />
                  ) : log.status === 'failed' ? (
                    <XCircle size={16} color={COLORS.state.error} />
                  ) : (
                    <AlertTriangle size={16} color={COLORS.state.warning} />
                  )}
                  <div style={{ flex: 1 }}>
                    <div style={{
                      fontSize: TYPOGRAPHY.fontSize.sm,
                      color: COLORS.white,
                      marginBottom: SPACING[1]
                    }}>
                      {log.action_type.replace(/_/g, ' ')}
                    </div>
                    <div style={{
                      fontSize: TYPOGRAPHY.fontSize.xs,
                      color: COLORS.gray[600]
                    }}>
                      {log.actor_email} • {new Date(log.timestamp).toLocaleString()}
                    </div>
                  </div>
                  {log.target_entity && (
                    <div style={{
                      fontSize: TYPOGRAPHY.fontSize.xs,
                      color: COLORS.gray[700],
                      fontFamily: TYPOGRAPHY.fontFamily.mono
                    }}>
                      {log.target_entity.substring(0, 12)}...
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}