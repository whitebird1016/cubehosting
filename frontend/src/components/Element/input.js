import styled from "styled-components";

const Input = (props) => {
  return (
    <Wrapper
      placeholder={props.placeholder}
      fsize={props.fsize}
      onChange={props.onChange}
      name={props.name}
      type={props.type}
      value={props.value}
    />
  );
};

const Wrapper = styled.input`
  outline: none;
  padding: 15px 15px;
  width: 100%;
  background: #272727 !important;
  border-radius: 5px !important;
  color: white;
  font-size: ${(props) => (props.fsize ? props.fsize : "16px")};
  border: none;
  transition: all 0.2s ease;
  :focus {
    box-shadow: 0 0 20px rgba(58, 255, 55, 0.08) !important;
  }
`;
export default Input;
