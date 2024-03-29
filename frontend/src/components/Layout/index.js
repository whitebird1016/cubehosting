import { Column } from "../Element";
import Footer from "./footer";
import Header from "./header";
import styled from "styled-components";
const Layout = ({ children }) => {
  return (
    <Wrapper>
      <Header />
      {children}
      <Footer />
    </Wrapper>
  );
};
const Wrapper = styled(Column)`
  justify-content: space-between;
`;
export default Layout;
