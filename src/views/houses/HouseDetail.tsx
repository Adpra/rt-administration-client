import React, { useMemo } from "react";
import Navbar from "../../layouts/navbars/Navbar";
import Card from "../../components/cards/Card";
import { useNavigate, useParams } from "react-router-dom";
import defaultAxios from "../../utils/DefaultAxios";
import LoadingScreen from "../../components/LoadingScreen";
import Button from "../../components/buttons/Button";
import { ZoomableImg } from "../../utils/ZoomableImg";

function HouseDetail() {
  const BASE_API = process.env.REACT_APP_BASE_API;
  const params = useParams();
  const id = useMemo(() => params.id, [params]);
  const navigate = useNavigate();

  const [data, setData] = React.useState<any>({});

  const [isLoading, setIsLoading] = React.useState(false);

  const fetchHouses = () => {
    setIsLoading(true);
    defaultAxios
      .get(`${BASE_API}/api/v1/houses/${id}`)
      .then((res) => res.data)
      .then((data) => {
        setData(data.data);
        setIsLoading(false);
      })
      .catch((err) => {
        setIsLoading(false);
        console.log(err);
      });
  };

  React.useEffect(() => {
    fetchHouses();
  }, []);

  return (
    <>
      <Navbar />

      {isLoading && <LoadingScreen />}

      <div className="my-5 h-full p-4">
        <Card className="p-4">
          <header className="relative flex items-center justify-between">
            <div className="text-xl font-bold text-navy-700 dark:text-white">
              House Detail
            </div>
          </header>

          <div className="text-md font-bold text-navy-700 dark:text-white my-5">
            House
          </div>

          {data && (
            <div>
              <p className="my-2">House Number : {data.no}</p>
              <p className="my-2">Description : {data.description}</p>
              <p className="my-2">Status : {data.status_name}</p>
            </div>
          )}

          <div className="text-md font-bold text-navy-700 dark:text-white my-5">
            Resident
          </div>

          {data.house_holders && data.house_holders.length > 0 ? (
            data.house_holders.map((resident: any, index: number) => (
              <div key={index}>
                <p>No. {index + 1}</p>
                <div className="my-2">
                  <p>Nama : {resident.name}</p>
                </div>
                <div className="my-2">
                  <p>Status : {resident.status_name}</p>
                </div>
                <div className="my-2">
                  <p>Status Menikah : {resident.marital_status}</p>
                </div>
                <div className="my-2">
                  <p>Phone : {resident.phone}</p>
                </div>
                <div className="my-2">
                  <p>Ktp</p>
                  <ZoomableImg
                    src={
                      resident.photo_ktp || "/assets/images/user-default.svg"
                    }
                  />
                </div>
              </div>
            ))
          ) : (
            <p>Belum Berpenghuni</p>
          )}

          <div className="space-x-2 pt-4">
            <Button
              text="Back"
              color="secondary"
              onClick={() => navigate("/admin/house")}
            />
          </div>
        </Card>
      </div>
    </>
  );
}

export default HouseDetail;
