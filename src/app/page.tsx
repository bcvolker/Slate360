import CleanHeader from '@/components/CleanHeader';

// We are starting with a minimal homepage to guarantee a successful build.
// We will add the complex scrolling components back in the next step.

export default function HomePage() {
  return (
    <>
      <CleanHeader />
      <main className="container mx-auto py-32 text-center">
        <h1 className="text-5xl font-bold font-orbitron">Welcome to Slate360</h1>
        <p className="mt-4 text-lg text-muted-foreground">
          This is your new, clean, and stable foundation.
        </p>
      </main>
    </>
  );
}