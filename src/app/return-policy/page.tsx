import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { ShieldCheck, AlertTriangle, Video, PackageCheck, ArrowLeft, RefreshCw, XCircle } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Return Policy | CHARMIKA By Lekshmi',
  description:
    'Understand our return and replacement policy at Charmika Jewellery. We accept returns only for damaged or wrong products with a mandatory unboxing video.',
};

export default function ReturnPolicyPage() {
  return (
    <main className="min-h-screen bg-beige/30">
      {/* Hero Banner */}
      <section className="relative bg-maroon-950 text-white py-20 overflow-hidden">
        <div className="absolute inset-0 bg-luxury-radial pointer-events-none opacity-40" />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <div className="flex justify-center mb-4">
            <div className="p-4 bg-gold/10 border border-gold/30 rounded-full">
              <RefreshCw className="w-10 h-10 text-gold" />
            </div>
          </div>
          <h1 className="font-serif text-4xl md:text-5xl font-bold text-white mb-4">
            Return Policy
          </h1>
          <p className="text-white/70 text-sm tracking-widest uppercase font-light">
            CHARMIKA By Lekshmi — Transparency & Trust
          </p>
        </div>
      </section>

      {/* Breadcrumb */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs text-charcoal/60 hover:text-maroon transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Back to Home
        </Link>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-20 space-y-8">

        {/* Important Notice */}
        <div className="bg-amber-50 border-l-4 border-gold rounded-r-2xl p-6 flex gap-4">
          <AlertTriangle className="w-6 h-6 text-gold shrink-0 mt-0.5" />
          <div>
            <h2 className="font-serif font-bold text-maroon text-base mb-1">Important Notice</h2>
            <p className="text-charcoal/80 text-sm leading-relaxed">
              We strive to ensure that every order reaches you in perfect condition. Please read our return policy carefully before placing an order.
            </p>
          </div>
        </div>

        {/* Policy Card */}
        <div className="bg-white rounded-3xl border border-gold/20 shadow-luxury overflow-hidden">
          <div className="bg-maroon px-8 py-5">
            <h2 className="font-serif text-xl font-bold text-white flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-gold" />
              Our Return Policy
            </h2>
          </div>

          <div className="p-8 space-y-8">
            {/* When we accept returns */}
            <div className="flex gap-5">
              <div className="shrink-0 w-12 h-12 rounded-xl bg-green-50 border border-green-100 flex items-center justify-center">
                <PackageCheck className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <h3 className="font-serif text-base font-bold text-maroon mb-2">
                  When We Accept Returns
                </h3>
                <p className="text-charcoal/80 text-sm leading-relaxed">
                  Returns are accepted <strong>only</strong> if the product received is{' '}
                  <strong>damaged during delivery</strong> or if you receive the{' '}
                  <strong>wrong product</strong>. We do not accept returns or exchanges for any other
                  reasons, including changes of mind or personal preference.
                </p>
              </div>
            </div>

            <hr className="border-gold/10" />

            {/* Unboxing Video */}
            <div className="flex gap-5">
              <div className="shrink-0 w-12 h-12 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center">
                <Video className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h3 className="font-serif text-base font-bold text-maroon mb-2">
                  Mandatory Unboxing Video Requirement
                </h3>
                <p className="text-charcoal/80 text-sm leading-relaxed mb-3">
                  To request a return, you must provide a{' '}
                  <strong>complete, uninterrupted unboxing video</strong> starting from the sealed
                  package until the product is fully unpacked. This video serves as mandatory proof
                  for verifying the issue.
                </p>
                <div className="bg-maroon/5 border border-maroon/10 rounded-xl p-4">
                  <p className="text-xs text-maroon font-semibold uppercase tracking-wider mb-2">
                    Video must include:
                  </p>
                  <ul className="space-y-1.5 text-sm text-charcoal/70">
                    <li className="flex items-start gap-2">
                      <span className="text-gold font-bold mt-0.5">•</span>
                      The sealed, unopened package clearly visible at the start
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-gold font-bold mt-0.5">•</span>
                      Continuous, uninterrupted recording throughout unpacking
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-gold font-bold mt-0.5">•</span>
                      Full product clearly visible at the end of the video
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            <hr className="border-gold/10" />

            {/* Not eligible */}
            <div className="flex gap-5">
              <div className="shrink-0 w-12 h-12 rounded-xl bg-red-50 border border-red-100 flex items-center justify-center">
                <XCircle className="w-6 h-6 text-red-500" />
              </div>
              <div>
                <h3 className="font-serif text-base font-bold text-maroon mb-2">
                  Not Eligible for Return
                </h3>
                <p className="text-charcoal/80 text-sm leading-relaxed mb-3">
                  Requests submitted <strong>without a full unboxing video</strong> will not be
                  eligible for return or replacement. We also do not accept returns for:
                </p>
                <ul className="space-y-1.5 text-sm text-charcoal/70">
                  {[
                    'Change of mind or personal preference',
                    'Incorrect size selected by the customer',
                    'Minor colour variation due to photography/display settings',
                    'Returns requested after 48 hours of delivery',
                    'Products with signs of use or tampering',
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-2">
                      <XCircle className="w-3.5 h-3.5 text-red-400 shrink-0 mt-0.5" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <hr className="border-gold/10" />

            {/* Resolution */}
            <div className="flex gap-5">
              <div className="shrink-0 w-12 h-12 rounded-xl bg-gold/10 border border-gold/20 flex items-center justify-center">
                <ShieldCheck className="w-6 h-6 text-gold" />
              </div>
              <div>
                <h3 className="font-serif text-base font-bold text-maroon mb-2">
                  Resolution Process
                </h3>
                <p className="text-charcoal/80 text-sm leading-relaxed">
                  Once the claim is verified, we will arrange a <strong>replacement or refund</strong>,
                  as applicable. Our team will review your unboxing video and respond within{' '}
                  <strong>2–3 business days</strong>.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* How to Request */}
        <div className="bg-white rounded-3xl border border-gold/20 shadow-luxury p-8">
          <h2 className="font-serif text-xl font-bold text-maroon mb-6 flex items-center gap-2">
            <Video className="w-5 h-5 text-gold" />
            How to Submit a Return Request
          </h2>
          <ol className="space-y-4">
            {[
              {
                step: '01',
                title: 'Record Unboxing Video',
                desc: 'Record a complete, uninterrupted video from the sealed package to full unboxing.',
              },
              {
                step: '02',
                title: 'Contact Us Within 48 Hours',
                desc: 'Reach us via WhatsApp (+91 94009 76257) or email (charmikajewel@gmail.com) within 48 hours of delivery.',
              },
              {
                step: '03',
                title: 'Share Your Evidence',
                desc: 'Send us the unboxing video along with your order ID and a description of the issue.',
              },
              {
                step: '04',
                title: 'Await Verification',
                desc: 'Our team will review your claim within 2–3 business days and confirm eligibility.',
              },
              {
                step: '05',
                title: 'Receive Replacement / Refund',
                desc: 'Upon approval, we will arrange a replacement shipment or process your refund.',
              },
            ].map(({ step, title, desc }) => (
              <li key={step} className="flex gap-4 items-start">
                <span className="shrink-0 w-9 h-9 rounded-full bg-maroon text-gold font-serif font-bold text-xs flex items-center justify-center shadow">
                  {step}
                </span>
                <div>
                  <p className="font-semibold text-maroon text-sm">{title}</p>
                  <p className="text-charcoal/70 text-xs mt-0.5 leading-relaxed">{desc}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>

        {/* Contact CTA */}
        <div className="text-center bg-maroon rounded-3xl p-10 relative overflow-hidden">
          <div className="absolute inset-0 bg-luxury-radial pointer-events-none opacity-30" />
          <div className="relative z-10">
            <h2 className="font-serif text-2xl font-bold text-white mb-3">Have a Query?</h2>
            <p className="text-white/70 text-sm mb-6">
              Our team is here to help you with any concerns about your order.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <a
                href="https://wa.me/919400976257?text=Hi%20Charmika%2C%20I%20have%20a%20query%20about%20returns."
                target="_blank"
                rel="noreferrer"
                className="px-6 py-3 bg-gold text-maroon font-semibold text-sm rounded-full hover:bg-white transition-colors"
              >
                WhatsApp Us
              </a>
              <Link
                href="/contact"
                className="px-6 py-3 bg-white/10 border border-white/30 text-white font-semibold text-sm rounded-full hover:bg-white/20 transition-colors"
              >
                Contact Page
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
