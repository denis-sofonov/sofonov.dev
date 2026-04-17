<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref, watch } from 'vue'

const props = withDefaults(
  defineProps<{
    size?: number
    color?: string
    spin?: boolean
    spinDuration?: number
    spikeCount?: number
    overscan?: number
    offsetX?: number
    offsetY?: number
  }>(),
  {
    size: 32,
    color: '#d9211f',
    spin: true,
    spinDuration: 18,
    spikeCount: 10,
    overscan: 2,
    offsetX: -2,
    offsetY: 3,
  },
)

const canvasRef = ref<HTMLCanvasElement | null>(null)
let raf = 0
let cleanup: (() => void) | null = null

type V3 = [number, number, number]

const hash = (n: number) => {
  const s = Math.sin(n * 127.1 + 311.7) * 43758.5453
  return s - Math.floor(s)
}

const cross = (a: V3, b: V3): V3 => [
  a[1] * b[2] - a[2] * b[1],
  a[2] * b[0] - a[0] * b[2],
  a[0] * b[1] - a[1] * b[0],
]
const normV = (a: V3): V3 => {
  const l = Math.hypot(a[0], a[1], a[2]) || 1
  return [a[0] / l, a[1] / l, a[2] / l]
}

function buildMesh(spikeCount: number) {
  const positions: number[] = []
  const normals: number[] = []

  const BALL_R = 0.18
  const LAT = 28
  const LON = 40

  const push = (p: V3, n: V3) => {
    positions.push(p[0], p[1], p[2])
    normals.push(n[0], n[1], n[2])
  }

  for (let i = 0; i < LAT; i++) {
    const lat1 = (i / LAT) * Math.PI
    const lat2 = ((i + 1) / LAT) * Math.PI
    for (let j = 0; j < LON; j++) {
      const lon1 = (j / LON) * 2 * Math.PI
      const lon2 = ((j + 1) / LON) * 2 * Math.PI
      const vert = (lat: number, lon: number): V3 => [
        Math.sin(lat) * Math.cos(lon),
        Math.cos(lat),
        Math.sin(lat) * Math.sin(lon),
      ]
      const v1 = vert(lat1, lon1)
      const v2 = vert(lat2, lon1)
      const v3 = vert(lat2, lon2)
      const v4 = vert(lat1, lon2)
      const scale = (v: V3): V3 => [v[0] * BALL_R, v[1] * BALL_R, v[2] * BALL_R]
      push(scale(v1), v1); push(scale(v2), v2); push(scale(v3), v3)
      push(scale(v1), v1); push(scale(v3), v3); push(scale(v4), v4)
    }
  }

  const CONE_SEG = 18
  const golden = Math.PI * (3 - Math.sqrt(5))

  for (let i = 0; i < spikeCount; i++) {
    const yy = 1 - (i / Math.max(1, spikeCount - 1)) * 2
    const r = Math.sqrt(Math.max(0, 1 - yy * yy))
    const theta = golden * i
    let dx = Math.cos(theta) * r
    let dz = Math.sin(theta) * r
    let dy = yy
    dx += (hash(i + 3) - 0.5) * 0.06
    dy += (hash(i + 7) - 0.5) * 0.06
    dz += (hash(i + 13) - 0.5) * 0.06
    const m = Math.hypot(dx, dy, dz) || 1
    dx /= m; dy /= m; dz /= m
    const dir: V3 = [dx, dy, dz]

    const len = BALL_R * (2.2 + hash(i + 21) * 1.1)
    const baseR = BALL_R * (0.38 + hash(i + 33) * 0.14)

    const baseCenter: V3 = [dx * BALL_R * 0.92, dy * BALL_R * 0.92, dz * BALL_R * 0.92]
    const tip: V3 = [dx * (BALL_R + len), dy * (BALL_R + len), dz * (BALL_R + len)]

    const helper: V3 = Math.abs(dx) < 0.9 ? [1, 0, 0] : [0, 1, 0]
    const u = normV(cross(dir, helper))
    const v = cross(dir, u)

    const L = Math.hypot(len, baseR) || 1
    const axialFactor = baseR / L
    const radialFactor = len / L

    const smoothN = (ang: number): V3 => {
      const ca = Math.cos(ang), sa = Math.sin(ang)
      return normV([
        (u[0] * ca + v[0] * sa) * radialFactor + dir[0] * axialFactor,
        (u[1] * ca + v[1] * sa) * radialFactor + dir[1] * axialFactor,
        (u[2] * ca + v[2] * sa) * radialFactor + dir[2] * axialFactor,
      ])
    }

    for (let k = 0; k < CONE_SEG; k++) {
      const a1 = (k / CONE_SEG) * 2 * Math.PI
      const a2 = ((k + 1) / CONE_SEG) * 2 * Math.PI
      const am = (a1 + a2) / 2
      const c1 = Math.cos(a1), s1 = Math.sin(a1)
      const c2 = Math.cos(a2), s2 = Math.sin(a2)
      const b1: V3 = [
        baseCenter[0] + (u[0] * c1 + v[0] * s1) * baseR,
        baseCenter[1] + (u[1] * c1 + v[1] * s1) * baseR,
        baseCenter[2] + (u[2] * c1 + v[2] * s1) * baseR,
      ]
      const b2: V3 = [
        baseCenter[0] + (u[0] * c2 + v[0] * s2) * baseR,
        baseCenter[1] + (u[1] * c2 + v[1] * s2) * baseR,
        baseCenter[2] + (u[2] * c2 + v[2] * s2) * baseR,
      ]
      push(b1, smoothN(a1))
      push(b2, smoothN(a2))
      push(tip, smoothN(am))
    }
  }

  return {
    positions: new Float32Array(positions),
    normals: new Float32Array(normals),
  }
}

function hexToRgb(hex: string): [number, number, number] {
  const m = hex.replace('#', '')
  const full = m.length === 3 ? m.split('').map(c => c + c).join('') : m
  return [
    parseInt(full.slice(0, 2), 16) / 255 || 0,
    parseInt(full.slice(2, 4), 16) / 255 || 0,
    parseInt(full.slice(4, 6), 16) / 255 || 0,
  ]
}

function mat4Mul(a: Float32Array, b: Float32Array): Float32Array {
  const r = new Float32Array(16)
  for (let c = 0; c < 4; c++)
    for (let row = 0; row < 4; row++) {
      let s = 0
      for (let k = 0; k < 4; k++) s += a[k * 4 + row] * b[c * 4 + k]
      r[c * 4 + row] = s
    }
  return r
}
function mat4Perspective(fovY: number, aspect: number, near: number, far: number) {
  const f = 1 / Math.tan(fovY / 2)
  const nf = 1 / (near - far)
  return new Float32Array([
    f / aspect, 0, 0, 0,
    0, f, 0, 0,
    0, 0, (far + near) * nf, -1,
    0, 0, 2 * far * near * nf, 0,
  ])
}
function mat4RotateY(a: number) {
  const c = Math.cos(a), s = Math.sin(a)
  return new Float32Array([c, 0, -s, 0, 0, 1, 0, 0, s, 0, c, 0, 0, 0, 0, 1])
}
function mat4RotateX(a: number) {
  const c = Math.cos(a), s = Math.sin(a)
  return new Float32Array([1, 0, 0, 0, 0, c, s, 0, 0, -s, c, 0, 0, 0, 0, 1])
}
function mat4Translate(x: number, y: number, z: number) {
  return new Float32Array([1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, x, y, z, 1])
}

function init() {
  const canvas = canvasRef.value
  if (!canvas) return
  const dpr = Math.min(2, window.devicePixelRatio || 1)
  const cssSize = props.size * props.overscan
  const pixel = Math.max(32, cssSize * dpr)
  canvas.width = pixel
  canvas.height = pixel

  const gl = canvas.getContext('webgl', {
    antialias: true,
    alpha: true,
    premultipliedAlpha: true,
  }) as WebGLRenderingContext | null
  if (!gl) return

  const mesh = buildMesh(props.spikeCount)

  const vsSrc = `
    attribute vec3 aPos;
    attribute vec3 aNormal;
    uniform mat4 uProj;
    uniform mat4 uView;
    uniform mat4 uModel;
    varying vec3 vNormal;
    varying vec3 vPos;
    void main() {
      vec4 world = uModel * vec4(aPos, 1.0);
      vPos = world.xyz;
      vNormal = mat3(uModel) * aNormal;
      gl_Position = uProj * uView * world;
    }
  `
  const fsSrc = `
    precision mediump float;
    varying vec3 vNormal;
    varying vec3 vPos;
    uniform vec3 uColor;
    uniform vec3 uKey;
    uniform vec3 uFill;
    uniform vec3 uCam;
    void main() {
      vec3 n = normalize(vNormal);
      vec3 viewDir = normalize(uCam - vPos);

      vec3 kl = normalize(uKey);
      vec3 fl = normalize(uFill);

      float keyDiff = max(dot(n, kl), 0.0);
      float fillDiff = max(dot(n, fl), 0.0) * 0.45;

      vec3 h = normalize(kl + viewDir);
      float spec = pow(max(dot(n, h), 0.0), 48.0) * 0.28;

      float rim = pow(1.0 - max(dot(n, viewDir), 0.0), 3.0) * 0.55;

      vec3 ambient = uColor * 0.18 + vec3(0.04, 0.02, 0.03);
      vec3 keyCol = uColor * keyDiff * 1.05;
      vec3 fillCol = mix(uColor, vec3(1.0), 0.35) * fillDiff;
      vec3 col = ambient + keyCol + fillCol + vec3(1.0) * spec + mix(uColor, vec3(1.0, 0.88, 0.82), 0.25) * rim;

      col = pow(col, vec3(0.92));
      gl_FragColor = vec4(col, 1.0);
    }
  `
  const compile = (type: number, src: string) => {
    const sh = gl.createShader(type)!
    gl.shaderSource(sh, src)
    gl.compileShader(sh)
    if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS)) {
      console.error(gl.getShaderInfoLog(sh))
      return null
    }
    return sh
  }
  const vs = compile(gl.VERTEX_SHADER, vsSrc)
  const fs = compile(gl.FRAGMENT_SHADER, fsSrc)
  if (!vs || !fs) return
  const prog = gl.createProgram()!
  gl.attachShader(prog, vs)
  gl.attachShader(prog, fs)
  gl.linkProgram(prog)
  if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
    console.error(gl.getProgramInfoLog(prog))
    return
  }

  const aPos = gl.getAttribLocation(prog, 'aPos')
  const aNormal = gl.getAttribLocation(prog, 'aNormal')
  const uProj = gl.getUniformLocation(prog, 'uProj')
  const uView = gl.getUniformLocation(prog, 'uView')
  const uModel = gl.getUniformLocation(prog, 'uModel')
  const uColor = gl.getUniformLocation(prog, 'uColor')
  const uKey = gl.getUniformLocation(prog, 'uKey')
  const uFill = gl.getUniformLocation(prog, 'uFill')
  const uCam = gl.getUniformLocation(prog, 'uCam')

  const posBuf = gl.createBuffer()!
  gl.bindBuffer(gl.ARRAY_BUFFER, posBuf)
  gl.bufferData(gl.ARRAY_BUFFER, mesh.positions, gl.STATIC_DRAW)
  const normBuf = gl.createBuffer()!
  gl.bindBuffer(gl.ARRAY_BUFFER, normBuf)
  gl.bufferData(gl.ARRAY_BUFFER, mesh.normals, gl.STATIC_DRAW)

  gl.enable(gl.DEPTH_TEST)
  gl.viewport(0, 0, canvas.width, canvas.height)
  gl.clearColor(0, 0, 0, 0)

  const reduced = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false
  const CAM_Z = 2.4
  const proj = mat4Perspective((38 * Math.PI) / 180, 1, 0.1, 10)
  const view = mat4Translate(0, 0, -CAM_Z)

  let yaw = 0.5
  let pitch = -0.2
  let last = 0

  const render = (t: number) => {
    if (!last) last = t
    const dt = Math.min(0.05, (t - last) / 1000)
    last = t
    if (props.spin && !reduced) {
      yaw += dt * ((2 * Math.PI) / props.spinDuration)
      pitch += dt * ((2 * Math.PI) / (props.spinDuration * 2.4))
    }
    const model = mat4Mul(mat4RotateY(yaw), mat4RotateX(pitch))

    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)
    gl.useProgram(prog)

    gl.bindBuffer(gl.ARRAY_BUFFER, posBuf)
    gl.enableVertexAttribArray(aPos)
    gl.vertexAttribPointer(aPos, 3, gl.FLOAT, false, 0, 0)
    gl.bindBuffer(gl.ARRAY_BUFFER, normBuf)
    gl.enableVertexAttribArray(aNormal)
    gl.vertexAttribPointer(aNormal, 3, gl.FLOAT, false, 0, 0)

    gl.uniformMatrix4fv(uProj, false, proj)
    gl.uniformMatrix4fv(uView, false, view)
    gl.uniformMatrix4fv(uModel, false, model)
    const [r, g, b] = hexToRgb(props.color)
    gl.uniform3f(uColor, r, g, b)
    gl.uniform3f(uKey, 0.5, 0.8, 0.7)
    gl.uniform3f(uFill, -0.7, -0.2, 0.5)
    gl.uniform3f(uCam, 0, 0, CAM_Z)

    gl.drawArrays(gl.TRIANGLES, 0, mesh.positions.length / 3)
    raf = requestAnimationFrame(render)
  }
  raf = requestAnimationFrame(render)

  cleanup = () => {
    cancelAnimationFrame(raf)
    gl.deleteBuffer(posBuf)
    gl.deleteBuffer(normBuf)
    gl.deleteProgram(prog)
    gl.deleteShader(vs)
    gl.deleteShader(fs)
  }
}

onMounted(init)
onBeforeUnmount(() => cleanup?.())

watch(
  () => [props.size, props.spikeCount, props.overscan],
  () => {
    cleanup?.()
    init()
  },
)
</script>

<template>
  <span
    class="logo-mark"
    :style="{ width: `${size}px`, height: `${size}px` }"
    aria-hidden="true"
  >
    <canvas
      ref="canvasRef"
      class="logo-mark__canvas"
      :style="{
        width: `${(size ?? 32) * (overscan ?? 2)}px`,
        height: `${(size ?? 32) * (overscan ?? 2)}px`,
        transform: `translate(calc(-50% + ${offsetX ?? 0}px), calc(-50% + ${offsetY ?? 0}px))`,
      }"
    />
  </span>
</template>

<style scoped>
.logo-mark {
  position: relative;
  display: inline-block;
  vertical-align: middle;
}
.logo-mark__canvas {
  position: absolute;
  left: 50%;
  top: 50%;
  pointer-events: none;
}
</style>
