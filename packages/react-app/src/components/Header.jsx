import { PageHeader } from "antd";
import React from "react";

export default function Header() {
  return (
    <a href="https://github.com/dallonasnes/cryptolingo" target="_blank" rel="noopener noreferrer">
      <PageHeader
        title="CryptoLingo"
        subTitle="Get paid in crypto to teach or learn a language"
        style={{ cursor: "pointer" }}
      />
    </a>
  );
}
