import React, { useRef, useEffect, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Points, PointMaterial, Line, Float, Sphere } from '@react-three/drei';
import * as THREE from 'three';

interface NeuralNode {
  position: THREE.Vector3;
  activation: number;
  id: number;
}

interface NeuralConnection {
  start: THREE.Vector3;
  end: THREE.Vector3;
  weight: number;
}

const NeuralLayer: React.FC<{ 
  nodes: NeuralNode[]; 
  connections: NeuralConnection[];
  layerIndex: number;
  totalLayers: number;
}> = ({ nodes, connections, layerIndex, totalLayers }) => {
  const pointsRef = useRef<THREE.Points>(null);
  const [time, setTime] = useState(0);

  useFrame((state) => {
    setTime(state.clock.getElapsedTime());
    
    if (pointsRef.current) {
      const positions = pointsRef.current.geometry.attributes.position.array as Float32Array;
      const colors = pointsRef.current.geometry.attributes.color.array as Float32Array;
      
      nodes.forEach((node, i) => {
        const i3 = i * 3;
        positions[i3] = node.position.x;
        positions[i3 + 1] = node.position.y;
        positions[i3 + 2] = node.position.z;
        
        // Dynamic activation based on time and layer
        const activation = Math.sin(time * 2 + layerIndex * 0.5 + i * 0.3) * 0.5 + 0.5;
        const hue = (layerIndex / totalLayers + activation * 0.3) % 1;
        const color = new THREE.Color().setHSL(hue, 0.8, 0.6);
        
        colors[i3] = color.r;
        colors[i3 + 1] = color.g;
        colors[i3 + 2] = color.b;
      });
      
      pointsRef.current.geometry.attributes.position.needsUpdate = true;
      pointsRef.current.geometry.attributes.color.needsUpdate = true;
    }
  });

  return (
    <>
      <points ref={pointsRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={nodes.length}
            array={new Float32Array(nodes.length * 3)}
            itemSize={3}
          />
          <bufferAttribute
            attach="attributes-color"
            count={nodes.length}
            array={new Float32Array(nodes.length * 3)}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.05}
          vertexColors
          transparent
          opacity={0.8}
          sizeAttenuation
        />
      </points>
      
      {connections.map((connection, i) => (
        <Line
          key={i}
          points={[connection.start, connection.end]}
          color={new THREE.Color().setHSL(
            (layerIndex / totalLayers + Math.sin(time + i * 0.1) * 0.1) % 1,
            0.7,
            0.5 + connection.weight * 0.3
          )}
          lineWidth={1 + connection.weight * 2}
          transparent
          opacity={0.6 + connection.weight * 0.4}
        />
      ))}
    </>
  );
};

const NeuralNetworkCore: React.FC = () => {
  const [neuralLayers, setNeuralLayers] = useState<{ nodes: NeuralNode[]; connections: NeuralConnection[] }[]>([]);
  const groupRef = useRef<THREE.Group>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    // Generate neural network structure
    const layers: { nodes: NeuralNode[]; connections: NeuralConnection[] }[] = [];
    const layerSizes = [6, 10, 8, 5, 3]; // Optimized layer sizes for performance
    
    // Generate nodes for each layer
    layerSizes.forEach((size, layerIndex) => {
      const nodes: NeuralNode[] = [];
      const connections: NeuralConnection[] = [];
      
      for (let i = 0; i < size; i++) {
        const angle = (i / size) * Math.PI * 2;
        const radius = 1.2 + Math.sin(layerIndex * 0.6) * 0.4;
        const height = (layerIndex - layerSizes.length / 2) * 1.5;
        
        // Add some randomness to make it more organic
        const randomOffset = new THREE.Vector3(
          (Math.random() - 0.5) * 0.2,
          (Math.random() - 0.5) * 0.15,
          (Math.random() - 0.5) * 0.2
        );
        
        const position = new THREE.Vector3(
          Math.cos(angle) * radius,
          height + Math.sin(angle) * 0.15,
          Math.sin(angle) * radius
        ).add(randomOffset);
        
        nodes.push({
          position,
          activation: Math.random(),
          id: i
        });
      }
      
      layers.push({ nodes, connections });
    });
    
    // Generate inter-layer connections
    for (let layerIndex = 0; layerIndex < layers.length - 1; layerIndex++) {
      const currentLayer = layers[layerIndex];
      const nextLayer = layers[layerIndex + 1];
      
      currentLayer.nodes.forEach((startNode) => {
        // Connect to 2-3 nodes in next layer for better performance
        const connectionCount = 2 + Math.floor(Math.random() * 2);
        const usedTargets = new Set<number>();
        
        for (let j = 0; j < connectionCount; j++) {
          let targetNodeIndex;
          do {
            targetNodeIndex = Math.floor(Math.random() * nextLayer.nodes.length);
          } while (usedTargets.has(targetNodeIndex) && usedTargets.size < nextLayer.nodes.length);
          
          usedTargets.add(targetNodeIndex);
          const endNode = nextLayer.nodes[targetNodeIndex];
          
          currentLayer.connections.push({
            start: startNode.position.clone(),
            end: endNode.position.clone(),
            weight: Math.random() * 0.6 + 0.4
          });
        }
      });
    }
    
    setNeuralLayers(layers);
  }, []);

  // Mouse interaction effect
  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      setMousePosition({
        x: (event.clientX / window.innerWidth) * 2 - 1,
        y: -(event.clientY / window.innerHeight) * 2 + 1
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  useFrame((state) => {
    if (groupRef.current) {
      // Smooth rotation with mouse interaction
      const targetRotationY = mousePosition.x * 0.2 + Math.sin(state.clock.getElapsedTime() * 0.1) * 0.1;
      const targetRotationX = mousePosition.y * 0.1 + Math.sin(state.clock.getElapsedTime() * 0.08) * 0.05;
      
      groupRef.current.rotation.y += (targetRotationY - groupRef.current.rotation.y) * 0.05;
      groupRef.current.rotation.x += (targetRotationX - groupRef.current.rotation.x) * 0.05;
      
      // Gentle floating motion
      groupRef.current.position.y = Math.sin(state.clock.getElapsedTime() * 0.5) * 0.1;
    }
  });

  return (
    <group ref={groupRef}>
      {neuralLayers.map((layer, index) => (
        <NeuralLayer
          key={index}
          nodes={layer.nodes}
          connections={layer.connections}
          layerIndex={index}
          totalLayers={neuralLayers.length}
        />
      ))}
      
      {/* Floating particles for extra visual effect */}
      <Float speed={1} rotationIntensity={0.5} floatIntensity={0.5}>
        {Array.from({ length: 20 }).map((_, i) => (
          <Sphere
            key={i}
            args={[0.01]}
            position={[
              (Math.random() - 0.5) * 8,
              (Math.random() - 0.5) * 6,
              (Math.random() - 0.5) * 8
            ]}
          >
            <meshStandardMaterial
              color="#00ffff"
              emissive="#00ffff"
              emissiveIntensity={0.5}
              transparent
              opacity={0.3 + Math.random() * 0.4}
            />
          </Sphere>
        ))}
      </Float>
    </group>
  );
};

const NeuralNetwork3D: React.FC = () => {
  return (
    <div className="absolute inset-0 pointer-events-none">
      <Canvas
        camera={{ position: [0, 0, 8], fov: 60 }}
        style={{ background: 'transparent' }}
      >
        <ambientLight intensity={0.3} />
        <pointLight position={[10, 10, 10]} intensity={0.5} color="#00ffff" />
        <pointLight position={[-10, -10, -10]} intensity={0.3} color="#ff00ff" />
        
        <NeuralNetworkCore />
        
        {/* Floating particles for extra effect */}
        <Points limit={100}>
          <PointMaterial
            transparent
            color="#ffffff"
            size={0.02}
            sizeAttenuation
            opacity={0.6}
          />
        </Points>
      </Canvas>
    </div>
  );
};

export default NeuralNetwork3D;