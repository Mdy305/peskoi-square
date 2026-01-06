import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  BookOpen,
  Building2,
  Users,
  Phone,
  Calendar,
  MessageSquare,
  Settings,
  BarChart3,
  Sparkles,
  CheckCircle,
  ArrowRight,
  Globe,
  Mic,
  Clock,
  Mail
} from "lucide-react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Button } from "@/components/ui/button";

export default function Guide() {
  const sections = [
    {
      title: "Vad är BokaMig.ai?",
      icon: Sparkles,
      color: "from-purple-500 to-purple-600",
      content: [
        "BokaMig.ai är en komplett AI-driven bokningslösning för svenska lokala företag som frisörer, massörer, kliniker och hantverkare.",
        "Systemet använder avancerad röst-AI (OpenAI Realtime API) för att svara på kunders samtal, förstå deras önskemål och boka tider automatiskt.",
        "Allt sker på svenska med naturlig konversation, 24/7, så du aldrig missar en potentiell kund."
      ]
    },
    {
      title: "Vad Företagare Ser (Din Vy)",
      icon: Building2,
      color: "from-blue-500 to-blue-600",
      content: [
        "Dashboard: Översikt med statistik, intäkter, kommande bokningar och samtalshistorik",
        "Kalender: Hantera alla bokningar, redigera tider, se månadsöversikt",
        "Samtalshistorik: Varje samtal sparas med transkription och resultat",
        "Inställningar: Konfigurera företagsinformation, tjänster, öppettider och AI-instruktioner",
        "Analytik: Visuella grafer över omsättning, tjänstefördelning och konvertering",
        "Live Demo: Testa din AI-receptionist innan du går live"
      ]
    },
    {
      title: "Vad Kunder Ser",
      icon: Users,
      color: "from-green-500 to-green-600",
      content: [
        "Kunderna ringer ditt vanliga telefonnummer (via Twilio)",
        "De möts av en vänlig svensk AI-röst som hälsar välkommen",
        "AI:n ställer frågor om vilken tjänst de vill boka",
        "Kontrollerar tillgängliga tider i din kalender",
        "Föreslår 2-3 alternativ och tar emot kundens val",
        "Bekräftar bokningen och skickar SMS-bekräftelse",
        "Kunden kan även se en mobilanpassad webbsida med info och tjänster (CustomerView)"
      ]
    }
  ];

  const pages = [
    {
      name: "Översikt (Home)",
      icon: BookOpen,
      description: "Landing page som förklarar systemet, visar nyckelfördelar och guider dig igenom setup-processen",
      features: ["Produktbeskrivning", "Funktionslista", "Steg-för-steg guide", "API-status"]
    },
    {
      name: "Dashboard",
      icon: BarChart3,
      description: "Din huvudöversikt med realtidsdata om bokningar, samtal och intäkter",
      features: ["Snabbstatistik", "Senaste bokningar", "Samtalsöversikt", "Snabbåtgärder"]
    },
    {
      name: "Live Demo",
      icon: Mic,
      description: "Testa AI-röstassistenten direkt i webbläsaren innan du kopplar in Twilio",
      features: ["Simulerad röstkonversation", "Se hur AI svarar", "Testa bokningsflödet"]
    },
    {
      name: "Kalender",
      icon: Calendar,
      description: "Komplett bokningshantering med kalendervy och listvy",
      features: ["Månadskalender", "Skapa/redigera bokningar", "Status-hantering", "Kundinformation"]
    },
    {
      name: "Samtalshistorik",
      icon: Phone,
      description: "Alla samtal sparas med detaljer, transkriptioner och resultat",
      features: ["Samtalslista", "Transkriptioner", "Statistik", "Sökfunktion"]
    },
    {
      name: "Analytik",
      icon: BarChart3,
      description: "Visuell data över din verksamhet med grafer och nyckeltal",
      features: ["Omsättningsgrafer", "Tjänstefördelning", "Konverteringsrate", "Trender"]
    },
    {
      name: "Inställningar",
      icon: Settings,
      description: "Konfigurera allt från företagsinformation till AI-beteende",
      features: ["Företagsinfo", "Tjänster & priser", "Öppettider", "AI-instruktioner", "Integrationer"]
    },
    {
      name: "Kundvy (CustomerView)",
      icon: Users,
      description: "Så här ser din mobilanpassade webbsida ut för kunder",
      features: ["Företagsinfo", "Öppettider", "Tjänster & priser", "Ring-knapp"]
    }
  ];

  const workflow = [
    {
      step: 1,
      title: "Kund Ringer",
      description: "Kund ringer ditt Twilio-nummer som är kopplat till BokaMig.ai",
      icon: Phone
    },
    {
      step: 2,
      title: "AI Svarar",
      description: "OpenAI Realtime API aktiveras och AI-receptionisten hälsar välkommen på svenska",
      icon: Mic
    },
    {
      step: 3,
      title: "Samtal & Bokning",
      description: "AI förstår kundens önskemål, kollar Google Calendar och föreslår tider",
      icon: Calendar
    },
    {
      step: 4,
      title: "Bekräftelse",
      description: "Bokning sparas i databasen, läggs in i Google Calendar, SMS skickas till kund (Resend/Twilio)",
      icon: MessageSquare
    },
    {
      step: 5,
      title: "Du Notifieras",
      description: "Du får automatisk notifiering om den nya bokningen via email",
      icon: Mail
    },
    {
      step: 6,
      title: "Översikt i Dashboard",
      description: "Allt loggas och visas i din dashboard med transkription och kundinformation",
      icon: BarChart3
    }
  ];

  const integrations = [
    {
      name: "OpenAI Realtime API",
      purpose: "AI-röstkonversation",
      status: "Krävs",
      icon: Sparkles
    },
    {
      name: "Twilio",
      purpose: "Telefoni & SMS",
      status: "Krävs",
      icon: Phone
    },
    {
      name: "Google Calendar",
      purpose: "Kalendersynk",
      status: "Krävs",
      icon: Calendar
    },
    {
      name: "Resend",
      purpose: "Email-notiser",
      status: "Krävs",
      icon: Mail
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0A0A0A] via-[#0D0D0D] to-[#0A0A0A] p-6 lg:p-8">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-12 text-center">
          <Badge className="mb-4 bg-[#84CC16]/10 text-[#84CC16] border-[#84CC16]/20 px-4 py-2">
            <BookOpen className="w-4 h-4 mr-2" />
            Komplett Guide
          </Badge>
          <h1 className="text-4xl lg:text-5xl font-bold mb-4">
            <span className="gradient-text">Hur Fungerar</span>
            <br />
            <span className="text-white">BokaMig.ai?</span>
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            En fullständig förklaring av systemet, sidorna och arbetsflödet
          </p>
        </div>

        {/* Overview Sections */}
        {sections.map((section, index) => (
          <Card key={index} className="bg-gradient-to-br from-[#1A1A1A] to-[#0F0F0F] border-[#2A2A2A] mb-6">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-3">
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${section.color} flex items-center justify-center shadow-lg`}>
                  <section.icon className="w-6 h-6 text-white" />
                </div>
                {section.title}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {section.content.map((item, i) => (
                  <li key={i} className="flex items-start gap-3 text-gray-300 leading-relaxed">
                    <CheckCircle className="w-5 h-5 text-[#84CC16] flex-shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        ))}

        {/* Pages Overview */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-white mb-6 flex items-center gap-3">
            <Globe className="w-8 h-8 text-[#84CC16]" />
            Översikt Alla Sidor
          </h2>
          <div className="grid md:grid-cols-2 gap-4">
            {pages.map((page, index) => (
              <Card key={index} className="bg-[#1A1A1A]/50 border-[#2A2A2A] hover:border-[#84CC16]/30 transition-all duration-300 group backdrop-blur-xl">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4 mb-3">
                    <div className="w-10 h-10 rounded-lg bg-[#84CC16]/10 flex items-center justify-center group-hover:bg-[#84CC16]/20 transition-colors">
                      <page.icon className="w-5 h-5 text-[#84CC16]" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-white font-semibold mb-1">{page.name}</h3>
                      <p className="text-sm text-gray-400 leading-relaxed">{page.description}</p>
                    </div>
                  </div>
                  <div className="pl-14">
                    <div className="flex flex-wrap gap-2">
                      {page.features.map((feature, i) => (
                        <Badge key={i} variant="outline" className="text-xs border-[#2A2A2A] text-gray-400">
                          {feature}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Workflow */}
        <Card className="bg-gradient-to-br from-[#1A1A1A] to-[#0F0F0F] border-[#2A2A2A] mb-12">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-3">
              <ArrowRight className="w-6 h-6 text-[#84CC16]" />
              Bokningsflöde: Från Samtal Till Bekräftelse
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {workflow.map((item, index) => (
                <div key={index} className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#84CC16] to-[#65A30D] flex items-center justify-center font-bold text-black shadow-lg shadow-[#84CC16]/30">
                      {item.step}
                    </div>
                    {index < workflow.length - 1 && (
                      <div className="w-0.5 h-12 bg-gradient-to-b from-[#84CC16] to-transparent mt-2"></div>
                    )}
                  </div>
                  <div className="flex-1 pb-6">
                    <div className="flex items-center gap-2 mb-2">
                      <item.icon className="w-5 h-5 text-[#84CC16]" />
                      <h3 className="text-white font-semibold">{item.title}</h3>
                    </div>
                    <p className="text-gray-400 leading-relaxed">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Integrations */}
        <Card className="bg-gradient-to-br from-[#1A1A1A] to-[#0F0F0F] border-[#2A2A2A] mb-12">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-3">
              <Sparkles className="w-6 h-6 text-[#84CC16]" />
              Nödvändiga Integrationer
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-4 mb-6">
              {integrations.map((integration, index) => (
                <div key={index} className="p-4 rounded-lg bg-[#0A0A0A]/50 border border-[#2A2A2A] flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <integration.icon className="w-5 h-5 text-[#84CC16]" />
                    <div>
                      <h4 className="text-white font-medium">{integration.name}</h4>
                      <p className="text-sm text-gray-400">{integration.purpose}</p>
                    </div>
                  </div>
                  <Badge className="bg-yellow-500/10 text-yellow-500 border-yellow-500/20">
                    {integration.status}
                  </Badge>
                </div>
              ))}
            </div>
            <div className="p-4 rounded-lg bg-yellow-500/5 border border-yellow-500/20">
              <p className="text-sm text-gray-300 leading-relaxed">
                <strong className="text-yellow-500">Demo-läge:</strong> Alla funktioner fungerar i simulerat läge. 
                För att aktivera live-drift, konfigurera API-nycklar under Inställningar → Integreringar.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* CTA */}
        <Card className="bg-gradient-to-r from-[#84CC16] to-[#65A30D] border-none shadow-lg shadow-[#84CC16]/30">
          <CardContent className="p-8 text-center">
            <h2 className="text-2xl font-bold text-black mb-3">Redo Att Sätta Upp?</h2>
            <p className="text-black/80 mb-6 max-w-xl mx-auto">
              Börja med att konfigurera ditt företag och testa AI-assistenten i demo-läge
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link to={createPageUrl("Settings")}>
                <Button className="bg-black hover:bg-black/90 text-white font-semibold px-6">
                  <Settings className="w-4 h-4 mr-2" />
                  Konfigurera Företag
                </Button>
              </Link>
              <Link to={createPageUrl("LiveDemo")}>
                <Button variant="outline" className="border-2 border-black text-black hover:bg-black/10">
                  <Mic className="w-4 h-4 mr-2" />
                  Testa Demo
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}