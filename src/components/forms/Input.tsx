import React from "react";
import { twMerge } from "tailwind-merge";

export interface InputProps {
  id?: string;
  name: string;
  type?:
    | "text"
    | "number"
    | "email"
    | "password"
    | "date"
    | "url"
    | "datetime-local";
  placeholder?: string;
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
  value?: any;
  className?: any;
  onChange?: (e: any) => void;
  isError?: boolean;
  onKeyDown?: (e: any) => void;
}

const Input = (props: InputProps) => {
  let {
    id,
    name,
    placeholder,
    className,
    value,
    disabled,
    type,
    onChange,
    onKeyDown,
    isError,
    color,
    size,
  } = props;

  const colorClass = styles[!isError ? color ?? "bordered" : "danger"];
  const sizeClass = styles[size ?? "sm"];

  if (value && type == "datetime-local") {
    value = new Date(value).toISOString().split(".")[0];
  }

  return (
    <div>
      <input
        id={id}
        name={name}
        type={type ? type : "text"}
        placeholder={placeholder}
        value={value}
        className={twMerge(className, sizeClass, colorClass, "input w-full")}
        disabled={disabled}
        onChange={onChange}
        onKeyDown={onKeyDown}
      />
    </div>
  );
};

const styles = {
  // Sizes
  xs: "input-xs",
  sm: "input-sm",
  md: "input-md",
  lg: "lg",

  // Colors
  primary: "input-primary",
  secondary: "input-neutral",
  success: "input-success",
  info: "input-info",
  warning: "input-warning",
  danger: "input-error",
  ghost: "input-ghost",
  accent: "input-accent",
  bordered: "input-bordered",
};

export default Input;
