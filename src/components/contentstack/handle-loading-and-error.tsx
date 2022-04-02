import DefaultError from "./default-error";
import { ReactNode } from "react";
import Spinner from "./spinner";

interface DefaultErrorProps {
  isLoading: boolean;
  error: Error | null;
  children: ReactNode;
}
export default function HandleLoadingOrError({ children, isLoading, error }: DefaultErrorProps) {
  return isLoading ? (
    <>
      <Spinner />
    </>
  ) : error ? (
    <DefaultError error={error} />
  ) : (
    <>{children}</>
  );
}
