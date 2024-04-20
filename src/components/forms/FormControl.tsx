export interface IProps {
  label?: string;
  required?: boolean;
  helperText?: string;
  errorMessages?: any;
  bottomRightLabel?: any;
  topRightLabel?: any;
  children?: any;
  showAllErrorMessages?: boolean;
}

const FormControl = (props: IProps) => {
  const {
    label,
    helperText,
    errorMessages,
    required,
    bottomRightLabel,
    topRightLabel,
    children,
  } = props;

  const isStringErrorMessage =
    typeof errorMessages === "string" && errorMessages.trim() !== "";

  const isArrayErrorMessages =
    Array.isArray(errorMessages) && errorMessages[0].trim() !== "";

  const isError = isStringErrorMessage || isArrayErrorMessages;

  const renderTopLabel = () => {
    if (!label && !topRightLabel) {
      return "";
    }

    return (
      <label className="label">
        <span className="label-text text-gray-800">
          {label}
          {required ? <span className="text-red-600"> *</span> : ""}
        </span>
        <span className="label-text-alt">{topRightLabel}</span>
      </label>
    );
  };

  const renderLabel = () => {
    if (!isError) {
      return helperText;
    }

    if (props.showAllErrorMessages && isArrayErrorMessages) {
      return errorMessages.map((errorMessage) => {
        return <div>{errorMessage}</div>;
      });
    }

    if (!props.showAllErrorMessages && isArrayErrorMessages) {
      return errorMessages[0];
    }

    if (isStringErrorMessage) {
      return errorMessages;
    }
  };

  const renderBottomLabel = () => {
    if (!isError && !helperText && !bottomRightLabel) {
      return "";
    }

    return (
      <label className="label">
        <span className={`label-text-alt ${isError ? "text-red-600" : ""}`}>
          {renderLabel()}
        </span>
        <span className="label-text-alt">{bottomRightLabel}</span>
      </label>
    );
  };

  return (
    <div className="form-control w-full">
      {renderTopLabel()}

      {children}

      {renderBottomLabel()}
    </div>
  );
};

export default FormControl;
