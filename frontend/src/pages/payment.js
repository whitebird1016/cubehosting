import styled from "styled-components";
import { Column, Row } from "../components/Element";
import Button from "../components/Element/button";
import Paypal from "../components/Paypal";
import CoinbaseCommerceButton from "react-coinbase-commerce";
import { useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import getHash from "../utills/gethash";
import { getServiceApi, serviceApi } from "../action/action";
import { codeUsedApi } from "../action/code";
import {
  currentBlock,
  getAmout,
  getFluxAuth,
  getPaidaddress,
} from "../utills/manager";
import bitcoin from "bitcoinjs-lib";
import bitcoinMessage from "bitcoinjs-message";
import { getRandomNumber } from "../utills";
import { FaCheck } from "react-icons/fa";
import { toast } from "react-toastify";
import { validateCode } from "../action/code";

const ServerInfo = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const cpu =
    location.state.flag === 1
      ? location.state.data.cpu1
      : location.state.data.cpu2;
  const ram =
    location.state.flag === 1
      ? location.state.data.ram1
      : location.state.data.ram2;
  const hdd =
    location.state.flag === 1
      ? location.state.data.ssd1
      : location.state.data.ssd2;
  const zelID = "1GLMJwdJEHySNwSqkC4iKpoBU215m7BkDk";
  const zelIDPrivatekey =
    "L3yGy6krc9VywytHCNEQfuMdpKrPzCfqW9knYAqCyGkKFxLnoXCE";
  const [total, setTotal] = useState(
    location.state.flag === 1
      ? location.state.data.price1
      : location.state.data.price2
  );
  const [checkout, setCheckout] = useState(
    location.state.flag === 1
      ? location.state.data.checkout1
      : location.state.data.checkout2
  );
  const [transactiondata, setTransactiondata] = useState("");
  const [registerhash, setRegisterhash] = useState("");
  const [servicenumber, setServiceNumber] = useState();
  const [code, setCode] = useState("");
  const [flag, setFlag] = useState();
  const [isValidCode, setIsValidCode] = useState(false);
  const referralPrice =
    location.state.flag === 1
      ? location.state.data.referralPrice1
      : location.state.data.referralPrice2;
  const initialData = async () => {
    getFluxAuth();
    const data = await getServiceApi();
    console.log(data.serviceData.length);
    setServiceNumber(data.serviceData.length);
  };

  const checkCodeValidity = async () => {
    if (code == "") {
      return;
    }
    const valid = await validateCode(code);
    setIsValidCode(valid);
    if (valid) {
      updatePriceData();
    }
  };

  const updatePriceData = () => {
    if (isValidCode) {
      console.log(
        "Total: ",
        location.state.flag === 1
          ? location.state.data.referralPrice1
          : location.state.data.referralPrice2
      );
      console.log("State: ", location.state);
      setTotal(
        location.state.flag === 1
          ? location.state.data.referralPrice1
          : location.state.data.referralPrice2
      );
      setCheckout(
        location.state.flag === 1
          ? location.state.data.referralCheckout1
          : location.state.data.referralCheckout2
      );
    }
  };

  useEffect(() => {
    initialData();
  }, []);

  useEffect(() => {
    checkCodeValidity();
  }, [code]);

  // const logoutdata = async () => {
  //   await fetch("https://api.runonflux.io/zelid/logoutcurrentsession", {
  //     method: "get",
  //     headers: {
  //       zelidauth: {
  //         zelid: zelID,
  //         signature: signature,
  //         loginPhrase: logininfo,
  //       },
  //     },
  //   })
  //     .then((res) => res.json())
  //     .then((response) => console.log(response.data))
  //     .catch((err) => console.log(err));
  // };

  const handleButtonClick = async () => {
    const randomservice = Math.floor(Math.random() * 10000000 + 1);
    const usdedCode = code;
    const isValidUsedCode = isValidCode;
    toast.info("Registering Service");
    const data = {
      type: "fluxappregister",
      version: 1,
      appSpecification: {
        version: 6,
        name: `fluidservices${randomservice}`,
        description: location.state.data.title,
        owner: zelID,
        compose: [
          {
            name: getRandomNumber(),
            description: location.state.data.title,
            repotag: location.state.data.repotag,
            ports: location.state.data.port,
            domains: location.state.data.domains,
            environmentParameters: location.state.data.environmentParameters,
            commands: [],
            containerPorts: location.state.data.containerPorts,
            containerData: location.state.data.containerData,
            cpu: cpu,
            ram: ram * 1000,
            hdd: hdd,
            tiered: false,
          },
        ],
        instances: 3,
        contacts: [],
        geolocation: ["acNA"],
        expire: 22000,
      },
      timestamp: new Date().getTime(),
    };

    const signatureinfo =
      data.type +
      data.version +
      JSON.stringify(data.appSpecification) +
      data.timestamp;
    const keyPair = bitcoin.ECPair.fromWIF(zelIDPrivatekey);
    const privateKey = keyPair.d.toBuffer(32);
    const message = signatureinfo;
    const signatureData = bitcoinMessage.sign(
      message,
      privateKey,
      keyPair.compressed
    );
    console.log(signatureinfo);
    data.signature = Buffer.from(signatureData).toString("base64");
    const registerhash = await fetch(
      "https://api.runonflux.io/apps/appregister",
      {
        method: "post",
        headers: {
          zelidauth: localStorage.getItem("fluxauth"),
        },
        body: JSON.stringify(data),
      }
    )
      .then((res) => res.json())
      .then((response) => {
        setRegisterhash(response.data);
        return response.data;
      })
      .catch((err) => console.log(err));

    const paidaddress = await getPaidaddress();

    const amount = await getAmout(cpu, ram * 1000, hdd, 22000);

    console.log(registerhash, amount, paidaddress, "paidaddress");
    const hashdata = await getHash(registerhash, amount, paidaddress);
    console.log(hashdata);

    const transaction = await fetch(
      `https://api.runonflux.io/daemon/sendrawtransaction`,
      {
        method: "post",
        headers: {
          zelidauth: localStorage.getItem("fluxauth"),
        },
        body: JSON.stringify({
          hexstring: hashdata,
          allowhighfees: false,
        }),
      }
    )
      .then((res) => res.json())
      .then((response) => {
        setTransactiondata(response.data);
        toast(response.data);
        return response.data;
      })
      .catch((err) => console.log(err));
    if (transaction) {
      const authdata = JSON.parse(localStorage.getItem("auth"));
      // eslint-disable-next-line no-use-before-define
      const currentBlockData = await currentBlock();
      const servername = `fluidservices${randomservice}`;
      const serviceData = {
        userid: authdata.user._id,
        name: location.state.data.title,
        currentBlockData: currentBlockData + 22000,
        servername: servername,
      };
      await serviceApi(serviceData);
      if (isValidUsedCode)
        await codeUsedApi(usdedCode, servername, currentBlockData + 22000);
    }
    toast.success("Successfully Registered Your Service");
    navigate("/profile");
  };

  return (
    <Wrapper>
      <PaymentPart>
        <Title>Billing</Title>
        <PriceDetail>
          <PriceDetailWrapper>
            <row>{location.state.data.title}</row>
            <Row>
              <BoldTitle>{cpu}</BoldTitle>
              vCores
            </Row>
            <Row>
              <BoldTitle>{ram}</BoldTitle>GB RAM
            </Row>
            <Row>
              <BoldTitle>{hdd}</BoldTitle>GB Storage
            </Row>
          </PriceDetailWrapper>
        </PriceDetail>
        <CostDetail>
          <Title>Total Cost</Title>
          <BoldTitle>
            {total} /{" "}
            <span style={{ color: "red" }}>Referral Cost: {referralPrice}</span>
          </BoldTitle>
        </CostDetail>
        <CostDetail>
          <Title>Referral Code: </Title>
          <ReferalInput
            placeholder="Referal Code"
            type="text"
            value={code}
            onChange={(e) => setCode(e.target.value)}
          />
          {isValidCode ? (
            <FaCheck style={{ color: "green" }} />
          ) : (
            <FaCheck style={{ color: "red" }} />
          )}
        </CostDetail>

        {flag === 1 ? (
          <ButtonWrapper>
            {registerhash ? (
              registerhash.message ? (
                <Column>
                  <Button
                    text="Complete Purchase"
                    width="180px"
                    radius="6px"
                    fweight="500"
                    color="white"
                    fsize="16px"
                    padding="15px"
                    onClick={handleButtonClick}
                  />
                </Column>
              ) : (
                <Button
                  text={<>Please check link</>}
                  width="100%"
                  radius="6px"
                  fweight="500"
                  color="white"
                  fsize="16px"
                  padding="15px"
                />
              )
            ) : (
              <Button
                text="Complete Purchase"
                width="180px"
                radius="6px"
                fweight="500"
                color="white"
                fsize="16px"
                padding="15px"
                onClick={handleButtonClick}
              />
            )}
          </ButtonWrapper>
        ) : (
          <>
            <Paypal cost={total} setFlag={setFlag} />
            <CoinbaseCommerceButton
              styled
              // checkoutId="c632fe45-0566-48e8-9fdc-59c35b7234ca"
              checkoutId={checkout}
              // chargeId="CWL2LG2J"
              onChargeSuccess={(data) => {
                console.log(data);
                toast.success("Payment Successfully Received");
                setFlag(1);
              }}
              onChargeFailure={(data) => {
                console.log(data);
                toast.error("Something went wrong during purchaging");
              }}
              onPaymentDetected={(data) => {
                setFlag(1);
                toast.success("Payment Success");
              }}
              onModalClosed={() => {
                console.log("Payment Cancelled");
              }}
            />
          </>
        )}
      </PaymentPart>
    </Wrapper>
  );
};
const Wrapper = styled(Column)`
  background-color: #313131;
  width: 100%;
  color: white;
  padding: 20px;
  gap: 20px;
  height: 100vh;
`;
const PaymentPart = styled(Column)`
  gap: 30px;
  margin-top: 100px;
  max-width: 1000px;
  align-items: flex-start;
  width: 100%;
`;

const PriceDetail = styled(Row)`
  gap: 20px;
  width: 100%;
  justify-content: center;
`;
const CostDetail = styled(Row)`
  gap: 20px;
`;
const PriceDetailWrapper = styled(Column)`
  width: 100%;
  gap: 20px;
  align-items: flex-start;
`;

const Title = styled.div`
  font-size: 20px;
`;
const BoldTitle = styled.div`
  font-weight: bold;
  font-size: 18px;
  margin-right: 10px;
`;
const ButtonWrapper = styled(Row)`
  justify-content: center;
  gap: 20px;
  width: 100%;
  flex-wrap: wrap;
`;
const ReferalInput = styled.input`
  height: 40px;
  border-radius: 6px;
  border: none;
  outline: none;
  font-size: 24px;
  padding: 4px 6px;
`;
export default ServerInfo;
