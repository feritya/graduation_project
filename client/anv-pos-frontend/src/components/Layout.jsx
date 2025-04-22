import React from "react";

const Layout = ({ children }) => {
  return (
    <div style={{ backgroundColor: "#172627", minHeight: "100vh", padding: "20px", color: "white" }}>
      {children}
    </div>
  );
};

export default Layout;
