import { PageHeader } from "antd";
import React from "react";

// displays a page header

export default function Header() {
  return (
    <a href="https://github.com/austintgriffith/scaffold-eth" target="_blank" rel="noopener noreferrer">
      <PageHeader
        title="CryptoLingo"
        subTitle="Get paid in crypto to learn a new language or upload content in your native language"
        style={{ cursor: "pointer" }}
      />
    </a>
  );
}
