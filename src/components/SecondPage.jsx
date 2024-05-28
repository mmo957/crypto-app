import { useState, useLayoutEffect } from "react";
import MainBox from "./MainBox";
import axios from "axios";
import { API } from "../utils/api";
import SkeletonLoader from "./Skeleton"; // Import your skeleton loader component
import { useTranslation } from "react-i18next";
import Navbar from "./Navbar";

function SecondPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [bitcoinPercentage, setBitcoinPercentage] = useState(0);
  const [ethereumPercentage, setEthereumPercentage] = useState(0);
  const [bitcoinMonthPercent, setBitcoinMonthPercent] = useState(0);
  const [ethereumMonthPercent, setEthereumMonthPercent] = useState(0);
  const [gainersData, setGainersData] = useState([]);
  const [loosersData, setLoosersData] = useState([]);
  const [gainersMonthData, setGainersMonthData] = useState([]);
  const [loosersMonthData, setLoosersMonthData] = useState([]);
  const [data, setData] = useState([]);
  const [error, setError] = useState(false);

  const { t } = useTranslation();
  const getData = async () => {
    try {
      const [
        res,
        res_gainers,
        res_loosers,
        res_month_gainers,
        res_month_loosers,
      ] = await Promise.all([
        axios.get(`${API}/latest`),
        axios.get(`${API}/trending/losers-gainer?time=7d&sort=desc&limit=5`),
        axios.get(`${API}/trending/losers-gainer?time=7d&sort=asc&limit=5`),
        axios.get(`${API}/trending/losers-gainer?time=30d&sort=desc&limit=5`),
        axios.get(`${API}/trending/losers-gainer?time=30d&sort=asc&limit=5`),
      ]);

      if (res?.data?.status === "success") {
        const bitcoinData = res?.data?.data.find((item) => item.id === 1);
        if (bitcoinData) {
          const {
            percent_change_7d: percentage,
            percent_change_30d: monthPercent,
          } = bitcoinData?.quote?.USD ?? {};
          setBitcoinPercentage(percentage);
          setBitcoinMonthPercent(monthPercent);
        }

        const ethereumData = res?.data?.data.find((item) => item.id === 1027);
        if (ethereumData) {
          const {
            percent_change_7d: percentage,
            percent_change_30d: monthPercent,
          } = ethereumData?.quote?.USD ?? {};
          setEthereumPercentage(percentage);
          setEthereumMonthPercent(monthPercent);
        }

        setData(res?.data?.data);
      }

      if (res_gainers?.data?.status === "success") {
        const top_5 = res_gainers?.data?.data;
        const gainers = top_5.map((item) => ({
          name: item.symbol,
          percentage: item?.quote?.USD?.percent_change_7d,
          logo: item.id,
        }));
        setGainersData(gainers);
      }

      if (res_loosers?.data?.status === "success") {
        const top_5 = res_loosers?.data?.data;
        const loosers = top_5.map((item) => ({
          name: item.symbol,
          percentage: item?.quote?.USD?.percent_change_7d,
          logo: item.id,
        }));
        setLoosersData(loosers);
      }

      if (res_month_gainers?.data?.status === "success") {
        const top_5 = res_month_gainers?.data?.data;
        const gainers = top_5.map((item) => ({
          name: item.symbol,
          percentage: item?.quote?.USD?.percent_change_30d,
          logo: item.id,
        }));
        setGainersMonthData(gainers);
      }

      if (res_month_loosers?.data?.status === "success") {
        const top_5 = res_month_loosers?.data?.data;
        const loosers = top_5.map((item) => ({
          name: item.symbol,
          percentage: item?.quote?.USD?.percent_change_30d,
          logo: item.id,
        }));
        setLoosersMonthData(loosers);
      }

      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching data:", error);
      setIsLoading(false);
      setError(true);
    }
  };

  useLayoutEffect(() => {
    getData();
  }, []);

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <div className="text-red-500 text-lg mb-4">Something went wrong</div>
        <div className="text-gray-500 text-md text-white mb-2">
          Please refresh the page. If you are using a mobile device, please
          scroll down to refresh the data.
        </div>
        <button
          className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
          onClick={() => window.location.reload()}
        >
          Refresh
        </button>
      </div>
    );
  } else if (isLoading) {
    return <SkeletonLoader />;
  }

  return (
    <div className="py-2 text-center  flex items-center flex-col gap-3 text-white max-w-full background-pic">
      <Navbar />
      <div className="  px-4 lg:px-16 flex items-center flex-col gap-3 text-white max-w-[1400px] w-full mx-auto ">
        <h1 className="text-[20px] sm:text-[30px] md:text-[44px] text-center font-bold text-white">
          <span className="text-orange font-bold">
            {t("overview.heading.1")}
          </span>{" "}
          {t("overview.heading.2")}{" "}
          <span className="text-orange font-bold">
            {t("overview.heading.3")}
          </span>{" "}
          <br /> {t("overview.heading.4")}{" "}
          <span className="text-orange font-bold">/</span>{" "}
          {t("overview.heading.5")}
        </h1>
        <div className="flex w-full flex-col sm:flex-row justify-between gap-4 md:gap-16 items-center">
          <div className="w-full sm:w-[50%]">
            <MainBox
              heading={
                <h1 className="text-white font-bold  text-[24px]">
                  <span className="text-color1">Bitcoin</span> ve{" "}
                  <span className="text-color2">Ethereum</span>
                  <br />
                  {t("overview.weekly_change")}
                </h1>
              }
              list_items={[
                { name: "BTC", percentage: bitcoinPercentage, logo: 1 },
                { name: "ETH", percentage: ethereumPercentage, logo: 1027 },
              ]}
            />
          </div>
          <div className="w-full sm:w-[50%]">
            <MainBox
              heading={
                <h1 className="text-white font-bold  text-[24px]">
                  <span className="text-color1">Bitcoin</span> ve{" "}
                  <span className="text-color2">Ethereum</span> <br />{" "}
                  {t("overview.monthly_change")}
                </h1>
              }
              list_items={[
                { name: "BTC", percentage: bitcoinMonthPercent, logo: 1 },
                { name: "ETH", percentage: ethereumMonthPercent, logo: 1027 },
              ]}
            />
          </div>
        </div>

        <div className="flex w-full flex-col sm:flex-row justify-between gap-4 md:gap-16 items-center">
          <div className="w-full sm:w-[50%]">
            <MainBox
              heading={
                <h1 className="text-white font-bold  text-[24px]">
                  <span className="text-color3">
                    {t("overview.rising_crypto")}
                  </span>{" "}
                  <br />
                  {t("overview.last_1_week")}
                </h1>
              }
              list_items={gainersData}
            />
          </div>
          <div className="w-full sm:w-[50%]">
            <MainBox
              heading={
                <h1 className="text-white font-bold  text-[24px]">
                  <span className="text-color4">
                    {t("overview.falling_crypto")}
                  </span>{" "}
                  <br /> {t("overview.last_1_week")}
                </h1>
              }
              list_items={loosersData}
            />
          </div>
        </div>

        <div className="flex w-full flex-col sm:flex-row justify-between gap-4 md:gap-16 items-center">
          <div className="w-full sm:w-[50%]">
            <MainBox
              heading={
                <h1 className="text-white font-bold  text-[24px]">
                  <span className="text-color3">
                    {t("overview.rising_crypto")}
                  </span>{" "}
                  <br /> {t("overview.last_1_month")}
                </h1>
              }
              list_items={gainersMonthData}
            />
          </div>
          <div className="w-full sm:w-[50%]">
            <MainBox
              heading={
                <h1 className="text-white font-bold   text-[24px]">
                  <span className="text-color4">
                    {t("overview.falling_crypto")}
                  </span>{" "}
                  <br /> {t("overview.count")}
                </h1>
              }
              list_items={loosersMonthData}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default SecondPage;
