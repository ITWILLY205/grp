import type { ReactNode } from "react";

interface StatCardProps {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
  change?: string;
  changeType?: "up" | "down" | "neutral";
  color?: string;
}

export function StatCard({ icon: Icon, label, value, change, changeType = "neutral", color = "bg-primary/10 text-primary" }: StatCardProps) {
  const [bgColor, textColor] = color.split(" ");
  return (
    <div className="rounded-2xl border border-border bg-card p-5">
      <div className="flex items-center justify-between">
        <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${color}`}>
          <Icon className="h-5 w-5" />
        </div>
        {change && (
          <span
            className={`text-xs font-semibold ${
              changeType === "up"
                ? "text-chart-5"
                : changeType === "down"
                ? "text-destructive"
                : "text-muted-foreground"
            }`}
          >
            {change}
          </span>
        )}
      </div>
      <div className="mt-4">
        <p className="text-2xl font-bold">{value}</p>
        <p className="mt-1 text-sm text-muted-foreground">{label}</p>
      </div>
    </div>
  );
}

interface DataTableProps {
  headers: string[];
  children: ReactNode;
}

export function DataTable({ headers, children }: DataTableProps) {
  return (
    <div className="overflow-x-auto rounded-2xl border border-border bg-card">
      <table className="w-full">
        <thead>
          <tr className="border-b border-border">
            {headers.map((h) => (
              <th key={h} className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-border">{children}</tbody>
      </table>
    </div>
  );
}

export function PageHeader({ title, description, action }: { title: string; description?: string; action?: ReactNode }) {
  return (
    <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 className="text-2xl font-bold tracking-tight lg:text-3xl">{title}</h1>
        {description && <p className="mt-1 text-sm text-muted-foreground">{description}</p>}
      </div>
      {action && <div>{action}</div>}
    </div>
  );
}

export function Badge({ children, variant = "default" }: { children: ReactNode; variant?: "default" | "success" | "warning" | "danger" }) {
  const styles = {
    default: "bg-secondary text-secondary-foreground",
    success: "bg-chart-5/15 text-chart-5",
    warning: "bg-accent/15 text-accent",
    danger: "bg-destructive/15 text-destructive",
  };
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${styles[variant]}`}>
      {children}
    </span>
  );
}
