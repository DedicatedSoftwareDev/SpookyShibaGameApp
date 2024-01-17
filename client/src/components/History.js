import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { Col, Row, Grid } from "react-native-easy-grid";
import React from "react";

export default function History(props) {
  const { list } = props;
  return (
    <View style={styles.historybox}>
      <View style={styles.tableContainer}>
        <View style={styles.tableRow}>
          <View style={styles.tableColumnClockInOutTimes}>
            <Text style={[{ color: "#ffd209" }, { fontSize: 25 }]}>Earn</Text>
          </View>
          <View style={styles.tableColumnTotals}>
            <Text style={[{ color: "#24ff35" }, { fontSize: 25 }]}>Time</Text>
          </View>
        </View>
        {list.length ? (
          list.map((item, index) => {
            let temp = new Date(item.playtime);
            let time =
              temp.getFullYear() +
              "/" +
              (temp.getMonth() + 1) +
              "/" +
              temp.getDate() +
              " " +
              temp.getHours() +
              ":" +
              temp.getMinutes() +
              ":" +
              temp.getSeconds();
            return (
              <View key={index} style={styles.tableRow}>
                <View style={styles.tableColumnClockInOutTimes}>
                  <Text style={styles.textLineItem}>{item.earn}</Text>
                </View>
                <View style={styles.tableColumnTotals}>
                  <Text style={styles.textLineItem}>{time}</Text>
                </View>
              </View>
            );
          })
        ) : (
          <></>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  historybox: {
    position: "absolute",
    width: "40%",
    height: "60%",
    left: "30%",
    top: "20%",
    padding: "1%",
  },
  rightborder: {
    borderColor: "white",
    borderRightWidth: 1,
  },
  leftborder: {
    borderColor: "white",
    borderLeftWidth: 1,
  },
  topborder: {
    borderColor: "white",
    borderTopWidth: 1,
  },
  bottomborder: {
    borderColor: "white",
    borderBottomWidth: 1,
  },
  cell: {
    justifyContent: "center",
    alignItems: "center",
    padding: 15,
  },
  text: {
    color: "#fff",
    fontSize: 20,
  },
  tableColumnHeader: {
    alignItems: "center",
    backgroundColor: "#1FE0A2",
    flex: 5,
    justifyContent: "center",
  },
  tableColumnClockInOutTimes: {
    alignItems: "center",
    flex: 2,
    justifyContent: "center",
    margin: 1,
  },
  tableColumnTotals: {
    alignItems: "center",
    flex: 3,
    justifyContent: "center",
    margin: 1,
  },
  tableRow: {
    flex: 5,
    flexDirection: "row",
    maxHeight: 40,
  },

  tableContainer: {
    borderRadius: 5,
    flex: 1,
    marginTop: 0,
    padding: 10,
  },
  textLineItem: {
    color: "#FFFFFF",
  },
});
