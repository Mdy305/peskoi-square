import React, { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import { Play, CheckCircle, XCircle, AlertTriangle, FileText, Loader2 } from "lucide-react";
import { COLORS, TYPOGRAPHY, SPACING, RADIUS } from "@/components/design/tokens";

export default function ComplianceTesting() {
  const [results, setResults] = useState({});
  const [runningTest, setRunningTest] = useState(null);
  const [testLog, setTestLog] = useState([]);

  const addLog = (message, type = 'info') => {
    setTestLog(prev => [...prev, { message, type, timestamp: new Date().toISOString() }]);
  };

  const runTestMutation = useMutation({
    mutationFn: async (testId) => {
      setRunningTest(testId);
      addLog(`Starting ${testId}...`, 'info');
      
      const res = await base44.functions.invoke('runComplianceTest', { testId });
      return res.data;
    },
    onSuccess: (data, testId) => {
      setResults(prev => ({ ...prev, [testId]: data }));
      addLog(`${testId} completed: ${data.status}`, data.status === 'pass' ? 'success' : 'error');
      setRunningTest(null);
    },
    onError: (error, testId) => {
      addLog(`${testId} failed: ${error.message}`, 'error');
      setRunningTest(null);
    }
  });

  const runAllTests = async () => {
    setTestLog([]);
    addLog('Starting full compliance suite...', 'info');
    
    for (const test of tests) {
      if (!test.skip) {
        await runTestMutation.mutateAsync(test.id);
        await new Promise(resolve => setTimeout(resolve, 500));
      }
    }
    
    addLog('All tests completed', 'success');
  };

  const tests = [
    {
      id: 'oauth_token_exchange',
      name: 'OAuth Token Exchange',
      description: 'Validates OAuth flow from authorization to token storage',
      critical: true
    },
    {
      id: 'oauth_token_refresh',
      name: 'Token Refresh',
      description: 'Tests automatic token refresh before expiration',
      critical: true
    },
    {
      id: 'oauth_scope_validation',
      name: 'Scope Validation',
      description: 'Verifies all required OAuth scopes are granted',
      critical: true
    },
    {
      id: 'webhook_signature',
      name: 'Webhook Signature Verification',
      description: 'Tests HMAC-SHA256 signature validation',
      critical: true
    },
    {
      id: 'webhook_idempotency',
      name: 'Webhook Idempotency',
      description: 'Ensures duplicate webhooks are handled correctly',
      critical: true
    },
    {
      id: 'rls_read_isolation',
      name: 'RLS Read Isolation',
      description: 'Verifies tenants cannot read other tenant data',
      critical: true
    },
    {
      id: 'rls_write_isolation',
      name: 'RLS Write Isolation',
      description: 'Verifies tenants cannot modify other tenant data',
      critical: true
    },
    {
      id: 'approval_token_generation',
      name: 'Approval Token Generation',
      description: 'Tests secure token generation for write actions',
      critical: true
    },
    {
      id: 'approval_token_validation',
      name: 'Approval Token Validation',
      description: 'Tests token verification and replay protection',
      critical: true
    },
    {
      id: 'approval_execution',
      name: 'Approval Execution',
      description: 'Tests approved action execution with audit trail',
      critical: true
    },
    {
      id: 'audit_log_creation',
      name: 'Audit Log Creation',
      description: 'Verifies all actions create audit entries',
      critical: true
    },
    {
      id: 'audit_log_integrity',
      name: 'Audit Log Integrity',
      description: 'Tests audit log immutability and completeness',
      critical: true
    },
    {
      id: 'error_recovery',
      name: 'Error Recovery',
      description: 'Tests graceful failure and rollback',
      critical: false
    },
    {
      id: 'rate_limit_handling',
      name: 'Rate Limit Handling',
      description: 'Tests Square API rate limit compliance',
      critical: false
    }
  ];

  const passedTests = Object.values(results).filter(r => r.status === 'pass').length;
  const failedTests = Object.values(results).filter(r => r.status === 'fail').length;
  const criticalTests = tests.filter(t => t.critical);
  const criticalPassed = criticalTests.filter(t => results[t.id]?.status === 'pass').length;

  return (
    <div style={{
      minHeight: '100vh',
      background: COLORS.black,
      color: COLORS.white,
      padding: SPACING[6],
      fontFamily: TYPOGRAPHY.fontFamily.sans
    }}>
      <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{ marginBottom: SPACING[8] }}>
          <p style={{
            fontSize: TYPOGRAPHY.fontSize.xs,
            color: COLORS.gray[600],
            letterSpacing: TYPOGRAPHY.letterSpacing.wider,
            textTransform: 'uppercase',
            marginBottom: SPACING[3]
          }}>
            Marketplace Compliance
          </p>
          <h1 style={{
            fontSize: TYPOGRAPHY.fontSize['3xl'],
            fontWeight: TYPOGRAPHY.fontWeight.light,
            letterSpacing: TYPOGRAPHY.letterSpacing.tight,
            marginBottom: SPACING[6]
          }}>
            Testing Suite
          </h1>

          {/* Status Bar */}
          <div style={{
            display: 'flex',
            gap: SPACING[4],
            marginBottom: SPACING[6]
          }}>
            <StatCard label="Total Tests" value={tests.length} />
            <StatCard label="Passed" value={passedTests} color={COLORS.state.success} />
            <StatCard label="Failed" value={failedTests} color={COLORS.state.error} />
            <StatCard label="Critical Passed" value={`${criticalPassed}/${criticalTests.length}`} />
          </div>

          {/* Actions */}
          <button
            onClick={runAllTests}
            disabled={runningTest !== null}
            style={{
              padding: `${SPACING[3]} ${SPACING[6]}`,
              background: COLORS.white,
              color: COLORS.black,
              border: 'none',
              borderRadius: RADIUS.base,
              fontSize: TYPOGRAPHY.fontSize.sm,
              fontWeight: TYPOGRAPHY.fontWeight.medium,
              cursor: runningTest ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: SPACING[2]
            }}
          >
            {runningTest ? (
              <>
                <Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} />
                Running Tests...
              </>
            ) : (
              <>
                <Play size={16} />
                Run All Tests
              </>
            )}
          </button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 400px', gap: SPACING[6] }}>
          {/* Test List */}
          <div>
            <h2 style={{
              fontSize: TYPOGRAPHY.fontSize.lg,
              fontWeight: TYPOGRAPHY.fontWeight.medium,
              marginBottom: SPACING[4]
            }}>
              Test Cases
            </h2>

            <div style={{ display: 'flex', flexDirection: 'column', gap: SPACING[3] }}>
              {tests.map(test => {
                const result = results[test.id];
                const isRunning = runningTest === test.id;

                return (
                  <div
                    key={test.id}
                    style={{
                      padding: SPACING[4],
                      background: COLORS.gray[50],
                      border: `1px solid ${COLORS.gray[100]}`,
                      borderRadius: RADIUS.lg,
                      display: 'flex',
                      alignItems: 'start',
                      gap: SPACING[4]
                    }}
                  >
                    <div style={{ flex: 1 }}>
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: SPACING[2],
                        marginBottom: SPACING[2]
                      }}>
                        <span style={{
                          fontSize: TYPOGRAPHY.fontSize.base,
                          fontWeight: TYPOGRAPHY.fontWeight.medium
                        }}>
                          {test.name}
                        </span>
                        {test.critical && (
                          <span style={{
                            fontSize: TYPOGRAPHY.fontSize.xs,
                            color: COLORS.state.warning,
                            padding: `${SPACING[1]} ${SPACING[2]}`,
                            background: 'rgba(255,170,0,0.1)',
                            borderRadius: RADIUS.sm
                          }}>
                            Critical
                          </span>
                        )}
                      </div>
                      <p style={{
                        fontSize: TYPOGRAPHY.fontSize.sm,
                        color: COLORS.gray[700],
                        marginBottom: SPACING[3]
                      }}>
                        {test.description}
                      </p>

                      {result?.details && (
                        <div style={{
                          padding: SPACING[3],
                          background: COLORS.gray[100],
                          borderRadius: RADIUS.base,
                          fontSize: TYPOGRAPHY.fontSize.xs,
                          color: COLORS.gray[800],
                          fontFamily: TYPOGRAPHY.fontFamily.mono
                        }}>
                          {result.details}
                        </div>
                      )}
                    </div>

                    <div style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: SPACING[2]
                    }}>
                      {isRunning ? (
                        <Loader2 size={20} color={COLORS.gray[500]} style={{ animation: 'spin 1s linear infinite' }} />
                      ) : result ? (
                        result.status === 'pass' ? (
                          <CheckCircle size={20} color={COLORS.state.success} />
                        ) : (
                          <XCircle size={20} color={COLORS.state.error} />
                        )
                      ) : (
                        <div style={{
                          width: 20,
                          height: 20,
                          borderRadius: '50%',
                          border: `2px solid ${COLORS.gray[300]}`
                        }} />
                      )}

                      {!isRunning && (
                        <button
                          onClick={() => runTestMutation.mutate(test.id)}
                          style={{
                            padding: `${SPACING[1]} ${SPACING[3]}`,
                            background: 'transparent',
                            border: `1px solid ${COLORS.gray[200]}`,
                            borderRadius: RADIUS.sm,
                            color: COLORS.white,
                            fontSize: TYPOGRAPHY.fontSize.xs,
                            cursor: 'pointer'
                          }}
                        >
                          Run
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Test Log */}
          <div>
            <h2 style={{
              fontSize: TYPOGRAPHY.fontSize.lg,
              fontWeight: TYPOGRAPHY.fontWeight.medium,
              marginBottom: SPACING[4],
              display: 'flex',
              alignItems: 'center',
              gap: SPACING[2]
            }}>
              <FileText size={20} />
              Execution Log
            </h2>

            <div style={{
              background: COLORS.gray[50],
              border: `1px solid ${COLORS.gray[100]}`,
              borderRadius: RADIUS.lg,
              padding: SPACING[4],
              maxHeight: '600px',
              overflowY: 'auto',
              fontFamily: TYPOGRAPHY.fontFamily.mono,
              fontSize: TYPOGRAPHY.fontSize.xs
            }}>
              {testLog.length === 0 ? (
                <p style={{ color: COLORS.gray[600] }}>No tests run yet</p>
              ) : (
                testLog.map((log, idx) => (
                  <div
                    key={idx}
                    style={{
                      marginBottom: SPACING[2],
                      paddingBottom: SPACING[2],
                      borderBottom: idx < testLog.length - 1 ? `1px solid ${COLORS.gray[100]}` : 'none'
                    }}
                  >
                    <div style={{
                      color: log.type === 'success' ? COLORS.state.success :
                             log.type === 'error' ? COLORS.state.error :
                             COLORS.gray[700],
                      marginBottom: SPACING[1]
                    }}>
                      {log.message}
                    </div>
                    <div style={{
                      color: COLORS.gray[600],
                      fontSize: TYPOGRAPHY.fontSize['2xs']
                    }}>
                      {new Date(log.timestamp).toLocaleTimeString()}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ label, value, color = COLORS.white }) {
  return (
    <div style={{
      flex: 1,
      padding: SPACING[4],
      background: COLORS.gray[50],
      border: `1px solid ${COLORS.gray[100]}`,
      borderRadius: RADIUS.lg
    }}>
      <div style={{
        fontSize: TYPOGRAPHY.fontSize['2xl'],
        fontWeight: TYPOGRAPHY.fontWeight.light,
        color,
        marginBottom: SPACING[1]
      }}>
        {value}
      </div>
      <div style={{
        fontSize: TYPOGRAPHY.fontSize.xs,
        color: COLORS.gray[600],
        textTransform: 'uppercase',
        letterSpacing: TYPOGRAPHY.letterSpacing.wide
      }}>
        {label}
      </div>
    </div>
  );
}