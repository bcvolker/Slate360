export default function SubscribePage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 to-slate360-blue/10 dark:from-slate-900 dark:to-slate-800 flex flex-col items-center justify-center py-16">
      <h1 className="font-orbitron text-4xl md:text-5xl font-bold text-slate360-blue mb-8 drop-shadow-lg">Choose Your Plan</h1>
      <div className="flex flex-col md:flex-row gap-8">
        {/* Free Tier */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-8 flex-1 min-w-[260px] max-w-xs flex flex-col items-center border-2 border-slate360-blue/20">
          <h2 className="font-orbitron text-2xl text-slate360-blue mb-2">Free</h2>
          <p className="font-inter text-3xl font-bold mb-4">$0<span className="text-base font-normal">/mo</span></p>
          <ul className="font-inter text-slate-700 dark:text-slate-200 mb-6 text-center">
            <li>Basic dashboards</li>
            <li>Up to 3 projects</li>
            <li>Community support</li>
          </ul>
          <button className="bg-slate360-blue text-white font-inter px-6 py-2 rounded-lg font-semibold hover:bg-slate360-blue/90 transition">Get Started</button>
        </div>
        {/* Pro Tier */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-8 flex-1 min-w-[260px] max-w-xs flex flex-col items-center border-2 border-slate360-copper/40">
          <h2 className="font-orbitron text-2xl text-slate360-copper mb-2">Pro</h2>
          <p className="font-inter text-3xl font-bold mb-4">$12<span className="text-base font-normal">/mo</span></p>
          <ul className="font-inter text-slate-700 dark:text-slate-200 mb-6 text-center">
            <li>Unlimited dashboards</li>
            <li>Team collaboration</li>
            <li>Priority support</li>
          </ul>
          <button className="bg-slate360-copper text-white font-inter px-6 py-2 rounded-lg font-semibold hover:bg-slate360-copper/90 transition">Start Pro</button>
        </div>
        {/* Enterprise Tier */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-8 flex-1 min-w-[260px] max-w-xs flex flex-col items-center border-2 border-slate360-slate/40">
          <h2 className="font-orbitron text-2xl text-slate360-slate mb-2">Enterprise</h2>
          <p className="font-inter text-3xl font-bold mb-4">Custom</p>
          <ul className="font-inter text-slate-700 dark:text-slate-200 mb-6 text-center">
            <li>Advanced security</li>
            <li>Custom integrations</li>
            <li>Dedicated support</li>
          </ul>
          <button className="bg-slate360-slate text-white font-inter px-6 py-2 rounded-lg font-semibold hover:bg-slate360-slate/90 transition">Contact Sales</button>
        </div>
      </div>
    </main>
  );
}
