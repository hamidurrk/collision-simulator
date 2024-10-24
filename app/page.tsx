"use client";
import Image from "next/image";
import PhysicsPage from "../pages/physics"
export default function Home() {
  return (
    <>
    <PhysicsPage 
      worldWidth={400}
      worldHeight={600}
    />
    </>
  );
}
