import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Helmet } from "react-helmet";
import { useQuery } from "react-query";
import { Link } from "react-router-dom";
import styled from "styled-components";
import { fetchCoins } from "../api";
import { faMoon, faSun } from "@fortawesome/free-solid-svg-icons";
import { useRecoilState } from "recoil";
import { isDarkAtom } from "../atoms";

const Container = styled.div`
  padding: 0px 20px;
  width: 480px;
  margin: 0 auto;
`;

const Header = styled.header`
  height: 10vh;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 10px;
  position: relative;
`;

const CoinsList = styled.ul``;

const Coin = styled.li`
  background-color: ${(props) => props.theme.cardColor};
  color: ${(props) => props.theme.textColor};
  margin-bottom: 10px;
  border-radius: 10px;
  transition: 0.1s ease-in;
  a {
    display: flex;
    align-items: center;
    transition: color 0.1s ease-in;
    padding: 20px;
  }
  &:hover {
    a {
      color: ${(props) => props.theme.accentColor};
    }
  }
`;

const Title = styled.h1`
  font-size: 48px;
  font-weight: 600;
  transition: 0.1s ease-in;
`;

const ModeButton = styled.button`
  position: absolute;
  top: 15px;
  right: 0;
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

interface IImg {
  size: string;
}

const Img = styled.img<IImg>`
  width: ${(props) => props.size};
  height: ${(props) => props.size};
  margin-right: 10px;
  image-rendering: -webkit-optimize-contrast;
`;

interface ICoin {
  id: string;
  name: string;
  symbol: string;
  rank: number;
  is_new: boolean;
  is_active: boolean;
  type: string;
}

const Coins = () => {
  const [isDark, setIsDark] = useRecoilState(isDarkAtom);
  const toggleIsDarkAtom = () => setIsDark((current) => !current);
  const { isLoading, data } = useQuery<ICoin[]>("allCoins", fetchCoins);

  return (
    <Container>
      <Helmet>
        <title>React Coins</title>
      </Helmet>
      <Header>
        <Img src={`${process.env.PUBLIC_URL}/logo192.png`} size="50px" />
        <Title>React Coins</Title>
        <ModeButton onClick={toggleIsDarkAtom}>
          {isDark ? (
            <FontAwesomeIcon icon={faSun} size="lg" />
          ) : (
            <FontAwesomeIcon icon={faMoon} size="lg" />
          )}
        </ModeButton>
      </Header>
      {isLoading ? (
        <Loader>Loading...</Loader>
      ) : (
        <CoinsList>
          {data?.slice(0, 100).map((coin) => (
            <Coin key={coin.id}>
              <Link
                to={`/${coin.id}`}
                state={{
                  name: coin.name,
                  symbol: coin.symbol.toLowerCase(),
                }}
              >
                <Img
                  src={`https://cryptocurrencyliveprices.com/img/${coin.id}.png`}
                  size="35px"
                />
                {coin.name} &rarr;
              </Link>
            </Coin>
          ))}
        </CoinsList>
      )}
    </Container>
  );
};

export default Coins;
