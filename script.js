import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js";

const gsap = window.gsap;
const canvasHost = document.querySelector("#gift-canvas");
const giftStage = document.querySelector("#gift-stage");
const openButton = document.querySelector("#open-gift");
const backdrop = document.querySelector("#card-backdrop");
const card = document.querySelector("#birthday-card");
const closeButton = document.querySelector("#close-card");
const announcement = document.querySelector("#announcement");

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(34, 1, 0.1, 100);
camera.position.set(0, 1.1, 8.4);

const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.25;
canvasHost.querySelector(".canvas-fallback").remove();
canvasHost.appendChild(renderer.domElement);

scene.add(new THREE.AmbientLight(0xffe9d2, 1.8));
const keyLight = new THREE.DirectionalLight(0xffd9a6, 4.3);
keyLight.position.set(-3, 5, 5);
scene.add(keyLight);
const fillLight = new THREE.PointLight(0xbc8dff, 75, 14);
fillLight.position.set(3, 1, 3);
scene.add(fillLight);
const rimLight = new THREE.PointLight(0xff9baf, 55, 12);
rimLight.position.set(-3, 1.5, -2);
scene.add(rimLight);

const gift = new THREE.Group();
scene.add(gift);

const boxMaterial = new THREE.MeshStandardMaterial({
  color: 0xd38187,
  roughness: 0.3,
  metalness: 0.12,
});
const lidMaterial = new THREE.MeshStandardMaterial({
  color: 0xe89a89,
  roughness: 0.28,
  metalness: 0.1,
});
const ribbonMaterial = new THREE.MeshStandardMaterial({
  color: 0xffdf9e,
  roughness: 0.24,
  metalness: 0.32,
  emissive: 0x3c2410,
});

const base = new THREE.Mesh(new THREE.BoxGeometry(2.05, 1.5, 1.8), boxMaterial);
base.position.y = -0.45;
base.castShadow = true;
base.receiveShadow = true;
gift.add(base);

const baseRibbon = new THREE.Mesh(new THREE.BoxGeometry(0.3, 1.53, 1.82), ribbonMaterial);
baseRibbon.position.set(0, -0.45, 0);
gift.add(baseRibbon);

const frontRibbon = new THREE.Mesh(new THREE.BoxGeometry(2.07, 0.22, 0.035), ribbonMaterial);
frontRibbon.position.set(0, -0.2, 0.92);
gift.add(frontRibbon);

const lidPivot = new THREE.Group();
lidPivot.position.set(0, 0.33, -0.9);
gift.add(lidPivot);

const lid = new THREE.Mesh(new THREE.BoxGeometry(2.26, 0.42, 2.02), lidMaterial);
lid.position.set(0, 0.2, 0.9);
lid.castShadow = true;
lidPivot.add(lid);

const lidRibbon = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.44, 2.04), ribbonMaterial);
lidRibbon.position.set(0, 0.2, 0.9);
lidPivot.add(lidRibbon);

const bowGroup = new THREE.Group();
bowGroup.position.set(0, 0.47, 0.9);
lidPivot.add(bowGroup);
const loopGeometry = new THREE.TorusGeometry(0.32, 0.075, 10, 28, Math.PI * 1.82);
const leftLoop = new THREE.Mesh(loopGeometry, ribbonMaterial);
leftLoop.rotation.z = Math.PI * 0.75;
leftLoop.scale.set(1, 0.78, 0.7);
leftLoop.position.x = -0.22;
bowGroup.add(leftLoop);
const rightLoop = new THREE.Mesh(loopGeometry, ribbonMaterial);
rightLoop.rotation.z = -Math.PI * 0.25;
rightLoop.scale.set(1, 0.78, 0.7);
rightLoop.position.x = 0.22;
bowGroup.add(rightLoop);
const bowKnot = new THREE.Mesh(new THREE.SphereGeometry(0.12, 20, 16), ribbonMaterial);
bowKnot.scale.set(1, 0.8, 0.8);
bowGroup.add(bowKnot);

const cardMaterial = new THREE.MeshStandardMaterial({
  color: 0xffeccb,
  emissive: 0x5e2d26,
  emissiveIntensity: 0.25,
  roughness: 0.48,
});
const innerCard = new THREE.Mesh(new THREE.BoxGeometry(1.12, 0.035, 0.78), cardMaterial);
innerCard.position.set(0, -0.25, 0);
innerCard.rotation.x = -0.16;
gift.add(innerCard);

const sparkleMaterial = new THREE.MeshBasicMaterial({ color: 0xffe4aa });
const sparkles = new THREE.Group();
scene.add(sparkles);
for (let index = 0; index < 28; index += 1) {
  const dot = new THREE.Mesh(
    new THREE.SphereGeometry(index % 5 === 0 ? 0.035 : 0.018, 8, 8),
    sparkleMaterial.clone(),
  );
  dot.position.set((Math.random() - 0.5) * 6, (Math.random() - 0.5) * 4.5, (Math.random() - 0.5) * 2);
  dot.userData.phase = Math.random() * Math.PI * 2;
  dot.userData.baseY = dot.position.y;
  sparkles.add(dot);
}

const resizeObserver = new ResizeObserver(resizeScene);
resizeObserver.observe(canvasHost);
resizeScene();

function resizeScene() {
  const { width, height } = canvasHost.getBoundingClientRect();
  if (width === 0 || height === 0) return;
  renderer.setSize(width, height, false);
  camera.aspect = width / height;
  camera.position.z = width < 420 ? 9.6 : width < 600 ? 9 : 8.4;
  camera.updateProjectionMatrix();
}

const pointer = { x: 0, y: 0 };
canvasHost.addEventListener("pointermove", (event) => {
  const bounds = canvasHost.getBoundingClientRect();
  pointer.x = ((event.clientX - bounds.left) / bounds.width - 0.5) * 2;
  pointer.y = ((event.clientY - bounds.top) / bounds.height - 0.5) * 2;
});
canvasHost.addEventListener("pointerleave", () => {
  pointer.x = 0;
  pointer.y = 0;
});

let opened = false;
let animationFrame;

function render(time = 0) {
  animationFrame = requestAnimationFrame(render);
  const seconds = time * 0.001;
  gift.position.y = Math.sin(seconds * 1.15) * 0.14;
  gift.rotation.y += (pointer.x * 0.19 - gift.rotation.y) * 0.035;
  gift.rotation.x += (-pointer.y * 0.11 - gift.rotation.x) * 0.035;

  sparkles.children.forEach((dot) => {
    dot.position.y = dot.userData.baseY + Math.sin(seconds * 0.75 + dot.userData.phase) * 0.12;
    dot.material.opacity = 0.45 + (Math.sin(seconds * 1.4 + dot.userData.phase) + 1) * 0.25;
    dot.material.transparent = true;
  });

  renderer.render(scene, camera);
}

render();

function openGift() {
  if (opened) return;
  opened = true;
  openButton.disabled = true;
  announcement.textContent = "Your birthday card is opening.";

  gsap.timeline({
    onComplete: () => {
      backdrop.classList.add("is-visible");
      backdrop.setAttribute("aria-hidden", "false");
      gsap.to(card, { opacity: 1, y: 0, scale: 1, duration: 0.65, ease: "back.out(1.45)" });
      closeButton.focus();
      announcement.textContent = "Birthday wishes for Yogesh Sir.";
    },
  })
    .to(gift.scale, { x: 1.08, y: 1.08, z: 1.08, duration: 0.26, ease: "back.out(2)" })
    .to(lidPivot.rotation, { x: -1.9, z: -0.16, duration: 0.82, ease: "power3.inOut" }, "<")
    .to(lidPivot.position, { y: 1.6, z: -0.52, duration: 0.82, ease: "power3.inOut" }, "<")
    .to(innerCard.position, { y: 0.55, z: 0.25, duration: 0.85, ease: "power2.out" }, "<0.14")
    .to(innerCard.rotation, { x: -0.28, duration: 0.85, ease: "power2.out" }, "<")
    .to(fillLight, { intensity: 125, duration: 0.55 }, "<0.15")
    .to(gift.scale, { x: 1, y: 1, z: 1, duration: 0.35, ease: "power2.out" }, "-=0.15");
}

function closeCard() {
  if (!backdrop.classList.contains("is-visible")) return;
  backdrop.classList.remove("is-visible");
  backdrop.setAttribute("aria-hidden", "true");
  gsap.to(card, {
    opacity: 0,
    y: 20,
    scale: 0.98,
    duration: 0.24,
    onComplete: () => {
      opened = false;
      openButton.disabled = false;
      openButton.focus();
    },
  });
}

openButton.addEventListener("click", openGift);
canvasHost.addEventListener("click", openGift);
canvasHost.addEventListener("keydown", (event) => {
  if (event.key === "Enter" || event.key === " ") {
    event.preventDefault();
    openGift();
  }
});
closeButton.addEventListener("click", closeCard);
backdrop.addEventListener("click", (event) => {
  if (event.target === backdrop) closeCard();
});
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") closeCard();
});

const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
if (reducedMotion.matches) {
  cancelAnimationFrame(animationFrame);
  gift.position.y = 0;
  gift.rotation.y = 0;
  gift.rotation.x = 0;
  renderer.render(scene, camera);
}
