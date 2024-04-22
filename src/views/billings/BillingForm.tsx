import React, { useEffect, useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import useCurrentUser from "../../utils/CurrentUser";
import defaultAxios from "../../utils/DefaultAxios";
import RoleEnum from "../../enums/Role.enum";
import { renderToast, validateData } from "../../utils/helper";
import Navbar from "../../layouts/navbars/Navbar";
import LoadingScreen from "../../components/LoadingScreen";
import Card from "../../components/cards/Card";
import FormInput from "../../components/forms/FormInput";
import FormTextarea from "../../components/forms/FormTextArea";
import FormListbox from "../../components/forms/FormListBox";
import Button from "../../components/buttons/Button";
import BillingStatusType from "../../enums/BillingStatusType";

function BillingForm() {
  const BASE_API = process.env.REACT_APP_BASE_API;
  const params = useParams();
  const id = useMemo(() => params.id, [params]);
  const userData: any = useCurrentUser();

  const navigate = useNavigate();
  const [isLoading, setIsLoading] = React.useState(false);
  const [data, setData] = React.useState({
    type: null,
    description: null,
    amount: null,
    status: null,
  });

  const [errors, setErrors] = React.useState<any>({});

  const validationRules = useMemo(
    () => ({
      amount: ["required"],
      status: ["required"],
    }),
    []
  );

  const [status, setstatus] = React.useState([]);

  const fetchBillings = () => {
    if (!id) {
      return;
    }
    setIsLoading(true);
    defaultAxios
      .get(`${BASE_API}/api/v1/billings/${id}`)
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

  const fetchStatus = async () => {
    const response = await defaultAxios.get(`${BASE_API}/api/v1/enums`, {
      params: {
        type: "billing_status",
      },
    });
    setstatus(response.data.data);
  };

  useEffect(() => {
    fetchBillings();
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
        url: `${BASE_API}/api/v1/billings${id ? `/${id}` : ""}`,
        method: id ? "PUT" : "POST",
        data: data,
      })
      .then((res) => res.data)
      .then((data) => {
        navigate("/admin/billings");

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
              Billing
            </div>
            {/* <CardMenu /> */}
          </header>

          <div className="max-w-full">
            <form onSubmit={submitData} className="space-y-2">
              <FormListbox
                label="Type"
                name="type"
                options={BillingStatusType}
                value={10}
              />

              <FormInput
                label="Amount"
                name="amount"
                placeholder="100000"
                value={data.amount}
                onChange={handleChange}
                required
                errorMessages={errors.amount}
                type="number"
              />
              <FormTextarea
                label="Description"
                name="description"
                value={data.description}
                placeholder="Describe your bill"
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

              <div className="space-x-2 pt-4">
                <Button text="Submit" color="primary" type="submit" />

                <Button
                  text="Back"
                  color="secondary"
                  onClick={() => navigate("/admin/billings")}
                />
              </div>
            </form>
          </div>
        </Card>
      </div>
    </>
  );
}

export default BillingForm;
