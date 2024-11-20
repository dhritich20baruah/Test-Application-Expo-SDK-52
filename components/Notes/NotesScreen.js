import {
  View,
  Text,
  StyleSheet,
  Alert,
  TouchableOpacity,
  SafeAreaView,
} from "react-native";
import { useState, useCallback } from "react";
import { SQLiteProvider, useSQLiteContext } from "expo-sqlite";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import Ionicons from "@expo/vector-icons/Ionicons";

const initializeDB = async (db) => {
  try {
    await db.execAsync(`
        PRAGMA journal_mode = WAL;
        CREATE TABLE IF NOT EXISTS notesTable (id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL, date TEXT NOT NULL, note TEXT NOT NULL);   
        `);
    console.log("DB connected");
  } catch (error) {
    console.log("Error in connecting DB", error);
  }
};

export default function Notes() {
  return (
    <SQLiteProvider databaseName="SDK52Test.db" onInit={initializeDB}>
      <NoteList />
    </SQLiteProvider>
  );
}

export function NoteList() {
  const db = useSQLiteContext();
  const [notes, setNotes] = useState([]);
  const navigation = useNavigation();

  useFocusEffect(
    useCallback(() => {
      (async () => {
        await fetchNotes();
      })();
    }, [])
  );

  async function fetchNotes() {
    const result = await db.getAllAsync("SELECT * FROM notesTable");
    setNotes(result);
    console.log("notes:", result);
  }
  return (
    <SafeAreaView
      style={{ flex: 1, padding: 10, position: "relative", height: "100%" }}
    >
      <View>
        {notes.map((item, index) => {
          return (
            <View
              key={index}
              style={{
                width: "100%",
                padding: 10,
                backgroundColor: "#caf1de",
                marginVertical: 10,
                elevation: 5,
              }}
            >
              <View>
                <View
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "space-between",
                  }}
                >
                  <Text style={{ fontSize: 15, fontStyle: "italic", color: "red" }}>{item.date}</Text>
                  <TouchableOpacity>
                    <Text><Ionicons name="trash-outline" size={25} color="red"/></Text>
                  </TouchableOpacity>
                </View>
                <Text style={{ fontSize: 15 }}>{item.note.slice(0, 50)}......</Text>
              </View>
            </View>
          );
        })}
      </View>
      <TouchableOpacity
        style={{
          justifyContent: "center",
          alignItems: "center",
          position: "absolute",
          borderRadius: 50,
          top: "80%",
          right: 30,
          width: 50,
          height: 50,
          elevation: 5,
          backgroundColor: "orange",
        }}
      >
        <Text
          style={{ color: "white", fontSize: 35 }}
          onPress={() => navigation.navigate("AddNote")}
        >
          +
        </Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}
