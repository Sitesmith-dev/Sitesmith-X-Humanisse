"use client";
import { Canvas, useThree } from "@react-three/fiber";
import { Environment, Lightformer } from "@react-three/drei";
import { BotModel, CatModel, ProfessorModel, type Pointer } from "./models";

export type CharId = "professor" | "bot" | "cat";

// Scales the whole line-up to the stage so it never clips on narrow screens
function Lineup({ active, reduced, pointer }: { active: CharId | null; reduced: boolean; pointer: Pointer }) {
  const width = useThree((s) => s.viewport.width);
  const fit = Math.min(1, width / 9.4);
  return (
    <group scale={fit} position={[0, 0.05, 0]}>
      <ProfessorModel position={[-2.9, -0.15, 0]} active={active === "professor"} reduced={reduced} pointer={pointer} />
      <BotModel position={[0, -0.05, 0.3]} active={active === "bot"} reduced={reduced} pointer={pointer} />
      <CatModel position={[2.85, 0.35, 0]} active={active === "cat"} reduced={reduced} pointer={pointer} />
    </group>
  );
}

export default function CharacterScene({ active, reduced, running, pointer, onReady }: { active: CharId | null; reduced: boolean; running: boolean; pointer: Pointer; onReady?: () => void }) {
  return (
    <Canvas
      dpr={[1, 1.5]}
      camera={{ position: [0, 0.1, 9.5], fov: 36 }}
      frameloop={running ? "always" : "never"}
      gl={{ antialias: true, powerPreference: "low-power" }}
      aria-hidden="true"
      onCreated={() => onReady?.()}
    >
      <ambientLight intensity={0.5} />
      <directionalLight position={[3, 5, 6]} intensity={2.4} color="#FFF3D6" />
      <directionalLight position={[-5, 2, -3]} intensity={2.2} color="#F7B734" />
      <directionalLight position={[5, 1, -4]} intensity={1.6} color="#B56AB8" />
      <Environment resolution={128}>
        <Lightformer form="rect" intensity={3} position={[0, 5, 4]} scale={[12, 3, 1]} />
        <Lightformer form="rect" intensity={1.6} color="#FFD98A" position={[-6, 1, 2]} scale={[3, 6, 1]} />
        <Lightformer form="rect" intensity={1.2} color="#D9A8DD" position={[6, 0, 2]} scale={[3, 6, 1]} />
      </Environment>
      <Lineup active={active} reduced={reduced} pointer={pointer} />
    </Canvas>
  );
}
