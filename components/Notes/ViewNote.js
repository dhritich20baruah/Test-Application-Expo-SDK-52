import { View, TextInput, Button, Alert, StyleSheet } from "react-native";
import { SQLiteProvider, useSQLiteContext } from "expo-sqlite";
import { useEffect, useState } from "react";
import { useNavigation } from "@react-navigation/native";

export default function ViewNote({ route }) {
  const { id } = route.params;
  return (
    <SQLiteProvider databaseName="SDK52Test.db">
      <EditNote id={id} />
    </SQLiteProvider>
  );
}

export function EditNote(id) {
  const noteID = id.id;
  const db = useSQLiteContext();
  const navigation = useNavigation();
  const [note, setNote] = useState("");

  useEffect(() => {
    fetchNote();
  }, []);

  async function fetchNote() {
    try {
      const result = await db.getFirstAsync(
        "SELECT note FROM notesTable WHERE id = ?",
        [noteID]
      );
      setNote(result.note)
    } catch (error) {
      console.error("Unable to fetch note: ", error);
    }
  }

  const updateNote = async () => {
    let text = note;
    const result = await db.runAsync(
      "UPDATE notesTable SET note = ? WHERE id = ?",
      [text, noteID]
    );
    navigation.replace("NotesScreen");
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.textInput}
        multiline={true}
        value={note}
        onChangeText={(inputText) => setNote(inputText)}
        placeholder="Type your notes here..."
        textAlignVertical="top"
      />
      <Button title="UPDATE NOTE" onPress={updateNote} />
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
