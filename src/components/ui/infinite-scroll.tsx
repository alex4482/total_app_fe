import * as React from 'react';

interface InfiniteScrollProps {
  isLoading: boolean;
  hasMore: boolean;
  next: () => unknown;
  threshold?: number;
  root?: Element | Document | null;
  rootMargin?: string;
  reverse?: boolean;
  children?: React.ReactNode;
  centerLoader?: boolean;
  skipFirstLoad?: boolean; // New prop to control initial load
}

export default function InfiniteScroll({
  isLoading,
  hasMore,
  next,
  threshold = 1,
  root = null,
  rootMargin = '0px',
  reverse,
  children,
  centerLoader = true,
  skipFirstLoad = false, // Default to false (load initially)
}: InfiniteScrollProps) {
  const observer = React.useRef<IntersectionObserver>();
  const firstLoad = React.useRef(true); // Tracks if it's the first load

  const observerRef = React.useCallback(
    (element: HTMLElement | null) => {
      let safeThreshold = threshold;
      if (threshold < 0 || threshold > 1) {
        console.warn(
          'Threshold should be between 0 and 1. You are exceeding the range, will use default value: 1'
        );
        safeThreshold = 1;
      }

      // Skip observing if it's loading or skipping the first load
      if (isLoading || (firstLoad.current && skipFirstLoad)) return;

      if (observer.current) observer.current.disconnect();
      if (!element) return;

      observer.current = new IntersectionObserver(
        entries => {
          if (entries[0].isIntersecting && hasMore) {
            next();
          }
        },
        { threshold: safeThreshold, root, rootMargin }
      );
      observer.current.observe(element);
    },
    [hasMore, isLoading, next, threshold, root, rootMargin, skipFirstLoad]
  );

  const flattenChildren = React.useMemo(
    () => React.Children.toArray(children),
    [children]
  );

  const loaderStyle =
    firstLoad.current && centerLoader
      ? 'flex justify-center items-center h-vh-70'
      : 'flex justify-center';

  // Skip first load if the `skipFirstLoad` is true
  React.useEffect(() => {
    if (isLoading && firstLoad.current) {
      firstLoad.current = false;
    }
  }, [isLoading]);

  return (
    <div className={loaderStyle}>
      {flattenChildren.map((child, index) => {
        const isObserveTarget = reverse
          ? index === 0
          : index === flattenChildren.length - 1;
        const ref = isObserveTarget ? observerRef : null;
        return (
          <div key={index} ref={ref}>
            {child}
          </div>
        );
      })}
    </div>
  );
}
