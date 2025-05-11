import React, { useEffect, useState } from "react";
import { View, StyleSheet } from "react-native";
import { Canvas, Image as SkImage, useImage } from "@shopify/react-native-skia";

const AvatarSkiaDisplay = () => {
  const [ready, setReady] = useState(false);

  const head = useImage("https://res.cloudinary.com/dlz7oiktg/image/upload/v1746946049/avatar-head_ailcd2.png");
  const body = useImage("https://res.cloudinary.com/dlz7oiktg/image/upload/v1746946063/avatar-body_y9kk2p.png");
  const leftArm = useImage("https://res.cloudinary.com/dlz7oiktg/image/upload/v1746946074/avatar-arm-left_jmkfjo.png");
  const rightArm = useImage("https://res.cloudinary.com/dlz7oiktg/image/upload/v1746946032/avatar-arm-right_o9hhzy.png");
  const leftLeg = useImage("https://res.cloudinary.com/dlz7oiktg/image/upload/v1746946098/avatar-foot-left_y1zp71.png");
  const rightLeg = useImage("https://res.cloudinary.com/dlz7oiktg/image/upload/v1746946088/avatar-foot-right_mtigq8.png");

  useEffect(() => {
    if (head && body && leftArm && rightArm && leftLeg && rightLeg) {
      setReady(true);
    }
  }, [head, body, leftArm, rightArm, leftLeg, rightLeg]);

  if (!ready) return null;

  const imageSize = { width: 200, height: 300 };

  return (
    <View style={styles.container}>
      <Canvas style={imageSize}>
        <SkImage image={leftArm} x={15} y={-4} width={220} height={250} />
        <SkImage image={rightArm} x={0} y={-10} width={220} height={250} />
        <SkImage image={body} x={0} y={0} width={220} height={250} />
        <SkImage image={leftLeg} x={6} y={8} width={200} height={250} />
        <SkImage image={rightLeg} x={13} y={8} width={200} height={250} />
        <SkImage image={head} x={-5} y={-10} width={220} height={250} />
      </Canvas>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 50,
  },
});

export default AvatarSkiaDisplay;
