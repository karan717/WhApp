import { View, Text, ScrollView } from "react-native";
import React, { FC } from "react";
import { layoutStyle } from "../../style";

interface ILayout {
  isScrollView?: boolean;
  children: React.ReactNode;
}

const Layout: FC<ILayout> = ({ children, isScrollView = true }) => {
  return (
    <View style={layoutStyle.container}>
      {isScrollView ? <ScrollView>{children}</ScrollView> : children}
    </View>
  );
};

export default Layout;
