import React, { useState } from "react";
import { createRoot } from "react-dom/client";

const App = () => {
  const [age, setAge] = useState(0);

  const increaseAge = () => {
    setAge(age + 1);
  };

  return (
    <div>
      <div>Age: {age}</div>
      <button onClick={increaseAge}>Increase</button>
    </div>
  );
};

if (typeof document != "undefined") {
  const root = createRoot(document.getElementById("root"));
  root.render(<App />);
}

exports = "Hello from 'app.tsx' :)";
