import React, { useState, useRef, useEffect } from "react";
import { Alert, Button, Text, TextInput, View, Share } from "react-native";
import QRCode from "react-native-qrcode-svg";
import * as FileSystem from "expo-file-system";
import ViewShot from "react-native-view-shot";
import * as MediaLibrary from "expo-media-library";

const QRCodeGenerator = () => {
  const [text, setText] = useState("");
  const [qRValue, setQRValue] = useState(null);
  const viewShotRef = useRef(null);
  const [hasMediaLibraryPermission, setHasMediaLibraryPermission] = useState(); //State variable for media library permission

  useEffect(() => {
    (async () => {
      const mediaLibraryPermission =
        await MediaLibrary.requestPermissionsAsync();
      setHasMediaLibraryPermission(mediaLibraryPermission.status === "granted");
    })();
  }, []);

  const generateQR = () => {
    if (!text.trim()) {
      Alert.alert("Please enter text to generate QR Code");
      return;
    }
    setQRValue(text);
  };

  const downloadQRCode = async () => {
    try {
      if (!viewShotRef.current || !qRValue) {
        Alert.alert("Error", "Generate a QR Code first");
        return;
      }

      const uri = await viewShotRef.current.capture();
      const filePath = `${FileSystem.cacheDirectory}QRCode.jpg`;

      await MediaLibrary.saveToLibraryAsync(filePath).then(() => {
        Alert.alert("QR Code saved to Media Library");
      });
    } catch {
      console.error("Error saving QR Code:", error);
      Alert.alert("Error saving QR Code", error.message);
    }
  };

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text style={{ margin: 10 }}>Enter Link to Create QR Code for:</Text>
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
          <ViewShot
            ref={viewShotRef}
            options={{ format: "jpg", quality: 1.0 }}
            style={{ marginVertical: 20 }}
          >
            <QRCode value={qRValue} size={200} />
          </ViewShot>
          <Button
            title="Download QR Code"
            onPress={downloadQRCode}
            color="black"
          />
        </View>
      )}
    </View>
  );
};

export default QRCodeGenerator;
