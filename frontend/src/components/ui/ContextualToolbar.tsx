import { cn } from '@/lib/utils';

interface Tool {
  label: string;
  action: () => void;
  helpText?: string;
  icon?: React.ReactNode;
}

interface ContextualToolbarProps {
  tools: Tool[];
  className?: string;
}

export function ContextualToolbar({ tools, className }: ContextualToolbarProps) {
  return (
    <div className={cn('flex gap-2 p-4', className)}>
      {tools.map((tool, index) => (
        <button
          key={index}
          onClick={tool.action}
          className="flex items-center gap-2 px-3 py-2 text-sm bg-secondary text-secondary-foreground rounded-md hover:bg-secondary/80 transition-colors"
          title={tool.helpText}
        >
          {tool.icon}
          {tool.label}
        </button>
      ))}
    </div>
  );
}
