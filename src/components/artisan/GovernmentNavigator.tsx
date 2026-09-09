import React, { useState } from 'react';
import {
  Building2,
  ShieldCheck,
  CheckCircle2,
  ExternalLink,
  Award,
  Clock,
  ArrowRight,
  FileText,
  BadgePercent,
  Coins,
} from 'lucide-react';

export const GovernmentNavigator: React.FC = () => {
  const [completedSteps, setCompletedSteps] = useState<number[]>([1, 2]);

  const toggleStep = (stepNum: number) => {
    if (completedSteps.includes(stepNum)) {
      setCompletedSteps(completedSteps.filter((s) => s !== stepNum));
    } else {
      setCompletedSteps([...completedSteps, stepNum]);
    }
  };

  const vishwakarmaMilestones = [
    {
      step: 1,
      title: 'Gram Panchayat / CSC Biometric Authentication',
      desc: 'Verify your Aadhaar and artisanal trade through local CSC center or Village Officer.',
    },
    {
      step: 2,
      title: 'Pehchan Card & PM Vishwakarma Certificate Issued',
      desc: 'Receive digital artisan ID card and official national certification from Ministry of MSME.',
    },
    {
      step: 3,
      title: '5-Day Skill Upgradation Workshop (₹500/Day Stipend)',
      desc: 'Attend modern toolkit training at your nearest Government Industrial Training Institute (ITI).',
    },
    {
      step: 4,
      title: '₹15,000 E-Voucher for Handcraft Toolkit & Loom Parts',
      desc: 'Direct DBT digital voucher credited to purchase certified handlooms, chisels, or pottery wheels.',
    },
    {
      step: 5,
      title: '₹3,00,000 Collateral-Free Enterprise Loan @ 5% Concessional Interest',
      desc: 'Tranche 1: ₹1,00,000 (18 months) + Tranche 2: ₹2,00,000 (30 months) backed by CGTMSE guarantee.',
    },
  ];

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header */}
      <div className="p-6 sm:p-8 rounded-2xl bg-surface-container-low border border-outline/20">
        <div className="max-w-2xl space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-secondary/15 text-secondary border border-secondary/30">
            <Building2 className="w-4 h-4" />
            <span>GOVERNMENT SCHEME NAVIGATOR</span>
          </div>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-on-surface">
            PM Vishwakarma & Central Artisan Subsidies
          </h2>
          <p className="text-xs sm:text-sm text-on-surface-variant leading-relaxed">
            Directly access Government of India support schemes with step-by-step onboarding, subsidized equipment vouchers, and interest-subvented credit facilities.
          </p>
        </div>
      </div>

      {/* PM Vishwakarma Step Checklist */}
      <div className="p-6 rounded-2xl bg-surface border border-outline/20 space-y-5 shadow-xs">
        <div className="flex items-center justify-between">
          <h3 className="font-serif text-base font-bold text-on-surface flex items-center gap-2">
            <Coins className="w-5 h-5 text-primary" />
            <span>PM Vishwakarma Roadmap: Your Benefit Progress</span>
          </h3>
          <span className="text-xs font-bold text-primary font-mono">
            {completedSteps.length} of 5 Milestones Active
          </span>
        </div>

        <div className="space-y-3">
          {vishwakarmaMilestones.map((m) => {
            const isDone = completedSteps.includes(m.step);
            return (
              <div
                key={m.step}
                onClick={() => toggleStep(m.step)}
                className={`p-4 rounded-xl border transition cursor-pointer flex items-start gap-3.5 ${
                  isDone
                    ? 'border-green-300 bg-green-50/50'
                    : 'border-outline/20 bg-surface-container-low hover:bg-surface-container'
                }`}
              >
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 text-xs font-bold ${
                    isDone ? 'bg-green-700 text-white' : 'bg-outline/30 text-on-surface'
                  }`}
                >
                  {isDone ? '✓' : m.step}
                </div>

                <div className="flex-1 min-w-0">
                  <h4 className={`text-xs sm:text-sm font-bold ${isDone ? 'text-green-900' : 'text-on-surface'}`}>
                    {m.title}
                  </h4>
                  <p className="text-xs text-on-surface-variant mt-0.5 leading-relaxed">
                    {m.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          <span className="text-on-surface-variant">
            Official Ministry Portal: <strong>pmvishwakarma.gov.in</strong>
          </span>
          <a
            href="https://pmvishwakarma.gov.in"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-primary text-on-primary font-bold hover:bg-primary/90 transition"
          >
            <span>Apply on National Portal</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>

      {/* Additional Schemes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* ODOP */}
        <div className="p-5 rounded-2xl bg-surface border border-outline/20 space-y-3">
          <div className="flex items-center justify-between">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-secondary/15 text-secondary">
              EXPORT & BRANDING
            </span>
            <span className="text-xs font-semibold text-primary">Invest India</span>
          </div>
          <h4 className="font-serif text-base font-bold text-on-surface">
            One District One Product (ODOP) Display Stalls
          </h4>
          <p className="text-xs text-on-surface-variant leading-relaxed">
            Registered master artisans can claim free retail stalls at major international airports, railway terminals, and embassies globally.
          </p>
          <a
            href="https://www.investindia.gov.in/one-district-one-product"
            target="_blank"
            rel="noreferrer"
            className="text-xs font-bold text-primary hover:underline flex items-center gap-1"
          >
            <span>Check District Product Catalog</span>
            <ArrowRight className="w-3 h-3" />
          </a>
        </div>

        {/* Pehchan Card */}
        <div className="p-5 rounded-2xl bg-surface border border-outline/20 space-y-3">
          <div className="flex items-center justify-between">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-primary/10 text-primary">
              MINISTRY OF TEXTILES
            </span>
            <span className="text-xs font-semibold text-primary">DC Handicrafts</span>
          </div>
          <h4 className="font-serif text-base font-bold text-on-surface">
            Pehchan National Artisan Identity Card
          </h4>
          <p className="text-xs text-on-surface-variant leading-relaxed">
            Universal photo identity card granting free health insurance under Ayushman Bharat and direct stall allotment at Dilli Haat and Surajkund Mela.
          </p>
          <a
            href="http://handicrafts.nic.in"
            target="_blank"
            rel="noreferrer"
            className="text-xs font-bold text-primary hover:underline flex items-center gap-1"
          >
            <span>Register for Pehchan Card</span>
            <ArrowRight className="w-3 h-3" />
          </a>
        </div>
      </div>
    </div>
  );
};
