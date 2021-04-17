function clock() {
    let hours = document.getElementById('hour');
    let minute = document.getElementById('minute');
    let seconds = document.getElementById('seconds');
    let ampm = document.getElementById('ampm');

    let h = new Date().getHours();
    let m = new Date().getMinutes();
    let s = new Date().getSeconds();
    let am = 'AM';
    hour.innerHTML = h;
    minute.innerHTML = m;
    seconds.innerHTML = s;
}
var interval = setInterval(clock,1000);
// cards
// function move(id, position, color) {
//     var tl = gsap.timeline();
//     tl.to("#bgBubble", { duration: 0.15, bottom: "-30px", ease: "ease-out" }, 0)
//         .to(
//             "#bubble1",
//             { duration: 0.1, y: "120%", boxShadow: "none", ease: "ease-out" },
//             0
//         )
//         .to(
//             "#bubble2",
//             { duration: 0.1, y: "120%", boxShadow: "none", ease: "ease-out" },
//             0
//         )
//         .to(
//             "#bubble3",
//             { duration: 0.1, y: "120%", boxShadow: "none", ease: "ease-out" },
//             0
//         )
//         .to(
//             "#bubble4",
//             { duration: 0.1, y: "120%", boxShadow: "none", ease: "ease-out" },
//             0
//         )
//         .to(".icon", { duration: 0.05, opacity: 0, ease: "ease-out" }, 0)
//         .to(
//             "#bgBubble",
//             { duration: 0.2, left: position, ease: "ease-in-out" },
//             0.1
//         )
//         .to(
//             "#bgBubble",
//             { duration: 0.15, bottom: "-50px", ease: "ease-out" },
//             "-=0.2"
//         )
//         .to(
//             `#bubble${id}`,
//             {
//                 duration: 0.15,
//                 y: "0%",
//                 opacity: 1,
//                 boxShadow: "0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24)",
//                 ease: "ease-out"
//             },
//             "-=0.1"
//         )
//         .to(
//             `#bubble${id}> span`,
//             { duration: 0.15, y: "0%", opacity: 0.7, ease: "ease-out" },
//             "-=0.1"
//         )
//         .to(
//             "#navbarContainer",
//             { duration: 0.3, backgroundColor: color, ease: "ease-in-out" },
//             0
//         )
//         .to(
//             "#bg",
//             { duration: 0.3, backgroundColor: color, ease: "ease-in-out" },
//             0
//         )
//         .to(
//             "#bgBubble",
//             { duration: 0.3, backgroundColor: color, ease: "ease-in-out" },
//             0
//         );
// }
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = -2.5;
camera.position.x = -5

const ambient = new THREE.AmbientLight(0xffffff);
scene.add(ambient);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

let tooLazyToHandleLoadingProperly = 0;
const loadingLol = () => tooLazyToHandleLoadingProperly++;
const ENV_URL = 'https://s.halvves.com/gregzaal-venicedawn.jpg';
const reflectionCube = new THREE.TextureLoader().load(ENV_URL, loadingLol);
const refractionCube = new THREE.TextureLoader().load(ENV_URL, loadingLol);
reflectionCube.mapping = THREE.EquirectangularReflectionMapping;
refractionCube.mapping = THREE.EquirectangularRefractionMapping;
scene.background = reflectionCube;
scene.environment = reflectionCube;

const geometry = new THREE.SphereGeometry(2, 128, 128);
const base = geometry.attributes.position.array.slice();
const refractionMaterial = new THREE.MeshPhysicalMaterial({
  color: 0xc3e4f9,
  envMap: refractionCube,
  metalness: 1,
  reflectivity: 0,
  refractionRatio: .1,
  roughness: 0,
  side: THREE.DoubleSide
});
const reflectionMaterial = new THREE.MeshPhysicalMaterial({
  color: 0xc3e4f9,
  envMap: reflectionCube,
  envMapIntensity: 1,
  metalness: .35,
  reflectivity: .9,
  roughness: 0,
  side: THREE.DoubleSide,
  transmission: 1,
  transparent: true,
});
const refractionSphere = new THREE.Mesh(geometry, refractionMaterial);
const reflectionSphere = new THREE.Mesh(geometry, reflectionMaterial);
const sphere = new THREE.Object3D();
sphere.add(refractionSphere);
sphere.add(reflectionSphere);
scene.add(sphere);
sphere.lookAt(camera.position);
camera.lookAt(sphere.position);

controls = new THREE.OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;

const animate = function (dt) {
  requestAnimationFrame(animate);
  controls.update();
  if (tooLazyToHandleLoadingProperly !== 2) return;

  geometry.attributes.position.array.forEach((val, i, arr) => {
    const place = i % 3;

    if (place === 0) { // x
      arr[i] = base[i] + Math.sin(base[i + 1] * 3 + dt * .002) * .1;
    }

    if (place === 1) { // y
      arr[i] = base[i] + Math.cos(base[i - 1] * 5 + dt * .003) * .08;
    }

    if (place === 2) { // z
      arr[i] = base[i] + Math.sin(base[i - 2] * 25 + dt * .01) * .03;
    }
  });

  geometry.computeVertexNormals();
  geometry.normalizeNormals();
  geometry.attributes.position.needsUpdate = true;

  const { innerWidth: w, innerHeight: h } = window;
  renderer.setSize(w, h);
  camera.aspect = w / h;
  camera.updateProjectionMatrix();
  renderer.render(scene, camera);
};

animate();