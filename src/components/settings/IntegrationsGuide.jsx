import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ExternalLink, CheckCircle } from "lucide-react";

export default function IntegrationsGuide({ isOpen, onClose, type }) {
  const guides = {
    twilio: {
      title: "Så kopplar du Twilio",
      steps: [
        {
          title: "1. Skapa Twilio-konto",
          description: "Gå till twilio.com/try-twilio och registrera dig. Du får gratis kredit att testa med!"
        },
        {
          title: "2. Köp ett svenskt nummer",
          description: "Välj Phone Numbers → Buy a Number → Välj Sverige (+46). Kostnader: ~70-100 kr/månad + per-minut kostnad."
        },
        {
          title: "3. Hitta API-nycklar",
          description: "Gå till Dashboard → Account Info. Där hittar du:\n• Account SID\n• Auth Token"
        },
        {
          title: "4. Klistra in i vårt system",
          description: "Kopiera din Account SID och Auth Token och klistra in dem i fälten här. Vi kopplar automatiskt ditt nummer till AI-assistenten."
        },
        {
          title: "5. Testa!",
          description: "Ring ditt nya nummer - AI-assistenten svarar direkt på svenska!"
        }
      ],
      link: "https://www.twilio.com/try-twilio"
    },
    google: {
      title: "Så kopplar du Google Calendar",
      steps: [
        {
          title: "1. Öppna Google Calendar",
          description: "Gå till calendar.google.com och logga in med ditt Google-konto."
        },
        {
          title: "2. Hitta din Kalender-ID",
          description: "Klicka på de tre punkterna bredvid din kalender → Inställningar och delning → scrolla ner till 'Integrera kalender' → kopiera Kalender-ID."
        },
        {
          title: "3. Aktivera API-åtkomst",
          description: "Gå till console.cloud.google.com → APIs & Services → Enable 'Google Calendar API'."
        },
        {
          title: "4. Klistra in Kalender-ID",
          description: "Kopiera ditt Kalender-ID (brukar sluta på @group.calendar.google.com) och klistra in det här."
        },
        {
          title: "5. Synkronisering aktiv!",
          description: "Nu synkas alla bokningar automatiskt med din Google Calendar."
        }
      ],
      link: "https://calendar.google.com"
    },
    bokadirekt: {
      title: "Så kopplar du BokaDirekt",
      steps: [
        {
          title: "1. Logga in på BokaDirekt",
          description: "Gå till ditt BokaDirekt-konto och logga in som administratör."
        },
        {
          title: "2. Hitta API-inställningar",
          description: "Kontakta BokaDirekt support och be om API-åtkomst. De ger dig:\n• API-nyckel\n• Company ID"
        },
        {
          title: "3. Klistra in uppgifter",
          description: "Lägg in din API-nyckel och Company ID i vårt system."
        },
        {
          title: "4. Automatisk synkning",
          description: "AI-assistenten kollar automatiskt BokaDirekt för lediga tider och skapar bokningar direkt i systemet!"
        },
        {
          title: "5. Fortsätt använda BokaDirekt",
          description: "Du kan fortsätta hantera bokningar i BokaDirekt som vanligt - allt synkas!"
        }
      ],
      link: "https://www.bokadirekt.se"
    }
  };

  const guide = guides[type] || guides.twilio;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-[#0a0a0a] border-[#1f1f1f] text-white max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl text-white">{guide.title}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {guide.steps.map((step, index) => (
            <Card key={index} className="bg-black border-[#1f1f1f]">
              <CardContent className="p-4">
                <div className="flex gap-3">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 rounded-full bg-[#84CC16] flex items-center justify-center">
                      <span className="text-black font-bold text-sm">
                        {index + 1}
                      </span>
                    </div>
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-white mb-2">{step.title}</h4>
                    <p className="text-sm text-gray-400 whitespace-pre-line">
                      {step.description}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}

          <Card className="bg-[#84CC16]/10 border-[#84CC16]/20">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle className="w-5 h-5 text-[#84CC16]" />
                <h4 className="font-semibold text-white">Behöver du hjälp?</h4>
              </div>
              <p className="text-sm text-gray-400 mb-3">
                Kontakta vår support så hjälper vi dig att komma igång!
              </p>
              <Button
                asChild
                variant="outline"
                className="w-full border-[#84CC16] text-[#84CC16] hover:bg-[#84CC16]/10"
              >
                <a href={guide.link} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Öppna {type === 'twilio' ? 'Twilio' : type === 'google' ? 'Google Calendar' : 'BokaDirekt'}
                </a>
              </Button>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
}