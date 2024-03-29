import { PayPalScriptProvider } from "@paypal/react-paypal-js";
import ButtonWrapper from "./PayButtons";

const currency = "USD";

// Custom component to wrap the PayPalButtons and handle currency changes

const Paypal = (props) => {
  return (
    <PayPalScriptProvider
      options={{
        "client-id":
          "AQmG7pFSUys2ClNaqkhf3IMqWBlpmB2z3eYSbYXdt2P__oUbBmivPommJEmaAVGTDU-K2Ji0k22mGQcY",
        components: "buttons",
        intent: "capture",
      }}
    >
      <ButtonWrapper
        currency={currency}
        showSpinner={false}
        cost={props.cost}
        setFlag={props.setFlag}
      />
    </PayPalScriptProvider>
  );
};

export default Paypal;
