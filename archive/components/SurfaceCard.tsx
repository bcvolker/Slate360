import * as React from "react";
import { cn } from "@/lib/utils";

const SurfaceCard = React.forwardRef<
  HTMLDivElement, 
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "rounded-lg border bg-card text-card-foreground shadow-sm",
      className
    )}
    {...props}
  />
));
SurfaceCard.displayName = "SurfaceCard";

// MOVED TO archive/components/SurfaceCard.tsx
// export { SurfaceCard };