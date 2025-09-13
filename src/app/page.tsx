import CleanHeader from '@/components/CleanHeader';

export default function HomePage() {
  return (
    <>
      <CleanHeader />
      <main className="container mx-auto py-32 text-center">
        <h1 className="text-5xl font-bold font-orbitron">Welcome to Slate360</h1>
        <p className="mt-4 text-lg">
          This is your new, clean, and stable foundation. We will add the complex components back now that the base is working.
        </p>
      </main>
    </>
  );
}