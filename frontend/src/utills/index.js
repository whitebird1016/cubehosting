export const updateTitanNodeMessage = (message) => {
  // Example Titan Node 15
  if (message.includes("Titan Node")) {
    const text = message;
    const getPart = text.replace(/[^\d.]/g, ""); // returns '15'
    const num = parseInt(getPart, 10); // returns 15
    const newVal = num + 1; // returns 16
    const reg = new RegExp(num); // create dynamic regexp
    const newstring = text.replace(reg, newVal); // returns Titan Node 16
    return newstring;
  }
  return "";
};

export const getValueHexBuffer = (hex) => {
  const buf = Buffer.from(hex, "hex").reverse();
  return buf.toString("hex");
};

export const getRandomNumber = () => {
  let foo = "";
  for (let i = 0; i < 19; ++i) foo += Math.floor(Math.random() * 10);
  return foo;
};
