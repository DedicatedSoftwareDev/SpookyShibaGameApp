import * as React from "react";
import { useState, useEffect } from "react";
import { StatusBar } from "expo-status-bar";
import axios from "axios";
import Web3 from "web3";
import {
  StyleSheet,
  View,
  Modal,
  ImageBackground,
  TextInput,
  Image,
  TouchableOpacity,
  Alert,
} from "react-native";

axios.defaults.baseURL = "http://82.180.161.210:3000/";
//axios.defaults.baseURL = "http://10.10.13.75:8080";
import MainGame from "./src/components/MainGame";
import History from "./src/components/History";
import Timer from "./src/components/Timer";
import GameEnd from "./src/components/GameEnd";
import BuyToken from "./src/components/BuyToken";

const itemName = [
  "You get Legend NFT",
  "You get Rare NFT",
  "You get Common NFT",
  "You get T-shirt",
  "No earn",
];

const pancakeSwapContract =
  "0x10ED43C718714eb63d5aA57B78B54704E256024E".toLowerCase();
const pancakeSwapAbi = [
  {
    inputs: [
      { internalType: "uint256", name: "amountIn", type: "uint256" },
      { internalType: "address[]", name: "path", type: "address[]" },
    ],
    name: "getAmountsOut",
    outputs: [
      { internalType: "uint256[]", name: "amounts", type: "uint256[]" },
    ],
    stateMutability: "view",
    type: "function",
  },
];
import tokenAbi from "./src/abis/SpookyShibaToken.json";

export default function App() {
  const [gameBoxStatus, setGameBoxStatus] = useState(4);
  const [modalVisible, setModalVisible] = useState(false);
  const [currentStatus, setStatus] = useState("");
  const [historyList, setHistoryList] = useState([]);
  const [walletAddress, setWalletAddress] = useState(null);
  const [inputData, setInputData] = useState("");
  const [lastTime, setLastTime] = useState("");
  const [playNumber, setPlayNumber] = useState(4);
  useEffect(() => {
    const asyncWalletAddress = async () => {
      if (walletAddress) {
        const response = await axios
          .get(`time/${walletAddress}`)
          .then((response) => {
            setLastTime(response.data.result);
          })
          .catch((error) => console.log(error));

        const web3 = new Web3("https://bsc-dataseed1.binance.org");
        const tokenAddress = "0x9c2B1B3780A8B36B695f0b2781668664aC1Bf25A";
        let bnbPrice = await calcBNBPrice();
        // console.log(`CURRENT BNB PRICE: ${bnbPrice}`);
        let tokens_to_sell = 1;
        let priceInBnb =
          (await calcSell(tokens_to_sell, tokenAddress)) / tokens_to_sell; // calculate TOKEN price in BNB
        // console.log(`SPKY_TOKEN VALUE IN USD: ${priceInBnb * bnbPrice}`);
        let balance = await calcBalance(tokenAddress, walletAddress);
        if (balance * priceInBnb * bnbPrice < 100) setGameBoxStatus(5);
        else setGameBoxStatus(0);
        setPlayNumber(Math.floor(Math.random() * 1000000));
      } else setGameBoxStatus(4);
    };
    asyncWalletAddress();
  }, [walletAddress]);

  const _onPressHistoryButton = async () => {
    setGameBoxStatus(2);
    const response = await axios
      .get(`history/${walletAddress}`)
      .then((response) => {
        setHistoryList(response.data.history);
      })
      .catch((error) => console.log(error));
  };
  const setDecimals = (number, decimals) => {
    number = number.toString();
    let numberAbs = number.split(".")[0];
    let numberDecimals = number.split(".")[1] ? number.split(".")[1] : "";
    while (numberDecimals.length < decimals) {
      numberDecimals += "0";
    }
    return numberAbs + numberDecimals;
  };
  const calcBNBPrice = async () => {
    const web3 = new Web3("https://bsc-dataseed1.binance.org");
    const BNBTokenAddress = "0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c"; //BNB
    const USDTokenAddress = "0x55d398326f99059fF775485246999027B3197955"; //USDT
    let bnbToSell = web3.utils.toWei("1", "ether");
    let amountOut;
    try {
      let router = await new web3.eth.Contract(
        pancakeSwapAbi,
        pancakeSwapContract
      );
      amountOut = await router.methods
        .getAmountsOut(bnbToSell, [BNBTokenAddress, USDTokenAddress])
        .call();
      amountOut = web3.utils.fromWei(amountOut[1]);
    } catch (error) {}
    if (!amountOut) return 0;
    return amountOut;
  };
  const calcSell = async (tokensToSell, tokenAddress) => {
    const web3 = new Web3("https://bsc-dataseed1.binance.org");
    const BNBTokenAddress = "0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c"; //BNB

    let tokenRouter = await new web3.eth.Contract(tokenAbi, tokenAddress);
    let tokenDecimals = await tokenRouter.methods.decimals().call();

    // let balance = await tokenRouter.methods
    //   .balanceOf("0xb0c2ae989d439725c7715ee1179179b47f3412a8")
    //   .call();
    // console.log(balance);
    tokensToSell = setDecimals(tokensToSell, tokenDecimals);
    let amountOut;
    try {
      let router = await new web3.eth.Contract(
        pancakeSwapAbi,
        pancakeSwapContract
      );

      amountOut = await router.methods
        .getAmountsOut(tokensToSell, [tokenAddress, BNBTokenAddress])
        .call();
      amountOut = web3.utils.fromWei(amountOut[1]);
    } catch (error) {}

    if (!amountOut) return 0;
    return amountOut;
  };
  const calcBalance = async (tokenAddress, wAddress) => {
    const web3 = new Web3("https://bsc-dataseed1.binance.org");
    const BNBTokenAddress = "0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c"; //BNB

    let tokenRouter = await new web3.eth.Contract(tokenAbi, tokenAddress);
    let tokenDecimals = await tokenRouter.methods.decimals().call();

    let balance = await tokenRouter.methods.balanceOf(wAddress).call();
    const temp = 10 ** 18;
    return balance / temp;
  };
  const _onPressPlayButton = async () => {
    if (!walletAddress) setModalVisible(!modalVisible);
    else {
      const web3 = new Web3("https://bsc-dataseed1.binance.org");
      const tokenAddress = "0x9c2B1B3780A8B36B695f0b2781668664aC1Bf25A";
      let bnbPrice = await calcBNBPrice();
      // console.log(`CURRENT BNB PRICE: ${bnbPrice}`);
      let tokens_to_sell = 1;
      let priceInBnb =
        (await calcSell(tokens_to_sell, tokenAddress)) / tokens_to_sell; // calculate TOKEN price in BNB
      // console.log(`SPKY_TOKEN VALUE IN USD: ${priceInBnb * bnbPrice}`);
      let balance = await calcBalance(tokenAddress, walletAddress);
      if (balance * priceInBnb * bnbPrice < 100) setGameBoxStatus(5);
      else {
        const response = await axios
          .get(`time/${walletAddress}`)
          .then((response) => {
            setLastTime(response.data.result);
          })
          .catch((error) => console.log(error));
        setGameBoxStatus(0);
      }
    }
  };
  const gameFinish = async () => {
    setGameBoxStatus(3);
    let earnThing;
    if (playNumber == 3) earnThing = 0;
    else if (playNumber % 100000 == 0) earnThing = 1;
    else if (playNumber % 10000 == 1) earnThing = 2;
    else if (playNumber % 1000 == 2) earnThing = 3;
    else earnThing = 4;
    await axios
      .post("/add", {
        address: walletAddress,
        earn: itemName[earnThing],
        playtime: new Date().toString(),
      })
      .then((response) => {})
      .catch((error) => console.log(error));
  };
  const startGame = async (address, statusnum) => {
    setGameBoxStatus(statusnum);
    setWalletAddress(address);
  };
  const _addressButtonClick = () => {
    if (!inputData.startsWith("0x") || inputData.length != 42)
      setInputData("Invalid Wallet Address");
    else {
      setWalletAddress(inputData);
      setModalVisible(!modalVisible);
    }
  };

  return (
    <View style={styles.container}>
      <ImageBackground
        source={require("./assets/images/background.png")}
        resizeMode={"stretch"}
        style={styles.background}
      >
        <Image
          source={require("./assets/images/logo.png")}
          resizeMode={"stretch"}
          style={styles.logo}
        ></Image>
        <Image
          source={require("./assets/images/game-box.png")}
          resizeMode={"stretch"}
          style={styles.gamebox}
        ></Image>
        {gameBoxStatus == 0 && (
          <Timer finish={setGameBoxStatus} lasttime={lastTime} />
        )}
        {gameBoxStatus == 1 && (
          <MainGame gamefinish={gameFinish} playnumber={playNumber} />
        )}
        {gameBoxStatus == 2 && <History list={historyList} />}
        {gameBoxStatus == 3 && <GameEnd getearn={playNumber} />}
        {gameBoxStatus == 5 && <BuyToken />}
        {/* <WalletConnectExperience startGame={startGame} /> */}
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => {
            Alert.alert("Modal has been closed.");
            setModalVisible(!modalVisible);
          }}
        >
          <View style={styles.centeredview}>
            <ImageBackground
              source={require("./assets/images/modalback.png")}
              resizeMode={"stretch"}
              style={styles.modalview}
            >
              <TextInput
                onChangeText={setInputData}
                value={inputData}
                style={styles.addressinput}
              />
              <TouchableOpacity
                style={styles.setaddressbutton}
                onPress={_addressButtonClick}
              ></TouchableOpacity>
            </ImageBackground>
          </View>
        </Modal>
        <TouchableOpacity
          style={styles.settingbutton}
          onPress={() => setModalVisible(true)}
        >
          <Image
            source={require("./assets/images/other-icon-back.png")}
            resizeMode={"stretch"}
            style={styles.iconback}
          ></Image>
          <Image
            source={require("./assets/images/metamask-icon.png")}
            resizeMode={"stretch"}
            style={styles.icon}
          ></Image>
        </TouchableOpacity>
        <TouchableOpacity style={styles.soundbutton}>
          <Image
            source={require("./assets/images/other-icon-back.png")}
            resizeMode={"stretch"}
            style={styles.iconback}
          ></Image>
          <Image
            source={require("./assets/images/sound-icon.png")}
            resizeMode={"stretch"}
            style={styles.icon}
          ></Image>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.playbutton}
          onPress={_onPressPlayButton}
        >
          <Image
            source={require("./assets/images/play-icon.png")}
            resizeMode={"stretch"}
            style={styles.iconback}
          ></Image>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.historybutton}
          onPress={_onPressHistoryButton}
        >
          <Image
            source={require("./assets/images/other-icon-back.png")}
            resizeMode={"stretch"}
            style={[
              styles.iconback,
              {
                transform: [{ rotateY: "180deg" }],
              },
            ]}
          ></Image>
          <Image
            source={require("./assets/images/history-icon.png")}
            resizeMode={"stretch"}
            style={styles.icon}
          ></Image>
        </TouchableOpacity>
        <StatusBar style="auto" />
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  centeredview: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
  },
  modalview: {
    margin: 20,
    padding: 35,
    alignItems: "center",
    elevation: 5,
    width: 600,
    height: 250,
  },
  addressinput: {
    color: "white",
    top: 60,
    fontSize: 35,
    width: 500,
    height: 50,
  },
  setaddressbutton: {
    top: 100,
    width: 350,
    height: 45,
  },
  background: {
    flex: 1,
    width: "100%",
    height: "100%",
  },
  logo: {
    position: "absolute",
    left: "3%",
    top: "2%",
    width: "12%",
    height: "13%",
  },
  gamebox: {
    flex: 1,
    position: "absolute",
    width: "54%",
    height: "90%",
    left: "23%",
    top: "5%",
  },
  iconback: {
    flex: 1,
    width: "100%",
    height: "100%",
  },
  settingbutton: {
    flex: 1,
    position: "absolute",
    width: "15%",
    height: "15%",
    top: "50%",
  },
  icon: {
    flex: 1,
    position: "absolute",
    left: "35%",
    width: "30%",
    height: "35%",
    top: "40%",
  },
  soundbutton: {
    flex: 1,
    position: "absolute",
    width: "15%",
    height: "15%",
    top: "70%",
  },
  playbutton: {
    flex: 1,
    position: "absolute",
    width: "20%",
    height: "18%",
    top: "45%",
    right: "2%",
  },
  historybutton: {
    flex: 1,
    position: "absolute",
    width: "15%",
    height: "15%",
    top: "75%",
    right: 0,
  },
  status: {
    color: "white",
  },
});
