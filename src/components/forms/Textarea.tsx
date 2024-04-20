import { ChangeEvent } from "react";
import { twMerge } from "tailwind-merge";

interface TextAreaProps {
  placeholder?: string;
  size?: "xs" | "sm" | "md" | "lg";
  color?:
    | "primary"
    | "secondary"
    | "info"
    | "warning"
    | "positive"
    | "negative"
    | "ghost"
    | "accent"
    | "bordered";
  className?: string;
  disabled?: boolean;
  id?: string;
  name: string;
  onChange?: (e: ChangeEvent<HTMLTextAreaElement>) => void;
  onKeyDown?: (e: any) => void;
}

const DEFAULT_SIZE = "sm";
const DEFAULT_COLOR = "bordered";

const TextArea = (props: TextAreaProps) => {
  const {
    name,
    id,
    size,
    color,
    placeholder,
    className,
    disabled,
    onChange,
    onKeyDown,
  } = props;

  const sizeClass = styles[size ?? DEFAULT_SIZE];
  const colorClass = styles[color ?? DEFAULT_COLOR];
  return (
    <div>
      <textarea
        className={twMerge("textarea w-full", sizeClass, colorClass, className)}
        name={name}
        id={id ?? name}
        disabled={disabled}
        onChange={onChange}
        onKeyDown={onKeyDown}
        placeholder={placeholder}
      ></textarea>
    </div>
  );
};

const styles = {
  // Sizes
  xs: "textarea-xs",
  sm: "textarea-sm",
  md: "textarea-md",
  lg: "textarea-lg",

  // Colors
  primary: "textarea-primary",
  secondary: "textarea-secondary",
  info: "textarea-info",
  warning: "textarea-warning",
  positive: "textarea-success",
  negative: "textarea-error",
  ghost: "textarea-ghost",
  bordered: "textarea-bordered",
  accent: "textarea-accent",
};

export default TextArea;
