import { View, Text, StyleSheet, Linking } from "react-native";
import React, { useState, useEffect } from "react";
const imageUri = [
  require("../../assets/images/legend.png"),
  require("../../assets/images/rare.png"),
  require("../../assets/images/common.png"),
  require("../../assets/images/shirt.png"),
  require("../../assets/images/empty.png"),
];
const itemName = [
  "You get Legend NFT",
  "You get Rare NFT",
  "You get Common NFT",
  "You get T-shirt",
  "Ooops.. Try again",
];

export default function BuyToken() {
  return (
    <View style={styles.endbox}>
      {/* <View style={styles.imgbox}>
        <Image
          source={imageUri[earnNumber]}
          resizeMode={"stretch"}
          style={styles.earnimg}
        ></Image>
      </View> */}
      <Text style={styles.earntext}>You don't have enough Token </Text>
      <Text
        style={styles.luckytext}
        onPress={() => {
          Linking.openURL(
            "https://pancakeswap.finance/swap/0x9c2B1B3780A8B36B695f0b2781668664aC1Bf25A"
          );
        }}
      >
        Buy $100 to Play
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  endbox: {
    flex: 1,
    position: "absolute",
    width: "40%",
    height: "60%",
    left: "30%",
    top: "20%",
    padding: "1%",
    justifyContent: "center",
    alignItems: "center",
  },
  earntext: {
    color: "#fff",
    fontSize: 20,
  },
  earnimg: {
    width: "100%",
    height: "100%",
  },
  imgbox: {
    width: "40%",
    height: "40%",
  },
  luckytext: {
    color: "#24ff35",
    fontSize: 15,
  },
});
