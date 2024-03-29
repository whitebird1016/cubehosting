import styled from "styled-components";
import { Column, DefaultImage, Row } from "..";

const GameCard = (props) => {
  return (
    <Wrapper onClick={props.onClick}>
      <CardBanner url={props.url} />
      <CardContainer>
        <DefaultImage src={props.box} />
        <Text>{props.title}</Text>
      </CardContainer>
      <PriceWrapper>
        <Text>From</Text>
        <Title>${props.price}</Title>
        <Text>USD per Month</Text>
      </PriceWrapper>
    </Wrapper>
  );
};

const Wrapper = styled(Column)`
  position: relative;
  border-radius: 15px;
  cursor: pointer;
  overflow: hidden;
`;
const CardBanner = styled.div`
  position: absolute;
  background-image: url(${(props) => props.url});
  background-repeat: no-repeat;
  background-size: cover;
  background-position: 50%;
  opacity: 0.7;
  filter: blur(2px);
  width: 100%;
  height: 100%;
`;
const CardContainer = styled(Row)`
  justify-content: space-between;
  width: 100%;
  padding: 10px;
  z-index: 3;
  height: 120px;
  color: white;
  font-weight: 700;
  gap: 10px;
  img {
    width: 64px;
    border-radius: 10px;
    max-width: none;
    :hover {
      transform: scale3d(1.1, 1.1, 1);
    }
  }
`;

const PriceWrapper = styled(Column)`
  color: white;
  font-size: 12px;
  font-weight: 700;
  z-index: 3;
  padding: 10px;
  background: rgba(0, 0, 0, 0.2);
  width: 100%;
`;
const Text = styled.div`
  text-align: center;
`;
const Title = styled.div`
  font-size: 32px;
  font-weight: 700;
  text-align: center;
`;
export default GameCard;
