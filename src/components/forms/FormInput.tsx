import FormControl, { IProps as IFormControl } from "./FormControl";
import Input, { InputProps as IBaseInput } from "./Input";

interface IFormInput extends IFormControl, IBaseInput {}

const FormInput = (props: IFormInput) => {
  const isError =
    typeof props.isError !== "undefined"
      ? props.isError
      : typeof props.errorMessages !== "undefined" &&
        props.errorMessages !== "" &&
        props.errorMessages !== null
      ? true
      : false;

  const baseInputProps = { ...props, isError: isError };

  return (
    <FormControl {...props}>
      <Input {...baseInputProps} />
    </FormControl>
  );
};

export default FormInput;
