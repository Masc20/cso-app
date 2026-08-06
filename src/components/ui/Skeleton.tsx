/* Skeleton Loading Card Component matching exact ribbon polygon geometry */

/*
 * Custom Skeleton for Committee Ribbons
*/
export function RibbonSkeleton() {
  return (
    <div className="ribbon-banner relative p-[2px] rounded-t-xl animate-pulse">
      <div className="ribbon-clip w-full h-full p-[0.5px] rounded-t-xl bg-neutral-300/80 dark:bg-neutral-800/80">
        <div className="ribbon-clip w-full h-full bg-cso-card rounded-t-xl p-6 pb-16 flex flex-col items-center text-center relative overflow-hidden">
          
          {/* Top Line Accent Skeleton */}
          <div className="absolute top-0 inset-x-0 h-2.5 bg-neutral-300 dark:bg-neutral-700/80 rounded-t-xl" />

          {/* Logo Circle Skeleton */}
          <div className="mt-2 mb-3 w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-neutral-200 dark:bg-neutral-800 shrink-0" />

          {/* Intro Video Pill Skeleton */}
          <div className="mb-2 h-6 w-24 rounded-md bg-neutral-200 dark:bg-neutral-800" />

          {/* Title Skeleton */}
          <div className="h-6 w-32 rounded-md bg-neutral-300 dark:bg-neutral-700 mt-1" />

          {/* Sub-badge Skeleton */}
          <div className="h-5 w-40 rounded-md bg-neutral-200 dark:bg-neutral-800 mt-2" />

          {/* Description Lines Skeleton */}
          <div className="w-full space-y-2 mt-4 flex-1">
            <div className="h-3 w-full bg-neutral-200 dark:bg-neutral-800/80 rounded" />
            <div className="h-3 w-5/6 mx-auto bg-neutral-200 dark:bg-neutral-800/80 rounded" />
            <div className="h-3 w-4/6 mx-auto bg-neutral-200 dark:bg-neutral-800/80 rounded" />
          </div>

          {/* Skill Tag Chips Skeleton */}
          <div className="mt-4 flex flex-wrap justify-center gap-1.5 w-full">
            <div className="h-4 w-12 bg-neutral-200 dark:bg-neutral-800 rounded-md" />
            <div className="h-4 w-16 bg-neutral-200 dark:bg-neutral-800 rounded-md" />
            <div className="h-4 w-10 bg-neutral-200 dark:bg-neutral-800 rounded-md" />
          </div>

          {/* CTA Arrow Line Skeleton */}
          <div className="mt-5 pt-3 border-t border-cso w-full flex justify-center">
            <div className="h-4 w-24 bg-neutral-300 dark:bg-neutral-700 rounded-md" />
          </div>

        </div>
      </div>
    </div>
  );
}
