import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Save, Building } from "lucide-react";

export default function BusinessInfoForm({ business, onSave }) {
  const [formData, setFormData] = useState({
    business_name: "",
    business_type: "salong",
    phone: "",
    email: "",
    address: "",
  });

  useEffect(() => {
    if (business) {
      setFormData({
        business_name: business.business_name || "",
        business_type: business.business_type || "salong",
        phone: business.phone || "",
        email: business.email || "",
        address: business.address || "",
      });
    }
  }, [business]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <Card className="bg-[#0a0a0a] border-[#1f1f1f]">
      <CardHeader>
        <CardTitle className="text-base sm:text-lg text-white flex items-center gap-2">
          <Building className="w-5 h-5 text-[#84CC16]" />
          Business Information
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
          <div className="grid sm:grid-cols-2 gap-4 sm:gap-6">
            <div className="space-y-2">
              <Label className="text-xs sm:text-sm text-gray-400">Business Name *</Label>
              <Input
                value={formData.business_name}
                onChange={(e) => setFormData({ ...formData, business_name: e.target.value })}
                className="bg-[#0a0a0a] border-[#1f1f1f] text-white text-sm"
                placeholder="My Business"
                required
              />
            </div>

            <div className="space-y-2">
              <Label className="text-xs sm:text-sm text-gray-400">Business Type *</Label>
              <Select
                value={formData.business_type}
                onValueChange={(value) => setFormData({ ...formData, business_type: value })}
              >
                <SelectTrigger className="bg-[#0a0a0a] border-[#1f1f1f] text-white text-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="salon">Salon</SelectItem>
                  <SelectItem value="clinic">Clinic</SelectItem>
                  <SelectItem value="massage">Massage</SelectItem>
                  <SelectItem value="chiropractor">Chiropractor</SelectItem>
                  <SelectItem value="tradesperson">Tradesperson</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-4 sm:gap-6">
            <div className="space-y-2">
              <Label className="text-xs sm:text-sm text-gray-400">Phone</Label>
              <Input
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="bg-[#0a0a0a] border-[#1f1f1f] text-white text-sm"
                placeholder="+1 234 567 8900"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-xs sm:text-sm text-gray-400">Email</Label>
              <Input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="bg-[#0a0a0a] border-[#1f1f1f] text-white text-sm"
                placeholder="info@business.com"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-xs sm:text-sm text-gray-400">Address</Label>
            <Textarea
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              className="bg-[#0a0a0a] border-[#1f1f1f] text-white text-sm min-h-[80px]"
              placeholder="123 Main St, New York, NY 10001"
            />
          </div>

          <div className="flex justify-end pt-4">
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