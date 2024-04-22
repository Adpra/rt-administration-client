import React, { useEffect, useMemo } from "react";
import Navbar from "../../layouts/navbars/Navbar";
import Card from "../../components/cards/Card";
import FormInput from "../../components/forms/FormInput";
import Button from "../../components/buttons/Button";
import { useNavigate, useParams } from "react-router-dom";
import useCurrentUser from "../../utils/CurrentUser";
import LoadingScreen from "../../components/LoadingScreen";
import defaultAxios from "../../utils/DefaultAxios";
import {
  renderConfirmationModal,
  renderToast,
  validateData,
} from "../../utils/helper";
import FormListbox from "../../components/forms/FormListBox";
import FormTextarea from "../../components/forms/FormTextArea";
import StatusEnum from "../../enums/StatusEnum";

function TransactionPay() {
  const BASE_API = process.env.REACT_APP_BASE_API;
  const params = useParams();
  const id = useMemo(() => params.id, [params]);
  const userData: any = useCurrentUser();
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = React.useState(false);
  const [data, setData] = React.useState({
    type: null,
    amount: null,
    status: null,
    type_name: null,
    status_name: null,
    description: null,
    householder_id: null,
  });

  const [errors, setErrors] = React.useState<any>({});

  const validationRules = useMemo(
    () => ({
      householder_id: ["required"],
      type: ["required"],
    }),
    []
  );

  const [typeEnum, setTypeEnum] = React.useState([]);
  const [householder, setHouseholder] = React.useState([]);
  const [filteredPaymentTypes, setFilteredPaymentTypes] = React.useState([]);

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

        setIsLoading(false);
      })
      .catch((err) => {
        // generalErrorHandler(err);
        setIsLoading(false);
      });
  };

  const fetchType = async () => {
    const response = await defaultAxios.get(`${BASE_API}/api/v1/enums`, {
      params: {
        type: "type_transaction",
      },
    });
    setTypeEnum(response.data.data);
  };

  const fetchHouseHolder = async () => {
    const response = await defaultAxios.get(`${BASE_API}/api/v1/householders`);
    setHouseholder(response.data.data);
  };

  useEffect(() => {
    fetchBillings();
    fetchType();
    fetchHouseHolder();
  }, [userData]);

  useEffect(() => {
    if (data.status != 8) {
      setFilteredPaymentTypes(typeEnum.filter((type: any) => type.id === 10));
    } else {
      setFilteredPaymentTypes(typeEnum);
    }
  }, [data.status, typeEnum]);

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

  const submitData = async (e: React.FormEvent) => {
    e.preventDefault();

    const { isConfirmed } = await renderConfirmationModal();

    if (!isConfirmed) {
      return;
    }

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
          type: data.type,
          amount:
            data.type === StatusEnum.TAHUNAN
              ? (data.amount ?? 0) * 12
              : data.amount,
          billing_id: id,
          householder_id: data.householder_id,
          status: StatusEnum.LUNAS,
        },
      })
      .then((res) => res.data)
      .then((data) => {
        navigate("/admin/billings");

        setIsLoading(false);

        renderToast("Pembayaran Berhasil");
      })
      .catch((err) => {
        setIsLoading(false);
      });
  };

  return (
    <>
      {isLoading && <LoadingScreen />}
      <Navbar />
      <div className="flex h-screen flex-col items-center justify-center">
        <Card className="p-6 w-96">
          <h1 className="mb-5 text-3xl font-bold">Pay bills</h1>,
          <form onSubmit={submitData} className="space-y-2">
            <FormInput
              name="type"
              label="Type"
              className={"mb-5"}
              value={data.type_name}
              readOnly
              // onChange={handelChange}
              color="danger"
            />
            <FormInput
              name="amount"
              label="Amount"
              value={
                data.type === StatusEnum.TAHUNAN
                  ? (data.amount ?? 0) * 12
                  : data.amount ?? ""
              }
              type="number"
              readOnly
              color="danger"
            />
            <FormTextarea
              label="Description"
              name="description"
              value={data.description}
              placeholder="Describe your house"
              readOnly
              color="danger"
            />
            <FormInput
              name="status"
              label="Status"
              // onChange={handelChange}
              value={data.status_name}
              readOnly
              color="danger"
            />
            <FormListbox
              label="House Holder"
              name="householder_id"
              options={householder}
              onChange={handleListboxChange}
              errorMessages={errors.householder_id}
            />

            <FormListbox
              label="Payment Type"
              name="type"
              options={filteredPaymentTypes}
              value={data.type}
              onChange={handleListboxChange}
              errorMessages={errors.type}
            />

            <div className="space-x-2 pt-4">
              <Button
                text="Bayar"
                color="primary"
                type="submit"
                className={"text-white"}
              />

              <Button
                text="Back"
                color="secondary"
                onClick={() => navigate("/admin/billings")}
                className={"text-white"}
              />
            </div>
          </form>
        </Card>
      </div>
    </>
  );
}

export default TransactionPay;
