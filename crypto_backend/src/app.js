import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import axios from "axios";
import { API } from "./utils/api.js";
import NodeCache from "node-cache";

//  ==================> SEARCH QUERY AND COIN DATA
const apiCache = new NodeCache({ stdTTL: 60 * 5 }); // Cache for 5 minutes
const app = express();

app.use(
  cors({
    origin: "*",
    credentials: true,
  })
);

app.use(express.json({ limit: "16kb" }));

// Add support for parsing URL-encoded data and increase the limit to 16kb
//  Data from url
app.use(express.urlencoded({ extended: true, limit: "16kb" }));

// Serve static files from the "public" directory
app.use(express.static("public"));
app.use(cookieParser());

//   Main Starter Route
app.get("/", async (req, res) => {
  res.status(200).json({
    status: "success",
    message: "Welcome to the Crypto API",
  });
});

//    Latest Data Route
app.get("/latest", async (req, res) => {
  let response;
  try {
    response = await axios.get(`${API}/listings/latest`, {
      headers: {
        "X-CMC_PRO_API_KEY": "e987b05b-c72d-49cc-82ce-4a3a2ddfa9d0",
      },
    });
    res.status(200).json({
      status: "success",
      data: response?.data?.data,
    });
  } catch (err) {
    // error
    res.status(err?.status || 400).json({
      status: "failed",
      code: err.code || "server Error",
      message: err.message || "Something Went Wrong!",
      error: err,
    });
  }
});

//  NOW FOR SPECIFIC COIN
app.get("/specific/:coin", (req, res) => {
  const coin = req.params.coin;
  axios
    .get(`${API}/info?slug=${coin}`, {
      headers: {
        "X-CMC_PRO_API_KEY": "e987b05b-c72d-49cc-82ce-4a3a2ddfa9d0",
      },
    })
    .then((response) => {
      res.status(200).json({
        status: "success",
        data: response?.data?.data,
      });
    })
    .catch((err) => {
      res.status(err?.status || 400).json({
        status: "failed",
        code: err.code || "server Error",
        message: err.message || "Something Went Wrong!",
        error: err,
      });
    });
});

//   SPECIFIC ID
app.get("/coin/:id", async (req, res) => {
  const id = req.params.id;

  // Check if data is cached
  const cachedData = apiCache.get(id);
  if (cachedData) {
    return res.status(200).json({
      status: "success",
      data: cachedData,
    });
  }

  // If data is not cached, fetch from external API
  try {
    const response = await axios.get(`${API}/info?id=${id}`, {
      headers: {
        "X-CMC_PRO_API_KEY": "e987b05b-c72d-49cc-82ce-4a3a2ddfa9d0",
      },
    });

    const responseData = response?.data?.data;

    // Cache the fetched data
    apiCache.set(id, responseData);

    res.status(200).json({
      status: "success",
      data: responseData,
    });
  } catch (err) {
    console.log(err);
    res.status(err?.status || 400).json({
      status: "failed",
      code: err.code || "server Error",
      message: err.message || "Something Went Wrong!",
      error: err,
    });
  }
});

//    Trending Losers and Gainers

app.get("/trending/losers-gainer", async (req, res) => {
  const { sort, time, limit } = req.query;
  const cacheKey = `${sort}-${time}-${limit}`;

  // Check if data is cached
  const cachedData = apiCache.get(cacheKey);
  if (cachedData) {
    return res.status(200).json({
      status: "success",
      data: cachedData,
    });
  }

  // If data is not cached, fetch from external API
  const url =
    time && sort && limit
      ? `${API}/trending/gainers-losers?time_period=${time}&sort_dir=${sort}&limit=${limit}`
      : `${API}/trending/gainers-losers`;

  try {
    const response = await axios.get(url, {
      headers: {
        "X-CMC_PRO_API_KEY": "e987b05b-c72d-49cc-82ce-4a3a2ddfa9d0",
      },
    });

    const responseData = response?.data?.data;

    // Cache the fetched data
    apiCache.set(cacheKey, responseData);

    res.status(200).json({
      status: "success",
      data: responseData,
    });
  } catch (err) {
    console.log(err);
    res.status(err?.status || 400).json({
      status: "failed",
      code: err.code || "server Error",
      message: err.message || "Something Went Wrong!",
      error: err,
    });
  }
});

//    TRENDING LATEST
app.get("/trending/latest", async (req, res) => {
  let { time } = req.query;
  if (!time) {
    time = "24h";
  }

  axios
    .get(`${API}/trending/latest?time_period=${time}`, {
      headers: {
        "X-CMC_PRO_API_KEY": "e987b05b-c72d-49cc-82ce-4a3a2ddfa9d0",
      },
    })
    .then((response) => {
      console.log(response.data);
      res.status(200).json({
        status: "success",
        data: response?.data?.data,
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(err?.status || 400).json({
        status: "failed",
        code: err.code || "server Error",
        message: err.message || "Something Went Wrong!",
        error: err,
      });
    });
});

//  Market CAP
app.get("/market-cap", async (req, res) => {
  axios
    .get(`https://pro-api.coinmarketcap.com/v1/global-metrics/quotes/latest`, {
      headers: {
        "X-CMC_PRO_API_KEY": "e987b05b-c72d-49cc-82ce-4a3a2ddfa9d0",
      },
    })
    .then((response) => {
      console.log(response.data);
      res.status(200).json({
        status: "success",
        data: response?.data?.data,
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(err?.status || 400).json({
        status: "failed",
        code: err.code || "server Error",
        message: err.message || "Something Went Wrong!",
        error: err,
      });
    });
});

//   Quotes Latest   QUERY ID --------------------->

app.get("/quotes/latest", async (req, res) => {
  const { id } = req.query;
  if (!id) {
    return res.status(404).json({
      status: "failed",
      message: "Please Provide Id",
    });
  }

  const cacheKey = `quote-${id}`;

  // Check if data is cached
  const cachedData = apiCache.get(cacheKey);
  if (cachedData) {
    return res.status(200).json({
      status: "success",
      data: cachedData,
    });
  }

  // If data is not cached, fetch from external API
  try {
    const response = await axios.get(
      `https://pro-api.coinmarketcap.com/v2/cryptocurrency/quotes/latest?id=${id}`,
      {
        headers: {
          "X-CMC_PRO_API_KEY": "e987b05b-c72d-49cc-82ce-4a3a2ddfa9d0",
        },
      }
    );

    const responseData = response?.data?.data;

    // Cache the fetched data
    apiCache.set(cacheKey, responseData);

    res.status(200).json({
      status: "success",
      data: responseData,
    });
  } catch (err) {
    console.log(err);
    res.status(err?.status || 400).json({
      status: "failed",
      code: err.code || "server Error",
      message: err.message || "Something Went Wrong!",
      error: err,
    });
  }
});
//   OHLCV LATEST   QUERY ID --------------------->
app.get("/ohlcv/latest", async (req, res) => {
  const { id } = req.query;
  if (id) {
    axios
      .get(
        `https://pro-api.coinmarketcap.com/v2/cryptocurrency/ohlcv/latest?id=${id}`,
        {
          headers: {
            "X-CMC_PRO_API_KEY": "e987b05b-c72d-49cc-82ce-4a3a2ddfa9d0",
          },
        }
      )
      .then((response) => {
        res.status(200).json({
          status: "success",
          data: response?.data?.data,
        });
      })
      .catch((err) => {
        console.log(err);
        res.status(err?.status || 400).json({
          status: "failed",
          code: err.code || "server Error",
          message: err.message || "Something Went Wrong!",
          error: err,
        });
      });
  } else
    res.status(404).json({
      status: "failed",
      message: "Please Provide Id",
    });
});
//   Listings Latest--------------------->
app.get("/listings/latest", async (req, res) => {
  axios
    .get(
      `https://pro-api.coinmarketcap.com/v1/cryptocurrency/listings/latest?limit=1000`,
      {
        headers: {
          "X-CMC_PRO_API_KEY": "e987b05b-c72d-49cc-82ce-4a3a2ddfa9d0",
        },
      }
    )
    .then((response) => {
      console.log(response.data);
      res.status(200).json({
        status: "success",
        data: response?.data?.data,
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(err?.status || 400).json({
        status: "failed",
        code: err.code || "server Error",
        message: err.message || "Something Went Wrong!",
        error: err,
      });
    });
});

//   BOTH FOR OLD AND NEW

app.get("/listings/latest/coins", async (req, res) => {
  const { search } = req.query;

  // Check if data is cached
  const cachedData = apiCache.get("coinData");
  if (cachedData) {
    // Search within cached data
    const filteredData = searchData(cachedData, search);
    if (filteredData.length > 0) {
      return res.status(200).json({
        status: "success",
        data: filteredData,
      });
    }
  }

  // If data is not cached or search result is not found in cache, fetch from external API
  try {
    const [latestResponse, newResponse] = await Promise.all([
      axios.get(
        `https://pro-api.coinmarketcap.com/v1/cryptocurrency/listings/latest?limit=5000`,
        {
          headers: {
            "X-CMC_PRO_API_KEY": "e987b05b-c72d-49cc-82ce-4a3a2ddfa9d0",
          },
        }
      ),
      axios.get(
        `https://pro-api.coinmarketcap.com/v1/cryptocurrency/listings/new?limit=5000`,
        {
          headers: {
            "X-CMC_PRO_API_KEY": "e987b05b-c72d-49cc-82ce-4a3a2ddfa9d0",
          },
        }
      ),
    ]);

    const latestData = latestResponse?.data?.data || [];
    const newData = newResponse?.data?.data || [];
    const combinedData = [...latestData, ...newData];

    // Cache the fetched data
    apiCache.set("coinData", combinedData);

    const filteredData = searchData(combinedData, search);
    res.status(200).json({
      status: "success",
      data: filteredData,
    });
  } catch (err) {
    console.log(err);
    res.status(err?.response?.status || 400).json({
      status: "failed",
      code: err.code || "server_error",
      message: err.message || "Something Went Wrong!",
      error: err,
    });
  }
});

const searchData = (data, search) => {
  return data.filter((item) => {
    return (
      item?.name?.toLowerCase().includes(search.toLowerCase()) ||
      item?.symbol?.toLowerCase().includes(search.toLowerCase())
    );
  });
};

//   PRICE PERFORMANCE STATS   QUERY ID TIME ---------------->
app.get("/price-performance-stats/latest", async (req, res) => {
  const { id, time } = req.query;

  if (!id) {
    return res.status(404).json({
      status: "failed",
      message: "Please Provide Id",
    });
  }

  const cacheKey = `pricePerformance-${id}-${time || "all_time"}`;

  // Check if data is cached
  const cachedData = apiCache.get(cacheKey);
  if (cachedData) {
    return res.status(200).json({
      status: "success",
      data: cachedData,
    });
  }

  // If data is not cached, fetch from external API
  try {
    const response = await axios.get(
      `https://pro-api.coinmarketcap.com/v2/cryptocurrency/price-performance-stats/latest?id=${id}&time_period=${time || "all_time"}`,
      {
        headers: {
          "X-CMC_PRO_API_KEY": "e987b05b-c72d-49cc-82ce-4a3a2ddfa9d0",
        },
      }
    );

    const responseData = response?.data?.data;

    // Cache the fetched data
    apiCache.set(cacheKey, responseData);

    res.status(200).json({
      status: "success",
      data: responseData,
    });
  } catch (err) {
    console.log(err);
    res.status(err?.status || 400).json({
      status: "failed",
      code: err.code || "server Error",
      message: err.message || "Something Went Wrong!",
      error: err,
    });
  }
});
//  Fear Index
app.get("/fear-greed-index", async (req, res) => {
  const options = {
    method: "GET",
    url: "https://fear-and-greed-index.p.rapidapi.com/v1/fgi",
    headers: {
      "X-RapidAPI-Key": "1736f6549emsh7caf2598c9f1c47p1c5a08jsnb1af21fa6a21",
      "X-RapidAPI-Host": "fear-and-greed-index.p.rapidapi.com",
    },
  };

  try {
    const response = await axios.request(options);
    console.log(response.data.fgi);
    res.status(200).json({
      status: "success",
      data: response.data.fgi,
    });
  } catch (err) {
    res.status(err?.status || 400).json({
      status: "failed",
      code: err.code || "server Error",
      message: err.message || "Something Went Wrong!",
      error: err,
    });
  }
});

export { app };
