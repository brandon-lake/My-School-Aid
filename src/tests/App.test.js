import React from "react";
import ReactDOM from "react-dom";
import { render } from "@testing-library/react";
import App from "./App";

it("renders the application", () => {
    // render the application
    const root = document.createElement("div");
    ReactDOM.render(<App />, root);
    
    // make assertion
    expect(root.querySelector("h1").textContent).toBe("My School Aid");
    // expect(root.querySelector("h2").textContent).toBe("Log In");
});
