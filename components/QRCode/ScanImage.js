import React, { useState } from "react";
import { View, Button, Image, Text } from "react-native";
import { SQLiteProvider, useSQLiteContext } from "expo-sqlite";
import jsQR from "jsqr";
import * as ImagePicker from "expo-image-picker";
import * as FileSystem from "expo-file-system";
let base64js = require("base64-js");
import jpeg from "jpeg-js";
import ScanResult from "./ScanResult";

const initializeDB = async (db) => {
  try {
    await db.execAsync(`
          PRAGMA journal_mode = WAL;
          CREATE TABLE IF NOT EXISTS qrHistory (id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL, date TEXT NOT NULL, qrData TEXT NOT NULL);     
          `);
    console.log("DB connected");
  } catch (error) {
    console.log("Error in connecting DB", error);
  }
};

export default function ScanImage() {
  return (
    <SQLiteProvider databaseName="SDK52Test.db" onInit={initializeDB}>
      <ImageScanner />
    </SQLiteProvider>
  );
}

export function ImageScanner() {
  const [imageUri, setImageUri] = useState(null);
  const [qrText, setQrText] = useState("");
  const db = useSQLiteContext();

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      setImageUri(result.assets[0].uri);
      const text = await scanQRCode(result.assets[0].uri);
      setQrText(text || "No QR Code found.");
    }
  };

  const scanQRCode = async (uri) => {
    try {
      //Read image as base 64
      const base64 = await FileSystem.readAsStringAsync(uri, {
        encoding: FileSystem.EncodingType.Base64,
      });
      //Convert Base 64 to binary buffer
      const binaryData = await base64js.toByteArray(base64);

      //Decode JPEG to raw pixel data
      const rawImageData = await jpeg.decode(binaryData, { useTArray: true });

      // Convert to Uint8ClampedArray
      const uint8ClampedArray = await new Uint8ClampedArray(
        rawImageData.data.buffer
      );

      const qrCode = await jsQR(
        uint8ClampedArray,
        rawImageData.width,
        rawImageData.height
      );
      if (qrCode) {
        console.log("QR Code Found:", qrCode.data);
        await handleScanResult(qrCode.data);
        return qrCode.data;
      } else {
        console.log("No QR Code found.");
        return "No QR Code found.";
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleScanResult = async (data) => {
    let dateObj = new Date();
    let dateString = dateObj.toISOString();
    let date = dateString
      .slice(0, dateString.indexOf("T"))
      .split("-")
      .reverse()
      .join("-");

    // Extract and format the time (hh:mm)
    let time = dateObj.toTimeString().slice(0, 5); // Extracts HH:MM

    // Combine date and time
    let dateTime = `${date} ${time}`;

    await db.runAsync("INSERT INTO qrHistory (date, qrData) values (?, ?)", [
      dateTime,
      data,
    ]);
  };

  return (
    <View
      style={{
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        marginVertical: 20,
      }}
    >
      <Text style={{textAlign: "center", margin: 10}}>
        Click on the button to pick a QR Code.{" "}
        <Text style={{ color: "red" }}>
          Only .jpg or .jpeg files can be scanned.
        </Text>
      </Text>
      <Button title="Select Image" onPress={pickImage} color="black" />
      {imageUri && <Image source={{ uri: imageUri }} style={styles.image} />}
      {qrText ? <ScanResult qrData={qrText} /> : <Text style={{textAlign: "center", margin: 10, fontFamily: "mono", fontSize: 20}}>Scanning....</Text>}
    </View>
  );
}

const styles = {
  image: {
    width: 200,
    height: 200,
    marginVertical: 10,
  },
};
