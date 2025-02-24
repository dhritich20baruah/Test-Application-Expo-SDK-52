import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Button,
  StyleSheet,
  Image,
  TouchableOpacity,
  Alert,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { SQLiteProvider, useSQLiteContext } from "expo-sqlite";
import jsQR from "jsqr";
import * as ImagePicker from "expo-image-picker";
import RNFS from "react-native-fs";

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
const scanQRCode = async (uri) => {
    try {
      // Read image as binary
      const base64 = await RNFS.readFile(uri, "base64");
  
      // Convert base64 to binary buffer
      const binaryData = Buffer.from(base64, "base64");
  
      // Decode JPEG image to raw pixel data
      const rawImageData = jpeg.decode(binaryData, { useTArray: true });
  
      // Convert image data to Uint8ClampedArray
      const uint8ClampedArray = new Uint8ClampedArray(rawImageData.data.buffer);
  
      // Scan the QR code
      const qrCode = jsQR(uint8ClampedArray, rawImageData.width, rawImageData.height);
  
      if (qrCode) {
        console.log("QR Code Found:", qrCode.data);
        return qrCode.data;
      } else {
        console.log("No QR Code found.");
        return null;
      }
    } catch (error) {
      console.error("Error processing QR code:", error);
      return null;
    }
  };

export function ImageScanner({ navigation }) {
    const [imageUri, setImageUri] = useState(null);
    const [qrText, setQrText] = useState("");
  
    const pickImage = async () => {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        quality: 1,
      });
  
      if (!result.canceled) {
        setImageUri(result.assets[0].uri);
        const text = await scanQRCode(result.assets[0].uri);
        setQrText(text || "No QR Code found.");
      }
    };
  
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <Button title="Pick an Image" onPress={pickImage} />
        {imageUri && <Image source={{ uri: imageUri }} style={{ width: 200, height: 200 }} />}
        {qrText && <Text style={{ marginTop: 20 }}>QR Code Data: {qrText}</Text>}
      </View>
    );
}

const styles = {
    button: {
      padding: 10,
      backgroundColor: "blue",
      borderRadius: 5,
      marginVertical: 10,
    },
    buttonText: {
      color: "white",
      fontSize: 16,
    },
    image: {
      width: 200,
      height: 200,
      marginVertical: 10,
    },
    resultContainer: {
      marginTop: 20,
      alignItems: "center",
    },
    resultText: {
      fontSize: 16,
      fontWeight: "bold",
    },
  };