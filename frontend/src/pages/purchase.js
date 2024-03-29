import styled from "styled-components";
import { Column, DefaultImage, Row } from "../components/Element";
import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import { Vector } from "../components/Image";
import Button from "../components/Element/button";

const Purchase = () => {
  const location = useLocation();
  const [selectedData, setSelectedData] = useState(location.state.data);
  const navigate = useNavigate();
  const handleClick = (data, flag) => {
    navigate("/payment", {
      state: {
        data: data,
        flag: flag,
      },
    });
  };
  return (
    <Wrapper>
      {selectedData && (
        <Banner>
          <BannerImage src={selectedData.background} />
          <BannerContainer>
            <Card>
              <CardPrice>
                <PriceTitle>{selectedData.price1} </PriceTitle>
                <PriceGeneral> / per month</PriceGeneral>
              </CardPrice>
              <CardTitle>
                <CardTitleHeader>Budget</CardTitleHeader>{" "}
              </CardTitle>
              <CardDetail>
                <CardDetailItem>
                  <DefaultImage src={Vector} />
                  <>vCore {selectedData.cpu1}</>
                </CardDetailItem>
                <CardDetailItem>
                  <DefaultImage src={Vector} />
                  <>Ram {selectedData.ram1}GB</>
                </CardDetailItem>
                <CardDetailItem>
                  <DefaultImage src={Vector} />
                  <>SSD {selectedData.ssd1}GB</>
                </CardDetailItem>
              </CardDetail>
              <Button
                text="GET STARTED"
                width="100%"
                radius="6px"
                fweight="500"
                color="white"
                fsize="16px"
                padding="15px"
                onClick={() => handleClick(selectedData, 1)}
              />
            </Card>
            <Card>
              <CardPrice>
                <PriceTitle>{selectedData.price2} </PriceTitle>
                <PriceGeneral> / per month</PriceGeneral>
              </CardPrice>
              <CardTitle>
                <CardTitleHeader>Performance</CardTitleHeader>{" "}
              </CardTitle>
              <CardDetail>
                <CardDetailItem>
                  <DefaultImage src={Vector} />
                  <>vCore {selectedData.cpu2}</>
                </CardDetailItem>
                <CardDetailItem>
                  <DefaultImage src={Vector} />
                  <>Ram {selectedData.ram2}GB</>
                </CardDetailItem>
                <CardDetailItem>
                  <DefaultImage src={Vector} />
                  <>SSD {selectedData.ssd2}GB</>
                </CardDetailItem>
              </CardDetail>
              <Button
                text="GET STARTED"
                width="100%"
                radius="6px"
                fweight="500"
                color="white"
                fsize="16px"
                padding="15px"
                onClick={() => handleClick(selectedData, 2)}
              />
            </Card>
          </BannerContainer>
        </Banner>
      )}
    </Wrapper>
  );
};

const Wrapper = styled(Column)`
  background-color: #313131;
  width: 100%;
  color: white;
  height: 100vh;
  @media screen and (max-width: 640px) {
    height: 100%;
  }
`;
const Banner = styled(Column)`
  width: 100%;
  position: relative;
  justify-content: center;
  align-items: center;
  height: 100%;
`;
const BannerImage = styled(DefaultImage)`
  position: absolute;
  height: 100%;
  mask-image: linear-gradient(#fff, transparent);
  width: 100%;
  object-position: top;
  margin-top: 50px;
  object-fit: cover;
`;
const BannerContainer = styled(Row)`
  height: 100%;
  gap: 40px;
  margin-top: 50px;
  @media screen and (max-width: 640px) {
    flex-direction: column;
    margin-top: 100px;
    margin-bottom: 50px;
  }
`;

const Card = styled(Column)`
  padding: 30px 20px;
  gap: 40px;
  background: rgb(30, 30, 30);
  border-radius: 20px;
  width: 300px;
  height: 450px;
  gap: 30px;
  z-index: 1;
  opacity: 0.7;
  font-size: 14px;
  justify-content: center;
`;
const CardPrice = styled(Row)`
  gap: 10px;
  width: 100%;
`;
const PriceTitle = styled.div`
  font-weight: 700;
  font-size: 50px;
`;
const PriceGeneral = styled.div`
  font-weight: 500;
  font-size: 20px;
`;
const CardTitle = styled(Column)`
  gap: 20px;
  align-items: flex-start;
  width: 100%;
`;
const CardTitleHeader = styled.div`
  font-weight: 600;
  font-size: 20px;
`;
const CardDetail = styled(Column)`
  gap: 20px;
  width: 100%;
  align-items: flex-start;
`;
const CardDetailItem = styled(Row)`
  gap: 20px;
`;
export default Purchase;
