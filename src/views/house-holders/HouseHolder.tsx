import React, { useState } from "react";
import Navbar from "../../layouts/navbars/Navbar";
import LoadingScreen from "../../components/LoadingScreen";
import Button from "../../components/buttons/Button";
import BaseDropdown from "../../components/forms/BaseDropdown";
import BaseDropdownItem from "../../components/forms/BaseDropdownItem";
import Pagination from "../../components/Pagination";
import { faEye, faPen, faTrash } from "@fortawesome/free-solid-svg-icons";
import useCurrentUser from "../../utils/CurrentUser";
import { useNavigate } from "react-router-dom";
import defaultAxios from "../../utils/DefaultAxios";
import { renderConfirmationModal, renderToast } from "../../utils/helper";
import { ZoomableImg } from "../../utils/ZoomableImg";

function HouseHolder() {
  const BASE_API = process.env.REACT_APP_BASE_API;
  const [data, setData] = React.useState<any>({});
  const [isLoading, setIsLoading] = React.useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const userData: any = useCurrentUser();
  const navigate = useNavigate();

  const fetchHouseHolders = (page: number) => {
    setIsLoading(true);
    defaultAxios
      .get(`${BASE_API}/api/v1/householders?page=${page}`)
      .then((res) => res.data)
      .then((data) => {
        setData(data);
        setIsLoading(false);
      });
  };

  React.useEffect(() => {
    fetchHouseHolders(currentPage);
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
      .delete(`${BASE_API}/api/v1/householders/${id}`)
      .then((res) => res.data)
      .then((data) => {
        fetchHouseHolders(currentPage);
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
              <h1 className="text-3xl font-bold">House Holders</h1>
              <Button
                text="Add"
                onClick={() => navigate("/admin/add-house-holder")}
                className={"text-white"}
              />
            </div>

            <table className="table my-5">
              <thead className="bg-violet-700 text-white">
                <tr>
                  <th>#</th>
                  <th>Name</th>
                  <th>Photo Ktp</th>
                  <th>Status</th>
                  <th>Status Married</th>
                  <th>Phone</th>
                  <th>House Name</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {data.data.map((item: any, index: number) => (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    <td>{item.name}</td>
                    <td>
                      <ZoomableImg
                        src={
                          item.photo_ktp || "/assets/images/user-default.svg"
                        }
                      />
                    </td>

                    <td>{item.status_name}</td>
                    <td>{item.marital_status}</td>
                    <td>{item.phone}</td>
                    <td>{item.house_name}</td>
                    <td>
                      <BaseDropdown
                        label="Action"
                        color="info"
                        size="sm"
                        className="text-white"
                      >
                        {/* <BaseDropdownItem
                          label="Detail"
                          icon={faEye}
                          color="info"
                          onClick={() => navigate(`/admin/house/${item.id}`)}
                        /> */}
                        <BaseDropdownItem
                          label="Edit"
                          icon={faPen}
                          color="warning"
                          onClick={() =>
                            navigate(`/admin/edit-house-holder/${item.id}`)
                          }
                        />
                        <BaseDropdownItem
                          label="Delete"
                          icon={faTrash}
                          color="danger"
                          onClick={() => onDelete(item.id)}
                        />
                      </BaseDropdown>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {/* Pagination */}
            <Pagination
              links={Array.from({ length: totalPages }, (_, i) => i + 1)}
              onPageChange={onPageChange}
            />
          </>
        )}
      </div>{" "}
    </>
  );
}

export default HouseHolder;
