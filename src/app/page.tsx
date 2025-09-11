import { CleanHeader } from '@/components/CleanHeader';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function HomePage() {
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
      </main>
    </div>
  );
}