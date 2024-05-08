import { useState, useLayoutEffect } from "react";
import MainBox from "./MainBox";
import axios from "axios";
import { API } from "../utils/api";
import SkeletonLoader from "./Skeleton"; // Import your skeleton loader component

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
      setIsLoading(true);
    }
  };

  useLayoutEffect(() => {
    getData();
  }, []);

  if (isLoading) {
    return <SkeletonLoader />; // Render your skeleton loader component
  }

  return (
    <div className="py-2 text-center px-4 md:px-16 flex flex-col gap-3  max-w-[1400px] mx-auto background-pic">
      <h1 className="text-[20px] sm:text-[30px] md:text-[44px] text-center font-bold text-white">
        <span className="text-orange font-bold">HAFTALIK</span> VE{" "}
        <span className="text-orange font-bold">AYLIK</span> <br /> YÜKSELENLER{" "}
        <span className="text-orange font-bold">/</span> DÜŞENLER
      </h1>
      <div className="flex flex-col sm:flex-row justify-between gap-4 md:gap-16 items-center">
        <div className="w-full sm:w-[50%]">
          <MainBox
            heading={
              <h1 className="text-white font-bold  text-[24px]">
                <span className="text-color1">Bitcoin</span> ve{" "}
                <span className="text-color2">Ethereum</span>
                <br />
                Haftalık Değişim
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
                <span className="text-color2">Ethereum</span> <br /> Aylık
                Değişim
              </h1>
            }
            list_items={[
              { name: "BTC", percentage: bitcoinMonthPercent, logo: 1 },
              { name: "ETH", percentage: ethereumMonthPercent, logo: 1027 },
            ]}
          />
        </div>
      </div>

      <div className="flex flex-col sm:flex-row justify-between gap-4 md:gap-16 items-center">
        <div className="w-full sm:w-[50%]">
          <MainBox
            heading={
              <h1 className="text-white font-bold  text-[24px]">
                <span className="text-color3">Yükselen Kripto Paralar</span>{" "}
                <br />
                Son 1 Hafta
              </h1>
            }
            list_items={gainersData}
          />
        </div>
        <div className="w-full sm:w-[50%]">
          <MainBox
            heading={
              <h1 className="text-white font-bold  text-[24px]">
                <span className="text-color4">Düşen Kripto Paralar</span> <br />{" "}
                Son 1 Hafta
              </h1>
            }
            list_items={loosersData}
          />
        </div>
      </div>

      <div className="flex flex-col sm:flex-row justify-between gap-4 md:gap-16 items-center">
        <div className="w-full sm:w-[50%]">
          <MainBox
            heading={
              <h1 className="text-white font-bold  text-[24px]">
                <span className="text-color3">Yükselen Kripto Paralar</span>{" "}
                <br /> Son 1 Ay
              </h1>
            }
            list_items={gainersMonthData}
          />
        </div>
        <div className="w-full sm:w-[50%]">
          <MainBox
            heading={
              <h1 className="text-white font-bold   text-[24px]">
                <span className="text-color4">Düşen Kripto Paralar</span> <br />{" "}
                Sonlay
              </h1>
            }
            list_items={loosersMonthData}
          />
        </div>
      </div>
    </div>
  );
}

export default SecondPage;
