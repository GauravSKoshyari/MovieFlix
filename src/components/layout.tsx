import React from "react";
import Header from "./header";
import { Outlet } from "react-router-dom";

export const Layout = () => {
  return (
    <>
      <Header />
      <main>
        <Outlet />
      </main>
      <foooter></foooter>
    </>
  );
};
