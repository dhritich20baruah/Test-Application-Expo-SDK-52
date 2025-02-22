import {useState, useEffect, useCallback} from "react";
import { View, Text, TouchableOpacity, SafeAreaView, StyleSheet } from "react-native"
import { SQLiteProvider, useSQLiteContext } from "expo-sqlite";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useIsFocused } from "@react-navigation/native";

export default function History(){
    return(
         <SQLiteProvider databaseName="SDK52Test.db">
            <QRList />
          </SQLiteProvider>
    )
}

export function QRList(){
    const db = useSQLiteContext();
    const [history, setHistory] = useState([])
    const isFocused = useIsFocused();

    async function fetchHistory(){
        const result = await db.getAllAsync("SELECT * FROM qrHistory");
        setHistory(result)
        console.log(result)
    }

    useEffect(() => {
        if (isFocused) {
          fetchHistory();
        }
      }, [isFocused]);

    return(
        <SafeAreaView>
            <View>
                {history.map((item, index)=>{
                    return(
                        <View key={index}>
                            <Text>{item.qrData}</Text>
                            <Text>{item.date}</Text>
                        </View>
                    )
                })}
            </View>
        </SafeAreaView>
    )
}