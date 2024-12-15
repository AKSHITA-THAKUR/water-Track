import { View, Text } from "react-native";
import React from "react";
import { BarChart } from "react-native-gifted-charts";
import { BarData } from "@/app/Chart";
interface BarChartData {
  ChartData: BarData[];
}
const ChartBar: React.FC<BarChartData> = ({ ChartData }) => {
  return (
    <BarChart
      spacing={30}
      maxValue={5000}
      frontColor="pink"
      noOfSections={5}
      data={ChartData}
      isThreeD
      barWidth={22}
      isAnimated
    />
  );
};

export default ChartBar;
