import styled from "styled-components";
import { Column } from ".";

const Button = (props) => {
  return (
    <Wrapper
      width={props.width}
      fsize={props.fsize}
      fweight={props.fweight}
      bgcolor={props.bgcolor}
      radius={props.radius}
      onClick={props.onClick}
      color={props.color}
      padding={props.padding}
    >
      {props.text}
    </Wrapper>
  );
};

const Wrapper = styled(Column)`
  background: ${(props) => (props.bgcolor ? props.bgcolor : "#00CFC8")};
  color: ${(props) => (props.color ? props.color : "#fff")};
  font-weight: ${(props) => (props.fweight ? props.fweight : "800")};
  font-size: ${(props) => (props.fsize ? props.fsize : "12px")};
  padding: ${(props) => (props.padding ? props.padding : "10px")};
  border-radius: ${(props) => (props.radius ? props.radius : "100px")};
  width: 100%;
  text-align: center;
  max-width: ${(props) => props.width && props.width};
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 1); /* Add this line for the dark drop shadow effect */
  :hover {
    box-shadow: 0 0 10px -1px rgba(0, 255, 0, 1);
  }
`;

export default Button;
