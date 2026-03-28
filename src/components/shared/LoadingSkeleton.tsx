import { cn } from "@/lib/utils";

interface SkeletonProps {
  className?: string;
}

export function Skeleton({ className }: SkeletonProps) {
  return <div className={cn("skeleton", className)} />;
}

export function StatCardSkeleton() {
  return (
    <div className="card-base p-5">
      <div className="flex items-start justify-between">
        <Skeleton className="w-10 h-10 rounded-xl" />
        <Skeleton className="w-16 h-4 rounded" />
      </div>
      <div className="mt-3 space-y-2">
        <Skeleton className="w-20 h-7 rounded" />
        <Skeleton className="w-32 h-4 rounded" />
      </div>
    </div>
  );
}

export function VendorCardSkeleton() {
  return (
    <div className="card-base p-5 space-y-3">
      <div className="flex items-start gap-3">
        <Skeleton className="w-12 h-12 rounded-xl" />
        <div className="flex-1 space-y-2">
          <Skeleton className="w-3/4 h-5 rounded" />
          <Skeleton className="w-1/2 h-4 rounded" />
        </div>
      </div>
      <Skeleton className="w-full h-4 rounded" />
      <Skeleton className="w-4/5 h-4 rounded" />
      <div className="flex gap-2">
        <Skeleton className="w-16 h-6 rounded-full" />
        <Skeleton className="w-16 h-6 rounded-full" />
        <Skeleton className="w-16 h-6 rounded-full" />
      </div>
    </div>
  );
}

export function ChatMessageSkeleton() {
  return (
    <div className="flex gap-2">
      <Skeleton className="w-7 h-7 rounded-full flex-shrink-0" />
      <div className="flex-1 space-y-2">
        <Skeleton className="w-full h-4 rounded" />
        <Skeleton className="w-3/4 h-4 rounded" />
      </div>
    </div>
  );
}

export function PlanSectionSkeleton() {
  return (
    <div className="space-y-3">
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="card-base p-4 space-y-2">
          <Skeleton className="w-1/3 h-4 rounded" />
          <Skeleton className="w-full h-5 rounded" />
        </div>
      ))}
    </div>
  );
}
