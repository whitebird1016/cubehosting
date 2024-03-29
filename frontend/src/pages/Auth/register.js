import styled from "styled-components";
import { Column, DefaultImage, GreenText } from "../../components/Element";
import Input from "../../components/Element/input";
import Button from "../../components/Element/button";
import { useState } from "react";
import { Logo } from "../../components/Image";
import { registerApi } from "../../action/action";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const [registerinfo, setRegisterInfo] = useState({
    username: "",
    email: "",
    password: "",
    confirmpassword: "",
  });
  const navigate = useNavigate();
  const [error, setError] = useState();
  const handleChange = (e) => {
    setRegisterInfo({ ...registerinfo, [e.target.name]: e.target.value });
  };
  const handleClick = async () => {
    try {
      const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      const isValidEmail = regex.test(registerinfo.email);
      if (
        registerinfo.confirmpassword !== registerinfo.password ||
        !isValidEmail
      ) {
        return setError(
          "Something went wrong with the Register, please try again."
        );
      }
      const data = await registerApi(registerinfo);
      if (data.message) {
        setError(data.message);
      } else {
        alert("success");
        console.log(data);
        navigate("/profile", {
          state: {
            data: data,
          },
        });
        setRegisterInfo({
          username: "",
          email: "",
          password: "",
          confirmpassword: "",
        });
        setError("");
      }
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <Wrapper>
      <DefaultImage src={Logo} />
      <Container>
        <Title>Sign Up</Title>
        {error && <ErrorWrapper>{error}</ErrorWrapper>}
        <Input
          name="username"
          placeholder="Username"
          fsize="18px"
          value={registerinfo.username}
          onChange={handleChange}
        />
        <Input
          name="email"
          placeholder="Email"
          fsize="18px"
          value={registerinfo.email}
          onChange={handleChange}
          type="email"
        />
        <Input
          name="password"
          placeholder="Password"
          fsize="18px"
          value={registerinfo.password}
          onChange={handleChange}
          type="password"
        />
        <Input
          name="confirmpassword"
          placeholder="Confirm Password"
          value={registerinfo.confirmpassword}
          fsize="18px"
          onChange={handleChange}
          type="password"
        />

        <Button
          text="Sign Up"
          width="100%"
          radius="6px"
          fweight="500"
          color="white"
          fsize="24px"
          padding="15px"
          onClick={handleClick}
        />
        <a href="/login" class="custom-link">Login</a>
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
  height: 100%;
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

export default Register;
