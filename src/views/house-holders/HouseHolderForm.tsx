import React, { useEffect, useMemo, useState } from "react";
import Navbar from "../../layouts/navbars/Navbar";
import { useNavigate, useParams } from "react-router-dom";
import useCurrentUser from "../../utils/CurrentUser";
import LoadingScreen from "../../components/LoadingScreen";
import Card from "../../components/cards/Card";
import FormInput from "../../components/forms/FormInput";
import FormTextarea from "../../components/forms/FormTextArea";
import FormListbox from "../../components/forms/FormListBox";
import Button from "../../components/buttons/Button";
import RoleEnum from "../../enums/Role.enum";
import FormUpload from "../../components/forms/FormUpload";
import defaultAxios from "../../utils/DefaultAxios";
import {
  getElementValue,
  imageToBase64,
  renderToast,
  validateData,
} from "../../utils/helper";
import { ZoomableImg } from "../../utils/ZoomableImg";

function HouseHolderForm() {
  const BASE_API = process.env.REACT_APP_BASE_API;
  const params = useParams();
  const id = useMemo(() => params.id, [params]);
  const userData: any = useCurrentUser();

  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState({
    name: null,
    photo_ktp: null,
    status: null,
    marital_status: null,
    phone: null,
    house_id: null,
  });

  const [errors, setErrors] = useState<any>({});

  const validationRules = useMemo(
    () => ({
      name: ["required"],
      marital_status: ["required"],
      phone: ["required"],
      status: ["required"],
    }),
    []
  );
  const [houses, setHouses] = useState([]);
  const [status, setstatus] = useState([]);
  const fetchHouseHolders = () => {
    if (!id) {
      return;
    }
    setIsLoading(true);
    defaultAxios
      .get(`${BASE_API}/api/v1/householders/${id}`)
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

  const fetchHouses = () => {
    defaultAxios
      .get(`${BASE_API}/api/v1/houses`)
      .then((res) => {
        setHouses(res.data.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const fetchStatus = async () => {
    const response = await defaultAxios.get(`${BASE_API}/api/v1/enums`, {
      params: {
        type: "householder_status",
      },
    });
    setstatus(response.data.data);
  };

  useEffect(() => {
    fetchStatus();
    fetchHouses();
    fetchHouseHolders();
  }, [userData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, files } = e.target;

    if (files?.length) {
      imageToBase64(files[0])
        .then((base64: any) => {
          setData((prev) => ({
            ...prev,
            [name]: base64,
          }));

          setErrors((prev: any) => ({
            ...prev,
            [name]: "",
          }));
        })
        .catch((error) => {
          console.error(error);
        });

      return;
    }

    const value: any = getElementValue(e, data);

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
        url: `${BASE_API}/api/v1/householders${id ? `/${id}` : ""}`,
        method: id ? "PUT" : "POST",
        data: data,
      })
      .then((res) => res.data)
      .then((data) => {
        navigate("/admin/house-holders");

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
              House Holder
            </div>
            {/* <CardMenu /> */}
          </header>

          <div className="max-w-full">
            <form onSubmit={submitData} className="space-y-2">
              <FormInput
                label="Name"
                name="name"
                placeholder="Bambang Sugeni"
                value={data.name}
                onChange={handleChange}
                required
                errorMessages={errors.name}
              />

              <ZoomableImg src={data.photo_ktp} />

              <FormUpload
                label="Photo KTP"
                name="photo_ktp"
                onChange={handleChange}
                errorMessages={errors.photo_ktp}
              />
              <FormInput
                label="Status Pernikahan"
                name="marital_status"
                placeholder="Belum Menikah"
                value={data.marital_status}
                onChange={handleChange}
                required
                errorMessages={errors.marital_status}
              />

              <FormInput
                label="Phone"
                name="phone"
                placeholder="08122334455"
                value={data.phone}
                onChange={handleChange}
                required
                errorMessages={errors.phone}
              />
              <FormListbox
                label="Status"
                name="status"
                options={status}
                value={data.status}
                onChange={handleListboxChange}
                errorMessages={errors.status}
                required
              />

              {userData?.is_admin === RoleEnum.ADMIN && (
                <FormListbox
                  label="House Number"
                  name="house_id"
                  options={houses}
                  value={data.house_id}
                  onChange={handleListboxChange}
                  errorMessages={errors.house_id}
                />
              )}

              <div className="space-x-2 pt-4">
                <Button text="Submit" color="primary" type="submit" />

                <Button
                  text="Back"
                  color="secondary"
                  onClick={() => navigate("/admin/house-holders")}
                />
              </div>
            </form>
          </div>
        </Card>
      </div>
    </>
  );
}

export default HouseHolderForm;
