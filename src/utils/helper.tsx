import Swal, { SweetAlertIcon, SweetAlertPosition } from "sweetalert2";

export const imageToBase64 = (file?: any) => {
  return new Promise((resolve, reject) => {
    if (!file) {
      reject("No file provided");
      return;
    }

    const reader = new FileReader();

    reader.onload = function (event: any) {
      const base64 = event.target.result;
      resolve(base64);
    };

    reader.onerror = function (event) {
      reject("Error reading file");
    };

    reader.readAsDataURL(file);
  });
};

export const getElementValue = (
  e: React.ChangeEvent<HTMLInputElement>,
  data: any
) => {
  const { name, value, type, classList } = e.target;

  if (type === "checkbox" && classList.contains("toggle")) {
    return e.target.checked;
  }

  if (type === "checkbox" && classList.contains("checkbox")) {
    const obj: any = { ...data };

    if (!obj[name].includes(value)) {
      return [...obj[name], value];
    }

    const arrVal = [...obj[name]];

    let index = arrVal.indexOf(value);

    if (index !== -1) {
      arrVal.splice(index, 1);
    }

    return arrVal;
  }

  if (classList.contains("integer")) {
    return parseInt(value);
  }

  return value;
};

const validationMessages = (
  rule: string,
  name: string,
  otherField: string = ""
) => {
  if (rule === "required") {
    return `${name} is required`;
  }

  if (rule === "email") {
    return `${name} format is not valid`;
  }

  if (rule === "same") {
    return `${name} must be same as ${otherField}`;
  }
};

const isEmpty = (value: any) => {
  return (
    typeof value === "undefined" ||
    value === null ||
    value === "" ||
    String(value).trim() === ""
  );
};

export const validateData = (data: any, validationRules: any) => {
  const messages: any = {};

  for (const key in validationRules) {
    for (const rule of validationRules[key]) {
      if (rule === "required" && isEmpty(data[key])) {
        if (messages[key]) {
          messages[key].push(validationMessages(rule, key));
        } else {
          messages[key] = [validationMessages(rule, key)];
        }
      }

      if (rule === "email") {
        const re =
          /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;

        if (!re.test(data[key])) {
          if (messages[key]) {
            messages[key].push(validationMessages(rule, key));
          } else {
            messages[key] = [validationMessages(rule, key)];
          }
        }
      }

      if (rule.includes("same:")) {
        const field = rule.replace("same:", "");

        if (data[key] !== data[field]) {
          if (messages[key]) {
            messages[key].push(validationMessages("same", key, field));
          } else {
            messages[key] = [validationMessages("same", key, field)];
          }
        }
      }
    }
  }

  return { messages };
};

export const renderToast = (
  title = "",
  icon: SweetAlertIcon = "success",
  position: SweetAlertPosition = "top-end"
) => {
  return Swal.fire({
    icon: icon,
    title: title,
    toast: true,
    position: position,
    showConfirmButton: false,
    timer: 5000,
  });
};

export const renderConfirmationModal = (title = "Are you sure?", text = "") => {
  return Swal.fire({
    title: title,
    text: text,
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "rgb(234 179 8)",
    cancelButtonColor: "rgb(156 163 175)",
    confirmButtonText: "Yes",
  });
};
