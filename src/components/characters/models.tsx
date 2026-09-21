"use client";
import { useLayoutEffect, useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { CanvasTexture, CatmullRomCurve3, DoubleSide, MathUtils, Object3D, RepeatWrapping, SRGBColorSpace, Vector3 } from "three";
import type { Group, InstancedMesh, Mesh } from "three";

// Provisional detailed blockouts from primitives, built only from features visible in the supplied art
// Replace each with an approved GLB (useGLTF) once turnarounds exist

export type Pointer = { current: { x: number; y: number } };
export type CharProps = { position: [number, number, number]; active: boolean; reduced: boolean; pointer: Pointer };
type V3 = [number, number, number];

// Each character turns toward the cursor, relative to where it stands on the stage, and eases back when the cursor leaves
function useMotion(active: boolean, reduced: boolean, base: V3, fit: number, pointer: Pointer) {
  const ref = useRef<Group>(null);
  useFrame((state, delta) => {
    const g = ref.current;
    if (!g) return;
    const { x, y } = reduced ? { x: 0, y: 0 } : pointer.current;
    const stageX = base[0] / 4.2;
    const yaw = MathUtils.clamp((x - stageX) * 0.42, -0.6, 0.6);
    g.rotation.y = MathUtils.damp(g.rotation.y, yaw, 5, delta);
    g.rotation.x = MathUtils.damp(g.rotation.x, -y * 0.14, 5, delta);
    g.scale.setScalar(MathUtils.damp(g.scale.x, fit * (active ? 1.1 : 1), 6, delta));
    g.position.z = MathUtils.damp(g.position.z, base[2] + (active ? 0.8 : 0), 6, delta);
    g.position.y = base[1] + (reduced ? 0 : Math.sin(state.clock.elapsedTime * 1.4 + base[0]) * 0.05);
  });
  return ref;
}

type MatProps = { c: string; r?: number; m?: number; cc?: number; sheen?: number; sc?: string; map?: CanvasTexture | null };
const P = ({ c, r = 0.55, m = 0, cc = 0, sheen = 0, sc, map }: MatProps) => (
  <meshPhysicalMaterial color={c} roughness={r} metalness={m} clearcoat={cc} clearcoatRoughness={0.25} sheen={sheen} sheenColor={sc ?? c} sheenRoughness={0.6} map={map ?? null} />
);

type FurSpec = { radii: V3; center: V3; mask?: (d: Vector3) => boolean };

/** Instanced fur strands scattered over an ellipsoid surface */
function Fur({ n, spec, color, len = 0.16, thick = 0.018, seed = 1 }: { n: number; spec: FurSpec; color: string; len?: number; thick?: number; seed?: number }) {
  const ref = useRef<InstancedMesh>(null);
  useLayoutEffect(() => {
    const m = ref.current;
    if (!m) return;
    const { radii, center, mask } = spec;
    const o = new Object3D();
    let s = seed;
    const rnd = () => ((s = (s * 16807) % 2147483647) / 2147483647);
    const up = new Vector3(0, 1, 0);
    let i = 0;
    let guard = 0;
    while (i < n && guard++ < n * 8) {
      const u = rnd() * 2 - 1, t = rnd() * Math.PI * 2, q = Math.sqrt(1 - u * u);
      const dir = new Vector3(q * Math.cos(t), u, q * Math.sin(t));
      if (mask && !mask(dir)) continue;
      o.position.set(center[0] + dir.x * radii[0], center[1] + dir.y * radii[1], center[2] + dir.z * radii[2]);
      const nrm = new Vector3(dir.x / radii[0], dir.y / radii[1], dir.z / radii[2]).normalize();
      o.quaternion.setFromUnitVectors(up, nrm);
      o.rotateX((rnd() - 0.5) * 0.6); o.rotateZ((rnd() - 0.5) * 0.6);
      o.scale.set(1, 0.6 + rnd() * 0.8, 1);
      o.updateMatrix();
      m.setMatrixAt(i++, o.matrix);
    }
    m.count = i;
    m.instanceMatrix.needsUpdate = true;
  }, [n, spec, seed]);
  return (
    <instancedMesh ref={ref} args={[undefined, undefined, n]}>
      <coneGeometry args={[thick, len, 5]} />
      <meshStandardMaterial color={color} roughness={0.9} />
    </instancedMesh>
  );
}

// Stable specs so fur is generated once, not on every hover re-render
const PROF_HAIR: FurSpec = { radii: [0.68, 0.4, 0.68], center: [0, 0.9, -0.08], mask: (d) => d.y > 0.1 };
const PROF_BEARD: FurSpec = { radii: [0.56, 0.8, 0.42], center: [0, -0.12, 0.26], mask: (d) => d.y < 0.35 && d.z > -0.2 };
const BOT_BEARD: FurSpec = { radii: [0.52, 0.8, 0.3], center: [0, -0.55, 0.66], mask: (d) => d.z > 0 };
const CAT_BODY: FurSpec = { radii: [1.05, 1.05, 0.95], center: [0, -1.15, 0], mask: (d) => d.y > -0.4 };
const CAT_HEAD: FurSpec = { radii: [0.82, 0.68, 0.7], center: [0, 0.2, 0.05], mask: (d) => d.z < 0.55 || d.y > 0.4 };

function Shadow({ w = 1.6, y = -2.15 }: { w?: number; y?: number }) {
  const tex = useMemo(() => {
    const c = document.createElement("canvas"); c.width = c.height = 128;
    const g = c.getContext("2d")!; const gr = g.createRadialGradient(64, 64, 4, 64, 64, 64);
    gr.addColorStop(0, "rgba(21,16,20,.5)"); gr.addColorStop(1, "rgba(21,16,20,0)");
    g.fillStyle = gr; g.fillRect(0, 0, 128, 128);
    return new CanvasTexture(c);
  }, []);
  return <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, y, 0]}><planeGeometry args={[w * 2, w * 1.1]} /><meshBasicMaterial map={tex} transparent depthWrite={false} /></mesh>;
}

/** Fair Isle style knit texture */
function useKnit() {
  return useMemo(() => {
    const c = document.createElement("canvas"); c.width = 256; c.height = 256;
    const g = c.getContext("2d")!;
    const bands = ["#B22A1E", "#E0642A", "#F2B632", "#1F7F7A", "#20477E", "#E0642A", "#B22A1E", "#F2B632"];
    const h = 256 / bands.length;
    bands.forEach((col, i) => {
      g.fillStyle = col; g.fillRect(0, i * h, 256, h);
      g.fillStyle = i % 2 ? "#FFF3D6" : "#20477E";
      for (let x = 8; x < 256; x += 32) {
        g.beginPath(); g.moveTo(x, i * h + h / 2 - 7); g.lineTo(x + 7, i * h + h / 2); g.lineTo(x, i * h + h / 2 + 7); g.lineTo(x - 7, i * h + h / 2); g.fill();
      }
      g.strokeStyle = "rgba(0,0,0,.12)"; g.lineWidth = 1;
      for (let y = 0; y < h; y += 4) { g.beginPath(); g.moveTo(0, i * h + y); g.lineTo(256, i * h + y); g.stroke(); }
    });
    const t = new CanvasTexture(c); t.wrapS = t.wrapT = RepeatWrapping; t.repeat.set(3, 1); t.colorSpace = SRGBColorSpace;
    return t;
  }, []);
}

const mirror = [-1, 1] as const;

export function ProfessorModel({ position, active, reduced, pointer }: CharProps) {
  const ref = useMotion(active, reduced, position, 0.8, pointer);
  const knit = useKnit();
  const arm = useRef<Group>(null);
  useFrame((s) => { if (arm.current && !reduced) arm.current.rotation.z = -2.55 + Math.sin(s.clock.elapsedTime * 2) * 0.05; });
  return (
    <group ref={ref} position={position}>
      <Shadow y={-2.2} />
      <group scale={1.28} position={[0, 0.35, 0]}>
        <mesh position={[0, -1.15, 0]}><cylinderGeometry args={[0.95, 1.05, 1.7, 40]} /><P c="#ffffff" r={0.95} sheen={1} sc="#F2B632" map={knit} /></mesh>
        <mesh position={[0, -0.3, 0]} scale={[1, 0.55, 0.85]}><sphereGeometry args={[0.98, 32, 32]} /><P c="#ffffff" r={0.95} sheen={1} sc="#F2B632" map={knit} /></mesh>
        <mesh position={[0, -0.22, 0.05]} rotation={[Math.PI / 2, 0, 0]}><torusGeometry args={[0.46, 0.13, 16, 32]} /><P c="#20477E" r={0.95} /></mesh>
        <mesh position={[0, -0.32, 0.5]}><boxGeometry args={[0.36, 0.3, 0.08]} /><P c="#F1EFEA" r={0.7} /></mesh>
        <group position={[-0.98, -0.45, 0]} rotation={[0, 0, 0.18]}>
          <mesh position={[-0.1, -0.5, 0]}><capsuleGeometry args={[0.24, 0.8, 8, 16]} /><P c="#ffffff" r={0.95} sheen={1} sc="#F2B632" map={knit} /></mesh>
          <mesh position={[-0.12, -1.15, 0.05]}><sphereGeometry args={[0.2, 20, 20]} /><P c="#B0723C" r={0.6} sheen={0.6} sc="#E0A56E" /></mesh>
        </group>
        <group ref={arm} position={[0.98, -0.45, 0]} rotation={[0, 0, -2.55]}>
          <mesh position={[0, -0.55, 0]}><capsuleGeometry args={[0.24, 0.85, 8, 16]} /><P c="#ffffff" r={0.95} sheen={1} sc="#F2B632" map={knit} /></mesh>
          <mesh position={[0, -1.2, 0]}><sphereGeometry args={[0.24, 20, 20]} /><P c="#B0723C" r={0.6} sheen={0.6} sc="#E0A56E" /></mesh>
          <mesh position={[0, -1.5, 0]}><capsuleGeometry args={[0.065, 0.28, 6, 12]} /><P c="#B0723C" r={0.6} /></mesh>
        </group>
        <mesh position={[0, 0.42, 0]} scale={[1, 1.08, 0.98]}><sphereGeometry args={[0.66, 48, 48]} /><P c="#B0723C" r={0.6} sheen={0.7} sc="#E3A66F" /></mesh>
        <mesh position={[0, 0.28, 0.66]}><sphereGeometry args={[0.13, 20, 20]} /><P c="#A8683A" r={0.55} /></mesh>
        {mirror.map((s) => (
          <group key={s}>
            <mesh position={[s * 0.66, 0.36, 0]} scale={[0.5, 1, 0.8]}><sphereGeometry args={[0.15, 16, 16]} /><P c="#A8683A" r={0.6} /></mesh>
            <mesh position={[s * 0.24, 0.5, 0.58]}><sphereGeometry args={[0.1, 20, 20]} /><P c="#FBFAF6" r={0.2} cc={1} /></mesh>
            <mesh position={[s * 0.24, 0.5, 0.66]}><sphereGeometry args={[0.055, 16, 16]} /><P c="#1B0F08" r={0.1} cc={1} /></mesh>
            <mesh position={[s * 0.24, 0.5, 0.63]}><torusGeometry args={[0.21, 0.032, 12, 40]} /><P c="#101010" r={0.3} cc={1} /></mesh>
            <mesh position={[s * 0.25, 0.68, 0.58]} rotation={[0, 0, s * -0.12]} scale={[1, 0.35, 0.5]}><sphereGeometry args={[0.2, 14, 14]} /><P c="#D9D7D0" r={0.9} /></mesh>
            <mesh position={[s * 0.56, 0.5, 0.35]} rotation={[0, s * -0.8, 0]}><cylinderGeometry args={[0.012, 0.012, 0.6, 6]} /><P c="#101010" /></mesh>
          </group>
        ))}
        <mesh position={[0, 0.5, 0.66]} rotation={[0, 0, Math.PI / 2]}><cylinderGeometry args={[0.014, 0.014, 0.1, 6]} /><P c="#101010" /></mesh>
        <mesh position={[-0.7, 0.16, 0.08]}><sphereGeometry args={[0.035, 12, 12]} /><P c="#F2B632" m={1} r={0.2} /></mesh>
        <mesh position={[0, 0.85, -0.08]} scale={[1.02, 0.55, 1]}><sphereGeometry args={[0.66, 32, 32]} /><P c="#C3C3C7" r={0.85} sheen={1} sc="#ffffff" /></mesh>
        <mesh position={[0, 1.02, -0.6]}><sphereGeometry args={[0.24, 24, 24]} /><P c="#C3C3C7" r={0.85} sheen={1} sc="#ffffff" /></mesh>
        <mesh position={[0, 0.98, -0.42]} rotation={[0.5, 0, 0]}><torusGeometry args={[0.16, 0.03, 8, 20]} /><P c="#20477E" /></mesh>
        <Fur n={260} spec={PROF_HAIR} color="#CFCFD3" len={0.11} thick={0.014} seed={11} />
        <mesh position={[0, -0.02, 0.24]} scale={[1, 1.45, 0.75]}><sphereGeometry args={[0.55, 32, 32]} /><P c="#F1F0EC" r={0.95} sheen={1} sc="#ffffff" /></mesh>
        <Fur n={520} spec={PROF_BEARD} color="#F5F4F0" len={0.2} thick={0.02} seed={5} />
        {mirror.map((s) => (
          <mesh key={s} position={[s * 0.24, 0.18, 0.64]} rotation={[0, 0, s * 0.35]} scale={[1.7, 0.55, 0.7]}><sphereGeometry args={[0.16, 20, 20]} /><P c="#F7F6F2" r={0.95} sheen={1} sc="#ffffff" /></mesh>
        ))}
        <mesh position={[0, 0.02, 0.7]} rotation={[0.1, 0, Math.PI]}><torusGeometry args={[0.1, 0.022, 8, 20, Math.PI]} /><P c="#7A2A22" r={0.4} cc={0.6} /></mesh>
      </group>
    </group>
  );
}

export function BotModel({ position, active, reduced, pointer }: CharProps) {
  const ref = useMotion(active, reduced, position, 1.02, pointer);
  const flame = useRef<Mesh>(null);
  useFrame((s) => { if (flame.current) flame.current.scale.y = 1.2 + Math.sin(s.clock.elapsedTime * 30) * 0.2; });
  const yellow = "#F6B91C", blue = "#1A4FC4";
  return (
    <group ref={ref} position={position}>
      <Shadow w={1.5} y={-1.9} />
      <mesh position={[0, -0.75, 0]} scale={[1, 1.1, 0.92]}><sphereGeometry args={[0.98, 48, 48]} /><P c={yellow} r={0.25} m={0.35} cc={1} /></mesh>
      <mesh position={[0, -1.6, 0]} scale={[1, 0.32, 0.92]}><sphereGeometry args={[0.92, 32, 32]} /><P c={blue} r={0.25} m={0.4} cc={1} /></mesh>
      <mesh position={[0, -1.72, 0]} rotation={[-Math.PI / 2, 0, 0]}><circleGeometry args={[0.28, 24]} /><meshBasicMaterial color="#5FE3FF" toneMapped={false} /></mesh>
      <mesh position={[0, 0.4, 0]}><sphereGeometry args={[0.82, 48, 48]} /><P c={yellow} r={0.22} m={0.35} cc={1} /></mesh>
      <mesh position={[0, 0.4, 0.28]} scale={[1, 0.86, 0.85]}><sphereGeometry args={[0.66, 48, 48]} /><P c="#07080F" r={0.08} m={0.6} cc={1} /></mesh>
      <mesh position={[0, 0.4, 0]} scale={[1.05, 1.05, 1.05]}><sphereGeometry args={[0.86, 48, 48]} /><meshPhysicalMaterial color="#DDF4FF" transparent opacity={0.14} roughness={0} clearcoat={1} side={DoubleSide} depthWrite={false} /></mesh>
      {mirror.map((s) => (
        <group key={s}>
          <mesh position={[s * 0.25, 0.48, 0.86]}><boxGeometry args={[0.22, 0.32, 0.04]} /><meshBasicMaterial color="#8AF0FF" toneMapped={false} /></mesh>
          <mesh position={[s * 0.78, 0.95, -0.02]} rotation={[0, 0, s * -0.85]} scale={[0.5, 1.5, 0.28]}><sphereGeometry args={[0.36, 24, 24]} /><P c="#2D63DB" r={0.4} cc={0.6} /></mesh>
          <mesh position={[s * 0.84, 0.35, 0]} rotation={[0, Math.PI / 2, 0]}><cylinderGeometry args={[0.28, 0.28, 0.2, 28]} /><P c="#D9A410" m={0.7} r={0.25} cc={1} /></mesh>
          <mesh position={[s * 0.95, 0.35, 0]} rotation={[0, Math.PI / 2, 0]}><cylinderGeometry args={[0.19, 0.19, 0.04, 24]} /><P c="#2A1B4A" r={0.4} /></mesh>
        </group>
      ))}
      <mesh position={[0, 0.06, 0.92]} scale={[1, 0.7, 0.8]}><sphereGeometry args={[0.07, 12, 12]} /><P c="#5A4A46" r={0.3} cc={1} /></mesh>
      {mirror.map((s) => (
        <mesh key={s} position={[s * 0.28, -0.02, 0.8]} rotation={[0, 0, s * 0.42]} scale={[1.9, 0.55, 0.75]}><sphereGeometry args={[0.17, 20, 20]} /><P c="#F7F5F0" r={0.95} sheen={1} sc="#ffffff" /></mesh>
      ))}
      <mesh position={[0, -0.55, 0.62]} scale={[1, 1.6, 0.55]}><sphereGeometry args={[0.5, 32, 32]} /><P c="#F4F2EC" r={0.95} sheen={1} sc="#ffffff" /></mesh>
      <Fur n={480} spec={BOT_BEARD} color="#FAF8F3" len={0.2} thick={0.02} seed={9} />
      <group position={[-1.15, -0.75, -0.05]} rotation={[0, 0, 0.12]}>
        <mesh><cylinderGeometry args={[0.24, 0.24, 0.95, 24]} /><P c="#3F55C9" m={0.4} r={0.3} cc={1} /></mesh>
        <mesh position={[0, 0.66, 0]}><coneGeometry args={[0.24, 0.42, 24]} /><P c="#D8392B" m={0.3} r={0.3} cc={1} /></mesh>
        <mesh ref={flame} position={[0, -0.72, 0]} rotation={[Math.PI, 0, 0]}><coneGeometry args={[0.13, 0.5, 16]} /><meshBasicMaterial color="#6FD8FF" toneMapped={false} transparent opacity={0.85} /></mesh>
      </group>
      <group position={[1.0, -0.85, 0.05]} rotation={[0, 0, 1.05]}>
        <mesh position={[0.3, 0.15, 0]} rotation={[0, 0, -1]}><capsuleGeometry args={[0.16, 0.5, 8, 16]} /><P c={yellow} m={0.35} r={0.25} cc={1} /></mesh>
        <mesh position={[0.62, 0.35, 0]}><sphereGeometry args={[0.2, 24, 24]} /><P c={blue} m={0.5} r={0.25} cc={1} /></mesh>
        <mesh position={[0.62, 0.62, 0]}><capsuleGeometry args={[0.055, 0.22, 6, 12]} /><P c={blue} m={0.5} r={0.25} cc={1} /></mesh>
      </group>
    </group>
  );
}

export function CatModel({ position, active, reduced, pointer }: CharProps) {
  const ref = useMotion(active, reduced, position, 1.0, pointer);
  const tail = useMemo(() => new CatmullRomCurve3([new Vector3(0.7, -1.5, -0.3), new Vector3(1.15, -1.5, -0.5), new Vector3(1.3, -0.95, -0.3), new Vector3(1.15, -0.4, -0.2)]), []);
  const badge = useMemo(() => {
    const c = document.createElement("canvas"); c.width = c.height = 128;
    const g = c.getContext("2d")!;
    g.fillStyle = "#E8B324"; g.fillRect(0, 0, 128, 128);
    g.strokeStyle = "#8A6410"; g.lineWidth = 6; g.beginPath(); g.arc(64, 64, 56, 0, 7); g.stroke();
    g.fillStyle = "#3A2A08"; g.font = "bold 20px sans-serif"; g.textAlign = "center";
    ["CHIEF", "STORY", "CRITIC"].forEach((t, i) => g.fillText(t, 64, 50 + i * 24));
    const t = new CanvasTexture(c); t.colorSpace = SRGBColorSpace; return t;
  }, []);
  const fur = "#171216";
  return (
    <group ref={ref} position={position}>
      <Shadow w={1.7} y={-2.25} />
      <mesh position={[0, -1.15, 0]} scale={[1.05, 1.05, 0.95]}><sphereGeometry args={[1, 48, 48]} /><P c={fur} r={0.9} sheen={1} sc="#7A3FA8" /></mesh>
      <Fur n={900} spec={CAT_BODY} color={fur} len={0.2} thick={0.024} seed={21} />
      <mesh position={[0, -1.85, 0.6]} scale={[0.9, 0.5, 0.9]}><sphereGeometry args={[0.7, 24, 24]} /><P c={fur} r={0.9} sheen={1} sc="#7A3FA8" /></mesh>
      <mesh><tubeGeometry args={[tail, 32, 0.15, 12, false]} /><P c={fur} r={0.9} sheen={1} sc="#7A3FA8" /></mesh>
      <mesh position={[0, 0.2, 0.05]} scale={[1.14, 0.94, 0.98]}><sphereGeometry args={[0.72, 48, 48]} /><P c={fur} r={0.9} sheen={1} sc="#7A3FA8" /></mesh>
      <Fur n={620} spec={CAT_HEAD} color={fur} len={0.17} thick={0.02} seed={33} />
      {mirror.map((s) => (
        <group key={s}>
          <mesh position={[s * 0.5, 0.92, 0]} rotation={[0, 0, s * -0.22]}><coneGeometry args={[0.28, 0.6, 4]} /><P c={fur} r={0.9} sheen={1} sc="#7A3FA8" /></mesh>
          <mesh position={[s * 0.5, 0.88, 0.09]} rotation={[0, 0, s * -0.22]} scale={[0.6, 0.7, 0.4]}><coneGeometry args={[0.24, 0.5, 4]} /><P c="#6B3A4B" r={0.8} /></mesh>
          <mesh position={[s * 0.3, 0.3, 0.64]} scale={[1, 0.85, 0.5]}><sphereGeometry args={[0.17, 24, 24]} /><meshPhysicalMaterial color="#F6B90A" emissive="#B98A00" emissiveIntensity={0.7} roughness={0.1} clearcoat={1} /></mesh>
          <mesh position={[s * 0.3, 0.3, 0.71]} scale={[0.32, 1, 0.3]}><sphereGeometry args={[0.1, 12, 12]} /><meshBasicMaterial color="#030203" /></mesh>
          {[0.03, -0.05, -0.13].map((y, i) => (
            <mesh key={i} position={[s * 0.62, 0.02 + y, 0.62]} rotation={[0, 0, s * (Math.PI / 2 - 0.15 + i * 0.12)]}><cylinderGeometry args={[0.006, 0.004, 0.62, 5]} /><meshBasicMaterial color="#EDE6D8" /></mesh>
          ))}
        </group>
      ))}
      <mesh position={[0, 0.06, 0.7]} scale={[1, 0.7, 0.7]}><sphereGeometry args={[0.09, 16, 16]} /><P c="#4A3038" r={0.3} cc={1} /></mesh>
      <mesh position={[0, -0.48, 0.08]} rotation={[Math.PI / 2, 0, 0]}><torusGeometry args={[0.64, 0.085, 16, 40]} /><P c="#5B245E" r={0.4} cc={0.8} /></mesh>
      <mesh position={[0, -0.72, 0.66]} rotation={[Math.PI / 2 - 0.15, 0, 0]}><cylinderGeometry args={[0.22, 0.22, 0.045, 32]} /><P c="#E8B324" m={0.8} r={0.25} cc={1} map={badge} /></mesh>
    </group>
  );
}
