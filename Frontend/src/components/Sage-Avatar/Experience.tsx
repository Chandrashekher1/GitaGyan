import { Suspense, useEffect, useRef, useState } from "react";
import {
  CameraControls,
  ContactShadows,
  Environment,
  Text,
} from "@react-three/drei";
import { useAvatarChat } from "./useAvatarChat";
import { Avatar } from "./Avatar";

function Dots(props: Record<string, any>) {
  const { loading } = useAvatarChat();
  const [loadingText, setLoadingText] = useState("");

  useEffect(() => {
    if (loading) {
      const interval = setInterval(() => {
        setLoadingText((prev) => (prev.length > 2 ? "." : prev + "."));
      }, 800);
      return () => clearInterval(interval);
    } else {
      setLoadingText("");
    }
  }, [loading]);

  if (!loading) return null;

  return (
    <group {...props}>
      <Text fontSize={0.14} anchorX="left" anchorY="bottom" color="white">
        {loadingText}
      </Text>
    </group>
  );
}

export function Experience() {
  const cameraControls = useRef<CameraControls>(null);
  const { cameraZoomed } = useAvatarChat();

  // Initial camera position
  useEffect(() => {
    if (cameraControls.current) {
      cameraControls.current.setLookAt(0, 2, 5, 0, 1.5, 0);
    }
  }, []);

  // Handle camera zoom changes
  useEffect(() => {
    if (cameraControls.current) {
      if (cameraZoomed) {
        cameraControls.current.setLookAt(0, 1.5, 1.5, 0, 1.5, 0, true);
      } else {
        cameraControls.current.setLookAt(0, 2.2, 5, 0, 1.0, 0, true);
      }
    }
  }, [cameraZoomed]);

  return (
    <>
      <CameraControls
        ref={cameraControls}
        makeDefault
        minDistance={0.5}
        maxDistance={10}
        minPolarAngle={Math.PI / 6}
        maxPolarAngle={Math.PI - Math.PI / 6}
      />

      <Environment preset="sunset" />

      {/* Ambient lighting for better visibility */}
      <ambientLight intensity={0.3} />
      <directionalLight
        position={[5, 5, 5]}
        intensity={0.5}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
      />

      {/* Loading indicator */}
      <Suspense fallback={null}>
        <Dots position-y={1.75} position-x={-0.02} />
      </Suspense>

      {/* Main avatar */}
      <Suspense fallback={null}>
        <Avatar />
      </Suspense>

      {/* Contact shadows for ground contact */}
      <ContactShadows
        opacity={0.7}
        scale={10}
        blur={1}
        far={10}
        resolution={256}
        color="#000000"
      />
    </>
  );
}
