import styled from "styled-components";
import { Column, DefaultImage, Row } from "../components/Element";
import { useEffect } from "react";
import { useState } from "react";
import { toast } from "react-toastify";
import {
  AiOutlineDelete,
  AiOutlineEdit,
  AiOutlineCloseCircle,
} from "react-icons/ai";
import { getServiceApi } from "../action/action";
import { useNavigate } from "react-router-dom";
import { ARK } from "../components/Image";
import {
  getFluxAllUserData,
  getFluxAuth,
  getFluxData,
} from "../utills/manager";
import { getLocation } from "../utills/getlocation";
import { generateString } from "../utills/generate-string";
import {
  validateCode,
  getCodes,
  addCode,
  deleteCode,
  updateExpiration,
} from "../action/code";

const Profile = () => {
  const year = new Date().getFullYear();
  const month = new Date().getMonth() + 1;
  const day = new Date().getDate();
  const now = `${year}-${month < 10 ? "0" + month : month}-${
    day < 10 ? "0" + day : day
  }`;
  const [auth, setAuth] = useState(JSON.parse(localStorage.getItem("auth")));
  const [userServiceData, setUserServiceData] = useState();
  const [userServiceData2, setUserServiceData2] = useState();
  const [userData, setUserData] = useState();
  const [code, setCode] = useState(generateString(8));
  const [isValid, setIsValid] = useState(true);
  const [expiration, setExpiration] = useState(now);
  const [codes, setCodes] = useState([]);
  const navigate = useNavigate();

  const initialData = async () => {
    const authdata = JSON.parse(localStorage.getItem("auth"));
    setAuth(authdata.user);
    const response = await getServiceApi();
    const fluxalluser = await getFluxAllUserData();
    const fluxdata = await getFluxData();

    const service = response.serviceData.filter(
      (item) => item.userid === authdata.user._id
    );
    setUserData(service);

    const userdata = service?.map((user) =>
      fluxalluser?.filter((flux) => flux.name === user.servername)
    );
    const userdatas = service?.map((user) =>
      fluxdata?.filter((flux) => flux.name === user.servername)
    );
    setUserServiceData2(userdatas);
    setUserServiceData(userdata);
  };

  const refreshCodes = async () => {
    const result = await getCodes();
    console.log(`codes: `, { result });
    setCodes(result);
  };

  useEffect(() => {
    if (auth) {
      initialData();
      getFluxAuth();
    } else {
      toast.error("Please login first");
      navigate("/login");
    }
    refreshCodes();
  }, []);

  useEffect(() => {
    console.log({ expiration });
  }, [expiration]);

  useEffect(() => {
    (async () => {
      const result = await validateCode(code);
      console.log(`valid result: `, { result });
      setIsValid(result);
    })();
  }, [code]);

  const handleItemClick = (data) => {
    navigate("/server", {
      state: {
        data: data,
      },
    });
  };

  return (
    <Wrapper>
      {auth && (
        <>
          <Banner>
            <DefaultImage src={ARK} />
            <BannerContainer>
              <BannerTitle>Profile</BannerTitle>
              <BannerTitle>{auth?.username}</BannerTitle>
              <BannerTitle>{auth?.email}</BannerTitle>
            </BannerContainer>
          </Banner>
          <WrapperContainer>
            {userServiceData &&
              userServiceData?.map((item, key) => (
                <UserServerGroup
                  onClick={() =>
                    item.length > 0
                      ? handleItemClick(item[0])
                      : userServiceData2[key].length > 0
                      ? handleItemClick(userServiceData2[key][0])
                      : toast("Now Server Settig...")
                  }
                >
                  {console.log(
                    userServiceData2[key][0],
                    "userServiceData2[key][0]"
                  )}
                  <ColumnData>
                    <DefaultTitle>Servers</DefaultTitle>
                    <DefaultText>
                      {userData[key].changedname
                        ? userData[key]?.changedname
                        : userData[key]?.servername}
                    </DefaultText>
                  </ColumnData>
                  <ColumnData>
                    <DefaultTitle>End Date</DefaultTitle>
                    <DefaultText>
                      {item.length > 0 && item[0]?.expires_date
                        ? item[0]?.expires_date
                        : "setting... "}
                    </DefaultText>
                  </ColumnData>
                  <ColumnData>
                    <DefaultTitle>Location</DefaultTitle>
                    <DefaultText>
                      {item.length > 0
                        ? getLocation(item[0]?.geolocation[0])
                        : "setting..."}
                    </DefaultText>
                  </ColumnData>
                </UserServerGroup>
              ))}
          </WrapperContainer>
        </>
      )}
    </Wrapper>
  );
};

const Wrapper = styled(Column)`
  background-color: #313131;
  width: 100%;
  color: white;
  height: 100vh;
`;
const ModalWrapper = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: #00000030;
  backdrop-filter: blur(5px);
  z-index: 10;
`;
const EditModalWrapper = styled.div`
  width: 500px;
  height: 400px;
  background-color: #313131;
  border-radius: 12px;
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  padding: 20px 0px;
`;
const EditDetails = styled.div`
  width: 90%;
  display: grid;
  grid-template-columns: 1fr 2fr;
  gap: 8px;
`;
const EditActionGroup = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row-reverse;
  align-items: center;
  position: absolute;
  bottom: 12px;
  right: 12px;
  gap: 8px;
`;
const EditModalActionButton = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 4px 8px;
  font-size: 20px;
  font-weight: 500;
  cursor: pointer;
  background-color: #ffcc3e;
  border-radius: 8px;
`;
const ModalCloseButton = styled.div`
  position: absolute;
  top: 12px;
  right: 12px;
  width: 32px;
  height: 32px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  cursor: pointer;
`;
const WrapperContainer = styled(Column)`
  padding: 20px;
  gap: 20px;
  justify-content: flex-start;
  align-items: flex-start;
  max-width: 900px;
  width: 100%;
  max-height: 80vh;
  overflow: auto;
`;
const ReferalCodeSection = styled.div`
  width: 95%;
  display: flex;
  flex-direction: column;
  gap: 20px;
`;
const GenerateNewCodeButton = styled.div`
  padding: 4px 8px;
  border-radius: 6px;
  cursor: pointer;
  color: white;
  font-size: 18px;
  font-weight: 500;
  background-color: #4bfa4b;
  min-width: 200px;
`;
const ActionButton = styled.div`
  width: 30px;
  height: 30px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  cursor: pointer;
`;
const AddCodeButton = styled.div`
  padding: 4px 8px;
  border-radius: 6px;
  cursor: pointer;
  color: white;
  font-size: 18px;
  font-weight: 500;
  background-color: #fa4b7f;
  min-width: 120px;
`;
const ReferalAreaRow = styled.div`
  width: 70%;
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 2fr 1.5fr 1.5fr;
  align-items: center;
  gap: 4px;
`;
const CodeRow = styled.div`
  width: 70%;
  margin-top: 20px;
  display: grid;
  grid-template-columns: 1fr 1.5fr 1fr 1fr 2fr;
  align-items: center;
  gap: 12px;
`;
const DefaultText = styled.div`
  font-size: 16px;
  font-weight: 400;
`;
const DefaultTextBold = styled.div`
  font-size: 18px;
  font-weight: 500;
`;
const DefaultTitle = styled.div`
  font-size: 24px;
  font-weight: 500;
`;
const UserServerGroup = styled(Row)`
  gap: 20px;
  padding: 20px;
  background-color: #00000066;
  width: 100%;
  border-radius: 10px;
  justify-content: flex-start;
`;
const ActionRow = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  gap: 6px;
`;
const ColumnData = styled(Column)`
  align-items: flex-start;
  gap: 5px;
  min-width: 200px;
`;
const Banner = styled(Column)`
  width: 100%;
  position: relative;
  height: 32vh;
  margin-top: 60px;

  img {
    position: absolute;
    height: 100%;
    mask-image: linear-gradient(#fff, transparent);
    width: 100%;
    object-fit: cover;
  }
`;
const BannerContainer = styled(Column)`
  margin-top: 50px;
  position: relative;
  width: 100%;
  justify-content: center;
  align-items: center;
  gap: 15px;
`;
const BannerTitle = styled.h1`
  font-weight: 600;
  color: #fff;
  text-shadow: 2px 2px 1px #191919;
  z-index: 2;
  font-size: 32px;
`;
export default Profile;
