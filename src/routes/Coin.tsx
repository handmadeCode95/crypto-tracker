import { useParams } from "react-router";
import styled from "styled-components";
import { useLocation, Outlet, Link, useMatch } from "react-router-dom";
import { useQuery } from "react-query";
import { fetchCoinInfo, fetchCoinTickers } from "../api";
import { Helmet } from "react-helmet";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMoon, faSun } from "@fortawesome/free-solid-svg-icons";
import { isDarkAtom } from "../atoms";
import { useRecoilState } from "recoil";

const Container = styled.div`
  padding: 0px 20px;
  width: 480px;
  margin: 0 auto;
`;

const Header = styled.header`
  height: 10vh;
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  padding: 0 5px 1vh 5px;
  margin-bottom: 10px;
  position: relative;
  div {
    display: flex;
    align-items: center;
  }
  a:last-child {
    transition: color 0.1s ease-in;
    &:hover {
      color: ${(props) => props.theme.accentColor};
    }
  }
`;

const Title = styled.h1<{ length: number }>`
  font-size: ${(props) => (props.length > 12 ? "30px" : "48px")};
  font-weight: 600;
  transition: 0.1s ease-in;
`;

const ModeButton = styled.button`
  position: absolute;
  top: 15px;
  right: 8px;
  color: ${(props) => props.theme.textColor};
  background: none;
  border: none;
  border-radius: 50%;
  transition: 0.1s ease-in;
  &:hover {
    color: ${(props) => props.theme.accentColor};
    cursor: pointer;
  }
`;

const Loader = styled.span`
  text-align: center;
  display: block;
`;

const Overview = styled.div`
  display: flex;
  justify-content: space-between;
  background-color: ${(props) => props.theme.cardColor};
  transition: 0.1s ease-in;
  padding: 10px 20px;
  border-radius: 10px;
`;

const OverviewItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  span:first-child {
    font-size: 10px;
    font-weight: 400;
    text-transform: uppercase;
    margin-bottom: 5px;
  }
`;

const Description = styled.p`
  margin: 20px 0px;
  padding: 0 5px;
  transition: 0.1s ease-in;
`;

const Tabs = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  margin: 25px 0px;
  gap: 10px;
`;

const Tab = styled.span<{ isActive: boolean }>`
  text-align: center;
  text-transform: uppercase;
  font-size: 12px;
  font-weight: 400;
  background-color: ${(props) => props.theme.cardColor};
  padding: 7px 0px;
  border-radius: 10px;
  transition: 0.1s ease-in;
  color: ${(props) =>
    props.isActive ? props.theme.accentColor : props.theme.textColor};
  a {
    transition: 0.1s ease-in;
    display: block;
    &:hover {
      color: ${(props) => props.theme.accentColor};
    }
  }
`;

const Img = styled.img`
  width: 50px;
  height: 50px;
  margin-right: 10px;
`;

interface IRouteState {
  state: {
    name: string;
    symbol: string;
  };
}

interface IInfoData {
  id: string;
  name: string;
  symbol: string;
  rank: number;
  is_new: boolean;
  is_active: boolean;
  type: string;
  description: string;
  message: string;
  open_source: boolean;
  started_at: string;
  development_status: string;
  hardware_wallet: boolean;
  proof_type: string;
  org_structure: string;
  hash_algorithm: string;
  first_data_at: string;
  last_data_at: string;
}

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

const Coin = () => {
  const { coinId } = useParams();
  const { state } = useLocation() as IRouteState;
  const chartMatch = useMatch("/:coinId/chart");
  const priceMatch = useMatch("/:coinId/price");
  const [isDark, setIsDark] = useRecoilState(isDarkAtom);
  const toggleIsDarkAtom = () => setIsDark((current) => !current);

  const { isLoading: infoLoading, data: infoData } = useQuery<IInfoData>(
    ["info", coinId!],
    () => fetchCoinInfo(coinId!)
  );
  const { isLoading: tickersLoading, data: tickersData } =
    useQuery<ITickersData>(["tickers", coinId!], () =>
      fetchCoinTickers(coinId!)
    );

  const loading = infoLoading || tickersLoading;

  return (
    <Container>
      <Helmet>
        <title>{state?.name ? state?.name : infoData?.name}</title>
      </Helmet>
      <Header>
        <Link to={`/${coinId}`}>
          <div>
            {state?.name ? (
              <>
                <Img
                  src={`https://cryptocurrencyliveprices.com/img/${coinId}.png`}
                />
                <Title length={state?.name.length}>{state?.name}</Title>
              </>
            ) : (
              <>
                <Img
                  src={`https://cryptoicon-api.vercel.app/api/icon/${infoData?.symbol.toLowerCase()}`}
                />
                <Title length={infoData?.name.length!}>{infoData?.name}</Title>
              </>
            )}
          </div>
        </Link>
        <ModeButton onClick={toggleIsDarkAtom}>
          {isDark ? (
            <FontAwesomeIcon icon={faSun} size="lg" />
          ) : (
            <FontAwesomeIcon icon={faMoon} size="lg" />
          )}
        </ModeButton>
        <Link to={"/"}>Home</Link>
      </Header>
      {loading ? (
        <Loader>Loading...</Loader>
      ) : (
        <>
          <Overview>
            <OverviewItem>
              <span>Rank:</span>
              <span>{infoData?.rank}</span>
            </OverviewItem>
            <OverviewItem>
              <span>Symbol:</span>
              <span>{infoData?.symbol}</span>
            </OverviewItem>
            <OverviewItem>
              <span>Open Source:</span>
              <span>{infoData?.open_source ? "Yes" : "No"}</span>
            </OverviewItem>
          </Overview>
          <Description>{infoData?.description}</Description>
          <Overview>
            <OverviewItem>
              <span>Total Suply:</span>
              <span>{tickersData?.total_supply.toLocaleString()}</span>
            </OverviewItem>
            <OverviewItem>
              <span>Max Supply:</span>
              <span>
                {tickersData?.max_supply === 0
                  ? "∞"
                  : tickersData?.max_supply.toLocaleString()}
              </span>
            </OverviewItem>
          </Overview>

          <Tabs>
            <Tab isActive={chartMatch !== null}>
              <Link to={`/${coinId}/chart`}>Chart</Link>
            </Tab>
            <Tab isActive={priceMatch !== null}>
              <Link to={`/${coinId}/price`}>Price</Link>
            </Tab>
          </Tabs>

          <Outlet context={coinId} />
        </>
      )}
    </Container>
  );
};

export default Coin;
