import styled from "styled-components";
import { Row } from "../Element";

const Footer = () => {
  return <Wrapper>©Copyright 2023</Wrapper>;
};
const Wrapper = styled(Row)`
  background-color: rgb(47, 47, 47);
  width: 100%;
  color: hsla(0, 0%, 100%, 0.75);
  justify-content: center;
  padding: 20px;
`;
export default Footer;
