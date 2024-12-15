import { View, Text, Pressable } from "react-native";
import { StyleSheet } from "react-native";
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from "react-native-responsive-screen";
import { useRouter } from "expo-router";
import React, { useEffect } from "react";
import { useState } from "react";
import customeStyles from "@/Styles";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Button from "@/components/Button";
const previousData = () => {
  const [weekKeys, setWeekKeys] = useState<string[]>([]);
  const router = useRouter();
  const fetchWeekKeys = async () => {
    // FETCH ALL THE KEYS WHICH STARTS WITH WEEK
    try {
      const allKeys = await AsyncStorage.getAllKeys();
      const filteredKeys = allKeys.filter((key) => key.startsWith("Week"));
      setWeekKeys(filteredKeys);
    } catch (error) {
      console.error("Error fetching week keys:", error);
    }
  };

  useEffect(() => {
    fetchWeekKeys();
  }, []);
  return (
    <View style={[customeStyles.container, { justifyContent: "flex-start" }]}>
      <Text style={[customeStyles.subHeading]}>Previous Weeks data</Text>
      {weekKeys.length > 0 ? (
        weekKeys.map((key) => {
          // Skip rendering a Pressable if the key is "WeekReset"
          if (key === "WeekReset") {
            return null;
          }
          return (
            <Button
              key={key}
              title={key}
              onButtonPress={() =>
                router.navigate({ pathname: "/Chart", params: { key: key } })
              }
            />
          );
        })
      ) : (
        <Text style={customeStyles.Text}>No previous weeks found</Text>
      )}
    </View>
  );
};
export default previousData;
