import React, { useEffect, useMemo, useState } from "react";
import Navbar from "../../layouts/navbars/Navbar";
import LoadingScreen from "../../components/LoadingScreen";
import Card from "../../components/cards/Card";
import FormInput from "../../components/forms/FormInput";
import Button from "../../components/buttons/Button";
import FormTextarea from "../../components/forms/FormTextArea";
import FormListbox from "../../components/forms/FormListBox";
import { useNavigate, useParams } from "react-router-dom";
import defaultAxios from "../../utils/DefaultAxios";
import { renderToast, validateData } from "../../utils/helper";
import useCurrentUser from "../../utils/CurrentUser";
import RoleEnum from "../../enums/Role.enum";

function HouseForm() {
  const BASE_API = process.env.REACT_APP_BASE_API;
  const params = useParams();
  const id = useMemo(() => params.id, [params]);
  const userData: any = useCurrentUser();

  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState({
    name: null,
    description: null,
    status: null,
    user_id: null,
  });

  const [errors, setErrors] = useState<any>({});

  const validationRules = useMemo(
    () => ({
      name: ["required"],
      status: ["required"],
    }),
    []
  );

  const [users, setUsers] = useState([]);
  const [status, setstatus] = useState([]);

  const fetchHouses = () => {
    if (!id) {
      return;
    }
    setIsLoading(true);
    defaultAxios
      .get(`${BASE_API}/api/v1/houses/${id}`)
      .then((res) => res.data)
      .then((data) => {
        setData(data.data);
        console.log(data.data);

        setIsLoading(false);
      })
      .catch((err) => {
        // generalErrorHandler(err);
        setIsLoading(false);
      });
  };

  const fetchUser = async () => {
    if (userData?.is_admin != RoleEnum.ADMIN) {
      return;
    }
    const response = await defaultAxios.get(`${BASE_API}/api/v1/users`);
    setUsers(response.data.data);
  };

  const fetchStatus = async () => {
    const response = await defaultAxios.get(`${BASE_API}/api/v1/enums`, {
      params: {
        type: "house_status",
      },
    });
    setstatus(response.data.data);
  };

  useEffect(() => {
    fetchHouses();
    fetchUser();
    fetchStatus();
  }, [userData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setErrors((prev: any) => ({
      ...prev,
      [name]: "",
    }));
  };

  const handleListboxChange = (name: string, value: any) => {
    setData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setErrors((prev: any) => ({
      ...prev,
      [name]: null,
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

    defaultAxios
      .request({
        url: `${BASE_API}/api/v1/houses${id ? `/${id}` : ""}`,
        method: id ? "PUT" : "POST",
        data: data,
      })
      .then((res) => res.data)
      .then((data) => {
        navigate("/admin/house");

        setIsLoading(false);

        renderToast("Data berhasil disimpan");
      })
      .catch((err) => {
        setIsLoading(false);
      });
  };

  return (
    <>
      <Navbar />
      {isLoading && <LoadingScreen />}

      <div className="mt-5 h-full p-4">
        <Card className="p-4">
          <header className="relative flex items-center justify-between">
            <div className="text-xl font-bold text-navy-700 dark:text-white">
              House
            </div>
            {/* <CardMenu /> */}
          </header>

          <div className="max-w-full">
            <form onSubmit={submitData} className="space-y-2">
              <FormInput
                label="House Name"
                name="name"
                placeholder="A1"
                value={data.name}
                onChange={handleChange}
                required
                errorMessages={errors.name}
              />
              <FormTextarea
                label="Description"
                name="description"
                value={data.description}
                placeholder="Describe your house"
                onChange={handleChange}
                errorMessages={errors.description}
              />
              <FormListbox
                label="Status"
                name="status"
                options={status}
                value={data.status}
                onChange={handleListboxChange}
                errorMessages={errors.status}
              />

              {userData?.is_admin === RoleEnum.ADMIN && (
                <FormListbox
                  label="Users"
                  name="user_id"
                  options={users}
                  value={data.user_id}
                  onChange={handleListboxChange}
                  errorMessages={errors.user_id}
                />
              )}
              <div className="space-x-2 pt-4">
                <Button text="Submit" color="primary" type="submit" />

                <Button
                  text="Back"
                  color="secondary"
                  onClick={() => navigate("/admin/house")}
                />
              </div>
            </form>
          </div>
        </Card>
      </div>
    </>
  );
}

export default HouseForm;
