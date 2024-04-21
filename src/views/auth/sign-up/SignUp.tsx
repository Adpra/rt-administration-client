import React, { useMemo, useState } from "react";
import Button from "../../../components/buttons/Button";
import { Link } from "react-router-dom";
import Card from "../../../components/cards/Card";
import Navbar from "../../../layouts/navbars/Navbar";
import FormInput from "../../../components/forms/FormInput";
import { renderToast, validateData } from "../../../utils/helper";
import axios from "axios";
import Swal from "sweetalert2";
import LoadingScreen from "../../../components/LoadingScreen";

interface IProps {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
}

function SignUp() {
  const BASE_API = process.env.REACT_APP_BASE_API;
  const [data, setData] = React.useState<IProps>({
    name: "",
    email: "",
    password: "",
    password_confirmation: "",
  });

  const [isLoading, setIsLoading] = useState(false);

  const [errors, setErrors] = React.useState<any>({});

  const validationRules = useMemo(
    () => ({
      name: ["required"],
      email: ["required", "email"],
      password: ["required"],
      password_confirmation: ["required", "same:password"],
    }),
    []
  );

  const handelChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setData({ ...data, [e.target.name]: e.target.value });

    setData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));

    setErrors((prev: any) => ({
      ...prev,
      [e.target.name]: "",
    }));
  };
  const submitData = (e: React.FormEvent) => {
    e.preventDefault();

    const { messages } = validateData(data, validationRules);

    if (Object.keys(messages).length > 0) {
      setErrors(messages);
      return;
    }
    setIsLoading(true);

    axios
      .post(`${BASE_API}/api/v1/register`, data)
      .then((res) => res.data)
      .then((data) => {
        localStorage.setItem("access_token", data.access_token);
        window.location.href = "/admin/home";
        setIsLoading(false);
      })
      .catch((error) => {
        renderToast(error.response.data.message);

        setIsLoading(false);
      });
  };
  return (
    <>
      {isLoading && <LoadingScreen />}
      <Navbar />
      <div className="flex h-screen flex-col items-center justify-center">
        <Card className="p-6 w-96">
          <form onSubmit={submitData} className="space-y-2">
            <h1 className="mb-5 text-3xl font-bold">Sign Up</h1>,
            <FormInput
              id="name"
              name="name"
              label="name"
              placeholder="name"
              required={true}
              onChange={handelChange}
              errorMessages={errors.name}
            />
            <FormInput
              id="email"
              name="email"
              label="Email"
              placeholder="Email"
              required={true}
              onChange={handelChange}
              errorMessages={errors.email}
            />
            <FormInput
              id="password"
              name="password"
              placeholder="Password"
              label="Password"
              required={true}
              onChange={handelChange}
              errorMessages={errors.password}
              type="password"
            />
            <FormInput
              id="password_confirmation"
              name="password_confirmation"
              label="Confirm Password"
              placeholder="Confirm Password"
              className={"mb-5"}
              required={true}
              onChange={handelChange}
              errorMessages={errors.password_confirmation}
              type="password"
            />
            <Button text="Sign up" className="w-full" type="submit" />
            <div className="space-x-1 my-1">
              <span className="space-x-1 text-sm">
                Already have an account?
              </span>
              <span className="text-sm">
                <Link to="/auth/sign-in">Login</Link>
              </span>
            </div>
          </form>
        </Card>
      </div>
    </>
  );
}

export default SignUp;
