import React from "react";
import useCurrentUser from "../../utils/CurrentUser";
import { useNavigate } from "react-router-dom";
import defaultAxios from "../../utils/DefaultAxios";
import { renderConfirmationModal, renderToast } from "../../utils/helper";
import Navbar from "../../layouts/navbars/Navbar";
import LoadingScreen from "../../components/LoadingScreen";
import Button from "../../components/buttons/Button";
import RoleEnum from "../../enums/Role.enum";
import BaseDropdown from "../../components/forms/BaseDropdown";
import BaseDropdownItem from "../../components/forms/BaseDropdownItem";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import Pagination from "../../components/Pagination";

function TransactionHistory() {
  const BASE_API = process.env.REACT_APP_BASE_API;
  const [data, setData] = React.useState<any>({});
  const [isLoading, setIsLoading] = React.useState(true);
  const [currentPage, setCurrentPage] = React.useState(1);
  const userData: any = useCurrentUser();
  const [filterType, setFilterType] = React.useState<number | "">("");
  const [mapFilter, setMapFilter] = React.useState<any[]>([]);

  const navigate = useNavigate();

  const fetchBilling = (page: number) => {
    setIsLoading(true);

    let url = `${BASE_API}/api/v1/transaction-histories?page=${page}`;

    if (filterType !== "") {
      url += `&filter_type=${filterType}`;
    }
    defaultAxios
      .get(url)
      .then((res) => res.data)
      .then((data) => {
        setData(data);
        setIsLoading(false);
      })
      .catch((err) => {
        navigate(`/errors/${err.response.status}`, {
          state: { message: err.response.data.message },
        });
        setIsLoading(false);
      });
  };

  const fetchData = async () => {
    let expenseData = [];
    let transactionData = [];

    if (userData?.is_admin === RoleEnum.ADMIN) {
      try {
        const expenseResponse = await defaultAxios.get(
          `${BASE_API}/api/v1/enums`,
          {
            params: {
              type: "expense_type",
            },
          }
        );
        expenseData = expenseResponse.data.data;
      } catch (error) {
        console.error("Error fetching expense types:", error);
      }
    }

    try {
      const transactionResponse = await defaultAxios.get(
        `${BASE_API}/api/v1/enums`,
        {
          params: {
            type: "type_transaction",
          },
        }
      );
      transactionData = transactionResponse.data.data;
    } catch (error) {
      console.error("Error fetching transaction types:", error);
    }

    const combinedData = [...expenseData, ...transactionData];

    setMapFilter(combinedData);
  };

  console.log(mapFilter);

  React.useEffect(() => {
    fetchData();
    fetchBilling(currentPage);
  }, [currentPage, userData, filterType]);

  const totalPages = data.meta?.last_page || 1;

  const onPageChange = (page: number | string) => {
    if (page === "prev" && currentPage > 1) {
      setCurrentPage(currentPage - 1);
    } else if (page === "next" && currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    } else if (typeof page === "number") {
      setCurrentPage(page);
    }
  };

  const handleFilterChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setFilterType(parseInt(event.target.value));
  };

  return (
    <>
      <Navbar />
      <div className="container mx-auto my-5">
        {isLoading ? (
          <LoadingScreen />
        ) : (
          <>
            <div className="flex justify-between">
              <h1 className="text-3xl font-bold">Transaction History</h1>
              {userData?.is_admin === RoleEnum.ADMIN && (
                <Button
                  text="Pengeluaran"
                  onClick={() => navigate("/admin/add-transaction")}
                  className={"text-white"}
                  color="secondary"
                />
              )}
            </div>

            {/* Filter */}
            <div className="my-3">
              <select
                className="select w-full max-w-xs select-primary select-sm"
                id="monthFilter"
                name="monthFilter"
                onChange={handleFilterChange}
                value={filterType}
              >
                <option value="0">All</option>
                {mapFilter.map((filter: any, index: number) => (
                  <option key={index} value={filter.id}>
                    {filter.name}
                  </option>
                ))}
              </select>
            </div>

            <table className="table my-5">
              <thead className="bg-slate-700 text-white">
                <tr>
                  <th>#</th>
                  <th>Type</th>
                  <th>Amount</th>
                  <th>Description</th>
                  <th>Status</th>
                  <th>Type Payment</th>
                  <th>House</th>
                  <th>Created By</th>
                  <th>Created At</th>
                  <th>Payment Retrun Date</th>
                </tr>
              </thead>
              <tbody>
                {data.data.length === 0 ? (
                  <tr>
                    <td colSpan={10} className="text-center">
                      Data Empty
                    </td>
                  </tr>
                ) : (
                  data.data.map((item: any, index: number) => (
                    <tr key={index}>
                      <td>{index + 1}</td>
                      <td>{item.type_name}</td>
                      <td>{item.amount}</td>
                      <td>{item.description}</td>
                      <td>{item.status_name}</td>
                      <td>{item.billing}</td>
                      <td>{item.house}</td>
                      <td>{item.householder}</td>
                      <td>{item.created_at}</td>
                      <td>{item.payment_return_date}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
            {/* Pagination */}
            <Pagination
              links={Array.from({ length: totalPages }, (_, i) => i + 1)}
              onPageChange={onPageChange}
            />
          </>
        )}
      </div>
    </>
  );
}

export default TransactionHistory;
