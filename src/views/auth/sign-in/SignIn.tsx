import React, { useMemo, useState } from "react";
import Button from "../../../components/buttons/Button";
import Card from "../../../components/cards/Card";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../../../layouts/navbars/Navbar";
import FormInput from "../../../components/forms/FormInput";
import { validateData } from "../../../utils/helper";
import axios from "axios";
import Swal from "sweetalert2";
import LoadingScreen from "../../../components/LoadingScreen";

interface IProps {
  email: string;
  password: string;
}

function SignIn() {
  const BASE_API = process.env.REACT_APP_BASE_API;
  const [data, setData] = React.useState<IProps>({
    email: "",
    password: "",
  });

  // const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const [errors, setErrors] = useState<any>({});

  const validationRules = useMemo(
    () => ({
      email: ["required"],
      password: ["required"],
    }),
    // eslint-disable-next-line
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
      .post(`${BASE_API}/api/v1/login`, data)
      .then((res) => res.data)
      .then((data) => {
        localStorage.setItem("access_token", data.access_token);
        window.location.href = "/admin/home";
        // navigate("/home");

        setIsLoading(false);
      })
      .catch((error) => {
        Swal.fire({
          position: "top",
          icon: "error",
          title: "Error. .",
          text: error.response.data.message,
          toast: true,
          showConfirmButton: false,
          timer: 2000,
          timerProgressBar: true,
        });

        setIsLoading(false);
      });
  };

  return (
    <>
      {isLoading && <LoadingScreen />}
      <Navbar />
      <div className="flex h-screen flex-col items-center justify-center">
        <Card className="p-6">
          <h1 className="mb-5 text-3xl font-bold">Sign in</h1>,
          <form onSubmit={submitData} className="space-y-2">
            <FormInput
              id="email"
              name="email"
              label="email"
              placeholder="email"
              required={true}
              onChange={handelChange}
              errorMessages={errors.email}
            />
            <FormInput
              id="password"
              name="password"
              label="Password"
              placeholder="Password"
              className={"mb-5"}
              type="password"
              required={true}
              onChange={handelChange}
              errorMessages={errors.password}
            />
            <Button text="Sign in" className="w-full" type="submit" />
          </form>
          <div className="space-x-1 my-1">
            <span className="space-x-1 text-sm">
              You don't have an account?
            </span>
            <span className="text-sm">
              <Link to="/auth/sign-up">Register</Link>
            </span>
          </div>
        </Card>
      </div>
    </>
  );
}

export default SignIn;
