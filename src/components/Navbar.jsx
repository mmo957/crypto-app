import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { FaAngleDown, FaArrowRight } from "react-icons/fa6";
import { CgMenuGridR } from "react-icons/cg";
import { Link, useParams } from "react-router-dom";
import SearchBar from "./SearchBar";
import axios from "axios";
import { API } from "../utils/api";
import { FaLongArrowAltDown, FaLongArrowAltUp } from "react-icons/fa";
import Marquee from "react-fast-marquee";
import Logo from "./Logo";

const links = [
  {
    title: "links.home",
    path: "/",
  },
  {
    title: "links.weekly_exchange",
    path: "/weekly-exchange",
  },
];

// eslint-disable-next-line react/prop-types
const Navbar = ({ className = "w-[95%] max-w-full md:w-[90%]" }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const params = useParams();

  const { i18n, t } = useTranslation();

  //    MARQUEE DATA
  const [trendingSliderData, setTrendingSliderData] = useState([]);

  const getTrendingSliderData = async () => {
    try {
      const response = await axios.get(`${API}/trending/latest`);

      //   MARQUEE DATA
      const arrSlider = response?.data?.data.slice(0, 50);
      const arrSlider1 = arrSlider.map((item) => ({
        percentage: item?.quote?.USD?.percent_change_24h,
        price: item?.quote?.USD?.price,
        logo: item?.id,
        fullName: item.name,
        symbol: item.symbol,
      }));
      setTrendingSliderData(arrSlider1);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getTrendingSliderData();
  }, []);

  const [selectedLanguage, setSelectedLanguage] = useState(
    window.navigator.language?.split("-")[0] || "en"
  );

  // Function to handle language change
  const handleLanguageChange = (e) => {
    const selectedLanguage = e.target.value;
    setSelectedLanguage(selectedLanguage);
    i18n.changeLanguage(selectedLanguage);
  };
  return (
    <>
      <div
        className={`flex  justify-between py-2 gap-[10px] max-w-full  mx-auto ${className} items-center`}
      >
        <Link
          to={"/"}
          className="text-[30px] font-normal flex-1 text-left text-white"
        >
          Coinscore.io
        </Link>
        <div
          className={`flex gap-[20px] justify-between ${
            params?.id ? "bg-black" : "bg-[#1e1e1e]"
          } items-center flex-1 px-2 py-2 rounded-[5px]`}
        >
          <span className="relative">
            <CgMenuGridR
              className="text-[30px] cursor-pointer hover:text-white/50 text-white transition-all"
              onMouseEnter={() => setIsMenuOpen(!isMenuOpen)}
            />
            <div
              className={`absolute top-[30px] left-0 mt-2 bg-gray-800 z-10 text-white py-2 flex flex-col gap-[20px] px-4  max-w-[300px] w-[160px] md:w-[250px]   rounded-md shadow-lg bg-gray transition-opacity duration-300 ${
                isMenuOpen
                  ? "opacity-100 pointer-events-auto"
                  : "opacity-0 pointer-events-none"
              }`}
              onMouseLeave={() => setIsMenuOpen(!isMenuOpen)}
            >
              {links.map(({ title, path }, index) => (
                <Link
                  to={path}
                  key={index}
                  className="flex items-center gap-[10px] group relative"
                >
                  {" "}
                  <div className="flex flex-col gap-[5px] items-center md:items-start flex-1">
                    <span className="text-white text-[16px] font-semibold">
                      {t(title)}
                    </span>
                  </div>
                  <FaArrowRight className="text-white opacity-0 group-hover:opacity-100 absolute right-0 top-1/2 transform -translate-y-1/2 transition-opacity duration-300 md:block hidden" />
                </Link>
              ))}
            </div>
          </span>
          <div className="flex  gap-4 ">
            {/*   SEARCH BAR --------------> */}

            <SearchBar className="hidden md:flex" />
            {/*    Select Box for language */}
            <div className="relative">
              <select
                className="appearance-none bg-gray border border-white text-white p-2 pr-8 rounded "
                value={selectedLanguage}
                onChange={handleLanguageChange}
              >
                <option value="tr">Turkish</option>
                <option value="de">German</option>
                <option value="en">English</option>
              </select>
              <span className="absolute right-2 top-[14px] text-white pointer-events-none ">
                <FaAngleDown className="text-[12px]" />
              </span>
            </div>
          </div>
        </div>
      </div>
      <SearchBar listColor="bg-gray" />
      <div className="max-w-full my-2 py-2 bg-[rgba(105,102,102,0.7)]">
        <Marquee pauseOnHover="true">
          {trendingSliderData.map((item, idx) => (
            <a
              key={idx}
              className="flex gap-[8px] mx-4 items-center"
              href={`/overview/${item.logo}`}
            >
              <Logo logo={item.logo} width="25px" height="20px" dim={64} />
              <h5 className="text-[15px] text-white text-bold">
                {item.fullName}({item.symbol})
              </h5>
              <span className="text-white">${item.price.toFixed(2)}</span>
              <span
                className={`${
                  item?.percentage < 0 ? "text-negative" : "text-positive "
                } flex gap-1 items-center`}
              >
                {" "}
                {item?.percentage < 0
                  ? item?.percentage.toFixed(2) * -1
                  : item?.percentage.toFixed(2)}
                %
                <span>
                  {item?.percentage < 0 ? (
                    <FaLongArrowAltDown
                      className="text-[24px] font-bold  "
                      color="#F85A58"
                    />
                  ) : (
                    <FaLongArrowAltUp
                      className="text-[24px] font-bold"
                      color="#0ECB81"
                    />
                  )}
                </span>
              </span>
            </a>
          ))}
        </Marquee>
      </div>
    </>
  );
};

export default Navbar;
