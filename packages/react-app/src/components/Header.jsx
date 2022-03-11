import { PageHeader } from "antd";
import React from "react";

// displays a page header

export default function Header({ auth }) {
  return (
    <>
      <a href="https://github.com/austintgriffith/scaffold-eth" target="_blank" rel="noopener noreferrer">
        <PageHeader
          title="🏗 scaffold-eth"
          subTitle="forkable Ethereum dev stack focused on fast product iteration"
          style={{ cursor: "pointer" }}
        />
      </a>
      <div>{auth ? `Your session is authenticated` : `Your session is NOT authenticated`}</div>
    </>
  );
}
