import styled from "styled-components";
import { Column, Row } from "../components/Element";
import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import CoinbaseCommerceButton from "react-coinbase-commerce";
import { FaCheck } from "react-icons/fa";
import YouTube from "react-youtube";
import {
  currentBlock,
  getAppSpecification,
  getbenchmarks,
  getExpire,
  getFluxAuth,
  getIpaddress,
  handleHardRedeployClick,
  handleRedeployClick,
  handleReinstallClick,
  handleRestartClick,
  handleStartClick,
  handleStopClick,
  handleUpdateServer,
} from "../utills/manager";
import Input from "../components/Element/input";
import { getServiceApi, updateUserService } from "../action/action";
import { toast } from "react-toastify";
import Button from "../components/Element/button";
import Select, { createFilter, StylesConfig } from "react-select";
import {
  continentsOptions,
  countriesOptions,
  regionsOptions,
} from "../utills/getlocation";
import Paypal from "../components/Paypal";
import { gameitems } from "../assets/json/gamedata";
import {
  minecraftVersionOptions,
  arkVersionOptions,
  valheimVersionOptions,
  gamesOptions,
  minecraftMods,
  valheimMods,
  arkMods,
} from "../assets/json/settings";
import { validateCode } from "../action/code";
import { codeUsedApi } from "../action/code";

const tabs = {
  controls: "Controls",
  settings: "Settings",
  guides: "Guides",
};

const selectorStyles = {
  option: (styles) => ({ ...styles, color: "black" }),
};

const ServerInfo = () => {
  const location = useLocation();
  const [environment, setEnvironment] = useState([]);
  const [servername, setServername] = useState();
  const [ipData, setIpData] = useState();
  const [possibleLocations, setPossibleLocations] = useState();
  const [continent, setContinent] = useState();
  const [country, setCountry] = useState();
  const [region, setRegion] = useState();
  const [geolocationData, setGeolocationData] = useState();
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  const [timer, setTimer] = useState(null);
  const [flag, setFlag] = useState(0);
  const [clickCheck, setClickCheck] = useState(false);
  const [priceData, setPriceData] = useState();
  const [checkoutdata, setCheckoutData] = useState();
  const [code, setCode] = useState("");
  const [isValidCode, setIsValidCode] = useState(false);
  const [activeTab, setActiveTab] = useState(tabs.controls);
  const [settingsGame, setSettingsGame] = useState("minecraft");
  const [settingsVersionOptions, setSettingsVersionOptions] = useState(
    minecraftVersionOptions
  );
  const [settingsModes, setSettingsModes] = useState(minecraftMods);
  const [settingsPassword, setSettingsPassword] = useState("");
  const [settingsAdmins, setSettingsAdmins] = useState("");
  const [settingsVersion, setSettingsVersion] = useState([]);
  const [settingsAddons, setSettingsAddons] = useState([]);

  console.log(isButtonDisabled, "isButtonDisabled");
  const getIpData = async () => {
    const ipdata = await getIpaddress(location.state.data.name);
    setIpData(ipdata);
  };
  const onPlayerReady = (event) => {
    // access to player in all event handlers via event.target
    event.target.pauseVideo();
  };
  const updateExpireData = async () => {
    if (flag === 1) {
      setClickCheck(false);
      setIsButtonDisabled(true);
      const usdedCode = code;
      const isValidUsedCode = isValidCode;
      const olddata = await getAppSpecification(location.state.data.name);
      console.log(olddata);
      const expire = await getExpire(location.state.data.name);
      console.log(expire, "expire");
      const currentBlockData = await currentBlock();
      const authdata = JSON.parse(localStorage.getItem("auth"));
      const data = {
        type: "fluxappupdate",
        version: 1,
        appSpecification: {
          version: 6,
          name: olddata.name,
          description: olddata.description,
          owner: olddata.owner,
          compose: [
            {
              name: olddata.compose[0].name,
              description: olddata.compose[0].description,
              repotag: olddata.compose[0].repotag,
              ports: olddata.compose[0].ports,
              domains: olddata.compose[0].domains,
              environmentParameters: olddata.compose[0].environmentParameters,
              commands: [],
              containerPorts: olddata.compose[0].containerPorts,
              containerData: olddata.compose[0].containerData,
              cpu: location.state.data?.components
                ? location.state.data?.components[0].cpu
                : location.state.data?.compose[0].cpu,
              ram: location.state.data?.components
                ? location.state.data?.components[0].ram
                : location.state.data?.compose[0].ram,
              hdd: location.state.data?.components
                ? location.state.data?.components[0].hdd
                : location.state.data?.compose[0].hdd,
              tiered: false,
            },
          ],
          instances: 3,
          contacts: [],
          geolocation: ["acNA"],
          expire: expire + 22000,
        },
        timestamp: new Date().getTime(),
      };
      console.log(data, "updated data");

      const transaction = await handleUpdateServer(data);
      toast.success(transaction);
      console.log(transaction, "transaction");
      if (transaction) {
        const service = await getServiceApi();
        console.log(service, "filter");
        const filterdata = service.serviceData.filter(
          (data) =>
            data.userid === authdata.user._id &&
            data.servername === location.state.data.name
        );
        const serviceData = {
          _id: filterdata[0]._id,
          userid: authdata.user._id,
          name: location.state.data.description,
          currentBlockData: expire + currentBlockData + 22000,
          servername: location.state.data.name,
        };
        await updateUserService(serviceData).then((res) =>
          toast.success("Updated")
        );
        if (isValidUsedCode)
          await codeUsedApi(
            usdedCode,
            location.state.data.name,
            expire + currentBlockData + 22000
          );
        // Start the timer
        const timerId = setTimeout(() => {
          setIsButtonDisabled(false);
        }, 10000);
        setTimer(timerId);
      }
    } else {
      toast.error("Please try with payment");
      setClickCheck(true);
    }
  };
  console.log(location.state.data);
  const updateEnvironmentData = async () => {
    if (!environment || environment.length == 0 || environment == [""]) {
      return toast.error("Please input Environment");
    }
    setIsButtonDisabled(true);
    const olddata = await getAppSpecification(location.state.data.name);
    const expire = await getExpire(location.state.data.name);
    const currentBlockData = await currentBlock();
    const authdata = JSON.parse(localStorage.getItem("auth"));
    const data = {
      type: "fluxappupdate",
      version: 1,
      appSpecification: {
        version: 6,
        name: olddata.name,
        description: olddata.description,
        owner: olddata.owner,
        compose: [
          {
            name: olddata.compose[0].name,
            description: olddata.compose[0].description,
            repotag: olddata.compose[0].repotag,
            ports: olddata.compose[0].ports,
            domains: olddata.compose[0].domains,
            environmentParameters: JSON.parse(environment),
            commands: [],
            containerPorts: olddata.compose[0].containerPorts,
            containerData: olddata.compose[0].containerData,
            cpu: location.state.data?.components
              ? location.state.data?.components[0].cpu
              : location.state.data?.compose[0].cpu,
            ram: location.state.data?.components
              ? location.state.data?.components[0].ram
              : location.state.data?.compose[0].ram,
            hdd: location.state.data?.components
              ? location.state.data?.components[0].hdd
              : location.state.data?.compose[0].hdd,
            tiered: false,
          },
        ],
        instances: 3,
        contacts: [],
        geolocation: ["acNA"],
        expire: expire,
      },
      timestamp: new Date().getTime(),
    };
    console.log(data);

    const transaction = await handleUpdateServer(data);
    toast.success(transaction);
    console.log(transaction, "transaction");
    if (transaction) {
      const service = await getServiceApi();
      console.log(service, "filter");

      const filterdata = service.serviceData.filter(
        (data) =>
          data.userid === authdata.user._id &&
          data.servername === location.state.data.name
      );
      const serviceData = {
        _id: filterdata[0]._id,
        userid: authdata.user._id,
        name: location.state.data.description,
        currentBlockData: expire + currentBlockData,
        servername: location.state.data.name,
      };

      await updateUserService(serviceData).then((res) =>
        toast.success("Updated")
      );
      setFlag(0);
      // Start the timer
      const timerId = setTimeout(() => {
        setIsButtonDisabled(false);
      }, 10000);
      setTimer(timerId);
    }
  };

  const updateGeolocationData = async () => {
    if (!geolocationData) {
      return toast.error("Please fill out geolocation Data");
    }
    setIsButtonDisabled(true);
    console.log(geolocationData);
    const olddata = await getAppSpecification(location.state.data.name);
    const expire = await getExpire(location.state.data.name);
    const currentBlockData = await currentBlock();
    const authdata = JSON.parse(localStorage.getItem("auth"));
    const data = {
      type: "fluxappupdate",
      version: 1,
      appSpecification: {
        version: 6,
        name: olddata.name,
        description: olddata.description,
        owner: olddata.owner,
        compose: [
          {
            name: olddata.compose[0].name,
            description: olddata.compose[0].description,
            repotag: olddata.compose[0].repotag,
            ports: olddata.compose[0].ports,
            domains: olddata.compose[0].domains,
            environmentParameters: olddata.compose[0].environmentParameters,
            commands: [],
            containerPorts: olddata.compose[0].containerPorts,
            containerData: olddata.compose[0].containerData,
            cpu: location.state.data?.components
              ? location.state.data?.components[0].cpu
              : location.state.data?.compose[0].cpu,
            ram: location.state.data?.components
              ? location.state.data?.components[0].ram
              : location.state.data?.compose[0].ram,
            hdd: location.state.data?.components
              ? location.state.data?.components[0].hdd
              : location.state.data?.compose[0].hdd,
            tiered: false,
          },
        ],
        instances: 3,
        contacts: [],
        geolocation: geolocationData,
        expire: expire,
      },
      timestamp: new Date().getTime(),
    };
    console.log(data);

    const transaction = await handleUpdateServer(data);
    toast.success(transaction);
    console.log(transaction, "transaction");
    if (transaction) {
      const service = await getServiceApi();
      console.log(service, "filter");

      const filterdata = service.serviceData.filter(
        (data) =>
          data.userid === authdata.user._id &&
          data.servername === location.state.data.name
      );
      const serviceData = {
        _id: filterdata[0]._id,
        userid: authdata.user._id,
        name: location.state.data.description,
        currentBlockData: expire + currentBlockData,
        servername: location.state.data.name,
      };

      await updateUserService(serviceData).then((res) =>
        toast.success("GeoLocation Updated")
      );
      // Start the timer
      const timerId = setTimeout(() => {
        setIsButtonDisabled(false);
      }, 10000);
      setTimer(timerId);
    }
  };

  const updateServerName = async () => {
    const authdata = JSON.parse(localStorage.getItem("auth"));
    const service = await getServiceApi();
    console.log(service, "filter");

    const filterdata = service.serviceData.filter(
      (data) =>
        data.userid === authdata.user._id &&
        data.servername === location.state.data.name
    );
    console.log(filterdata[0]._id);
    const serviceData = {
      _id: filterdata[0]._id,
      changedname: servername,
    };

    await updateUserService(serviceData).then((res) =>
      toast.success("Server Name Updated")
    );
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

  const onGameChangedHandler = (game) => {
    setSettingsGame(game);
    setSettingsPassword("");
    setSettingsAdmins("");
    setSettingsAddons([]);
    setSettingsVersion([]);
    if (game === "minecraft") {
      setSettingsVersionOptions(minecraftVersionOptions);
      setSettingsModes(minecraftMods);
    } else if (game === "ark") {
      setSettingsVersionOptions(arkVersionOptions);
      setSettingsModes(arkMods);
    } else {
      setSettingsVersionOptions(valheimVersionOptions);
      setSettingsModes(valheimMods);
    }
    setEnvironment([]);
  };

  const onAddonChangedHandler = (addons) => {
    setSettingsAddons(addons);
  };

  const onVersionChangedHandler = (version) => {
    setSettingsVersion(version);
  };

  const onPasswordChangedHandler = (_password) => {
    setSettingsPassword(_password);
  };

  const onAdminChangedHandler = (_admin) => {
    setSettingsAdmins(`${_admin}`);
  };

  const updatePriceData = () => {
    if (isValidCode) {
      const pricedata = gameitems.filter(
        (item) => item.title === location.state.data.description
      );
      const suitabledata =
        pricedata[0].cpu1 ===
        (location.state.data?.components
          ? location.state.data?.components[0].cpu
          : location.state.data?.compose[0].cpu)
          ? pricedata[0].referralPrice1
          : pricedata[0].referralPrice2;

      const checkout =
        pricedata[0].cpu1 ===
        (location.state.data?.components
          ? location.state.data?.components[0].cpu
          : location.state.data?.compose[0].cpu)
          ? pricedata[0].referralCheckout1
          : pricedata[0].referralCheckout2;
      setPriceData(suitabledata);
      setCheckoutData(checkout);
    }
  };

  useEffect(() => {
    getFluxAuth();
    getIpData();
    getPossibleLocation();
    const pricedata = gameitems.filter(
      (item) => item.title === location.state.data.description
    );

    const suitabledata =
      pricedata[0].cpu1 ===
      (location.state.data?.components
        ? location.state.data?.components[0].cpu
        : location.state.data?.compose[0].cpu)
        ? pricedata[0].price1
        : pricedata[0].price2;

    const checkout =
      pricedata[0].cpu1 ===
      (location.state.data?.components
        ? location.state.data?.components[0].cpu
        : location.state.data?.compose[0].cpu)
        ? pricedata[0].checkout1
        : pricedata[0].checkout1;
    setPriceData(suitabledata);
    setCheckoutData(checkout);
  }, []);

  useEffect(() => {
    checkCodeValidity();
  }, [code]);

  const getPossibleLocation = async () => {
    let possibleLocations = [];

    const response = await fetch(
      "https://stats.runonflux.io/fluxinfo?projection=geolocation"
    ).then((res) => res.json());

    if (response.status === "success") {
      const geoData = response.data;
      if (geoData.length > 5000) {
        // all went well
        geoData.forEach((flux) => {
          if (
            flux.geolocation &&
            flux.geolocation.continentCode &&
            flux.geolocation.regionName &&
            flux.geolocation.countryCode
          ) {
            const continentLocation = flux.geolocation.continentCode;
            const countryLocation = `${continentLocation}_${flux.geolocation.countryCode}`;
            const regionLocation = `${countryLocation}_${flux.geolocation.regionName}`;
            const continentLocationExists = possibleLocations.find(
              (location) => location.value === continentLocation
            );
            if (continentLocationExists) {
              continentLocationExists.instances += 1;
            } else {
              possibleLocations.push({
                value: continentLocation,
                instances: 1,
              });
            }
            const countryLocationExists = possibleLocations.find(
              (location) => location.value === countryLocation
            );
            if (countryLocationExists) {
              countryLocationExists.instances += 1;
            } else {
              possibleLocations.push({
                value: countryLocation,
                instances: 1,
              });
            }
            const regionLocationExists = possibleLocations.find(
              (location) => location.value === regionLocation
            );
            if (regionLocationExists) {
              regionLocationExists.instances += 1;
            } else {
              possibleLocations.push({
                value: regionLocation,
                instances: 1,
              });
            }
          }
        });
        setPossibleLocations(possibleLocations);
      }
    }
  };

  useEffect(() => {
    let text = "";
    if (continent !== "ALL") {
      if (continent) {
        text = "ac" + text + continent.value;
      }
      if (country) {
        text = text + "_" + country.value;
      }
      if (region) {
        text = text + "_" + region.value;
      }
    } else {
      text = "";
    }
    // country && text =  text+country + "_";
    // region && text = text+ region;
    setGeolocationData([text], "Adsf");
  }, [continent, country, region]);

  useEffect(() => {
    let password_ = null,
      admins_ = null;
    console.log({ settingsPassword, settingsAdmins });
    if (settingsPassword !== "")
      if (settingsGame === "minecraft") {
        password_ = `RCON_PASSWORD=${settingsPassword}`;
      } else if (settingsGame === "ark") {
        password_ = `SERVER_PASSWORD=${settingsPassword}`;
      } else {
        password_ = `SERVER_PASS=${settingsPassword}`;
      }
    if (settingsAdmins !== "")
      if (settingsGame === "minecraft") {
        admins_ = `OPS=${settingsAdmins}`;
      } else if (settingsGame === "ark") {
        admins_ = `ADMINS=${settingsAdmins}`;
      } else {
        admins_ = `ADMINLIST_IDS=${settingsAdmins}`;
      }
    if (password_ !== null && admins_ !== null) {
      setEnvironment([
        password_,
        ...settingsVersion,
        ...settingsAddons,
        admins_,
      ]);
    } else if (password_ === null && admins_ !== null) {
      setEnvironment([...settingsVersion, ...settingsAddons, admins_]);
    } else if (password_ !== null && admins_ === null) {
      setEnvironment([password_, ...settingsVersion, ...settingsAddons]);
    } else {
      setEnvironment([...settingsVersion, ...settingsAddons]);
    }
  }, [settingsPassword, settingsVersion, settingsAddons, settingsAdmins]);

  console.log(geolocationData);
  useEffect(() => {
    return () => {
      clearTimeout(timer);
    };
  }, [timer]);
  return (
    <Wrapper>
      <Sidebar>
        <SidebarTab
          active={activeTab === tabs.controls}
          onClick={() => {
            setActiveTab(tabs.controls);
          }}
        >
          Controls
        </SidebarTab>
        <SidebarTab
          active={activeTab === tabs.settings}
          onClick={() => {
            setActiveTab(tabs.settings);
          }}
        >
          Settings
        </SidebarTab>
        <SidebarTab
          active={activeTab === tabs.guides}
          onClick={() => {
            setActiveTab(tabs.guides);
          }}
        >
          Guide's
        </SidebarTab>
      </Sidebar>
      <ContentWrapper>
        {activeTab === tabs.controls && (
          <WrapperContainer>
            <ServerInfoPart>
              <Title>Server Information</Title>
              <Row>Server Name - {location.state.data.name}</Row>
              <Row>Description - {location.state.data.description}</Row>
              IPv4 - {ipData ? ipData[0].ip.split(":")[0] : "setting"}
              {/* {ipData?.map((item, key) => (
           <Row key={key}>
              - PORT -{" "}
            {location.state.data?.components[0].ports}
           </Row>
          ))} */}
              {/* <Row>IPv4 - {ipData?.ipaddress}</Row> */}
              {console.log(location.state.data)}
              <Row>
                Port - {"34001"}
                {location.state.data?.components
                  ? location.state.data?.components[0]?.[0]?.ports
                  : location.state.data?.compose[0].ports[0]}
              </Row>
            </ServerInfoPart>
            <ButtonGroup>
              <ColumnButton>
                <Title> Control</Title>
                <Button
                  text="START"
                  width="100%"
                  radius="6px"
                  fweight="500"
                  color="white"
                  fsize="16px"
                  padding="15px"
                  onClick={() => handleStartClick(location.state.data.name)}
                />
                <Button
                  text="STOP"
                  width="100%"
                  radius="6px"
                  fweight="500"
                  color="white"
                  fsize="16px"
                  padding="15px"
                  onClick={() => handleStopClick(location.state.data.name)}
                />
                <Button
                  text="RESTART"
                  width="100%"
                  radius="6px"
                  fweight="500"
                  color="white"
                  fsize="16px"
                  padding="15px"
                  onClick={() => handleRestartClick(location.state.data.name)}
                />
              </ColumnButton>
              <ColumnButton>
                <Title> Deployment Control </Title>
                <Button
                  text="Reinstall"
                  width="100%"
                  radius="6px"
                  fweight="500"
                  color="white"
                  fsize="16px"
                  padding="15px"
                  onClick={() => handleReinstallClick(location.state.data.name)}
                />

                <Button
                  text="Move Server"
                  width="100%"
                  radius="6px"
                  fweight="500"
                  color="white"
                  fsize="16px"
                  padding="15px"
                  onClick={() => handleRedeployClick(location.state.data.name)}
                />
              </ColumnButton>
              <ColumnButton>
                <Title>Data Control</Title>
                {/* <Button>Load Backup</Button> */}
                <Button
                  text=" Clean SSD"
                  width="100%"
                  radius="6px"
                  fweight="500"
                  color="white"
                  fsize="16px"
                  padding="15px"
                  onClick={() =>
                    handleHardRedeployClick(location.state.data.name)
                  }
                />
              </ColumnButton>
            </ButtonGroup>
            <Title>Update</Title>
            <ButtonGroup2>
              <Input
                placeholder="Server Name"
                onChange={(e) => setServername(e.target.value)}
              />
              <Button
                text="Set Name"
                width="100%"
                radius="6px"
                fweight="500"
                color="white"
                fsize="16px"
                padding="15px"
                onClick={updateServerName}
              />
            </ButtonGroup2>
            {/* <ButtonGroup2>
              <Input
                placeholder="[`settings`]"
                onChange={(e) => setEnvironment(e.target.value)}
              />
              <Button
                text="Settings"
                width="100%"
                radius="6px"
                fweight="500"
                color="white"
                fsize="16px"
                padding="15px"
                onClick={!isButtonDisabled ? updateEnvironmentData : undefined}
                bgcolor={isButtonDisabled === true && "rgb(255,255,255,0.3)"}
              />
            </ButtonGroup2> */}
            <ButtonGroup2>
              {possibleLocations && (
                <Select
                  placeholder="Geolocation"
                  className="basic-single"
                  classNamePrefix="select"
                  isSearchable="true"
                  options={continentsOptions("false", possibleLocations)}
                  onChange={(e) => {
                    setContinent(e);
                    setCountry("");
                    setRegion("");
                  }}
                />
              )}
              {continent ? (
                <Select
                  onChange={(e) => {
                    setCountry(e);
                    setRegion("");
                  }}
                  placeholder="Country"
                  className="basic-single"
                  classNamePrefix="select"
                  isSearchable="true"
                  value={[country]}
                  options={countriesOptions(
                    continent.value,
                    "false",
                    possibleLocations
                  )}
                />
              ) : (
                <></>
              )}
              {continent && country && (
                <Select
                  placeholder="Region"
                  className="basic-single"
                  classNamePrefix="select"
                  isSearchable="true"
                  value={[region]}
                  options={regionsOptions(
                    continent.value,
                    country.value,
                    "false",
                    possibleLocations
                  )}
                  onChange={(e) => {
                    setRegion(e);
                  }}
                />
              )}
            </ButtonGroup2>
            <ButtonGroup2>
              {possibleLocations && (
                <Button
                  text="Set Geolocation"
                  width="100%"
                  radius="6px"
                  fweight="500"
                  color="white"
                  fsize="16px"
                  padding="15px"
                  onClick={
                    !isButtonDisabled ? updateGeolocationData : undefined
                  }
                  bgcolor={isButtonDisabled === true && "rgb(255,255,255,0.3)"}
                />
              )}
              <Button
                onClick={!isButtonDisabled ? updateExpireData : undefined}
                bgcolor={isButtonDisabled === true && "rgb(255,255,255,0.3)"}
                text="Extend Rental"
                width="100%"
                radius="6px"
                fweight="500"
                color="white"
                fsize="16px"
                padding="15px"
              />
            </ButtonGroup2>
            {clickCheck && (
              <>
                <CostDetail>
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
                {/* {clickCheck && ( */}
                <Paypal cost={priceData} setFlag={setFlag} />
                <CoinbaseCommerceButton
                  styled
                  // checkoutId="c632fe45-0566-48e8-9fdc-59c35b7234ca"
                  checkoutId={checkoutdata}
                  // chargeId="CWL2LG2J"
                  onChargeSuccess={(data) => {
                    console.log(data);
                    setFlag(1);
                  }}
                  onChargeFailure={(data) => {
                    console.log(data);
                  }}
                  onPaymentDetected={(data) => {
                    console.log(data);
                  }}
                  onModalClosed={() => {
                    console.log("Payment Cancelled");
                  }}
                />
              </>
            )}
          </WrapperContainer>
        )}
        {activeTab === tabs.settings && (
          <WrapperContainer>
            <SettingsWrapper>
              <SettingsTopArea>
                <SettingsDetails>
                  <SettingsControl>
                    <Title>Game</Title>
                    <Select
                      styles={selectorStyles}
                      options={gamesOptions}
                      onChange={(e) => {
                        onGameChangedHandler(e.value);
                      }}
                    />
                  </SettingsControl>
                  <SettingsControl>
                    <Title>Password</Title>
                    <SettingsInput
                      type="password"
                      placeholder="Password"
                      onChange={(e) => {
                        onPasswordChangedHandler(e.target.value);
                      }}
                    />
                  </SettingsControl>
                  <SettingsControl>
                    <Title>Game Version</Title>
                    <Select
                      styles={selectorStyles}
                      options={settingsVersionOptions}
                      onChange={(e) => {
                        onVersionChangedHandler(e.value);
                      }}
                    />
                  </SettingsControl>
                  <SettingsControl>
                    <Title>Addons / Mods</Title>
                    <Select
                      styles={selectorStyles}
                      options={settingsModes}
                      onChange={(e) => {
                        onAddonChangedHandler(e.value);
                      }}
                    />
                  </SettingsControl>
                  <SettingsControl>
                    <Title>Set Admin</Title>
                    <SettingsInput
                      type="text"
                      placeholder="Admin"
                      onChange={(e) => {
                        onAdminChangedHandler(e.target.value);
                      }}
                    />
                  </SettingsControl>
                </SettingsDetails>
                <ApplySettingsArea>
                  <ApplySettingsButton onClick={updateEnvironmentData}>
                    Apply Settings
                  </ApplySettingsButton>
                  <ApplySettingsDescription>
                    Changing Game type, Game Version, and or Addons / Mods will
                    delete current save files
                  </ApplySettingsDescription>
                </ApplySettingsArea>
              </SettingsTopArea>
              <SettingsBottomArea>
                <SettingsControl>
                  <Title>Advanced V</Title>
                  <SettingsInput
                    type="text"
                    value={JSON.stringify(environment)}
                    disabled
                    style={{ width: "100%" }}
                    placeholder="Fill Current Settings Array"
                  />
                </SettingsControl>
              </SettingsBottomArea>
            </SettingsWrapper>
          </WrapperContainer>
        )}
        {activeTab === tabs.guides && (
          <WrapperContainer>
            <GuideLinkGroup>
              <GuideLink
                target="_blank"
                href="https://www.youtube.com/channel/UC8SYbJEmrQt6JlwM8Vub2Ww"
              >
                Youtube
              </GuideLink>
              <GuideLink target="_blank" href="#">
                Instagram
              </GuideLink>
              <GuideLink
                target="_blank"
                href="https://www.tiktok.com/@cube_hosting?is_from_webapp=1&sender_device=pc"
              >
                Ticktok
              </GuideLink>
            </GuideLinkGroup>
            <Row>Using Controls and Settings</Row>
            <YouTube videoId="2g811Eo7K8U" onReady={onPlayerReady} />
            <AdvancedDocumentation target="_blank" href="#">
              Advanced Documentation
            </AdvancedDocumentation>
          </WrapperContainer>
        )}
      </ContentWrapper>
    </Wrapper>
  );
};

const Wrapper = styled(Column)`
  background-color: #313131;
  width: 100%;
  color: white;
  min-height: 100vh;
  display: flex;
  flex-direction: row;
`;

const Sidebar = styled.div`
  width: 250px;
  height: 100vh;
  background-color: #2f2f2f;
  padding-top: 100px;
`;

const SettingsWrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
`;

const SettingsTopArea = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  gap: 14px;
`;

const SettingsBottomArea = styled.div`
  width: auto;
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 14px;
  margin-top: 50px;
`;

const SettingsControl = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const SettingsInput = styled.input`
  height: 50px;
  width: 400px;
  border-radius: 8px;
  color: white;
  padding: 8px 12px;
  font-size: 20px;
  border: none;
  outline: none;
  background-color: #272727;
`;

const ApplySettingsArea = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
`;

const ApplySettingsDescription = styled.div`
  font-size: 20px;
  color: white;
  text-align: center;
  width: 200px;
`;

const ApplySettingsButton = styled.div`
  padding: 8px 16px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  color: white;
  background-color: #00cfc8;
  border-radius: 8px;
  cursor: pointer;
`;

const SettingsDetails = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  font-size: 24px;
  color: white;
`;

const SidebarTab = styled.div`
  width: 100%;
  height: 90px;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  font-size: 28px;
  font-weight: 500;
  background-color: ${(props) => {
    return props.active === true ? "#212121" : "#2f2f2f";
  }};
  cursor: pointer;
`;

const ContentWrapper = styled.div`
  width: calc(100% - 250px);
  height: 100vh;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const GuideLinkGroup = styled.div`
  height: 120px;
  width: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-around;
`;

const GuideLink = styled.a`
  color: white;
  font-size: 24px;
  text-decoration: none;
`;

const AdvancedDocumentation = styled.a`
  color: #28acf6;
  font-size: 22px;
  text-decoration: none;
  margin-top: 30px;
`;

const WrapperContainer = styled(Column)`
  gap: 20px;
  justify-content: center;
  align-items: flex-start;
  max-width: 900px;
  width: 95%;
  margin-top: 140px;
`;

const ServerInfoPart = styled(Column)`
  gap: 5px;
  align-items: flex-start;
`;
const Title = styled.div`
  font-size: 24px;
  font-weight: 700;
  margin-bottom: 5px;
`;
const CostDetail = styled(Row)`
  gap: 20px;
`;
const ReferalInput = styled.input`
  height: 40px;
  border-radius: 6px;
  border: none;
  outline: none;
  font-size: 24px;
  padding: 4px 6px;
`;
const ButtonGroup = styled(Row)`
  gap: 10px;
  align-items: flex-start;
  flex-wrap: wrap;
  width: 100%;
`;
const ButtonGroup2 = styled(ButtonGroup)`
  gap: 10px;
  align-items: flex-start;
  flex-wrap: nowrap;
`;
const ColumnButton = styled(Column)`
  gap: 5px;
  width: 250px;
`;

export default ServerInfo;
