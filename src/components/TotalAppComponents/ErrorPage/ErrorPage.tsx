import { CircleAlert } from 'lucide-react';

import { Button } from '@/components/ui/button';

export namespace ErrorPage {
  export type Props = {
    title: string;
    actionLabel?: string;
    onAction?: () => void;
  };
}

export const ErrorPage = ({
  title,
  actionLabel,
  onAction,
}: ErrorPage.Props) => {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center">
      <CircleAlert className="h-12 w-12 text-red" />
      <h1 className="my-2 text-2xl font-semibold">{title}</h1>
      {actionLabel && onAction && (
        <Button onClick={onAction}>{actionLabel}</Button>
      )}
    </div>
  );
};
