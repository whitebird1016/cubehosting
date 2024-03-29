import styled from "styled-components";
import { Column, DefaultImage, GreenText } from "../../components/Element";
import Input from "../../components/Element/input";
import Button from "../../components/Element/button";
import { useState } from "react";
import { Logo } from "../../components/Image";
import { loginApi } from "../../action/action";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [logininfo, setLoginInfo] = useState({
    userinfo: "",
    password: "",
  });
  const navigate = useNavigate();
  const [error, setError] = useState();

  const handleChange = (e) => {
    setLoginInfo({ ...logininfo, [e.target.name]: e.target.value });
  };
  const handleClick = async () => {
    const data = await loginApi(logininfo);
    if (data.message) {
      setError(data.message);
    } else {
      localStorage.setItem("auth", JSON.stringify(data));
      navigate("/profile", {
        state: {
          data: data,
        },
      });

      setLoginInfo({
        userinfo: "",
        password: "",
      });
      setError("");
    }
  };
  return (
    <Wrapper>
      <DefaultImage src={Logo} />
      <Container>
        <Title>Sign In</Title>
        {error && <ErrorWrapper>{error}</ErrorWrapper>}
        <Input
          name="userinfo"
          placeholder="Email or Username"
          fsize="18px"
          onChange={handleChange}
          value={logininfo.userinfo}
        />
        <Input
          name="password"
          placeholder="Password"
          fsize="18px"
          onChange={handleChange}
          type="password"
          value={logininfo.password}
        />
        <Button
          text="Sign In"
          width="100%"
          radius="6px"
          fweight="500"
          color="white"
          fsize="24px"
          padding="15px"
          onClick={handleClick}
        />
        <a href="/register" class="custom-link">Create account</a>
        <a class="custom-link">Forgot your password</a>
      </Container>
    </Wrapper>
  );
};

const Wrapper = styled(Column)`
  gap: 30px;
  background-color: #313131;
  justify-content: center;
  width: 100%;
  padding: 10px;
  height: 100vh;
  img {
    width: 200px;
    margin-right: 40px;
  }
`;
const Container = styled(Column)`
  gap: 30px;
  color: white;
  padding: 25px;
  border-radius: 10px;
  box-shadow: 0 0 25px rgba(0, 0, 0, 0.2);
  border: 1px px double transparent;
  font-size: 14px;
  max-width: 400px;
  width: 100%;
`;
const Title = styled.div`
  font-size: 30px;
  font-weight: 500;
`;
const ErrorWrapper = styled.div`
  color: #f93861;
  border: solid 4px #f14668;
  border-radius: 4px;
  padding: 1.25em 1.5em;
  border-width: 0 0 0 4px !important;
  width: 100%;
  background-color: rgba(39, 39, 39, 0.51) !important;
`;

export default Login;
