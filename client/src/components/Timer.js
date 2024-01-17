import React, { useState, useEffect } from "react";

import { SafeAreaView, StyleSheet, Text, View } from "react-native";

export default function Timer({ finish, lasttime }) {
  const useCountdown = () => {
    const countDownDate = new Date(lasttime).getTime();

    const [countDown, setCountDown] = useState(
      new Date().getTime() - countDownDate
    );
    useEffect(() => {
      const interval = setInterval(() => {
        setCountDown(new Date().getTime() - countDownDate);
      }, 1000);

      return () => clearInterval(interval);
    }, [countDownDate]);

    return getReturnValues(countDown);
  };
  const getReturnValues = (countDown) => {
    const days = Math.floor(countDown / (1000 * 60 * 60 * 24));
    const hours = Math.floor(
      (countDown % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
    );
    const minutes = Math.floor((countDown % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((countDown % (1000 * 60)) / 1000);

    return [days, hours, minutes, seconds];
  };
  const [days, hours, minutes, seconds] = useCountdown();
  if (days >= 1) {
    finish(1);
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.container}>
        <Text>
          <View style={styles.space}>
            <Text style={styles.numbers}>{`${
              hours > 9 ? hours : "0" + hours
            }`}</Text>
          </View>
          <View style={styles.space}>
            <Text style={styles.numbers}>{`${
              minutes > 9 ? minutes : "0" + minutes
            }`}</Text>
          </View>
          <View style={styles.space}>
            <Text style={styles.numbers}>{`${
              seconds > 9 ? seconds : "0" + seconds
            }`}</Text>
          </View>
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  space: {
    margin: 20,
    padding: 10,
  },
  numbers: {
    fontSize: 40,
    backgroundColor: "#ebbb20",
    padding: 10,
    borderRadius: 4,
  },
});
