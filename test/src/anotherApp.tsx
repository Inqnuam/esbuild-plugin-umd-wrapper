import React, { useState } from "react";
import { createRoot } from "react-dom/client";
import { MyComponent, someExternalValue } from "./component";

const App = () => {
  const [age, setAge] = useState(98);

  const decreaseAge = () => {
    setAge(age - 1);
  };

  return (
    <div>
      <div>Age: {age}</div>
      <button onClick={decreaseAge}>Decrease</button>
      <div>
        <MyComponent />
      </div>
    </div>
  );
};

console.log("someExternalValue", someExternalValue);

if (typeof document != "undefined") {
  const root = createRoot(document.getElementById("root"));
  root.render(<App />);
}

export const someInternalThing = { message: "This app use an external component :)", someValue: true };
function startApp() {}
export default startApp;
