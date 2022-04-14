import LoadingSpin, { LoadingSpinProps } from "react-loading-spin";

export default function Spinner({ ...props }: LoadingSpinProps) {
  return (
    <div style={{ padding: 10 }}>
      <LoadingSpin
        animationDuration={props.animationDuration ?? "2s"}
        width={props.width ?? "10px"}
        animationTimingFunction={props.animationTimingFunction ?? "ease-in-out"}
        animationDirection={props.animationDirection ?? "alternate"}
        size={props.size ?? "10px"}
        primaryColor={props.primaryColor ?? "yellow"}
        secondaryColor={props.secondaryColor ?? "#333"}
        numberOfRotationsInAnimation={props.numberOfRotationsInAnimation ?? 2}
      />
    </div>
  );
}
