import DefaultError from "./default-error";
import { ReactNode } from "react";

interface DefaultErrorProps {
  isLoading: boolean;
  error: Error | null;
  children: ReactNode;
}
export default function HandleLoadingOrError({ children, isLoading, error }: DefaultErrorProps) {
  return isLoading ? <>Loading...</> : error ? <DefaultError error={error} /> : <>{children}</>;
}
