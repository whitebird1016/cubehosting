import styled from "styled-components";
import { Column } from "..";
import Button from "../button";

const BackgroundCard = (props) => {
  return (
    <Wrapper>
      <Title>{props.title}</Title>
      <Content1>{props.content1}</Content1>
      <Content2>{props.content2}</Content2>
      <Button text={props.bntext} />
    </Wrapper>
  );
};
const Wrapper = styled(Column)`
  border: 1px solid #323232;
  border-radius: 20px;
  padding: 25px;
  box-shadow: 0 0 18px rgba(0, 0, 0, 0.2);
  background: rgba(36, 36, 36, 0.64);
  transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
  gap: 20px;
  color: white;
  font-size: 14px;
  height: 100%;
  justify-content: space-between;
`;
const Title = styled.h3`
  font-size: 18px;
  font-weight: 700;
`;
const Content1 = styled.div``;
const Content2 = styled.div``;
export default BackgroundCard;
