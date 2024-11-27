import { View, TextInput, Button, Alert, StyleSheet } from "react-native";
import { SQLiteProvider, useSQLiteContext } from "expo-sqlite";
import { useState } from "react";
import { useNavigation } from "@react-navigation/native";

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

export default function AddNote() {
  return (
    <SQLiteProvider databaseName="SDK52Test.db" onInit={initializeDB}>
      <NoteInput />
    </SQLiteProvider>
  );
}

export function NoteInput() {
  const db = useSQLiteContext();
  const navigation = useNavigation();
  const [note, setNote] = useState("");

  const addNote = async() => {
    let dateString = new Date().toISOString();
    let date = dateString.slice(0, dateString.indexOf("T")).split("-").reverse().join("-")

    await db.runAsync("INSERT INTO notesTable (date, note) values (?, ?)", [date, note]);
    Alert.alert("Note Added");
    navigation.replace("NotesScreen");
  }

  return (
    <View style={styles.container}>
      <TextInput style={styles.textInput} multiline={true} value={note} onChangeText={(inputText)=>setNote(inputText)} placeholder="Type your notes here..." textAlignVertical="top"/>
        <Button title="ADD NOTE" onPress={addNote}/>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  textInput: {
    flex: 1,
    padding: 20,
    fontSize: 16,
    textAlignVertical: "top",
  },
});
