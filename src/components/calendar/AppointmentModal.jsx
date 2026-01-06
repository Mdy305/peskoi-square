import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Loader2 } from "lucide-react";

export default function AppointmentModal({ isOpen, onClose, onSave, appointment, isLoading }) {
  const [formData, setFormData] = useState({
    customer_name: "",
    customer_phone: "",
    customer_email: "",
    service: "",
    appointment_date: "",
    appointment_time: "",
    duration_minutes: 60,
    price: 0,
    status: "bokad",
    notes: "",
  });

  useEffect(() => {
    if (appointment) {
      setFormData(appointment);
    } else {
      setFormData({
        customer_name: "",
        customer_phone: "",
        customer_email: "",
        service: "",
        appointment_date: "",
        appointment_time: "",
        duration_minutes: 60,
        price: 0,
        status: "bokad",
        notes: "",
      });
    }
  }, [appointment, isOpen]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-[#1A1A1A] border-[#2A2A2A] text-white max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-xl">
            {appointment ? "Redigera Bokning" : "Ny Bokning"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="customer_name" className="text-gray-300">
                  Kundnamn *
                </Label>
                <Input
                  id="customer_name"
                  value={formData.customer_name}
                  onChange={(e) => setFormData({ ...formData, customer_name: e.target.value })}
                  className="bg-[#0A0A0A] border-[#2A2A2A] text-white"
                  required
                />
              </div>
              <div>
                <Label htmlFor="customer_phone" className="text-gray-300">
                  Telefon *
                </Label>
                <Input
                  id="customer_phone"
                  value={formData.customer_phone}
                  onChange={(e) => setFormData({ ...formData, customer_phone: e.target.value })}
                  className="bg-[#0A0A0A] border-[#2A2A2A] text-white"
                  required
                />
              </div>
            </div>

            <div>
              <Label htmlFor="customer_email" className="text-gray-300">
                E-post
              </Label>
              <Input
                id="customer_email"
                type="email"
                value={formData.customer_email}
                onChange={(e) => setFormData({ ...formData, customer_email: e.target.value })}
                className="bg-[#0A0A0A] border-[#2A2A2A] text-white"
              />
            </div>

            <div>
              <Label htmlFor="service" className="text-gray-300">
                Tjänst *
              </Label>
              <Input
                id="service"
                value={formData.service}
                onChange={(e) => setFormData({ ...formData, service: e.target.value })}
                className="bg-[#0A0A0A] border-[#2A2A2A] text-white"
                placeholder="t.ex. Klippning, Färgning"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="appointment_date" className="text-gray-300">
                  Datum *
                </Label>
                <Input
                  id="appointment_date"
                  type="date"
                  value={formData.appointment_date}
                  onChange={(e) => setFormData({ ...formData, appointment_date: e.target.value })}
                  className="bg-[#0A0A0A] border-[#2A2A2A] text-white"
                  required
                />
              </div>
              <div>
                <Label htmlFor="appointment_time" className="text-gray-300">
                  Tid *
                </Label>
                <Input
                  id="appointment_time"
                  type="time"
                  value={formData.appointment_time}
                  onChange={(e) => setFormData({ ...formData, appointment_time: e.target.value })}
                  className="bg-[#0A0A0A] border-[#2A2A2A] text-white"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label htmlFor="duration_minutes" className="text-gray-300">
                  Varaktighet (min)
                </Label>
                <Input
                  id="duration_minutes"
                  type="number"
                  value={formData.duration_minutes}
                  onChange={(e) => setFormData({ ...formData, duration_minutes: parseInt(e.target.value) })}
                  className="bg-[#0A0A0A] border-[#2A2A2A] text-white"
                />
              </div>
              <div>
                <Label htmlFor="price" className="text-gray-300">
                  Pris (kr)
                </Label>
                <Input
                  id="price"
                  type="number"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: parseInt(e.target.value) })}
                  className="bg-[#0A0A0A] border-[#2A2A2A] text-white"
                />
              </div>
              <div>
                <Label htmlFor="status" className="text-gray-300">
                  Status
                </Label>
                <Select
                  value={formData.status}
                  onValueChange={(value) => setFormData({ ...formData, status: value })}
                >
                  <SelectTrigger className="bg-[#0A0A0A] border-[#2A2A2A] text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-[#1A1A1A] border-[#2A2A2A]">
                    <SelectItem value="bokad">Bokad</SelectItem>
                    <SelectItem value="bekräftad">Bekräftad</SelectItem>
                    <SelectItem value="genomförd">Genomförd</SelectItem>
                    <SelectItem value="avbokad">Avbokad</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label htmlFor="notes" className="text-gray-300">
                Anteckningar
              </Label>
              <Textarea
                id="notes"
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                className="bg-[#0A0A0A] border-[#2A2A2A] text-white"
                rows={3}
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="border-[#2A2A2A] text-gray-400 hover:text-white hover:bg-[#2A2A2A]"
            >
              Avbryt
            </Button>
            <Button
              type="submit"
              disabled={isLoading}
              className="bg-[#84CC16] hover:bg-[#65A30D] text-black"
            >
              {isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              {appointment ? "Uppdatera" : "Skapa"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}