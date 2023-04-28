import { View, Text } from "react-native";
import React, { FC } from "react";
import Layout from "../../layout/Layout";
import BLECharging from "./BLECharging";
import Header from "../home/Header";

const Charging: FC = () => {
  return (
    <Layout isScrollView={false}>
      <Header />
      <BLECharging></BLECharging>
    </Layout>
  );
};

export default Charging;
