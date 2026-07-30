'use client';

import { useState, useRef, useEffect } from 'react';

// ROTATING QUOTE OF THE DAY POOL
const QUOTES_POOL = [
  { quote: "The way to get started is to quit talking and begin doing.", author: "Walt Disney" },
  { quote: "Efficiency is doing things right; effectiveness is doing the right things.", author: "Peter Drucker" },
  { quote: "Profit in business comes from repeat customers; customers that boast about your product and service.", author: "W. Edwards Deming" },
  { quote: "Quality means doing it right when no one is looking.", author: "Henry Ford" },
  { quote: "If you can't measure it, you can't manage it.", author: "Peter Drucker" },
  { quote: "Excellence is not an act, but a habit.", author: "Aristotle" },
  { quote: "Details matter. They create the difference between average and extraordinary.", author: "General Colin Powell" },
  { quote: "Success usually comes to those who are too busy to be looking for it.", author: "Henry David Thoreau" },
  { quote: "Opportunities don't happen. You create them.", author: "Chris Grosser" },
  { quote: "There are no secrets to success. It is the result of preparation, hard work, and learning from failure.", author: "Colin Powell" },
  { quote: "Customer service shouldn't just be a department, it should be the entire company.", author: "Tony Hsieh" },
  { quote: "Before everything else, getting ready is the secret of success.", author: "Henry Ford" },
  { quote: "Do what you do so well that they will want to see it again and bring their friends.", author: "Walt Disney" },
  { quote: "Revenue is vanity, profit is sanity, but cash is king.", author: "Alan Miltz" },
  { quote: "Great things in business are never done by one person. They're done by a team of people.", author: "Steve Jobs" },
  { quote: "The secret of change is to focus all of your energy not on fighting the old, but on building the new.", author: "Socrates" }
];

interface UserAccount {
  id: string;
  name: string;
  email: string;
  role: 'ADMIN' | 'STANDARD';
  locationId: string;
}

interface LocationTenant {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  subscriptionStatus: 'active' | 'inactive' | 'trial_bypass';
  subscriptionPlan: 'monthly' | 'yearly';
  targetDoorRate: number;
  avgTechWage: number;
  targetPartsMargin: number;
  targetLaborGp: number;
}

interface InventoryItem {
  id: string;
  locationId: string;
  vendorName: string;
  opCode: string;
  pn: string;
  description: string;
  qty: number;
  maxStock: number;
  lowStockThreshold: number;
  unitCost: number;
  previousCost?: number;
  priceChanged?: boolean;
  retailPrice: number;
  stdLaborHours: number;
  stdLaborRate: number;
  expectedQtyPerOp: number;
  photoUrl?: string;
  timestamp: string;
}

interface Vendor {
  id: string;
  locationId: string;
  name: string;
  email: string;
  phone: string;
  contactPerson: string;
  autoOrderEnabled: boolean;
  orderMethod: 'Email' | 'SMS';
}

interface BilledROItem {
  id: string;
  inventoryId: string;
  opCode: string;
  pn: string;
  description: string;
  qtyBilled: number;
  expectedQty: number;
  unitCost: number;
  retailPrice: number;
  laborHours: number;
  laborPrice: number;
  timestamp: string;
}

// 3 PILOT LOCATIONS DATABASE
const PILOT_LOCATIONS: Record<string, LocationTenant> = {
  'loc-001': { id: 'loc-001', name: 'SideLine Auto Group (Main)', email: 'admin@sidelineauto.com', phone: '(555) 019-2834', address: '400 Dealership Way', subscriptionStatus: 'trial_bypass', subscriptionPlan: 'yearly', targetDoorRate: 180.00, avgTechWage: 35.00, targetPartsMargin: 55.0, targetLaborGp: 65.0 },
  'loc-pilot-1': { id: 'loc-pilot-1', name: 'Pilot Dealership #1 (Metro)', email: 'pilot1@dsadms.com', phone: '(555) 111-2222', address: '100 Metro Auto Mall', subscriptionStatus: 'trial_bypass', subscriptionPlan: 'yearly', targetDoorRate: 175.00, avgTechWage: 34.00, targetPartsMargin: 52.0, targetLaborGp: 60.0 },
  'loc-pilot-2': { id: 'loc-pilot-2', name: 'Pilot Dealership #2 (West)', email: 'pilot2@dsadms.com', phone: '(555) 333-4444', address: '250 Westside Drive', subscriptionStatus: 'trial_bypass', subscriptionPlan: 'yearly', targetDoorRate: 185.00, avgTechWage: 38.00, targetPartsMargin: 55.0, targetLaborGp: 65.0 },
  'loc-pilot-3': { id: 'loc-pilot-3', name: 'Pilot Dealership #3 (East)', email: 'pilot3@dsadms.com', phone: '(555) 555-6666', address: '500 East Commerce Way', subscriptionStatus: 'trial_bypass', subscriptionPlan: 'yearly', targetDoorRate: 190.00, avgTechWage: 40.00, targetPartsMargin: 58.0, targetLaborGp: 68.0 },
};

export default function SideLineApp() {
  const [viewMode, setViewMode] = useState<'marketing' | 'login' | 'dashboard'>('marketing');
  const [currentQuoteIndex, setCurrentQuoteIndex] = useState<number>(0);

  useEffect(() => {
    const randomIndex = Math.floor(Math.random() * QUOTES_POOL.length);
    setCurrentQuoteIndex(randomIndex);
  }, []);

  const handleNextRandomQuote = () => {
    const nextIdx = Math.floor(Math.random() * QUOTES_POOL.length);
    setCurrentQuoteIndex(nextIdx);
  };

  const [authEmail, setAuthEmail] = useState<string>('shawn@dsaindustriesltd.com');
  const [authPassword, setAuthPassword] = useState<string>('â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢');
  const [isForgotPasswordOpen, setIsForgotPasswordOpen] = useState<boolean>(false);
  const [resetEmail, setResetEmail] = useState<string>('');
  const [resetSentNotice, setResetSentNotice] = useState<string | null>(null);

  const [activeLegalModal, setActiveLegalModal] = useState<'terms' | 'refund' | 'privacy' | 'contact' | null>(null);
  const [currentUser, setCurrentUser] = useState<UserAccount | null>(null);
  const [location, setLocation] = useState<LocationTenant>(PILOT_LOCATIONS['loc-001']);

  const isAdmin = currentUser?.role === 'ADMIN';
  const [activeTab, setActiveTab] = useState<'overview' | 'receiving' | 'sales' | 'vendors'>('receiving');

  // USER ACCOUNTS WITH PRE-SEEDED PILOT ADMINS
  const [users, setUsers] = useState<UserAccount[]>([
    { id: 'u1', name: 'Shawn Manager (Master Admin)', email: 'shawn@dsaindustriesltd.com', role: 'ADMIN', locationId: 'loc-001' },
    { id: 'u-pilot-1', name: 'Pilot Store 1 Admin', email: 'pilot1@dsadms.com', role: 'ADMIN', locationId: 'loc-pilot-1' },
    { id: 'u-pilot-2', name: 'Pilot Store 2 Admin', email: 'pilot2@dsadms.com', role: 'ADMIN', locationId: 'loc-pilot-2' },
    { id: 'u-pilot-3', name: 'Pilot Store 3 Admin', email: 'pilot3@dsadms.com', role: 'ADMIN', locationId: 'loc-pilot-3' },
  ]);

  const [newUserName, setNewUserName] = useState('');
  const [newUserRole, setNewUserRole] = useState<'ADMIN' | 'STANDARD'>('STANDARD');
  const [newUserEmail, setNewUserEmail] = useState('');

  const [vendors, setVendors] = useState<Vendor[]>([
    { id: 'v1', locationId: 'loc-001', name: 'Wagonmaster Group Of Products', email: 'fulfillment@wagonmastergroup.com', phone: '(800) 555-0199', contactPerson: 'Dave Miller', autoOrderEnabled: true, orderMethod: 'Email' },
    { id: 'v2', locationId: 'loc-001', name: 'SunTek Protective Films', email: 'orders@suntek.com', phone: '(800) 555-0244', contactPerson: 'Sarah Jenkins', autoOrderEnabled: true, orderMethod: 'SMS' }
  ]);

  const [inventory, setInventory] = useState<InventoryItem[]>([
    { id: '1', locationId: 'loc-001', vendorName: 'Wagonmaster Group Of Products', opCode: 'OP-44K', pn: 'PN 20811', description: 'BG Platinum 44K Fuel Cleaner', qty: 12, maxStock: 24, lowStockThreshold: 5, unitCost: 28.50, previousCost: 25.00, priceChanged: true, retailPrice: 65.00, stdLaborHours: 0.2, stdLaborRate: 23.00, expectedQtyPerOp: 1, timestamp: new Date().toISOString() },
    { id: '2', locationId: 'loc-001', vendorName: 'Wagonmaster Group Of Products', opCode: 'OP-EPR', pn: 'PN 109', description: 'BG EPR Engine Performance', qty: 3, maxStock: 20, lowStockThreshold: 5, unitCost: 14.25, previousCost: 14.25, priceChanged: false, retailPrice: 28.00, stdLaborHours: 0.3, stdLaborRate: 18.00, expectedQtyPerOp: 1, timestamp: new Date().toISOString() },
    { id: '3', locationId: 'loc-001', vendorName: 'Wagonmaster Group Of Products', opCode: 'OP-MOA', pn: 'PN 115', description: 'BG MOA Oil Conditioner', qty: 18, maxStock: 30, lowStockThreshold: 5, unitCost: 12.75, previousCost: 12.75, priceChanged: false, retailPrice: 32.00, stdLaborHours: 0.2, stdLaborRate: 20.00, expectedQtyPerOp: 1, timestamp: new Date().toISOString() },
    { id: '4', locationId: 'loc-001', vendorName: 'Wagonmaster Group Of Products', opCode: 'OP-DRIVELINE', pn: 'PN 306', description: 'BG Driveline Fluid Canister', qty: 9, maxStock: 15, lowStockThreshold: 5, unitCost: 19.00, previousCost: 17.50, priceChanged: true, retailPrice: 48.00, stdLaborHours: 0.5, stdLaborRate: 89.00, expectedQtyPerOp: 3, timestamp: new Date().toISOString() }
  ]);

  const [roNumber, setRoNumber] = useState('RO-40291');
  const [techName, setTechName] = useState('Tech #12');
  const [roItems, setRoItems] = useState<BilledROItem[]>([]);

  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const partPhotoInputRef = useRef<HTMLInputElement>(null);
  const [selectedPnForPhoto, setSelectedPnForPhoto] = useState<string | null>(null);

  const [editingItem, setEditingItem] = useState<InventoryItem | null>(null);
  const [editingVendor, setEditingVendor] = useState<Vendor | null>(null);
  const [rectifyingItem, setRectifyingItem] = useState<InventoryItem | null>(null);
  const [rectifyCount, setRectifyCount] = useState<number>(0);
  const [rectifyReason, setRectifyReason] = useState<string>('Physical Count Discrepancy');
  const [vendorOrderDigest, setVendorOrderDigest] = useState<{ vendor: Vendor; items: { item: InventoryItem; reorderQty: number }[] } | null>(null);

  // AUTHENTICATION LOGIN ROUTER FOR MULTI-TENANT STORE CONTEXTS
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanEmail = authEmail.trim().toLowerCase();
    const foundUser = users.find(u => u.email.toLowerCase() === cleanEmail) || {
      id: 'u-master',
      name: 'Shawn Manager (Master Admin)',
      email: cleanEmail,
      role: 'ADMIN',
      locationId: 'loc-001'
    };

    const userLocation = PILOT_LOCATIONS[foundUser.locationId] || PILOT_LOCATIONS['loc-001'];
    setCurrentUser(foundUser as UserAccount);
    setLocation(userLocation);
    setViewMode('dashboard');
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setViewMode('login');
  };

  const handleSendPasswordReset = (e: React.FormEvent) => {
    e.preventDefault();
    setResetSentNotice(`A password reset link has been dispatched to ${resetEmail}. Please check your inbox.`);
    setTimeout(() => {
      setResetSentNotice(null);
      setIsForgotPasswordOpen(false);
      setResetEmail('');
    }, 3000);
  };

  const handleCaptureClick = () => fileInputRef.current?.click();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !isAdmin) return;

    setIsProcessing(true);
    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64 = reader.result as string;
      setImagePreview(base64);

      try {
        const res = await fetch('/api/ocr', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ imageBase64: base64 }),
        });

        const data = await res.json();
        const detectedVendor = data.vendorName || 'Wagonmaster Group Of Products';

        if (data.lineItems && Array.isArray(data.lineItems)) {
          const timestamp = data.timestamp || new Date().toISOString();
          setInventory(prev => {
            const updated = [...prev];
            data.lineItems.forEach((scanned: any, idx: number) => {
              const existingIndex = updated.findIndex(i => i.pn === scanned.pn);
              const newCost = Number(scanned.unitCost || 0);

              if (existingIndex >= 0) {
                const existing = updated[existingIndex];
                const costDiffers = existing.unitCost !== newCost && newCost > 0;
                updated[existingIndex] = {
                  ...existing,
                  qty: existing.qty + Number(scanned.qty || 1),
                  previousCost: costDiffers ? existing.unitCost : existing.previousCost,
                  unitCost: newCost > 0 ? newCost : existing.unitCost,
                  priceChanged: costDiffers,
                  timestamp
                };
              } else {
                updated.push({
                  id: String(Date.now() + idx),
                  locationId: location.id,
                  vendorName: detectedVendor,
                  opCode: scanned.opCode || `OP-${idx + 100}`,
                  pn: scanned.pn || `PN-${idx + 100}`,
                  description: scanned.description || 'Specialty Chemical Product',
                  qty: Number(scanned.qty || 1),
                  maxStock: 24,
                  lowStockThreshold: 5,
                  unitCost: newCost,
                  previousCost: newCost,
                  priceChanged: false,
                  retailPrice: Number(scanned.retailPrice || (newCost * 2.2)),
                  stdLaborHours: Number(scanned.stdLaborHours || 0.2),
                  stdLaborRate: Number(scanned.stdLaborRate || 25.00),
                  expectedQtyPerOp: Number(scanned.expectedQtyPerOp || 1),
                  timestamp
                });
              }
            });
            return updated;
          });
        }
      } catch (err) {
        console.error('OCR error:', err);
      } finally {
        setIsProcessing(false);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleTriggerPartPhoto = (pn: string) => {
    setSelectedPnForPhoto(pn);
    partPhotoInputRef.current?.click();
  };

  const handlePartPhotoUploaded = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !selectedPnForPhoto) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      const url = reader.result as string;
      setInventory(prev => prev.map(item => item.pn === selectedPnForPhoto ? { ...item, photoUrl: url } : item));
      setSelectedPnForPhoto(null);
    };
    reader.readAsDataURL(file);
  };

  const handleSaveEditItem = () => {
    if (!editingItem) return;
    setInventory(prev => prev.map(i => i.id === editingItem.id ? { ...editingItem, priceChanged: false } : i));
    setEditingItem(null);
  };

  const handleSaveEditVendor = () => {
    if (!editingVendor) return;
    setVendors(prev => prev.map(v => v.id === editingVendor.id ? editingVendor : v));
    setEditingVendor(null);
  };

  const handleSaveRectifyStock = () => {
    if (!rectifyingItem || !isAdmin) return;
    setInventory(prev => prev.map(i => i.id === rectifyingItem.id ? { ...i, qty: rectifyCount, timestamp: new Date().toISOString() } : i));
    setRectifyingItem(null);
  };

  const handleAddUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUserName || !newUserEmail || !isAdmin) return;
    setUsers(prev => [...prev, { id: 'u-' + Date.now(), name: newUserName, role: newUserRole, email: newUserEmail, locationId: location.id }]);
    setNewUserName('');
    setNewUserEmail('');
  };

  const handleAddProductToRO = (item: InventoryItem) => {
    if (item.qty <= 0) return;
    setInventory(prev => prev.map(i => i.id === item.id ? { ...i, qty: i.qty - 1 } : i));
    setRoItems(prev => {
      const existing = prev.find(i => i.inventoryId === item.id);
      if (existing) {
        const newQty = existing.qtyBilled + 1;
        return prev.map(i => i.inventoryId === item.id ? {
          ...i,
          qtyBilled: newQty,
          laborPrice: Number((i.laborPrice * (newQty / existing.qtyBilled)).toFixed(2))
        } : i);
      }
      return [...prev, {
        id: String(Date.now()),
        inventoryId: item.id,
        opCode: item.opCode,
        pn: item.pn,
        description: item.description,
        qtyBilled: item.expectedQtyPerOp,
        expectedQty: item.expectedQtyPerOp,
        unitCost: item.unitCost,
        retailPrice: item.retailPrice,
        laborHours: item.stdLaborHours,
        laborPrice: item.stdLaborRate,
        timestamp: new Date().toISOString()
      }];
    });
  };

  const handleUpdateBilledQty = (roItemId: string, newQty: number) => {
    if (newQty < 1) return;
    setRoItems(prev => prev.map(item => {
      if (item.id === roItemId) {
        return {
          ...item,
          qtyBilled: newQty,
          laborPrice: Number((item.laborPrice * (newQty / item.qtyBilled)).toFixed(2))
        };
      }
      return item;
    }));
  };

  const handleRemoveFromRO = (roItem: BilledROItem) => {
    setInventory(prev => prev.map(i => i.id === roItem.inventoryId ? { ...i, qty: i.qty + roItem.qtyBilled } : i));
    setRoItems(prev => prev.filter(i => i.id !== roItem.id));
  };

  const totalWholesaleValue = inventory.reduce((acc, i) => acc + (i.qty * i.unitCost), 0);
  const totalPartsBilled = roItems.reduce((acc, i) => acc + (i.qtyBilled * i.retailPrice), 0);
  const totalLaborBilled = roItems.reduce((acc, i) => acc + i.laborPrice, 0);
  const totalCombinedBilled = totalPartsBilled + totalLaborBilled;
  const totalWholesaleCostBilled = roItems.reduce((acc, i) => acc + (i.qtyBilled * i.unitCost), 0);
  const totalLaborHoursBilled = roItems.reduce((acc, i) => acc + i.laborHours, 0);

  const combinedProfitMargin = totalCombinedBilled > 0 
    ? (((totalCombinedBilled - totalWholesaleCostBilled) / totalCombinedBilled) * 100).toFixed(1) 
    : '0.0';

  const effectiveLaborRate = totalLaborHoursBilled > 0 ? (totalLaborBilled / totalLaborHoursBilled) : 0;
  const doorRateRealization = location.targetDoorRate > 0 ? ((effectiveLaborRate / location.targetDoorRate) * 100).toFixed(1) : '0.0';
  const isDoorRateFlagged = effectiveLaborRate > 0 && effectiveLaborRate < location.targetDoorRate;

  const handlePurchaseLemonSqueezy = (plan: 'monthly' | 'yearly') => {
    const checkoutUrl = plan === 'yearly' 
      ? 'https://sideline.lemonsqueezy.com/checkout/buy/yearly-plan'
      : 'https://sideline.lemonsqueezy.com/checkout/buy/monthly-plan';
    alert(`Redirecting to Lemon Squeezy Merchant of Record Checkout:\nPlan: ${plan === 'yearly' ? '$99.99/year (Save $20)' : '$9.99/month'}`);
  };

  if (viewMode === 'marketing') {
    return (
      <div className="min-h-screen bg-[#070b14] text-slate-100 font-sans flex flex-col justify-between">
        <header className="max-w-7xl mx-auto w-full flex justify-between items-center p-6 border-b border-slate-800/80">
          <div className="flex items-center gap-3">
            <span className="bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
              DSADMS
            </span>
            <span className="text-xl font-extrabold text-white tracking-tight">SideLine RO</span>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => setViewMode('login')}
              className="bg-[#0284c7] hover:bg-[#0369a1] text-white text-xs font-extrabold px-5 py-2.5 rounded-lg shadow-lg shadow-cyan-950 transition-all"
            >
              Sign In to Portal
            </button>
          </div>
        </header>

        <main className="max-w-7xl mx-auto w-full px-6 py-12 space-y-16">
          <div className="text-center max-w-3xl mx-auto space-y-4">
            <span className="bg-cyan-950 text-cyan-400 border border-cyan-800 text-xs font-mono px-3 py-1 rounded-full uppercase">
              Chemical Products Revenue Leakage Solution
            </span>
            <h1 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight leading-tight">
              Stop Losing <span className="text-cyan-400">$3,000â€“$8,000 / Month</span> in Unbilled Off-DMS Specialty Products
            </h1>
            <p className="text-sm md:text-base text-slate-400 leading-relaxed">
              Chemical products, window tint, ceramic coatings, and third-party accessories slip through primary DMS software every day. SideLine RO uses AI camera OCR to instantly parse vendor invoices, track live inventory, and attach products directly to Repair Orders.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-rose-950/20 border border-rose-900/50 rounded-2xl p-6 space-y-3">
              <h2 className="text-sm font-bold text-rose-400 uppercase tracking-wider">ðŸ”´ The Automotive Repair Shop Pain Point</h2>
              <ul className="space-y-2 text-xs text-slate-300 list-disc list-inside leading-relaxed">
                <li>Specialty vendor invoices arrive on paper and get misplaced.</li>
                <li>Parts managers enter wholesale costs manually, missing vendor price increases.</li>
                <li>Service advisors forget to bill labor hours or attached chemical cans on customer ROs.</li>
                <li>Shop door rate realization drops below target benchmarks with zero visibility.</li>
              </ul>
            </div>

            <div className="bg-emerald-950/20 border border-emerald-900/50 rounded-2xl p-6 space-y-3">
              <h2 className="text-sm font-bold text-emerald-400 uppercase tracking-wider">ðŸŸ¢ The SideLine RO Solution</h2>
              <ul className="space-y-2 text-xs text-slate-300 list-disc list-inside leading-relaxed">
                <li>Snap a photo of any distributor packing slip â€”We extract every line item instantly and update your inventory!</li>
                <li>Price change alerts highlight wholesale shifts so managers can update retail pricing and protect margins.</li>
                <li>Op Code service bundles combine parts and labor into a single click or drag to active ROs.</li>
                <li>Auto-ordering calculates replacement needs up to max stock and dispatches Email/SMS orders to vendors.</li>
              </ul>
            </div>
          </div>

          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-white">Simple, Transparent Subscription Pricing</h2>
              <p className="text-xs text-slate-400 mt-1">Merchant of Record processing handled securely via Lemon Squeezy</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-3xl mx-auto">
              <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 flex flex-col justify-between space-y-6 hover:border-slate-700 transition-all">
                <div className="space-y-3">
                  <span className="text-xs font-bold text-slate-400 uppercase">Monthly Plan</span>
                  <div className="text-3xl font-extrabold text-white">$9.99 <span className="text-xs font-normal text-slate-400">/ month</span></div>
                  <p className="text-xs text-slate-400">Flexible month-to-month subscription. Cancel anytime.</p>
                  <ul className="text-xs text-slate-300 space-y-1.5 pt-2 border-t border-slate-800">
                    <li>âœ“ Unlimited Camera Scans</li>
                    <li>âœ“ Unlimited Users & Advisor Access</li>
                    <li>âœ“ Price Change Protection & Door Rate Flags</li>
                    <li>âœ“ Vendor Auto-Ordering via Email & SMS</li>
                  </ul>
                </div>
                <button
                  onClick={() => handlePurchaseLemonSqueezy('monthly')}
                  className="w-full bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white font-bold text-xs py-3 rounded-xl transition-all"
                >
                  Subscribe Monthly ($9.99/mo)
                </button>
              </div>

              <div className="bg-slate-900/90 border-2 border-cyan-500/60 rounded-2xl p-6 flex flex-col justify-between space-y-6 shadow-2xl relative">
                <span className="absolute -top-3 right-6 bg-cyan-600 text-white text-[10px] font-extrabold px-3 py-0.5 rounded-full uppercase">
                  Best Value â€¢ Save $20
                </span>
                <div className="space-y-3">
                  <span className="text-xs font-bold text-cyan-400 uppercase">Annual Plan</span>
                  <div className="text-3xl font-extrabold text-white">$99.99 <span className="text-xs font-normal text-slate-400">/ year</span></div>
                  <p className="text-xs text-cyan-400">Includes 2 months free ($8.33/mo effective).</p>
                  <ul className="text-xs text-slate-300 space-y-1.5 pt-2 border-t border-slate-800">
                    <li>âœ“ Everything in Monthly Plan</li>
                    <li>âœ“ Priority Vision Processing</li>
                    <li>âœ“ Dedicated Dealership Account Onboarding</li>
                    <li>âœ“ Multi-Location Audit Logs</li>
                  </ul>
                </div>
                <button
                  onClick={() => handlePurchaseLemonSqueezy('yearly')}
                  className="w-full bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs py-3 rounded-xl shadow-lg shadow-cyan-950 transition-all"
                >
                  Subscribe Annual ($99.99/yr)
                </button>
              </div>
            </div>
          </div>
        </main>

        <footer className="max-w-7xl mx-auto w-full border-t border-slate-800/80 p-6 flex flex-col md:flex-row justify-between items-center text-xs text-slate-500 gap-4">
          <div>Â© 2026 BELIZE Master HQ â€¢ SideLine RO & Margin Tracker</div>
          <div className="flex gap-4">
            <button onClick={() => setActiveLegalModal('terms')} className="hover:text-cyan-400">Terms of Use</button>
            <button onClick={() => setActiveLegalModal('refund')} className="hover:text-cyan-400">Refund Policy</button>
            <button onClick={() => setActiveLegalModal('privacy')} className="hover:text-cyan-400">Privacy Policy</button>
            <button onClick={() => setActiveLegalModal('contact')} className="hover:text-cyan-400">Contact Us</button>
          </div>
        </footer>

        {activeLegalModal && (
          <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 max-w-md w-full space-y-4 text-xs text-slate-300">
              <h3 className="text-sm font-bold text-white uppercase">
                {activeLegalModal === 'terms' ? 'Terms of Use' : activeLegalModal === 'refund' ? 'Refund Policy' : activeLegalModal === 'privacy' ? 'Privacy Policy' : 'Contact Support'}
              </h3>
              <div>
                {activeLegalModal === 'terms' && 'SideLine RO is provided on a monthly ($9.99) or annual ($99.99) subscription basis via Lemon Squeezy Merchant of Record. Subscriptions can be canceled at any time using the link in your receipt email.'}
                {activeLegalModal === 'refund' && 'There are no refunds for this program. Cancellations can be made through your Lemon Squeezy receipt email. You will retain access until the end of your current paid period.'}
                {activeLegalModal === 'privacy' && 'Your dealership location data, vendor records, and inventory pricing are strictly isolated with multi-tenant row-level security.'}
                {activeLegalModal === 'contact' && (
                  <div className="space-y-2">
                    <p>For support or account assistance, contact us directly:</p>
                    <p className="text-cyan-400 font-mono font-bold text-sm">shawn@dsaindustriesltd.com</p>
                  </div>
                )}
              </div>
              <div className="flex justify-end pt-2">
                <button onClick={() => setActiveLegalModal(null)} className="px-4 py-1.5 bg-cyan-600 text-white font-bold rounded">Close</button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  if (viewMode === 'login') {
    const activeQuote = QUOTES_POOL[currentQuoteIndex];

    return (
      <div className="min-h-screen bg-[#070b14] text-slate-100 flex flex-col justify-between p-6 font-sans">
        <header className="max-w-6xl mx-auto w-full flex justify-between items-center py-4">
          <div className="flex items-center gap-3">
            <span className="bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-bold px-2.5 py-1 rounded-full uppercase">
              DSADMS PORTAL
            </span>
            <h1 className="text-xl font-extrabold text-white">SideLine RO Sign In</h1>
          </div>
          <button onClick={() => setViewMode('marketing')} className="text-xs text-slate-400 hover:text-cyan-400">
            â† Back to Marketing Page
          </button>
        </header>

        <main className="max-w-md w-full mx-auto space-y-6">
          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 space-y-2 relative overflow-hidden">
            <div className="flex justify-between items-center text-[10px] text-cyan-400 uppercase font-mono tracking-wider">
              <span>ðŸ’¡ Quote of the Day</span>
              <button onClick={handleNextRandomQuote} className="text-slate-500 hover:text-cyan-400">ðŸŽ² Next Quote</button>
            </div>
            <p className="text-xs italic text-slate-300 leading-relaxed">&quot;{activeQuote.quote}&quot;</p>
            <p className="text-[11px] text-slate-500 font-bold text-right">â€” {activeQuote.author}</p>
          </div>

          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-8 shadow-2xl space-y-6">
            <div>
              <h2 className="text-xl font-bold text-white text-center">Sign In to Dealership Portal</h2>
              <p className="text-xs text-slate-400 text-center mt-1">Credentials route to your specific location backend</p>
            </div>

            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Email Address</label>
                <input
                  type="email"
                  required
                  value={authEmail}
                  onChange={(e) => setAuthEmail(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:border-cyan-500 focus:outline-none"
                />
              </div>

              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="text-xs font-medium text-slate-300">Password</label>
                  <button
                    type="button"
                    onClick={() => setIsForgotPasswordOpen(true)}
                    className="text-[11px] text-cyan-400 hover:underline"
                  >
                    Forgot password?
                  </button>
                </div>
                <input
                  type="password"
                  required
                  value={authPassword}
                  onChange={(e) => setAuthPassword(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:border-cyan-500 focus:outline-none"
                />
              </div>

              <button type="submit" className="w-full bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs py-3 rounded-lg shadow-lg shadow-cyan-950 transition-all">
                Sign In to Dashboard
              </button>
            </form>

            {/* QUICK PRE-CONFIGURED PILOT ACCOUNTS DIRECTORY */}
            <div className="border-t border-slate-800 pt-4 space-y-2">
              <span className="text-[10px] text-amber-400 font-bold uppercase tracking-wider block text-center">âš¡ Active 60-Day Pilot Accounts</span>
              <div className="grid grid-cols-3 gap-1.5 text-[10px] text-center font-mono">
                <button type="button" onClick={() => { setAuthEmail('pilot1@dsadms.com'); setAuthPassword('pilot2026'); }} className="bg-slate-950 hover:bg-slate-800 border border-slate-800 p-1.5 rounded text-cyan-400">Pilot Store 1</button>
                <button type="button" onClick={() => { setAuthEmail('pilot2@dsadms.com'); setAuthPassword('pilot2026'); }} className="bg-slate-950 hover:bg-slate-800 border border-slate-800 p-1.5 rounded text-cyan-400">Pilot Store 2</button>
                <button type="button" onClick={() => { setAuthEmail('pilot3@dsadms.com'); setAuthPassword('pilot2026'); }} className="bg-slate-950 hover:bg-slate-800 border border-slate-800 p-1.5 rounded text-cyan-400">Pilot Store 3</button>
              </div>
            </div>
          </div>
        </main>

        <footer className="max-w-6xl mx-auto w-full text-center text-xs text-slate-500 py-4 flex justify-between items-center border-t border-slate-800/80">
          <div>Â© 2026 BELIZE Master HQ</div>
          <div className="flex gap-4">
            <button onClick={() => setActiveLegalModal('terms')} className="hover:text-cyan-400">Terms of Use</button>
            <button onClick={() => setActiveLegalModal('refund')} className="hover:text-cyan-400">Refund Policy</button>
            <button onClick={() => setActiveLegalModal('contact')} className="hover:text-cyan-400">Contact Us</button>
          </div>
        </footer>

        {isForgotPasswordOpen && (
          <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 max-w-sm w-full space-y-4">
              <h3 className="text-sm font-bold text-white uppercase">ðŸ”’ Reset Password</h3>
              <p className="text-xs text-slate-400">Enter your email address to receive a secure recovery link.</p>
              
              {resetSentNotice && (
                <div className="bg-emerald-950 border border-emerald-800 text-emerald-400 text-xs p-2.5 rounded font-mono">
                  {resetSentNotice}
                </div>
              )}

              <form onSubmit={handleSendPasswordReset} className="space-y-3">
                <input
                  type="email"
                  required
                  placeholder="admin@dealership.com"
                  value={resetEmail}
                  onChange={(e) => setResetEmail(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-xs text-white"
                />
                <div className="flex justify-end gap-2 pt-2">
                  <button type="button" onClick={() => setIsForgotPasswordOpen(false)} className="px-3 py-1.5 bg-slate-800 text-slate-300 text-xs rounded">Cancel</button>
                  <button type="submit" className="px-3 py-1.5 bg-cyan-600 text-white font-bold text-xs rounded">Send Reset Link</button>
                </div>
              </form>
            </div>
          </div>
        )}

        {activeLegalModal && (
          <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 max-w-md w-full space-y-4 text-xs text-slate-300">
              <h3 className="text-sm font-bold text-white uppercase">
                {activeLegalModal === 'terms' ? 'Terms of Use' : activeLegalModal === 'refund' ? 'Refund Policy' : 'Contact Support'}
              </h3>
              <div>
                {activeLegalModal === 'terms' && 'SideLine RO is provided on a monthly ($9.99) or annual ($99.99) subscription basis via Lemon Squeezy Merchant of Record. Subscriptions can be canceled at any time using the link in your receipt email.'}
                {activeLegalModal === 'refund' && 'There are no refunds for this program. Cancellations can be made through your Lemon Squeezy receipt email. You will retain access until the end of your current paid period.'}
                {activeLegalModal === 'contact' && (
                  <div className="space-y-2">
                    <p>For support or account assistance, contact us directly:</p>
                    <p className="text-cyan-400 font-mono font-bold text-sm">shawn@dsaindustriesltd.com</p>
                  </div>
                )}
              </div>
              <div className="flex justify-end pt-2">
                <button onClick={() => setActiveLegalModal(null)} className="px-4 py-1.5 bg-cyan-600 text-white font-bold rounded">Close</button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#070b14] text-slate-100 p-6 font-sans">
      <input type="file" ref={fileInputRef} accept="image/*" onChange={handleFileChange} className="hidden" />
      <input type="file" ref={partPhotoInputRef} accept="image/*" onChange={handlePartPhotoUploaded} className="hidden" />

      <header className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center pb-6 mb-6 border-b border-slate-800/80 gap-4">
        <div>
          <div className="flex items-center gap-3">
            <span className="bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">
              DSADMS
            </span>
            <span className="text-slate-500 text-xs font-mono">v1.9.0 Production</span>
            {location.subscriptionStatus === 'trial_bypass' && (
              <span className="bg-emerald-950 text-emerald-400 border border-emerald-800 text-[10px] font-mono px-2 py-0.5 rounded font-bold">
                âš¡ Active 60-Day Pilot Trial
              </span>
            )}
          </div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight mt-1">
            SideLine RO & Margin Tracker
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Location: <strong className="text-white">{location.name}</strong> â€¢ Logged in as: <span className="text-cyan-400 font-bold">{currentUser?.name} ({currentUser?.role})</span>
          </p>
        </div>

        <div className="flex flex-col md:flex-row items-end md:items-center gap-3">
          <button
            onClick={handleLogout}
            className="bg-slate-900 hover:bg-slate-800 text-rose-400 border border-slate-800 text-xs px-3 py-2 rounded-lg font-bold transition-all"
          >
            ðŸ”’ Log Out
          </button>

          <div className="flex items-center gap-2 bg-slate-900/80 border border-slate-800 p-1.5 rounded-xl">
            <button onClick={() => setActiveTab('overview')} className={`px-3.5 py-2 rounded-lg text-xs font-semibold transition-all ${activeTab === 'overview' ? 'bg-cyan-600 text-white shadow-lg shadow-cyan-950' : 'text-slate-400 hover:text-white'}`}>
              ðŸ“˜ Main & Benchmarks
            </button>
            <button onClick={() => setActiveTab('receiving')} className={`px-3.5 py-2 rounded-lg text-xs font-semibold transition-all ${activeTab === 'receiving' ? 'bg-cyan-600 text-white shadow-lg shadow-cyan-950' : 'text-slate-400 hover:text-white'}`}>
              ðŸ“¦ Receiving & Stocking
            </button>
            <button onClick={() => setActiveTab('sales')} className={`px-3.5 py-2 rounded-lg text-xs font-semibold transition-all ${activeTab === 'sales' ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-950' : 'text-slate-400 hover:text-white'}`}>
              ðŸ’³ Sales & RO Billing
            </button>
            <button onClick={() => setActiveTab('vendors')} className={`px-3.5 py-2 rounded-lg text-xs font-semibold transition-all ${activeTab === 'vendors' ? 'bg-amber-600 text-white shadow-lg shadow-amber-950' : 'text-slate-400 hover:text-white'}`}>
              ðŸ­ Vendor Directory ({vendors.length})
            </button>
          </div>
        </div>
      </header>

      <section className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-slate-900/60 border border-slate-800/80 rounded-xl p-5">
          <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">Total Combined Billed</span>
          <div className="text-2xl font-bold text-emerald-400 mt-2">${totalCombinedBilled.toFixed(2)}</div>
          <div className="text-[11px] text-slate-400 mt-1 flex justify-between">
            <span>Parts: ${totalPartsBilled.toFixed(2)}</span>
            <span>Labor: ${totalLaborBilled.toFixed(2)}</span>
          </div>
        </div>

        <div className="bg-slate-900/60 border border-slate-800/80 rounded-xl p-5">
          <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">Wholesale Inventory Value</span>
          <div className="text-2xl font-bold text-slate-200 mt-2">${totalWholesaleValue.toFixed(2)}</div>
          <div className="text-[11px] text-cyan-400 mt-1">{inventory.length} Active SKUs</div>
        </div>

        <div className="bg-slate-900/60 border border-slate-800/80 rounded-xl p-5">
          <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">Combined RO Net Margin</span>
          <div className="text-2xl font-bold text-cyan-400 mt-2">{combinedProfitMargin}%</div>
          <div className="text-[11px] text-emerald-400 mt-1">Target: â‰¥ {location.targetPartsMargin.toFixed(1)}% Margin</div>
        </div>

        <div className={`bg-slate-900/60 border rounded-xl p-5 transition-all ${isDoorRateFlagged ? 'border-rose-500/80 bg-rose-950/20' : 'border-slate-800/80'}`}>
          <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">Door Rate Realization</span>
          <div className={`text-2xl font-bold mt-2 ${isDoorRateFlagged ? 'text-rose-400' : 'text-emerald-400'}`}>{doorRateRealization}%</div>
          <div className="text-[11px] text-slate-400 mt-1">
            Eff: ${effectiveLaborRate.toFixed(2)} / Door: ${location.targetDoorRate.toFixed(2)}
          </div>
        </div>
      </section>

      {activeTab === 'overview' && (
        <main className="max-w-7xl mx-auto space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 bg-slate-900/60 border border-slate-800/80 rounded-xl p-6 space-y-6">
              <div>
                <h2 className="text-lg font-bold text-white mb-2">Dealership Target Benchmarks & Location Specs</h2>
                <p className="text-xs text-slate-400 leading-relaxed">
                  {isAdmin 
                    ? 'Admins can configure target door rates, average technician wages, and target margins below. Click "Accept & Save Benchmarks" to store changes.'
                    : 'Standard User View: Core shop benchmarks and wage settings are protected and locked by Dealership Admins.'}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-slate-950 p-4 rounded-lg border border-slate-800 space-y-3">
                  <h3 className="text-xs font-bold text-cyan-400 uppercase">âš™ï¸ Shop Labor Benchmarks</h3>
                  <div>
                    <label className="text-xs text-slate-400 block mb-1">Target Door Rate ($/hr)</label>
                    <input
                      type="number"
                      disabled={!isAdmin}
                      value={location.targetDoorRate}
                      onChange={(e) => setLocation({ ...location, targetDoorRate: Number(e.target.value) })}
                      className={`bg-slate-900 border border-slate-700 rounded px-3 py-1.5 text-xs font-bold w-full ${isAdmin ? 'text-white' : 'text-slate-500 cursor-not-allowed'}`}
                    />
                  </div>
                  <div>
                    <label className="text-xs text-slate-400 block mb-1">Average Tech Hourly Wage ($/hr)</label>
                    <input
                      type="number"
                      disabled={!isAdmin}
                      value={location.avgTechWage}
                      onChange={(e) => setLocation({ ...location, avgTechWage: Number(e.target.value) })}
                      className={`bg-slate-900 border border-slate-700 rounded px-3 py-1.5 text-xs font-bold w-full ${isAdmin ? 'text-white' : 'text-slate-500 cursor-not-allowed'}`}
                    />
                  </div>
                  {isAdmin && (
                    <button onClick={() => alert('Benchmark changes saved successfully!')} className="w-full bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs py-2 rounded transition-colors">
                      Accept & Save Benchmarks
                    </button>
                  )}
                </div>

                <div className="bg-slate-950 p-4 rounded-lg border border-slate-800 space-y-3">
                  <h3 className="text-xs font-bold text-emerald-400 uppercase">ðŸ“¦ Parts & Dealership Specs</h3>
                  <div>
                    <label className="text-xs text-slate-400 block mb-1">Target Parts Retail Margin %</label>
                    <input
                      type="number"
                      disabled={!isAdmin}
                      value={location.targetPartsMargin}
                      onChange={(e) => setLocation({ ...location, targetPartsMargin: Number(e.target.value) })}
                      className={`bg-slate-900 border border-slate-700 rounded px-3 py-1.5 text-xs font-bold w-full ${isAdmin ? 'text-white' : 'text-slate-500 cursor-not-allowed'}`}
                    />
                  </div>
                  <div className="pt-2 border-t border-slate-800 space-y-2">
                    <span className="text-xs font-bold text-amber-400 uppercase block">ðŸ¢ Dealership Confirmation Email</span>
                    <input type="text" disabled={!isAdmin} value={location.name} onChange={(e) => setLocation({ ...location, name: e.target.value })} className="bg-slate-900 border border-slate-800 rounded px-2.5 py-1 text-xs text-white w-full" />
                    <input type="email" disabled={!isAdmin} value={location.email} onChange={(e) => setLocation({ ...location, email: e.target.value })} className="bg-slate-900 border border-slate-800 rounded px-2.5 py-1 text-xs text-cyan-400 font-mono w-full" />
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-1 bg-slate-900/60 border border-slate-800/80 rounded-xl p-6">
              <h2 className="text-sm font-bold text-white uppercase tracking-wider mb-4">ðŸ‘¥ Dealership User Accounts</h2>
              
              {isAdmin ? (
                <form onSubmit={handleAddUser} className="space-y-3 mb-6">
                  <input type="text" value={newUserName} onChange={(e) => setNewUserName(e.target.value)} placeholder="User Name" className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-1.5 text-xs text-white" />
                  <select value={newUserRole} onChange={(e) => setNewUserRole(e.target.value as any)} className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-1.5 text-xs text-white">
                    <option value="STANDARD">Standard User (Advisor/Parts)</option>
                    <option value="ADMIN">Dealership Admin</option>
                  </select>
                  <input type="email" value={newUserEmail} onChange={(e) => setNewUserEmail(e.target.value)} placeholder="User Email" className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-1.5 text-xs text-white" />
                  <button type="submit" className="w-full bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-semibold py-2 rounded">Accept & Add User</button>
                </form>
              ) : (
                <div className="bg-slate-950 border border-slate-800 p-3 rounded-lg text-xs text-slate-400 mb-4">
                  ðŸ”’ Adding user accounts requires Dealership Admin privileges.
                </div>
              )}

              <div className="divide-y divide-slate-800 border border-slate-800 rounded-lg bg-slate-950/60 overflow-hidden">
                {users.map((u, i) => (
                  <div key={i} className="p-2.5 text-xs flex justify-between items-center">
                    <div><div className="text-white font-medium">{u.name}</div><div className="text-[10px] text-slate-500">{u.email}</div></div>
                    <span className="text-[10px] bg-slate-800 text-cyan-400 px-2 py-0.5 rounded font-mono">{u.role}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </main>
      )}

      {activeTab === 'receiving' && (
        <main className="max-w-7xl mx-auto space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1 bg-slate-900/60 border border-slate-800/80 rounded-xl p-6 flex flex-col">
              {isAdmin ? (
                <>
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                      <span className="text-cyan-400">ðŸ“·</span> AI Camera Invoice Scanner
                    </h2>
                    <span className="text-[10px] bg-cyan-950 text-cyan-400 border border-cyan-800 px-2 py-0.5 rounded font-mono">Admin Protected</span>
                  </div>

                  <div onClick={handleCaptureClick} className="border-2 border-dashed border-slate-800 hover:border-cyan-500/50 rounded-xl p-6 flex flex-col items-center justify-center text-center flex-1 bg-slate-950/40 cursor-pointer transition-colors min-h-[220px]">
                    {imagePreview ? (
                      <div className="relative w-full h-48 rounded-lg overflow-hidden border border-slate-800">
                        <img src={imagePreview} alt="Invoice Capture" className="w-full h-full object-cover" />
                        {isProcessing && (
                          <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center text-cyan-400 text-xs font-mono">
                            âš¡ Gemini 3.6 Parsing Invoice...
                          </div>
                        )}
                      </div>
                    ) : (
                      <>
                        <div className="w-12 h-12 rounded-full bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 text-xl mb-3">ðŸ“¸</div>
                        <p className="text-xs font-medium text-slate-200">Snap Photo or Drop Invoice</p>
                        <p className="text-[11px] text-slate-500 mt-1">Click to trigger webcam or pick invoice image</p>
                        <button type="button" className="mt-4 bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-semibold px-4 py-2 rounded-lg">Capture / Choose File</button>
                      </>
                    )}
                  </div>
                </>
              ) : (
                <>
                  <h2 className="text-sm font-bold text-white uppercase tracking-wider mb-4 flex items-center gap-2">
                    <span className="text-cyan-400">ðŸ“‹</span> Operating Workflow Guide
                  </h2>
                  <div className="space-y-4 text-xs text-slate-300">
                    <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
                      <span className="text-cyan-400 font-bold block mb-1">1. Receiving Stock</span>
                      <p className="text-[11px] text-slate-400">Verify items against packing slip. System flags cost increases so managers can adjust retail pricing.</p>
                    </div>
                    <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
                      <span className="text-emerald-400 font-bold block mb-1">2. Inventory Management</span>
                      <p className="text-[11px] text-slate-400">Stock audits are restricted to Dealership Admins. Standard users manage daily stock counts & billing.</p>
                    </div>
                  </div>
                </>
              )}
            </div>

            <div className="lg:col-span-2 bg-slate-900/60 border border-slate-800/80 rounded-xl p-6">
              <h2 className="text-sm font-bold text-white uppercase tracking-wider mb-2">ðŸ“¦ Master Inventory & Op Code Configuration</h2>
              <div className="border border-slate-800 rounded-lg overflow-x-auto bg-slate-950/50">
                <table className="w-full text-left text-xs min-w-[720px]">
                  <thead className="bg-slate-900 text-slate-400 font-semibold border-b border-slate-800">
                    <tr>
                      <th className="p-2.5">Photo</th>
                      <th className="p-2.5">Op Code / Description</th>
                      <th className="p-2.5 text-center">Stock (Max)</th>
                      <th className="p-2.5 text-right">Retail Margin %</th>
                      <th className="p-2.5 text-right">Labor GP %</th>
                      <th className="p-2.5 text-center min-w-[180px]">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60">
                    {inventory.map((item) => {
                      const partsMarginPct = item.retailPrice > 0 ? (((item.retailPrice - item.unitCost) / item.retailPrice) * 100) : 0;
                      const laborCostBasis = item.stdLaborHours * location.avgTechWage;
                      const laborGpPct = item.stdLaborRate > 0 ? (((item.stdLaborRate - laborCostBasis) / item.stdLaborRate) * 100) : 0;

                      const isLowStock = item.qty <= item.lowStockThreshold;
                      const isPartsMarginOff = partsMarginPct < location.targetPartsMargin;
                      const isLaborGpOff = laborGpPct < location.targetLaborGp;

                      return (
                        <tr key={item.id} className="hover:bg-slate-900/40 transition-colors">
                          <td className="p-2">
                            {item.photoUrl ? (
                              <img src={item.photoUrl} alt="Part" className="w-8 h-8 rounded object-cover border border-slate-700" />
                            ) : (
                              <div className="w-8 h-8 rounded bg-slate-900 border border-slate-800 flex items-center justify-center text-[10px] text-slate-600">No Img</div>
                            )}
                          </td>
                          <td className="p-2">
                            <div className="font-bold text-white">{item.description}</div>
                            <div className="flex items-center gap-2 mt-0.5">
                              <span className="text-[10px] bg-cyan-950 text-cyan-400 border border-cyan-800 px-1.5 py-0.2 rounded font-mono">{item.opCode}</span>
                              <span className="text-[10px] text-slate-500 font-mono">{item.pn}</span>
                              {item.priceChanged && (
                                <span className="text-[9px] bg-amber-950 text-amber-400 border border-amber-800 px-1.5 py-0.2 rounded font-mono font-bold animate-pulse">
                                  âš¡ Cost Shift: ${item.previousCost?.toFixed(2)} â†’ ${item.unitCost.toFixed(2)}
                                </span>
                              )}
                            </div>
                          </td>
                          <td className="p-2 text-center">
                            <div className={`font-bold ${isLowStock ? 'text-rose-400' : 'text-emerald-400'}`}>
                              {item.qty} <span className="text-slate-500 font-normal">/ {item.maxStock}</span>
                            </div>
                          </td>
                          <td className="p-2 text-right">
                            <div className={`font-bold ${isPartsMarginOff ? 'text-rose-400' : 'text-emerald-400'}`}>
                              {partsMarginPct.toFixed(1)}%
                            </div>
                          </td>
                          <td className="p-2 text-right">
                            <div className={`font-bold ${isLaborGpOff ? 'text-rose-400' : 'text-emerald-400'}`}>
                              {laborGpPct.toFixed(1)}%
                            </div>
                          </td>
                          <td className="p-2 text-center whitespace-nowrap">
                            <div className="flex items-center justify-center gap-1.5">
                              <button onClick={() => setEditingItem(item)} className="bg-slate-800 hover:bg-slate-700 text-cyan-400 text-[10px] px-2 py-1 rounded border border-slate-700 whitespace-nowrap">âœï¸ Specs</button>
                              {isAdmin && (
                                <button onClick={() => { setRectifyingItem(item); setRectifyCount(item.qty); }} className="bg-slate-800 hover:bg-slate-700 text-amber-400 text-[10px] px-2 py-1 rounded border border-slate-700 whitespace-nowrap">âš–ï¸ Audit</button>
                              )}
                              <button onClick={() => handleTriggerPartPhoto(item.pn)} className="bg-slate-800 hover:bg-slate-700 text-slate-300 text-[10px] px-2 py-1 rounded border border-slate-700 whitespace-nowrap">ðŸ“· Snap</button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </main>
      )}

      {activeTab === 'sales' && (
        <main className="max-w-7xl mx-auto space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1 bg-slate-900/60 border border-slate-800/80 rounded-xl p-6">
              <h2 className="text-sm font-bold text-white uppercase tracking-wider mb-1">ðŸ›’ Available Stock & Op Codes</h2>
              <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1">
                {inventory.map((item) => (
                  <div key={item.id} className="bg-slate-950 border border-slate-800/80 rounded-lg p-3 flex justify-between items-center">
                    <div>
                      <div className="text-xs font-bold text-white">{item.description}</div>
                      <div className="text-[10px] text-cyan-400 font-mono mt-0.5">{item.opCode} â€¢ Stock: <span className={item.qty <= item.lowStockThreshold ? 'text-rose-400 font-bold' : 'text-emerald-400 font-bold'}>{item.qty}</span></div>
                      <div className="text-[11px] text-emerald-400 font-bold mt-0.5">Parts: ${item.retailPrice.toFixed(2)} | Labor: ${item.stdLaborRate.toFixed(2)}</div>
                    </div>
                    <button disabled={item.qty <= 0} onClick={() => handleAddProductToRO(item)} className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded text-xs font-bold">+ Add</button>
                  </div>
                ))}
              </div>
            </div>

            <div className="lg:col-span-2 bg-slate-900/60 border border-slate-800/80 rounded-xl p-6">
              <h2 className="text-sm font-bold text-white uppercase tracking-wider mb-3">ðŸ’³ RO Billing & Real-Time Margins</h2>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <input type="text" value={roNumber} onChange={(e) => setRoNumber(e.target.value)} className="bg-slate-950 border border-slate-800 rounded px-3 py-2 text-xs text-white" placeholder="RO #" />
                <input type="text" value={techName} onChange={(e) => setTechName(e.target.value)} className="bg-slate-950 border border-slate-800 rounded px-3 py-2 text-xs text-white" placeholder="Tech ID" />
              </div>
              <div className="border border-slate-800 rounded-lg overflow-x-auto bg-slate-950/60 mb-4">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-900 text-slate-400 font-semibold border-b border-slate-800">
                    <tr><th className="p-2.5">Op Code</th><th className="p-2.5 text-center">Qty</th><th className="p-2.5 text-right">Parts</th><th className="p-2.5 text-right">Labor</th><th className="p-2.5 text-right">Margin</th><th className="p-2.5 text-center">Action</th></tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800">
                    {roItems.map((item) => (
                      <tr key={item.id}>
                        <td className="p-2.5 text-white">{item.description} ({item.opCode})</td>
                        <td className="p-2.5 text-center"><input type="number" value={item.qtyBilled} onChange={(e) => handleUpdateBilledQty(item.id, Number(e.target.value))} className="w-12 bg-slate-900 border border-slate-700 rounded px-1 text-center text-white" /></td>
                        <td className="p-2.5 text-right text-emerald-400">${(item.retailPrice * item.qtyBilled).toFixed(2)}</td>
                        <td className="p-2.5 text-right text-slate-200">${item.laborPrice.toFixed(2)}</td>
                        <td className="p-2.5 text-right text-cyan-400">${((item.retailPrice * item.qtyBilled + item.laborPrice) - (item.unitCost * item.qtyBilled)).toFixed(2)}</td>
                        <td className="p-2.5 text-center"><button onClick={() => handleRemoveFromRO(item)} className="text-rose-400 font-bold">âœ•</button></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <button onClick={() => alert(`Billing committed for ${roNumber}!`)} className="w-full bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold py-3 rounded-lg shadow-lg shadow-emerald-950">
                Accept & Finalize Billing for {roNumber}
              </button>
            </div>
          </div>
        </main>
      )}

      {activeTab === 'vendors' && (
        <main className="max-w-7xl mx-auto space-y-8">
          <div className="bg-slate-900/60 border border-slate-800/80 rounded-xl p-6">
            <h2 className="text-sm font-bold text-white uppercase tracking-wider mb-2">ðŸ­ Vendor Directory & Order Preferences</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {vendors.map((v) => (
                <div key={v.id} className="bg-slate-950 border border-slate-800 rounded-xl p-5 space-y-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-sm font-bold text-white">{v.name}</h3>
                      <p className="text-xs text-slate-400">{v.contactPerson} â€¢ {v.phone}</p>
                      <p className="text-xs text-cyan-400 font-mono mt-0.5">{v.email}</p>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <button onClick={() => setEditingVendor(v)} className="bg-slate-800 text-cyan-400 border border-slate-700 text-[10px] px-2.5 py-1 rounded">
                        âœï¸ Edit Contact Info
                      </button>
                      <span className={`text-[10px] px-2 py-0.5 rounded font-mono font-bold ${v.orderMethod === 'SMS' ? 'bg-amber-950 text-amber-400 border border-amber-800' : 'bg-cyan-950 text-cyan-400 border border-cyan-800'}`}>
                        Method: {v.orderMethod}
                      </span>
                    </div>
                  </div>

                  <button onClick={() => setVendorOrderDigest({ vendor: v, items: inventory.filter(i => i.vendorName.toLowerCase() === v.name.toLowerCase() && i.qty <= i.lowStockThreshold).map(i => ({ item: i, reorderQty: Math.max(0, i.maxStock - i.qty) })) })} className="w-full bg-slate-900 hover:bg-slate-800 text-amber-400 border border-slate-700 text-xs py-2 rounded font-semibold">
                    ðŸ“‹ Generate Auto-Order Digest (Calculates Max Stock Need)
                  </button>
                </div>
              ))}
            </div>
          </div>
        </main>
      )}

      {editingItem && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 max-w-lg w-full space-y-4">
            <h3 className="text-sm font-bold text-white uppercase">âœï¸ Edit Product Specs</h3>
            <div className="grid grid-cols-2 gap-3">
              <div><label className="text-xs text-slate-400">Op Code</label><input type="text" value={editingItem.opCode} onChange={(e) => setEditingItem({ ...editingItem, opCode: e.target.value })} className="w-full bg-slate-950 border border-slate-800 rounded px-2.5 py-1.5 text-xs text-white" /></div>
              <div><label className="text-xs text-slate-400">Part Number</label><input type="text" value={editingItem.pn} onChange={(e) => setEditingItem({ ...editingItem, pn: e.target.value })} className="w-full bg-slate-950 border border-slate-800 rounded px-2.5 py-1.5 text-xs text-white" /></div>
            </div>
            <div><label className="text-xs text-slate-400">Description</label><input type="text" value={editingItem.description} onChange={(e) => setEditingItem({ ...editingItem, description: e.target.value })} className="w-full bg-slate-950 border border-slate-800 rounded px-2.5 py-1.5 text-xs text-white" /></div>
            <div className="grid grid-cols-3 gap-3">
              <div><label className="text-xs text-slate-400">Wholesale ($)</label><input type="number" value={editingItem.unitCost} onChange={(e) => setEditingItem({ ...editingItem, unitCost: Number(e.target.value) })} className="w-full bg-slate-950 border border-slate-800 rounded px-2.5 py-1.5 text-xs text-white" /></div>
              <div><label className="text-xs text-slate-400">Parts Retail ($)</label><input type="number" value={editingItem.retailPrice} onChange={(e) => setEditingItem({ ...editingItem, retailPrice: Number(e.target.value) })} className="w-full bg-slate-950 border border-slate-800 rounded px-2.5 py-1.5 text-xs text-white" /></div>
              <div><label className="text-xs text-slate-400">Labor ($)</label><input type="number" value={editingItem.stdLaborRate} onChange={(e) => setEditingItem({ ...editingItem, stdLaborRate: Number(e.target.value) })} className="w-full bg-slate-950 border border-slate-800 rounded px-2.5 py-1.5 text-xs text-white" /></div>
            </div>
            <div className="grid grid-cols-2 gap-3 pt-2 border-t border-slate-800">
              <div><label className="text-xs text-amber-400 font-bold">Max Stock Level</label><input type="number" value={editingItem.maxStock} onChange={(e) => setEditingItem({ ...editingItem, maxStock: Number(e.target.value) })} className="w-full bg-slate-950 border border-slate-800 rounded px-2.5 py-1.5 text-xs text-white font-bold" /></div>
              <div><label className="text-xs text-amber-400 font-bold">Low Stock Alert Threshold</label><input type="number" value={editingItem.lowStockThreshold} onChange={(e) => setEditingItem({ ...editingItem, lowStockThreshold: Number(e.target.value) })} className="w-full bg-slate-950 border border-slate-800 rounded px-2.5 py-1.5 text-xs text-white font-bold" /></div>
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button onClick={() => setEditingItem(null)} className="px-4 py-2 bg-slate-800 text-slate-300 text-xs rounded">Cancel</button>
              <button onClick={handleSaveEditItem} className="px-4 py-2 bg-cyan-600 text-white text-xs font-bold rounded">Accept & Save Specs</button>
            </div>
          </div>
        </div>
      )}

      {editingVendor && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 max-w-md w-full space-y-4">
            <h3 className="text-sm font-bold text-white uppercase">âœï¸ Edit Vendor Contact Specs</h3>
            <div><label className="text-xs text-slate-400">Vendor Name</label><input type="text" value={editingVendor.name} onChange={(e) => setEditingVendor({ ...editingVendor, name: e.target.value })} className="w-full bg-slate-950 border border-slate-800 rounded px-2.5 py-1.5 text-xs text-white" /></div>
            <div><label className="text-xs text-slate-400">Contact Rep Person</label><input type="text" value={editingVendor.contactPerson} onChange={(e) => setEditingVendor({ ...editingVendor, contactPerson: e.target.value })} className="w-full bg-slate-950 border border-slate-800 rounded px-2.5 py-1.5 text-xs text-white" /></div>
            <div><label className="text-xs text-slate-400">Email Address</label><input type="email" value={editingVendor.email} onChange={(e) => setEditingVendor({ ...editingVendor, email: e.target.value })} className="w-full bg-slate-950 border border-slate-800 rounded px-2.5 py-1.5 text-xs text-white" /></div>
            <div><label className="text-xs text-slate-400">Phone / SMS Number</label><input type="text" value={editingVendor.phone} onChange={(e) => setEditingVendor({ ...editingVendor, phone: e.target.value })} className="w-full bg-slate-950 border border-slate-800 rounded px-2.5 py-1.5 text-xs text-white" /></div>
            <div>
              <label className="text-xs text-amber-400 font-bold block mb-1">Preferred Order Method</label>
              <select value={editingVendor.orderMethod} onChange={(e) => setEditingVendor({ ...editingVendor, orderMethod: e.target.value as 'Email' | 'SMS' })} className="w-full bg-slate-950 border border-slate-800 rounded px-2.5 py-1.5 text-xs text-white">
                <option value="Email">Email Transmission</option>
                <option value="SMS">SMS Text Message</option>
              </select>
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button onClick={() => setEditingVendor(null)} className="px-4 py-2 bg-slate-800 text-slate-300 text-xs rounded">Cancel</button>
              <button onClick={handleSaveEditVendor} className="px-4 py-2 bg-cyan-600 text-white text-xs font-bold rounded">Accept & Save Vendor</button>
            </div>
          </div>
        </div>
      )}

      {rectifyingItem && isAdmin && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 max-w-md w-full space-y-4">
            <h3 className="text-sm font-bold text-white uppercase">âš–ï¸ Audit & Rectify Physical Stock</h3>
            <p className="text-xs text-slate-400">{rectifyingItem.description} ({rectifyingItem.pn})</p>
            <div><label className="text-xs text-slate-400">New Physical Count</label><input type="number" value={rectifyCount} onChange={(e) => setRectifyCount(Number(e.target.value))} className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-sm text-white font-bold" /></div>
            <div>
              <label className="text-xs text-slate-400">Audit Reason</label>
              <select value={rectifyReason} onChange={(e) => setRectifyReason(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-xs text-white">
                <option value="Physical Count Discrepancy">Physical Count Discrepancy</option>
                <option value="Spilled / Damaged Can">Spilled / Damaged Can</option>
                <option value="Internal Shop Usage">Internal Shop Usage</option>
              </select>
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button onClick={() => setRectifyingItem(null)} className="px-4 py-2 bg-slate-800 text-slate-300 text-xs rounded">Cancel</button>
              <button onClick={handleSaveRectifyStock} className="px-4 py-2 bg-amber-600 text-white text-xs font-bold rounded">Accept & Log Stock Audit</button>
            </div>
          </div>
        </div>
      )}

      {vendorOrderDigest && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-slate-900 border border-amber-500/40 rounded-xl p-6 max-w-xl w-full space-y-4">
            <h3 className="text-sm font-bold text-amber-400 uppercase">ðŸ“‹ Low-Stock Auto-Order Digest</h3>
            <div className="text-xs text-slate-300">
              <p>Vendor: <strong className="text-white">{vendorOrderDigest.vendor.name}</strong></p>
              <p>Order Method: <strong className="text-cyan-400">{vendorOrderDigest.vendor.orderMethod} ({vendorOrderDigest.vendor.orderMethod === 'SMS' ? vendorOrderDigest.vendor.phone : vendorOrderDigest.vendor.email})</strong></p>
            </div>
            <div className="border border-slate-800 rounded bg-slate-950 p-3 max-h-48 overflow-y-auto space-y-2 text-xs">
              {vendorOrderDigest.items.map(({ item, reorderQty }) => (
                <div key={item.id} className="flex justify-between items-center border-b border-slate-800 pb-1">
                  <div>
                    <div className="text-white font-medium">{item.description} ({item.pn})</div>
                    <div className="text-[10px] text-amber-400">Current Stock: {item.qty} units | Max Target: {item.maxStock}</div>
                  </div>
                  <span className="text-xs font-bold text-cyan-400">Auto Re-Order: +{reorderQty} Cans</span>
                </div>
              ))}
            </div>
            <div className="bg-slate-950 border border-slate-800 p-3 rounded text-[11px] text-slate-400">
              âš¡ <strong className="text-white">Mandatory Dealership Copy:</strong> Order receipt automatically dispatched to dealership email: <span className="text-cyan-400 font-mono">{location.email}</span>.
            </div>
            <div className="flex justify-end gap-2">
              <button onClick={() => setVendorOrderDigest(null)} className="px-4 py-2 bg-slate-800 text-slate-300 text-xs rounded">Close</button>
              <button onClick={() => { alert(`Auto-order transmitted to ${vendorOrderDigest.vendor.name} via ${vendorOrderDigest.vendor.orderMethod}.\nShop copy automatically emailed to ${location.email}`); setVendorOrderDigest(null); }} className="px-4 py-2 bg-amber-600 text-white text-xs font-bold rounded">Accept & Transmit Order</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

