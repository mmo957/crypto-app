import "./style/style.css";
import React, { useLayoutEffect, useState } from "react";
import { PieChart, Pie, Cell } from "recharts";
import axios from "axios";
import { API } from "../utils/api";
const data = [
  { name: "BTC", value: 400 },
  { name: "ETH", value: 456 },
  { name: "DİĞER", value: 300 },
];

const COLORS = ["#CE720D", "#DA961B", "#E5B837"];

const RADIAN = Math.PI / 180;
const renderCustomizedLabel = ({
  cx,
  cy,
  midAngle,
  innerRadius,
  outerRadius,
  percent,
  index,
  name,
}) => {
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + Math.cos(-midAngle * RADIAN) * radius;
  const y = cy + Math.sin(-midAngle * RADIAN) * radius;

  console.log(index, "Index");
  return (
    <text
      x={x}
      y={y}
      fill="white"
      // textAnchor="middle"
      textAnchor={index === 1 ? (x > cx ? "start" : "end") : "middle"}
      dominantBaseline="central"
    >
      <tspan className="font-bold text-[20px] ">{name}</tspan>
      <tspan className="font-bold text-[20px]" x={x} dy="1.2em">
        %{(percent * 100).toFixed(1)}
      </tspan>{" "}
      {/* Adjusted dy */}
    </text>
  );
};

const PieChartComponent = () => {
  const [chartData, setChartData] = useState(data);

  const getData = async () => {
    const res = await axios.get(`${API}/market-cap`);
    if (res?.data?.status === "success") {
      const new_data = [
        { name: "BTC", value: res?.data?.data?.btc_dominance },
        { name: "ETH", value: res?.data?.data?.eth_dominance },
        {
          name: "DİĞER",
          value:
            100 -
            res?.data?.data?.btc_dominance -
            res?.data?.data?.eth_dominance,
        },
      ];

      setChartData(new_data);
    }
  };

  useLayoutEffect(() => {
    getData();
  }, []);

  return (
    <PieChart width={350} height={350}>
      <Pie
        data={chartData}
        cx={170}
        cy={170}
        labelLine={false}
        label={renderCustomizedLabel}
        outerRadius={150}
        fill="#8884d8"
        dataKey="value"
      >
        {data.map((entry, index) => (
          <Cell
            key={`cell-${index}`}
            fill={COLORS[index % COLORS.length]}
            index={index}
          />
        ))}
      </Pie>
    </PieChart>
  );
};

export default PieChartComponent;
