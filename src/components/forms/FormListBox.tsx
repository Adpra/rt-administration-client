import FormControl, { IProps as IFormControl } from "./FormControl";
import BaseListbox, { IProps as IBaseListbox } from "./ListBox";
import Listbox from "./ListBox";

interface IFormListbox extends IFormControl, IBaseListbox {}

const FormListbox = (props: IFormListbox) => {
  const isError =
    typeof props.isError !== "undefined"
      ? props.isError
      : typeof props.errorMessages !== "undefined" &&
        props.errorMessages !== "" &&
        props.errorMessages !== null
      ? true
      : false;

  const baseListboxProps = { ...props, isError: isError };

  return (
    <FormControl {...props}>
      <Listbox {...baseListboxProps} />
    </FormControl>
  );
};

export default FormListbox;
