import React, {useEffect,useState} from 'react'
import { OrbitControls, PerspectiveCamera } from '@react-three/drei'
import Bubbles from './Bubbles'
function BubblesModel() {
  const [scrollPosition, setScrollPosition] = useState(0);
  useEffect(() => {
    const handleScroll = () => {
      // Calculate animation values based on scroll position
      const scrollPosition = window.scrollY;
      setScrollPosition(scrollPosition);
    };
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);
  return (
    <>
        {/* <OrbitControls target={[scrollPosition*0.02, scrollPosition*0.003, scrollPosition*0.01]} maxPolarAngle={1.3} minPolarAngle={1.4} minAzimuthAngle={0.9} maxAzimuthAngle={1}/> */}
        {/* <PerspectiveCamera makeDefault fov={50} position={[scrollPosition*0.01+7, scrollPosition*0.005+5, scrollPosition*0.005+5]} /> */}
        {/* <color attach="background" args={[0,0,0]} /> */}
        <Bubbles />
        <spotLight 
            position={[20, 20, 0]} 
            color="white"
            intensity={10}
            angle={0.5}
            castShadow
            shadow-bias={-0.0001}
            penumbra={0.05}
        />
    </>
  )
}

export default BubblesModel