import { CleanHeader } from '@/components/CleanHeader';
import { Button } from '@/components/ui/button';
import { SurfaceCard } from '@/components/ui/SurfaceCard';
import Link from 'next/link';
import { CheckCircle } from 'lucide-react';

export default function HomePage() {
  const featureTiles = [
    {
      title: 'Project Hub',
      description: 'Centralize communication, documentation, and task management.',
      features: ['RFI Tracking', 'Submittal Management', 'Daily Logs', 'Task Assignment'],
    },
    {
      title: 'BIM Studio',
      description: 'View, analyze, and collaborate on 3D models in real-time.',
      features: ['Clash Detection', 'Model Viewer', 'Annotations', 'Version Control'],
    },
    {
      title: '360° Tour Builder',
      description: 'Create immersive virtual site tours for stakeholders.',
      features: ['Hotspot Linking', 'VR Mode', 'Measurement Tools', 'Progress Photos'],
    },
  ];
  return (
    <div className="flex min-h-screen flex-col">
      <CleanHeader />
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
              <div className="flex flex-col justify-center space-y-4">
                <div className="space-y-2">
                  <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
                    Build Smarter with Slate360
                  </h1>
                  <p className="max-w-[600px] text-muted-foreground md:text-xl">
                    The complete construction technology platform that transforms how you manage projects, collaborate with teams, and deliver exceptional results.
                  </p>
                </div>
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  <Link href="/dashboard">
                    <Button size="lg">Start Free Trial</Button>
                  </Link>
                  <Link href="#">
                    <Button size="lg" variant="outline">
                      Watch Demo
                    </Button>
                  </Link>
                </div>
              </div>
              <div className="flex items-center justify-center">
                {/* You can place an image or a simple graphic here */}
                <div className="h-64 w-full rounded-lg bg-secondary flex items-center justify-center">
                  <p className="text-muted-foreground">[Platform Visual Here]</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* NEW FEATURES SECTION - ADD THIS */}
        <section id="features" className="w-full py-12 md:py-24 lg:py-32 bg-muted">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">An Integrated Toolset</h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  From project planning to execution, Slate360 provides a seamless workflow to keep your projects on time and on budget.
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl items-start gap-8 sm:grid-cols-2 md:grid-cols-3 lg:gap-12 mt-12">
              {featureTiles.map((tile) => (
                <SurfaceCard key={tile.title} className="p-6 flex flex-col">
                  <h3 className="text-xl font-bold">{tile.title}</h3>
                  <p className="text-sm text-muted-foreground mt-2 flex-grow">{tile.description}</p>
                  <ul className="mt-4 space-y-2 text-sm">
                    {tile.features.map((feature) => (
                      <li key={feature} className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-primary" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </SurfaceCard>
              ))}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}