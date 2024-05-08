import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import axios from "axios";
import { API } from "./utils/api.js";
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
  } catch (ex) {
    // error
    console.log(ex, "ERROR");
    res.status(404).json({
      status: "failed",
      message: "Something Went Wrong!",
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
    .catch(() => {
      res.status(404).json({
        status: "failed",
        message: "Something Went Wrong!",
      });
    });
});

//   SPECIFIC ID
app.get("/coin/:id", (req, res) => {
  const id = req.params.id;
  axios
    .get(`${API}/info?id=${id}`, {
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
      console.log(err);
      res.status(err?.status || 400).json({
        status: "failed",
        code: err.code || "server Error",
        message: err.message || "Something Went Wrong!",
        error: err,
      });
    });
});

//    Trending Losers and Gainers
app.get("/trending/losers-gainer", async (req, res) => {
  const { sort, time, limit } = req.query;
  if (sort && time && limit) {
    axios
      .get(
        `${API}/trending/gainers-losers?time_period=${time}&sort_dir=${sort}&limit=${limit}`,
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
        res.status(404).json({
          status: "failed",
          message: "Something Went Wrong!",
        });
      });
  } else {
    axios
      .get(`${API}/trending/gainers-losers`, {
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
        res.status(404).json({
          status: "failed",
          message: "Something Went Wrong!",
        });
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
      res.status(404).json({
        status: "failed",
        message: "Something Went Wrong!",
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
      res.status(404).json({
        status: "failed",
        message: "Something Went Wrong!",
      });
    });
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
  } catch (error) {
    console.error(error);
    res.status(404).json({
      status: "failed",
      message: "Something Went Wrong!",
    });
  }
});

export { app };
