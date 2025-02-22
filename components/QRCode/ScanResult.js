import React from "react";
import {
  View,
  Text,
  Button,
  StyleSheet,
  Image,
  TouchableOpacity,
  Share,
} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import * as Linking from "expo-linking";
import * as Sharing from "expo-sharing";
import * as Clipboard from "expo-clipboard";

export default function ScanResult({ route, navigation }) {
  const { qrData } = route.params;

  const openLink = () => {
    if (Linking.canOpenURL(qrData)) {
      Linking.openURL(qrData);
    } else {
      alert("Invalid URL");
    }
  };

  // Function to Share the QR Data
  const shareLink = async () => {
    try {
      await Share.share({
        message: qrData, // The scanned QR code data
      });
    } catch (error) {
      console.error("Error sharing:", error);
    }
  };

  const copyToClipboard = () => {
    Clipboard.setStringAsync(qrData);
    alert("Copied to Clipboard!");
  };

  return (
    <View style={styles.container}>
      <Text style={{ fontSize: 20, fontWeight: 600, margin: 20 }}>
        {qrData}
      </Text>
      <View style={styles.btnContainer}>
        <TouchableOpacity style={styles.touchable} onPress={openLink}>
          <Text style={styles.icons}>
            <Ionicons name="open" size={45} color="white" />
          </Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.touchable} onPress={shareLink}>
          <Text style={styles.icons}>
            <Ionicons name="share-social" size={45} color="white" />
          </Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.touchable} onPress={copyToClipboard}>
          <Text style={styles.icons}>
            <Ionicons name="copy" size={45} color="white" />
          </Text>
        </TouchableOpacity>
      </View>
      <Button title="History" onPress={()=>navigation.navigate("History")}/>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
  },
  btnContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 30,
  },
  touchable: {
    width: "30%",
  },
  icons: {
    textAlign: "center",
    backgroundColor: "black",
    padding: 20,
    margin: 10,
    borderRadius: 10,
  },
});
