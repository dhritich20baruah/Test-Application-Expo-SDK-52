import React from "react";
import { View, Text, Button, StyleSheet, Image } from "react-native";

export default function ScanResult({route, navigation}){
    const { qrData } = route.params
    return(
        <View>
            <Text>{qrData}</Text>
        </View>
    )
}