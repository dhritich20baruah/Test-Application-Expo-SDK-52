import React, { useState } from "react";
import { Alert, Button, Text, TextInput, View } from "react-native";
import QRCode from "react-native-qrcode-svg";

const QRCodeGenerator = () => {
  const [text, setText] = useState("");
  const [qRValue, setQRValue] = useState(null);

  const generateQR = () => {
    if (!text.trim()) {
      Alert.alert("Please enter text to generate QR Code");
      return;
    }
    setQRValue(text);
  };

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text style={{margin: 10}}>QRCodeGenerator</Text>
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
      <Button
        title="Generate QR Code"
        onPress={generateQR}
        color="black"
      />
      {qRValue && 
        <View style={{margin: 20}}>
            <QRCode value={qRValue} size={200}/>
        </View>
      }
    </View>
  );
};

export default QRCodeGenerator;
