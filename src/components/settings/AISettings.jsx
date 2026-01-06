import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Save, Bot, RotateCcw, Mail, MessageSquare } from "lucide-react";

export default function AISettings({ business, onSave }) {
  const [formData, setFormData] = useState({
    ai_instructions: "",
    confirmation_template: "",
    reminder_template: "",
    booking_buffer_minutes: 15,
    send_customer_reminders: true,
    reminder_hours_before: 24,
  });

  const defaultInstructions = "You are a friendly and professional receptionist helping customers book appointments. Be polite, clear, and helpful. Always ask for the customer's name and phone number. Always confirm the appointment time before ending the call.";
  
  const defaultConfirmation = "Hi {name}! Your appointment for {service} is booked on {date} at {time} at {business_name}. We look forward to seeing you! Call us at {phone} if you need to change the time.";
  
  const defaultReminder = "Hi {name}! Reminder: You have an appointment for {service} tomorrow {date} at {time} at {business_name}. See you then! Call {phone} with questions.";

  useEffect(() => {
    if (business) {
      setFormData({
        ai_instructions: business.ai_instructions || defaultInstructions,
        confirmation_template: business.confirmation_template || defaultConfirmation,
        reminder_template: business.reminder_template || defaultReminder,
        booking_buffer_minutes: business.booking_buffer_minutes || 15,
        send_customer_reminders: business.send_customer_reminders ?? true,
        reminder_hours_before: business.reminder_hours_before || 24,
      });
    }
  }, [business]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  const handleReset = () => {
    setFormData({
      ...formData,
      ai_instructions: defaultInstructions,
      confirmation_template: defaultConfirmation,
      reminder_template: defaultReminder,
    });
  };

  return (
    <Card className="bg-[#0a0a0a] border-[#1f1f1f]">
      <CardHeader>
        <CardTitle className="text-base sm:text-lg text-white flex items-center gap-2">
          <Bot className="w-4 h-4 sm:w-5 sm:h-5 text-[#84CC16]" />
          AI & Messages
        </CardTitle>
        <p className="text-xs text-gray-500 mt-1 sm:mt-2">
          Customize how AI speaks and which messages are sent
        </p>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
          {/* AI Instructions */}
          <div className="space-y-3 p-3 sm:p-4 rounded-lg border border-[#1f1f1f] bg-black">
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center gap-2">
                <Bot className="w-4 h-4 text-[#84CC16]" />
                <h3 className="text-sm font-semibold text-white">AI Instructions</h3>
              </div>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={handleReset}
                className="text-gray-400 hover:text-white h-7 px-2 text-xs"
              >
                <RotateCcw className="w-3 h-3 mr-1" />
                Reset
              </Button>
            </div>
            <p className="text-xs text-gray-400 mb-2">
              Tell AI how it should behave and talk with your customers
            </p>
            <Textarea
              value={formData.ai_instructions}
              onChange={(e) => setFormData({ ...formData, ai_instructions: e.target.value })}
              className="bg-[#0a0a0a] border-[#1f1f1f] text-white min-h-[100px] text-xs sm:text-sm"
              placeholder={defaultInstructions}
            />
          </div>

          {/* SMS Confirmation */}
          <div className="space-y-3 p-3 sm:p-4 rounded-lg border border-[#1f1f1f] bg-black">
            <div className="flex items-center gap-2 mb-1">
              <MessageSquare className="w-4 h-4 text-[#84CC16]" />
              <h3 className="text-sm font-semibold text-white">SMS Confirmation</h3>
            </div>
            <p className="text-xs text-gray-400 mb-2">
              Sent immediately after a booking is made
            </p>
            <Textarea
              value={formData.confirmation_template}
              onChange={(e) => setFormData({ ...formData, confirmation_template: e.target.value })}
              className="bg-[#0a0a0a] border-[#1f1f1f] text-white min-h-[80px] text-xs sm:text-sm"
              placeholder={defaultConfirmation}
            />
            <div className="text-xs text-gray-500 space-y-0.5">
              <p className="font-semibold text-gray-400 mb-1">Variables:</p>
              <p>• {"{name}"} {"{service}"} {"{date}"} {"{time}"} {"{business_name}"} {"{phone}"}</p>
            </div>
          </div>

          {/* SMS Reminder */}
          <div className="space-y-3 p-3 sm:p-4 rounded-lg border border-[#1f1f1f] bg-black">
            <div className="flex items-center gap-2 mb-1">
              <Mail className="w-4 h-4 text-[#84CC16]" />
              <h3 className="text-sm font-semibold text-white">SMS Reminder</h3>
            </div>
            <p className="text-xs text-gray-400 mb-2">
              Automatic reminder sent to customer
            </p>
            
            <div className="flex items-center gap-2 mb-3">
              <input
                type="checkbox"
                checked={formData.send_customer_reminders}
                onChange={(e) => setFormData({ ...formData, send_customer_reminders: e.target.checked })}
                className="w-4 h-4 rounded border-[#1f1f1f] bg-[#0a0a0a] text-[#84CC16]"
                id="reminders"
              />
              <label htmlFor="reminders" className="text-xs text-gray-300 cursor-pointer">
                Enable automatic reminders
              </label>
            </div>

            {formData.send_customer_reminders && (
            <>
              <div>
                <Label className="text-xs text-gray-400">Hours before appointment</Label>
                <Input
                  type="number"
                  value={formData.reminder_hours_before}
                  onChange={(e) => setFormData({ ...formData, reminder_hours_before: parseInt(e.target.value) })}
                  className="bg-[#0a0a0a] border-[#1f1f1f] text-white mt-1.5 text-xs sm:text-sm h-9"
                  min="1"
                  max="168"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Default: 24 hours (1 day) before
                </p>
              </div>

                <Textarea
                  value={formData.reminder_template}
                  onChange={(e) => setFormData({ ...formData, reminder_template: e.target.value })}
                  className="bg-[#0a0a0a] border-[#1f1f1f] text-white min-h-[80px] text-xs sm:text-sm"
                  placeholder={defaultReminder}
                />
              </>
            )}
          </div>

          {/* Booking Buffer */}
          <div className="space-y-3 p-3 sm:p-4 rounded-lg border border-[#1f1f1f] bg-black">
            <div className="flex items-center gap-2 mb-1">
              <Bot className="w-4 h-4 text-[#84CC16]" />
              <h3 className="text-sm font-semibold text-white">Booking Settings</h3>
            </div>
            <div>
              <Label className="text-xs text-gray-400">Buffer between bookings (min)</Label>
              <Input
                type="number"
                value={formData.booking_buffer_minutes}
                onChange={(e) => setFormData({ ...formData, booking_buffer_minutes: parseInt(e.target.value) })}
                className="bg-[#0a0a0a] border-[#1f1f1f] text-white mt-1.5 text-xs sm:text-sm h-9"
                min="0"
                max="60"
              />
              <p className="text-xs text-gray-500 mt-1">
                Extra time for preparation and cleanup
              </p>
            </div>
          </div>

          {/* Info Box */}
          <Card className="bg-blue-500/5 border-blue-500/20">
            <CardContent className="p-3">
              <div className="flex gap-2">
                <MessageSquare className="w-4 h-4 text-blue-500 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-semibold text-white mb-1">About messages</h4>
                  <ul className="text-xs text-gray-400 space-y-0.5">
                    <li>• Confirmation SMS sent immediately after booking</li>
                    <li>• Reminder SMS sent X hours before (if enabled)</li>
                    <li>• You always get email for new bookings</li>
                    <li>• SMS cost: ~$0.05/message</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end pt-2">
            <Button type="submit" className="bg-[#84CC16] hover:bg-[#84CC16]/90 text-black w-full sm:w-auto text-sm h-9">
              <Save className="w-4 h-4 mr-2" />
              Save Changes
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}