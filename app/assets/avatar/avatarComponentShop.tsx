import React, { useEffect, useState } from "react";
import { View, StyleSheet } from "react-native";
import { Canvas, Image as SkImage, useImage, Group } from "@shopify/react-native-skia";


// Define a type for the avatar data
interface AvatarData {
  head: string;
  body: string;
  left_arm: string;
  right_arm: string;
  left_leg: string;
  right_leg: string;
}

interface AvatarSkiaDisplayProps {
  userID: number;
  hat?: string;
  eyes?: string;
  faceAccessories?: string;
  facialExpression?: string;
  upperwear?: string;
  lowerwear?: string;
  shoes?: string;
}

const AvatarSkiaDisplay: React.FC<AvatarSkiaDisplayProps> = ({
  userID,
  hat,
  eyes,
  faceAccessories,
  facialExpression,
  upperwear,
  lowerwear,
  shoes,
}) => {
  const [avatarData, setAvatarData] = useState<AvatarData | null>(null); // Avatar data state

  // Fetch the avatar data from the server
  useEffect(() => {
    const fetchAvatar = async () => {
      try {
        const response = await fetch("http://192.168.1.5:8081/api/retrieve-avatar/", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ userID }),
        });

        const data = await response.json();
        
        if (response.ok) {
          setAvatarData(data); // Set the avatar data in state
        } else {
          console.error("Failed to fetch avatar:", data.error);
        }
      } catch (error: unknown) {
        // Type assertion: Tell TypeScript that error is an instance of Error
        if (error instanceof Error) {
          console.error("Error fetching avatar:", error.message);
        } else {
          console.error("Unknown error:", error);
        }
      }
    };

    if (userID) {
      fetchAvatar();
    }
  }, [userID]);

  const angleInRadians = -3 * (Math.PI / 180);

  // Calculate center of the head image (based on its size and position)
  const headCenterX = 105; // -5 + width / 2 => -5 + 110 = 105
  const headCenterY = 115; // -10 + height / 2 => -10 + 125 = 115

  // Ensure useImage is called the same on every render (even when avatarData is null)
  const headImage = useImage(avatarData?.head || "");
  const bodyImage = useImage(avatarData?.body || "");
  const leftArmImage = useImage(avatarData?.left_arm || "");
  const rightArmImage = useImage(avatarData?.right_arm || "");
  const leftLegImage = useImage(avatarData?.left_leg || "");
  const rightLegImage = useImage(avatarData?.right_leg || "");
   // Load optional accessories
  const hatImage = useImage(hat || "");
  const eyesImage = useImage(eyes || "");
  const faceAccessoriesImage = useImage(faceAccessories || "");
  const facialExpressionImage = useImage(facialExpression || "");
  const upperwearImage = useImage(upperwear || "");
  const lowerwearImage = useImage(lowerwear || "");
  const shoesImage = useImage(shoes || "");
  // Check if all images are loaded by ensuring they are not null
  const ready = headImage && bodyImage && leftArmImage && rightArmImage && leftLegImage && rightLegImage;

  if (!ready || !avatarData) return null; // Wait until all images are loaded

  const imageSize = { width: 200, height: 300 };

  return (
    <View style={styles.container}>
      <Canvas style={imageSize}>
        <SkImage image={leftArmImage} x={15} y={-4} width={220} height={250} />
        <SkImage image={rightArmImage} x={0} y={-10} width={220} height={250} />
        <SkImage image={bodyImage} x={0} y={0} width={220} height={250} />
        <SkImage image={leftLegImage} x={6} y={8} width={200} height={250} />
        <SkImage image={rightLegImage} x={13} y={8} width={200} height={250} />
        {/* <SkImage image={headImage} x={-5} y={-10} width={220} height={250} /> */}
        <Group
          transform={[
            { translateX: headCenterX },
            { translateY: headCenterY },
            { rotate: angleInRadians },
            { translateX: -headCenterX },
            { translateY: -headCenterY },
          ]}
        >
          <SkImage image={headImage} x={-5} y={-10} width={220} height={250} />
        </Group>
        <SkImage image={hatImage} x={-5} y={-10} width={220} height={250} />
        <SkImage image={eyesImage} x={-6.5} y={-12.5} width={220} height={250} />
        <SkImage image={upperwearImage} x={-12} y={-18} width={230} height={260} />
        <SkImage image={lowerwearImage} x={-3} y={-17} width={210} height={270} />
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
