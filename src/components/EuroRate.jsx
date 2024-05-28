import axios from "axios";
import { useEffect, useState } from "react";

function EuroRate() {
  const [euroRate, setEuroRate] = useState(1);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const resp = await axios.get(
          "https://api.freecurrencyapi.com/v1/latest?apikey=fca_live_gcy4A5Rs7hPfbBFbtbxwnJmSeobKh0BRxz5B8OVk&currencies=EUR%2CUSD%2CCAD"
        );
        setEuroRate(resp?.data?.data?.EUR);
      } catch (error) {
        console.error("Error fetching euro rate:", error);
      }
    };

    fetchData();

    // Return a cleanup function
    return () => {
      // Cleanup code here if needed
    };
  }, []); // Empty dependency array to run only once on mount

  return <span>{euroRate.toFixed(2)}</span>;
}

export default EuroRate;
