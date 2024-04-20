export interface IProps {
  size?: "xs" | "sm" | "md" | "lg";
  color?: "primary" | "secondary" | "success" | "info" | "warning" | "danger";
  variant?: "spinner" | "dots" | "ring" | "ball" | "bars" | "infinity";
}

const BaseLoading = ({ size, color, variant }: IProps) => {
  const sizeClass = styles[size ?? "sm"];
  const colorClass = styles[color ?? "secondary"];
  const variantClass = styles[variant ?? "spinner"];

  return (
    <span className={`loading ${sizeClass} ${colorClass} ${variantClass}`} />
  );
};

export default BaseLoading;

const styles = {
  // Size
  xs: "loading-xs",
  sm: "loading-sm",
  md: "loading-md",
  lg: "loading-lg",

  // Color
  primary: "text-primary",
  secondary: "text-neutral",
  success: "text-success",
  info: "text-info",
  warning: "text-warning",
  danger: "text-error",

  // Variant
  spinner: "loading-spinner",
  dots: "loading-dots",
  ring: "loading-ring",
  ball: "loading-ball",
  bars: "loading-bars",
  infinity: "loading-infinity",
};
