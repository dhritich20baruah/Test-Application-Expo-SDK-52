import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  FlatList,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { useNavigation } from "@react-navigation/native";

// const API_URL = "http://192.168.43.44:4000"; // Use the correct IP for testing on a real device.
const API_URL = "https://react-native-express-mongo-db.vercel.app"

export default function Crud() {
  const [items, setItems] = useState([]);
  const [title, setTitle] = useState("");
  const [note, setNote] = useState("");
  const [visible, setVisible] = useState(true);
  const [noteId, setNoteId] = useState("")
  const navigation = useNavigation();

  // Fetch items
  const fetchItems = async () => {
    try {
      const response = await fetch(`${API_URL}/notes`);
      const data = await response.json();
      setItems(data);
    } catch (error) {
      console.error("Error fetching items:", error);
    }
  };

  // Add item
  const addItem = async () => {
    let noteObj = {
      title: title,
      note: note,
    };
    try {
      const response = await fetch(`${API_URL}/addNote`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(noteObj),
      });

      if (!response.ok) {
        // Log or handle the error response
        console.error(`Error: ${response.status} ${response.statusText}`);
        return;
      }

    //   const newItem = await response.json();
      let prevNotes = [...items]; 
      prevNotes.push({ title: title, note: note }); 
      setItems(prevNotes); 
      setTitle("");
      setNote("");
    } catch (error) {
      console.error("Error adding item:", error);
    }
  };

  // Delete item
  const deleteItem = async (id) => {
    console.log(id)
    try {
      await fetch(`${API_URL}/deleteNote/${id}`, { method: "DELETE" });
      await fetchItems()
    } catch (error) {
      console.error("Error deleting item:", error);
    }
  };

  const editNote = async (id) => {
    setVisible(false);
    setNoteId(id)
    try {
      const response = await fetch(`${API_URL}/oneNote/${id}`);
      const data = await response.json();
      setTitle(data.title)
      setNote(data.note)
    } catch (error) {
      console.error("Error fetching items:", error);
    }
  }

  const updateNote = async () => {
    const noteObj = {
      title: title,
      note: note
    }
    console.log("ID", noteId)
    try {
      const response = await fetch(`${API_URL}/update/${noteId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(noteObj),
      });

      if (!response.ok) {
        // Log or handle the error response
        console.error(`Error: ${response.status} ${response.statusText}`);
        return;
      }

      await fetchItems()
      setTitle("");
      setNote("");
    } catch (error) {
      console.error("Error adding item:", error);
    }
  }


  useEffect(() => {
    fetchItems();
  }, []);

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        value={title}
        onChangeText={setTitle}
        placeholder="Title"
      />
      <TextInput
        style={styles.input}
        value={note}
        onChangeText={setNote}
        placeholder="Note"
      />
      {visible ? 
    <Button title="Add" onPress={addItem} /> :
    <Button title="Update" onPress={updateNote}/>
    }
      {items.map((item, index) => {
        return (
          <View key={index} style={styles.item}>
            <Text style={{ fontSize: 15 }}>{item.title}</Text>
            <Text style={{ fontSize: 15 }}>{item.note}</Text>
            <View style={{ display: "flex", flexDirection: "row" }}>
              <TouchableOpacity
                style={{ backgroundColor: "red", width: "50%" }}
              >
                <Text
                  onPress={() => deleteItem(item._id)}
                  style={{
                    color: "white",
                    fontWeight: "600",
                    textAlign: "center",
                    fontSize: 15,
                  }}
                >
                  Delete{" "}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={{ backgroundColor: "blue", width: "50%" }}
              >
                <Text
                  onPress={() => editNote(item._id)}
                  style={{
                    color: "white",
                    fontWeight: "600",
                    textAlign: "center",
                    fontSize: 15,
                  }}
                >
                  Edit{" "}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  input: { borderWidth: 1, marginBottom: 10, padding: 10 },
  item: {
    flexDirection: "column",
    justifyContent: "space-between",
    marginVertical: 5,
  },
});
