import React, { useState, useEffect } from "react";
import { View, Image, StyleSheet, Animated } from "react-native";

const imageUri = [
  require("../../assets/images/legend.png"),
  require("../../assets/images/rare.png"),
  require("../../assets/images/common.png"),
  require("../../assets/images/shirt.png"),
  require("../../assets/images/gift.png"),
  require("../../assets/images/dog.png"),
  require("../../assets/images/sidedog.png"),
];

export default function MainGame({ gamefinish, playnumber }) {
  const number = [];
  for (let i = 0; i < 9; i++) number[i] = i;
  const defaultPumpkinState = number.map((i) => false);
  const defaultPumpkinNumber = number.map((i) => -1);
  const [pumpkinNumber, setPumpkinNumber] = useState(defaultPumpkinNumber);
  const [pumpkinState, setPumpkinState] = useState(defaultPumpkinState);
  let animatedValue = new Animated.Value(0);
  let currentValue = 0;
  animatedValue.addListener(({ value }) => {
    currentValue = value;
  });

  const flipImageAnimation = () => {
    if (currentValue >= 90) {
      Animated.spring(animatedValue, {
        toValue: 0,
        tension: 10,
        friction: 8,
        useNativeDriver: false,
      }).start();
    } else {
      Animated.spring(animatedValue, {
        toValue: 180,
        tension: 10,
        friction: 8,
        useNativeDriver: false,
      }).start();
    }
  };
  const setInterpolate = animatedValue.interpolate({
    inputRange: [0, 180],
    outputRange: ["180deg", "360deg"],
  });

  const generateNums = (index) => {
    let i, j;
    let temp = [];
    let result = [];
    for (i = 0; i < 9; i++) temp[i] = result[i] = -1;
    for (i = 0; i < 6; i++) {
      j = 0;
      let current = Math.floor(math.random() * 9);
      while (j < i) {
        if (temp[j] == current) break;
        j++;
      }
      if (j < i) i--;
      else {
        temp[i] = current;
      }
    }
    for (i = 0; i < 6; i++) {
      let cnt = 0;
      let current = Math.floor(Math.random() * 7);
      for (j = 0; j < i; j++) if (result[temp[j]] == current) cnt++;
      if (cnt == 2 || current == index) i--;
      else result[temp[i]] = current;
    }
    for (i = 0; i < 9; i++) if (result[i] == -1) result[i] = index;
    return result;
  };
  const generateDefaultNums = () => {
    let i, j;
    let temp = [];
    let result = [9];
    for (i = 0; i < 9; i++) temp[i] = result[i] = -1;
    for (i = 0; i < 9; i++) {
      let cnt = 0;
      let current = Math.floor(Math.random() * 7);
      for (j = 0; j < i; j++) if (result[j] == current) cnt++;
      if (cnt == 2) i--;
      else result[i] = current;
    }
    return result;
  };
  const setGame = () => {
    let res = [];
    if (playnumber == 3) {
      res = generateNums(0);
    } else if (playnumber % 100000 == 0) {
      res = generateNums(1);
    } else if (playnumber % 10000 == 1) {
      res = generateNums(2);
    } else if (playnumber % 1000 == 2) {
      res = generateNums(3);
    } else {
      res = generateDefaultNums();
    }
    let newPumkinNumber = [...pumpkinNumber];
    for (let i = 0; i < 9; i++) newPumkinNumber[i] = res[i];
    setPumpkinNumber(newPumkinNumber);
  };
  const clickPumpkin = async (index) => {
    flipImageAnimation();
    let newPumpkinState = [...pumpkinState];
    newPumpkinState[index] = true;
    const selectedCount = newPumpkinState.filter((item) => item == true).length;
    if (selectedCount == 9) {
      gamefinish();
    }
    setPumpkinState(newPumpkinState);
  };
  useEffect(() => {
    setGame();
  }, [playnumber]);
  return (
    <View style={styles.mainbox}>
      {number.map((i) => (
        <View
          style={styles.boxitem}
          key={i}
          onStartShouldSetResponder={() => clickPumpkin(i)}
        >
          {pumpkinState[i] == 0 ? (
            <Animated.Image
              source={require("../../assets/images/pumpkin.png")}
              resizeMode={"stretch"}
              style={styles.pumpkin}
            ></Animated.Image>
          ) : (
            <Animated.Image
              source={imageUri[pumpkinNumber[i]]}
              resizeMode={"stretch"}
              style={styles.pumpkin}
            ></Animated.Image>
          )}
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  mainbox: {
    flex: 1,
    flexDirection: "row",
    flexWrap: "wrap",
    position: "absolute",
    width: "40%",
    height: "60%",
    left: "30%",
    top: "20%",
    padding: "1%",
  },
  boxitem: {
    width: "30%",
    height: "30%",
    marginLeft: "3%",
    marginTop: "3%",
  },
  pumpkin: {
    flex: 1,
    width: "100%",
    height: "100%",
  },
});
