import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Scissors, Plus, Loader2, X, User, Calendar, DollarSign } from "lucide-react";
import { motion } from "framer-motion";
import { format } from "date-fns";

export default function ServiceRecords() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    client_name: "",
    client_phone: "",
    service_date: "",
    services_provided: [],
    stylist: "",
    products_used: [],
    notes: "",
    client_preferences: "",
    price: "",
  });
  const [serviceInput, setServiceInput] = useState("");
  const [productInput, setProductInput] = useState("");

  const queryClient = useQueryClient();

  const { data: services = [], isLoading } = useQuery({
    queryKey: ["serviceRecords"],
    queryFn: () => base44.entities.ServiceRecord.list("-service_date"),
  });

  const createMutation = useMutation({
    mutationFn: (data) => base44.entities.ServiceRecord.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["serviceRecords"] });
      setIsDialogOpen(false);
      resetForm();
    },
  });

  const addService = () => {
    if (serviceInput.trim() && !formData.services_provided.includes(serviceInput.trim())) {
      setFormData({
        ...formData,
        services_provided: [...formData.services_provided, serviceInput.trim()],
      });
      setServiceInput("");
    }
  };

  const removeService = (service) => {
    setFormData({
      ...formData,
      services_provided: formData.services_provided.filter((s) => s !== service),
    });
  };

  const addProduct = () => {
    if (productInput.trim() && !formData.products_used.includes(productInput.trim())) {
      setFormData({
        ...formData,
        products_used: [...formData.products_used, productInput.trim()],
      });
      setProductInput("");
    }
  };

  const removeProduct = (product) => {
    setFormData({
      ...formData,
      products_used: formData.products_used.filter((p) => p !== product),
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const dataToSubmit = {
      ...formData,
      price: formData.price ? parseFloat(formData.price) : undefined,
    };
    createMutation.mutate(dataToSubmit);
  };

  const resetForm = () => {
    setFormData({
      client_name: "",
      client_phone: "",
      service_date: "",
      services_provided: [],
      stylist: "",
      products_used: [],
      notes: "",
      client_preferences: "",
      price: "",
    });
    setServiceInput("");
    setProductInput("");
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="flex items-center justify-between mb-12">
          <div>
            <h1 className="text-5xl font-bold mb-2 tracking-tight">Service Records</h1>
            <p className="text-gray-400 text-lg">
              Track all client services, formulas, and preferences
            </p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-[#84CC16] hover:bg-[#84CC16]/90 text-black font-semibold">
                <Plus className="w-5 h-5 mr-2" />
                New Service
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-[#141414] border-[#1f1f1f] text-white max-w-3xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="text-2xl font-bold">Create Service Record</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-6 mt-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2 text-gray-300">
                      Client Name *
                    </label>
                    <Input
                      value={formData.client_name}
                      onChange={(e) => setFormData({ ...formData, client_name: e.target.value })}
                      required
                      className="bg-[#1f1f1f] border-[#2a2a2a] text-white"
                      placeholder="e.g., Sarah Johnson"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2 text-gray-300">
                      Phone Number
                    </label>
                    <Input
                      value={formData.client_phone}
                      onChange={(e) => setFormData({ ...formData, client_phone: e.target.value })}
                      className="bg-[#1f1f1f] border-[#2a2a2a] text-white"
                      placeholder="e.g., (555) 123-4567"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2 text-gray-300">
                      Service Date *
                    </label>
                    <Input
                      type="date"
                      value={formData.service_date}
                      onChange={(e) => setFormData({ ...formData, service_date: e.target.value })}
                      required
                      className="bg-[#1f1f1f] border-[#2a2a2a] text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2 text-gray-300">
                      Stylist
                    </label>
                    <Input
                      value={formData.stylist}
                      onChange={(e) => setFormData({ ...formData, stylist: e.target.value })}
                      className="bg-[#1f1f1f] border-[#2a2a2a] text-white"
                      placeholder="Your name"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-300">
                    Services Provided *
                  </label>
                  <div className="flex gap-2 mb-2">
                    <Input
                      value={serviceInput}
                      onChange={(e) => setServiceInput(e.target.value)}
                      onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addService())}
                      className="bg-[#1f1f1f] border-[#2a2a2a] text-white"
                      placeholder="e.g., Balayage, Haircut, Color"
                    />
                    <Button
                      type="button"
                      onClick={addService}
                      className="bg-[#84CC16] hover:bg-[#84CC16]/90 text-black"
                    >
                      Add
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {formData.services_provided.map((service) => (
                      <Badge key={service} className="bg-purple-500/20 text-purple-300 border-0 pr-1">
                        {service}
                        <button
                          type="button"
                          onClick={() => removeService(service)}
                          className="ml-2 hover:text-white"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-300">
                    Products Used
                  </label>
                  <div className="flex gap-2 mb-2">
                    <Input
                      value={productInput}
                      onChange={(e) => setProductInput(e.target.value)}
                      onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addProduct())}
                      className="bg-[#1f1f1f] border-[#2a2a2a] text-white"
                      placeholder="e.g., Olaplex No.3, Wella 7/1"
                    />
                    <Button
                      type="button"
                      onClick={addProduct}
                      className="bg-[#84CC16] hover:bg-[#84CC16]/90 text-black"
                    >
                      Add
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {formData.products_used.map((product) => (
                      <Badge key={product} className="bg-[#84CC16]/20 text-[#84CC16] border-0 pr-1">
                        {product}
                        <button
                          type="button"
                          onClick={() => removeProduct(product)}
                          className="ml-2 hover:text-white"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-300">
                    Service Notes (Formulas, Techniques, Results) *
                  </label>
                  <Textarea
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    required
                    rows={6}
                    className="bg-[#1f1f1f] border-[#2a2a2a] text-white"
                    placeholder="Detailed notes about formulas, processing time, techniques used, results..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-300">
                    Client Preferences & Allergies
                  </label>
                  <Textarea
                    value={formData.client_preferences}
                    onChange={(e) =>
                      setFormData({ ...formData, client_preferences: e.target.value })
                    }
                    rows={2}
                    className="bg-[#1f1f1f] border-[#2a2a2a] text-white"
                    placeholder="e.g., Prefers organic products, allergic to ammonia..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-300">
                    Total Price
                  </label>
                  <Input
                    type="number"
                    step="0.01"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    className="bg-[#1f1f1f] border-[#2a2a2a] text-white"
                    placeholder="0.00"
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsDialogOpen(false)}
                    className="flex-1 border-[#2a2a2a] text-gray-400 hover:text-white"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={createMutation.isPending}
                    className="flex-1 bg-[#84CC16] hover:bg-[#84CC16]/90 text-black font-semibold"
                  >
                    {createMutation.isPending ? "Creating..." : "Create Record"}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Service Records */}
        {isLoading ? (
          <div className="text-center py-12">
            <Loader2 className="w-12 h-12 animate-spin text-[#84CC16] mx-auto mb-4" />
            <p className="text-gray-400">Loading service records...</p>
          </div>
        ) : services.length === 0 ? (
          <Card className="bg-[#141414] border-[#1f1f1f]">
            <CardContent className="text-center py-12">
              <Scissors className="w-16 h-16 text-gray-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-400 mb-2">No service records yet</h3>
              <p className="text-gray-500 mb-4">Create your first service record to get started</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            {services.map((service, index) => (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card className="bg-[#141414] border-[#1f1f1f] hover:border-[#84CC16]/50 transition-all duration-300">
                  <CardHeader>
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-3">
                          <User className="w-6 h-6 text-[#84CC16]" />
                          <CardTitle className="text-white text-2xl">{service.client_name}</CardTitle>
                        </div>
                        <div className="flex flex-wrap gap-2 mb-4">
                          <Badge variant="outline" className="border-[#84CC16]/30 text-[#84CC16]">
                            <Calendar className="w-3 h-3 mr-1" />
                            {format(new Date(service.service_date), "MMMM d, yyyy")}
                          </Badge>
                          {service.stylist && (
                            <Badge variant="outline" className="border-gray-600 text-gray-400">
                              {service.stylist}
                            </Badge>
                          )}
                          {service.price && (
                            <Badge className="bg-green-500/20 text-green-300 border-0">
                              <DollarSign className="w-3 h-3 mr-1" />
                              {service.price.toFixed(2)}
                            </Badge>
                          )}
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {service.services_provided?.map((svc) => (
                            <Badge key={svc} className="bg-purple-500/20 text-purple-300 border-0">
                              {svc}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <h4 className="font-semibold text-gray-300 mb-2">Service Notes</h4>
                      <p className="text-gray-400 whitespace-pre-wrap">{service.notes}</p>
                    </div>

                    {service.products_used && service.products_used.length > 0 && (
                      <div>
                        <h4 className="font-semibold text-gray-300 mb-2">Products Used</h4>
                        <div className="flex flex-wrap gap-2">
                          {service.products_used.map((product) => (
                            <Badge
                              key={product}
                              className="bg-[#84CC16]/20 text-[#84CC16] border-0"
                            >
                              {product}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}

                    {service.client_preferences && (
                      <div>
                        <h4 className="font-semibold text-gray-300 mb-2">Client Preferences</h4>
                        <p className="text-gray-400 italic">{service.client_preferences}</p>
                      </div>
                    )}

                    {service.client_phone && (
                      <div className="text-gray-500 text-sm">
                        Contact: {service.client_phone}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}