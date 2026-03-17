import { useAnimations, useGLTF } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { button, useControls } from "leva";
import { useEffect, useRef, useState, useCallback } from "react";
import * as THREE from "three";
import { useAvatarChat } from "./useAvatarChat";
import { stripHtml } from "@/lib/utils";

/* ── CDN paths ── */
const AVATAR_MODEL_URL =
  "https://raw.githubusercontent.com/iamtanishqsethi/RUOK-SIH/main/frontend/public/models/68cfe828e257744a363f9997.glb";
const ANIMATIONS_URL = "/models/animations.glb";

/* ── Facial expression presets ── */
const facialExpressions: Record<string, Record<string, number>> = {
  default: {},
  smile: {
    browInnerUp: 0.17,
    eyeSquintLeft: 0.4,
    eyeSquintRight: 0.44,
    noseSneerLeft: 0.17,
    noseSneerRight: 0.14,
    mouthPressLeft: 0.61,
    mouthPressRight: 0.41,
  },
  funnyFace: {
    jawLeft: 0.63,
    mouthPucker: 0.53,
    noseSneerLeft: 1,
    noseSneerRight: 0.39,
    mouthLeft: 1,
    eyeLookUpLeft: 1,
    eyeLookUpRight: 1,
    cheekPuff: 0.9999924982764238,
    mouthDimpleLeft: 0.414743888682652,
    mouthRollLower: 0.32,
    mouthSmileLeft: 0.35499733688813034,
    mouthSmileRight: 0.35499733688813034,
  },
  sad: {
    mouthFrownLeft: 1,
    mouthFrownRight: 1,
    mouthShrugLower: 0.78341,
    browInnerUp: 0.452,
    eyeSquintLeft: 0.72,
    eyeSquintRight: 0.75,
    eyeLookDownLeft: 0.5,
    eyeLookDownRight: 0.5,
    jawForward: 1,
  },
  surprised: {
    eyeWideLeft: 0.5,
    eyeWideRight: 0.5,
    jawOpen: 0.351,
    mouthFunnel: 1,
    browInnerUp: 1,
  },
  angry: {
    browDownLeft: 1,
    browDownRight: 1,
    eyeSquintLeft: 1,
    eyeSquintRight: 1,
    jawForward: 1,
    jawLeft: 1,
    mouthShrugLower: 1,
    noseSneerLeft: 1,
    noseSneerRight: 0.42,
    eyeLookDownLeft: 0.16,
    eyeLookDownRight: 0.16,
    cheekSquintLeft: 1,
    cheekSquintRight: 1,
    mouthClose: 0.23,
    mouthFunnel: 0.63,
    mouthDimpleRight: 1,
  },
  crazy: {
    browInnerUp: 0.9,
    jawForward: 1,
    noseSneerLeft: 0.5700000000000001,
    noseSneerRight: 0.51,
    eyeLookDownLeft: 0.39435766259644545,
    eyeLookUpRight: 0.4039761421719682,
    eyeLookInLeft: 0.9618479575523053,
    eyeLookInRight: 0.9618479575523053,
    jawOpen: 0.9618479575523053,
    mouthDimpleLeft: 0.9618479575523053,
    mouthDimpleRight: 0.9618479575523053,
    mouthStretchLeft: 0.27893590769016857,
    mouthStretchRight: 0.2885543872656917,
    mouthSmileLeft: 0.5578718153803371,
    mouthSmileRight: 0.38473918302092225,
    tongueOut: 0.9618479575523053,
  },
};

/* ── Viseme cycling for speech animation ── */
const SPEECH_VISEMES = ["viseme_PP", "viseme_kk", "viseme_I", "viseme_AA", "viseme_O", "viseme_U", "viseme_FF", "viseme_TH"];

let setupMode = false;

export function Avatar(props: Record<string, any>) {
  const { nodes, materials, scene } = useGLTF(AVATAR_MODEL_URL) as any;
  const { message, onMessagePlayed } = useAvatarChat();

  const { animations } = useGLTF(ANIMATIONS_URL) as any;
  const group = useRef<THREE.Group>(null);
  const { actions } = useAnimations(animations, group);

  const [animation, setAnimation] = useState<string>(
    animations.find((a: any) => a.name === "Idle") ? "Idle" : animations[0]?.name ?? "Idle"
  );

  const [blink, setBlink] = useState(false);
  const [winkLeft, setWinkLeft] = useState(false);
  const [winkRight, setWinkRight] = useState(false);
  const [facialExpression, setFacialExpression] = useState<string>("default");
  const [isSpeaking, setIsSpeaking] = useState(false);
  const lastPlayedId = useRef<string | null>(null);
  const speechRef = useRef<SpeechSynthesisUtterance | null>(null);

  /* ── Browser Speech Synthesis (free TTS) ── */
  const speakText = useCallback((text: string) => {
    if (!window.speechSynthesis) {
      console.warn("SpeechSynthesis not available in this browser");
      // Still trigger animation without voice
      setIsSpeaking(true);
      const estimatedDuration = Math.max(2000, text.split(/\s+/).length * 400);
      setTimeout(() => {
        setIsSpeaking(false);
        onMessagePlayed();
      }, estimatedDuration);
      return;
    }

    // Cancel any ongoing speech
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1.0;
    utterance.pitch = 1.0;
    utterance.volume = 1.0;

    // Prefer a female English voice
    const voices = window.speechSynthesis.getVoices();
    const preferred = voices.find((v) =>
      v.lang.startsWith("en") && /samantha|female|zira|fiona|karen|moira|tessa/i.test(v.name)
    ) || voices.find((v) =>
      v.lang.startsWith("en") && v.name.includes("Google UK English Female")
    ) || voices.find((v) => v.lang.startsWith("en")) || voices[0];
    if (preferred) {
      utterance.voice = preferred;
    }

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => {
      setIsSpeaking(false);
      onMessagePlayed();
    };
    utterance.onerror = () => {
      setIsSpeaking(false);
      onMessagePlayed();
    };

    speechRef.current = utterance;
    window.speechSynthesis.speak(utterance);
  }, [onMessagePlayed]);

  /* ── React to new avatar messages ── */
  useEffect(() => {
    if (!message) {
      setAnimation("Idle");
      setFacialExpression("default");
      setIsSpeaking(false);
      return;
    }

    // Prevent replaying the same message
    if (lastPlayedId.current === message.id) return;
    lastPlayedId.current = message.id;

    setAnimation(message.animation || "Talking_0");
    setFacialExpression(message.facialExpression || "default");

    // Speak using browser TTS
    speakText(stripHtml(message.text));
  }, [message, speakText]);

  /* ── Cleanup speech on unmount ── */
  useEffect(() => {
    return () => {
      window.speechSynthesis?.cancel();
    };
  }, []);

  /* ── Play body animations ── */
  useEffect(() => {
    if (!actions[animation]) return;
    actions[animation]!.reset().fadeIn(0.5).play();
    return () => {
      actions[animation]?.fadeOut(0.5);
    };
  }, [animation, actions]);

  /* ── Morph target helper ── */
  const lerpMorphTarget = (target: string, value: number, speed = 0.1) => {
    scene.traverse((child: any) => {
      if (child.isSkinnedMesh && child.morphTargetDictionary) {
        const index = child.morphTargetDictionary[target];
        if (index === undefined || child.morphTargetInfluences[index] === undefined) {
          return;
        }
        child.morphTargetInfluences[index] = THREE.MathUtils.lerp(
          child.morphTargetInfluences[index],
          value,
          speed
        );
        if (!setupMode) {
          try {
            set({ [target]: value });
          } catch {
            // ignore
          }
        }
      }
    });
  };

  /* ── Per-frame morph target updates ── */
  useFrame(({ clock }) => {
    if (!setupMode && nodes.EyeLeft?.morphTargetDictionary) {
      Object.keys(nodes.EyeLeft.morphTargetDictionary).forEach((key) => {
        const mapping = facialExpressions[facialExpression];
        if (key === "eyeBlinkLeft" || key === "eyeBlinkRight") return;
        if (mapping && mapping[key]) {
          lerpMorphTarget(key, mapping[key], 0.1);
        } else {
          lerpMorphTarget(key, 0, 0.1);
        }
      });
    }

    lerpMorphTarget("eyeBlinkLeft", blink || winkLeft ? 1 : 0, 0.5);
    lerpMorphTarget("eyeBlinkRight", blink || winkRight ? 1 : 0, 0.5);

    if (setupMode) return;

    // Procedural lip-sync: cycle through visemes while speaking
    if (isSpeaking) {
      const time = clock.getElapsedTime();
      const visemeIndex = Math.floor(time * 8) % SPEECH_VISEMES.length;
      // const currentViseme = SPEECH_VISEMES[visemeIndex]!;

      SPEECH_VISEMES.forEach((viseme, i) => {
        if (i === visemeIndex) {
          lerpMorphTarget(viseme, 0.8 + Math.sin(time * 12) * 0.2, 0.3);
        } else {
          lerpMorphTarget(viseme, 0, 0.2);
        }
      });

      // Add jaw movement for realism
      lerpMorphTarget("jawOpen", 0.3 + Math.sin(time * 10) * 0.15, 0.3);
    } else {
      // Reset mouth when not speaking
      SPEECH_VISEMES.forEach((viseme) => {
        lerpMorphTarget(viseme, 0, 0.1);
      });
      lerpMorphTarget("jawOpen", 0, 0.1);
    }
  });

  /* ── Leva debug controls (hidden in production) ── */
  useControls("FacialExpressions", {
    chat: button(() => { }),
    winkLeft: button(() => {
      setWinkLeft(true);
      setTimeout(() => setWinkLeft(false), 300);
    }),
    winkRight: button(() => {
      setWinkRight(true);
      setTimeout(() => setWinkRight(false), 300);
    }),
    animation: {
      value: animation,
      options: animations.map((a: any) => a.name),
      onChange: (value: string) => setAnimation(value),
    },
    facialExpression: {
      options: Object.keys(facialExpressions),
      onChange: (value: string) => setFacialExpression(value),
    },
    enableSetupMode: button(() => {
      setupMode = true;
    }),
    disableSetupMode: button(() => {
      setupMode = false;
    }),
    logMorphTargetValues: button(() => {
      const emotionValues: Record<string, number> = {};
      Object.keys(nodes.EyeLeft.morphTargetDictionary).forEach((key: string) => {
        if (key === "eyeBlinkLeft" || key === "eyeBlinkRight") return;
        const value =
          nodes.EyeLeft.morphTargetInfluences[nodes.EyeLeft.morphTargetDictionary[key]];
        if (value > 0.01) emotionValues[key] = value;
      });
      console.log(JSON.stringify(emotionValues, null, 2));
    }),
  });

  const [, set] = useControls("MorphTarget", () =>
    Object.assign(
      {},
      ...Object.keys(nodes.EyeLeft?.morphTargetDictionary ?? {}).map((key) => ({
        [key]: {
          label: key,
          value: 0,
          min: 0,
          max: 1,
          onChange: (val: number) => {
            if (setupMode) {
              lerpMorphTarget(key, val, 1);
            }
          },
        },
      }))
    )
  );

  /* ── Random blinking ── */
  useEffect(() => {
    let blinkTimeout: ReturnType<typeof setTimeout>;
    const nextBlink = () => {
      blinkTimeout = setTimeout(
        () => {
          setBlink(true);
          setTimeout(() => {
            setBlink(false);
            nextBlink();
          }, 200);
        },
        THREE.MathUtils.randInt(1000, 5000)
      );
    };
    nextBlink();
    return () => clearTimeout(blinkTimeout);
  }, []);

  /* ── Load voices on mount (Chrome needs this) ── */
  useEffect(() => {
    if (window.speechSynthesis) {
      window.speechSynthesis.getVoices();
      window.speechSynthesis.onvoiceschanged = () => {
        window.speechSynthesis.getVoices();
      };
    }
  }, []);

  if (!nodes.Hips) return null;

  return (
    <group {...props} dispose={null} ref={group}>
      <primitive object={nodes.Hips} />
      <skinnedMesh
        name="Wolf3D_Body"
        geometry={nodes.Wolf3D_Body.geometry}
        material={materials.Wolf3D_Body}
        skeleton={nodes.Wolf3D_Body.skeleton}
      />
      <skinnedMesh
        name="Wolf3D_Outfit_Bottom"
        geometry={nodes.Wolf3D_Outfit_Bottom.geometry}
        material={materials.Wolf3D_Outfit_Bottom}
        skeleton={nodes.Wolf3D_Outfit_Bottom.skeleton}
      />
      <skinnedMesh
        name="Wolf3D_Outfit_Footwear"
        geometry={nodes.Wolf3D_Outfit_Footwear.geometry}
        material={materials.Wolf3D_Outfit_Footwear}
        skeleton={nodes.Wolf3D_Outfit_Footwear.skeleton}
      />
      <skinnedMesh
        name="Wolf3D_Outfit_Top"
        geometry={nodes.Wolf3D_Outfit_Top.geometry}
        material={materials.Wolf3D_Outfit_Top}
        skeleton={nodes.Wolf3D_Outfit_Top.skeleton}
      />
      <skinnedMesh
        name="Wolf3D_Hair"
        geometry={nodes.Wolf3D_Hair.geometry}
        material={materials.Wolf3D_Hair}
        skeleton={nodes.Wolf3D_Hair.skeleton}
      />
      <skinnedMesh
        name="EyeLeft"
        geometry={nodes.EyeLeft.geometry}
        material={materials.Wolf3D_Eye}
        skeleton={nodes.EyeLeft.skeleton}
        morphTargetDictionary={nodes.EyeLeft.morphTargetDictionary}
        morphTargetInfluences={nodes.EyeLeft.morphTargetInfluences}
      />
      <skinnedMesh
        name="EyeRight"
        geometry={nodes.EyeRight.geometry}
        material={materials.Wolf3D_Eye}
        skeleton={nodes.EyeRight.skeleton}
        morphTargetDictionary={nodes.EyeRight.morphTargetDictionary}
        morphTargetInfluences={nodes.EyeRight.morphTargetInfluences}
      />
      <skinnedMesh
        name="Wolf3D_Head"
        geometry={nodes.Wolf3D_Head.geometry}
        material={materials.Wolf3D_Skin}
        skeleton={nodes.Wolf3D_Head.skeleton}
        morphTargetDictionary={nodes.Wolf3D_Head.morphTargetDictionary}
        morphTargetInfluences={nodes.Wolf3D_Head.morphTargetInfluences}
      />
      <skinnedMesh
        name="Wolf3D_Teeth"
        geometry={nodes.Wolf3D_Teeth.geometry}
        material={materials.Wolf3D_Teeth}
        skeleton={nodes.Wolf3D_Teeth.skeleton}
        morphTargetDictionary={nodes.Wolf3D_Teeth.morphTargetDictionary}
        morphTargetInfluences={nodes.Wolf3D_Teeth.morphTargetInfluences}
      />
    </group>
  );
}

useGLTF.preload(AVATAR_MODEL_URL);
useGLTF.preload(ANIMATIONS_URL);
