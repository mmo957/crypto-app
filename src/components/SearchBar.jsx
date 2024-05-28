/* eslint-disable react/prop-types */

import { useCallback, useEffect, useState } from "react";
import { IoSearch } from "react-icons/io5";
import { IoMdCloseCircle } from "react-icons/io";
import axios from "axios";
import Logo from "./Logo";
import { API } from "../utils/api";
import { debounce } from "lodash";

const SearchBar = ({
  className = "flex md:hidden",
  listColor = "bg-black",
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchSearchResults = async (query) => {
    if (query.length === 0) {
      setSearchResults([]);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await axios.get(
        `${API}/listings/latest/coins?search=${query}`
      );
      const data = response.data.data;
      const results = data.map((item) => ({
        logo: item?.id,
        fullName: item.name,
        symbol: item.symbol,
      }));
      setSearchResults(results);
    } catch (err) {
      setError("Failed to fetch search results");
    } finally {
      setLoading(false);
    }
  };

  // Debounced version of the fetch function
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedFetchSearchResults = useCallback(
    debounce(fetchSearchResults, 300),
    []
  );

  useEffect(() => {
    if (searchQuery) {
      debouncedFetchSearchResults(searchQuery);
    } else {
      setSearchResults([]);
    }

    // Cleanup function to cancel debounce
    return () => {
      debouncedFetchSearchResults.cancel();
    };
  }, [searchQuery, debouncedFetchSearchResults]);

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleClose = () => {
    setSearchQuery("");
    setSearchResults([]);
  };
  return (
    <div
      className={`relative justify-between items-center gap-2 border-[1px] w-[95%] md:w-full mx-auto py-2 border-solid border-gray px-4 rounded-full ${className}`}
    >
      <IoSearch color="white" className="text-[20px]" />
      <div className="flex items-center flex-1">
        <input
          type="text"
          className="appearance-none bg-transparent text-white font-normal focus:outline-none flex-1"
          placeholder="Assets,Wallets,ENS"
          value={searchQuery}
          onChange={handleSearch}
        />
        <IoMdCloseCircle
          color="white"
          className={`text-[20px] cursor-pointer ${
            !searchQuery.length > 0 ? "opacity-0" : "opacity-100"
          }`}
          onClick={handleClose}
        />
      </div>
      <span className="bg-gray text-white rounded-[10px] w-[30px] h-[30px] flex items-center justify-center">
        /
      </span>
      {searchResults.length > 0 && searchQuery.length > 0 && !loading && (
        <div
          className={`absolute w-full top-[110%] left-0 right-0  rounded-b-md overflow-hidden z-10 ${listColor}`}
        >
          <ul className="px-[10px]">
            {searchResults.slice(0, 6).map((item, index) => (
              <a
                key={index}
                className="p-2 text-white cursor-pointer flex justify-between items-center"
                href={`/overview/${item.logo}`}
              >
                <div className="flex gap-[10px]">
                  <Logo logo={item.logo} width="25px" height="20px" dim={64} />
                  <div className="flex gap-[5px]">
                    <h5 className="text-[15px] text-white text-start font-bold cursor-pointer">
                      {item.fullName}
                    </h5>
                    <span className="text-[15px] text-gray1">
                      {item.symbol}
                    </span>
                  </div>
                </div>
                <span className="text-gray1">#{item.logo}</span>
              </a>
            ))}
          </ul>
        </div>
      )}
      {loading && searchQuery.length > 0 && (
        <div
          className={`absolute w-full top-[110%] left-0 right-0 ${listColor} rounded-b-md overflow-hidden z-10`}
        >
          <ul className="px-[10px]">
            {Array.from({ length: 6 }).map((_, index) => (
              <div
                key={index}
                className="p-2 text-white cursor-pointer flex justify-between items-center animate-pulse"
              >
                <div className="flex gap-[10px] items-center">
                  <div className="bg-gray1 w-[25px] h-[25px] rounded-full"></div>
                  <div className="bg-gray1 h-[15px] w-[150px] rounded"></div>
                </div>
                <div className="bg-gray1 h-[15px] w-[30px] rounded"></div>
              </div>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default SearchBar;
