import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Trash2, Save, Scissors } from "lucide-react";

export default function ServicesManager({ business, onSave }) {
  const [services, setServices] = useState([
    { name: "Haircut", duration: 45, price: 45 },
    { name: "Coloring", duration: 120, price: 110 }
  ]);

  useEffect(() => {
    if (business?.services && business.services.length > 0) {
      setServices(business.services);
    }
  }, [business]);

  const addService = () => {
    setServices([...services, { name: "", duration: 60, price: 0 }]);
  };

  const removeService = (index) => {
    setServices(services.filter((_, i) => i !== index));
  };

  const updateService = (index, field, value) => {
    const updated = [...services];
    updated[index] = { ...updated[index], [field]: value };
    setServices(updated);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({ services });
  };

  return (
    <Card className="bg-[#0a0a0a] border-[#1f1f1f]">
      <CardHeader>
        <CardTitle className="text-base sm:text-lg text-white flex items-center gap-2">
          <Scissors className="w-5 h-5 text-[#84CC16]" />
          Services & Pricing
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
          <div className="space-y-3 sm:space-y-4">
            {services.map((service, index) => (
              <div
                key={index}
                className="p-3 sm:p-4 rounded-lg bg-black border border-[#1f1f1f] space-y-3 sm:space-y-4"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs sm:text-sm text-gray-400">Service #{index + 1}</span>
                  {services.length > 1 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeService(index)}
                      className="text-red-500 hover:text-red-400 hover:bg-red-500/10 h-8 px-2"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  )}
                </div>

                <div className="grid gap-3 sm:gap-4">
                  <div className="space-y-2">
                    <Label className="text-xs sm:text-sm text-gray-400">Service Name</Label>
                    <Input
                      value={service.name}
                      onChange={(e) => updateService(index, "name", e.target.value)}
                      className="bg-[#0a0a0a] border-[#1f1f1f] text-white text-sm"
                      placeholder="e.g. Haircut"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-2">
                      <Label className="text-xs sm:text-sm text-gray-400">Duration (min)</Label>
                      <Input
                        type="number"
                        value={service.duration}
                        onChange={(e) => updateService(index, "duration", parseInt(e.target.value))}
                        className="bg-[#0a0a0a] border-[#1f1f1f] text-white text-sm"
                        min="15"
                        step="15"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label className="text-xs sm:text-sm text-gray-400">Price ($)</Label>
                      <Input
                        type="number"
                        value={service.price}
                        onChange={(e) => updateService(index, "price", parseInt(e.target.value))}
                        className="bg-[#0a0a0a] border-[#1f1f1f] text-white text-sm"
                        min="0"
                      />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row justify-between gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={addService}
              className="border-[#1f1f1f] text-gray-400 hover:text-white hover:bg-[#1f1f1f] w-full sm:w-auto"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Service
            </Button>
            <Button type="submit" className="bg-[#84CC16] hover:bg-[#84CC16]/90 text-black w-full sm:w-auto">
              <Save className="w-4 h-4 mr-2" />
              Save Changes
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}