import styled from "styled-components";
import { Column, DefaultImage, Row } from "../components/Element";
import BackgroundCard from "../components/Element/Card/backgroundCard";
import GameCard from "../components/Element/Card/gameCard";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { gameitems } from "../assets/json/gamedata";
import { useEffect } from "react";
import { ARK } from "../components/Image";
const items = [];
const tapitems = [{ title: "Games" }];

const Landing = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [auth, setAuth] = useState(0);
  const navigate = useNavigate();
  const handleTabClick = (index) => {
    setActiveTab(index);
  };
  useEffect(() => {
    if (localStorage.getItem("auth")) {
      setAuth(true);
    }
  }, []);
  const handleItemClick = (data) => {
    if (auth) {
      navigate("/purchase", {
        state: {
          data: data,
        },
      });
    } else {
      navigate("/login", {
        state: {
          data: data,
        },
      });
    }
  };
  return (
    <Wrapper length={gameitems.length}>
      <Banner>
        <DefaultImage src={ARK} />
        <BannerContainer>
          <BannerTitle>Our Gaming Services</BannerTitle>
        </BannerContainer>
      </Banner>
      <CreeperSection>
        {items.map((items, key) => (
          <BackgroundCard
            key={key}
            content1={items.content1}
            content2={items.content2}
            bntext={items.bntext}
            title={items.title}
          />
        ))}
      </CreeperSection>
      <TapWrapper>
        {tapitems.map((items, key) => (
          <TapItem
            key={key}
            active={key === activeTab}
            onClick={() => handleTabClick(key)}
          >
            {items.title}
          </TapItem>
        ))}
      </TapWrapper>
      <CreeperSection>
        {gameitems.map((items, key) => (
          <GameCard
            url={items.url}
            title={items.title}
            price={items.price1}
            key={key}
            box={items.box}
            onClick={() => handleItemClick(items)}
          />
        ))}
      </CreeperSection>
    </Wrapper>
  );
};
const Wrapper = styled(Column)`
  width: 100%;
  background-color: #313131;
  height: 100vh;
  @media screen and (max-width: 600px) {
    height: 100%;
  }
  gap: 10px;
`;

const Banner = styled(Column)`
  width: 100%;
  position: relative;
  height: 32vh;
  img {
    position: absolute;
    height: 100%;
    mask-image: linear-gradient(#fff, transparent);
    width: 100%;
    object-fit: cover;
  }
`;
const BannerContainer = styled(Row)`
  height: 100%;
`;
const BannerTitle = styled.h1`
  font-weight: 600;
  color: #fff;
  text-align: center;
  text-shadow: 2px 2px 1px #191919;
  z-index: 2;
`;
const CreeperSection = styled(Row)`
  display: grid;
  padding: 20px;
  gap: 20px;
  max-width: 1200px;
  width: 100%;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
`;
const TapWrapper = styled.ul`
  display: flex;
  justify-content: center;
  text-transform: uppercase;
  border-bottom: 1px solid #dbdbdb;
  border-bottom-color: hsla(0, 0%, 100%, 0.04);
  list-style: none;
  color: white;
  margin-bottom: 10px;
  overflow-x: auto;
  width: 100%;
  @media screen and (max-width: 600px) {
    justify-content: flex-start;
  }
`;
const TapItem = styled.li`
  text-align: start;
  padding: 15px 25px;
  font-size: 14px;
  font-weight: 500;
  border-bottom: ${(props) =>
    props.active ? "2px solid #06c200" : "2px solid #06c2002px solid #31313"};
`;
export default Landing;
