import { useState, useEffect } from "react";
import { Button, Image, StyleSheet, View } from "react-native";
import { Asset } from "expo-asset";
import { manipulateAsync, FlipType, SaveFormat } from "expo-image-manipulator";

export default function ImageManipulation() {
  const [ready, setReady] = useState(false);
  const [image, setImage] = useState(null);

  useEffect(() => {
    (async () => {
      const pic = Asset.fromModule(require("../../assets/thumbnail.png")).uri;
      setImage({ uri: pic });
      setReady(true);
    })();
  }, []);

  const _rotate90andFlip = async () => {
    if (!image) return;
    const manipResult = await manipulateAsync(
      image.uri,
      [
        { rotate: 90 },
        { flip: FlipType.Vertical },
        // { crop: { originX: 50, originY: 50, width: 200, height: 200 } }, // Crop a section
        // { resize: { width: 150, height: 150 } }, // Resize the image
      ],
      { compress: 1, format: SaveFormat.PNG }
    );
    setImage(manipResult);
  };

  return (
    <View style={styles.container}>
      {ready && image && (
        <View style={styles.imageContainer}>
          <Image source={{ uri: image.uri }} style={styles.image} />
        </View>
      )}
      <Button title="Rotate and Flip" onPress={_rotate90andFlip} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
  },
  imageContainer: {
    marginVertical: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  image: {
    width: 300,
    height: 300,
    resizeMode: "contain",
  },
});
