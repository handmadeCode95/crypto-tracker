import styled from "styled-components";
import { useQuery } from "react-query";
import { useOutletContext } from "react-router-dom";

const Overview = styled.div`
  display: flex;
  justify-content: space-between;
  background-color: ${(props) => props.theme.cardColor};
  padding: 10px 20px;
  border-radius: 10px;
  margin-bottom: 20px;
  transition: 0.1s ease-in;
`;

interface IOverviewItem {
  isRise?: boolean;
}

const OverviewItem = styled.div<IOverviewItem>`
  display: flex;
  flex-direction: column;
  align-items: center;
  span:first-child {
    font-size: 10px;
    font-weight: 400;
    text-transform: uppercase;
    margin-bottom: 5px;
  }
  .currentPrice {
    color: ${(props) => props.theme.accentColor};
  }
  span:last-child {
    color: ${(props) =>
      props.isRise !== undefined
        ? props.isRise
          ? props.theme.upward
          : props.theme.downward
        : null};
  }
`;

const Loader = styled.span`
  text-align: center;
  display: block;
`;

interface ITickersData {
  id: string;
  name: string;
  symbol: string;
  rank: number;
  circulating_supply: number;
  total_supply: number;
  max_supply: number;
  beta_value: number;
  first_data_at: string;
  last_updated: string;
  quotes: {
    USD: {
      ath_date: string;
      ath_price: number;
      market_cap: number;
      market_cap_change_24h: number;
      percent_change_1h: number;
      percent_change_1y: number;
      percent_change_6h: number;
      percent_change_7d: number;
      percent_change_12h: number;
      percent_change_15m: number;
      percent_change_24h: number;
      percent_change_30d: number;
      percent_change_30m: number;
      percent_from_price_ath: number;
      price: number;
      volume_24h: number;
      volume_24h_change_24h: number;
    };
  };
}

function Price() {
  const coinId = useOutletContext<string>();
  const { isLoading, data } = useQuery<ITickersData>(["tickers", coinId!], {
    refetchInterval: 5000,
  });
  const priceData = data?.quotes.USD;

  return isLoading ? (
    <Loader>Loading chart...</Loader>
  ) : (
    <>
      <Overview>
        <OverviewItem>
          <span>Current Prices:</span>
          <span className="currentPrice">
            ${priceData?.price.toLocaleString()}
          </span>
        </OverviewItem>
        <OverviewItem
          isRise={priceData?.percent_change_12h! >= 0 ? true : false}
        >
          <span>Change 12 Hours :</span>
          <span>{priceData?.percent_change_12h}%</span>
        </OverviewItem>
        <OverviewItem
          isRise={priceData?.percent_change_24h! >= 0 ? true : false}
        >
          <span>Change 24 Hours :</span>
          <span>{priceData?.percent_change_24h}%</span>
        </OverviewItem>
        <OverviewItem
          isRise={priceData?.percent_change_7d! >= 0 ? true : false}
        >
          <span>Change 7 days</span>
          <span>{priceData?.percent_change_7d}%</span>
        </OverviewItem>
      </Overview>
      <Overview>
        <OverviewItem>
          <span>All Time High</span>
          <span>${priceData?.ath_price.toLocaleString()}</span>
        </OverviewItem>
        <OverviewItem
          isRise={priceData?.percent_from_price_ath! >= 0 ? true : false}
        >
          <span>From All Time High</span>
          <span>{priceData?.percent_from_price_ath}%</span>
        </OverviewItem>
        <OverviewItem>
          <span>All Time High Date</span>
          <span>{priceData?.ath_date.substring(0, 10)}</span>
        </OverviewItem>
        <OverviewItem>
          <span>Frist Data At</span>
          <span>{data?.first_data_at.substring(0, 10)}</span>
        </OverviewItem>
      </Overview>
    </>
  );
}

export default Price;
