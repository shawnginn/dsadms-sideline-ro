'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function WorkspacePage() {
  const router = useRouter();
  const [session, setSession] = useState<{ email: string; name: string; role: string } | null>(null);
  const [activeTab, setActiveTab] = useState<'ocr' | 'ros' | 'inventory'>('ocr');
  const [isScanning, setIsScanning] = useState(false);
  const [scannedItems, setScannedItems] = useState([
    { id: 'SKU-8821', name: 'BG MOA® Engine Oil Fortifier (110)', qty: 12, cost: 14.50, retail: 34.95, opcode: 'BG110' },
    { id: 'SKU-8822', name: 'BG EPR® Engine Restoration Flush (109)', qty: 12, cost: 16.20, retail: 39.95, opcode: 'BG109' },
    { id: 'SKU-4410', name: 'BG 44K® Fuel System Cleaner (208)', qty: 24, cost: 18.00, retail: 44.95, opcode: 'BG208' }
  ]);

  useEffect(() => {
    const saved = localStorage.getItem('sideline_ro_session_v1');
    if (!saved) {
      router.replace('/login');
    } else {
      try {
        const parsed = JSON.parse(saved);
        if (parsed && (parsed.email || parsed.name)) {
          setSession(parsed);
        } else {
          router.replace('/login');
        }
      } catch (e) {
        router.replace('/login');
      }
    }
  }, [router]);

  const handleSignOut = () => {
    localStorage.removeItem('sideline_ro_session_v1');
    router.replace('/login');
  };

  const handleSimulateOCR = () => {
    setIsScanning(true);
    setTimeout(() => {
      setIsScanning(false);
      setScannedItems(prev => [
        ...prev,
        { id: 'SKU-9941', name: 'Ceramic Coating Prep Fluid 16oz', qty: 6, cost: 22.00, retail: 59.95, opcode: 'CER-PREP' }
      ]);
    }, 1500);
  };

  if (!session) {
    return (
      <div className="min-h-screen bg-[#020617] flex items-center justify-center text-cyan-400 font-sans">
        <div className="flex flex-col items-center space-y-3">
          <div className="w-8 h-8 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-sm font-semibold tracking-wide">Verifying Session...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#07090e] text-slate-100 font-sans selection:bg-cyan-500 selection:text-black">
      {/* Top Header Navigation */}
      <header className="border-b border-slate-800/80 bg-[#07090e]/90 backdrop-blur-md sticky top-0 z-50 px-6 py-3.5 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <span className="text-cyan-400 font-extrabold text-xl tracking-wider">DSAapps</span>
          <span className="text-slate-600">|</span>
          <span className="text-white font-bold text-lg">SideLine RO</span>
          <span className="bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 text-[10px] font-mono px-2 py-0.5 rounded uppercase tracking-wider font-semibold">
            Active Workspace
          </span>
        </div>

        <div className="flex items-center space-x-4">
          <div className="text-right hidden sm:block">
            <div className="text-xs font-bold text-white">{session.name || 'Dealership Manager'}</div>
            <div className="text-[10px] text-cyan-400 font-mono uppercase">{session.email}</div>
          </div>
          <button
            onClick={handleSignOut}
            className="bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold px-3.5 py-1.5 rounded-lg border border-slate-700 text-xs transition-all shadow-sm"
          >
            Sign Out
          </button>
        </div>
      </header>

      {/* Main App Content Area */}
      <main className="max-w-7xl mx-auto p-6 space-y-6">
        {/* Key Operational Stat Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4">
            <div className="text-xs text-slate-400 font-medium">Unbilled Revenue Recovered</div>
            <div className="text-2xl font-black text-cyan-400 mt-1">,480.00</div>
            <div className="text-[11px] text-emerald-400 mt-1 font-mono">+18% this month</div>
          </div>
          <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4">
            <div className="text-xs text-slate-400 font-medium">OCR Invoices Parsed</div>
            <div className="text-2xl font-black text-white mt-1">42</div>
            <div className="text-[11px] text-slate-500 mt-1 font-mono">100% line accuracy</div>
          </div>
          <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4">
            <div className="text-xs text-slate-400 font-medium">Attached Repair Orders</div>
            <div className="text-2xl font-black text-white mt-1">118</div>
            <div className="text-[11px] text-cyan-400 mt-1 font-mono">Auto-mapped via OpCodes</div>
          </div>
          <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4">
            <div className="text-xs text-slate-400 font-medium">Wholesale Price Shifts</div>
            <div className="text-2xl font-black text-amber-400 mt-1">3 Alerts</div>
            <div className="text-[11px] text-amber-400/80 mt-1 font-mono">Margin protection active</div>
          </div>
        </div>

        {/* Tab Selection Navigation */}
        <div className="flex space-x-2 border-b border-slate-800 pb-2">
          <button
            onClick={() => setActiveTab('ocr')}
            className={px-4 py-2 rounded-lg text-xs font-bold transition-all }
          >
            AI Camera OCR Ingest
          </button>
          <button
            onClick={() => setActiveTab('inventory')}
            className={px-4 py-2 rounded-lg text-xs font-bold transition-all }
          >
            Specialty Chemical Inventory ({scannedItems.length})
          </button>
        </div>

        {/* Tab 1: AI OCR Invoice Ingestion */}
        {activeTab === 'ocr' && (
          <div className="space-y-6">
            <div className="border-2 border-dashed border-slate-800 hover:border-cyan-500/50 rounded-2xl p-8 bg-slate-900/30 text-center transition-colors">
              <div className="max-w-md mx-auto space-y-4">
                <div className="w-12 h-12 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 flex items-center justify-center mx-auto text-xl font-black">
                  📷
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">Upload or Snap Vendor Packing Slip</h3>
                  <p className="text-xs text-slate-400 mt-1">
                    Drag and drop PDF/JPG invoices or use camera OCR to instantly parse line items into stock.
                  </p>
                </div>
                <button
                  onClick={handleSimulateOCR}
                  disabled={isScanning}
                  className="bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold px-6 py-2.5 rounded-lg text-xs transition-all shadow-lg shadow-cyan-500/20 disabled:opacity-50"
                >
                  {isScanning ? 'Extracting Invoice OCR Data...' : 'Simulate Camera OCR Scan'}
                </button>
              </div>
            </div>

            <div className="bg-slate-900/50 border border-slate-800 rounded-xl overflow-hidden">
              <div className="px-5 py-3.5 border-b border-slate-800 flex justify-between items-center bg-slate-950/40">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300">Recently Extracted Line Items</h4>
                <span className="text-[10px] text-cyan-400 font-mono">Live Sync Enabled</span>
              </div>
              <div className="divide-y divide-slate-800/60">
                {scannedItems.map((item) => (
                  <div key={item.id} className="p-4 flex items-center justify-between text-xs hover:bg-slate-800/30 transition-colors">
                    <div>
                      <div className="font-bold text-white">{item.name}</div>
                      <div className="text-[10px] text-slate-400 font-mono mt-0.5">SKU: {item.id} | OpCode: {item.opcode}</div>
                    </div>
                    <div className="flex items-center space-x-6 text-right font-mono">
                      <div>
                        <div className="text-slate-400 text-[10px]">Qty Received</div>
                        <div className="text-white font-bold">{item.qty} units</div>
                      </div>
                      <div>
                        <div className="text-slate-400 text-[10px]">Cost / Retail</div>
                        <div className="text-cyan-400 font-bold"> / </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Inventory Overview */}
        {activeTab === 'inventory' && (
          <div className="bg-slate-900/50 border border-slate-800 rounded-xl overflow-hidden">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950/60 border-b border-slate-800 text-slate-400 uppercase text-[10px] font-mono">
                <tr>
                  <th className="p-4">SKU Code</th>
                  <th className="p-4">Product Description</th>
                  <th className="p-4">OpCode</th>
                  <th className="p-4">Cost Price</th>
                  <th className="p-4">Retail Price</th>
                  <th className="p-4">Stock Level</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-mono">
                {scannedItems.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-800/30 transition-colors">
                    <td className="p-4 text-cyan-400 font-bold">{item.id}</td>
                    <td className="p-4 font-sans text-white font-medium">{item.name}</td>
                    <td className="p-4 text-slate-300">{item.opcode}</td>
                    <td className="p-4 text-slate-400"></td>
                    <td className="p-4 text-emerald-400 font-bold"></td>
                    <td className="p-4 text-white font-bold">{item.qty} in stock</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  );
}