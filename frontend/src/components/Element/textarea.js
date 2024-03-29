import styled from "styled-components";

const TextArea = () => {
  return <Wrapper />;
};

const Wrapper = styled.textarea`
  outline: none;
  padding: 10px 15px;
  width: 100%;
  background: #272727 !important;
  border-radius: 5px !important;
  color: white;
  font-size: 16px;
  border: none;
  transition: all 0.2s ease;
  :focus {
    box-shadow: 0 0 20px rgba(58, 255, 55, 0.08) !important;
  }
  height: 300px;
`;

export default TextArea;
