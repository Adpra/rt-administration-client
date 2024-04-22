import React, { useState } from "react";
import defaultAxios from "../../utils/DefaultAxios";
import Navbar from "../../layouts/navbars/Navbar";
import LoadingScreen from "../../components/LoadingScreen";
import BaseDropdown from "../../components/forms/BaseDropdown";
import BaseDropdownItem from "../../components/forms/BaseDropdownItem";
import { faEye, faPen, faTrash } from "@fortawesome/free-solid-svg-icons";
import Pagination from "../../components/Pagination";
import Button from "../../components/buttons/Button";
import { useNavigate } from "react-router-dom";
import useCurrentUser from "../../utils/CurrentUser";
import { renderConfirmationModal, renderToast } from "../../utils/helper";
import RoleEnum from "../../enums/Role.enum";

function House() {
  const BASE_API = process.env.REACT_APP_BASE_API;
  const [data, setData] = React.useState<any>({});
  const [isLoading, setIsLoading] = React.useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const userData: any = useCurrentUser();

  const navigate = useNavigate();

  const fetchHouses = (page: number) => {
    setIsLoading(true);
    defaultAxios
      .get(`${BASE_API}/api/v1/houses?page=${page}`)
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
    fetchHouses(currentPage);
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
      .delete(`${BASE_API}/api/v1/houses/${id}`)
      .then((res) => res.data)
      .then((data) => {
        fetchHouses(currentPage);
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
              <h1 className="text-3xl font-bold">House</h1>
              {userData?.is_admin === RoleEnum.ADMIN && (
                <Button
                  text="Add"
                  onClick={() => navigate("/admin/add-house")}
                  className={"text-white"}
                />
              )}
            </div>

            <table className="table my-5">
              <thead className="bg-violet-700 text-white">
                <tr>
                  <th>#</th>
                  <th>Name</th>
                  <th>Description</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {!data.data || data.data.length === 0 ? (
                  <tr>
                    <td colSpan={5}>Data Empty</td>
                  </tr>
                ) : (
                  data.data.map((item: any, index: number) => (
                    <tr key={index}>
                      <td>{index + 1}</td>
                      <td>{item.name}</td>
                      <td>{item.description}</td>
                      <td>{item.status_name}</td>
                      <td>
                        <BaseDropdown
                          label="Action"
                          color="info"
                          size="sm"
                          className="text-white"
                        >
                          <BaseDropdownItem
                            label="Detail"
                            icon={faEye}
                            color="info"
                            onClick={() => navigate(`/admin/house/${item.id}`)}
                          />
                          <BaseDropdownItem
                            label="Edit"
                            icon={faPen}
                            color="warning"
                            onClick={() =>
                              navigate(`/admin/edit-house/${item.id}`)
                            }
                          />
                          {userData?.is_admin === RoleEnum.ADMIN && (
                            <BaseDropdownItem
                              label="Delete"
                              icon={faTrash}
                              color="danger"
                              onClick={() => onDelete(item.id)}
                            />
                          )}
                        </BaseDropdown>
                      </td>
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

export default House;
