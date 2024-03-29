import styled from "styled-components";
import { Column, DefaultImage, Row } from "../components/Element";
import Input from "../components/Element/input";
import TextArea from "../components/Element/textarea";
import Button from "../components/Element/button";
import { ARK } from "../components/Image";

const Contact = () => {
  return (
    <Wrapper>
      <Banner>
        <DefaultImage src={ARK} />
        <BannerContainer>
          <BannerTitle>Server Documentation</BannerTitle>
        </BannerContainer>
      </Banner>
      <LayoutWrapper>
        <ContactWrapper>
          <Title>Email Us</Title>
            <Label>Name</Label>
            <Label>Email</Label>
            <Label>Message</Label>
            <TextArea />
          <ButtonWrapper>
            <Button text="Submit" width="250px" fsize="16px" />
          </ButtonWrapper>
        </ContactWrapper>
      </LayoutWrapper>
    </Wrapper>
  );
};
const Wrapper = styled(Column)`
  gap: 10px;
  width: 100%;
  background-color: #313131;
  height: 100%;
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
  font-size: 32px;
`;
const LayoutWrapper = styled(Column)`
  max-width: 1200px;
  width: 100%;
  padding: 10px;
`;
const ContactWrapper = styled(Column)`
  color: white;
  gap: 10px;
  width: 100%;

  align-items: flex-start;
  border: 1px solid #323232;
  border-radius: 20px;
  padding: 20px;
  box-shadow: 0 0 18px rgba(0, 0, 0, 0.2);
  background: rgba(36, 36, 36, 0.64);
  transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
`;
const Title = styled.div`
  font-size: 28px;
  font-weight: 600;
`;
const InputWrapper = styled(Column)`
  gap: 10px;
  align-items: flex-start;
  width: 100%;
`;
const Label = styled.div`
  font-size: 18px;
  font-weight: 500;
`;
const ButtonWrapper = styled(Column)`
  margin-top: 20px;
  width: 100%;
`;
export default Contact;
