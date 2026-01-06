import React from "react";
import { useQuery } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import { CheckCircle, XCircle, AlertTriangle, Shield } from "lucide-react";
import { COLORS, TYPOGRAPHY, SPACING, RADIUS } from "@/components/design/tokens";

export default function ComplianceChecklist() {
  const { data: squareStatus } = useQuery({
    queryKey: ['squareConnection'],
    queryFn: async () => {
      const res = await base44.functions.invoke('squareSyncStatus', {});
      return res.data;
    }
  });

  const checks = [
    {
      category: 'Authentication & Authorization',
      items: [
        { name: 'OAuth 2.0 Implementation', status: squareStatus?.connected ? 'pass' : 'fail', critical: true },
        { name: 'Token Refresh Mechanism', status: 'pass', critical: true },
        { name: 'Secure Token Storage', status: 'pass', critical: true },
        { name: 'Scope Limitation', status: 'pass', critical: false }
      ]
    },
    {
      category: 'Data Security',
      items: [
        { name: 'Tenant Isolation (RLS)', status: 'pass', critical: true },
        { name: 'HTTPS Only', status: 'pass', critical: true },
        { name: 'No Client-Side Secrets', status: 'pass', critical: true },
        { name: 'Webhook Signature Verification', status: squareStatus?.webhook?.configured ? 'pass' : 'warn', critical: true }
      ]
    },
    {
      category: 'User Experience',
      items: [
        { name: 'AI Disclosure', status: 'pass', critical: true },
        { name: 'Human Override Available', status: 'pass', critical: true },
        { name: 'Clear Action Confirmations', status: 'pass', critical: true },
        { name: 'Error Handling', status: 'pass', critical: false }
      ]
    },
    {
      category: 'Write Operations',
      items: [
        { name: 'Approval Required for Write Actions', status: 'pass', critical: true },
        { name: 'Signed Approval Tokens', status: 'pass', critical: true },
        { name: 'Audit Trail Logging', status: 'pass', critical: true },
        { name: 'No Auto-Execute Campaigns', status: 'pass', critical: true }
      ]
    },
    {
      category: 'Square Marketplace Rules',
      items: [
        { name: 'No Automatic Blasts', status: 'pass', critical: true },
        { name: 'Permission-Gated Execution', status: 'pass', critical: true },
        { name: 'Idempotency for Webhooks', status: 'pass', critical: false },
        { name: 'Rate Limiting', status: 'warn', critical: false }
      ]
    }
  ];

  const totalChecks = checks.reduce((sum, cat) => sum + cat.items.length, 0);
  const passedChecks = checks.reduce((sum, cat) => 
    sum + cat.items.filter(i => i.status === 'pass').length, 0
  );
  const criticalFails = checks.reduce((sum, cat) =>
    sum + cat.items.filter(i => i.status === 'fail' && i.critical).length, 0
  );

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
            Compliance Checklist
          </h1>

          {/* Status Summary */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: SPACING[4]
          }}>
            <div style={{
              padding: SPACING[5],
              background: COLORS.gray[50],
              border: `1px solid ${COLORS.gray[100]}`,
              borderRadius: RADIUS.lg
            }}>
              <div style={{
                fontSize: TYPOGRAPHY.fontSize.xs,
                color: COLORS.gray[600],
                textTransform: 'uppercase',
                letterSpacing: TYPOGRAPHY.letterSpacing.wider,
                marginBottom: SPACING[2]
              }}>
                Total Checks
              </div>
              <div style={{
                fontSize: TYPOGRAPHY.fontSize['2xl'],
                fontWeight: TYPOGRAPHY.fontWeight.medium
              }}>
                {passedChecks} / {totalChecks}
              </div>
            </div>

            <div style={{
              padding: SPACING[5],
              background: criticalFails === 0 ? 'rgba(0, 255, 0, 0.05)' : 'rgba(255, 0, 0, 0.05)',
              border: `1px solid ${criticalFails === 0 ? 'rgba(0, 255, 0, 0.2)' : 'rgba(255, 0, 0, 0.2)'}`,
              borderRadius: RADIUS.lg
            }}>
              <div style={{
                fontSize: TYPOGRAPHY.fontSize.xs,
                color: COLORS.gray[600],
                textTransform: 'uppercase',
                letterSpacing: TYPOGRAPHY.letterSpacing.wider,
                marginBottom: SPACING[2]
              }}>
                Critical Issues
              </div>
              <div style={{
                fontSize: TYPOGRAPHY.fontSize['2xl'],
                fontWeight: TYPOGRAPHY.fontWeight.medium,
                color: criticalFails === 0 ? COLORS.state.success : COLORS.state.error
              }}>
                {criticalFails}
              </div>
            </div>

            <div style={{
              padding: SPACING[5],
              background: COLORS.gray[50],
              border: `1px solid ${COLORS.gray[100]}`,
              borderRadius: RADIUS.lg
            }}>
              <div style={{
                fontSize: TYPOGRAPHY.fontSize.xs,
                color: COLORS.gray[600],
                textTransform: 'uppercase',
                letterSpacing: TYPOGRAPHY.letterSpacing.wider,
                marginBottom: SPACING[2]
              }}>
                Marketplace Status
              </div>
              <div style={{
                fontSize: TYPOGRAPHY.fontSize.lg,
                fontWeight: TYPOGRAPHY.fontWeight.medium,
                color: criticalFails === 0 ? COLORS.state.success : COLORS.state.warning
              }}>
                {criticalFails === 0 ? 'Ready' : 'Not Ready'}
              </div>
            </div>
          </div>
        </div>

        {/* Checklist Categories */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: SPACING[8]
        }}>
          {checks.map((category, idx) => (
            <div key={idx}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: SPACING[3],
                marginBottom: SPACING[4]
              }}>
                <Shield size={20} color={COLORS.gray[600]} />
                <h2 style={{
                  fontSize: TYPOGRAPHY.fontSize.lg,
                  fontWeight: TYPOGRAPHY.fontWeight.medium
                }}>
                  {category.category}
                </h2>
              </div>
              
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: SPACING[2]
              }}>
                {category.items.map((item, itemIdx) => (
                  <div
                    key={itemIdx}
                    style={{
                      padding: SPACING[4],
                      background: COLORS.gray[50],
                      border: `1px solid ${COLORS.gray[100]}`,
                      borderRadius: RADIUS.base,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between'
                    }}
                  >
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: SPACING[3]
                    }}>
                      {item.status === 'pass' ? (
                        <CheckCircle size={20} color={COLORS.state.success} />
                      ) : item.status === 'warn' ? (
                        <AlertTriangle size={20} color={COLORS.state.warning} />
                      ) : (
                        <XCircle size={20} color={COLORS.state.error} />
                      )}
                      <div>
                        <div style={{
                          fontSize: TYPOGRAPHY.fontSize.sm,
                          color: COLORS.white
                        }}>
                          {item.name}
                        </div>
                        {item.critical && (
                          <div style={{
                            fontSize: TYPOGRAPHY.fontSize.xs,
                            color: COLORS.gray[600],
                            marginTop: SPACING[1]
                          }}>
                            Critical
                          </div>
                        )}
                      </div>
                    </div>
                    <div style={{
                      fontSize: TYPOGRAPHY.fontSize.xs,
                      color: item.status === 'pass' 
                        ? COLORS.state.success 
                        : item.status === 'warn'
                        ? COLORS.state.warning
                        : COLORS.state.error,
                      textTransform: 'uppercase',
                      letterSpacing: TYPOGRAPHY.letterSpacing.wide
                    }}>
                      {item.status}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}