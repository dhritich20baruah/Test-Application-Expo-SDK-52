import { View, Text } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { TouchableOpacity } from "react-native";
import Notes from "./components/Notes/NotesScreen";
import AddNote from "./components/Notes/AddNote";
import ViewNote from "./components/Notes/ViewNote";
import Media from "./components/MediaLibraryCamera/MediaLibrary";
import CameraFunction from "./components/MediaLibraryCamera/CameraFunction";
import VideoScreen from "./components/MediaLibraryCamera/VideoViewer";
import Crud from "./components/Backend/Crud";
import ImageManipulation from "./components/MediaLibraryCamera/ImageManipulator";
// import "expo-dev-client"

function HomeScreen({ navigation }) {
  
   return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      <TouchableOpacity
        style={{
          width: "80%",
          padding: 5,
          borderColor: "red",
          borderWidth: 1,
          borderRadius: 15,
          marginVertical: 10
        }}
      >
        <Text
          style={{ textAlign: "center", color: "red" }}
          onPress={() =>
            navigation.navigate("NotesScreen")
          }
        >
          Notes
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={{
          width: "80%",
          padding: 5,
          borderColor: "red",
          borderWidth: 1,
          borderRadius: 15,
          marginVertical: 10
        }}
      >
        <Text
          style={{ textAlign: "center", color: "red" }}
          onPress={() =>
            navigation.navigate("Camera")
          }
        >
          Camera
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={{
          width: "80%",
          padding: 5,
          borderColor: "red",
          borderWidth: 1,
          borderRadius: 15,
          marginVertical: 10
        }}
      >
        <Text
          style={{ textAlign: "center", color: "red" }}
          onPress={() =>
            navigation.navigate("MediaLibrary")
          }
        >
          Media Library
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={{
          width: "80%",
          padding: 5,
          borderColor: "red",
          borderWidth: 1,
          borderRadius: 15,
          marginVertical: 10
        }}
      >
        <Text
          style={{ textAlign: "center", color: "red" }}
          onPress={() =>
            navigation.navigate("VideoScreen")
          }
        >
          Video Screen
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={{
          width: "80%",
          padding: 5,
          borderColor: "red",
          borderWidth: 1,
          borderRadius: 15,
          marginVertical: 10
        }}
      >
        <Text
          style={{ textAlign: "center", color: "red" }}
          onPress={() =>
            navigation.navigate("Crud")
          }
        >
          CRUD Backend
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={{
          width: "80%",
          padding: 5,
          borderColor: "red",
          borderWidth: 1,
          borderRadius: 15,
          marginVertical: 10
        }}
      >
        <Text
          style={{ textAlign: "center", color: "red" }}
          onPress={() =>
            navigation.navigate("ImageManipulation")
          }
        >
          Image Manipulator
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const Stack = createNativeStackNavigator();

function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="NotesScreen" component={Notes} />
        <Stack.Screen name="AddNote" component={AddNote}/>
        <Stack.Screen name="ViewNote" component={ViewNote}/>
        <Stack.Screen name="MediaLibrary" component={Media}/>
        <Stack.Screen name="Camera" component={CameraFunction}/>
        <Stack.Screen name="VideoScreen" component={VideoScreen}/>
        <Stack.Screen name="Crud" component={Crud}/>
        <Stack.Screen name="ImageManipulation" component={ImageManipulation}/>
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;
