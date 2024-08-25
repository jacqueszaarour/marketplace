import { GeistSans } from "geist/font/sans";
import { type AppType } from "next/app";
import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "~/styles/globals.css";

import "~/styles/globals.css";

const MyApp: AppType = ({ Component, pageProps }) => {
  return (
    <div className={GeistSans.className}>
      <Component {...pageProps} />
    </div>
  );
};

export default MyApp;
