import React from "react";
import { useQuery } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import { Loader2, Clock, DollarSign } from "lucide-react";

export default function Services() {
  const { data: servicesData, isLoading } = useQuery({
    queryKey: ['squareServices'],
    queryFn: async () => {
      const res = await base44.functions.invoke('squareGetServices', {});
      return res.data;
    }
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-white/40" />
      </div>
    );
  }

  const services = servicesData?.services || [];

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-5xl mx-auto px-6 py-20">
        
        <div className="flex justify-between items-center mb-12">
          <div>
            <p className="text-xs text-white/40 tracking-[0.15em] uppercase mb-2">Services</p>
            <p className="text-sm text-white/60">{services.length} services configured</p>
          </div>
        </div>

        {services.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-white/40">No services configured in Square.</p>
            <p className="text-xs text-white/30 mt-2">Add services in your Square dashboard.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {services.map((service) => (
              <div 
                key={service.id}
                className="border border-white/[0.08] p-6 hover:border-white/[0.15] transition-all"
              >
                <h2 className="text-lg font-medium mb-2">{service.name}</h2>
                
                {service.description && (
                  <p className="text-sm text-white/60 mb-4">{service.description}</p>
                )}

                <div className="space-y-3">
                  {service.variations.map((variation) => (
                    <div 
                      key={variation.id}
                      className="flex items-center justify-between py-3 border-t border-white/[0.05]"
                    >
                      <div className="flex-1">
                        <p className="text-sm text-white/80">{variation.name}</p>
                      </div>
                      
                      <div className="flex items-center gap-6 text-xs text-white/40">
                        {variation.duration_minutes && (
                          <div className="flex items-center gap-1.5">
                            <Clock className="w-3.5 h-3.5" />
                            <span>{variation.duration_minutes} min</span>
                          </div>
                        )}
                        
                        {variation.price > 0 && (
                          <div className="flex items-center gap-1.5">
                            <DollarSign className="w-3.5 h-3.5" />
                            <span>${variation.price.toFixed(0)}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="mt-12 pt-8 border-t border-white/[0.08]">
          <p className="text-xs text-white/40">
            Services synced from Square. Manage services in your Square dashboard.
          </p>
        </div>

      </div>
    </div>
  );
}