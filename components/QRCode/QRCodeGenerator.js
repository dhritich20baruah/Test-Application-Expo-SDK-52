import React, { useState } from "react";
import { Alert, Button, Text, TextInput, View } from "react-native";
import QRCode from "react-native-qrcode-svg";
import * as FileSystem from "expo-file-system";
import * as Sharing from "expo-sharing";

const QRCodeGenerator = () => {
  const [text, setText] = useState("");
  const [qRValue, setQRValue] = useState(null);
  const viewShotRef = useRef(null);

  const generateQR = () => {
    if (!text.trim()) {
      Alert.alert("Please enter text to generate QR Code");
      return;
    }
    setQRValue(text);
  };

  const downloadQRCode = async () => {
    try {
      if (!viewShotRef.current || !qrValue) {
        Alert.alert("Error", "Generate a QR Code first!");
        return;
      }

      const uri = await viewShotRef.current.capture();
      const filePath = `${FileSystem.cacheDirectory}QRCode.jpg`;

      await FileSystem.moveAsync({ from: uri, to: filePath });

      await Share.share({
        url: filePath,
        message: "Here is your QR Code!",
      });
    } catch {
      console.error("Error saving QR Code:", error);
    }
  };

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text style={{ margin: 10 }}>QRCodeGenerator</Text>
      <TextInput
        placeholder="Enter Text for QR Code"
        value={text}
        onChangeText={setText}
        style={{
          height: 40,
          borderColor: "gray",
          borderWidth: 1,
          width: "80%",
          marginBottom: 20,
          textAlign: "center",
        }}
      />
      <Button title="Generate QR Code" onPress={generateQR} color="black" />
      {qRValue && (
        <View style={{ margin: 20 }}>
          <ViewShot ref={viewShotRef} options={{ format: "jpg", quality: 1.0 }}>
            <QRCode value={qRValue} size={200} />
          </ViewShot>
          <Button title="Download QR Code" onPress={downloadQRCode} />
        </View>
      )}
    </View>
  );
};

export default QRCodeGenerator;
