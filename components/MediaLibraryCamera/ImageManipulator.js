import { useState, useEffect } from 'react';
import { Button, Image, StyleSheet, View } from 'react-native';
import { Asset } from 'expo-asset';
import { manipulateAsync, FlipType, SaveFormat } from 'expo-image-manipulator';
import * as ImageManipulator from 'expo-image-manipulator';

export default function ImageManipulation() {
  const [ready, setReady] = useState(false);
  const [image, setImage] = useState(null);

  useEffect(() => {
    (async () => {
        const localImage = require('./assets/thumbnail.png');
        setImage(localImage);
        setReady(true);
    })();
  }, []);

  const _rotate90andFlip = async () => {
    const manipResult = await ImageManipulator(
      image.localUri || image.uri,
      [{ rotate: 90 }, { flip: FlipType.Vertical }],
      { compress: 1, format: SaveFormat.PNG }
    );
    setImage(manipResult);
  };

  const _renderImage = () => (
    <View style={styles.imageContainer}>
      <Image source={{ uri: image.localUri || image.uri }} style={styles.image} />
    </View>
  );

  return (
    <View style={styles.container}>
      {ready && image && _renderImage()}
      <Button title="Rotate and Flip" onPress={_rotate90andFlip} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  imageContainer: {
    marginVertical: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    width: 300,
    height: 300,
    resizeMode: 'contain',
  },
});
