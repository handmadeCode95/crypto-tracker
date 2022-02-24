import ApexCharts from "react-apexcharts";
import { useQuery } from "react-query";
import { useOutletContext } from "react-router-dom";
import styled from "styled-components";
import { fetchCoinHistory } from "../api";

const Loader = styled.span`
  text-align: center;
  display: block;
`;

interface IHistoricalData {
  time_open: string;
  time_close: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
  market_cap: number;
}

function Chart() {
  const coinId = useOutletContext<string>();
  const { isLoading, data } = useQuery<IHistoricalData[]>(
    ["ohlcv", coinId],
    () => fetchCoinHistory(coinId),
    {
      refetchInterval: 10000,
    }
  );
  return (
    <div>
      {isLoading ? (
        <Loader>Loading chart...</Loader>
      ) : (
        <ApexCharts
          type="candlestick"
          series={[
            {
              data: data?.map((price) => [
                new Date(price.time_open).getTime(),
                price.open,
                price.high,
                price.low,
                price.close,
              ]),
            },
          ]}
          options={{
            plotOptions: {
              candlestick: {
                colors: {
                  upward: "#DF7D46",
                  downward: "#3C90EB",
                },
              },
            },
            theme: { mode: "dark" },
            chart: {
              height: 500,
              width: 500,
              background: "transparent",
            },
            labels: ["aaa", "bbb", "ccc", "ddd"],
            yaxis: {
              labels: {
                show: false,
                formatter: (value) => value.toFixed(0),
              },
              tooltip: {
                enabled: true,
              },
            },
            xaxis: {
              type: "datetime",
              axisBorder: { show: false },
              axisTicks: { show: false },
              labels: { show: false },
            },
          }}
        />
      )}
    </div>
  );
}

export default Chart;
