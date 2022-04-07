import React from "react";
import "./Home.css";
import "./Form.jsx";
import Form from "./Form.jsx";
export default function Home() {
  return (
    <div style={{ position: "relative", height: "100vh", overflow: "hidden" }}>
      <div className="bubbles gradient1 vlb top_right"></div>
      <div className="bubbles gradient3 mb mid_40"></div>
      <div className="bubbles gradient3 vlb bottom_left"></div>
      <div className="bubbles gradient4 lb top_left"></div>
      <div className="bubbles gradient2 vsb bottom_right"></div>
      <div className="bubbles gradient3 vsb mid_20"></div>
      <div className="bubbles gradient2 sb mid_60"></div>
      <div className="bubbles gradient4 vsb mid_10"></div>
      <div className="bubbles gradient4 mb mid_70"></div>
      <div className="bubbles gradient2 mb mid_90"></div>
      <Form />
    </div>
  );
}
