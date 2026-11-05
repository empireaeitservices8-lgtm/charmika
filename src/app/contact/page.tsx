'use client';

import React, { useState } from 'react';
import { MapPin, Phone, Mail, Clock, Send, CheckCircle2, MessageSquare, Sparkles, Gem } from 'lucide-react';
import { useToast } from '@/context/ToastContext';

export default function ContactPage() {
  const { addToast } = useToast();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: 'Rental Booking Inquiry',
    message: '',
  });

  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.name && formData.email && formData.message) {
      setSubmitted(true);
      addToast('Message sent successfully! Our team will get back to you shortly.', 'success');
    }
  };

  const handleReset = () => {
    setFormData({
      name: '',
      email: '',
      phone: '',
      subject: 'Rental Booking Inquiry',
      message: '',
    });
    setSubmitted(false);
  };

  const directWhatsAppInquiries = [
    {
      title: 'Bridal Rental Inquiry',
      desc: 'Reserve nakshi haarams & chokers for wedding dates',
      message: 'Hello Lekshmi! I would like to inquire about renting bridal jewellery for an upcoming wedding.',
    },
    {
      title: 'Custom Order Consultation',
      desc: 'Discuss bespoke designs & anti-tarnish customization',
      message: 'Hello CHARMIKA team! I want to discuss a custom jewellery order.',
    },
    {
      title: 'Order Status & Tracking',
      desc: 'Check dispatch date or courier tracking details',
      message: 'Hello! I would like to check the status of my order dispatch.',
    },
  ];

  return (
    <div className="py-16 bg-beige min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Page Title Header */}
        <div className="text-center max-w-xl mx-auto mb-16">
          <span className="text-xs font-semibold uppercase tracking-[0.25em] text-gold block mb-1">
            We are Here to Help
          </span>
          <h1 className="font-serif text-3xl sm:text-5xl font-bold text-maroon">
            Contact Charmika Jewels
          </h1>
          <p className="font-serif text-sm italic text-gold font-semibold mt-1">
            Founder Lekshmi D.S & Team • Kottayam, Kerala
          </p>
          <div className="w-16 h-0.5 bg-gold mx-auto mt-3" />
        </div>

        {/* Quick WhatsApp Inquiry Bar */}
        <div className="mb-12">
          <h2 className="font-serif text-xl font-bold text-maroon text-center mb-6">
            Instant WhatsApp Assistance
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {directWhatsAppInquiries.map((inq) => (
              <a
                key={inq.title}
                href={`https://wa.me/919400976257?text=${encodeURIComponent(inq.message)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white p-6 rounded-3xl border border-gold/30 shadow-xs hover:shadow-luxury hover:border-gold transition-all flex flex-col justify-between group"
              >
                <div>
                  <div className="w-10 h-10 bg-emerald-100 rounded-2xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                    <MessageSquare className="w-5 h-5 text-emerald-600" />
                  </div>
                  <h3 className="font-serif text-base font-bold text-maroon group-hover:text-gold transition-colors">
                    {inq.title}
                  </h3>
                  <p className="text-xs text-charcoal/60 mt-1 font-light">{inq.desc}</p>
                </div>

                <div className="mt-4 pt-3 border-t border-gold/10 flex items-center justify-between text-xs font-bold text-emerald-700">
                  <span>Chat directly on WhatsApp</span>
                  <span className="group-hover:translate-x-1 transition-transform">→</span>
                </div>
              </a>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Info Card */}
          <div className="space-y-6 bg-white p-8 rounded-3xl border border-gold/30 shadow-luxury h-fit">
            <h2 className="font-serif text-xl font-bold text-maroon pb-3 border-b border-gold/20 flex items-center gap-2">
              <Gem className="w-5 h-5 text-gold" /> Charmika Jewels Boutique
            </h2>

            <div className="space-y-5 text-xs text-charcoal/80">
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-gold shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-maroon">Boutique & Office Address</h4>
                  <p className="mt-1 leading-relaxed">
                    Karthika, Kuttypady,<br />
                    Gandhinagar PO, Kottayam,<br />
                    Kerala - 686008
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 pt-2">
                <Phone className="w-5 h-5 text-gold shrink-0" />
                <div>
                  <h4 className="font-bold text-maroon">Phone & WhatsApp Hotline</h4>
                  <a href="tel:+919400976257" className="hover:text-gold transition-colors font-semibold text-maroon">
                    +91 94009 76257
                  </a>
                </div>
              </div>

              <div className="flex items-center gap-3 pt-2">
                <Mail className="w-5 h-5 text-gold shrink-0" />
                <div>
                  <h4 className="font-bold text-maroon">Email Enquiries</h4>
                  <a href="mailto:charmikajewel@gmail.com" className="hover:text-gold transition-colors font-medium">
                    charmikajewel@gmail.com
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3 pt-2">
                <Clock className="w-5 h-5 text-gold shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-maroon">Business Hours</h4>
                  <p className="mt-1">Monday – Saturday: 9:30 AM – 7:00 PM</p>
                  <p className="text-gold font-medium">Sunday: By Appointment Only</p>
                </div>
              </div>
            </div>

            {/* Direct WhatsApp CTA */}
            <div className="pt-4 border-t border-gold/20">
              <a
                href="https://wa.me/919400976257?text=Hello%20Charmika%20Jewels,%20I%20have%20an%20inquiry."
                target="_blank"
                rel="noreferrer"
                className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-full transition-all flex items-center justify-center gap-2 shadow-md"
              >
                <MessageSquare className="w-4 h-4" />
                Chat on WhatsApp (+91 94009 76257)
              </a>
            </div>
          </div>

          {/* Contact Form & Google Map */}
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-white p-8 sm:p-10 rounded-3xl border border-gold/30 shadow-luxury">
              <h2 className="font-serif text-2xl font-bold text-maroon mb-2">Send Us A Message</h2>
              <p className="text-xs text-charcoal/60 mb-6 font-light">
                Have questions about rental availability, custom bridal orders, or delivery timelines? Write to us below.
              </p>

              {submitted ? (
                <div className="p-8 bg-green-50 text-green-900 rounded-3xl border border-green-200 text-center space-y-4">
                  <CheckCircle2 className="w-12 h-12 text-green-600 mx-auto" />
                  <h3 className="font-serif font-bold text-xl">Message Sent Successfully!</h3>
                  <p className="text-xs text-green-800 max-w-md mx-auto leading-relaxed">
                    Thank you for reaching out. Founder Lekshmi D.S or our bridal concierge team will get back to you within 2-4 hours.
                  </p>
                  <button
                    onClick={handleReset}
                    className="px-6 py-2.5 bg-maroon text-white font-bold text-xs rounded-full hover:bg-gold hover:text-maroon transition-all"
                  >
                    Send Another Message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-charcoal mb-1">Your Full Name *</label>
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        required
                        placeholder="Anjali Menon"
                        className="w-full px-4 py-3 bg-beige/40 border border-gold/30 rounded-xl text-xs focus:outline-none focus:border-gold"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-charcoal mb-1">Email Address *</label>
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        required
                        placeholder="anjali@example.com"
                        className="w-full px-4 py-3 bg-beige/40 border border-gold/30 rounded-xl text-xs focus:outline-none focus:border-gold"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-charcoal mb-1">Phone Number</label>
                      <input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        placeholder="+91 98470 00000"
                        className="w-full px-4 py-3 bg-beige/40 border border-gold/30 rounded-xl text-xs focus:outline-none focus:border-gold"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-charcoal mb-1">Inquiry Topic</label>
                      <select
                        value={formData.subject}
                        onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                        className="w-full px-4 py-3 bg-beige/40 border border-gold/30 rounded-xl text-xs focus:outline-none focus:border-gold"
                      >
                        <option value="Rental Booking Inquiry">Rental Booking Inquiry</option>
                        <option value="Custom Bridal Order">Custom Bridal Order</option>
                        <option value="Dispatch & Shipping">Dispatch & Shipping</option>
                        <option value="Jewellery Care & Warranty">Jewellery Care & Warranty</option>
                        <option value="General Inquiry">General Inquiry</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-charcoal mb-1">Your Message *</label>
                    <textarea
                      rows={5}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      required
                      placeholder="Please mention your event date, required jewellery piece, or any special requests..."
                      className="w-full px-4 py-3 bg-beige/40 border border-gold/30 rounded-xl text-xs focus:outline-none focus:border-gold"
                    />
                  </div>

                  <button
                    type="submit"
                    className="px-8 py-4 bg-maroon text-white font-bold text-xs uppercase tracking-widest rounded-full hover:bg-gold hover:text-maroon transition-all flex items-center gap-2 shadow-luxury"
                  >
                    <Send className="w-4 h-4" /> Send Inquiry
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
