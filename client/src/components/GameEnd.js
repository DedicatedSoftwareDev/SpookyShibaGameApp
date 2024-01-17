import { View, Text, StyleSheet, Image } from "react-native";
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

export default function GameEnd({ getearn }) {
  const [earnNumber, setEarnNumber] = useState();
  useEffect(() => {
    const asyncGetEarn = async () => {
      if (getearn == 3) setEarnNumber(0);
      else if (getearn % 100000 == 0) setEarnNumber(1);
      else if (getearn % 10000 == 1) setEarnNumber(2);
      else if (getearn % 1000 == 2) setEarnNumber(3);
      else setEarnNumber(4);
    };
    asyncGetEarn();
  }, [getearn]);

  return (
    <View style={styles.endbox}>
      <View style={styles.imgbox}>
        <Image
          source={imageUri[earnNumber]}
          resizeMode={"stretch"}
          style={styles.earnimg}
        ></Image>
      </View>
      {itemName[earnNumber] ? (
        <Text style={styles.earntext}>{itemName[earnNumber]}</Text>
      ) : (
        <></>
      )}
      <Text style={styles.luckytext}>Good luck for the next time.</Text>
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
