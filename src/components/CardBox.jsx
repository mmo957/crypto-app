import React, { useState, useEffect } from "react";
import { MdArrowDropUp } from "react-icons/md";
import { MdArrowDropDown } from "react-icons/md";
import Logo from "./Logo";

// eslint-disable-next-line react/prop-types
function CardBox({ name = "BTC", percentage = -10, logo = "1", index }) {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 640);
  const [is900, setIs900] = useState(window.innerWidth < 870);

  console.log(index, "Id");

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 640);
      setIs900(window.innerWidth < 870);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <div className=" flex w-full items-center justify-between bg-[#646464] p-4 rounded-full ">
      <div className="flex  items-center gap-2">
        <Logo
          logo={logo}
          dim={128}
          width={isMobile ? "40px" : "60px"}
          height={isMobile ? "40px" : "60px"}
        />
        {index === 0 ? (
          <a
            href="https://www.mexc.com/de-DE/auth/signup?inviteCode=1f5Kt"
            className={`text-white ${
              isMobile ? "text-[16px]" : "text-[20px]"
            } `}
          >
            {name}
          </a>
        ) : (
          <span
            className={`text-white ${
              isMobile ? "text-[16px]" : "text-[20px]"
            } `}
          >
            {name}
          </span>
        )}
      </div>
      <div className="flex items-center  ">
        {percentage < 0 ? (
          <MdArrowDropDown className="text-[40px]" color="#F85A58" />
        ) : (
          <MdArrowDropUp className="text-[40px]" color="#0ECB81" />
        )}
        <span
          className={`${
            percentage < 0 ? "text-negative" : "text-positive "
          }  ml-[-8px] font-bold   ${is900 ? "text-[20px]" : "text-[24px]"} `}
        >
          {" "}
          %{percentage < 0 ? percentage.toFixed(2) * -1 : percentage.toFixed(2)}
        </span>
      </div>
    </div>
  );
}

export default CardBox;
