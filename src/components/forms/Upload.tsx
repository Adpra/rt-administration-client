export type IProps = {
  name: string;
  size?: "xs" | "sm" | "md" | "lg";
  color?:
    | "primary"
    | "secondary"
    | "success"
    | "info"
    | "warning"
    | "danger"
    | "ghost"
    | "accent"
    | "bordered";
  disabled?: boolean;
  accept?: string;
  className?: any;
  isError?: boolean;
  onChange?: (e: any) => void;
};

const Upload = (props: IProps) => {
  const { size, color, accept, disabled } = props;

  const sizeClass = styles[size ?? "sm"];
  const colorClass = styles[color ?? "danger"];
  const acceptFormat = accept ?? ".jpg,.png,.jpeg";

  return (
    <input
      type="file"
      name={props.name}
      className={`${sizeClass} ${colorClass} ${props.className} file-input w-full`}
      disabled={disabled}
      accept={acceptFormat}
      onChange={(e) => props.onChange && props.onChange(e)}
    />
  );
};

const styles = {
  // Sizes
  xs: "file-input-xs",
  sm: "file-input-sm",
  md: "file-input-md",
  lg: "file-input-lg",

  // Colors
  primary: "file-input-primary",
  secondary: "file-input-neutral",
  success: "file-input-success",
  info: "file-input-info",
  warning: "file-input-warning",
  danger: "file-input-error",
  ghost: "file-input-ghost",
  accent: "file-input-accent",
  bordered: "file-input-bordered",
};

export default Upload;
