import React, { useState, useEffect } from "react";
import { View, Text, TextInput, Button, FlatList, StyleSheet } from "react-native";

const API_URL = "http://localhost:4000/notes"; // Use the correct IP for testing on a real device.

export default function Crud() {
  const [items, setItems] = useState([]);
  const [text, setText] = useState("");

  // Fetch items
  const fetchItems = async () => {
    try {
      const response = await fetch(API_URL);
      const data = await response.json();
      setItems(data);
    } catch (error) {
      console.error("Error fetching items:", error);
    }
  };

  // Add item
  const addItem = async () => {
    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: text }),
      });
      const newItem = await response.json();
      setItems((prev) => [...prev, newItem]);
      setText("");
    } catch (error) {
      console.error("Error adding item:", error);
    }
  };

  // Delete item
  const deleteItem = async (id) => {
    try {
      await fetch(`${API_URL}/${id}`, { method: "DELETE" });
      setItems((prev) => prev.filter((item) => item.id !== id));
    } catch (error) {
      console.error("Error deleting item:", error);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        value={text}
        onChangeText={setText}
        placeholder="Add item"
      />
      <Button title="Add" onPress={addItem} />
      <FlatList
        data={items}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <Text>{item.name}</Text>
            <Button title="Delete" onPress={() => deleteItem(item.id)} />
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  input: { borderWidth: 1, marginBottom: 10, padding: 10 },
  item: { flexDirection: "row", justifyContent: "space-between", marginVertical: 5 },
});
