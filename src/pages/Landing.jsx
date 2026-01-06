import React, { useState, useEffect } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Calendar, Zap, BarChart3, MessageSquare, Star, CheckCircle, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";

export default function Landing() {
  const [activeFeature, setActiveFeature] = useState(0);
  const { scrollYProgress } = useScroll();
  const opacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.2], [1, 0.95]);

  const features = [
    {
      icon: Calendar,
      title: "Intelligent Booking",
      description: "AI-powered scheduling that syncs with Square in real-time. No double bookings, ever."
    },
    {
      icon: MessageSquare,
      title: "24/7 AI Concierge",
      description: "Answer inquiries, book appointments, and handle customer communication automatically."
    },
    {
      icon: BarChart3,
      title: "Smart Analytics",
      description: "Revenue insights, client retention metrics, and predictive booking forecasts."
    },
    {
      icon: Zap,
      title: "Automated Workflows",
      description: "Appointment reminders, feedback requests, and product recommendations on autopilot."
    }
  ];

  const testimonials = [
    {
      name: "Sarah Mitchell",
      role: "Salon Owner, Beverly Hills",
      text: "PESKOI transformed our booking process. We've seen a 40% increase in bookings and zero no-shows."
    },
    {
      name: "Marcus Chen",
      role: "Spa Director, Manhattan",
      text: "The AI concierge handles everything. It's like having a luxury front desk that never sleeps."
    },
    {
      name: "Elena Rodriguez",
      role: "Barbershop Chain Owner",
      text: "ROI in 3 weeks. The automation alone saved us 20 hours per week across all locations."
    }
  ];

  const stats = [
    { value: "99.9%", label: "Uptime" },
    { value: "< 2s", label: "Response Time" },
    { value: "40%", label: "Booking Increase" },
    { value: "24/7", label: "AI Available" }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveFeature((prev) => (prev + 1) % features.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-black text-white overflow-hidden">
      
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-md border-b border-white/[0.08]">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="text-xl font-light tracking-[0.3em]">PESKOI</div>
          <div className="flex items-center gap-8">
            <a href="#features" className="text-sm text-white/60 hover:text-white transition-colors">Features</a>
            <a href="#pricing" className="text-sm text-white/60 hover:text-white transition-colors">Pricing</a>
            <Link 
              to={createPageUrl("ConnectSquare")}
              className="bg-white text-black px-6 py-2 text-sm tracking-wide hover:bg-white/90 transition-colors"
            >
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center px-6">
        <motion.div 
          style={{ opacity, scale }}
          className="text-center max-w-4xl"
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <p className="text-xs text-white/40 tracking-[0.3em] uppercase mb-6">
              The Invisible Front Desk
            </p>
            <h1 className="text-5xl sm:text-7xl lg:text-8xl font-light tracking-tight mb-8 leading-tight">
              Luxury Salon<br />
              <span className="text-white/60">Automation</span>
            </h1>
            <p className="text-lg sm:text-xl text-white/60 mb-12 max-w-2xl mx-auto leading-relaxed">
              AI-powered concierge that books appointments, manages clients, and grows your business. 
              Invisible. Intelligent. Luxury.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Link
              to={createPageUrl("ConnectSquare")}
              className="bg-white text-black px-8 py-4 text-sm tracking-wide hover:bg-white/90 transition-all inline-flex items-center justify-center gap-2"
            >
              Start Free Trial
              <ArrowRight className="w-4 h-4" />
            </Link>
            <a
              href="#demo"
              className="border border-white/[0.08] px-8 py-4 text-sm tracking-wide hover:border-white/20 transition-all"
            >
              Watch Demo
            </a>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.5 }}
            className="grid grid-cols-4 gap-8 mt-20 pt-12 border-t border-white/[0.08]"
          >
            {stats.map((stat, idx) => (
              <div key={idx} className="text-center">
                <div className="text-2xl sm:text-3xl font-light mb-2">{stat.value}</div>
                <div className="text-xs text-white/40 tracking-wide">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </motion.div>

        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1 }}
          className="absolute bottom-12 left-1/2 -translate-x-1/2"
        >
          <div className="w-[1px] h-16 bg-gradient-to-b from-white/20 to-transparent" />
        </motion.div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-32 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <p className="text-xs text-white/40 tracking-[0.3em] uppercase mb-4">Features</p>
            <h2 className="text-4xl sm:text-5xl font-light tracking-tight">
              Built for <span className="text-white/60">Modern Salons</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="border border-white/[0.08] p-8 hover:border-white/20 transition-all group cursor-pointer"
              >
                <feature.icon className="w-8 h-8 mb-6 text-white/60 group-hover:text-white transition-colors" />
                <h3 className="text-lg font-light mb-3 tracking-wide">{feature.title}</h3>
                <p className="text-sm text-white/60 leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-32 px-6 bg-white/[0.02]">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-20">
            <p className="text-xs text-white/40 tracking-[0.3em] uppercase mb-4">Process</p>
            <h2 className="text-4xl sm:text-5xl font-light tracking-tight">
              <span className="text-white/60">Simple</span> Setup
            </h2>
          </div>

          <div className="space-y-12">
            {[
              { step: "01", title: "Connect Square", desc: "One-click OAuth integration with your Square account" },
              { step: "02", title: "AI Configuration", desc: "Customize your AI concierge's tone and business rules" },
              { step: "03", title: "Go Live", desc: "Start accepting bookings and automating workflows instantly" }
            ].map((item, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="flex gap-8 items-start border-l border-white/[0.08] pl-8 py-4"
              >
                <div className="text-4xl font-light text-white/20">{item.step}</div>
                <div className="flex-1">
                  <h3 className="text-xl font-light mb-2">{item.title}</h3>
                  <p className="text-white/60">{item.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-32 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <p className="text-xs text-white/40 tracking-[0.3em] uppercase mb-4">Testimonials</p>
            <h2 className="text-4xl sm:text-5xl font-light tracking-tight">
              Trusted by <span className="text-white/60">Industry Leaders</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="border border-white/[0.08] p-8"
              >
                <div className="flex gap-1 mb-6">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-white text-white" />
                  ))}
                </div>
                <p className="text-white/80 mb-6 leading-relaxed">{testimonial.text}</p>
                <div>
                  <p className="text-sm font-light">{testimonial.name}</p>
                  <p className="text-xs text-white/40">{testimonial.role}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-32 px-6 bg-white/[0.02]">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-20">
            <p className="text-xs text-white/40 tracking-[0.3em] uppercase mb-4">Pricing</p>
            <h2 className="text-4xl sm:text-5xl font-light tracking-tight">
              Simple <span className="text-white/60">Transparent</span> Pricing
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                name: "Starter",
                price: "$99",
                features: ["AI Concierge", "Square Integration", "Basic Analytics", "Email Support"]
              },
              {
                name: "Professional",
                price: "$199",
                features: ["Everything in Starter", "Advanced Analytics", "Automation Workflows", "Priority Support"],
                featured: true
              },
              {
                name: "Enterprise",
                price: "$499",
                features: ["Everything in Pro", "Multi-location", "White-label", "Dedicated Success Manager"]
              }
            ].map((plan, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className={`border p-8 ${
                  plan.featured 
                    ? 'border-white bg-white/[0.03]' 
                    : 'border-white/[0.08]'
                }`}
              >
                <div className="text-xs text-white/40 tracking-[0.15em] uppercase mb-4">{plan.name}</div>
                <div className="text-4xl font-light mb-8">
                  {plan.price}
                  <span className="text-lg text-white/40">/mo</span>
                </div>
                <div className="space-y-4 mb-8">
                  {plan.features.map((feature, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <CheckCircle className="w-4 h-4 mt-0.5 text-white/60" />
                      <span className="text-sm text-white/80">{feature}</span>
                    </div>
                  ))}
                </div>
                <Link
                  to={createPageUrl("ConnectSquare")}
                  className={`block text-center py-3 text-sm tracking-wide transition-colors ${
                    plan.featured
                      ? 'bg-white text-black hover:bg-white/90'
                      : 'border border-white/[0.08] hover:border-white/20'
                  }`}
                >
                  Start Free Trial
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-4xl sm:text-6xl font-light tracking-tight mb-8">
              Ready to <span className="text-white/60">Elevate</span> Your Salon?
            </h2>
            <p className="text-lg text-white/60 mb-12 max-w-2xl mx-auto">
              Join hundreds of luxury salons using PESKOI to automate bookings and grow revenue.
            </p>
            <Link
              to={createPageUrl("ConnectSquare")}
              className="inline-flex items-center gap-2 bg-white text-black px-8 py-4 text-sm tracking-wide hover:bg-white/90 transition-all"
            >
              Start Your Free Trial
              <ArrowRight className="w-4 h-4" />
            </Link>
            <p className="text-xs text-white/40 mt-6">No credit card required · 14-day free trial</p>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/[0.08] py-12 px-6">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="text-xl font-light tracking-[0.3em]">PESKOI</div>
          <div className="flex gap-8">
            <a href="#" className="text-xs text-white/40 hover:text-white transition-colors">Privacy</a>
            <a href="#" className="text-xs text-white/40 hover:text-white transition-colors">Terms</a>
            <a href="#" className="text-xs text-white/40 hover:text-white transition-colors">Contact</a>
          </div>
        </div>
      </footer>

    </div>
  );
}