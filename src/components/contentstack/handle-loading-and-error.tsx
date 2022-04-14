import DefaultError from "./default-error";
import { ReactNode } from "react";
import Spinner from "./spinner";

interface DefaultErrorProps {
  isLoading: boolean;
  error: Error | null;
  children: ReactNode;
}
export default function HandleLoadingOrError({ children, isLoading, error }: DefaultErrorProps) {
  console.log("isLoading", isLoading);
  return error ? <DefaultError error={error} /> : isLoading ? <></> : <>{children}</>;
  // return error ? <DefaultError error={error} /> : isLoading ? <Spinner /> : <>{children}</>;
  // return <>{children}</>;
}
