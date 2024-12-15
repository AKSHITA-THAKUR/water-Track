import { View, Text, Pressable } from "react-native";

import React from "react";
interface ButtonProp {
  title: string;
  onButtonPress: () => void;
  backGroundColor?: string;
}

const Button: React.FC<ButtonProp> = ({ title, onButtonPress }) => {
  return (
    <Pressable
      onPress={onButtonPress}
      style={{
        marginTop: 20,
        backgroundColor: "#2196F3",
        padding: 15,
        borderRadius: 5,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Text style={{ color: "white", fontSize: 16 }}>{title}</Text>
    </Pressable>
  );
};

export default Button;
