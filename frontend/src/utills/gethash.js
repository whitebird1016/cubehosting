import bitgotx from "bitgo-utxo-lib";
import axios from "axios";
import { getValueHexBuffer, updateTitanNodeMessage } from ".";

const getHash = async (registerhash, mount, paidaddress) => {
  //   const network = bitgotx.networks.zelcash;
  //   const keyPair = bitgotx.ECPair.makeRandom({ network });
  //   const pubKey = keyPair.getPublicKeyBuffer().toString("hex");
  //   const privateKey = keyPair.getPublicKeyBuffer().toString("hex");
  //   console.log(pubKey);
  // Public Key: 029885d0696ed13d41af374c00345d6b4aa9c256f2147664fac95c772b7c122dc6
  // Private Key: KwkRTaKT2UTgxATu6et3ZwNHK3fRGzYjz8waJdf37LF8bjdWLFP9
  console.log(registerhash, "registerhash");
  try {
    const network = bitgotx.networks.zelcash;
    const publickey = [
      "029885d0696ed13d41af374c00345d6b4aa9c256f2147664fac95c772b7c122dc6",
    ].map(function (hex) {
      return Buffer.from(hex, "hex");
    });
    const amount = mount;
    const redeemScript = bitgotx.script.multisig.output.encode(1, publickey);
    const redeemScriptHex = redeemScript.toString("hex");
    const scriptPubKey = bitgotx.script.scriptHash.output.encode(
      bitgotx.crypto.hash160(redeemScript)
    );
    const address = bitgotx.address.fromOutputScript(scriptPubKey, network);
    console.log(redeemScriptHex, address);

    const explorer = "https://explorer.runonflux.io";
    const utx = await axios.get(`${explorer}/api/addr/${address}/utxo`);
    console.log(utx, "utx");
    const utxos = utx.data;
    let utxosUsedInCurrentTransaction = {};
    let satoshisSoFar = 0;
    const receiver = paidaddress;
    let history = [];
    const satoshisToSend = Math.round(amount * 1e8);
    const satoshisfeesToSend = 0;
    let recipients = [
      {
        address: receiver,
        satoshis: satoshisToSend,
      },
    ];
    let count = 0;

    let unsignedTxList = [];
    let txinfoList = [];
    let txinfo = "";
    const selectedCoins = new Set();
    const usedUtxos = new Set();
    let sendAllFlux = false;
    let multipleTxes = false;
    let avoidFluxNodeAmounts = false;

    for (let loop = 0; loop < 5; loop += 1) {
      history = [];
      satoshisSoFar = 0;
      recipients = [
        {
          address: receiver,
          satoshis: satoshisToSend,
        },
      ];
      count = 0;
      selectedCoins.clear();
      const addressFrom = address;
      const addressTo = receiver;
      let message = registerhash;

      // if this isn't the first tx, update the message
      if (loop > 0) {
        message = updateTitanNodeMessage(message);
      }
      let unsignedTx = {
        myAddress: addressFrom,
        receiver: addressTo,
        amount: amount,
        message: message,
        hex: "",
      };

      let coincontrol = {
        selectedValueSats: 0,
        selectedValueAmount: 0,
        selected: [],
        utxos: [],
      };
      console.log(unsignedTx, "unsignedTx");

      if (coincontrol.selectedValueSats > 0) {
        for (let j = 0; j < coincontrol.selected.length; j += 1) {
          if (coincontrol.selected[j] === true) {
            selectedCoins.add(
              coincontrol.utxos[j].txid + coincontrol.utxos[j].vout
            );
          }
        }
      }

      for (let i = 0; i < utxos.length; i += 1) {
        if (utxos[i].height !== 0) {
          if (
            avoidFluxNodeAmounts &&
            (+utxos[i].satoshis === 4000000000000 ||
              +utxos[i].satoshis === 1250000000000 ||
              +utxos[i].satoshis === 100000000000)
          ) {
            // eslint-disable-next-line no-continue
            continue;
          }

          if (coincontrol.selectedValueSats > 0) {
            if (!selectedCoins.has(utxos[i].txid + utxos[i].vout)) {
              // eslint-disable-next-line no-continue
              continue;
            }
          }

          if (usedUtxos.has(utxos[i].txid + utxos[i].vout)) {
            // eslint-disable-next-line no-continue
            continue;
          } else {
            usedUtxos.add(utxos[i].txid + utxos[i].vout);
            utxosUsedInCurrentTransaction[utxos[i].txid + utxos[i].vout] =
              utxos[i].satoshis;
          }

          history = history.concat({
            txid: utxos[i].txid,
            vout: utxos[i].vout,
            scriptPubKey: utxos[i].scriptPubKey,
            satoshis: utxos[i].satoshis,
          });

          satoshisSoFar += utxos[i].satoshis;
          count += 1;
          if (sendAllFlux) {
            if (count >= 2000) {
              break;
            }
            // eslint-disable-next-line no-continue
            continue;
          } else if (satoshisSoFar >= satoshisToSend + satoshisfeesToSend) {
            break;
          }
        }
      }
      console.log(sendAllFlux, "sendAllFlux");

      if (sendAllFlux) {
        // Update the recipient to the full flux amount
        // Overrides the amount that was put in the Amount to Send textbox
        recipients[0].satoshis = satoshisSoFar;

        // We don't have any change when sendAllFlux is true

        // All txs have fee 0
      } else {
        const refundSatoshis =
          satoshisSoFar - satoshisToSend - satoshisfeesToSend;
        if (refundSatoshis > 0) {
          recipients = recipients.concat({
            address: unsignedTx.myAddress,
            satoshis: refundSatoshis,
          });
        }
        if (refundSatoshis < 0) {
          unsignedTx.hex = "Insufficient amount";
          return;
        }
      }

      const txb = new bitgotx.TransactionBuilder(network, satoshisfeesToSend);
      txb.setVersion(4);
      txb.setVersionGroupId(0x892f2085);
      history.forEach((x) => txb.addInput(x.txid, x.vout));
      recipients.forEach((x) => txb.addOutput(x.address, x.satoshis));

      if (unsignedTx.message !== "") {
        const data = Buffer.from(unsignedTx.message, "utf8");
        const dataScript = bitgotx.script.nullData.output.encode(data);
        txb.addOutput(dataScript, 0);
      }

      const tx = txb.buildIncomplete();
      let destination = "";
      let change = "";
      console.log(tx, "tx");

      if ("outs" in tx) {
        if (tx.outs.length >= 1) {
          destination = bitgotx.address.fromOutputScript(
            tx.outs[0].script,
            network
          );
          const amountSending = Number(tx.outs[0].value * 1e-8).toFixed(8);
          txinfo = `Sending ${amountSending} FLUX to ${destination}`;
        }

        if (tx.outs.length >= 2) {
          if (tx.outs[1].script[0] === 0x6a) {
            // This is the message outpoint as it starts with OP_RETURN
          } else {
            change = bitgotx.address.fromOutputScript(
              tx.outs[1].script,
              network
            );
            const amountChange = Number(tx.outs[1].value * 1e-8).toFixed(8);
            txinfo += ` and sending back as change ${amountChange} FLUX to ${change}`;
          }
        }
      }
      txinfoList.push(txinfo);
      unsignedTx.hex = tx.toHex();
      unsignedTxList.push(unsignedTx);
      console.log(unsignedTxList, "unsignedTxList");
      if (sendAllFlux || !multipleTxes) {
        break;
      }
    }

    const hashType = bitgotx.Transaction.SIGHASH_ALL;
    const txhexSign = unsignedTxList[0].hex;
    const keyPair = bitgotx.ECPair.fromWIF(
      "KwkRTaKT2UTgxATu6et3ZwNHK3fRGzYjz8waJdf37LF8bjdWLFP9",
      network
    );
    const txbSign = bitgotx.TransactionBuilder.fromTransaction(
      bitgotx.Transaction.fromHex(txhexSign, network),
      network
    );
    let quickLoad = true;
    // eslint-disable-next-line no-unused-vars
    for (let i = 0; i < txbSign.inputs.length; i += 1) {
      const hash = getValueHexBuffer(txbSign.tx.ins[i].hash.toString("hex"));
      const { index } = txbSign.tx.ins[i];
      let value;
      console.log(hash, "hash");
      // Do a quick lookup in the utxos dictionary
      console.log(
        utxosUsedInCurrentTransaction,
        "utxosUsedInCurrentTransaction"
      );
      if (hash + index in utxosUsedInCurrentTransaction) {
        value = Math.round(Number(utxosUsedInCurrentTransaction[hash + index]));
      } else if (quickLoad) {
        // Only do it once
        quickLoad = false;

        // Fetch the first tx, so we can determine the address the inputs are coming from
        /* eslint-disable no-await-in-loop */
        const tx = await axios.get(`${explorer}/api/tx/${hash}`);
        const addr = tx.data.vout[index].scriptPubKey.addresses[0];

        // Get all utxos for that address with a single call
        /* eslint-disable no-await-in-loop */
        const utx = await axios.get(`${explorer}/api/addr/${addr}/utxo`);
        const utxos = utx.data;

        // Load utxo into dictionary
        /* eslint-disable no-loop-func */
        utxos.forEach((element) => {
          utxosUsedInCurrentTransaction[element.txid + element.vout] =
            element.satoshis;
        });

        // Check the utxo dictionary again for the txid + index
        if (hash + index in utxosUsedInCurrentTransaction) {
          value = Math.round(
            Number(utxosUsedInCurrentTransaction[hash + index])
          );
        } else {
          // If not found use the value received when fetching the singleton txhash above.
          value = Math.round(Number(tx.data.vout[index].value) * 1e8);
        }
      } else {
        // If quick searches don't work, default to fetching tx one at a time.
        /* eslint-disable no-await-in-loop */
        const tx = await axios.get(`${explorer}/api/tx/${hash}`);
        value = Math.round(Number(tx.data.vout[index].value) * 1e8);
      }
      txbSign.sign(
        i,
        keyPair,
        Buffer.from(redeemScriptHex, "hex"),
        hashType,
        value
      );
    }

    const txSign = txbSign.buildIncomplete();

    const txhexFinalSign = txSign.toHex();
    console.log(txhexFinalSign, "txhexSign");
    const txbFinalSign = bitgotx.TransactionBuilder.fromTransaction(
      bitgotx.Transaction.fromHex(txhexFinalSign, network),
      network
    );
    const txFinalSign = txbFinalSign.build();
    return txFinalSign.toHex();
  } catch (e) {
    console.log(e);
  }
};
export default getHash;
