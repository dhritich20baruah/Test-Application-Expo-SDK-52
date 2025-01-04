import { useEvent } from "expo";
import { useVideoPlayer, VideoView } from "expo-video";
import { StyleSheet, View, Button, TouchableOpacity } from "react-native";
import * as MediaLibrary from "expo-media-library";
import { useState, useEffect } from "react";
import Ionicons from "@expo/vector-icons/Ionicons";
import {useNavigation} from "@react-navigation/native";

const videoSource =
  "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4";

export default function VideoScreen({ route }) {
  const { uri } = route.params;
  console.log("Video Screen :", uri);
  const [hasMediaLibraryPermission, setHasMediaLibraryPermission] = useState();
  const navigation = useNavigation();

  useEffect(() => {
    (async () => {
      const mediaLibraryPermission =
        await MediaLibrary.requestPermissionsAsync();

      setHasMediaLibraryPermission(mediaLibraryPermission.status === "granted");
    })();
  }, []);

  const player = useVideoPlayer(uri, (player) => {
    player.loop = true;
    player.play();
  });

  const { isPlaying } = useEvent(player, "playingChange", {
    isPlaying: player.playing,
  });

  let saveVideo = () => {
    MediaLibrary.saveToLibraryAsync(uri).then(() => {
      navigation.navigate("Camera");
    });
  };

  return (
    <View style={styles.contentContainer}>
      <VideoView
        style={styles.video}
        player={player}
        allowsFullscreen
        allowsPictureInPicture
      />
      <View style={styles.controlsContainer}>
        <Button
          title={isPlaying ? "Pause" : "Play"}
          onPress={() => {
            if (isPlaying) {
              player.pause();
            } else {
              player.play();
            }
          }}
        />
      </View>
      <View style={styles.btnContainer}>
        {hasMediaLibraryPermission ? (
          <TouchableOpacity onPress={saveVideo} style={styles.btn}>
            <Ionicons name="save-outline" size={30} color="black" />
          </TouchableOpacity>
        ) : undefined}
        <TouchableOpacity style={styles.btn} onPress={()=>navigation.navigate("Camera")}>
          <Ionicons name="trash-outline" size={30} color="black" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  contentContainer: {
    flex: 1,
    padding: 10,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 50,
  },
  video: {
    width: 350,
    height: 275,
  },
  controlsContainer: {
    padding: 10,
  },
  btnContainer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-evenly",
    backgroundColor: "white",
  },
  btn: {
    justifyContent: "center",
    margin: 10,
    elevation: 5,
  },
});
