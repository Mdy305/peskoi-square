import React, { useEffect, useState } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";

export default function ConciergeWidget() {
  const [widgetLoaded, setWidgetLoaded] = useState(false);

  const { data: clients = [] } = useQuery({
    queryKey: ['saasClients'],
    queryFn: () => base44.entities.SaasClient.list('-created_date', 1)
  });

  useEffect(() => {
    if (clients.length === 0 || widgetLoaded) return;

    const client = clients[0];
    if (!client.widget_client_id) return;

    // Load widget script
    const script = document.createElement('script');
    script.innerHTML = `
      window.PeskoiConfig = {
        clientId: '${client.widget_client_id}',
        apiUrl: '${window.location.origin}/api/functions'
      };
    `;
    document.head.appendChild(script);

    const widgetScript = document.createElement('script');
    widgetScript.src = '/api/functions/widgetScript';
    widgetScript.async = true;
    widgetScript.onload = () => setWidgetLoaded(true);
    document.body.appendChild(widgetScript);

    return () => {
      document.head.removeChild(script);
      document.body.removeChild(widgetScript);
      const button = document.getElementById('peskoi-widget-button');
      const container = document.getElementById('peskoi-widget-container');
      if (button) button.remove();
      if (container) container.remove();
    };
  }, [clients, widgetLoaded]);

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 sm:py-20">
        
        <p className="text-xs text-white/40 tracking-[0.15em] uppercase mb-12">
          AI Concierge Widget
        </p>

        {clients.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-sm text-white/40 mb-4">No SaaS clients configured</p>
            <p className="text-xs text-white/30">Create a client first to test the widget</p>
          </div>
        ) : (
          <div className="space-y-8">
            <div className="border border-white/[0.08] p-6">
              <h3 className="text-sm font-medium mb-4">Widget Preview</h3>
              <p className="text-xs text-white/40 mb-6">
                Testing widget for: {clients[0].business_name}
              </p>
              
              {widgetLoaded ? (
                <div className="text-xs text-green-400">
                  Widget loaded. Check bottom right corner →
                </div>
              ) : (
                <div className="text-xs text-white/40">
                  Loading widget...
                </div>
              )}
            </div>

            <div className="border border-white/[0.08] p-6">
              <h3 className="text-sm font-medium mb-4">Features</h3>
              <ul className="space-y-2 text-xs text-white/60">
                <li>• Context-aware upsells from Square catalog</li>
                <li>• In-chat booking flow with service selection</li>
                <li>• Proactive engagement (30s or 50% scroll)</li>
                <li>• Automated reminders & feedback requests</li>
                <li>• 1% commission on completed bookings</li>
              </ul>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}