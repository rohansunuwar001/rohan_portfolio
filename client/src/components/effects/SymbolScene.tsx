'use client';

import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

interface SymbolSceneProps {
  scrollProgress: number; // 0 to 1
}

export default function SymbolScene({ scrollProgress }: SymbolSceneProps) {
  const mountRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef(scrollProgress);

  useEffect(() => {
    progressRef.current = scrollProgress;
  }, [scrollProgress]);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth;
    const height = container.clientHeight;

    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x0a0a0c, 0.015);

    const camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 100);
    camera.position.z = 25;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    const glyphs = '0123456789$%#@*+?ABCDEF'.split('');
    const canvasTexture = createGlyphTexture(glyphs);

    const particleCount = 2000;
    const geometry = new THREE.BufferGeometry();

    const positions = new Float32Array(particleCount * 3);
    const spherePositions = new Float32Array(particleCount * 3);
    const cylinderPositions = new Float32Array(particleCount * 3);
    const planePositions = new Float32Array(particleCount * 3);
    const matrixPositions = new Float32Array(particleCount * 3);

    const colors = new Float32Array(particleCount * 3);
    const sizes = new Float32Array(particleCount);
    const customUVs = new Float32Array(particleCount * 2);

    const colorA = new THREE.Color('#38bdf8');
    const colorB = new THREE.Color('#f43f5e');

    for (let i = 0; i < particleCount; i++) {
      const i3 = i * 3;

      const mixedColor = colorA.clone().lerp(colorB, Math.random());
      colors[i3] = mixedColor.r;
      colors[i3 + 1] = mixedColor.g;
      colors[i3 + 2] = mixedColor.b;

      sizes[i] = Math.random() * 2 + 0.8;

      const glyphIndex = Math.floor(Math.random() * glyphs.length);
      customUVs[i * 2] = glyphIndex / glyphs.length;
      customUVs[i * 2 + 1] = 0.0;

      // SPHERE
      const u = Math.random();
      const v = Math.random();
      const theta = u * 2.0 * Math.PI;
      const phi = Math.acos(2.0 * v - 1.0);
      const r = 8 + Math.random() * 2;
      spherePositions[i3] = r * Math.sin(phi) * Math.cos(theta);
      spherePositions[i3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      spherePositions[i3 + 2] = r * THREE.MathUtils.randFloat(-2, 2) + r * Math.cos(phi);

      // CYLINDER
      const cyTheta = Math.random() * Math.PI * 2;
      const cyR = 6 + Math.random() * 1.5;
      cylinderPositions[i3] = cyR * Math.cos(cyTheta);
      cylinderPositions[i3 + 1] = (Math.random() - 0.5) * 35;
      cylinderPositions[i3 + 2] = cyR * Math.sin(cyTheta);

      // PLANE
      const rows = 40;
      const cols = 50;
      const col = i % cols;
      const row = Math.floor(i / cols);
      planePositions[i3] = (col - cols / 2) * 0.7;
      planePositions[i3 + 1] = (row - rows / 2) * 0.7;
      planePositions[i3 + 2] = Math.sin(col * 0.1) * Math.cos(row * 0.1) * 2;

      // MATRIX
      matrixPositions[i3] = (Math.random() - 0.5) * 45;
      matrixPositions[i3 + 1] = (Math.random() - 0.5) * 40;
      matrixPositions[i3 + 2] = (Math.random() - 0.5) * 30;

      positions[i3] = spherePositions[i3];
      positions[i3 + 1] = spherePositions[i3 + 1];
      positions[i3 + 2] = spherePositions[i3 + 2];
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));
    geometry.setAttribute('glyphUV', new THREE.BufferAttribute(customUVs, 2));

    const material = new THREE.ShaderMaterial({
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      uniforms: {
        uTexture: { value: canvasTexture },
        uGlyphCount: { value: glyphs.length },
        uTime: { value: 0.0 },
      },
      vertexShader: `
        uniform float uTime;
        attribute vec3 color;
        attribute float size;
        attribute vec2 glyphUV;
        varying vec3 vColor;
        varying vec2 vGlyphUV;
        void main() {
          vColor = color;
          vGlyphUV = glyphUV;
          vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
          gl_Position = projectionMatrix * mvPosition;
          gl_PointSize = size * (300.0 / -mvPosition.z);
        }
      `,
      fragmentShader: `
        uniform sampler2D uTexture;
        uniform float uGlyphCount;
        varying vec3 vColor;
        varying vec2 vGlyphUV;
        void main() {
          vec2 uv = gl_PointCoord;
          uv.x = (uv.x / uGlyphCount) + vGlyphUV.x;
          
          vec4 texColor = texture2D(uTexture, uv);
          if (texColor.a < 0.1) discard;
          
          gl_FragColor = vec4(vColor * texColor.rgb, texColor.a);
        }
      `,
    });

    const particles = new THREE.Points(geometry, material);
    scene.add(particles);

    const mouse = { x: 0, y: 0, targetX: 0, targetY: 0 };
    const handleMouseMove = (event: MouseEvent) => {
      mouse.targetX = (event.clientX / window.innerWidth) * 2 - 1;
      mouse.targetY = -(event.clientY / window.innerHeight) * 2 + 1;
    };
    window.addEventListener('mousemove', handleMouseMove);

    const startTime = Date.now();
    let animationFrameId: number;

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      const elapsedTime = (Date.now() - startTime) * 0.001;
      material.uniforms.uTime.value = elapsedTime;

      mouse.x += (mouse.targetX - mouse.x) * 0.05;
      mouse.y += (mouse.targetY - mouse.y) * 0.05;

      particles.rotation.y = elapsedTime * 0.05 + mouse.x * 0.15;
      particles.rotation.x = mouse.y * 0.15;

      const progress = progressRef.current;
      const posAttr = geometry.attributes.position as THREE.BufferAttribute;

      for (let i = 0; i < particleCount; i++) {
        const i3 = i * 3;
        let tx = 0, ty = 0, tz = 0;

        if (progress < 0.33) {
          const p = progress / 0.33;
          tx = THREE.MathUtils.lerp(spherePositions[i3], cylinderPositions[i3], p);
          ty = THREE.MathUtils.lerp(spherePositions[i3 + 1], cylinderPositions[i3 + 1], p);
          tz = THREE.MathUtils.lerp(spherePositions[i3 + 2], cylinderPositions[i3 + 2], p);
        } else if (progress < 0.66) {
          const p = (progress - 0.33) / 0.33;
          tx = THREE.MathUtils.lerp(cylinderPositions[i3], planePositions[i3], p);
          ty = THREE.MathUtils.lerp(cylinderPositions[i3 + 1], planePositions[i3 + 1], p);
          tz = THREE.MathUtils.lerp(cylinderPositions[i3 + 2], planePositions[i3 + 2], p);
        } else {
          const p = (progress - 0.66) / 0.34;
          tx = THREE.MathUtils.lerp(planePositions[i3], matrixPositions[i3], p);
          ty = THREE.MathUtils.lerp(planePositions[i3 + 1], matrixPositions[i3 + 1] - (elapsedTime * 8 % 40) + 20, p);
          tz = THREE.MathUtils.lerp(planePositions[i3 + 2], matrixPositions[i3 + 2], p);
        }

        posAttr.setXYZ(i, tx, ty, tz);
      }

      posAttr.needsUpdate = true;
      renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
      renderer.dispose();
      geometry.dispose();
      material.dispose();
      canvasTexture.dispose();
      container.removeChild(renderer.domElement);
    };
  }, []);

  return <div ref={mountRef} className="fixed inset-0 -z-10 h-screen w-full overflow-hidden bg-[#050507]" />;
}

function createGlyphTexture(glyphs: string[]): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  const size = 128;
  canvas.width = size * glyphs.length;
  canvas.height = size;

  const ctx = canvas.getContext('2d');
  if (ctx) {
    ctx.fillStyle = '#00000000';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.font = 'bold 96px Courier New, monospace';
    ctx.fillStyle = '#ffffff';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    glyphs.forEach((char, index) => {
      ctx.fillText(char, index * size + size / 2, size / 2);
    });
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.minFilter = THREE.LinearFilter;
  texture.magFilter = THREE.LinearFilter;
  return texture;
}
