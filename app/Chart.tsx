import React, { useState, useEffect } from "react";
import { View, Text, ActivityIndicator } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import ChartBar from "@/components/ChartBar";
import { heightPercentageToDP } from "react-native-responsive-screen";
import customeStyles from "@/Styles";
import { useLocalSearchParams } from "expo-router";
export interface BarData {
  value: number;
  label: string;
}

const Chart = () => {
  const [barData, setBarData] = useState<BarData[] | null>(null);
  const [loading, setLoading] = useState(true);

  const { key } = useLocalSearchParams();

  useEffect(() => {
    const loadBarData = async () => {
      try {
        // Ensure 'key' is a string
        if (typeof key !== "string") {
          console.error("Invalid key type:", key);
          setLoading(false);
          return;
        }

        const storedData = await AsyncStorage.getItem(key);
        if (storedData) {
          setBarData(JSON.parse(storedData));
        } else {
          console.warn(`No data found for key: ${key}`);
        }
      } catch (error) {
        console.error("Error loading data:", error);
      } finally {
        setLoading(false);
      }
    };

    loadBarData();
  }, [key]);

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  return (
    <View
      style={[customeStyles.container, { marginTop: heightPercentageToDP(3) }]}
    >
      <Text style={customeStyles.subHeading}>Weekly Water Intake</Text>

      {barData ? (
        <View style={{ alignItems: "center", marginTop: 20 }}>
          <ChartBar ChartData={barData} />
        </View>
      ) : (
        <Text style={customeStyles.Text}>No data available</Text>
      )}
    </View>
  );
};

export default Chart;
