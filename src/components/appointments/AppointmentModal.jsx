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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Trash2 } from "lucide-react";

export default function AppointmentModal({ isOpen, onClose, onSave, onDelete, appointment, isLoading }) {
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
      <DialogContent className="bg-[#0a0a0a] border-[#1a1a1a] text-white max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-xl">
            {appointment ? "Edit Appointment" : "New Appointment"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-gray-400">Customer Name *</Label>
                <Input
                  value={formData.customer_name}
                  onChange={(e) => setFormData({ ...formData, customer_name: e.target.value })}
                  className="bg-black border-[#1a1a1a] text-white"
                  required
                />
              </div>
              <div>
                <Label className="text-gray-400">Phone *</Label>
                <Input
                  value={formData.customer_phone}
                  onChange={(e) => setFormData({ ...formData, customer_phone: e.target.value })}
                  className="bg-black border-[#1a1a1a] text-white"
                  required
                />
              </div>
            </div>

            <div>
              <Label className="text-gray-400">Email</Label>
              <Input
                type="email"
                value={formData.customer_email}
                onChange={(e) => setFormData({ ...formData, customer_email: e.target.value })}
                className="bg-black border-[#1a1a1a] text-white"
              />
            </div>

            <div>
              <Label className="text-gray-400">Service *</Label>
              <Input
                value={formData.service}
                onChange={(e) => setFormData({ ...formData, service: e.target.value })}
                className="bg-black border-[#1a1a1a] text-white"
                placeholder="e.g. Klippning, Färgning"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-gray-400">Date *</Label>
                <Input
                  type="date"
                  value={formData.appointment_date}
                  onChange={(e) => setFormData({ ...formData, appointment_date: e.target.value })}
                  className="bg-black border-[#1a1a1a] text-white"
                  required
                />
              </div>
              <div>
                <Label className="text-gray-400">Time *</Label>
                <Input
                  type="time"
                  value={formData.appointment_time}
                  onChange={(e) => setFormData({ ...formData, appointment_time: e.target.value })}
                  className="bg-black border-[#1a1a1a] text-white"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label className="text-gray-400">Duration (min)</Label>
                <Input
                  type="number"
                  value={formData.duration_minutes}
                  onChange={(e) => setFormData({ ...formData, duration_minutes: parseInt(e.target.value) })}
                  className="bg-black border-[#1a1a1a] text-white"
                />
              </div>
              <div>
                <Label className="text-gray-400">Price (kr)</Label>
                <Input
                  type="number"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: parseInt(e.target.value) })}
                  className="bg-black border-[#1a1a1a] text-white"
                />
              </div>
              <div>
                <Label className="text-gray-400">Status</Label>
                <Select
                  value={formData.status}
                  onValueChange={(value) => setFormData({ ...formData, status: value })}
                >
                  <SelectTrigger className="bg-black border-[#1a1a1a] text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-[#0a0a0a] border-[#1a1a1a]">
                    <SelectItem value="bokad">Bokad</SelectItem>
                    <SelectItem value="bekräftad">Bekräftad</SelectItem>
                    <SelectItem value="genomförd">Genomförd</SelectItem>
                    <SelectItem value="avbokad">Avbokad</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label className="text-gray-400">Notes</Label>
              <Textarea
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                className="bg-black border-[#1a1a1a] text-white"
                rows={3}
              />
            </div>
          </div>

          <DialogFooter className="gap-2">
            {appointment && (
              <Button
                type="button"
                variant="outline"
                onClick={() => onDelete(appointment.id)}
                className="mr-auto border-red-500/20 text-red-500 hover:bg-red-500/10"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Delete
              </Button>
            )}
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="border-[#1a1a1a] text-gray-400 hover:bg-[#1a1a1a]"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isLoading}
              className="bg-[#84CC16] hover:bg-[#84CC16]/90 text-black"
            >
              {appointment ? "Update" : "Create"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}