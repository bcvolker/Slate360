import { cn } from '@/lib/utils';

interface SurfaceCardProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'default' | 'elevated' | 'outlined';
}

export function SurfaceCard({ 
  children, 
  className, 
  variant = 'default' 
}: SurfaceCardProps) {
  return (
    <div
      className={cn(
        'rounded-lg border bg-card text-card-foreground shadow-sm',
        {
          'shadow-md': variant === 'elevated',
          'border-2': variant === 'outlined',
        },
        className
      )}
    >
      {children}
    </div>
  );
}
