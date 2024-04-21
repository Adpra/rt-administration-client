import { Fragment, useEffect, useState } from "react";
import { Listbox as HeadlessListbox, Transition } from "@headlessui/react";
import { CheckIcon } from "@heroicons/react/20/solid";

interface IOption {
  id?: any;
  name?: any;
  unavailable?: boolean;
}

export type IProps = {
  name: string;
  options?: IOption[];
  multiple?: boolean;
  value?: any;
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
  isError?: boolean;
  onChange?: (name: string, value: any) => void;
  hasCheckIcon?: boolean;
};

export default function Listbox(props: IProps) {
  const sizeClass = styles[props.size ?? "sm"];

  const colorClass = styles[props.color ?? "primary"];
  const useCheckIcon =
    typeof props.hasCheckIcon !== "undefined" ? props.hasCheckIcon : true;
  const isMultiple = props?.multiple;

  const [selectedOption, setSelectedOption] = useState<any[] | any>(
    isMultiple ? [] : null
  );

  useEffect(() => {
    if (props.options) {
      if (isMultiple && props.value.length > 0) {
        const newValues = props.options.filter((option) =>
          props.value.includes(option.id)
        );

        setSelectedOption(newValues || []);
      }

      if (!isMultiple && props.value) {
        const newValue = props.options.find(
          (option) => option.id === props.value
        );

        setSelectedOption(newValue || null);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.options]);

  const handleChange = (value: any) => {
    setSelectedOption(value);
    const ids = props.multiple ? value.map((val: any) => val.id) : value.id;
    if (props.onChange) {
      props.onChange(props.name, ids);
    }
  };

  return (
    <HeadlessListbox
      value={selectedOption}
      onChange={handleChange}
      multiple={props.multiple}
    >
      <div className="relative mt-1">
        <HeadlessListbox.Button
          className={`${colorClass} ${sizeClass} select relative flex w-full items-center`}
        >
          <span className="block truncate">
            {props.multiple
              ? selectedOption?.map((person: any) => person.name).join(", ")
              : selectedOption?.name}
          </span>
        </HeadlessListbox.Button>

        <Transition
          as={Fragment}
          leave="transition ease-in duration-100"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <HeadlessListbox.Options className="ring-black absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-opacity-5 focus:outline-none sm:text-sm">
            {props.options?.map((option) => (
              <HeadlessListbox.Option
                key={option.id}
                value={option}
                disabled={option.unavailable}
                className={({ active }) =>
                  `relative cursor-default select-none px-4 py-2 ${
                    active ? "bg-amber-100 text-amber-900" : "text-gray-900"
                  }`
                }
              >
                {({ selected }) => (
                  <>
                    <span
                      className={`block truncate 
                      ${selected ? " font-medium" : "font-normal"} 
                      ${useCheckIcon ? "pl-6" : ""}`}
                    >
                      {option.name}
                    </span>
                    {selected && useCheckIcon ? (
                      <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-amber-600">
                        <CheckIcon className="h-5 w-5" aria-hidden="true" />
                      </span>
                    ) : null}
                  </>
                )}
              </HeadlessListbox.Option>
            ))}
          </HeadlessListbox.Options>
        </Transition>
      </div>
    </HeadlessListbox>
  );
}

const styles: Record<string, string> = {
  // Sizes
  xs: "select-xs",
  sm: "select-sm",
  md: "select-md",
  lg: "select-lg",

  // Colors
  primary: "select-primary",
  secondary: "select-secondary",
  info: "select-info",
  warning: "select-warning",
  positive: "select-success",
  negative: "select-error",
  ghost: "select-ghost",
  bordered: "select-bordered",
  accent: "select-accent",
};
