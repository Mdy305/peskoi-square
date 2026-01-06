import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";
import { X, Edit2, Check } from "lucide-react";

const pages = ["Activity", "Appointments", "Clients", "Settings"];

export default function Home() {
  const [currentPage, setCurrentPage] = useState(null);
  const [editingClient, setEditingClient] = useState(null);
  const [editForm, setEditForm] = useState({});
  const queryClient = useQueryClient();

  // Single session check on mount
  const { data: session, isLoading } = useQuery({
    queryKey: ["sessionStatus"],
    queryFn: () => base44.functions.invoke("sessionStatus", {}),
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    retry: false,
    staleTime: Infinity
  });

  const step = session?.data?.step;

  // Fetch bookings
  const { data: bookingsData, isLoading: bookingsLoading } = useQuery({
    queryKey: ["squareBookings"],
    queryFn: async () => {
      const res = await base44.functions.invoke("squareGetBookings", {});
      return res.data;
    },
    enabled: step === "READY" && (currentPage === "Activity" || currentPage === "Appointments"),
    refetchOnWindowFocus: false,
    retry: false
  });

  // Fetch customers
  const { data: customersData } = useQuery({
    queryKey: ["squareCustomers"],
    queryFn: async () => {
      const res = await base44.functions.invoke("squareGetCustomers", {});
      return res.data;
    },
    enabled: step === "READY" && currentPage === "Clients",
    refetchOnWindowFocus: false,
    retry: false
  });

  // Fetch services from Square
  const { data: servicesData } = useQuery({
    queryKey: ["squareServices"],
    queryFn: async () => {
      const res = await base44.functions.invoke("squareGetServices", {});
      return res.data;
    },
    enabled: step === "READY" && (currentPage === "Services" || currentPage === "Settings"),
    refetchOnWindowFocus: false,
    retry: false
  });

  // Fetch service preferences
  const { data: preferencesData } = useQuery({
    queryKey: ["servicePreferences"],
    queryFn: () => base44.entities.ServicePreference.list(),
    enabled: step === "READY" && (currentPage === "Services" || currentPage === "Settings"),
    refetchOnWindowFocus: false,
    retry: false
  });

  // Sync services mutation
  const syncServicesMutation = useMutation({
    mutationFn: async () => {
      const res = await base44.functions.invoke("syncSquareServices", {});
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["servicePreferences"]);
      queryClient.invalidateQueries(["squareServices"]);
    }
  });

  // Update service preference mutation
  const updatePreferenceMutation = useMutation({
    mutationFn: async ({ service_id, is_visible, is_bookable }) => {
      const res = await base44.functions.invoke("updateServicePreferences", {
        service_id,
        is_visible,
        is_bookable
      });
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["servicePreferences"]);
    }
  });

  // Cancel booking mutation
  const cancelMutation = useMutation({
    mutationFn: async (bookingId) => {
      const res = await base44.functions.invoke("squareCancelBooking", { booking_id: bookingId });
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["squareBookings"]);
    }
  });

  // Update customer mutation
  const updateCustomerMutation = useMutation({
    mutationFn: async (data) => {
      const res = await base44.functions.invoke("squareUpdateCustomer", data);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["squareCustomers"]);
      setEditingClient(null);
      setEditForm({});
    }
  });

  // Initialize once ready
  useEffect(() => {
    if (step === "READY" && !currentPage) {
      setCurrentPage("Activity");
    }
  }, [step, currentPage]);

  const bookings = bookingsData?.bookings || [];
  const customers = customersData?.customers || [];
  const services = servicesData?.services || [];
  const preferences = preferencesData || [];

  const getPreference = (serviceId) => {
    return preferences.find(p => p.square_service_id === serviceId);
  };

  // Black screen while loading
  if (isLoading || !step) {
    return <div className="min-h-screen bg-black" />;
  }

  // Redirect to Square connection
  if (step === "CONNECT_SQUARE") {
    window.location.href = '/connect-square';
    return <div className="min-h-screen bg-black" />;
  }

  // Black screen until page selected
  if (!currentPage) {
    return <div className="min-h-screen bg-black" />;
  }

  const handleCancelBooking = (bookingId) => {
    if (confirm("Cancel this appointment?")) {
      cancelMutation.mutate(bookingId);
    }
  };

  const startEdit = (client) => {
    setEditingClient(client.id);
    setEditForm({
      given_name: client.given_name || "",
      family_name: client.family_name || "",
      email_address: client.email_address || "",
      phone_number: client.phone_number || ""
    });
  };

  const saveEdit = () => {
    updateCustomerMutation.mutate({
      customer_id: editingClient,
      ...editForm
    });
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Top Nav */}
      <nav className="fixed top-0 left-0 right-0 h-14 flex items-center justify-center gap-8 border-b border-white/[0.08] bg-black z-10">
        {pages.map(page => (
          <span
            key={page}
            onClick={() => setCurrentPage(page)}
            className={`cursor-pointer transition-opacity duration-200 text-[13px] tracking-wide ${
              currentPage === page ? "opacity-100" : "opacity-40 hover:opacity-70"
            }`}
          >
            {page}
          </span>
        ))}
      </nav>

      {/* Content */}
      <main className="pt-24 px-8 max-w-[920px] mx-auto">
        
        {/* Activity */}
        {currentPage === "Activity" && (
          <section className="animate-fade">
            {bookingsLoading ? null : bookings.length === 0 ? null : (
              <div className="space-y-6">
                {bookings.slice(0, 10).map(booking => (
                  <div key={booking.id} className="border-b border-white/[0.05] pb-6">
                    <p className="text-sm opacity-80">
                      {booking.status === 'CANCELLED_BY_CUSTOMER' || booking.status === 'CANCELLED_BY_SELLER' 
                        ? 'Appointment cancelled' 
                        : 'Appointment secured'}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </section>
        )}

        {/* Appointments */}
        {currentPage === "Appointments" && (
          <section className="animate-fade">
            <h1 className="text-[28px] font-medium mb-6">Appointments</h1>
            
            {bookingsLoading ? (
              <p className="opacity-40 text-sm">Loading...</p>
            ) : bookings.length === 0 ? (
              <div className="space-y-2">
                <p className="opacity-40 text-sm">No appointments</p>
              </div>
            ) : (
              <div className="space-y-4">
                {bookings.map(booking => (
                  <div 
                    key={booking.id}
                    className="border border-white/[0.08] p-4"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <p className="text-sm opacity-90">
                          {booking.customer_id ? `Client ${booking.customer_id.slice(0, 8)}` : 'Walk-in'}
                        </p>
                        <p className="text-xs opacity-50 mt-1">
                          {format(new Date(booking.start_at), 'EEEE, MMMM d • h:mm a')}
                        </p>
                        {booking.appointment_segments?.[0]?.service_variation_id && (
                          <p className="text-xs opacity-40 mt-2">
                            {booking.appointment_segments[0].service_variation_id.slice(0, 16)}
                          </p>
                        )}
                        <p className="text-xs opacity-30 mt-2">
                          Status: {booking.status.replace(/_/g, ' ').toLowerCase()}
                        </p>
                      </div>
                      
                      {booking.status !== 'CANCELLED_BY_CUSTOMER' && booking.status !== 'CANCELLED_BY_SELLER' && (
                        <button
                          onClick={() => handleCancelBooking(booking.id)}
                          disabled={cancelMutation.isLoading}
                          className="text-white/40 hover:text-white/80 transition-colors text-xs px-3 py-1"
                        >
                          Cancel
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        )}

        {/* Clients */}
        {currentPage === "Clients" && (
          <section className="animate-fade">
            <h1 className="text-[28px] font-medium mb-6">Clients</h1>
            
            {!customersData ? (
              <p className="opacity-40 text-sm">Loading clients...</p>
            ) : customers.length === 0 ? (
              <div className="space-y-2">
                <p className="opacity-40 text-sm">No clients found</p>
                <p className="text-xs opacity-30">Square customers will appear here</p>
              </div>
            ) : (
              <div className="space-y-3">
                {customers.map(client => (
                  <div 
                    key={client.id}
                    className="border border-white/[0.08] p-4"
                  >
                    {editingClient === client.id ? (
                      <div className="space-y-3">
                        <input
                          type="text"
                          placeholder="First name"
                          value={editForm.given_name}
                          onChange={(e) => setEditForm({...editForm, given_name: e.target.value})}
                          className="w-full bg-transparent border border-white/[0.08] px-3 py-2 text-sm"
                        />
                        <input
                          type="text"
                          placeholder="Last name"
                          value={editForm.family_name}
                          onChange={(e) => setEditForm({...editForm, family_name: e.target.value})}
                          className="w-full bg-transparent border border-white/[0.08] px-3 py-2 text-sm"
                        />
                        <input
                          type="email"
                          placeholder="Email"
                          value={editForm.email_address}
                          onChange={(e) => setEditForm({...editForm, email_address: e.target.value})}
                          className="w-full bg-transparent border border-white/[0.08] px-3 py-2 text-sm"
                        />
                        <input
                          type="tel"
                          placeholder="Phone"
                          value={editForm.phone_number}
                          onChange={(e) => setEditForm({...editForm, phone_number: e.target.value})}
                          className="w-full bg-transparent border border-white/[0.08] px-3 py-2 text-sm"
                        />
                        <div className="flex gap-2">
                          <button
                            onClick={saveEdit}
                            disabled={updateCustomerMutation.isLoading}
                            className="px-4 py-2 bg-white text-black text-xs hover:bg-white/90"
                          >
                            <Check className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => setEditingClient(null)}
                            className="px-4 py-2 border border-white/[0.08] text-xs hover:bg-white/5"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="text-sm opacity-90">
                            {client.given_name} {client.family_name}
                          </p>
                          {client.email_address && (
                            <p className="text-xs opacity-50 mt-1">{client.email_address}</p>
                          )}
                          {client.phone_number && (
                            <p className="text-xs opacity-50 mt-1">{client.phone_number}</p>
                          )}
                        </div>
                        <button
                          onClick={() => startEdit(client)}
                          className="text-white/40 hover:text-white/80 transition-colors"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </section>
        )}

        {/* Settings */}
        {currentPage === "Settings" && (
          <section className="animate-fade">
            <h1 className="text-[28px] font-medium mb-12">Settings</h1>
            
            <div className="space-y-16">
              
              <div>
                <h2 className="text-xs opacity-30 mb-6 tracking-widest">SERVICES</h2>
                <button
                  onClick={() => syncServicesMutation.mutate()}
                  disabled={syncServicesMutation.isLoading}
                  className="px-4 py-2 border border-white/[0.08] text-xs hover:bg-white/5 disabled:opacity-40 mb-6"
                >
                  {syncServicesMutation.isLoading ? 'Syncing...' : 'Sync from Square'}
                </button>
                
                {!servicesData ? null : services.length === 0 ? null : (
                  <div className="space-y-2">
                    {services.map(service => {
                      const pref = getPreference(service.id);
                      const isVisible = pref?.is_visible !== false;
                      const isBookable = pref?.is_bookable !== false;
                      
                      return (
                        <div 
                          key={service.id}
                          className="flex items-center justify-between py-3 border-b border-white/[0.05]"
                        >
                          <p className="text-sm opacity-80">{service.name}</p>
                          
                          {pref && (
                            <div className="flex gap-4 text-xs">
                              <label className="flex items-center gap-2 cursor-pointer opacity-60 hover:opacity-100">
                                <input
                                  type="checkbox"
                                  checked={isVisible}
                                  onChange={(e) => updatePreferenceMutation.mutate({
                                    service_id: service.id,
                                    is_visible: e.target.checked,
                                    is_bookable: isBookable
                                  })}
                                  className="w-3 h-3"
                                />
                                Visible
                              </label>
                              
                              <label className="flex items-center gap-2 cursor-pointer opacity-60 hover:opacity-100">
                                <input
                                  type="checkbox"
                                  checked={isBookable}
                                  onChange={(e) => updatePreferenceMutation.mutate({
                                    service_id: service.id,
                                    is_visible: isVisible,
                                    is_bookable: e.target.checked
                                  })}
                                  className="w-3 h-3"
                                />
                                Bookable
                              </label>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
              
            </div>
          </section>
        )}





      </main>
    </div>
  );
}