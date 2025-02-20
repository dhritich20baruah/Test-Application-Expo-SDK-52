import React, { useState, useEffect } from "react";
import { View, Text, Button, StyleSheet } from "react-native";
import { Camera, CameraView } from "expo-camera";
import { useNavigation } from "@react-navigation/native";

export default function QRCodeScanner() {
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);
  const navigation = useNavigation()

  useEffect(() => {
    const getCameraPermissions = async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === "granted");
    };

    getCameraPermissions();
  }, []);

  
  if(hasPermission === null){
    return <Text>Requesting for camera permission</Text>
  }

  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }

  const handleScanResult = ({data}) => {
    setScanned(true);
    navigation.navigate("ScanResult", {qrData: data})
  }

  return(
    <View style={styles.container}>
        <CameraView
            onBarcodeScanned={scanned ? undefined : handleScanResult}
            barcodeScannerSettings={{
                barcodeTypes: ["qr", "pdf417"],
            }}
            style={StyleSheet.absoluteFillObject}
        />
        {scanned && (
            <Button title={"Tap to Scan Again"} onPress={()=> setScanned(false)}/>
        )}
    </View>
  )
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      flexDirection: "column",
      justifyContent: "center",
    },
  });
