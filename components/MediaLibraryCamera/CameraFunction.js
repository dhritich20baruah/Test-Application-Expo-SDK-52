import {
  CameraView,
  CameraType,
  useCameraPermissions,
  Camera,
} from "expo-camera";
import { useState, useRef, useEffect } from "react";
import {
  Button,
  StyleSheet,
  SafeAreaView,
  Image,
  TextInput,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import * as MediaLibrary from "expo-media-library";
import { SQLiteProvider, useSQLiteContext } from "expo-sqlite";

const initializeDB = async (db) => {
  try {
    await db.execAsync(`
        PRAGMA journal_mode = WAL;
        CREATE TABLE IF NOT EXISTS gallery (id INTEGER PRIMARY KEY AUTOINCREMENT, date TEXT, uri TEXT, notes TEXT);   
        `);
    console.log("DB connected");
  } catch (error) {
    console.log("Error in connecting DB", error);
  }
};

export default function CameraApp() {
  return (
    <SQLiteProvider databaseName="SDK52Test.db" onInit={initializeDB}>
      <CameraFunction />
    </SQLiteProvider>
  );
}

export function CameraFunction() {
  const db = useSQLiteContext();
  const [facing, setFacing] = useState("back");
  const [permission, requestPermission] = useCameraPermissions(); //Camera Permission State
  const [hasMediaLibPermit, setHasMediaLibPermit] = useState(); //Media Permission State
  let cameraRef = useRef();
  const [photo, setPhoto] = useState();
  const [flashMode, setFlashMode] = useState("on");
  const [notes, setNotes] = useState("")

  useEffect(() => {
    (async () => {
      const cameraPermission = await Camera.requestCameraPermissionsAsync();
      const mediaLibraryPermission =
        await MediaLibrary.requestPermissionsAsync();
      setHasCameraPermission(cameraPermission.status === "granted");
      setHasMediaLibPermit(mediaLibraryPermission.status === "granted");
    })();
  }, []);

  if (!permission) {
    // Camera permissions are still loading.
    return <View />;
  }

  if (!permission.granted) {
    // Camera permissions are not granted yet.
    return (
      <View style={styles.container}>
        <Text style={styles.message}>
          We need your permission to show the camera
        </Text>
        <Button onPress={requestPermission} title="grant permission" />
      </View>
    );
  }

  const toggleFlash = () => {
    setFlashMode((current) => (current === "on" ? "off" : "on"));
  };

  function toggleCameraFacing() {
    setFacing((current) => (current === "back" ? "front" : "back"));
  }

  let takePic = async () => {
    let options = {
      quality: 1,
      base64: true,
      exif: false,
    };

    let newPhoto = await cameraRef.current.takePictureAsync(options);
    setPhoto(newPhoto);
    console.log("URI", photo.uri)
  };

  if (photo) {
    let savePhoto = async () => {
      const asset = await MediaLibrary.createAssetAsync(photo.uri);
      let dateString = new Date().toISOString();
      let date = dateString
        .slice(0, dateString.indexOf("T"))
        .split("-")
        .reverse()
        .join("-");
    };
    return (
      <SafeAreaView style={styles.imageContainer}>
        <Image
          style={styles.preview}
          source={{ uri: photo.uri }}
        />
        <View>
          <TextInput
            style={styles.input}
            placeholder="Notes"
            value={notes}
            onChangeText={setNotes}
          />
        </View>
        <View style={styles.btnContainer}>
          {!hasMediaLibPermit ? (
            <TouchableOpacity onPress={savePhoto} style={styles.btn}>
              <Ionicons name="save-outline" size={30} color="black" />
            </TouchableOpacity>
          ) : undefined}
          <TouchableOpacity
            onPress={() => setPhoto(undefined)}
            style={styles.btn}
          >
            <Ionicons name="trash-outline" size={30} color="black" />
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <View style={styles.container}>
      <CameraView
        style={styles.camera}
        facing={facing}
        ref={cameraRef}
        flash={flashMode}
      >
        <View>
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button} onPress={toggleCameraFacing}>
            <Ionicons name="camera-reverse-outline" size={20} color="white" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={takePic}>
            <Ionicons name="camera-outline" size={20} color="white" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={toggleFlash}>
            <Text>
              {flashMode === "on" ? (
                <Ionicons
                  name="flash-outline"
                  size={20}
                  color="white"
                  style={styles.btnText}
                />
              ) : (
                <Ionicons
                  name="flash-off-outline"
                  size={20}
                  color="white"
                  style={styles.btnText}
                />
              )}
            </Text>
          </TouchableOpacity>
        </View>
        <View style={styles.shutterContainer}>
        <TouchableOpacity style={styles.button} onPress={takePic}>
            <Ionicons name="aperture-outline" size={40} color="white" />
          </TouchableOpacity>
        </View>
        </View>
      </CameraView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
  },
  imageContainer: {
    height: "95%",
    width: "100%"
  },
  message: {
    textAlign: "center",
    paddingBottom: 10,
  },
  camera: {
    flex: 1,
  },
  buttonContainer: {
    flexDirection: "row",
    backgroundColor: "transparent",
    marginVertical: 20
  },
  shutterContainer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    margin: 20
  },
  button: {
    flex: 1,
    alignSelf: "flex-end",
    alignItems: "center",
  },
  btnContainer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-evenly",
    backgroundColor: "white"
  },
  text: {
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
  },
  btn: {
    justifyContent: "center",
    margin: 10,
    elevation: 5,
  },
  input: {
    borderColor: "black",
    fontSize: 20
  },
  preview: {
    alignSelf: "stretch",
    flex: 1,
    width: "auto",
  },
});
