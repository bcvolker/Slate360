import { CleanHeader } from '@/components/CleanHeader';
import { Button } from '@/components/ui/button';
import { SurfaceCard } from '@/components/ui/SurfaceCard';
import { Users, Target, Award, Lightbulb } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="bg-background min-h-screen">
      <CleanHeader />
      <div className="pt-20">
        <div className="container mx-auto px-6 py-12">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h1 className="text-4xl lg:text-5xl font-bold mb-4">About Slate360</h1>
              <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
                We're revolutionizing the construction industry through cutting-edge technology, 
                innovative solutions, and a commitment to excellence.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
              <SurfaceCard className="p-6 text-center">
                <Users className="h-12 w-12 text-primary mx-auto mb-4" />
                <h3 className="text-xl font-bold mb-2">Expert Team</h3>
                <p className="text-muted-foreground">Industry professionals with decades of combined experience</p>
              </SurfaceCard>
              
              <SurfaceCard className="p-6 text-center">
                <Target className="h-12 w-12 text-primary mx-auto mb-4" />
                <h3 className="text-xl font-bold mb-2">Innovation</h3>
                <p className="text-muted-foreground">Pioneering new technologies in construction management</p>
              </SurfaceCard>
              
              <SurfaceCard className="p-6 text-center">
                <Award className="h-12 w-12 text-primary mx-auto mb-4" />
                <h3 className="text-xl font-bold mb-2">Quality</h3>
                <p className="text-muted-foreground">Award-winning solutions trusted by industry leaders</p>
              </SurfaceCard>
              
              <SurfaceCard className="p-6 text-center">
                <Lightbulb className="h-12 w-12 text-primary mx-auto mb-4" />
                <h3 className="text-xl font-bold mb-2">Future-Ready</h3>
                <p className="text-muted-foreground">Building tomorrow's construction technology today</p>
              </SurfaceCard>
            </div>
            
            <div className="text-center">
              <Button size="lg">Learn More About Our Mission</Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
