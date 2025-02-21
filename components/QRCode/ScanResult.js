import React from "react";
import { View, Text, Button, StyleSheet, Image, TouchableOpacity } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";

export default function ScanResult({route, navigation}){
    const { qrData } = route.params
    return(
        <View style={{flex: 1, padding: 10, height: "100%"}}>
            <Text style={{fontSize: "20", fontWeight: "600"}}>{qrData}</Text>
            <View style={{display: "flex", flexDirection: "row", justifyContent: "space-evenly", width: "100%"}}>
                <TouchableOpacity style={{width:"30%"}}>
                    <Text><Ionicons name="open" size={45} color="grey" /></Text>
                </TouchableOpacity>
                <TouchableOpacity style={{width:"30%"}}>
                    <Text><Ionicons name="share-social" size={45} color="grey" /></Text>
                </TouchableOpacity>
                <TouchableOpacity style={{width:"30%"}}>
                    <Text><Ionicons name="copy" size={45} color="grey" /></Text>
                </TouchableOpacity>
            </View>
        </View>
    )
}