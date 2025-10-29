import React, { useEffect, useState, useRef, useCallback, useMemo } from 'react';
import './App.css';
import { FaJava } from 'react-icons/fa'; // For Java icon

// --- Import Your New Components ---
// All component logic is merged into this file to solve build errors.
// import AnimatedList from './components/AnimatedList.jsx'; 
// import LetterGlitch from './components/LetterGlitch.jsx';
// import FaultyTerminal from './components/FaultyTerminal.jsx'; 
// import LogoLoop from './components/LogoLoop.jsx';
// import DecryptedText from './components/DecryptedText.jsx'; 
import ClickSpark from './components/ClickSpark.jsx'; 

// --- Import icons for the LogoLoop demo ---
import {
  SiReact,
  SiPython,
  SiMysql,
  SiGit,
  SiGnubash 
} from 'react-icons/si';

// --- Import Component Libraries ---
import { motion, useInView } from 'framer-motion';
import { Renderer, Program, Mesh, Color, Triangle } from 'ogl';


// =====================================================================
// Custom Styles (Used by Merged Components)
// =====================================================================

const styles = {
  // Styles for DecryptedText component
  srOnly: {
    position: 'absolute',
    width: '1px',
    height: '1px',
    padding: 0,
    margin: '-1px',
    overflow: 'hidden',
    clip: 'rect(0,0,0,0)',
    border: 0
  },
  wrapper: {
    display: 'inline-block',
    whiteSpace: 'pre-wrap'
  }
};

// =====================================================================
// UTILITY/SHADERS (For FaultyTerminal)
// =====================================================================

const vertexShader = `
attribute vec2 position;
attribute vec2 uv;
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = vec4(position, 0.0, 1.0);
}
`;

const fragmentShader = `
precision mediump float;
varying vec2 vUv;
uniform float iTime;
uniform vec3  iResolution;
uniform float uScale;
uniform vec2  uGridMul;
uniform float uDigitSize;
uniform float uScanlineIntensity;
uniform float uGlitchAmount;
uniform float uFlickerAmount;
uniform float uNoiseAmp;
uniform float uChromaticAberration;
uniform float uDither;
uniform float uCurvature;
uniform vec3  uTint;
uniform vec2  uMouse;
uniform float uMouseStrength;
uniform float uUseMouse;
uniform float uPageLoadProgress;
uniform float uUsePageLoadAnimation;
uniform float uBrightness;
float time;
float hash21(vec2 p){
  p = fract(p * 234.56);
  p += dot(p, p + 34.56);
  return fract(p.x * p.y);
}
float noise(vec2 p)
{
  return sin(p.x * 10.0) * sin(p.y * (3.0 + sin(time * 0.090909))) + 0.2; 
}
mat2 rotate(float angle)
{
  float c = cos(angle);
  float s = sin(angle);
  return mat2(c, -s, s, c);
}
float fbm(vec2 p)
{
  p *= 1.1;
  float f = 0.0;
  float amp = 0.5 * uNoiseAmp;
  
  mat2 modify0 = rotate(time * 0.02);
  f += amp * noise(p);
  p = modify0 * p * 2.0;
  amp *= 0.454545;
  
  mat2 modify1 = rotate(time * 0.02);
  f += amp * noise(p);
  p = modify1 * p * 2.0;
  amp *= 0.454545;
  
  mat2 modify2 = rotate(time * 0.08);
  f += amp * noise(p);
  
  return f;
}
float pattern(vec2 p, out vec2 q, out vec2 r) {
  vec2 offset1 = vec2(1.0);
  vec2 offset0 = vec2(0.0);
  mat2 rot01 = rotate(0.1 * time);
  mat2 rot1 = rotate(0.1);
  
  q = vec2(fbm(p + offset1), fbm(rot01 * p + offset1));
  r = vec2(fbm(rot1 * q + offset0), fbm(q + offset0));
  return fbm(p + r);
}
float digit(vec2 p){
    vec2 grid = uGridMul * 15.0;
    vec2 s = floor(p * grid) / grid;
    p = p * grid;
    vec2 q, r;
    float intensity = pattern(s * 0.1, q, r) * 1.3 - 0.03;
    
    if(uUseMouse > 0.5){
        vec2 mouseWorld = uMouse * uScale;
        float distToMouse = distance(s, mouseWorld);
        float mouseInfluence = exp(-distToMouse * 8.0) * uMouseStrength * 10.0;
        intensity += mouseInfluence;
        
        float ripple = sin(distToMouse * 20.0 - iTime * 5.0) * 0.1 * mouseInfluence;
        intensity += ripple;
    }
    
    if(uUsePageLoadAnimation > 0.5){
        float cellRandom = fract(sin(dot(s, vec2(12.9898, 78.233))) * 43758.5453);
        float cellDelay = cellRandom * 0.8;
        float cellProgress = clamp((uPageLoadProgress - cellDelay) / 0.2, 0.0, 1.0);
        
        float fadeAlpha = smoothstep(0.0, 1.0, cellProgress);
        intensity *= fadeAlpha;
    }
    
    p = fract(p);
    p *= uDigitSize;
    
    float px5 = p.x * 5.0;
    float py5 = (1.0 - p.y) * 5.0;
    float x = fract(px5);
    float y = fract(py5);
    
    float i = floor(py5) - 2.0;
    float j = floor(px5) - 2.0;
    float n = i * i + j * j;
    float f = n * 0.0625;
    
    float isOn = step(0.1, intensity - f);
    float brightness = isOn * (0.2 + y * 0.8) * (0.75 + x * 0.25);
    
    return step(0.0, p.x) * step(p.x, 1.0) * step(0.0, p.y) * step(p.y, 1.0) * brightness;
}
float onOff(float a, float b, float c)
{
  return step(c, sin(iTime + a * cos(iTime * b))) * uFlickerAmount;
}
float displace(vec2 look)
{
    float y = look.y - mod(iTime * 0.25, 1.0);
    float window = 1.0 / (1.0 + 50.0 * y * y);
    return sin(look.y * 20.0 + iTime) * 0.0125 * onOff(4.0, 2.0, 0.8) * (1.0 + cos(iTime * 60.0)) * window;
}
vec3 getColor(vec2 p){
    
    float bar = step(mod(p.y + time * 20.0, 1.0), 0.2) * 0.4 + 1.0;
    bar *= uScanlineIntensity;
    
    float displacement = displace(p);
    p.x += displacement;

    if (uGlitchAmount != 1.0) {
      float extra = displacement * (uGlitchAmount - 1.0);
      p.x += extra;
    }

    float middle = digit(p);
    
    const float off = 0.002;
    float sum = digit(p + vec2(-off, -off)) + digit(p + vec2(0.0, -off)) + digit(p + vec2(off, -off)) +
                digit(p + vec2(-off, 0.0)) + digit(p + vec2(0.0, 0.0)) + digit(p + vec2(off, 0.0)) +
                digit(p + vec2(-off, off)) + digit(p + vec2(0.0, off)) + digit(p + vec2(off, off));
    
    vec3 baseColor = vec3(0.9) * middle + sum * 0.1 * vec3(1.0) * bar;
    return baseColor;
}
vec2 barrel(vec2 uv){
  vec2 c = uv * 2.0 - 1.0;
  float r2 = dot(c, c);
  c *= 1.0 + uCurvature * r2;
  return c * 0.5 + 0.5;
}
void main() {
    time = iTime * 0.333333;
    vec2 uv = vUv;

    if(uCurvature != 0.0){
      uv = barrel(uv);
    }
    
    vec2 p = uv * uScale;
    vec3 col = getColor(p);

    if(uChromaticAberration != 0.0){
      vec2 ca = vec2(uChromaticAberration) / iResolution.xy;
      col.r = getColor(p + ca).r;
      col.b = getColor(p - ca).b;
    }

    col *= uTint;
    col *= uBrightness;

    if(uDither > 0.0){
      float rnd = hash21(gl_FragCoord.xy);
      col += (rnd - 0.5) * (uDither * 0.003922);
    }

    gl_FragColor = vec4(col, 1.0);
}
`;

function hexToRgb(hex) {
  let h = hex.replace('#', '').trim();
  if (h.length === 3)
    h = h
      .split('')
      .map(c => c + c)
      .join('');
  const num = parseInt(h, 16);
  return [((num >> 16) & 255) / 255, ((num >> 8) & 255) / 255, (num & 255) / 255];
}

// =====================================================================
// COMPONENT 1: FaultyTerminal (WebGL Canvas)
// =====================================================================

function FaultyTerminal({
  scale = 1,
  gridMul = [2, 1],
  digitSize = 1.5,
  timeScale = 0.3,
  pause = false,
  scanlineIntensity = 0.3,
  glitchAmount = 1,
  flickerAmount = 1,
  noiseAmp = 0,
  chromaticAberration = 0,
  dither = 0,
  curvature = 0.2,
  tint = '#ffffff',
  mouseReact = true,
  mouseStrength = 0.2,
  dpr = Math.min(window.devicePixelRatio || 1, 2),
  pageLoadAnimation = true,
  brightness = 1,
  className,
  style,
  ...rest
}) {
  const containerRef = useRef(null);
  const programRef = useRef(null);
  const rendererRef = useRef(null);
  const mouseRef = useRef({ x: 0.5, y: 0.5 });
  const smoothMouseRef = useRef({ x: 0.5, y: 0.5 });
  const frozenTimeRef = useRef(0);
  const rafRef = useRef(0);
  const loadAnimationStartRef = useRef(0);
  const timeOffsetRef = useRef(Math.random() * 100);

  const tintVec = useMemo(() => hexToRgb(tint), [tint]);

  const ditherValue = useMemo(() => (typeof dither === 'boolean' ? (dither ? 1 : 0) : dither), [dither]);

  const handleMouseMove = useCallback(e => {
    const ctn = containerRef.current;
    if (!ctn) return;
    const rect = ctn.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = 1 - (e.clientY - rect.top) / rect.height;
    mouseRef.current = { x, y };
  }, []);

  useEffect(() => {
    const ctn = containerRef.current;
    if (!ctn) return;

    // --- PERFORMANCE OPTIMIZATION ---
    // Force DPR to 1.0 to reduce GPU load, especially on high-res (Retina) screens.
    const renderer = new Renderer({ dpr: Math.min(dpr, 1.0) });
    // --------------------------------

    rendererRef.current = renderer;
    const gl = renderer.gl;
    gl.clearColor(0, 0, 0, 1);

    const geometry = new Triangle(gl);

    const program = new Program(gl, {
      vertex: vertexShader,
      fragment: fragmentShader,
      uniforms: {
        iTime: { value: 0 },
        iResolution: {
          value: new Color(gl.canvas.width, gl.canvas.height, gl.canvas.width / gl.canvas.height)
        },
        uScale: { value: scale },
        uGridMul: { value: new Float32Array(gridMul) },
        uDigitSize: { value: digitSize },
        uScanlineIntensity: { value: scanlineIntensity },
        uGlitchAmount: { value: glitchAmount },
        uFlickerAmount: { value: flickerAmount },
        uNoiseAmp: { value: noiseAmp },
        uChromaticAberration: { value: chromaticAberration },
        uDither: { value: ditherValue },
        uCurvature: { value: curvature },
        uTint: { value: new Color(tintVec[0], tintVec[1], tintVec[2]) },
        uMouse: {
          value: new Float32Array([smoothMouseRef.current.x, smoothMouseRef.current.y])
        },
        uMouseStrength: { value: mouseStrength },
        uUseMouse: { value: mouseReact ? 1 : 0 },
        uPageLoadProgress: { value: pageLoadAnimation ? 0 : 1 },
        uUsePageLoadAnimation: { value: pageLoadAnimation ? 1 : 0 },
        uBrightness: { value: brightness }
      }
    });
    programRef.current = program;

    const mesh = new Mesh(gl, { geometry, program });

    function resize() {
      if (!ctn || !renderer) return;
      renderer.setSize(ctn.offsetWidth, ctn.offsetHeight);
      program.uniforms.iResolution.value = new Color(
        gl.canvas.width,
        gl.canvas.height,
        gl.canvas.width / gl.canvas.height
      );
    }

    const resizeObserver = new ResizeObserver(() => resize());
    resizeObserver.observe(ctn);
    resize();

    const update = t => {
      rafRef.current = requestAnimationFrame(update);

      if (pageLoadAnimation && loadAnimationStartRef.current === 0) {
        loadAnimationStartRef.current = t;
      }

      if (!pause) {
        const elapsed = (t * 0.001 + timeOffsetRef.current) * timeScale;
        program.uniforms.iTime.value = elapsed;
        frozenTimeRef.current = elapsed;
      } else {
        program.uniforms.iTime.value = frozenTimeRef.current;
      }

      if (pageLoadAnimation && loadAnimationStartRef.current > 0) {
        const animationDuration = 2000;
        const animationElapsed = t - loadAnimationStartRef.current;
        const progress = Math.min(animationElapsed / animationDuration, 1);
        program.uniforms.uPageLoadProgress.value = progress;
      }

      if (mouseReact) {
        const dampingFactor = 0.08;
        const smoothMouse = smoothMouseRef.current;
        const mouse = mouseRef.current;
        smoothMouse.x += (mouse.x - smoothMouse.x) * dampingFactor;
        smoothMouse.y += (mouse.y - smoothMouse.y) * dampingFactor;

        const mouseUniform = program.uniforms.uMouse.value;
        mouseUniform[0] = smoothMouse.x;
        mouseUniform[1] = smoothMouse.y;
      }

      renderer.render({ scene: mesh });
    };
    rafRef.current = requestAnimationFrame(update);
    ctn.appendChild(gl.canvas);

    if (mouseReact) ctn.addEventListener('mousemove', handleMouseMove);

    return () => {
      cancelAnimationFrame(rafRef.current);
      resizeObserver.disconnect();
      if (mouseReact) ctn.removeEventListener('mousemove', handleMouseMove);
      if (gl.canvas && gl.canvas.parentElement === ctn) ctn.removeChild(gl.canvas);
      gl.getExtension('WEBGL_lose_context')?.loseContext();
      loadAnimationStartRef.current = 0;
      timeOffsetRef.current = Math.random() * 100;
    };
  }, [
    dpr,
    pause,
    timeScale,
    scale,
    gridMul,
    digitSize,
    scanlineIntensity,
    glitchAmount,
    flickerAmount,
    noiseAmp,
    chromaticAberration,
    ditherValue,
    curvature,
    tintVec,
    mouseReact,
    mouseStrength,
    pageLoadAnimation,
    brightness,
    handleMouseMove
  ]);

  return <div ref={containerRef} className={`faulty-terminal-container ${className}`} style={style} {...rest} />;
}

// =====================================================================
// COMPONENT 2: LetterGlitch (Canvas Background)
// =====================================================================

const LetterGlitch = ({
  glitchColors = ['#00FF00', '#009900', '#33FF33'], // Green variations
  className = '',
  glitchSpeed = 50,
  centerVignette = false,
  outerVignette = true,
  smooth = true,
  characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ!@#$&*()-_+=/[]{};:<>.,0123456789'
}) => {
  const canvasRef = useRef(null);
  const animationRef = useRef(null);
  const letters = useRef([]);
  const grid = useRef({ columns: 0, rows: 0 });
  const context = useRef(null);
  const lastGlitchTime = useRef(Date.now());

  const lettersAndSymbols = useMemo(() => Array.from(characters), [characters]);

  const fontSize = 16;
  const charWidth = 10;
  const charHeight = 20;

  const getRandomChar = useCallback(() => {
    return lettersAndSymbols[Math.floor(Math.random() * lettersAndSymbols.length)];
  }, [lettersAndSymbols]);

  const getRandomColor = useCallback(() => {
    return glitchColors[Math.floor(Math.random() * glitchColors.length)];
  }, [glitchColors]);

  const hexToRgb = useCallback(hex => {
    const shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
    hex = hex.replace(shorthandRegex, (m, r, g, b) => {
      return r + r + g + g + b + b;
    });

    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result
      ? {
          r: parseInt(result[1], 16),
          g: parseInt(result[2], 16),
          b: parseInt(result[3], 16)
        }
      : null;
  }, []);

  const interpolateColor = useCallback((start, end, factor) => {
    const result = {
      r: Math.round(start.r + (end.r - start.r) * factor),
      g: Math.round(start.g + (end.g - start.g) * factor),
      b: Math.round(start.b + (end.b - start.b) * factor)
    };
    return `rgb(${result.r}, ${result.g}, ${result.b})`;
  }, []);

  const calculateGrid = useCallback((width, height) => {
    const columns = Math.ceil(width / charWidth);
    const rows = Math.ceil(height / charHeight);
    return { columns, rows };
  }, []);

  const initializeLetters = useCallback((columns, rows) => {
    grid.current = { columns, rows };
    const totalLetters = columns * rows;
    letters.current = Array.from({ length: totalLetters }, () => ({
      char: getRandomChar(),
      color: getRandomColor(),
      targetColor: getRandomColor(),
      colorProgress: 1
    }));
  }, [getRandomChar, getRandomColor]);

  const drawLetters = useCallback(() => {
    if (!context.current || letters.current.length === 0) return;
    const ctx = context.current;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const { width, height } = canvas.getBoundingClientRect();
    
    ctx.clearRect(0, 0, width, height);
    ctx.font = `${fontSize}px ${'Monofonto, monospace'}`; // Using Monofonto directly
    ctx.textBaseline = 'top';

    letters.current.forEach((letter, index) => {
      const x = (index % grid.current.columns) * charWidth;
      const y = Math.floor(index / grid.current.columns) * charHeight;
      ctx.fillStyle = letter.color;
      ctx.fillText(letter.char, x, y);
    });
  }, []);

  const resizeCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const parent = canvas.parentElement;
    if (!parent) return;

    const dpr = window.devicePixelRatio || 1;
    const rect = parent.getBoundingClientRect();

    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;

    canvas.style.width = `${rect.width}px`;
    canvas.style.height = `${rect.height}px`;

    if (context.current) {
      context.current.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    const { columns, rows } = calculateGrid(rect.width, rect.height);
    initializeLetters(columns, rows);

    drawLetters();
  }, [calculateGrid, initializeLetters, drawLetters]);

  const updateLetters = useCallback(() => {
    if (!letters.current || letters.current.length === 0) return;

    const updateCount = Math.max(1, Math.floor(letters.current.length * 0.05));

    for (let i = 0; i < updateCount; i++) {
      const index = Math.floor(Math.random() * letters.current.length);
      if (!letters.current[index]) continue;

      letters.current[index].char = getRandomChar();
      letters.current[index].targetColor = getRandomColor();

      if (!smooth) {
        letters.current[index].color = letters.current[index].targetColor;
        letters.current[index].colorProgress = 1;
      } else {
        letters.current[index].colorProgress = 0;
      }
    }
  }, [getRandomChar, getRandomColor, smooth]);

  const handleSmoothTransitions = useCallback(() => {
    let needsRedraw = false;
    letters.current.forEach(letter => {
      if (letter.colorProgress < 1) {
        letter.colorProgress += 0.05;
        if (letter.colorProgress > 1) letter.colorProgress = 1;

        const startRgb = hexToRgb(letter.color);
        const endRgb = hexToRgb(letter.targetColor);
        if (startRgb && endRgb) {
          letter.color = interpolateColor(startRgb, endRgb, letter.colorProgress);
          needsRedraw = true;
        }
      }
    });

    if (needsRedraw) {
      drawLetters();
    }
  }, [drawLetters, hexToRgb, interpolateColor]);

  const animate = useCallback(() => {
    const now = Date.now();
    if (now - lastGlitchTime.current >= glitchSpeed) {
      updateLetters();
      drawLetters();
      lastGlitchTime.current = now;
    }

    if (smooth) {
      handleSmoothTransitions();
    }

    animationRef.current = requestAnimationFrame(animate);
  }, [glitchSpeed, updateLetters, drawLetters, smooth, handleSmoothTransitions]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    context.current = canvas.getContext('2d');
    resizeCanvas();
    animate();

    let resizeTimeout;

    const handleResize = () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        cancelAnimationFrame(animationRef.current);
        resizeCanvas();
        animate();
      }, 100);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationRef.current);
      window.removeEventListener('resize', handleResize);
    };
  }, [animate, resizeCanvas]);

  const containerStyle = {
    position: 'relative',
    width: '100%',
    height: '100%',
    backgroundColor: '#000000',
    overflow: 'hidden'
  };

  const canvasStyle = {
    display: 'block',
    width: '100%',
    height: '100%'
  };

  const outerVignetteStyle = {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    pointerEvents: 'none',
    background: 'radial-gradient(circle, rgba(0,0,0,0) 60%, rgba(0,0,0,1) 100%)'
  };

  const centerVignetteStyle = {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    pointerEvents: 'none',
    background: 'radial-gradient(circle, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0) 60%)'
  };

  return (
    <div style={containerStyle} className={className}>
      <canvas ref={canvasRef} style={canvasStyle} />
      {outerVignette && <div style={outerVignetteStyle}></div>}
      {centerVignette && <div style={centerVignetteStyle}></div>}
    </div>
  );
};

// =====================================================================
// COMPONENT 3: DecryptedText (Interactive Text Effect)
// =====================================================================

function DecryptedText({
  text,
  speed = 10, 
  maxIterations = 5, 
  sequential = true,
  revealDirection = 'center',
  useOriginalCharsOnly = false,
  characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz!@#$%^&*()_+',
  className = '',
  parentClassName = '',
  encryptedClassName = '',
  animateOn = 'view',
  ...props
}) {
  const [displayText, setDisplayText] = useState(text);
  const [isHovering, setIsHovering] = useState(false);
  const [isScrambling, setIsScrambling] = useState(false);
  const [revealedIndices, setRevealedIndices] = useState(new Set());
  const [hasAnimated, setHasAnimated] = useState(false);
  const containerRef = useRef(null);

  const availableChars = useMemo(() => {
    return useOriginalCharsOnly
      ? Array.from(new Set(text.split(''))).filter(char => char !== ' ')
      : characters.split('');
  }, [characters, text, useOriginalCharsOnly]);

  const getNextIndex = useCallback((revealedSet) => {
    const textLength = text.length;
    switch (revealDirection) {
      case 'start':
        return revealedSet.size;
      case 'end':
        return textLength - 1 - revealedSet.size;
      case 'center': {
        const middle = Math.floor(textLength / 2);
        const offset = Math.floor(revealedSet.size / 2);
        const nextIndex = revealedSet.size % 2 === 0 ? middle + offset : middle - offset - 1;

        if (nextIndex >= 0 && nextIndex < textLength && !revealedSet.has(nextIndex)) {
          return nextIndex;
        }

        for (let i = 0; i < textLength; i++) {
          if (!revealedSet.has(i)) return i;
        }
        return 0;
      }
      default:
        return revealedSet.size;
    }
  }, [text.length, revealDirection]);

  const shuffleText = useCallback((originalText, currentRevealed) => {
    return originalText
      .split('')
      .map((char, i) => {
        if (char === ' ') return ' ';
        if (currentRevealed.has(i)) return originalText[i];
        return availableChars[Math.floor(Math.random() * availableChars.length)];
      })
      .join('');
  }, [availableChars]);

  useEffect(() => {
    let interval;
    let currentIteration = 0;

    const startDecryption = () => {
        setIsScrambling(true);
        interval = setInterval(() => {
            setRevealedIndices(prevRevealed => {
                let newRevealed = new Set(prevRevealed);

                if (sequential) {
                    if (newRevealed.size < text.length) {
                        const nextIndex = getNextIndex(newRevealed);
                        newRevealed.add(nextIndex);
                        setDisplayText(shuffleText(text, newRevealed));
                        return newRevealed;
                    } else {
                        clearInterval(interval);
                        setIsScrambling(false);
                        return prevRevealed;
                    }
                } else {
                    setDisplayText(shuffleText(text, newRevealed));
                    currentIteration++;
                    if (currentIteration >= maxIterations) {
                        clearInterval(interval);
                        setIsScrambling(false);
                        setDisplayText(text);
                    }
                    return prevRevealed;
                }
            });
        }, speed);
    };

    if (isHovering && !isScrambling) {
        startDecryption();
    } else if (!isHovering && hasAnimated && animateOn === 'view') {
        // Keep revealed
    } else if (!isHovering && !hasAnimated) {
        setDisplayText(text);
        setRevealedIndices(new Set());
        setIsScrambling(false);
    }
    
    return () => {
        if (interval) clearInterval(interval);
    };

  }, [isHovering, text, speed, maxIterations, sequential, revealDirection, shuffleText, getNextIndex, isScrambling, hasAnimated, animateOn]);

  useEffect(() => {
    if (animateOn !== 'view' && animateOn !== 'both') return;

    const observerCallback = entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !hasAnimated) {
          setIsHovering(true); 
          setHasAnimated(true);
        }
      });
    };

    const observerOptions = {
      root: null,
      rootMargin: '0px',
      threshold: 0.1
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);
    const currentRef = containerRef.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, [animateOn, hasAnimated]);
  
  const hoverProps =
    animateOn === 'hover' || animateOn === 'both'
      ? {
          onMouseEnter: () => setIsHovering(true),
          onMouseLeave: () => {
             if (!hasAnimated) setIsHovering(false);
          }
        }
      : {};

  const currentTextToDisplay = isHovering || hasAnimated ? displayText : text;
  
  return (
    <motion.span className={parentClassName} ref={containerRef} style={styles.wrapper} {...hoverProps} {...props}>
      <span style={styles.srOnly}>{text}</span>

      <span aria-hidden="true">
        {currentTextToDisplay.split('').map((char, index) => {
          const isRevealedOrDone = revealedIndices.has(index) || !isScrambling || !isHovering;

          return (
            <span key={index} className={isRevealedOrDone ? className : encryptedClassName}>
              {char}
            </span>
          );
        })}
      </span>
    </motion.span>
  );
}

// =====================================================================
// COMPONENT 4: AnimatedList (Container for Achievements)
// =====================================================================

const AnimatedItem = ({ children, delay = 0, index, onMouseEnter, onClick }) => {
  const ref = useRef(null);
  const inView = useInView(ref, { amount: 0.5, triggerOnce: false });
  return (
    <motion.div
      ref={ref}
      data-index={index}
      onMouseEnter={onMouseEnter}
      onClick={onClick}
      initial={{ scale: 0.7, opacity: 0 }}
      animate={inView ? { scale: 1, opacity: 1 } : { scale: 0.7, opacity: 0 }}
      transition={{ duration: 0.2, delay }}
      style={{ marginBottom: '1rem', cursor: 'pointer' }}
    >
      {children}
    </motion.div>
  );
};

const AnimatedList = ({
  items = [],
  onItemSelect,
  showGradients = true,
  enableArrowNavigation = true,
  className = '',
  itemClassName = '',
  displayScrollbar = true,
  initialSelectedIndex = -1
}) => {
  const listRef = useRef(null);
  const [selectedIndex, setSelectedIndex] = useState(initialSelectedIndex);
  const [keyboardNav, setKeyboardNav] = useState(false);
  const [topGradientOpacity, setTopGradientOpacity] = useState(0);
  const [bottomGradientOpacity, setBottomGradientOpacity] = useState(1);

  const handleScroll = e => {
    const { scrollTop, scrollHeight, clientHeight } = e.target;
    setTopGradientOpacity(Math.min(scrollTop / 50, 1));
    const bottomDistance = scrollHeight - (scrollTop + clientHeight);
    setBottomGradientOpacity(scrollHeight <= clientHeight ? 0 : Math.min(bottomDistance / 50, 1));
  };

  useEffect(() => {
    if (!enableArrowNavigation) return;
    const handleKeyDown = e => {
      if (e.key === 'ArrowDown' || (e.key === 'Tab' && !e.shiftKey)) {
        e.preventDefault();
        setKeyboardNav(true);
        setSelectedIndex(prev => Math.min(prev + 1, items.length - 1));
      } else if (e.key === 'ArrowUp' || (e.key === 'Tab' && e.shiftKey)) {
        e.preventDefault();
        setKeyboardNav(true);
        setSelectedIndex(prev => Math.max(prev - 1, 0));
      } else if (e.key === 'Enter') {
        if (selectedIndex >= 0 && selectedIndex < items.length) {
          e.preventDefault();
          if (onItemSelect) {
            onItemSelect(items[selectedIndex], selectedIndex);
          }
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [items, selectedIndex, onItemSelect, enableArrowNavigation]);

  useEffect(() => {
    if (!keyboardNav || selectedIndex < 0 || !listRef.current) return;
    const container = listRef.current;
    const selectedItem = container.querySelector(`[data-index="${selectedIndex}"]`);
    if (selectedItem) {
      const extraMargin = 50;
      const containerScrollTop = container.scrollTop;
      const containerHeight = container.clientHeight;
      const itemTop = selectedItem.offsetTop;
      const itemBottom = itemTop + selectedItem.offsetHeight;
      if (itemTop < containerScrollTop + extraMargin) {
        container.scrollTo({ top: itemTop - extraMargin, behavior: 'smooth' });
      } else if (itemBottom > containerScrollTop + containerHeight - extraMargin) {
        container.scrollTo({
          top: itemBottom - containerHeight + extraMargin,
          behavior: 'smooth'
        });
      }
    }
    setKeyboardNav(false);
  }, [selectedIndex, keyboardNav]);

  return (
    <div className={`scroll-list-container ${className}`}>
      <div ref={listRef} className={`scroll-list ${!displayScrollbar ? 'no-scrollbar' : ''}`} onScroll={handleScroll}>
        {items.map((item, index) => (
          <AnimatedItem
            key={index}
            delay={0.1}
            index={index}
            onMouseEnter={() => setSelectedIndex(index)}
            onClick={() => {
              setSelectedIndex(index);
              if (onItemSelect) {
                onItemSelect(item, index);
              }
            }}
          >
            <div className={`item ${selectedIndex === index ? 'selected' : ''} ${itemClassName}`}>
              <p className="item-text">{item}</p>
            </div>
          </AnimatedItem>
        ))}
      </div>
      {showGradients && (
        <>
          <div className="top-gradient" style={{ opacity: topGradientOpacity }}></div>
          <div className="bottom-gradient" style={{ opacity: bottomGradientOpacity }}></div>
        </>
      )}
    </div>
  );
};


// =====================================================================
// COMPONENT 5: LogoLoop (Omitted, relies on external CSS/logic)
// =====================================================================
// LogoLoop component definition is omitted as it was not provided in the last prompt.
// This script assumes LogoLoop.jsx exists or is defined elsewhere.


// =====================================================================
// MAIN APPLICATION COMPONENT
// =====================================================================

function App() {
  // This useEffect hook replaces your <script> for the fade-in effect
  useEffect(() => {
    const faders = document.querySelectorAll('.fade-in-section');

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.1,
      }
    );

    faders.forEach((section) => {
      observer.observe(section);
    });

    // Cleanup function
    return () => {
      faders.forEach((section) => {
        observer.unobserve(section);
      });
    };
  }, []); 

  // This useEffect hook replaces your <script> for scrolling to top
  useEffect(() => {
    window.onbeforeunload = function () {
      window.scrollTo(0, 0);
    };

    // Cleanup function
    return () => {
      window.onbeforeunload = null;
    };
  }, []);

  // --- DATA SETUP ---
  const DECRYPT_PROPS = {
    animateOn: "view",
    speed: 10,
    maxIterations: 5,
    sequential: true,
    revealDirection: "center"
  };

  const SPARK_PROPS = {
    sparkColor: '#00FF00',
    sparkSize: 12,
    sparkRadius: 25,
    sparkCount: 12,
    duration: 500,
  };

  const techLogos = [
    { node: <SiPython />, title: 'Python' },
    { node: <FaJava />, title: 'Java' }, 
    { node: <span style={{fontSize: '32px', fontWeight: 'bold'}}>Kafka</span>, title: 'Kafka' }, 
    { node: <span style={{fontSize: '32px', fontWeight: 'bold'}}>GameDev</span>, title: 'Game Development' }, 
    { node: <span style={{fontSize: '32px', fontWeight: 'bold'}}>C++</span>, title: 'C++' },
    { node: <span style={{fontSize: '32px', fontWeight: 'bold'}}>C#</span>, title: 'C#' },
    { node: <SiMysql />, title: 'MySQL' },
    { node: <SiReact />, title: 'React' },
    { node: <SiGnubash />, title: 'Terminal' }, 
    { node: <SiGit />, title: 'Git' },
  ];

  const achievementList = [
      'Top 10 academic ranking in high school (85% average).',
      'Top in Grade for Information Technology in High School.',
      'Top in Grade for Afrikaans FAL.',
      'Achieved 5 distinctions.',
      'Selected for tutoring and teaching assistance roles.',
      'Part of the group that won the 48-hour Arcademia Game Jam.',
      'Attended the World Choir Games in 2018.',
      'Bronze medal at the World Choir Games in 2018.',
      'Received a 100% Academic Bursary for my first year at NWU.',
  ].map(text => (<DecryptedText text={text} {...DECRYPT_PROPS} />));


  return (
    // --- GLOBAL CLICKSPARK WRAPPER ---
    <ClickSpark {...SPARK_PROPS}>
      <>
        {/* --- GLITCH MOVED TO TOP LEVEL TO COVER ENTIRE BACKGROUND --- */}
        <div id="full-screen-glitch" style={{ opacity: 0.10 }}>
          <LetterGlitch
            glitchSpeed={80} 
            centerVignette={false} 
            outerVignette={false} 
            smooth={true} 
          />
        </div>
        {/* --- END FULL SCREEN GLITCH WRAPPER --- */}
        
        <header id="top">
          
          {/* --- FAULTY TERMINAL ENABLED HERE (Alone in the header) --- */}
          <div id="terminal-wrapper" style={{ position: 'absolute', width: '100%', height: '100vh', top: 0, left: 0, zIndex: 1, opacity: 1 }}>
            <FaultyTerminal 
              pageLoadAnimation={true} 
              noiseAmp={0.5} 
              curvature={0.1}
            />
          </div>
          {/* --- END FAULTY TERMINAL --- */}
          
          <div className="overlay" style={{ position: 'relative', zIndex: 2 }}>
            <h1><DecryptedText text="Jan-Paul van den Berg" {...DECRYPT_PROPS} /></h1>
            <p><DecryptedText text="3rd Year BSc IT Student | Aspiring Programmer" {...DECRYPT_PROPS} /></p>
          </div>
        </header>

        <nav>
          <a href="#profile"><DecryptedText text="Profile" {...DECRYPT_PROPS} /></a>
          <a href="#cv"><DecryptedText text="CV" {...DECRYPT_PROPS} /></a>
          <a href="#education"><DecryptedText text="Education" {...DECRYPT_PROPS} /></a>
          <a href="#skills"><DecryptedText text="Skills" {...DECRYPT_PROPS} /></a>
          <a href="#experience"><DecryptedText text="Experience" {...DECRYPT_PROPS} /></a>
          <a href="#achievements"><DecryptedText text="Achievements" {...DECRYPT_PROPS} /></a>
          <a href="#projects"><DecryptedText text="Projects" {...DECRYPT_PROPS} /></a>
          <a href="#hobbies"><DecryptedText text="Hobbies" {...DECRYPT_PROPS} /></a>
          <a href="#contact"><DecryptedText text="Contact" {...DECRYPT_PROPS} /></a>
        </nav>

        <section id="profile" className="fade-in-section">
          <h2><DecryptedText text="Profile" {...DECRYPT_PROPS} /></h2>
          <p>
            <DecryptedText text="I am a passionate and hardworking third-year BSc Information Technology student with a strong interest in programming and problem-solving. I strive to continuously improve my skills and contribute meaningfully to every project I take on." {...DECRYPT_PROPS} />
          </p>
        </section>

        <section id="cv" className="fade-in-section">
          <h2><DecryptedText text="My CV" {...DECRYPT_PROPS} /></h2>
          <p>
            <DecryptedText text="For a detailed and professionally formatted version of my resume," {...DECRYPT_PROPS} />
            <a
              href="https://drive.google.com/file/d/1Mr4eMlSnT7cUkGX7gqudgmiCtbTQlp59/view"
              target="_blank"
              rel="noopener noreferrer"
            >
              <DecryptedText text="View My CV (Google Drive)" {...DECRYPT_PROPS} />
            </a>
          </p>
        </section>

        <section id="education" className="fade-in-section">
          <h2><DecryptedText text="Education" {...DECRYPT_PROPS} /></h2>
          <div className="education">
            <h3><DecryptedText text="BSc in Information Technology" {...DECRYPT_PROPS} /></h3>
            <p>
              <DecryptedText text="North-West University (2023 - Present)" {...DECRYPT_PROPS} /> <br />
              <br />
              <strong>
                <DecryptedText text="Notable Modules" {...DECRYPT_PROPS} />
              </strong>
              <br />
              <ul style={{ paddingLeft: '2rem' }}>
                <li><DecryptedText text="Object Oriented Programming - 86%" {...DECRYPT_PROPS} /></li>
                <li><DecryptedText text="Apps And Advanced User Interface Programming – 75%" {...DECRYPT_PROPS} /></li>
                <li><DecryptedText text="Databases – 71%" {...DECRYPT_PROPS} /></li>
                <li><DecryptedText text="Artificial Intelligence – 72%" {...DECRYPT_PROPS} /></li>
                <li><DecryptedText text="Networks – 76%" {...DECRYPT_PROPS} /></li>
              </ul>
            </p>
            <br />
            <h3><DecryptedText text="Monument High School, Krugersdorp (Graduated 2022)" {...DECRYPT_PROPS} /></h3>
            <p>
              <ul style={{ paddingLeft: '2rem' }}>
                <li><DecryptedText text="Information Technology - 90%" {...DECRYPT_PROPS} /></li>
                <li><DecryptedText text="Accounting – 81%" {...DECRYPT_PROPS} /></li>
                <li><DecryptedText text="CAT – 89%" {...DECRYPT_PROPS} /></li>
                <li><DecryptedText text="Mathematics – 78%" {...DECRYPT_PROPS} /></li>
                <li><DecryptedText text="English – 79%" {...DECRYPT_PROPS} /></li>
                <li><DecryptedText text="Afrikaans – 94%" {...DECRYPT_PROPS} /></li>
                <li><DecryptedText text="Life Orientation – 87%" {...DECRYPT_PROPS} /></li>
              </ul>
            </p>
          </div>
        </section>

        <section id="skills" className="fade-in-section">
          <h2><DecryptedText text="Skills" {...DECRYPT_PROPS} /></h2>
          
          <div
            style={{
              height: '100px',
              position: 'relative',
              overflow: 'hidden',
              marginTop: '2rem',
              marginBottom: '1rem',
              backgroundColor: '#000000', 
            }}
          >
            {/* LogoLoop component is missing, but assuming it exists */}
            {/* <LogoLoop logos={techLogos} speed={100} direction="left" logoHeight={32} gap={40} pauseOnHover fadeOut fadeOutColor="#000000" /> */}
          </div>

          <div className="skills">
            <ul style={{ paddingLeft: '2rem' }}>
              <li>
                <strong><DecryptedText text="Programming Languages:" {...DECRYPT_PROPS} /></strong> <DecryptedText text="Python, Java, C++, C#, MySQL, HTML, Kafka" {...DECRYPT_PROPS} />
              </li>
              <li>
                <strong><DecryptedText text="Data Handling:" {...DECRYPT_PROPS} /></strong> <DecryptedText text="Data Cleaning, SQL Server, MySQL, SQLite" {...DECRYPT_PROPS} />
              </li>
              <li>
                <strong><DecryptedText text="Development Focus:" {...DECRYPT_PROPS} /></strong> <DecryptedText text="Game Development, Song Making, Algorithmic Analysis" {...DECRYPT_PROPS} />
              </li>
              <li>
                <strong><DecryptedText text="Networking:" {...DECRYPT_PROPS} /></strong> <DecryptedText text="Cisco Packet Tracer, strong understanding of the OSI model" {...DECRYPT_PROPS} />
              </li>
              <li>
                <strong><DecryptedText text="Systems Design:" {...DECRYPT_PROPS} /></strong> <DecryptedText text="UML, Enhanced ERD (EERD), Crow’s Foot notation" {...DECRYPT_PROPS} />
              </li>
              <li>
                <strong><DecryptedText text="Software Tools:" {...DECRYPT_PROPS} /></strong> <DecryptedText text="Visual Studio, Oracle SQL Developer, Git" {...DECRYPT_PROPS} />
              </li>
              <li>
                <strong><DecryptedText text="Algorithms & Problem Solving:" {...DECRYPT_PROPS} /></strong> <DecryptedText text="Strong grasp of algorithm design and analysis including sorting, searching, and recursion" {...DECRYPT_PROPS} />
              </li>
              <li>
                <strong><DecryptedText text="Languages:" {...DECRYPT_PROPS} /></strong> <DecryptedText text="Fluent in English and Afrikaans" {...DECRYPT_PROPS} />
              </li>
            </ul>
          </div>
        </section>

        <section id="experience" className="fade-in-section">
          <h2><DecryptedText text="Experience" {...DECRYPT_PROPS} /></h2>

          <div className="job">
            <h3><DecryptedText text="Feb 2025 – July 2025" {...DECRYPT_PROPS} /></h3>
            <p>
              <strong><DecryptedText text="Tutor / Exam Preparation Support" {...DECRYPT_PROPS} /></strong> <DecryptedText text="| North-West University | Potchefstroom" {...DECRYPT_PROPS} />
            </p>
            <ul>
              <li><DecryptedText text="Tutored peers and students in Python, SQL, and database concepts" {...DECRYPT_PROPS} /></li>
              <li><DecryptedText text="Built interactive exam prep tools covering string manipulation, list operations, and SQLite handling" {...DECRYPT_PROPS} /></li>
            </ul>
          </div>

          <div className="job">
            <h3><DecryptedText text="Feb 2025 – Mar 2025" {...DECRYPT_PROPS} /></h3>
            <p>
              <strong><DecryptedText text="Computer Literacy Class Teacher" {...DECRYPT_PROPS} /></strong> <DecryptedText text="| North-West University | Potchefstroom" {...DECRYPT_PROPS} />
            </p>
            <ul>
              <li><DecryptedText text="Assisted in teaching basic computer skills to adult learners and beginners" {...DECRYPT_PROPS} /></li>
              <li><DecryptedText text="Guided learners on using Microsoft Word, Excel, Internet browsers, and email" {...DECRYPT_PROPS} /></li>
              <li><DecryptedText text="Helped improve digital literacy in the community through patient, hands-on support" {...DECRYPT_PROPS} /></li>
            </ul>
          </div>

          <div className="job">
            <h3><DecryptedText text="July 2025" {...DECRYPT_PROPS} /></h3>
            <p>
              <strong><DecryptedText text="House Sitter" {...DECRYPT_PROPS} /></strong> <DecryptedText text="| Hennie Pieters | Krugersdorp" {...DECRYPT_PROPS} />
            </p>
            <ul>
              <li><DecryptedText text="Entrusted with overseeing and maintaining the household for the full month" {...DECRYPT_PROPS} /></li>
              <li><DecryptedText text="Ensured the property’s safety, upkeep, and cleanliness during the owner's absence" {...DECRYPT_PROPS} /></li>
            </ul>
          </div>

          <div className="job">
            <h3><DecryptedText text="Jan 2024" {...DECRYPT_PROPS} /></h3>
            <p>
              <strong><DecryptedText text="Waiter" {...DECRYPT_PROPS} /></strong> <DecryptedText text="| Ana Paula’s Coffee Shop | Krugersdorp" {...DECRYPT_PROPS} />
            </p>
            <ul>
              <li><DecryptedText text="Provided friendly and efficient table service to customers" {...DECRYPT_PROPS} /></li>
              <li><DecryptedText text="Assisted with daily operations to ensure a smooth-running coffee shop environment" {...DECRYPT_PROPS} /></li>
            </ul>
          </div>

          <div className="job">
            <h3><DecryptedText text="Dec 2023" {...DECRYPT_PROPS} /></h3>
            <p>
              <strong><DecryptedText text="House Sitter" {...DECRYPT_PROPS} /></strong> <DecryptedText text="| Wandi Koen | Krugersdorp" {...DECRYPT_PROPS} />
            </p>
            <ul>
              <li><DecryptedText text="Responsible for the household’s upkeep and security during a month-long absence" {...DECRYPT_PROPS} /></li>
              <li><DecryptedText text="Maintained trust and reliability through responsible caretaking" {...DECRYPT_PROPS} /></li>
            </ul>
          </div>
        </section>

        <section id="achievements" className="fade-in-section">
          <h2><DecryptedText text="Achievements" {...DECRYPT_PROPS} /></h2>
          
          <div style={{ maxWidth: '400px', margin: '0 auto' }}>
            <AnimatedList 
              items={achievementList.map(item => item.node)} 
              displayScrollbar={false}
              className='animated-list-container' 
            />
          </div>
          
          <div className="achievement">
            <p style={{marginTop: '2rem'}}>
              <a href="https.www.linkedin.com/feed/update/urn:li:activity:7350874250775277570/"
                target="_blank"
                rel="noopener noreferrer"
              >
                <DecryptedText text="View Arcademia Game Jam Announcement" {...DECRYPT_PROPS} />
              </a>
            </p>
          </div>
        </section>

        <section id="projects" className="fade-in-section">
          <h2><DecryptedText text="Projects" {...DECRYPT_PROPS} /></h2>
          <div className="projects">
            <ul style={{ paddingLeft: '2rem' }}>
              <li>
                  <a
                      href="https://github.com/Pantoffel24/Nova-Analytix-Repository-cmpg324-"
                      target="_blank"
                      rel="noopener noreferrer"
                  >
                      <DecryptedText text="ClearVue BI System (RFP 02/2025)" {...DECRYPT_PROPS} />
                  </a>{' '}
                  – <DecryptedText text="Design and prototype of a scalable NoSQL Business Intelligence (BI) system for ClearVue Ltd. The solution used MongoDB and Apache Kafka for real-time sales data reporting, tailored to a custom financial year structure. Demonstrated the agility of NoSQL over traditional relational systems for evolving supplier analytics needs." {...DECRYPT_PROPS} />
              </li>
              <li>
                  <a
                      href="https://github.com/HumaidEbrahim/Arcademia"
                      target="_blank"
                      rel="noopener noreferrer"
                  >
                      <DecryptedText text="Godot Game: Arcademia" {...DECRYPT_PROPS} />
                  </a>{' '}
                  – <DecryptedText text="A 2D game developed using the Godot engine and GDScript, specifically designed as an interactive tool to teach young children fundamental concepts of programming logic, sequencing, and conditional branching through puzzle-solving." {...DECRYPT_PROPS} />
              </li>
              <li>
                  <a
                    href="https://github.com/JPvdBerg/Minesweeper"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <DecryptedText text="Minesweeper Game" {...DECRYPT_PROPS} />
                  </a>{' '}
                – <DecryptedText text="A classic tile-based Minesweeper game developed in Java with a clean GUI and recursive reveal logic." {...DECRYPT_PROPS} />
              </li>
              <li>
                  <a
                    href="https://github.com/JPvdBerg/Snake-Game"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <DecryptedText text="Snake Game" {...DECRYPT_PROPS} />
                  </a>{' '}
                – <DecryptedText text="A simple and responsive version of Snake built in Java using key event handling and grid movement." {...DECRYPT_PROPS} />
              </li>
              <li>
                  <a
                    href="https://github.com/JPvdBerg/Instant-Messaging-App"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <DecryptedText text="Instant Messaging App" {...DECRYPT_PROPS} />
                  </a>{' '}
                – <DecryptedText text="A Python-based chat application that supports real-time communication over the internet using sockets." {...DECRYPT_PROPS} />
              </li>
            </ul>
          </div>
        </section>

        <section id="hobbies" className="fade-in-section">
          <h2><DecryptedText text="Hobbies" {...DECRYPT_PROPS} /></h2>
          <ul style={{ paddingLeft: '2rem' }}>
            <li><DecryptedText text="Guitar" {...DECRYPT_PROPS} /></li>
            <li><DecryptedText text="Chess" {...DECRYPT_PROPS} /></li>
            <li><DecryptedText text="Video Games" {...DECRYPT_PROPS} /></li>
            <li><DecryptedText text="Coding" {...DECRYPT_PROPS} /></li>
            <li><DecryptedText text="Reading" {...DECRYPT_PROPS} /></li>
            <li><DecryptedText text="Rock Climbing" {...DECRYPT_PROPS} /></li>
            <li><DecryptedText text="Serenade (A capella group wherein we came top 5 in our local competition at the NWU)" {...DECRYPT_PROPS} /></li>
          </ul>
        </section>

        <section id="contact" className="fade-in-section">
          <h2><DecryptedText text="Contact" {...DECRYPT_PROPS} /></h2>
          <p> <DecryptedText text="065-918-0206" {...DECRYPT_PROPS} /></p>
          <p>
            <a
              href="mailto:janpaulvdberg@gmail.com"
            >
              <DecryptedText text="janpaulvdberg@gmail.com" {...DECRYPT_PROPS} />
            </a>
          </p>
          <p>
            <a
              href="https://www.linkedin.com/in/jan-paul-van-den-berg-a46686270/"
              target="_blank"
              rel="noopener noreferrer"
            >
              <DecryptedText text="LinkedIn Profile" {...DECRYPT_PROPS} />
            </a>
          </p>
          <p>
            <a
              href="https://github.com/JPvdBerg"
              target="_blank"
              rel="noopener noreferrer"
            >
              <DecryptedText text="My GitHub Profile" {...DECRYPT_PROPS} />
            </a>
          </p>
          <p>
            <a
              href="https://drive.google.com/file/d/1Mr4eMlSnT7cUkGX7gqudgmiCtbTQlp59/view"
              target="_blank"
              rel="noopener noreferrer"
            >
              <DecryptedText text="View My CV" {...DECRYPT_PROPS} />
            </a>
          </p>
        </section>

        <div style={{ textAlign: 'center', padding: '2rem' }}>
          <a
            href="#top"
          >
            <DecryptedText text="↑ Back to Top" {...DECRYPT_PROPS} />
          </a>
        </div>

        <footer>
          {/* --- INTERACTIVE CONSOLE FOOTER --- */}
          <div className='footer-console'>
              {/* The static prompt part */}
              <span style={{color: 'var(--hacker-green-light)'}}>[jpvdberg@virtualcv ~]$ </span>
              
              {/* FIX: Use a command that is stable and short */}
              <span className='typing-line' style={{
                   animation: 'typing 4s steps(35, end) infinite, blink-caret 0.75s step-end infinite'
              }}><DecryptedText text="run systems_check --verbose . . ." {...DECRYPT_PROPS} /></span>
          </div>
          {/* --- END CONSOLE --- */}
          <div className='footer-copyright'>
              <p><DecryptedText text="© 2025 Jan-Paul van den Berg. All rights reserved." {...DECRYPT_PROPS} /></p>
          </div>
        </footer>
      </>
    </ClickSpark>
  );
}

export default App;