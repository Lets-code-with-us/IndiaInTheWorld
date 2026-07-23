'use client';

import React, { useRef, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface DataPoint {
  label: string;
  value: number;
  formattedValue?: string;
  code?: string;
  isHighlight?: boolean;
}

interface ThreeDChartProps {
  data: DataPoint[];
  chartType: 'bar' | 'line';
  title?: string;
  subtitle?: string;
  accentColor?: string; // e.g. '#6366f1' or '#0da5e9' or '#10b981'
  height?: number;
}

// 3D Bar Element
function ThreeDBar({
  position,
  width,
  height,
  depth,
  color,
  isHighlight,
  label,
  value,
  formattedValue,
  onHover,
}: {
  position: [number, number, number];
  width: number;
  height: number;
  depth: number;
  color: string;
  isHighlight?: boolean;
  label: string;
  value: number;
  formattedValue?: string;
  onHover: (info: { label: string; value: number; formattedValue?: string; x: number; y: number } | null) => void;
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);

  useFrame((state, delta) => {
    if (meshRef.current) {
      // Gentle floating animation when hovered
      const targetScaleY = hovered ? 1.05 : 1;
      meshRef.current.scale.y = THREE.MathUtils.lerp(meshRef.current.scale.y, targetScaleY, delta * 10);
    }
  });

  return (
    <group position={position}>
      <mesh
        ref={meshRef}
        position={[0, height / 2, 0]}
        onPointerOver={(e) => {
          e.stopPropagation();
          setHovered(true);
          onHover({
            label,
            value,
            formattedValue,
            x: e.clientX,
            y: e.clientY,
          });
        }}
        onPointerOut={() => {
          setHovered(false);
          onHover(null);
        }}
      >
        <boxGeometry args={[width, height, depth]} />
        <meshStandardMaterial
          color={hovered ? '#38bdf8' : isHighlight ? '#4f46e5' : color}
          metalness={0.2}
          roughness={0.3}
          emissive={hovered ? '#0284c7' : isHighlight ? '#312e81' : '#000000'}
          emissiveIntensity={hovered ? 0.4 : isHighlight ? 0.2 : 0}
        />
      </mesh>

      {/* Top cap glow indicator */}
      <mesh position={[0, height + 0.05, 0]}>
        <boxGeometry args={[width * 1.02, 0.08, depth * 1.02]} />
        <meshStandardMaterial
          color={isHighlight ? '#a5f3fc' : '#e0e7ff'}
          emissive={isHighlight ? '#38bdf8' : '#818cf8'}
          emissiveIntensity={0.6}
        />
      </mesh>
    </group>
  );
}

// 3D Line Node Element
function ThreeDLineNode({
  position,
  color,
  label,
  value,
  formattedValue,
  onHover,
}: {
  position: [number, number, number];
  color: string;
  label: string;
  value: number;
  formattedValue?: string;
  onHover: (info: { label: string; value: number; formattedValue?: string; x: number; y: number } | null) => void;
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);

  useFrame((state, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * 1.5;
      const targetScale = hovered ? 1.4 : 1;
      meshRef.current.scale.setScalar(THREE.MathUtils.lerp(meshRef.current.scale.x, targetScale, delta * 10));
    }
  });

  return (
    <group position={position}>
      <mesh
        ref={meshRef}
        onPointerOver={(e) => {
          e.stopPropagation();
          setHovered(true);
          onHover({
            label,
            value,
            formattedValue,
            x: e.clientX,
            y: e.clientY,
          });
        }}
        onPointerOut={() => {
          setHovered(false);
          onHover(null);
        }}
      >
        <sphereGeometry args={[0.35, 32, 32]} />
        <meshStandardMaterial
          color={hovered ? '#38bdf8' : color}
          metalness={0.4}
          roughness={0.1}
          emissive={hovered ? '#0284c7' : color}
          emissiveIntensity={hovered ? 0.8 : 0.4}
        />
      </mesh>

      {/* Vertical dropping light post to ground */}
      <mesh position={[0, -position[1] / 2, 0]}>
        <cylinderGeometry args={[0.02, 0.02, position[1], 8]} />
        <meshBasicMaterial color="#c7d2fe" transparent opacity={0.4} />
      </mesh>
    </group>
  );
}

// Scene Container with Rotation & Lighting
function ChartScene({
  data,
  chartType,
  accentColor = '#4f46e5',
  autoRotate = true,
  onHover,
}: {
  data: DataPoint[];
  chartType: 'bar' | 'line';
  accentColor?: string;
  autoRotate?: boolean;
  onHover: (info: { label: string; value: number; formattedValue?: string; x: number; y: number } | null) => void;
}) {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state, delta) => {
    if (groupRef.current && autoRotate) {
      groupRef.current.rotation.y += delta * 0.25;
    }
  });

  if (!data || data.length === 0) return null;

  // Find max value to scale heights properly
  const maxVal = Math.max(...data.map((d) => d.value), 0.0001);
  const chartHeightScale = 4.5;
  const barSpacing = 1.3;
  const totalWidth = data.length * barSpacing;
  const startX = -totalWidth / 2 + barSpacing / 2;

  // Calculate points for 3D Line
  const linePoints = data.map((d, i) => {
    const x = startX + i * barSpacing;
    const y = (d.value / maxVal) * chartHeightScale + 0.2;
    return new THREE.Vector3(x, y, 0);
  });

  const curve = new THREE.CatmullRomCurve3(linePoints);
  const tubeGeometry = new THREE.TubeGeometry(curve, 64, 0.12, 12, false);

  return (
    <group ref={groupRef} position={[0, -1.8, 0]}>
      {/* Lights */}
      <ambientLight intensity={0.8} />
      <directionalLight position={[10, 15, 10]} intensity={1.2} castShadow />
      <directionalLight position={[-10, 10, -10]} intensity={0.4} />
      <pointLight position={[0, 8, 5]} intensity={0.8} color="#e0e7ff" />

      {/* Ground Plane with Grid */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]} receiveShadow>
        <planeGeometry args={[18, 18]} />
        <meshStandardMaterial color="#f8fafc" roughness={0.8} metalness={0.1} />
      </mesh>
      <gridHelper args={[18, 18, '#cbd5e1', '#e2e8f0']} position={[0, 0, 0]} />

      {/* Render 3D Bars */}
      {chartType === 'bar' &&
        data.map((d, i) => {
          const x = startX + i * barSpacing;
          const height = Math.max((d.value / maxVal) * chartHeightScale, 0.2);

          return (
            <ThreeDBar
              key={i}
              position={[x, 0, 0]}
              width={0.75}
              height={height}
              depth={0.75}
              color={d.isHighlight ? '#4f46e5' : '#94a3b8'}
              isHighlight={d.isHighlight}
              label={d.label}
              value={d.value}
              formattedValue={d.formattedValue}
              onHover={onHover}
            />
          );
        })}

      {/* Render 3D Line Tube & Nodes */}
      {chartType === 'line' && (
        <>
          <mesh geometry={tubeGeometry}>
            <meshStandardMaterial
              color={accentColor}
              metalness={0.5}
              roughness={0.2}
              emissive={accentColor}
              emissiveIntensity={0.3}
            />
          </mesh>

          {data.map((d, i) => {
            const x = startX + i * barSpacing;
            const y = (d.value / maxVal) * chartHeightScale + 0.2;

            return (
              <ThreeDLineNode
                key={i}
                position={[x, y, 0]}
                color={d.isHighlight ? '#38bdf8' : accentColor}
                label={d.label}
                value={d.value}
                formattedValue={d.formattedValue}
                onHover={onHover}
              />
            );
          })}
        </>
      )}
    </group>
  );
}

export const ThreeDChart: React.FC<ThreeDChartProps> = ({
  data,
  chartType,
  title,
  subtitle,
  accentColor = '#4f46e5',
  height = 360,
}) => {
  const [autoRotate, setAutoRotate] = useState(true);
  const [hoverInfo, setHoverInfo] = useState<{
    label: string;
    value: number;
    formattedValue?: string;
    x: number;
    y: number;
  } | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const handle = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(handle);
  }, []);

  if (!mounted) {
    return (
      <div
        className="w-full bg-slate-50 rounded-2xl border border-slate-200 flex items-center justify-center text-xs font-semibold text-slate-400"
        style={{ height }}
      >
        Initializing 3D WebGL Chart Studio...
      </div>
    );
  }

  return (
    <div className="relative w-full bg-gradient-to-br from-slate-50 via-white to-indigo-50/20 rounded-2xl p-5 border border-slate-200/90 shadow-md shadow-slate-200/50 space-y-3 overflow-hidden">
      {/* Header Bar */}
      <div className="flex items-center justify-between gap-4 border-b border-slate-200/70 pb-3 z-10 relative">
        <div>
          {title && <h4 className="text-sm font-black text-slate-900">{title}</h4>}
          {subtitle && <p className="text-[11px] font-medium text-slate-500">{subtitle}</p>}
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setAutoRotate(!autoRotate)}
            className={`px-3 py-1 rounded-xl text-[11px] font-bold transition-all border ${
              autoRotate
                ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
                : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-100'
            }`}
          >
            {autoRotate ? '3D Rotation On' : 'Pause Rotation'}
          </button>
        </div>
      </div>

      {/* 3D Canvas Canvas Viewport */}
      <div className="relative w-full overflow-hidden rounded-xl bg-slate-900/5" style={{ height }}>
        <Canvas
          camera={{ position: [0, 2.5, 7.5], fov: 45 }}
          style={{ width: '100%', height: '100%' }}
        >
          <ChartScene
            data={data}
            chartType={chartType}
            accentColor={accentColor}
            autoRotate={autoRotate}
            onHover={setHoverInfo}
          />
        </Canvas>

        {/* Floating Tooltip */}
        {hoverInfo && (
          <div
            className="pointer-events-none fixed z-50 transform -translate-x-1/2 -translate-y-full mb-3 bg-slate-900/95 text-white p-3 rounded-xl shadow-2xl border border-slate-700 backdrop-blur-md space-y-1 text-xs"
            style={{ left: hoverInfo.x, top: hoverInfo.y - 12 }}
          >
            <div className="font-extrabold text-sky-300">{hoverInfo.label}</div>
            <div className="font-bold text-white">
              {hoverInfo.formattedValue ? hoverInfo.formattedValue : hoverInfo.value}
            </div>
          </div>
        )}

        {/* Data Legend Pill list at bottom */}
        <div className="absolute bottom-3 left-3 right-3 flex flex-wrap items-center justify-center gap-2 pointer-events-none z-10">
          {data.map((d, idx) => (
            <span
              key={idx}
              className={`text-[10px] font-bold px-2.5 py-1 rounded-full border backdrop-blur-md shadow-sm ${
                d.isHighlight
                  ? 'bg-indigo-600 text-white border-indigo-600'
                  : 'bg-white/90 text-slate-700 border-slate-200'
              }`}
            >
              {d.label}: {d.formattedValue || d.value}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};
