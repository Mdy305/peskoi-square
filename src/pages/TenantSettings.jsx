import React from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import { Settings, Save, Shield } from "lucide-react";
import { COLORS, TYPOGRAPHY, SPACING, RADIUS } from "@/components/design/tokens";

export default function TenantSettings() {
  const queryClient = useQueryClient();
  const [config, setConfig] = React.useState(null);

  const { data: squareConnection } = useQuery({
    queryKey: ['squareConnection'],
    queryFn: async () => {
      const res = await base44.functions.invoke('squareGetConnection', {});
      return res.data;
    }
  });

  const { data: existingConfig } = useQuery({
    queryKey: ['tenantConfig'],
    queryFn: async () => {
      const configs = await base44.entities.TenantConfiguration.filter({
        merchant_id: squareConnection?.merchant_id
      });
      return configs[0];
    },
    enabled: !!squareConnection?.merchant_id
  });

  React.useEffect(() => {
    if (existingConfig) {
      setConfig(existingConfig);
    } else if (squareConnection?.merchant_id) {
      setConfig({
        merchant_id: squareConnection.merchant_id,
        ai_enabled: true,
        voice_enabled: true,
        proactive_suggestions_enabled: true,
        auto_reminders_enabled: false,
        review_requests_enabled: false,
        max_messages_per_customer_per_day: 2,
        booking_buffer_minutes: 15,
        require_approval_for_bookings: true,
        require_approval_for_campaigns: true,
        webhook_notifications_enabled: true,
        data_retention_days: 90,
        timezone: 'America/New_York',
        ai_personality: 'luxury',
        compliance_mode: 'strict'
      });
    }
  }, [existingConfig, squareConnection]);

  const saveMutation = useMutation({
    mutationFn: async () => {
      if (existingConfig) {
        return await base44.entities.TenantConfiguration.update(existingConfig.id, config);
      } else {
        return await base44.entities.TenantConfiguration.create(config);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['tenantConfig']);
    }
  });

  if (!squareConnection?.connected) {
    return (
      <div style={{
        minHeight: '100vh',
        background: COLORS.black,
        color: COLORS.white,
        padding: SPACING[6],
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <div style={{ textAlign: 'center' }}>
          <Shield size={48} style={{ margin: '0 auto', marginBottom: SPACING[4], opacity: 0.3 }} />
          <p>Connect Square to configure tenant settings</p>
        </div>
      </div>
    );
  }

  if (!config) return null;

  return (
    <div style={{
      minHeight: '100vh',
      background: COLORS.black,
      color: COLORS.white,
      padding: SPACING[6],
      fontFamily: TYPOGRAPHY.fontFamily.sans
    }}>
      <div style={{
        maxWidth: '800px',
        margin: '0 auto'
      }}>
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
            Configuration
          </p>
          <h1 style={{
            fontSize: TYPOGRAPHY.fontSize['3xl'],
            fontWeight: TYPOGRAPHY.fontWeight.light,
            letterSpacing: TYPOGRAPHY.letterSpacing.tight
          }}>
            Tenant Settings
          </h1>
        </div>

        {/* AI Features */}
        <section style={{ marginBottom: SPACING[8] }}>
          <h2 style={{
            fontSize: TYPOGRAPHY.fontSize.lg,
            fontWeight: TYPOGRAPHY.fontWeight.medium,
            marginBottom: SPACING[4]
          }}>
            AI Features
          </h2>
          
          <div style={{
            background: COLORS.gray[50],
            border: `1px solid ${COLORS.gray[100]}`,
            borderRadius: RADIUS.lg,
            padding: SPACING[5]
          }}>
            <ToggleSetting
              label="AI Assistant"
              description="Enable AI-powered booking and support"
              checked={config.ai_enabled}
              onChange={(v) => setConfig({...config, ai_enabled: v})}
            />
            <ToggleSetting
              label="Voice Calls"
              description="Answer calls with AI concierge"
              checked={config.voice_enabled}
              onChange={(v) => setConfig({...config, voice_enabled: v})}
            />
            <ToggleSetting
              label="Proactive Suggestions"
              description="AI suggests next-best actions"
              checked={config.proactive_suggestions_enabled}
              onChange={(v) => setConfig({...config, proactive_suggestions_enabled: v})}
            />
            
            <SelectSetting
              label="AI Personality"
              value={config.ai_personality}
              options={[
                { value: 'professional', label: 'Professional' },
                { value: 'friendly', label: 'Friendly' },
                { value: 'luxury', label: 'Luxury' },
                { value: 'casual', label: 'Casual' }
              ]}
              onChange={(v) => setConfig({...config, ai_personality: v})}
            />
          </div>
        </section>

        {/* Automation */}
        <section style={{ marginBottom: SPACING[8] }}>
          <h2 style={{
            fontSize: TYPOGRAPHY.fontSize.lg,
            fontWeight: TYPOGRAPHY.fontWeight.medium,
            marginBottom: SPACING[4]
          }}>
            Automation
          </h2>
          
          <div style={{
            background: COLORS.gray[50],
            border: `1px solid ${COLORS.gray[100]}`,
            borderRadius: RADIUS.lg,
            padding: SPACING[5]
          }}>
            <ToggleSetting
              label="Auto Reminders"
              description="Send appointment reminders automatically"
              checked={config.auto_reminders_enabled}
              onChange={(v) => setConfig({...config, auto_reminders_enabled: v})}
            />
            <ToggleSetting
              label="Review Requests"
              description="Request reviews after completed appointments"
              checked={config.review_requests_enabled}
              onChange={(v) => setConfig({...config, review_requests_enabled: v})}
            />
            
            <NumberSetting
              label="Max Daily Messages"
              description="Maximum automated messages per customer per day"
              value={config.max_messages_per_customer_per_day}
              onChange={(v) => setConfig({...config, max_messages_per_customer_per_day: v})}
            />
          </div>
        </section>

        {/* Compliance */}
        <section style={{ marginBottom: SPACING[8] }}>
          <h2 style={{
            fontSize: TYPOGRAPHY.fontSize.lg,
            fontWeight: TYPOGRAPHY.fontWeight.medium,
            marginBottom: SPACING[4]
          }}>
            Compliance & Security
          </h2>
          
          <div style={{
            background: COLORS.gray[50],
            border: `1px solid ${COLORS.gray[100]}`,
            borderRadius: RADIUS.lg,
            padding: SPACING[5]
          }}>
            <ToggleSetting
              label="Require Booking Approval"
              description="Manual approval required for AI bookings"
              checked={config.require_approval_for_bookings}
              onChange={(v) => setConfig({...config, require_approval_for_bookings: v})}
            />
            <ToggleSetting
              label="Require Campaign Approval"
              description="Manual approval required for campaigns"
              checked={config.require_approval_for_campaigns}
              onChange={(v) => setConfig({...config, require_approval_for_campaigns: v})}
            />
            
            <SelectSetting
              label="Compliance Mode"
              value={config.compliance_mode}
              options={[
                { value: 'strict', label: 'Strict (Marketplace Ready)' },
                { value: 'balanced', label: 'Balanced' },
                { value: 'permissive', label: 'Permissive (Testing Only)' }
              ]}
              onChange={(v) => setConfig({...config, compliance_mode: v})}
            />
            
            <NumberSetting
              label="Data Retention (Days)"
              description="Days to retain conversation logs"
              value={config.data_retention_days}
              onChange={(v) => setConfig({...config, data_retention_days: v})}
            />
          </div>
        </section>

        {/* Save Button */}
        <button
          onClick={() => saveMutation.mutate()}
          disabled={saveMutation.isPending}
          style={{
            width: '100%',
            padding: `${SPACING[4]} ${SPACING[6]}`,
            background: COLORS.white,
            border: 'none',
            borderRadius: RADIUS.base,
            color: COLORS.black,
            fontSize: TYPOGRAPHY.fontSize.base,
            fontWeight: TYPOGRAPHY.fontWeight.medium,
            cursor: saveMutation.isPending ? 'not-allowed' : 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: SPACING[2]
          }}
        >
          <Save size={20} />
          {saveMutation.isPending ? 'Saving...' : 'Save Settings'}
        </button>
      </div>
    </div>
  );
}

function ToggleSetting({ label, description, checked, onChange }) {
  return (
    <div style={{
      display: 'flex',
      alignItems: 'start',
      justifyContent: 'space-between',
      padding: `${SPACING[3]} 0`,
      borderBottom: `1px solid ${COLORS.gray[100]}`
    }}>
      <div style={{ flex: 1, marginRight: SPACING[4] }}>
        <div style={{
          fontSize: TYPOGRAPHY.fontSize.base,
          color: COLORS.white,
          marginBottom: SPACING[1]
        }}>
          {label}
        </div>
        <div style={{
          fontSize: TYPOGRAPHY.fontSize.sm,
          color: COLORS.gray[700]
        }}>
          {description}
        </div>
      </div>
      <button
        onClick={() => onChange(!checked)}
        style={{
          width: '48px',
          height: '28px',
          borderRadius: '14px',
          background: checked ? COLORS.white : COLORS.gray[200],
          border: 'none',
          cursor: 'pointer',
          position: 'relative',
          transition: '200ms'
        }}
      >
        <div style={{
          position: 'absolute',
          top: '4px',
          left: checked ? '24px' : '4px',
          width: '20px',
          height: '20px',
          borderRadius: '10px',
          background: checked ? COLORS.black : COLORS.gray[400],
          transition: '200ms'
        }} />
      </button>
    </div>
  );
}

function SelectSetting({ label, value, options, onChange }) {
  return (
    <div style={{
      padding: `${SPACING[3]} 0`,
      borderBottom: `1px solid ${COLORS.gray[100]}`
    }}>
      <div style={{
        fontSize: TYPOGRAPHY.fontSize.base,
        color: COLORS.white,
        marginBottom: SPACING[2]
      }}>
        {label}
      </div>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        style={{
          width: '100%',
          padding: `${SPACING[2]} ${SPACING[3]}`,
          background: COLORS.gray[100],
          border: `1px solid ${COLORS.gray[200]}`,
          borderRadius: RADIUS.base,
          color: COLORS.white,
          fontSize: TYPOGRAPHY.fontSize.sm
        }}
      >
        {options.map(opt => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>
    </div>
  );
}

function NumberSetting({ label, description, value, onChange }) {
  return (
    <div style={{
      padding: `${SPACING[3]} 0`,
      borderBottom: `1px solid ${COLORS.gray[100]}`
    }}>
      <div style={{
        fontSize: TYPOGRAPHY.fontSize.base,
        color: COLORS.white,
        marginBottom: SPACING[1]
      }}>
        {label}
      </div>
      <div style={{
        fontSize: TYPOGRAPHY.fontSize.sm,
        color: COLORS.gray[700],
        marginBottom: SPACING[2]
      }}>
        {description}
      </div>
      <input
        type="number"
        value={value}
        onChange={(e) => onChange(parseInt(e.target.value))}
        style={{
          width: '120px',
          padding: `${SPACING[2]} ${SPACING[3]}`,
          background: COLORS.gray[100],
          border: `1px solid ${COLORS.gray[200]}`,
          borderRadius: RADIUS.base,
          color: COLORS.white,
          fontSize: TYPOGRAPHY.fontSize.sm
        }}
      />
    </div>
  );
}