import React from "react";
import Navbar from "../../layouts/navbars/Navbar";
import useCurrentUser from "../../utils/CurrentUser";
import { useNavigate } from "react-router-dom";
import defaultAxios from "../../utils/DefaultAxios";
import { renderConfirmationModal, renderToast } from "../../utils/helper";
import LoadingScreen from "../../components/LoadingScreen";
import RoleEnum from "../../enums/Role.enum";
import Button from "../../components/buttons/Button";
import BaseDropdown from "../../components/forms/BaseDropdown";
import BaseDropdownItem from "../../components/forms/BaseDropdownItem";
import { faEye, faPen, faTrash } from "@fortawesome/free-solid-svg-icons";
import Pagination from "../../components/Pagination";

function Billing() {
  const BASE_API = process.env.REACT_APP_BASE_API;
  const [data, setData] = React.useState<any>({});
  const [isLoading, setIsLoading] = React.useState(true);
  const [currentPage, setCurrentPage] = React.useState(1);
  const userData: any = useCurrentUser();

  const navigate = useNavigate();

  const fetchBilling = (page: number) => {
    setIsLoading(true);
    defaultAxios
      .get(`${BASE_API}/api/v1/billings?page=${page}`)
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

  React.useEffect(() => {
    fetchBilling(currentPage);
  }, [currentPage, userData]);

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

  const onDelete = async (id: number) => {
    const { isConfirmed } = await renderConfirmationModal();

    if (!isConfirmed) {
      return;
    }
    setIsLoading(true);
    defaultAxios
      .delete(`${BASE_API}/api/v1/billings/${id}`)
      .then((res) => res.data)
      .then((data) => {
        fetchBilling(currentPage);
        renderToast("Data berhasil dihapus");
        setIsLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setIsLoading(false);
      });
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
              <h1 className="text-3xl font-bold">Billing</h1>
              {userData?.is_admin === RoleEnum.ADMIN && (
                <Button
                  text="Add"
                  onClick={() => navigate("/admin/add-billing")}
                  className={"text-white"}
                  color="secondary"
                />
              )}
            </div>

            <table className="table my-5">
              <thead className="bg-slate-700 text-white">
                <tr>
                  <th>#</th>
                  <th>Type</th>
                  <th>Amount</th>
                  <th>Description</th>
                  <th>Status</th>
                  <th>Created At</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {!data.data || data.data.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="text-center">
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
                      <td>{item.created_at}</td>
                      {userData?.is_admin === RoleEnum.ADMIN && (
                        <td>
                          <BaseDropdown
                            label="Action"
                            color="secondary"
                            size="sm"
                            className="text-white"
                          >
                            <BaseDropdownItem
                              label="Delete"
                              icon={faTrash}
                              color="danger"
                              onClick={() => onDelete(item.id)}
                            />
                          </BaseDropdown>
                        </td>
                      )}
                      {userData?.is_admin === RoleEnum.USER && (
                        <td>
                          <Button
                            text="Bayar"
                            size="sm"
                            onClick={() =>
                              navigate(`/admin/transaction-pay/${item.id}`)
                            }
                            className={"text-white mx-2"}
                          />
                        </td>
                      )}
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

export default Billing;
