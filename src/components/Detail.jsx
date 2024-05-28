import { useLayoutEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Logo from "./Logo";
import { MdArrowDropDown, MdArrowDropUp } from "react-icons/md";
import { IoMdInformationCircle } from "react-icons/io";
import { IoMdInformationCircleOutline } from "react-icons/io";
import { MdOutlineContentCopy } from "react-icons/md";
import { FaShare } from "react-icons/fa";
import { HiExternalLink } from "react-icons/hi";
import SmallBox from "./SmallBox";
import SkeletonLoader from "./Skeleton";
import CertiK from "/CertiK.png";
import chainsulting from "/chainsulting.png";
import slowmist from "/slowmist.png";
import quant from "/quantstemp.jpg";
import twitterC from "/twitter.png";
import telgram from "/telegram.svg";
import axios from "axios";
import { API } from "../utils/api";
import Navbar from "./Navbar";
import { useTranslation } from "react-i18next";
function Detail() {
  const [isLoading, setIsLoading] = useState(true);
  const [quoteData, setQuoteData] = useState({});
  const [statData, setStatData] = useState({});
  const [statData24, setStatData24] = useState({});
  const [lowHigh, setLowHigh] = useState(30);
  const [percentage, setPercentage] = useState(0);
  const [bitcoinPrice, setBitcoinPrice] = useState(0);
  const [ethereumPrice, setEthereumPrice] = useState(0);
  const [currentRate, setCurrentRate] = useState(0);
  const [low, setLow] = useState(0);
  const [high, setHigh] = useState(0);
  const [websiteLink, setWebsiteLink] = useState(null);
  const [twitter, setTwitter] = useState(null);
  const [error, setError] = useState(false);
  const { id } = useParams();

  const { t } = useTranslation();

  const copyToClipboard = () => {
    navigator.clipboard
      .writeText(id)
      .then(() => {
        alert("Text copied to clipboard");
      })
      .catch((err) => {
        console.error("Failed to copy text: ", err);
      });
  };

  const formatNumber = (number) => {
    return new Intl.NumberFormat().format(number);
  };

  const formatNumberEurope = (number) => {
    // Convert number to a string and split by decimal point
    let numberStr = number.toString();
    if (numberStr.includes("e")) {
      numberStr = number.toFixed(20).replace(/\.?0+$/, "");
    }

    let [integerPart, decimalPart] = numberStr.split(".");

    let resultDecimal = "";
    let count = 0;

    if (decimalPart) {
      // Loop over the decimal part to find exactly two non-zero digits
      for (let i = 0; i < decimalPart.length; i++) {
        if (decimalPart[i] === "0") {
          count++;
        } else {
          // Capture the first non-zero digit and the next digit
          resultDecimal = decimalPart[i];
          if (i + 1 < decimalPart.length) {
            resultDecimal += decimalPart[i + 1];
          } else {
            resultDecimal += "0"; // Pad with zero if there's no next digit
          }
          break;
        }
      }
    }

    // If resultDecimal is still empty, it means there were no non-zero digits in decimalPart
    if (resultDecimal === "") {
      resultDecimal = "00";
    }

    // Reconstruct the number with adjusted decimal places
    const formattedNumber = `${integerPart}.${"0".repeat(
      count
    )}${resultDecimal}`;

    // Format the number using German locale
    const temp = new Intl.NumberFormat("de-DE", {
      style: "decimal",
      minimumFractionDigits: 2,
      maximumFractionDigits: 20,
      useGrouping: false,
    }).format(Number(formattedNumber));

    return customFormatNumber(temp);
    // return temp;
  };

  function customFormatNumber(numberStr) {
    // Split the input number string into integer and fractional parts
    let parts = numberStr.split(",");
    let integerPart = parts[0];
    let fractionalPart = parts[1];

    // Reverse the integer part to insert thousand separators
    let reversedIntegerPart = integerPart.split("").reverse().join("");

    // Insert the thousand separators (.) every 3 digits
    let withSeparatorsReversed = reversedIntegerPart.replace(/(\d{3})/g, "$1.");

    // Reverse back to the original order and remove any trailing separator
    let withSeparators = withSeparatorsReversed
      .split("")
      .reverse()
      .join("")
      .replace(/^\./, "");

    // Reconstruct the number with the fractional part
    let formattedNumber = `${withSeparators},${fractionalPart}`;

    return formattedNumber;
  }

  const formatDate = (isoString) => {
    const date = new Date(isoString);
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Intl.DateTimeFormat("en-US", options).format(date);
  };
  const getData = async () => {
    try {
      const [res, resStatistic, resStatistic24, resBit, resEth, resSpecific] =
        await Promise.all([
          axios.get(`${API}/quotes/latest?id=${id}`),
          axios.get(`${API}/price-performance-stats/latest?id=${id}`),
          axios.get(`${API}/price-performance-stats/latest?id=${id}&time=24h`),
          axios.get(`${API}/quotes/latest?id=1`),
          axios.get(`${API}/quotes/latest?id=1027`),
          axios.get(`${API}/coin/${id}`),
        ]);

      if (resSpecific?.data?.status === "success") {
        if (resSpecific.data.data[id]?.urls?.website.length > 0) {
          setWebsiteLink(resSpecific.data.data[id]?.urls?.website[0]);
        }

        if (resSpecific.data.data[id]?.urls?.twitter.length > 0) {
          setTwitter(resSpecific.data.data[id]?.urls?.twitter[0]);
        }
      }

      if (res?.data?.status === "success") {
        setQuoteData(res?.data?.data[id]);
        setCurrentRate(res?.data?.data[id]?.quote?.USD?.price);
      }

      if (resStatistic?.data?.status === "success") {
        setStatData(resStatistic?.data?.data[id]);
        setHigh(
          resStatistic?.data?.data[id]?.periods?.all_time?.quote?.USD?.high
        );
        setLow(
          resStatistic?.data?.data[id]?.periods?.all_time?.quote?.USD?.low
        );
      }

      if (resStatistic24?.data?.status === "success") {
        setStatData24(resStatistic24?.data?.data[id]);
        const low =
          resStatistic24?.data?.data[id]?.periods?.["24h"]?.quote?.USD?.low;
        const high =
          resStatistic24?.data?.data[id]?.periods?.["24h"]?.quote?.USD?.high;
        let LH = 0;
        if (low && high) {
          LH = ((low / (low + high)) * 100).toFixed(0);
          setLowHigh(LH);
        }

        setLowHigh(LH);
        if (
          resStatistic24?.data?.data[id]?.periods["24h"]?.quote?.USD
            ?.percent_change
        ) {
          setPercentage(
            resStatistic24?.data?.data[id]?.periods["24h"]?.quote?.USD
              ?.percent_change
          );
        }
      }

      if (resBit?.data?.status === "success") {
        setBitcoinPrice(resBit?.data?.data["1"]?.quote?.USD?.price);
      }

      if (resEth?.data?.status === "success") {
        setEthereumPrice(resEth?.data?.data["1027"]?.quote?.USD?.price);
      }

      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching data:", error);
      setError(true);
      setIsLoading(false);
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
    <div className="max-w-full">
      <Navbar />
      <div className="text-white flex flex-col w-full bg-[#191A1F] gap-8 py-4 px-6">
        <div className="flex flex-col gap-5">
          <div className="flex flex-col ">
            <div className="flex gap-3 items-center">
              <Logo logo={id} width="50px" height="50px" dim={64} />
              <div className="flex items-center gap-1">
                <span className="text-[28px] sm:text-[20px] ">
                  {quoteData?.name}
                </span>
                <span className="text-gray1 mt-[4px] text-[16px] sm:text-[12px]">
                  {quoteData?.symbol}
                </span>
              </div>
            </div>
            <div className="flex gap-3 items-center">
              <span className="text-[30px]">
                $
                {quoteData?.quote?.USD?.price
                  ? formatNumberEurope(quoteData?.quote?.USD?.price)
                  : NaN}
              </span>
              <div className="flex items-center text-[14px] text-[#147556] ">
                {percentage < 0 ? (
                  <MdArrowDropDown className="text-[35px]" />
                ) : (
                  <MdArrowDropUp className="text-[35px]" />
                )}
                <span className={` ml-[-8px] font-bold     `}>
                  {" "}
                  %
                  {percentage < 0
                    ? percentage.toFixed(2) * -1
                    : percentage.toFixed(2)}{" "}
                  (1d)
                </span>
              </div>
            </div>
            <span>
              {quoteData?.quote?.USD?.price
                ? formatNumberEurope(
                    quoteData?.quote?.USD?.price / ethereumPrice
                  )
                : 0}{" "}
              ETH
            </span>
            <span>
              {quoteData?.quote?.USD?.price
                ? formatNumberEurope(
                    quoteData?.quote?.USD?.price / bitcoinPrice
                  )
                : 0}{" "}
              BTC
            </span>
          </div>
          <div className="flex flex-col gap-1 ">
            <div className="flex items-center gap-1">
              <span className="text-gray1">
                {t("detail.24_hour_low_&_high")}
              </span>
              <IoMdInformationCircle className="text-gray1" />
            </div>

            <div className="flex gap-2">
              <span className="text-gray1">
                {t("detail.low")}: $
                {statData24?.periods?.["24h"]?.quote?.USD?.low
                  ? formatNumberEurope(
                      statData24?.periods?.["24h"]?.quote?.USD?.low
                    )
                  : "NaN"}
              </span>
              <div className="flex w-[180px]  items-center">
                <div
                  className=" h-[4px] bg-[#E54D60]  rounded-l-md "
                  style={{ width: `${lowHigh}%` }}
                ></div>
                <div
                  className="h-[4px] bg-[#10CA81] rounded-r-md  "
                  style={{ width: `${100 - lowHigh}%` }}
                ></div>
              </div>
              <span className="text-gray1">
                {t("detail.high")}: $
                {statData24?.periods?.["24h"]?.quote?.USD?.high
                  ? formatNumberEurope(
                      statData24?.periods?.["24h"]?.quote?.USD?.high
                    )
                  : "NaN"}
              </span>
            </div>
          </div>
        </div>
        <div className="flex flex-col xl:flex-row justify-center  gap-6">
          <div className="flex flex-col gap-3">
            <div className="flex flex-col items-start sm:flex-row sm:items-center gap-3">
              <div className="flex flex-col gap-2">
                <div className="bg-black flex gap-3 px-2">
                  <div className="flex gap-1 items-center w-[118px] ">
                    <span className="text-[#999999]">
                      {t("detail.all_time_high")}
                    </span>
                    <IoMdInformationCircleOutline className="text-[#999999]" />
                  </div>
                  <div className="w-[125px]">
                    <span className="text-[#535353] text-[14px] ">
                      {statData?.periods?.all_time?.high_timestamp
                        ? formatDate(
                            statData?.periods?.all_time?.high_timestamp
                          )
                        : NaN}
                    </span>
                  </div>
                </div>
                <div className="self-start">
                  <div className="bg-black flex items-center gap-3 px-2">
                    <span>
                      $
                      {statData?.periods?.all_time?.quote?.USD?.high
                        ? formatNumberEurope(
                            statData?.periods?.all_time?.quote?.USD?.high
                          )
                        : NaN}
                    </span>
                    <div className="flex items-center  ">
                      <MdArrowDropDown
                        className="text-[40px]  my-[-8px] "
                        color="#F85A58"
                      />

                      <span
                        className={`text-negative  ml-[-8px] font-bold    `}
                      >
                        {(((high - currentRate) / high) * 100).toFixed(2)}%
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <div className="bg-black flex gap-2 px-2">
                  <div className="flex items-center gap-1 w-[118px]">
                    <span className="text-[#999999]">
                      {t("detail.all_time_low")}
                    </span>
                    <IoMdInformationCircleOutline className="text-[#999999]" />
                  </div>
                  <div className="w-[125px]">
                    <span className="text-[#535353] text-[14px] ">
                      {statData?.periods?.all_time?.high_timestamp
                        ? formatDate(statData?.periods?.all_time?.low_timestamp)
                        : NaN}
                    </span>
                  </div>
                </div>
                <div className="self-start">
                  <div>
                    <div className="bg-black  flex items-center gap-3 px-2">
                      <span>
                        $
                        {statData?.periods?.all_time?.quote?.USD?.low
                          ? formatNumberEurope(
                              statData?.periods?.all_time?.quote?.USD?.low
                            )
                          : NaN}
                      </span>
                      <div className="flex items-center  ">
                        <MdArrowDropUp
                          className="text-[40px] my-[-8px]"
                          color="#0ECB81"
                        />
                        <span
                          className={`text-positive  ml-[-8px] font-bold    `}
                        >
                          {(((currentRate - low) / low) * 100).toFixed(2)}%
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <h1 className=" text-[20px] sm:text-[30px] mt-[20px] xl:mt-[0px]  ">
              {quoteData?.name} {t("detail.market_information")}
            </h1>
            <div className="flex flex-col sm:flex-row gap-4  sm:gap-24 xl:gap-12">
              <div className="flex  flex-col gap-4">
                <div className="flex  gap-6">
                  <div className="flex flex-col ">
                    <div className="flex items-center gap-2">
                      <span className="text-gray1">
                        {" "}
                        {t("detail.popularity")}
                      </span>
                      <IoMdInformationCircle className="text-gray1" />
                    </div>
                    <span className="bg-[#21A1EF] rounded-[5px] font-bold text-black text-[12px] px-2 self-start">
                      {t("detail.rank")} #
                      {quoteData?.cmc_rank ? quoteData?.cmc_rank : "NaN"}
                    </span>
                  </div>
                  <div className="flex bg-[#834BFF] self-start items-center gap-2 p-1 rounded-md ">
                    <FaShare className="text-white  " />
                    <span className="">{t("detail.share")}</span>
                  </div>
                </div>
                <div className="flex flex-col">
                  <div className="flex items-center gap-2">
                    <span className="text-gray1">
                      {t("detail.total_market_supply")}
                    </span>
                    <IoMdInformationCircle className="text-gray1" />
                  </div>
                  <div>
                    {quoteData?.max_supply
                      ? formatNumber(quoteData?.max_supply.toFixed(0))
                      : NaN}{" "}
                    {quoteData?.symbol}
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-4">
                <div className="flex flex-col">
                  <div className="flex items-center gap-2">
                    <span className="text-gray1">{t("detail.market_cap")}</span>
                    <IoMdInformationCircle className="text-gray1" />
                  </div>
                  <div className=" flex items-center">
                    <span>
                      {quoteData?.quote?.USD?.volume_change_24h < 0 ? (
                        <MdArrowDropDown
                          className="text-[30px]"
                          color="#F85A58"
                        />
                      ) : (
                        <MdArrowDropUp
                          className="text-[30px]"
                          color="#0ECB81"
                        />
                      )}
                    </span>
                    <span>
                      $
                      {quoteData?.quote?.USD?.market_cap
                        ? quoteData?.quote?.USD?.market_cap.toFixed(0)
                        : NaN}
                    </span>
                  </div>
                </div>
                <div className="flex flex-col">
                  <div className="flex items-center gap-2">
                    <span className="text-gray1">
                      {t("detail.fully_diluted_market_cap")}
                    </span>
                    <IoMdInformationCircle className="text-gray1" />
                  </div>
                  <div>
                    <span>
                      $
                      {quoteData?.quote?.USD?.fully_diluted_market_cap
                        ? formatNumber(
                            quoteData?.quote?.USD?.fully_diluted_market_cap.toFixed(
                              0
                            )
                          )
                        : NaN}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-16 mt-3 w-full ">
            <div className="flex justify-center sm:justify-start flex-col md:flex-row xl:justify-between  gap-8 xl:gap-0  items-start xl:items-center">
              <div className="flex flex-col gap-[16px] md:gap-[68px]    ">
                <div className="flex flex-col ">
                  <div className="flex  gap-2 items-center">
                    <span className="text-gray1">
                      {t("detail.price_change(1h)")}
                    </span>
                    <IoMdInformationCircle className="text-gray1" />
                  </div>
                  <span className="text-[#9E4953]">
                    {quoteData?.quote?.USD?.percent_change_1h
                      ? quoteData?.quote?.USD?.percent_change_1h.toFixed(2)
                      : NaN}
                    %
                  </span>
                </div>
                <div className="flex flex-col gap-4">
                  <div className="flex flex-col">
                    <div className="flex items-center  gap-2">
                      <span className="text-gray1">
                        {t("detail.volume(24h)")}
                      </span>
                      <IoMdInformationCircle className="text-gray1" />
                    </div>
                    <div className="flex items-center gap-8">
                      <div className="flex items-center ">
                        {quoteData?.quote?.USD?.volume_change_24h < 0 ? (
                          <MdArrowDropDown
                            className="text-[30px]"
                            color="#F85A58"
                          />
                        ) : (
                          <MdArrowDropUp
                            className="text-[30px]"
                            color="#0ECB81"
                          />
                        )}
                        <span className="ml-[-2px]">
                          {quoteData?.quote?.USD?.volume_change_24h
                            ? quoteData?.quote?.USD?.volume_change_24h.toFixed(
                                2
                              )
                            : NaN}
                          %
                        </span>
                      </div>
                      <span>
                        $
                        {quoteData?.quote?.USD?.volume_24h
                          ? formatNumber(
                              quoteData?.quote?.USD?.volume_24h.toFixed(0)
                            )
                          : NaN}
                      </span>
                    </div>
                  </div>
                  <div className="hidden sm:flex flex-col gap-1">
                    <div className="flex items-center gap-2">
                      <span> {t("detail.audits")}</span>
                      <IoMdInformationCircleOutline className="text-gray1" />
                    </div>
                    <div className=" flex gap-3 items-center">
                      <SmallBox value={CertiK} name="CertiK" />
                      <SmallBox value={chainsulting} name="Chainsulting" />
                    </div>
                    <div className="flex gap-3 items-center">
                      <SmallBox value={slowmist} name="SLowMist" />
                      <SmallBox value={quant} name="Quantstamp" />
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex flex-col h-full align-middle  gap-[16px] md:gap-[68px] ">
                <div className="flex flex-col ">
                  <div className="flex gap-2 items-center">
                    <span className="text-gray1">
                      {" "}
                      {t("detail.price_change(24h)")}
                    </span>
                    <IoMdInformationCircle className="text-gray1" />
                  </div>
                  <span className="text-[#9E4953]">
                    {quoteData?.quote?.USD?.percent_change_24h
                      ? quoteData?.quote?.USD?.percent_change_24h.toFixed(2)
                      : NaN}
                    %
                  </span>
                </div>
                <div className="flex flex-col  gap-10">
                  <div className="flex flex-col ">
                    <div className="flex items-center gap-2">
                      <span className="text-gray1">
                        {t("detail.circulation_supply")}
                      </span>
                      <IoMdInformationCircle className="text-gray1" />
                    </div>
                    <div>
                      <span>
                        {quoteData?.circulating_supply
                          ? formatNumber(
                              quoteData?.circulating_supply.toFixed(0)
                            )
                          : NaN}{" "}
                        {quoteData?.symbol}
                      </span>
                    </div>
                  </div>
                  <div className="hidden sm:flex flex-col gap-2   py-1 bg-[#0D1321] px-2">
                    <span>{t("detail.socials")}</span>
                    <div className="flex gap-3">
                      <a href={twitter && twitter}>
                        <SmallBox value={twitterC} name="Twitter" />
                      </a>
                      <SmallBox value={telgram} name="Telegram" />
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex flex-col h-full gap-[16px] md:gap-[68px] ">
                <div className="flex flex-col ">
                  <div className="flex gap-2 items-center">
                    <span className="text-gray1">
                      {" "}
                      {t("detail.price_change(7d)")}
                    </span>
                    <IoMdInformationCircle className="text-gray1" />
                  </div>
                  <span className="text-[#9E4953]">
                    {quoteData?.quote?.USD?.percent_change_7d
                      ? quoteData?.quote?.USD?.percent_change_7d.toFixed(2)
                      : NaN}
                    %
                  </span>
                </div>
                <div className="flex flex-col justify-between  gap-[64px]">
                  <div className="flex gap-4">
                    <span className="text-[#4E5258]">{t("detail.ucid")}</span>
                    <div className="bg-slate-900 items-center flex gap-2">
                      <div className="rounded-xl px-2 bg-slate-600 flex items-center gap-2">
                        <span>{id}</span>
                        <MdOutlineContentCopy
                          className="text-[#7E8192] font-bold"
                          onClick={copyToClipboard}
                          style={{ cursor: "pointer" }}
                        />
                      </div>
                      <IoMdInformationCircleOutline className="text-gray1" />
                    </div>
                  </div>

                  <div className=" hidden sm:flex mt-[-40px] md:mt-[0px] p-1 flex-col gap-2">
                    <span>{t("detail.website")}</span>
                    <div className="flex  gap-2">
                      <a href={websiteLink && websiteLink}>
                        <div className=" flex gap-1 bg-gray-700 p-1 items-center bg-[#232532] ">
                          <span>transcan.org</span>
                          <HiExternalLink className="text-[#7E8192] text-[24px]" />
                        </div>
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-col ">
          <div className="flex sm:hidden flex-col gap-1">
            <div className="flex items-center gap-2">
              <span>{t("detail.audits")}</span>
              <IoMdInformationCircleOutline className="text-gray1" />
            </div>
            <div className=" flex gap-3 items-center">
              <SmallBox value={CertiK} name="CertiK" />
              <SmallBox value={chainsulting} name="Chainsulting" />
            </div>
            <div className="flex gap-3 items-center">
              <SmallBox value={slowmist} name="SLowMist" />
              <SmallBox value={quant} name="Quantstamp" />
            </div>
          </div>
        </div>

        <div className="flex sm:hidden  flex-col gap-2  py-1 bg-[#0D1321] px-2">
          <span>{t("detail.socials")}</span>
          <div className="flex gap-3">
            <a href={twitter && twitter}>
              <SmallBox value={twitterC} name="Twitter" />
            </a>
            <SmallBox value={telgram} name="Telegram" />
          </div>
        </div>
        <div className=" flex sm:hidden sm:mt-[-40px] md:mt-[0px] p-1 flex-col gap-2">
          <span>{t("detail.website")}</span>
          <a href={websiteLink && websiteLink}>
            <div className="flex  gap-2">
              <div className=" flex gap-1 bg-gray-700 p-1 items-center bg-[#232532] ">
                <span>transcan.org</span>
                <HiExternalLink className="text-[#7E8192] text-[24px]" />
              </div>
            </div>
          </a>
        </div>
      </div>
    </div>
  );
}

export default Detail;
