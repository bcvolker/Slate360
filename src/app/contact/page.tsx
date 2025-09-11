import { CleanHeader } from '@/components/CleanHeader';
import { Button } from '@/components/ui/button';
import { SurfaceCard } from '@/components/ui/SurfaceCard';
import { Mail, Phone, MapPin } from 'lucide-react';

export default function ContactPage() {
  return (
    <div className="bg-background min-h-screen">
      <CleanHeader />
      <div className="pt-20">
        <div className="container mx-auto px-6 py-12">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h1 className="text-4xl lg:text-5xl font-bold mb-4">Contact Us</h1>
              <p className="text-lg text-muted-foreground">Get in touch with our team to learn more about Slate360</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <SurfaceCard className="p-8">
                <h2 className="text-2xl font-bold mb-6">Get in Touch</h2>
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <Mail className="h-5 w-5 text-primary" />
                    <span>contact@slate360.com</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Phone className="h-5 w-5 text-primary" />
                    <span>+1 (555) 123-4567</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <MapPin className="h-5 w-5 text-primary" />
                    <span>123 Construction Ave, Tech City, TC 12345</span>
                  </div>
                </div>
                <Button className="mt-6 w-full">Send Message</Button>
              </SurfaceCard>
              
              <SurfaceCard className="p-8">
                <h2 className="text-2xl font-bold mb-6">Quick Links</h2>
                <div className="space-y-3">
                  <Button variant="outline" className="w-full justify-start">Schedule a Demo</Button>
                  <Button variant="outline" className="w-full justify-start">Technical Support</Button>
                  <Button variant="outline" className="w-full justify-start">Partnership Inquiry</Button>
                  <Button variant="outline" className="w-full justify-start">Media Kit</Button>
                </div>
              </SurfaceCard>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}