import React, { useState, useEffect } from "react";
import { View, Text, Button, StyleSheet } from "react-native";
import { Camera, CameraView } from "expo-camera";
import { useNavigation } from "@react-navigation/native";
import { SQLiteProvider, useSQLiteContext } from "expo-sqlite";
import Ionicons from "@expo/vector-icons/Ionicons";

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

export default function QRCodeScanner() {
  return (
    <SQLiteProvider databaseName="SDK52Test.db" onInit={initializeDB}>
      <Scanner />
    </SQLiteProvider>
  );
}

export function Scanner() {
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);
  const navigation = useNavigation();
  const db = useSQLiteContext();

  useEffect(() => {
    const getCameraPermissions = async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === "granted");
    };

    getCameraPermissions();
  }, []);

  if (hasPermission === null) {
    return <Text>Requesting for camera permission</Text>;
  }

  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }

  const handleScanResult = async ({ data }) => {
    setScanned(true);
    let dateString = new Date().toISOString();
    let date = dateString
      .slice(0, dateString.indexOf("T"))
      .split("-")
      .reverse()
      .join("-");

    await db.runAsync("INSERT INTO qrHistory (date, qrData) values (?, ?)", [
      date,
      data,
    ]);
    await navigation.navigate("ScanResult", { qrData: data });
  };

  return (
    <View style={styles.container}>
      <CameraView
        onBarcodeScanned={scanned ? undefined : handleScanResult}
        barcodeScannerSettings={{
          barcodeTypes: ["qr", "pdf417"],
        }}
        style={StyleSheet.absoluteFillObject}
      />
      {scanned && (
        <Button title={"Tap to Scan Again"} onPress={() => setScanned(false)} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "center",
  },
});
