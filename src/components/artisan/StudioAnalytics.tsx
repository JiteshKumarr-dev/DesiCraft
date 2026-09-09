import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  TrendingUp,
  DollarSign,
  Building2,
  ShieldCheck,
  CheckCircle,
  ArrowUpRight,
  Clock,
  Calendar,
  Layers,
  PieChart,
  Download,
  Landmark,
} from 'lucide-react';

export const StudioAnalytics: React.FC = () => {
  const { user, orders } = useApp();

  const totalEarnings = orders.reduce((sum, o) => sum + o.total_price, 0);
  const artisanShare = Math.round(totalEarnings * 0.82);
  const rawMaterialsFund = Math.round(totalEarnings * 0.11);
  const guildFund = Math.round(totalEarnings * 0.04);
  const platformFee = Math.round(totalEarnings * 0.03);

  const mockTransactions = [
    {
      id: 'TXN-902184-IN',
      date: 'Today, 02:45 PM',
      desc: 'Payout: Kashi Kadwa Brocade Silk Saree',
      customer: 'Priya Sharma (Bengaluru)',
      amount: 28500,
      status: 'Settled to Bank',
      bankRef: 'UTR-HDFC902847192',
      channel: 'DBT Direct UPI',
    },
    {
      id: 'TXN-884920-IN',
      date: '04 Sep 2026',
      desc: 'Payout: Ganga Ghat Handwoven Dupatta',
      customer: 'Ananya Deshmukh (Pune)',
      amount: 8200,
      status: 'Settled to Bank',
      bankRef: 'UTR-HDFC884920194',
      channel: 'DBT Direct UPI',
    },
    {
      id: 'TXN-874011-IN',
      date: '28 Aug 2026',
      desc: 'Adopt-a-Loom Patronage Stipend (Quarterly)',
      customer: 'Vikram Malhotra Foundation',
      amount: 15000,
      status: 'Settled to Bank',
      bankRef: 'NEFT-RBI20260828001',
      channel: 'Patron Heritage Grant',
    },
    {
      id: 'TXN-861099-IN',
      date: '15 Aug 2026',
      desc: 'ODOP State Artisan Subsidy Reimbursement',
      customer: 'Dept of MSME, Govt of UP',
      amount: 25000,
      status: 'Settled to Bank',
      bankRef: 'PFMS-UPMSME2026884',
      channel: 'Central DBT Scheme',
    },
  ];

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Top Banner: Direct Beneficiary Settlement */}
      <div className="p-6 sm:p-8 rounded-3xl bg-linear-to-br from-surface-container-high via-surface-container to-surface border border-outline/20 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-green-900/15 text-green-700 border border-green-700/30">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>DIRECT BENEFIT TRANSFER (DBT) VERIFIED</span>
          </div>

          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-on-surface">
            Studio Earnings & Heritage Realization
          </h2>

          <p className="text-xs sm:text-sm text-on-surface-variant max-w-xl">
            Linked to Pehchan Card <strong>{user.artisan_profile?.craft_id ? 'UP-VNS-2023-88492' : 'VERIFIED-ARTISAN'}</strong>. Zero middleman commissions. 82% of customer spend flows directly to your bank.
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-surface border border-outline/20 space-y-2 min-w-[240px]">
          <div className="flex items-center justify-between text-xs text-on-surface-variant">
            <span className="flex items-center gap-1.5 font-medium">
              <Landmark className="w-3.5 h-3.5 text-primary" />
              Settlement Bank
            </span>
            <span className="font-bold text-green-700">Active DBT</span>
          </div>
          <p className="font-serif font-bold text-sm text-on-surface">
            HDFC Bank ••••••••8492
          </p>
          <div className="text-[11px] text-on-surface-variant flex items-center justify-between border-t border-outline/10 pt-1.5">
            <span>IFSC: HDFC0001842</span>
            <span>Kashi Branch</span>
          </div>
        </div>
      </div>

      {/* Primary Financial Snapshot */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-surface border border-outline/20 shadow-xs space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-on-surface-variant uppercase">
              Total Realized Revenue
            </span>
            <DollarSign className="w-4 h-4 text-primary" />
          </div>
          <p className="font-serif text-2xl font-bold text-primary">
            ₹{(totalEarnings + 40000).toLocaleString('en-IN')}
          </p>
          <span className="text-[11px] text-green-700 font-medium flex items-center gap-0.5">
            <TrendingUp className="w-3 h-3" />
            +24.6% vs previous quarter
          </span>
        </div>

        <div className="p-5 rounded-2xl bg-surface border border-outline/20 shadow-xs space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-on-surface-variant uppercase">
              Direct Artisan Share (82%)
            </span>
            <ShieldCheck className="w-4 h-4 text-green-700" />
          </div>
          <p className="font-serif text-2xl font-bold text-green-700">
            ₹{(artisanShare + 32800).toLocaleString('en-IN')}
          </p>
          <span className="text-[11px] text-on-surface-variant">
            vs ~12% on conventional e-commerce
          </span>
        </div>

        <div className="p-5 rounded-2xl bg-surface border border-outline/20 shadow-xs space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-on-surface-variant uppercase">
              Loom Utilization Rate
            </span>
            <Layers className="w-4 h-4 text-secondary" />
          </div>
          <p className="font-serif text-2xl font-bold text-secondary">
            91.6%
          </p>
          <span className="text-[11px] text-secondary font-medium">
            3 Pit-Looms Operating Daily
          </span>
        </div>

        <div className="p-5 rounded-2xl bg-surface border border-outline/20 shadow-xs space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-on-surface-variant uppercase">
              Effective Hourly Realization
            </span>
            <Clock className="w-4 h-4 text-primary" />
          </div>
          <p className="font-serif text-2xl font-bold text-on-surface">
            ₹485 / hr
          </p>
          <span className="text-[11px] text-primary font-medium">
            3.2x statutory rural wage floor
          </span>
        </div>
      </div>

      {/* Visual Revenue Breakdown & Fair Share Economics */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 p-6 rounded-2xl bg-surface border border-outline/20 shadow-xs space-y-5">
          <div className="flex items-center justify-between border-b border-outline/10 pb-3">
            <div>
              <h3 className="font-serif text-base font-bold text-on-surface">
                Transparent Craft Economics & Distribution
              </h3>
              <p className="text-xs text-on-surface-variant">
                Every rupee is tracked cryptographically with fair compensation guarantees.
              </p>
            </div>
            <span className="text-xs font-bold text-primary px-3 py-1 bg-primary/10 rounded-full">
              Fair Trade Certified
            </span>
          </div>

          {/* Bar Visualization */}
          <div className="space-y-3">
            <div className="h-4 w-full bg-surface-container-high rounded-full overflow-hidden flex">
              <div style={{ width: '82%' }} className="bg-primary h-full" title="Artisan Direct Share (82%)" />
              <div style={{ width: '11%' }} className="bg-secondary h-full" title="Raw Material Reserve (11%)" />
              <div style={{ width: '4%' }} className="bg-green-700 h-full" title="Guild & Apprentice Fund (4%)" />
              <div style={{ width: '3%' }} className="bg-neutral-400 h-full" title="Platform Cloud & Logistics (3%)" />
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs pt-1">
              <div className="space-y-0.5">
                <div className="flex items-center gap-1.5 font-bold text-on-surface">
                  <span className="w-2.5 h-2.5 rounded-full bg-primary inline-block" />
                  <span>82% Artisan Share</span>
                </div>
                <p className="text-[11px] text-on-surface-variant">
                  Direct living wage & family security
                </p>
              </div>

              <div className="space-y-0.5">
                <div className="flex items-center gap-1.5 font-bold text-on-surface">
                  <span className="w-2.5 h-2.5 rounded-full bg-secondary inline-block" />
                  <span>11% Raw Materials</span>
                </div>
                <p className="text-[11px] text-on-surface-variant">
                  Pure Mulberry silk & Tested silver Zari
                </p>
              </div>

              <div className="space-y-0.5">
                <div className="flex items-center gap-1.5 font-bold text-on-surface">
                  <span className="w-2.5 h-2.5 rounded-full bg-green-700 inline-block" />
                  <span>4% Guild Fund</span>
                </div>
                <p className="text-[11px] text-on-surface-variant">
                  Weaver cooperative apprentice stipend
                </p>
              </div>

              <div className="space-y-0.5">
                <div className="flex items-center gap-1.5 font-bold text-on-surface">
                  <span className="w-2.5 h-2.5 rounded-full bg-neutral-400 inline-block" />
                  <span>3% Tech & Postage</span>
                </div>
                <p className="text-[11px] text-on-surface-variant">
                  Desi Craft cloud servers & speed post
                </p>
              </div>
            </div>
          </div>

          {/* Comparison with Mass Retail */}
          <div className="p-4 rounded-xl bg-surface-container-low border border-outline/20 text-xs space-y-2">
            <h4 className="font-serif font-bold text-on-surface">
              Why This Matters: Desi Craft vs Traditional Middlemen
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-[11px] text-on-surface-variant">
              <div className="p-3 rounded-lg bg-surface border border-outline/15 space-y-1">
                <span className="font-bold text-red-600 block">Traditional Middleman Channels</span>
                <p>Artisan receives <strong>10% to 15%</strong> of retail price. Wholesalers and master-traders capture 85% markup.</p>
              </div>
              <div className="p-3 rounded-lg bg-surface border border-outline/15 space-y-1">
                <span className="font-bold text-green-700 block">Desi Craft Sovereign Ecosystem</span>
                <p>Artisan retains <strong>82% direct value</strong>. Digital Craft Passport guarantees customer authenticity without intermediaries.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Loom Operations Card */}
        <div className="p-6 rounded-2xl bg-surface border border-outline/20 shadow-xs space-y-4">
          <h3 className="font-serif text-base font-bold text-on-surface border-b border-outline/10 pb-2">
            Active Loom Capacity
          </h3>

          <div className="space-y-3 text-xs">
            <div className="p-3 rounded-xl bg-surface-container-low border border-outline/20 space-y-1">
              <div className="flex items-center justify-between font-semibold text-on-surface">
                <span>Loom #1 (Pit Loom)</span>
                <span className="text-primary font-bold">92% In Progress</span>
              </div>
              <p className="text-[11px] text-on-surface-variant">
                Varanasi Katan Silk Kadwa Saree • 12 days elapsed
              </p>
            </div>

            <div className="p-3 rounded-xl bg-surface-container-low border border-outline/20 space-y-1">
              <div className="flex items-center justify-between font-semibold text-on-surface">
                <span>Loom #2 (Frame Loom)</span>
                <span className="text-secondary font-bold">54% In Progress</span>
              </div>
              <p className="text-[11px] text-on-surface-variant">
                Jamdani Floral Scarf • 4 days elapsed
              </p>
            </div>

            <div className="p-3 rounded-xl bg-surface-container-low border border-outline/20 space-y-1">
              <div className="flex items-center justify-between font-semibold text-on-surface">
                <span>Loom #3 (Brocade Loom)</span>
                <span className="text-green-700 font-bold">Idle / Ready</span>
              </div>
              <p className="text-[11px] text-on-surface-variant">
                Available for Bespoke Patron Commission
              </p>
            </div>
          </div>

          <div className="pt-2 text-center">
            <span className="text-[11px] text-on-surface-variant">
              Guild Audit Verified: 0 child labor • 100% handloom certified
            </span>
          </div>
        </div>
      </div>

      {/* Transaction & Settlement Ledger */}
      <div className="p-6 rounded-2xl bg-surface border border-outline/20 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-outline/10 pb-3">
          <div>
            <h3 className="font-serif text-base font-bold text-on-surface">
              Direct Benefit Transfer (DBT) Bank Ledger
            </h3>
            <p className="text-xs text-on-surface-variant">
              Real-time audit trail of bank settlements, patron grants, and ODOP subsidies.
            </p>
          </div>
          <button
            onClick={() => alert('Exporting full DBT financial audit statement (PDF)...')}
            className="px-3 py-1.5 rounded-lg border border-outline/20 text-xs font-semibold text-on-surface hover:bg-surface-container transition flex items-center gap-1.5 self-start cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download Bank Statement</span>
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-outline/15 text-on-surface-variant font-semibold">
                <th className="pb-3 pl-1">Date & Ref</th>
                <th className="pb-3">Description & Patron</th>
                <th className="pb-3">Settlement Route</th>
                <th className="pb-3 text-right">Amount</th>
                <th className="pb-3 text-right pr-1">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline/10">
              {mockTransactions.map((tx) => (
                <tr key={tx.id} className="hover:bg-surface-container-low/50 transition">
                  <td className="py-3.5 pl-1">
                    <span className="font-bold text-on-surface block">{tx.date}</span>
                    <span className="text-[10px] text-on-surface-variant font-mono">{tx.bankRef}</span>
                  </td>
                  <td className="py-3.5">
                    <span className="font-semibold text-on-surface block">{tx.desc}</span>
                    <span className="text-[11px] text-primary">{tx.customer}</span>
                  </td>
                  <td className="py-3.5">
                    <span className="px-2 py-0.5 rounded-md bg-surface-container text-on-surface font-medium border border-outline/10">
                      {tx.channel}
                    </span>
                  </td>
                  <td className="py-3.5 text-right font-serif font-bold text-sm text-green-700">
                    +₹{tx.amount.toLocaleString('en-IN')}
                  </td>
                  <td className="py-3.5 text-right pr-1">
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-green-900/15 text-green-700 border border-green-700/20">
                      <CheckCircle className="w-3 h-3" />
                      {tx.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
