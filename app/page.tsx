import Script from 'next/script';
import React from 'react';

export default function SideLineROLanding() {
  return (
    <div className="min-h-screen bg-[#07090e] text-slate-100 font-sans selection:bg-cyan-500 selection:text-black">
      {/* Top Navigation */}
      <nav className="border-b border-slate-800/80 bg-[#07090e]/80 backdrop-blur-md sticky top-0 z-50 px-6 py-4 flex items-center justify-between max-w-7xl mx-auto">
        <div className="flex items-center space-x-3">
          <span className="text-cyan-400 font-extrabold text-xl tracking-wider">DSAapps</span>
          <span className="text-slate-600">|</span>
          <span className="text-white font-bold text-lg">SideLine RO</span>
        </div>
        <a 
          href="/login"
          className="bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold px-5 py-2 rounded-lg transition-all duration-200 shadow-lg shadow-cyan-500/20"
        >
          Sign In
        </a>
      </nav>

      {/* Hero Section */}
      <section className="max-w-5xl mx-auto text-center px-6 pt-20 pb-16">
        <div className="inline-flex items-center space-x-2 bg-slate-900 border border-slate-800 rounded-full px-4 py-1.5 text-xs text-cyan-400 font-semibold mb-8 uppercase tracking-widest">
          <span>CHEMICAL PRODUCTS</span>
          <span>-</span>
          <span>REVENUE LEAKAGE SOLUTION</span>
        </div>
        
        <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-white mb-6 leading-tight">
          Stop Losing <span className="text-cyan-400">$3,000-$8,000 / Month</span> in Unbilled Off-DMS Specialty Products
        </h1>
        
        <p className="text-slate-400 text-lg sm:text-xl max-w-3xl mx-auto leading-relaxed mb-10">
          Chemical products, window tint, ceramic coatings, and third-party accessories slip through primary DMS software every day. SideLine RO uses AI camera OCR to instantly parse vendor invoices, track live inventory, and attach products directly to Repair Orders.
        </p>
      </section>

      {/* Feature / Comparison Cards */}
      <section className="max-w-6xl mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Pain Point Card */}
        <div className="bg-rose-950/20 border border-rose-900/40 rounded-2xl p-8 backdrop-blur-sm">
          <h2 className="text-sm font-bold text-rose-400 uppercase tracking-wider mb-6 flex items-center space-x-2">
            <span></span>
            <span>THE AUTOMOTIVE REPAIR SHOP PAIN POINT</span>
          </h2>
          <ul className="space-y-4 text-slate-300">
            <li className="flex items-start space-x-3">
              <span className="text-rose-500 font-bold">-</span>
              <span>Specialty vendor invoices arrive on paper and get misplaced.</span>
            </li>
            <li className="flex items-start space-x-3">
              <span className="text-rose-500 font-bold">-</span>
              <span>Parts managers enter wholesale costs manually, missing vendor price increases.</span>
            </li>
            <li className="flex items-start space-x-3">
              <span className="text-rose-500 font-bold">-</span>
              <span>Service advisors forget to bill labor hours or attach chemical cans on customer ROs.</span>
            </li>
            <li className="flex items-start space-x-3">
              <span className="text-rose-500 font-bold">-</span>
              <span>Shop door rate realization drops below target benchmarks with zero visibility.</span>
            </li>
          </ul>
        </div>

        {/* Solution Card */}
        <div className="bg-emerald-950/20 border border-emerald-900/40 rounded-2xl p-8 backdrop-blur-sm">
          <h2 className="text-sm font-bold text-emerald-400 uppercase tracking-wider mb-6 flex items-center space-x-2">
            <span></span>
            <span>THE SIDELINE RO SOLUTION</span>
          </h2>
          <ul className="space-y-4 text-slate-300">
            <li className="flex items-start space-x-3">
              <span className="text-emerald-500 font-bold">-</span>
              <span>Snap a photo of any distributor packing slip - We extract every line item instantly and update your inventory!</span>
            </li>
            <li className="flex items-start space-x-3">
              <span className="text-emerald-500 font-bold">-</span>
              <span>Price change alerts highlight wholesale shifts so managers can update retail pricing and protect margins.</span>
            </li>
            <li className="flex items-start space-x-3">
              <span className="text-emerald-500 font-bold">-</span>
              <span>Op Code service bundles combine parts and labor into a single click or drag to active ROs.</span>
            </li>
            <li className="flex items-start space-x-3">
              <span className="text-emerald-500 font-bold">-</span>
              <span>Auto-ordering calculates replacement needs up to max stock and dispatches Email/SMS orders to vendors.</span>
            </li>
          </ul>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="max-w-5xl mx-auto px-6 py-16 text-center">
        <h2 className="text-3xl font-extrabold text-white mb-2">Simple, Transparent Subscription Pricing</h2>
        <p className="text-slate-400 text-sm mb-12">Merchant of Record processing handled securely via Lemon Squeezy</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left max-w-4xl mx-auto">
          {/* Monthly Plan */}
          <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-8 flex flex-col justify-between">
            <div>
              <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">MONTHLY PLAN</div>
              <div className="flex items-baseline space-x-1 mb-2">
                <span className="text-4xl font-extrabold text-white">$9.99</span>
                <span className="text-slate-400 text-sm">/ month</span>
              </div>
              <p className="text-slate-400 text-xs mb-6">Flexible month-to-month subscription. Cancel anytime.</p>
              <hr className="border-slate-800 mb-6" />
              <ul className="space-y-3 text-sm text-slate-300 mb-8">
                <li className="flex items-center space-x-2">
                  <span className="text-cyan-400 font-bold">-</span>
                  <span>Unlimited Camera Scans</span>
                </li>
                <li className="flex items-center space-x-2">
                  <span className="text-cyan-400 font-bold">-</span>
                  <span>Unlimited Users & Advisor Access</span>
                </li>
                <li className="flex items-center space-x-2">
                  <span className="text-cyan-400 font-bold">-</span>
                  <span>Price Change Protection & Door Rate Flags</span>
                </li>
                <li className="flex items-center space-x-2">
                  <span className="text-cyan-400 font-bold">-</span>
                  <span>Vendor Auto-Ordering via Email & SMS</span>
                </li>
              </ul>
            </div>
            <a href={process.env.NEXT_PUBLIC_LEMON_MONTHLY_URL || "#"} className="lemonsqueezy-button block text-center w-full bg-slate-800 hover:bg-slate-700 text-white font-bold py-3 rounded-lg transition-colors">
              Subscribe Monthly ($9.99/mo)
            </a>
          </div>

          {/* Annual Plan */}
          <div className="bg-slate-900/80 border-2 border-cyan-500 rounded-2xl p-8 flex flex-col justify-between relative shadow-xl shadow-cyan-500/10">
            <div className="absolute -top-3.5 right-6 bg-cyan-500 text-slate-950 text-xs font-black px-3 py-1 rounded-full uppercase tracking-wider">
              BEST VALUE - SAVE $20
            </div>
            <div>
              <div className="text-xs font-bold text-cyan-400 uppercase tracking-wider mb-2">ANNUAL PLAN</div>
              <div className="flex items-baseline space-x-1 mb-2">
                <span className="text-4xl font-extrabold text-white">$99.99</span>
                <span className="text-slate-400 text-sm">/ year</span>
              </div>
              <p className="text-cyan-400 text-xs font-semibold mb-6">Includes 2 months free ($8.33/mo effective).</p>
              <hr className="border-slate-800 mb-6" />
              <ul className="space-y-3 text-sm text-slate-300 mb-8">
                <li className="flex items-center space-x-2">
                  <span className="text-cyan-400 font-bold">-</span>
                  <span>Everything in Monthly Plan</span>
                </li>
                <li className="flex items-center space-x-2">
                  <span className="text-cyan-400 font-bold">-</span>
                  <span>Priority Vision Processing</span>
                </li>
                <li className="flex items-center space-x-2">
                  <span className="text-cyan-400 font-bold">-</span>
                  <span>Dedicated Dealership Account Onboarding</span>
                </li>
                <li className="flex items-center space-x-2">
                  <span className="text-cyan-400 font-bold">-</span>
                  <span>Multi-Location Audit Logs</span>
                </li>
              </ul>
            </div>
            <a href={process.env.NEXT_PUBLIC_LEMON_ANNUAL_URL || "#"} className="lemonsqueezy-button block text-center w-full bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold py-3 rounded-lg transition-colors shadow-lg shadow-cyan-500/20">
              Subscribe Annual ($99.99/yr)
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-800/80 mt-20 py-8 text-center text-xs text-slate-500">
        <p>- 2026 BELIZE AI Ecosystem - DSAapps SideLine RO. All rights reserved.</p>
      </footer>
    </div>
  );
}



