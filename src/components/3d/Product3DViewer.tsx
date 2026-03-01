import { useRef, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Environment, ContactShadows, PresentationControls, useGLTF } from '@react-three/drei';
import * as THREE from 'three';

// ─── Real GLB model (Boston cap) ──────────────────────────────────────────────

const CapModel = ({ modelPath }: { modelPath: string }) => {
    const { scene } = useGLTF(modelPath);

    // Apply studio-grade metallic material to all meshes
    scene.traverse((child) => {
        if ((child as THREE.Mesh).isMesh) {
            const mesh = child as THREE.Mesh;
            mesh.castShadow = true;
            mesh.receiveShadow = true;
            if (mesh.material) {
                (mesh.material as THREE.MeshStandardMaterial).envMapIntensity = 1.8;
            }
        }
    });

    return <primitive object={scene} />;
};

// ─── Placeholder box (for products without a GLB) ────────────────────────────

const ProductBox = () => {
    const meshRef = useRef<THREE.Mesh>(null);

    useFrame((_, delta) => {
        if (meshRef.current) {
            meshRef.current.rotation.y += delta * 0.25;
        }
    });

    return (
        <mesh ref={meshRef} castShadow>
            <boxGeometry args={[1.8, 0.9, 1.8]} />
            <meshStandardMaterial
                color="#111111"
                metalness={0.85}
                roughness={0.2}
                envMapIntensity={1.5}
            />
        </mesh>
    );
};

// ─── Main viewer ──────────────────────────────────────────────────────────────

interface Product3DViewerProps {
    /** Path to a .glb model in /public. If undefined, shows the placeholder box. */
    modelPath?: string;
    className?: string;
}

export const Product3DViewer = ({ modelPath, className = 'w-full h-full' }: Product3DViewerProps) => {
    return (
        <div className={className}>
            <Canvas
                camera={{ position: [0, 1.2, 3.5], fov: 42 }}
                gl={{ antialias: true, alpha: true }}
                shadows
            >
                <ambientLight intensity={0.3} />
                <directionalLight
                    position={[3, 6, 4]}
                    intensity={2.5}
                    castShadow
                    shadow-mapSize={[1024, 1024]}
                />
                <spotLight
                    position={[-4, 6, -4]}
                    intensity={1.5}
                    color="#ffffff"
                    penumbra={0.8}
                />

                <Suspense fallback={null}>
                    <PresentationControls
                        global
                        speed={1.2}
                        zoom={0.9}
                        rotation={[0, -Math.PI / 6, 0]}
                        polar={[-Math.PI / 6, Math.PI / 6]}
                        azimuth={[-Math.PI / 2, Math.PI / 2]}
                    >
                        {modelPath ? (
                            <CapModel modelPath={modelPath} />
                        ) : (
                            <ProductBox />
                        )}
                    </PresentationControls>
                    <Environment preset="studio" />
                </Suspense>

                <ContactShadows
                    position={[0, -0.46, 0]}
                    opacity={0.5}
                    scale={5}
                    blur={1.5}
                    far={2}
                />
            </Canvas>
        </div>
    );
};

// Pre-warm GLB cache so models load instantly when the modal opens
useGLTF.preload('/3dboston.glb');
useGLTF.preload('/3djustbecause.glb');
useGLTF.preload('/3dairforce.glb');

export default Product3DViewer;
