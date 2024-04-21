import FormControl, { IProps as IFormControl } from "./FormControl";
import Upload, { IProps as IBaseUpload } from "./Upload";

interface IFormUpload extends IFormControl, IBaseUpload {}

const FormUpload = (props: IFormUpload) => {
  const isError =
    typeof props.isError !== "undefined"
      ? props.isError
      : typeof props.errorMessages !== "undefined" &&
        props.errorMessages !== "" &&
        props.errorMessages !== null
      ? true
      : false;

  const baseUploadProps = { ...props, isError: isError };

  return (
    <FormControl {...props}>
      <Upload {...baseUploadProps} />
    </FormControl>
  );
};

export default FormUpload;
