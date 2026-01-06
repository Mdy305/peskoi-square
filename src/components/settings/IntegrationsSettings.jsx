import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Save, Calendar, Phone, HelpCircle, CheckCircle, AlertCircle, DollarSign, ExternalLink } from "lucide-react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import IntegrationsGuide from "./IntegrationsGuide";

export default function IntegrationsSettings({ business, onSave }) {
  const [formData, setFormData] = useState({
    google_calendar_id: "",
    twilio_phone_number: "",
  });

  const [showGuide, setShowGuide] = useState(null);

  useEffect(() => {
    if (business) {
      setFormData({
        google_calendar_id: business.google_calendar_id || "",
        twilio_phone_number: business.twilio_phone_number || "",
      });
    }
  }, [business]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  const isTwilioConnected = formData.twilio_phone_number?.length > 0;
  const isGoogleConnected = formData.google_calendar_id?.length > 0;

  return (
    <>
      <Card className="bg-[#0a0a0a] border-[#1f1f1f]">
        <CardHeader>
          <CardTitle className="text-base sm:text-lg text-white flex items-center gap-2">
            <Phone className="w-5 h-5 text-[#84CC16]" />
            Integrations
          </CardTitle>
          <p className="text-xs sm:text-sm text-gray-500 mt-2">
            Connect external services to activate your AI assistant
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
            {/* Twilio Integration */}
            <div className="space-y-3 p-4 rounded-lg border border-[#1f1f1f] bg-black">
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2">
                    <Phone className="w-4 h-4 text-[#84CC16] flex-shrink-0" />
                    <h3 className="text-sm font-semibold text-white">Twilio (Voice & SMS)</h3>
                    {isTwilioConnected ? (
                      <Badge className="bg-[#84CC16]/20 text-[#84CC16] text-xs ml-auto">
                        <CheckCircle className="w-3 h-3 mr-1" />
                        Connected
                      </Badge>
                    ) : (
                      <Badge className="bg-yellow-500/20 text-yellow-500 text-xs ml-auto">
                        <AlertCircle className="w-3 h-3 mr-1" />
                        Not connected
                      </Badge>
                    )}
                  </div>
                  <p className="text-xs text-gray-400 mb-3">
                    Phone service for receiving real calls. Customers call your Twilio number and AI answers automatically.
                  </p>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowGuide('twilio')}
                  className="text-[#84CC16] hover:bg-[#84CC16]/10 h-8 w-8 p-0 flex-shrink-0"
                >
                  <HelpCircle className="w-4 h-4" />
                </Button>
              </div>
              
              <div>
                <Label className="text-xs text-gray-400">Twilio Phone Number</Label>
                <Input
                  value={formData.twilio_phone_number}
                  onChange={(e) => setFormData({ ...formData, twilio_phone_number: e.target.value })}
                  className="bg-[#0a0a0a] border-[#1f1f1f] text-white mt-1.5 text-sm h-10"
                  placeholder="+1 234 567 8900"
                />
                <p className="text-xs text-gray-500 mt-1.5">
                  Customers will call this number to book appointments
                </p>
              </div>

              {/* Twilio Setup Guide */}
              <div className="p-3 rounded-lg bg-blue-500/5 border border-blue-500/10">
                <h4 className="text-xs font-semibold text-white mb-2 flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-blue-400" />
                  Quick Guide: Getting started with Twilio
                </h4>
                <ol className="text-xs text-gray-400 space-y-1 list-decimal list-inside">
                  <li>Go to <a href="https://twilio.com" target="_blank" className="text-[#84CC16] underline">twilio.com</a> and create account</li>
                  <li>Verify your account and add credit</li>
                  <li>Buy a phone number under "Phone Numbers"</li>
                  <li>Configure webhook URLs in Twilio console</li>
                  <li>Add API credentials in Dashboard → Settings → Environment Variables</li>
                  <li>Paste your Twilio number here</li>
                  <li>Click "Save Changes" below</li>
                  <li>🎉 Call your number and test Evelina!</li>
                </ol>
              </div>

              {/* Twilio Cost Info */}
              <div className="p-2.5 rounded-lg bg-blue-500/5 border border-blue-500/10">
                <div className="flex gap-2">
                  <DollarSign className="w-4 h-4 text-blue-400 flex-shrink-0 mt-0.5" />
                  <div className="text-xs text-gray-400 space-y-0.5">
                    <p className="font-semibold text-blue-400">Twilio costs:</p>
                    <p>• Phone number: ~$3/month</p>
                    <p>• Per call (avg 3 min): ~$1/call</p>
                    <p>• SMS: ~$0.05/message</p>
                    <p className="text-gray-500 pt-1">Billed separately by Twilio</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Google Calendar Integration */}
            <div className="space-y-3 p-4 rounded-lg border border-[#1f1f1f] bg-black">
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2">
                    <Calendar className="w-4 h-4 text-[#84CC16] flex-shrink-0" />
                    <h3 className="text-sm font-semibold text-white">Google Calendar</h3>
                    {isGoogleConnected ? (
                      <Badge className="bg-[#84CC16]/20 text-[#84CC16] text-xs ml-auto">
                        <CheckCircle className="w-3 h-3 mr-1" />
                        Connected
                      </Badge>
                    ) : (
                      <Badge className="bg-yellow-500/20 text-yellow-500 text-xs ml-auto">
                        <AlertCircle className="w-3 h-3 mr-1" />
                        Not connected
                      </Badge>
                    )}
                  </div>
                  <p className="text-xs text-gray-400 mb-3">
                    Sync bookings with your calendar. AI automatically checks available times.
                  </p>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowGuide('google')}
                  className="text-[#84CC16] hover:bg-[#84CC16]/10 h-8 w-8 p-0 flex-shrink-0"
                >
                  <HelpCircle className="w-4 h-4" />
                </Button>
              </div>
              
              <div>
                <Label className="text-xs text-gray-400">Google Calendar ID</Label>
                <Input
                  value={formData.google_calendar_id}
                  onChange={(e) => setFormData({ ...formData, google_calendar_id: e.target.value })}
                  className="bg-[#0a0a0a] border-[#1f1f1f] text-white mt-1.5 text-sm h-10"
                  placeholder="example@group.calendar.google.com"
                />
                <p className="text-xs text-gray-500 mt-1.5">
                  Found in Google Calendar settings
                </p>
              </div>

              {/* Google Calendar Cost Info */}
              <div className="p-2.5 rounded-lg bg-green-500/5 border border-green-500/10">
                <div className="flex gap-2">
                  <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0 mt-0.5" />
                  <div className="text-xs text-gray-400">
                    <p className="font-semibold text-green-400 mb-0.5">Google Calendar is free!</p>
                    <p>No additional cost for synchronization</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Pricing Link */}
            <Card className="bg-gradient-to-br from-[#84CC16]/10 to-[#84CC16]/5 border-[#84CC16]/20">
              <CardContent className="p-3.5">
                <div className="flex items-start gap-2.5">
                  <DollarSign className="w-4 h-4 text-[#84CC16] flex-shrink-0 mt-0.5" />
                  <div className="flex-1 min-w-0">
                    <h4 className="text-xs font-semibold text-white mb-1">Wondering about total costs?</h4>
                    <p className="text-xs text-gray-400 mb-2">
                      See complete cost breakdown and our plans
                    </p>
                    <Link to={createPageUrl("Pricing")}>
                      <Button 
                        type="button"
                        variant="outline" 
                        size="sm"
                        className="border-[#84CC16]/30 text-[#84CC16] hover:bg-[#84CC16]/10 w-full text-xs h-8"
                      >
                        <ExternalLink className="w-3 h-3 mr-1.5" />
                        View Pricing
                      </Button>
                    </Link>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="flex justify-end pt-2">
              <Button type="submit" className="bg-[#84CC16] hover:bg-[#84CC16]/90 text-black w-full sm:w-auto text-sm h-10">
                <Save className="w-4 h-4 mr-2" />
                Save Changes
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <IntegrationsGuide
        isOpen={!!showGuide}
        onClose={() => setShowGuide(null)}
        type={showGuide}
      />
    </>
  );
}