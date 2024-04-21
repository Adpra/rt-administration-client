import FormControl, { IProps as IFormControl } from "./FormControl";
import TextArea, { TextAreaProps } from "./Textarea";

interface IFormTextarea extends IFormControl, TextAreaProps {}

const FormTextarea = (props: IFormTextarea) => {
  const isError =
    typeof props.isError !== "undefined"
      ? props.isError
      : typeof props.errorMessages !== "undefined" &&
        props.errorMessages !== "" &&
        props.errorMessages !== null
      ? true
      : false;

  const baseTextareaProps = { ...props, isError: isError };

  return (
    <FormControl {...props}>
      <TextArea {...baseTextareaProps} />
    </FormControl>
  );
};

export default FormTextarea;
