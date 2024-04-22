import React, { useEffect, useRef, useState } from "react";
import Navbar from "../../layouts/navbars/Navbar";
import defaultAxios from "../../utils/DefaultAxios";
import Chart from "chart.js/auto";
import Card from "../../components/cards/Card";
import LoadingScreen from "../../components/LoadingScreen";
import { useNavigate } from "react-router-dom";
import FormListbox from "../../components/forms/FormListBox";
import Pagination from "../../components/Pagination";

interface MonthlySummary {
  month: string;
  income: number;
  expense: number;
  current_balance: number;
}
interface ApiResponse {
  monthly_summary: MonthlySummary[];
  total_balance: number;
}

function Finance() {
  const BASE_API = process.env.REACT_APP_BASE_API;
  const [data, setData] = useState<ApiResponse>({
    monthly_summary: [],
    total_balance: 0,
  });
  const [dataTable, setDataTable] = useState<any>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filterMonth, setFilterMonth] = useState<number | "">("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const chartRef = useRef<Chart | null>(null);

  const navigate = useNavigate();

  const monthNumberMap: { [key: string]: number } = {
    January: 1,
    February: 2,
    March: 3,
    April: 4,
    May: 5,
    June: 6,
    July: 7,
    August: 8,
    September: 9,
    October: 10,
    November: 11,
    December: 12,
  };

  const fetchFinanceGraphic = () => {
    setIsLoading(true);
    defaultAxios
      .get(`${BASE_API}/api/v1/financial-report-summaries`)
      .then((res) => res.data)
      .then((data) => {
        setData(data);
        setIsLoading(false);
      })
      .catch((err) => {
        navigate(`/errors/${err.response.status}`, {
          state: { message: err.response.data.message },
        });
      });
  };

  const fetchFinance = (page: number | "") => {
    setIsLoading(true);
    let url = `${BASE_API}/api/v1/financial-report-detail?page=${page}`;

    if (filterMonth !== "") {
      url += `&month=${filterMonth}`;
    }

    defaultAxios
      .get(url)
      .then((res) => res.data)
      .then((data) => {
        setDataTable(data);
        setTotalPages(data.meta.last_page);
        setIsLoading(false);
      })
      .catch((err) => {
        navigate(`/errors/${err.response.status}`, {
          state: { message: err.response.data.message },
        });
        setIsLoading(false);
      });
  };

  useEffect(() => {
    fetchFinanceGraphic();
    fetchFinance("");
  }, []);

  useEffect(() => {
    if (data && data.monthly_summary && data.monthly_summary.length > 0) {
      renderChart();
    }
  }, [data]);

  console.log(data);

  useEffect(() => {
    fetchFinance(currentPage);
  }, [currentPage, filterMonth]);

  const renderChart = () => {
    const months = data.monthly_summary.map((entry) => entry.month);
    const incomes = data.monthly_summary.map((entry) => entry.income);
    const expenses = data.monthly_summary.map((entry) => entry.expense);
    const balances = data.monthly_summary.map((entry) => entry.current_balance);

    if (chartRef.current) {
      chartRef.current.destroy();
    }

    const ctx = document.getElementById("financeChart") as HTMLCanvasElement;
    if (ctx) {
      chartRef.current = new Chart(ctx, {
        type: "line",
        data: {
          labels: months,
          datasets: [
            {
              label: "Income",
              data: incomes,
              borderColor: "rgb(54, 162, 235)",
              borderWidth: 2,
              fill: false,
            },
            {
              label: "Expense",
              data: expenses,
              borderColor: "rgb(255, 99, 132)",
              borderWidth: 2,
              fill: false,
            },
            {
              label: "Current Balance",
              data: balances,
              borderColor: "rgb(75, 192, 192)",
              borderWidth: 2,
              fill: false,
            },
          ],
        },
        options: {
          scales: {
            y: {
              beginAtZero: true,
            },
          },
        },
      });
    }
  };

  const handleMonthFilterChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const selectedMonth = event.target.value;
    setFilterMonth(monthNumberMap[selectedMonth]);
  };

  const onPageChange = (page: number | string) => {
    if (page === "prev" && currentPage > 1) {
      setCurrentPage(currentPage - 1);
    } else if (page === "next" && currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    } else if (typeof page === "number") {
      setCurrentPage(page);
    }
  };

  return (
    <>
      <Navbar />
      <Card className="w-full">
        <h1 className="text-3xl font-bold text-center my-5">Report Payment</h1>
        <h1 className="text-1xl font-bold text-center my-5">
          Kas saat ini: {data.total_balance}
        </h1>
        <div className="w-1/2 mx-auto my-5">
          <canvas id="financeChart" width={4} height={2}></canvas>
        </div>
        <div className="container mx-auto my-5">
          {isLoading ? (
            <LoadingScreen />
          ) : (
            <>
              <div className="flex justify-between items-center">
                <div>Report Monthly</div>
                {/* Filter */}
                <div className="my-3">
                  <select
                    className="select w-full max-w-xs select-primary select-sm"
                    id="monthFilter"
                    name="monthFilter"
                    value={
                      filterMonth === ""
                        ? ""
                        : Object.keys(monthNumberMap)[filterMonth - 1]
                    }
                    onChange={handleMonthFilterChange}
                  >
                    <option value="">Filter by Months</option>
                    {Object.keys(monthNumberMap).map((monthName, index) => (
                      <option key={index} value={monthName}>
                        {monthName}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              {/* Table */}
              <table className="table my-5">
                <thead className="bg-violet-700 text-white">
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
                  {!dataTable.data || dataTable.data.length === 0 ? (
                    <tr>
                      <td colSpan={10} className="text-center">
                        Data Empty
                      </td>
                    </tr>
                  ) : (
                    dataTable.data.map((item: any, index: number) => (
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
      </Card>
    </>
  );
}

export default Finance;
