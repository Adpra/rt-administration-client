import { Menu, Transition } from "@headlessui/react";
import { Fragment } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown } from "@fortawesome/free-solid-svg-icons";
import { twMerge } from "tailwind-merge";

interface IProps {
  label: string;
  children?: string | React.ReactNode;
  size?: "xs" | "sm" | "md" | "lg";
  color?: "secondary" | "primary" | "success" | "warning" | "danger" | "info";
  className?: string;
}

const BaseDropdown = (props: IProps) => {
  const colorClass = styles[props.color ?? "primary"];

  const sizeClass = styles[props.size ?? "sm"];

  return (
    <div className="w-fit">
      <Menu
        as="div"
        className={twMerge("relative inline-block text-left", props.className)}
      >
        <div>
          <Menu.Button
            className={`inline-flex w-full items-center justify-center focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 ${colorClass} ${sizeClass}`}
          >
            {props.label}
            <FontAwesomeIcon icon={faChevronDown} className="ml-3" />
          </Menu.Button>
        </div>
        <Transition
          as={Fragment}
          enter="transition ease-out duration-100"
          enterFrom="transform opacity-0 scale-95"
          enterTo="transform opacity-100 scale-100"
          leave="transition ease-in duration-75"
          leaveFrom="transform opacity-100 scale-100"
          leaveTo="transform opacity-0 scale-95"
        >
          <Menu.Items className="border-slate-300 ring-black absolute right-0 z-10 mt-2 w-56 origin-top-right divide-y divide-gray-100 rounded-md border bg-white shadow-lg ring-1 ring-opacity-5 focus:outline-none">
            {props.children}
          </Menu.Items>
        </Transition>
      </Menu>
    </div>
  );
};

export default BaseDropdown;

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
