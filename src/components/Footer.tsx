// src/components/Footer.tsx
export default function Footer() {
  return (
    <footer className="bg-zinc-950/95 backdrop-blur-sm border-t border-zinc-800">
      <div className="max-w-6xl mx-auto px-8 py-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-4">
          <div>
            <h3 className="font-semibold mb-2 text-sm text-zinc-50">Product</h3>
            <ul className="space-y-1 text-xs text-zinc-400">
              <li><a href="#" className="hover:text-zinc-100 transition-colors">Features</a></li>
              <li><a href="#" className="hover:text-zinc-100 transition-colors">Pricing</a></li>
              <li><a href="#" className="hover:text-zinc-100 transition-colors">Demo</a></li>
              <li><a href="#" className="hover:text-zinc-100 transition-colors">API</a></li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-2 text-sm text-zinc-50">Company</h3>
            <ul className="space-y-1 text-xs text-zinc-400">
              <li><a href="#" className="hover:text-zinc-100 transition-colors">About</a></li>
              <li><a href="#" className="hover:text-zinc-100 transition-colors">Careers</a></li>
              <li><a href="#" className="hover:text-zinc-100 transition-colors">Press</a></li>
              <li><a href="#" className="hover:text-zinc-100 transition-colors">Blog</a></li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-2 text-sm text-zinc-50">Support</h3>
            <ul className="space-y-1 text-xs text-zinc-400">
              <li><a href="#" className="hover:text-zinc-100 transition-colors">Help Center</a></li>
              <li><a href="#" className="hover:text-zinc-100 transition-colors">Contact</a></li>
              <li><a href="#" className="hover:text-zinc-100 transition-colors">Status</a></li>
              <li><a href="#" className="hover:text-zinc-100 transition-colors">Community</a></li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-2 text-sm text-zinc-50">Legal</h3>
            <ul className="space-y-1 text-xs text-zinc-400">
              <li><a href="#" className="hover:text-zinc-100 transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-zinc-100 transition-colors">Terms of Service</a></li>
              <li><a href="#" className="hover:text-zinc-100 transition-colors">Cookie Policy</a></li>
              <li><a href="#" className="hover:text-zinc-100 transition-colors">Security</a></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-zinc-800 pt-3 text-center">
          <p className="text-xs text-zinc-500">
            © 2025 SLATE360. All rights reserved. | Built with innovation for the construction industry.
          </p>
        </div>
      </div>
    </footer>
  );
}
