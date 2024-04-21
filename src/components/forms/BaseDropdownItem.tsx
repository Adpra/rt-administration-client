import { Menu } from "@headlessui/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { IconDefinition } from "@fortawesome/free-solid-svg-icons";

interface IProps {
  label: string;
  icon?: IconDefinition;
  size?: "xs" | "sm" | "md" | "lg";
  color?: "secondary" | "primary" | "success" | "warning" | "danger" | "info";
  onClick?: any;
  value?: any;
}

const BaseDropdownItem = (props: IProps) => {
  const colorClass = styles[props.color ?? "primary"];

  const sizeClass = styles[props.size ?? "sm"];

  const currentProps: any = {};

  if (props.onClick) {
    currentProps["onClick"] = (event: any) => props.onClick(event);
  }

  return (
    <div className="p-1">
      <Menu.Item>
        {({ active }) => (
          <button
            value={props.value}
            {...currentProps}
            className={`flex w-full items-center ${sizeClass} ${
              active ? colorClass : "text-gray-900"
            }`}
          >
            {props.icon ? (
              <FontAwesomeIcon
                icon={props.icon}
                className="mr-2 inline-block"
              />
            ) : null}
            <span>{props.label}</span>
          </button>
        )}
      </Menu.Item>
    </div>
  );
};

export default BaseDropdownItem;

const styles = {
  // Sizes
  xs: "rounded-md p-1 py-1 text-xs",
  sm: "rounded-md p-1.5 text-sm",
  md: "rounded-md p-2 text-sm",
  lg: "rounded-lg p-2.5 text-base",

  // Colors
  primary:
    "border-primary-content bg-primary hover:border-primary-content hover:bg-primary",
  success:
    "border-green-400 bg-green-500 hover:border-green-500 hover:bg-green-600",
  info: "border-cyan-400 bg-cyan-500 hover:border-cyan-500 hover:bg-cyan-600",
  secondary:
    "border-gray-400 bg-gray-500 hover:border-gray-500 hover:bg-gray-600",
  warning:
    "border-yellow-400 bg-yellow-500 hover:border-yellow-500 hover:bg-yellow-600",
  danger: "border-red-400 bg-red-500 hover:border-red-500 hover:bg-red-600",

  // Variant
  bordered: "border",
};
