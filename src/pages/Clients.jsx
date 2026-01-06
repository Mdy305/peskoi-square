import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { User, Calendar, Tag, Plus, X } from "lucide-react";

export default function Clients() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedClient, setSelectedClient] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [segmentFilter, setSegmentFilter] = useState("all");
  const [newNote, setNewNote] = useState("");
  const [newTag, setNewTag] = useState("");
  const [formData, setFormData] = useState({
    given_name: "",
    family_name: "",
    phone_number: "",
    email_address: "",
    note: ""
  });

  const queryClient = useQueryClient();

  // Fetch clients from Square
  const { data: clientsData, isLoading } = useQuery({
    queryKey: ['squareCustomers'],
    queryFn: async () => {
      const res = await base44.functions.invoke('squareGetCustomers', {});
      return res.data?.customers || [];
    }
  });

  // Fetch bookings for selected client
  const { data: bookingsData } = useQuery({
    queryKey: ['clientBookings', selectedClient?.id],
    queryFn: async () => {
      const res = await base44.functions.invoke('squareGetBookings', {
        customer_id: selectedClient.id
      });
      return res.data?.bookings || [];
    },
    enabled: !!selectedClient
  });

  // Fetch product recommendations for selected client
  const { data: recommendations = [] } = useQuery({
    queryKey: ['clientRecommendations', selectedClient?.id],
    queryFn: async () => {
      const phone = selectedClient?.phone_number;
      if (!phone) return [];
      const allRecs = await base44.entities.ProductRecommendation.filter({
        client_phone: phone
      });
      return allRecs;
    },
    enabled: !!selectedClient
  });

  // Fetch customer profile for selected client
  const { data: customerProfile, isLoading: profileLoading } = useQuery({
    queryKey: ['customerProfile', selectedClient?.id],
    queryFn: async () => {
      if (!selectedClient?.id) return null;
      const profiles = await base44.entities.CustomerProfile.filter({
        square_customer_id: selectedClient.id
      });
      return profiles[0] || null;
    },
    enabled: !!selectedClient
  });

  // Fetch PESKOI appointments for selected client
  const { data: peskoiAppointments = [] } = useQuery({
    queryKey: ['peskoiAppointments', selectedClient?.phone_number],
    queryFn: async () => {
      if (!selectedClient?.phone_number) return [];
      const appts = await base44.entities.Appointment.filter({
        client_phone: selectedClient.phone_number
      });
      return appts.sort((a, b) => new Date(b.appointment_date) - new Date(a.appointment_date));
    },
    enabled: !!selectedClient?.phone_number
  });

  // Fetch conversation messages for selected client
  const { data: conversationMessages = [] } = useQuery({
    queryKey: ['conversationMessages', selectedClient?.id],
    queryFn: async () => {
      if (!selectedClient?.id) return [];
      const messages = await base44.entities.ConversationMessage.filter({
        square_customer_id: selectedClient.id
      }, '-sent_at');
      return messages;
    },
    enabled: !!selectedClient
  });

  const createClientMutation = useMutation({
    mutationFn: (data) => base44.functions.invoke('createClient', data),
    onSuccess: () => {
      queryClient.invalidateQueries(['squareCustomers']);
      setShowAddForm(false);
      setFormData({ given_name: "", family_name: "", phone_number: "", email_address: "", note: "" });
    }
  });

  const updateClientMutation = useMutation({
    mutationFn: ({ customer_id, data }) => 
      base44.functions.invoke('squareUpdateCustomer', { customer_id, ...data }),
    onSuccess: () => {
      queryClient.invalidateQueries(['squareCustomers']);
      setSelectedClient(null);
    }
  });

  const addNoteMutation = useMutation({
    mutationFn: async ({ profile_id, note }) => {
      const user = await base44.auth.me();
      const existingNotes = customerProfile?.notes || [];
      await base44.entities.CustomerProfile.update(profile_id, {
        notes: [
          ...existingNotes,
          {
            note,
            date: new Date().toISOString(),
            created_by: user.email
          }
        ]
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['customerProfile']);
      setNewNote("");
    }
  });

  const updateTagsMutation = useMutation({
    mutationFn: ({ profile_id, tags }) => 
      base44.entities.CustomerProfile.update(profile_id, { tags }),
    onSuccess: () => {
      queryClient.invalidateQueries(['customerProfile']);
    }
  });

  const updatePreferencesMutation = useMutation({
    mutationFn: ({ profile_id, preferences }) =>
      base44.entities.CustomerProfile.update(profile_id, { preferences }),
    onSuccess: () => {
      queryClient.invalidateQueries(['customerProfile']);
    }
  });

  const createProfileMutation = useMutation({
    mutationFn: async () => {
      const user = await base44.auth.me();
      const connections = await base44.entities.SquareConnection.filter({
        created_by: user.email,
        status: 'active'
      });
      const merchant_id = connections[0]?.merchant_id;
      
      return await base44.entities.CustomerProfile.create({
        merchant_id,
        square_customer_id: selectedClient.id,
        tags: [],
        notes: [],
        preferences: {}
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['customerProfile']);
    }
  });

  const clients = clientsData || [];
  const filteredClients = clients.filter(client => {
    const fullName = `${client.given_name || ''} ${client.family_name || ''}`.toLowerCase();
    const phone = client.phone_number || '';
    const email = client.email_address || '';
    const search = searchTerm.toLowerCase();
    const matchesSearch = fullName.includes(search) || phone.includes(search) || email.includes(search);
    
    // Segment filtering would require fetching all profiles - skip for now or load async
    if (segmentFilter === "all") return matchesSearch;
    return matchesSearch;
  });

  const handleAddNote = () => {
    if (!newNote.trim() || !customerProfile) return;
    addNoteMutation.mutate({
      profile_id: customerProfile.id,
      note: newNote.trim()
    });
  };

  const handleAddTag = (tag) => {
    if (!customerProfile) {
      createProfileMutation.mutate();
      return;
    }
    const currentTags = customerProfile.tags || [];
    if (!currentTags.includes(tag)) {
      updateTagsMutation.mutate({
        profile_id: customerProfile.id,
        tags: [...currentTags, tag]
      });
    }
  };

  const handleRemoveTag = (tag) => {
    if (!customerProfile) return;
    const currentTags = customerProfile.tags || [];
    updateTagsMutation.mutate({
      profile_id: customerProfile.id,
      tags: currentTags.filter(t => t !== tag)
    });
  };

  const allAppointments = [
    ...(bookingsData || []).map(b => ({ ...b, source: 'square' })),
    ...(peskoiAppointments || []).map(a => ({ ...a, source: 'peskoi' }))
  ].sort((a, b) => {
    const dateA = a.source === 'square' ? new Date(a.start_at) : new Date(a.appointment_date);
    const dateB = b.source === 'square' ? new Date(b.start_at) : new Date(b.appointment_date);
    return dateB - dateA;
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (selectedClient) {
      updateClientMutation.mutate({
        customer_id: selectedClient.id,
        data: formData
      });
    } else {
      createClientMutation.mutate(formData);
    }
  };

  if (isLoading) {
    return <div className="min-h-screen bg-black" />;
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12 sm:py-20">

        {/* Header */}
        <div className="mb-12 sm:mb-16">
          <p className="text-xs text-white/40 tracking-[0.15em] uppercase mb-8">Clients</p>
          
          {/* Segment Filter */}
          <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
            {['all', 'vip', 'high_value', 'regular', 'new', 'at_risk'].map((seg) => (
              <button
                key={seg}
                onClick={() => setSegmentFilter(seg)}
                className={`px-4 py-2 text-xs tracking-wide whitespace-nowrap transition-colors ${
                  segmentFilter === seg
                    ? 'bg-white text-black'
                    : 'border border-white/[0.08] text-white/60 hover:text-white/80'
                }`}
              >
                {seg.replace('_', ' ')}
              </button>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row gap-4 sm:items-center sm:justify-between">
            <input
              type="text"
              placeholder="Search clients..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1 bg-transparent border-b border-white/[0.08] pb-3 text-sm focus:outline-none focus:border-white/20"
            />
            <button
              onClick={() => {
                setShowAddForm(!showAddForm);
                setSelectedClient(null);
                setFormData({ given_name: "", family_name: "", phone_number: "", email_address: "", note: "" });
              }}
              className="border border-white/[0.08] px-6 py-3 hover:border-white/20 transition-all duration-300 hover-lift text-sm tracking-wide whitespace-nowrap"
              style={{ transitionTimingFunction: 'cubic-bezier(0.4, 0, 0.2, 1)' }}
            >
              {showAddForm ? 'Cancel' : '+ Add Client'}
            </button>
          </div>
        </div>

        {/* Add/Edit Form */}
        {(showAddForm || selectedClient) && (
          <div className="border border-white/[0.08] p-6 sm:p-8 mb-12 animate-scaleIn">

            <p className="text-sm text-white/80 mb-6">
              {selectedClient ? 'Edit client' : 'Add new client'}
            </p>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <input
                  type="text"
                  placeholder="First name"
                  value={formData.given_name}
                  onChange={(e) => setFormData({...formData, given_name: e.target.value})}
                  className="bg-transparent border-b border-white/[0.08] pb-3 text-sm focus:outline-none focus:border-white/20"
                  required
                />
                <input
                  type="text"
                  placeholder="Last name"
                  value={formData.family_name}
                  onChange={(e) => setFormData({...formData, family_name: e.target.value})}
                  className="bg-transparent border-b border-white/[0.08] pb-3 text-sm focus:outline-none focus:border-white/20"
                />
              </div>
              <input
                type="tel"
                placeholder="Phone"
                value={formData.phone_number}
                onChange={(e) => setFormData({...formData, phone_number: e.target.value})}
                className="w-full bg-transparent border-b border-white/[0.08] pb-3 text-sm focus:outline-none focus:border-white/20"
                required
              />
              <input
                type="email"
                placeholder="Email"
                value={formData.email_address}
                onChange={(e) => setFormData({...formData, email_address: e.target.value})}
                className="w-full bg-transparent border-b border-white/[0.08] pb-3 text-sm focus:outline-none focus:border-white/20"
              />
              <textarea
                placeholder="Notes"
                value={formData.note}
                onChange={(e) => setFormData({...formData, note: e.target.value})}
                className="w-full bg-transparent border border-white/[0.08] p-4 text-sm focus:outline-none focus:border-white/20 h-24"
              />
              <div className="flex gap-4">
                <button
                  type="submit"
                  disabled={createClientMutation.isPending || updateClientMutation.isPending}
                  className="border border-white/[0.08] px-6 py-3 hover:bg-white/5 transition-colors text-sm disabled:opacity-30"
                >
                  {createClientMutation.isPending || updateClientMutation.isPending ? 'Saving...' : 'Save'}
                </button>
                {selectedClient && (
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedClient(null);
                      setFormData({ given_name: "", family_name: "", phone_number: "", email_address: "", note: "" });
                    }}
                    className="text-sm text-white/40 hover:text-white/60"
                  >
                    Cancel
                  </button>
                )}
              </div>
              </form>
              </div>
              )}

        {/* Client List */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Left: Client List */}
          <div className="space-y-4">
            {filteredClients.length === 0 ? (
              <p className="text-sm text-white/40 text-center py-12">No clients found</p>
            ) : (
              filteredClients.map((client, idx) => (
                <button
                  key={client.id}
                  onClick={() => {
                    setSelectedClient(client);
                    setShowAddForm(false);
                    setFormData({
                      given_name: client.given_name || "",
                      family_name: client.family_name || "",
                      phone_number: client.phone_number || "",
                      email_address: client.email_address || "",
                      note: client.note || ""
                    });
                  }}
                  className={`w-full text-left border p-6 hover:border-white/20 transition-all duration-300 hover-lift animate-fadeIn ${
                    selectedClient?.id === client.id 
                      ? 'border-white/20 bg-white/[0.03]' 
                      : 'border-white/[0.08]'
                  }`}
                  style={{ 
                    animationDelay: `${idx * 0.05}s`,
                    transitionTimingFunction: 'cubic-bezier(0.4, 0, 0.2, 1)'
                  }}
                >
                  <p className="text-sm text-white/80 mb-2">
                    {client.given_name} {client.family_name}
                  </p>
                  <div className="space-y-1 text-xs text-white/40">
                    {client.phone_number && <p>{client.phone_number}</p>}
                    {client.email_address && <p>{client.email_address}</p>}
                    </div>
                    </button>
                    ))
                    )}
                    </div>

          {/* Right: Client Details */}
          {selectedClient && (
            <div
              key={selectedClient.id}
              className="space-y-8 animate-fadeIn"
              style={{ animationDuration: '0.5s' }}
            >
              
              {/* Segment Tags */}
              <div>
                <p className="text-xs text-white/30 tracking-[0.15em] uppercase mb-4">Segments</p>
                <div className="flex flex-wrap gap-2 mb-4">
                  {(customerProfile?.tags || []).map((tag) => (
                    <div key={tag} className="flex items-center gap-2 bg-white/5 px-3 py-1 text-xs">
                      <Tag className="w-3 h-3" />
                      <span>{tag.replace('_', ' ')}</span>
                      <button onClick={() => handleRemoveTag(tag)} className="hover:text-white/80">
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
                <div className="flex gap-2">
                  <select
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    className="flex-1 bg-transparent border border-white/[0.08] px-3 py-2 text-xs focus:outline-none focus:border-white/20"
                  >
                    <option value="">Add segment...</option>
                    <option value="vip">VIP</option>
                    <option value="high_value">High Value</option>
                    <option value="regular">Regular</option>
                    <option value="new">New</option>
                    <option value="at_risk">At Risk</option>
                    <option value="inactive">Inactive</option>
                  </select>
                  <button
                    onClick={() => {
                      if (newTag) {
                        handleAddTag(newTag);
                        setNewTag("");
                      }
                    }}
                    disabled={!newTag}
                    className="border border-white/[0.08] px-4 py-2 hover:border-white/20 transition-colors text-xs disabled:opacity-30"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Appointment History */}
              <div>
                <p className="text-xs text-white/30 tracking-[0.15em] uppercase mb-6">Appointment history</p>
                {allAppointments.length > 0 ? (
                  <div className="space-y-3">
                    {allAppointments.map((appt, idx) => (
                      <div key={idx} className="border-b border-white/[0.05] pb-3">
                        <div className="flex justify-between items-start mb-1">
                          <p className="text-sm text-white/80">
                            {appt.source === 'square' 
                              ? appt.appointment_segments?.[0]?.service_variation_version?.name || 'Service'
                              : appt.services?.join(', ') || 'Service'}
                          </p>
                          <span className="text-xs text-white/40">{appt.status}</span>
                        </div>
                        <p className="text-xs text-white/40">
                          {appt.source === 'square'
                            ? new Date(appt.start_at).toLocaleDateString('en-US', {
                                month: 'short',
                                day: 'numeric',
                                year: 'numeric',
                                hour: 'numeric',
                                minute: '2-digit'
                              })
                            : `${new Date(appt.appointment_date).toLocaleDateString('en-US', {
                                month: 'short',
                                day: 'numeric',
                                year: 'numeric'
                              })} at ${appt.appointment_time}`
                          }
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-white/40">No appointments</p>
                )}
              </div>

              {/* Conversation History */}
              {conversationMessages.length > 0 && (
                <div>
                  <p className="text-xs text-white/30 tracking-[0.15em] uppercase mb-6">Conversation history</p>
                  <div className="space-y-4">
                    {conversationMessages.map((msg) => (
                      <div key={msg.id} className={`flex ${msg.direction === 'outbound' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-[80%] ${
                          msg.direction === 'outbound' 
                            ? 'bg-white/5 text-white/80' 
                            : 'border border-white/[0.08] text-white/60'
                        } px-4 py-3`}>
                          <p className="text-sm mb-2 whitespace-pre-wrap">{msg.content}</p>
                          <div className="flex items-center gap-3 text-[10px] text-white/30">
                            <span>{msg.channel}</span>
                            <span>•</span>
                            <span>
                              {new Date(msg.sent_at).toLocaleDateString('en-US', {
                                month: 'short',
                                day: 'numeric',
                                hour: 'numeric',
                                minute: '2-digit'
                              })}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Product Recommendations */}
              {recommendations.length > 0 && (
                <div>
                  <p className="text-xs text-white/30 tracking-[0.15em] uppercase mb-6">Product recommendations</p>
                  <div className="space-y-3">
                    {recommendations.map((rec) => (
                      <div key={rec.id} className="border-b border-white/[0.05] pb-3">
                        <div className="flex justify-between items-start mb-2">
                          <p className="text-sm text-white/80">{rec.service_completed}</p>
                          <span className="text-xs text-white/40">{rec.status}</span>
                        </div>
                        {rec.products_recommended && (
                          <div className="space-y-1">
                            {rec.products_recommended.map((prod, idx) => (
                              <p key={idx} className="text-xs text-white/40">• {prod.name}</p>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Notes History */}
              <div>
                <p className="text-xs text-white/30 tracking-[0.15em] uppercase mb-4">Notes</p>
                
                {/* Add Note */}
                <div className="mb-6 flex gap-2">
                  <input
                    type="text"
                    placeholder="Add note..."
                    value={newNote}
                    onChange={(e) => setNewNote(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleAddNote()}
                    className="flex-1 bg-transparent border-b border-white/[0.08] pb-2 text-sm focus:outline-none focus:border-white/20"
                  />
                  <button
                    onClick={handleAddNote}
                    disabled={!newNote.trim() || addNoteMutation.isPending}
                    className="border border-white/[0.08] px-4 py-2 hover:border-white/20 transition-colors text-xs disabled:opacity-30"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>

                {/* Notes List */}
                {customerProfile?.notes && customerProfile.notes.length > 0 ? (
                  <div className="space-y-3">
                    {[...customerProfile.notes].reverse().map((note, idx) => (
                      <div key={idx} className="border-b border-white/[0.05] pb-3">
                        <p className="text-sm text-white/80 mb-2">{note.note}</p>
                        <div className="flex justify-between text-xs text-white/40">
                          <span>{new Date(note.date).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric'
                          })}</span>
                          <span>{note.created_by}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-white/40">No notes</p>
                )}
              </div>

              {/* Square Note */}
              {selectedClient.note && (
                <div>
                  <p className="text-xs text-white/30 tracking-[0.15em] uppercase mb-4">Square note</p>
                  <p className="text-sm text-white/60">{selectedClient.note}</p>
                </div>
              )}

              </div>
              )}

              </div>

      </div>
    </div>
  );
}