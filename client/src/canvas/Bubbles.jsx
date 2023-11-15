import React,{useEffect,useRef} from 'react'
import { useLoader } from 'react-three-fiber'
import {GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader'
import { motion } from 'framer-motion'

function Bubbles() {
  const gltf = useLoader(
    GLTFLoader,
    "/bubbles.glb"
  );
  const modelRef = useRef();
  useEffect(() => {
    gltf.scene.traverse((o) => {
        if (o.isMesh) {
        o.castShadow = true;
        o.receiveShadow = true;
        if (o.material.map) o.material.map.anisotropy = 16;
        }
    });
    },gltf)
  return (
    <div>
        <motion.group 
        rotation={[0,0.2,0]}
        position={[3.5,1,0]}
        ref={modelRef}
        >
            <primitive object={gltf.scene}/>
            </motion.group>
        </div>
  )
}

export default Bubbles


// import React, {useEffect, useRef} from 'react'
// import { useLoader } from 'react-three-fiber'
// import {GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader'
// import { motion } from 'framer-motion'


// function Car(){
//   const gltf = useLoader(
//     GLTFLoader,
//     "/car.glb"
//   );
//   const modelRef = useRef();

//   useEffect(() => {
//     const handleScroll = () => {
//       const scrollPosition = window.scrollY;
//       if(scrollPosition<650){
//         const rotationYValue = scrollPosition * 0.003; // Adjust the value as needed
//         const positionYValue = -scrollPosition * 0.006; // Adjust the value as needed
//         const positionXValue = -scrollPosition * 0.001; // Adjust the value as needed
//         const positionZValue = scrollPosition * 0.008; // Adjust the value as needed
//         // Apply animation to the model
//         if (modelRef.current) {
//           modelRef.current.rotation.y = rotationYValue+0.2;
//           // modelRef.current.rotation.x = rotationXValue+0.05;
//           modelRef.current.position.y = positionYValue+1;
//           modelRef.current.position.x = positionXValue+3.5;
//           modelRef.current.position.z = positionZValue;

//         }
//       }
      

      
//     };
//     window.addEventListener('scroll', handleScroll);
//     return () => {
//       window.removeEventListener('scroll', handleScroll);
//     };
//   }, []);
//   useEffect(() => {
//     gltf.scene.traverse((o) => {
//       if (o.isMesh) {
//         o.castShadow = true;
//         o.receiveShadow = true;
//         if (o.material.map) o.material.map.anisotropy = 16;
//       }
//     });
//   },gltf)
//   return (
//     <motion.group 
//       rotation={[0,0.2,0]}
//       position={[3.5,1,0]}
//       ref={modelRef}
//     >
//       <primitive object={gltf.scene}/>
//     </motion.group>
//   );
// }


// export default Car
