import { Text, View, TextInput, Pressable } from "react-native";
import { useState, useEffect } from "react";
import { useRouter } from "expo-router";
import Button from "@/components/Button";
import AsyncStorage from "@react-native-async-storage/async-storage";
import customeStyles from "../Styles";
import { LogLevel, OneSignal } from "react-native-onesignal";

interface BarData {
  value: number;
  label: string;
}
export default function Index() {
  const router = useRouter();
  const [amount, setAmount] = useState("");

  OneSignal.Debug.setLogLevel(LogLevel.Verbose);
  OneSignal.initialize("cbaf8d4f-6a46-493b-9059-4d8b2706c46a");
  OneSignal.Notifications.requestPermission(true);

  const [barData, setBarData] = useState<BarData[]>([
    { value: 0, label: "Monday" },
    { value: 0, label: "Tuesday" },
    { value: 0, label: "Wednesday" },
    { value: 0, label: "Thursday" },
    { value: 0, label: "Friday" },
    { value: 0, label: "Saturday" },
    { value: 0, label: "Sunday" },
  ]);
  const handleChart = () => {
    router.navigate({ pathname: "/Chart", params: { key: "WaterIntake" } });
  };

  const handlePreviousData = () => {
    router.navigate("/previousData");
  };
  const getPreviousDayWeekLabel = () => {
    // FUNCTION TO  GET THE WEEK AND THE MONTH of PREVIOUS DAY WHEN IF WEEK STARTS ON MONDAY
    const currentDate = new Date();
    const previousDay = new Date(currentDate);
    previousDay.setDate(currentDate.getDate() - 1);
    const monthName = previousDay.toLocaleString("en-US", { month: "long" });
    const firstDateOfMonth = new Date(
      previousDay.getFullYear(),
      previousDay.getMonth(),
      1
    );
    let firstDayOfMonth = firstDateOfMonth.getDay();
    firstDayOfMonth = firstDayOfMonth === 0 ? 7 : firstDayOfMonth; // If want to count monday as frst day of week
    const today = previousDay.getDate();
    const adjustedDay = today + firstDayOfMonth - 1;
    const weekNumber = Math.floor(adjustedDay / 7 - 1) + 1;
    return `Week ${weekNumber} of ${monthName}`;
  };
  const getDayIndex = () => {
    const date = new Date();
    const day = date.toLocaleString("en-US", { weekday: "long" });
    const days = [
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
      "Sunday",
    ];
    return days.indexOf(day);
  };
  useEffect(() => {
    const loadData = async () => {
      try {
        const storedData = await AsyncStorage.getItem("WaterIntake"); //LOAD DATA STORED IN WATERINTAKE KEY
        const resetFlag = await AsyncStorage.getItem("WeekReset");
        const todayIndex = getDayIndex();

        if (storedData) {
          const parsedData = JSON.parse(storedData);

          if (todayIndex === 0) {
            // IF MONDAY
            if (resetFlag === "true") {
              // AND  THE RESET FLAG IS TRUE
              const weekLabel = getPreviousDayWeekLabel();

              await AsyncStorage.setItem(weekLabel, JSON.stringify(parsedData)); // SAVE THE PREVIOUS WEEK DATA UNDER WEEK LABEL
              console.log("Data saved under label:", weekLabel, parsedData);

              const resetData = barData.map((day) => ({ ...day, value: 0 })); // AND RESET DATA TO 0
              setBarData(resetData);
              await AsyncStorage.setItem(
                "WaterIntake",
                JSON.stringify(resetData)
              );
              await AsyncStorage.setItem("WeekReset", "false"); // AND TURN THE FLAG FALSE
            } else {
              setBarData(parsedData);
            }
          } else {
            if (resetFlag !== "true") {
              //
              await AsyncStorage.setItem("WeekReset", "true");
            }
            setBarData(parsedData);
          }
        } else {
          const initialData = [
            { value: 0, label: "Monday" },
            { value: 0, label: "Tuesday" },
            { value: 0, label: "Wednesday" },
            { value: 0, label: "Thursday" },
            { value: 0, label: "Friday" },
            { value: 0, label: "Saturday" },
            { value: 0, label: "Sunday" },
          ];
          setBarData(initialData);
          await AsyncStorage.setItem(
            "WaterIntake",
            JSON.stringify(initialData)
          );
          await AsyncStorage.setItem("WeekReset", "true");
        }
      } catch (error) {
        console.error("Error in loadData:", error);
      }
    };

    loadData();
  }, []);
  const handleInputChange = (text: string) => {
    // FOR CONVERTING STRING INTO NUMBERS ONLY
    if (/^\d*$/.test(text)) {
      setAmount(text);
    }
  };

  const handleSubmit = async () => {
    const dayIndex = getDayIndex();
    const copyData = [...barData];
    copyData[dayIndex].value += Number(amount);
    setBarData(copyData);
    await AsyncStorage.setItem("WaterIntake", JSON.stringify(copyData));
    alert(`You've consumed ${copyData[dayIndex].value} ml of water today.`);
    setAmount("");
  };
  const todayIndex = getDayIndex(); // GET THE DAY OF THE WEEK
  const Today = new Date().toLocaleString("en-US", { weekday: "long" });
  return (
    <View style={customeStyles.container}>
      <Text style={customeStyles.heading}>Weekly Water Intake</Text>

      <Text style={customeStyles.subHeading}>
        You've consumed {barData[todayIndex].value} ml of water today.
      </Text>

      <Text style={customeStyles.Text}>
        Enter the water amount you took on {Today}:
      </Text>
      <View style={{ flexDirection: "row", gap: 10, marginBottom: 20 }}>
        <TextInput
          placeholder="Enter amount in ml"
          inputMode="numeric"
          keyboardType="number-pad"
          value={amount}
          onChangeText={handleInputChange}
          style={{
            padding: 15,
            borderColor: "#ccc",
            borderWidth: 1,
            borderRadius: 5,
            width: "70%",
            fontSize: 16,
          }}
        />
        <Pressable
          style={{
            paddingVertical: 15,
            paddingHorizontal: 25,
            backgroundColor: "#4CAF50",
            borderRadius: 5,
            justifyContent: "center",
            alignItems: "center",
          }}
          onPress={handleSubmit}
        >
          <Text style={{ color: "white", fontSize: 16 }}>Submit</Text>
        </Pressable>
      </View>

      <Button onButtonPress={handleChart} title="ShowChart" />
      <Button onButtonPress={handlePreviousData} title="Show Previous Data" />
    </View>
  );
}
