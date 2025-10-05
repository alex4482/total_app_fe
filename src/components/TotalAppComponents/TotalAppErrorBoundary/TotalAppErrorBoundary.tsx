import { ErrorBoundary, type ErrorBoundaryProps } from 'react-error-boundary';

export namespace TotalAppErrorBoundary {
  export type Props = ErrorBoundaryProps;
}

export const TotalAppErrorBoundary = (props: TotalAppErrorBoundary.Props) => {
  return (
    <ErrorBoundary
      {...props}
      onError={(error, errorInfo) => {
        props?.onError && props.onError(error, errorInfo);
      }}
    />
  );
};
