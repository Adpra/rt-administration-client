import React, { useEffect, useMemo } from "react";
import useCurrentUser from "../../utils/CurrentUser";
import { useNavigate } from "react-router-dom";
import defaultAxios from "../../utils/DefaultAxios";
import { renderToast, validateData } from "../../utils/helper";
import Navbar from "../../layouts/navbars/Navbar";
import LoadingScreen from "../../components/LoadingScreen";
import Card from "../../components/cards/Card";
import FormListbox from "../../components/forms/FormListBox";
import BillingStatusType from "../../enums/BillingStatusType";
import FormInput from "../../components/forms/FormInput";
import FormTextarea from "../../components/forms/FormTextArea";
import Button from "../../components/buttons/Button";
import TransactionStatusType from "../../enums/TransactionStatusType";
import StatusEnum from "../../enums/StatusEnum";

function TransactionExpenditure() {
  const BASE_API = process.env.REACT_APP_BASE_API;

  const navigate = useNavigate();
  const [isLoading, setIsLoading] = React.useState(false);
  const [data, setData] = React.useState({
    description: null,
    amount: null,
  });

  const [errors, setErrors] = React.useState<any>({});

  const validationRules = useMemo(
    () => ({
      amount: ["required"],
      description: ["required"],
    }),
    []
  );

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
        url: `${BASE_API}/api/v1/transaction-histories`,
        method: "POST",
        data: {
          type: StatusEnum.PENGELUARAN,
          amount: data.amount,
          description: data.description,
          status: StatusEnum.LUNAS,
          house_id: null,
        },
      })
      .then((res) => res.data)
      .then((data) => {
        navigate("/admin/transaction-histories");

        setIsLoading(false);

        renderToast("Pengeluaran pembayaran berhasil disimpan");
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
              Expenditure
            </div>
            {/* <CardMenu /> */}
          </header>

          <div className="max-w-full">
            <form onSubmit={submitData} className="space-y-2">
              <FormListbox
                label="Type"
                name="type"
                options={TransactionStatusType}
                value={12}
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
                placeholder="Describe your house"
                onChange={handleChange}
                errorMessages={errors.description}
              />

              <div className="space-x-2 pt-4">
                <Button text="Submit" color="primary" type="submit" />

                <Button
                  text="Back"
                  color="secondary"
                  onClick={() => navigate("/admin/transaction-histories")}
                />
              </div>
            </form>
          </div>
        </Card>
      </div>
    </>
  );
}

export default TransactionExpenditure;
