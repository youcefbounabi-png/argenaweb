import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { MathUtils, Vector2, Color } from 'three';

// Vertex shader creates the "liquid" distortion using sine waves based on the cursor position
const vertexShader = `
  uniform float uTime;
  uniform vec2 uMouse;
  uniform float uHover;
  
  varying vec2 vUv;
  varying float vElevation;

  void main() {
    vUv = uv;
    
    // Base position
    vec3 pos = position;
    
    // Create liquid waves
    float elevation = sin(pos.x * 2.0 + uTime) * 0.1 
                    + sin(pos.y * 1.5 + uTime * 0.8) * 0.1;
                    
    // Mouse reaction
    float dist = distance(uv, uMouse);
    float influence = smoothstep(0.4, 0.0, dist) * uHover;
    elevation += influence * 0.5 * sin(dist * 10.0 - uTime * 5.0);
    
    pos.z += elevation;
    vElevation = elevation;
    
    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
  }
`;

// Fragment shader handles the "Argana" dark/silver color blending
const fragmentShader = `
  uniform float uTime;
  uniform vec3 uColor1; // Dark (#050505)
  uniform vec3 uColor2; // Silver (#888888)
  
  varying vec2 vUv;
  varying float vElevation;

  void main() {
    vec3 color = mix(uColor1, uColor2, vElevation * 2.5 + 0.2);
    
    // Add subtle shimmering
    float shimmer = sin(vUv.x * 20.0 + uTime) * sin(vUv.y * 20.0 + uTime) * 0.05;
    color += shimmer;
    
    gl_FragColor = vec4(color, 1.0);
  }
`;

const LiquidPlane = ({ mousePosition }: { mousePosition: React.MutableRefObject<Vector2> }) => {
    const meshRef = useRef<any>(null);
    const materialRef = useRef<any>(null);

    const uniforms = useMemo(() => ({
        uTime: { value: 0 },
        uMouse: { value: new Vector2(0.5, 0.5) },
        uHover: { value: 0 },
        uColor1: { value: new Color('#050505') }, // Argana Background
        uColor2: { value: new Color('#222222') }  // Silver/Dark grey for depth
    }), []);

    useFrame((state) => {
        if (materialRef.current) {
            materialRef.current.uniforms.uTime.value = state.clock.elapsedTime * 0.5;

            // Smoothly interpolate mouse position for fluid feel
            materialRef.current.uniforms.uMouse.value.lerp(mousePosition.current, 0.05);

            // Gradually increase hover influence when moving
            materialRef.current.uniforms.uHover.value = MathUtils.lerp(
                materialRef.current.uniforms.uHover.value,
                1.0,
                0.02
            );
        }
    });

    return (
        <mesh ref={meshRef}>
            <planeGeometry args={[10, 10, 128, 128]} />
            <shaderMaterial
                ref={materialRef}
                vertexShader={vertexShader}
                fragmentShader={fragmentShader}
                uniforms={uniforms}
                wireframe={false}
            />
        </mesh>
    );
};

export const LiquidBackground = () => {
    const mouseRef = useRef(new Vector2(0.5, 0.5));

    const handlePointerMove = (e: React.PointerEvent) => {
        // Normalize coordinates to 0-1 for the shader
        mouseRef.current.x = e.clientX / window.innerWidth;
        mouseRef.current.y = 1.0 - (e.clientY / window.innerHeight);
    };

    return (
        <div
            className="fixed inset-0 z-0 pointer-events-none"
            onPointerMove={handlePointerMove}
        >
            <Canvas camera={{ position: [0, 0, 1.5] }}>
                <LiquidPlane mousePosition={mouseRef} />
            </Canvas>
        </div>
    );
};
