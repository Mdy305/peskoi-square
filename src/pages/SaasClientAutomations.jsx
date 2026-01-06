import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Bell, MessageSquare, Gift, Calendar } from "lucide-react";

export default function SaasClientAutomations() {
  const queryClient = useQueryClient();
  const [selectedClient, setSelectedClient] = useState(null);

  const { data: clients = [] } = useQuery({
    queryKey: ['saasClients'],
    queryFn: () => base44.entities.SaasClient.list('-created_date')
  });

  const { data: settings, isLoading: loadingSettings } = useQuery({
    queryKey: ['automationSettings', selectedClient],
    queryFn: async () => {
      if (!selectedClient) return null;
      const res = await base44.functions.invoke('initializeClientAutomations', {
        saas_client_id: selectedClient
      });
      return res.data?.settings;
    },
    enabled: !!selectedClient
  });

  const { data: scheduled = [] } = useQuery({
    queryKey: ['scheduledComms', selectedClient],
    queryFn: () => base44.entities.ScheduledCommunication.filter({
      saas_client_id: selectedClient,
      status: 'pending'
    }),
    enabled: !!selectedClient
  });

  const { data: catalog } = useQuery({
    queryKey: ['squareCatalog', selectedClient],
    queryFn: async () => {
      if (!selectedClient) return null;
      const res = await base44.functions.invoke('getSquareCatalog', {
        saas_client_id: selectedClient
      });
      return res.data;
    },
    enabled: !!selectedClient
  });

  const updateMutation = useMutation({
    mutationFn: (data) => base44.entities.ClientAutomationSettings.update(settings.id, data),
    onSuccess: () => {
      queryClient.invalidateQueries(['automationSettings']);
    }
  });

  useEffect(() => {
    if (clients.length > 0 && !selectedClient) {
      setSelectedClient(clients[0].id);
    }
  }, [clients]);

  const handleToggle = (field, value) => {
    updateMutation.mutate({ [field]: value });
  };

  const handleUpdate = (field, value) => {
    updateMutation.mutate({ [field]: value });
  };

  if (loadingSettings) {
    return <div className="min-h-screen bg-black" />;
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 sm:py-20">
        
        <p className="text-xs text-white/40 tracking-[0.15em] uppercase mb-12">
          Automations
        </p>

        {/* Client Selector */}
        {clients.length > 1 && (
          <div className="mb-12">
            <select
              value={selectedClient || ''}
              onChange={(e) => setSelectedClient(e.target.value)}
              className="w-full bg-black border border-white/[0.08] px-4 py-3 text-sm focus:outline-none focus:border-white/20"
            >
              {clients.map(c => (
                <option key={c.id} value={c.id}>{c.business_name}</option>
              ))}
            </select>
          </div>
        )}

        {settings && (
          <div className="space-y-8">

            {/* Appointment Reminders */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="border border-white/[0.08] p-6"
            >
              <div className="flex items-center gap-3 mb-6">
                <Bell className="w-5 h-5 text-white/40" />
                <div className="flex-1">
                  <h3 className="text-sm font-medium">Appointment Reminders</h3>
                  <p className="text-xs text-white/40 mt-1">Send reminder before appointments</p>
                </div>
                <button
                  onClick={() => handleToggle('reminder_enabled', !settings.reminder_enabled)}
                  className={`px-3 py-1 text-xs border transition-colors ${
                    settings.reminder_enabled 
                      ? 'border-green-500/30 text-green-400'
                      : 'border-white/10 text-white/40'
                  }`}
                >
                  {settings.reminder_enabled ? 'ON' : 'OFF'}
                </button>
              </div>

              {settings.reminder_enabled && (
                <div className="space-y-4">
                  <div>
                    <label className="text-xs text-white/40 block mb-2">Hours Before</label>
                    <input
                      type="number"
                      value={settings.reminder_hours_before}
                      onChange={(e) => handleUpdate('reminder_hours_before', parseInt(e.target.value))}
                      className="w-full bg-transparent border-b border-white/[0.08] pb-2 text-sm focus:outline-none focus:border-white/20"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-white/40 block mb-2">Message Template</label>
                    <textarea
                      value={settings.reminder_template}
                      onChange={(e) => handleUpdate('reminder_template', e.target.value)}
                      className="w-full bg-transparent border border-white/[0.08] p-3 text-sm focus:outline-none focus:border-white/20 h-20"
                    />
                    <p className="text-xs text-white/30 mt-2">Use: {`{name}, {service}, {time}`}</p>
                  </div>
                </div>
              )}
            </motion.div>

            {/* Feedback Requests */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="border border-white/[0.08] p-6"
            >
              <div className="flex items-center gap-3 mb-6">
                <MessageSquare className="w-5 h-5 text-white/40" />
                <div className="flex-1">
                  <h3 className="text-sm font-medium">Feedback Requests</h3>
                  <p className="text-xs text-white/40 mt-1">Request feedback after appointments</p>
                </div>
                <button
                  onClick={() => handleToggle('feedback_enabled', !settings.feedback_enabled)}
                  className={`px-3 py-1 text-xs border transition-colors ${
                    settings.feedback_enabled 
                      ? 'border-green-500/30 text-green-400'
                      : 'border-white/10 text-white/40'
                  }`}
                >
                  {settings.feedback_enabled ? 'ON' : 'OFF'}
                </button>
              </div>

              {settings.feedback_enabled && (
                <div className="space-y-4">
                  <div>
                    <label className="text-xs text-white/40 block mb-2">Hours After</label>
                    <input
                      type="number"
                      value={settings.feedback_hours_after}
                      onChange={(e) => handleUpdate('feedback_hours_after', parseInt(e.target.value))}
                      className="w-full bg-transparent border-b border-white/[0.08] pb-2 text-sm focus:outline-none focus:border-white/20"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-white/40 block mb-2">Message Template</label>
                    <textarea
                      value={settings.feedback_template}
                      onChange={(e) => handleUpdate('feedback_template', e.target.value)}
                      className="w-full bg-transparent border border-white/[0.08] p-3 text-sm focus:outline-none focus:border-white/20 h-20"
                    />
                    <p className="text-xs text-white/30 mt-2">Use: {`{name}, {service}, {link}`}</p>
                  </div>
                </div>
              )}
            </motion.div>

            {/* Birthday Messages */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="border border-white/[0.08] p-6"
            >
              <div className="flex items-center gap-3 mb-6">
                <Gift className="w-5 h-5 text-white/40" />
                <div className="flex-1">
                  <h3 className="text-sm font-medium">Birthday Messages</h3>
                  <p className="text-xs text-white/40 mt-1">Send special offers on birthdays</p>
                </div>
                <button
                  onClick={() => handleToggle('birthday_enabled', !settings.birthday_enabled)}
                  className={`px-3 py-1 text-xs border transition-colors ${
                    settings.birthday_enabled 
                      ? 'border-green-500/30 text-green-400'
                      : 'border-white/10 text-white/40'
                  }`}
                >
                  {settings.birthday_enabled ? 'ON' : 'OFF'}
                </button>
              </div>

              {settings.birthday_enabled && (
                <div className="space-y-4">
                  <div>
                    <label className="text-xs text-white/40 block mb-2">Birthday Offer</label>
                    <input
                      type="text"
                      value={settings.birthday_offer}
                      onChange={(e) => handleUpdate('birthday_offer', e.target.value)}
                      className="w-full bg-transparent border-b border-white/[0.08] pb-2 text-sm focus:outline-none focus:border-white/20"
                    />
                  </div>
                  
                  {catalog?.items && catalog.items.length > 0 && (
                    <div>
                      <label className="text-xs text-white/40 block mb-2">Featured Services</label>
                      <div className="space-y-2 max-h-48 overflow-y-auto border border-white/[0.08] p-3">
                        {catalog.items.map(item => (
                          <label key={item.id} className="flex items-center gap-2 text-xs cursor-pointer hover:bg-white/[0.02] p-1">
                            <input
                              type="checkbox"
                              checked={(settings.birthday_services || []).includes(item.id)}
                              onChange={(e) => {
                                const services = settings.birthday_services || [];
                                const updated = e.target.checked
                                  ? [...services, item.id]
                                  : services.filter(s => s !== item.id);
                                handleUpdate('birthday_services', updated);
                              }}
                              className="accent-white"
                            />
                            <span className="text-white/80">{item.name}</span>
                            <span className="text-white/40 ml-auto">${item.price}</span>
                          </label>
                        ))}
                      </div>
                      <p className="text-xs text-white/30 mt-2">Select services to feature in birthday offers</p>
                    </div>
                  )}

                  <div>
                    <label className="text-xs text-white/40 block mb-2">Message Template</label>
                    <textarea
                      value={settings.birthday_template}
                      onChange={(e) => handleUpdate('birthday_template', e.target.value)}
                      className="w-full bg-transparent border border-white/[0.08] p-3 text-sm focus:outline-none focus:border-white/20 h-20"
                    />
                    <p className="text-xs text-white/30 mt-2">Use: {`{name}, {offer}`}</p>
                  </div>
                </div>
              )}
            </motion.div>

            {/* Channel Preference */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="border border-white/[0.08] p-6"
            >
              <div className="flex items-center gap-3 mb-4">
                <Calendar className="w-5 h-5 text-white/40" />
                <h3 className="text-sm font-medium">Communication Channel</h3>
              </div>
              <select
                value={settings.communication_channel}
                onChange={(e) => handleUpdate('communication_channel', e.target.value)}
                className="w-full bg-black border border-white/[0.08] px-4 py-3 text-sm focus:outline-none focus:border-white/20"
              >
                <option value="sms">SMS Only</option>
                <option value="email">Email Only</option>
                <option value="both">Both</option>
              </select>
            </motion.div>

            {/* Scheduled Communications */}
            {scheduled.length > 0 && (
              <div>
                <p className="text-xs text-white/30 tracking-[0.15em] uppercase mb-4">
                  Pending ({scheduled.length})
                </p>
                <div className="space-y-2">
                  {scheduled.slice(0, 5).map((comm, i) => (
                    <div key={comm.id} className="border-b border-white/[0.05] pb-2 text-xs">
                      <p className="text-white/80">{comm.customer_name} - {comm.communication_type}</p>
                      <p className="text-white/40">{new Date(comm.scheduled_for).toLocaleString()}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>
        )}

      </div>
    </div>
  );
}