"use client";

import { useState } from "react";

export default function Home() {
  const [story, setStory] = useState("");

  const generateStory = async () => {
    const res = await fetch("/api/generate");
    const data = await res.json();
    setStory(data.chapter);
  };

  return (
    <main style={{ padding: 20 }}>
      <h1>Xavier OS</h1>

      <button onClick={generateStory}>
        Generate Chapter
      </button>

      <p>{story}</p>
    </main>
  );
}
