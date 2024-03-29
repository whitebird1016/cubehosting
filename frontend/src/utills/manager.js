import bitcoin from "bitcoinjs-lib";
import bitcoinMessage from "bitcoinjs-message";
import { toast } from "react-toastify";
import { getUserService } from "../action/action";
import getHash from "./gethash";
const handleStartClick = async (server) => {
  await fetch(`https://api.runonflux.io/apps/appstart/${server}/true`, {
    method: "get",
    headers: {
      zelidauth: localStorage.getItem("fluxauth"),
    },
  })
    .then((res) => res.json())
    .then((response) => toast.success(response.data.message))
    .catch((err) => console.log(err));
};
const handleStopClick = async (server) => {
  await fetch(`https://api.runonflux.io/apps/appstop/${server}/true`, {
    method: "get",
    headers: {
      zelidauth: localStorage.getItem("fluxauth"),
    },
  })
    .then((res) => res.json())
    .then((response) => toast.success(response.data))
    .catch((err) => console.log(err));
};
const handleReinstallClick = async (server) => {
  await fetch(`https://api.runonflux.io/apps/appremove/${server}/true`, {
    method: "get",
    headers: {
      zelidauth: localStorage.getItem("fluxauth"),
    },
  })
    .then((res) => res.text())
    .then((response) => {
      const jsonArray = `[${response.replace(/}{/g, "},{")}]`;
      JSON.parse(jsonArray).map((item) => {
        toast.success(item.status);
      });
    })
    .catch((err) => console.log(err));
};
const handleRedeployClick = async (server) => {
  await fetch(`https://api.runonflux.io/apps/redeploy/${server}/false/true`, {
    method: "get",
    headers: {
      zelidauth: localStorage.getItem("fluxauth"),
    },
  })
    .then((res) => res.json())
    .then((response) => toast.success(response.data.message))
    .catch((err) => console.log(err));
};
const handleHardRedeployClick = async (server) => {
  await fetch(`https://api.runonflux.io/apps/redeploy/${server}/true/true`, {
    method: "get",
    headers: {
      zelidauth: localStorage.getItem("fluxauth"),
    },
  })
    .then((res) => res.json())
    .then((response) => toast.success(response.data.message))
    .catch((err) => console.log(err));
};

const handleRestartClick = async (server) => {
  await fetch(`https://api.runonflux.io/apps/apprestart/${server}/true`, {
    method: "get",
    headers: {
      zelidauth: localStorage.getItem("fluxauth"),
    },
  })
    .then((res) => res.json())
    .then((response) => toast.success(response.data.message))
    .catch((err) => console.log(err));
};

const getFluxAuth = async () => {
  const zelID = "1GLMJwdJEHySNwSqkC4iKpoBU215m7BkDk";
  const zelIDPrivatekey =
    "L3yGy6krc9VywytHCNEQfuMdpKrPzCfqW9knYAqCyGkKFxLnoXCE";
  const logininfo = await fetch("https://api.runonflux.io/id/loginphrase", {
    method: "get",
  })
    .then((res) => res.json())
    .then((response) => response.data);

  const keyPair = bitcoin.ECPair.fromWIF(zelIDPrivatekey);
  const privateKey = keyPair.d.toBuffer(32);
  // const privateKey = keyPair.privateKey;
  const message = logininfo;
  const signature = bitcoinMessage.sign(
    message,
    privateKey,
    keyPair.compressed
  );
  const alldata = {
    zelid: zelID,
    signature: signature,
    loginPhrase: logininfo,
  };
  localStorage.setItem("fluxauth", JSON.stringify(alldata));
};
const getPaidaddress = async () => {
  return await fetch(`https://api.runonflux.io/apps/deploymentinformation`, {
    method: "get",
    headers: {
      zelidauth: localStorage.getItem("fluxauth"),
    },
  })
    .then((res) => res.json())
    .then((response) => response.data.address)
    .catch((err) => console.log(err));
};
const getIpaddress = async (servername) => {
  console.log(servername);
  return await fetch(`https://api.runonflux.io/apps/location/${servername}`, {
    method: "get",
  })
    .then((res) => res.json())
    .then((response) => response.data)
    .catch((err) => console.log(err));
};

const getbenchmarks = async () => {
  return await fetch(`https://api.runonflux.io/benchmark/getbenchmarks`, {
    method: "get",
  })
    .then((res) => res.json())
    .then((response) => response.data)
    .catch((err) => console.log(err));
};
const getAmout = async (cpu, ram, hdd, expire) => {
  const zelID = "1GLMJwdJEHySNwSqkC4iKpoBU215m7BkDk";
  const data = {
    version: 6,
    name: `cubehostings`,
    description: "server",
    owner: zelID,
    compose: [
      {
        name: "wickedsensation",
        description: "server",
        repotag: "wickedsensation/stoneblock3:1.6.1",
        ports: [39097, 39098],
        domains: ["", ""],
        environmentParameters: [],
        commands: [],
        containerPorts: [25565, 22],
        containerData: "/data/world  s:/data/backups",
        cpu: cpu,
        ram: ram,
        hdd: hdd,
        tiered: false,
      },
    ],
    instances: 3,
    contacts: [],
    geolocation: [],
    expire: expire,
  };

  return await fetch(`https://api.runonflux.io/apps/calculateprice`, {
    method: "post",
    body: JSON.stringify(data),
  })
    .then((res) => res.json())
    .then((response) => response.data)
    .catch((err) => console.log(err));
};
const currentBlock = async () => {
  return await fetch(`https://api.runonflux.io/daemon/getblockcount`, {
    method: "get",
  })
    .then((res) => res.json())
    .then((response) => response.data)
    .catch((err) => console.log(err));
};

const sendrawTransaction = async (hashdata) => {
  return await fetch(`https://api.runonflux.io/daemon/sendrawtransaction`, {
    method: "post",
    headers: {
      zelidauth: localStorage.getItem("fluxauth"),
    },
    body: JSON.stringify({
      hexstring: hashdata,
      allowhighfees: false,
    }),
  })
    .then((res) => res.json())
    .then((response) => response.data)
    .catch((err) => console.log(err));
};

const getExpire = async (server) => {
  const authdata = JSON.parse(localStorage.getItem("auth"));
  const resdata = await getUserService({
    userid: authdata.user._id,
    servername: server,
  });
  const currentBlockData = await currentBlock();
  return (
    Math.round(
      (resdata?.filterdata[0]?.currentBlockData - currentBlockData) / 1000
    ) * 1000
  );
};

const handleUpdateServer = async (data) => {
  const signatureinfo =
    data.type +
    data.version +
    JSON.stringify(data.appSpecification) +
    data.timestamp;
  const zelIDPrivatekey =
    "L3yGy6krc9VywytHCNEQfuMdpKrPzCfqW9knYAqCyGkKFxLnoXCE";
  const keyPair = bitcoin.ECPair.fromWIF(zelIDPrivatekey);
  const privateKey = keyPair.d.toBuffer(32);
  const message = signatureinfo;
  const signatureData = bitcoinMessage.sign(
    message,
    privateKey,
    keyPair.compressed
  );
  data.signature = Buffer.from(signatureData).toString("base64");
  const updatehash = await fetch("https://api.runonflux.io/apps/appupdate", {
    method: "post",
    headers: {
      zelidauth: localStorage.getItem("fluxauth"),
    },
    body: JSON.stringify(data),
  })
    .then((res) => res.json())
    .then((response) => response.data)
    .catch((err) => console.log(err));
  const paidaddress = await getPaidaddress();
  const amount = await getAmout(
    data.appSpecification.compose[0].cpu,
    data.appSpecification.compose[0].ram,
    data.appSpecification.compose[0].hdd,
    data.appSpecification.expire
  );
  console.log(updatehash, amount, paidaddress, "paidaddress");

  const hashdata = await getHash(updatehash, amount, paidaddress);

  return await sendrawTransaction(hashdata);
};

const getAppSpecification = async (server) => {
  return await fetch(
    `https://api.runonflux.io/apps/appspecifications/${server}`,
    {
      method: "get",
      headers: {
        zelidauth: localStorage.getItem("fluxauth"),
      },
    }
  )
    .then((res) => res.json())
    .then((response) => response.data)
    .catch((err) => console.log(err));
};

const gethardwareSpecification = async (server) => {
  try {
    const response = await fetch(
      `https://api.runonflux.io/apps/appspecifications/${server}`
    );
    const data = await response.json();
    if (
      data.status === "success" &&
      data.data &&
      data.data.compose &&
      data.data.compose.length > 0
    ) {
      const { cpu, ram, hdd } = data.data.compose[0];
      console.log("CPU:", cpu);
      console.log("RAM:", ram);
      console.log("HDD:", hdd);
    } else {
      console.log("Error: Unable to parse data or data not available.");
    }
  } catch (error) {
    console.log("Error fetching data:", error);
  }
};

const getFluxAllUserData = async () => {
  const Fluxauth = JSON.parse(localStorage.getItem("fluxauth"));
  return await fetch(
    `https://jetpackbridge.runonflux.io/api/v1/dapps.php?filter=&zelid=${
      Fluxauth.zelid
    }&signature=${Buffer.from(Fluxauth.signature).toString(
      "base64"
    )}&loginPhrase=${Fluxauth.loginPhrase}`
  )
    .then((res) => res.json())
    .catch((err) => console.log(err));
};

const getFluxData = async () => {
  return await fetch(`https://api.runonflux.io/apps/globalappsspecifications`, {
    method: "get",
  })
    .then((res) => res.json())
    .then((response) => response.data)
    .catch((err) => console.log(err));
};

export {
  handleStartClick,
  handleRestartClick,
  handleHardRedeployClick,
  handleRedeployClick,
  handleReinstallClick,
  handleStopClick,
  getFluxAuth,
  getPaidaddress,
  getAmout,
  getIpaddress,
  currentBlock,
  sendrawTransaction,
  handleUpdateServer,
  getAppSpecification,
  getExpire,
  getFluxAllUserData,
  getbenchmarks,
  gethardwareSpecification,
  getFluxData,
};
