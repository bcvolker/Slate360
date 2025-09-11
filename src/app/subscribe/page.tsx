import { CleanHeader } from '@/components/CleanHeader';
import { Button } from '@/components/ui/button';
import { SurfaceCard } from '@/components/ui/SurfaceCard';
import { CheckCircle, Star, Zap } from 'lucide-react';

export default function SubscribePage() {
  return (
    <div className="bg-background min-h-screen">
      <CleanHeader />
      <div className="pt-20">
        <div className="container mx-auto px-6 py-12">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16">
              <h1 className="text-4xl lg:text-5xl font-bold mb-4">Choose Your Plan</h1>
              <p className="text-lg text-muted-foreground">
                Unlock the full potential of Slate360 with our flexible subscription options
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <SurfaceCard className="p-8 relative">
                <div className="text-center">
                  <h3 className="text-2xl font-bold mb-2">Starter</h3>
                  <div className="text-4xl font-bold text-primary mb-4">$29<span className="text-lg text-muted-foreground">/mo</span></div>
                  <p className="text-muted-foreground mb-6">Perfect for small teams getting started</p>
                  
                  <div className="space-y-3 mb-8">
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4 text-primary" />
                      <span className="text-sm">Up to 5 projects</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4 text-primary" />
                      <span className="text-sm">Basic BIM tools</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4 text-primary" />
                      <span className="text-sm">Email support</span>
                    </div>
                  </div>
                  
                  <Button className="w-full">Get Started</Button>
                </div>
              </SurfaceCard>
              
              <SurfaceCard className="p-8 relative border-primary border-2">
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <div className="bg-primary text-primary-foreground px-3 py-1 rounded-full text-sm font-semibold flex items-center">
                    <Star className="h-3 w-3 mr-1" />
                    Most Popular
                  </div>
                </div>
                
                <div className="text-center">
                  <h3 className="text-2xl font-bold mb-2">Professional</h3>
                  <div className="text-4xl font-bold text-primary mb-4">$99<span className="text-lg text-muted-foreground">/mo</span></div>
                  <p className="text-muted-foreground mb-6">Ideal for growing construction companies</p>
                  
                  <div className="space-y-3 mb-8">
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4 text-primary" />
                      <span className="text-sm">Unlimited projects</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4 text-primary" />
                      <span className="text-sm">Advanced BIM & VR</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4 text-primary" />
                      <span className="text-sm">Priority support</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4 text-primary" />
                      <span className="text-sm">Analytics dashboard</span>
                    </div>
                  </div>
                  
                  <Button className="w-full">Get Started</Button>
                </div>
              </SurfaceCard>
              
              <SurfaceCard className="p-8 relative">
                <div className="text-center">
                  <h3 className="text-2xl font-bold mb-2">Enterprise</h3>
                  <div className="text-4xl font-bold text-primary mb-4">Custom</div>
                  <p className="text-muted-foreground mb-6">Tailored solutions for large organizations</p>
                  
                  <div className="space-y-3 mb-8">
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4 text-primary" />
                      <span className="text-sm">Everything in Pro</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4 text-primary" />
                      <span className="text-sm">Custom integrations</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4 text-primary" />
                      <span className="text-sm">Dedicated support</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4 text-primary" />
                      <span className="text-sm">On-premise options</span>
                    </div>
                  </div>
                  
                  <Button className="w-full">Contact Sales</Button>
                </div>
              </SurfaceCard>
            </div>
            
            <div className="text-center mt-12">
              <p className="text-muted-foreground mb-4">All plans include a 14-day free trial</p>
              <Button variant="outline" size="lg">Start Free Trial</Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
