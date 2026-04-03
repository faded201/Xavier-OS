import React, { useState, useEffect } from 'react';

/**
 * XAVIER-OS: AETHERIA (Stable Build 1.0)
 * Includes: Noiz Integration, Direct Image Assets, and UI Logic
 */

// SECURITY NOTE: In a production build on Vercel, replace this string 
// with process.env.REACT_APP_NOIZ_KEY for safety.
const NOIZ_API_KEY = "YTE0MjViMjgtNjVmMy00NzlhLWE5MmYtNTE4ZTU4YjU5MTE3JGphbWVzaGFwdXJvbmFAZ21haWwuY29t";

const XavierOS = () => {
  const [activeBook, setActiveBook] = useState(null);
  const [isAwakening, setIsAwakening] = useState(false);
  const [audioUrl, setAudioUrl] = useState(null);
  const [error, setError] = useState(null);

  // DATA: Every book mapped to its specific fixed artwork
  const bookLibrary = [
    {
      id: "vampire-system",
      title: "Vampire System",
      genre: "Grit / Progression",
      cover: "/assets/images/covers/vampire-system.webp", 
      description: "A world where leveling up costs blood. Every drop counts."
    },
    {
      id: "heavenly-thief",
      title: "Heavenly Thief",
      genre: "Celestial Heist",
      cover: "/assets/images/covers/heavenly-thief.webp",
      description: "Stealing the light of the stars from the gods themselves."
    },
    {
      id: "shadow-monarch",
      title: "Shadow Monarch",
      genre: "Dark Fantasy",
      cover: "/assets/images/covers/shadow-monarch.webp",
      description: "Arise. The shadows belong to him now."
    }
    // Add your other 147 titles here following this exact format
  ];

  const awakenBook = async (book) => {
    setError(null);
    setIsAwakening(true);
    setActiveBook(book);
    setAudioUrl(null); // Clear previous audio

    try {
      const response = await fetch("https://api.noiz.ai/v1/tts", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${NOIZ_API_KEY}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          text: `Initializing Xavier OS. Awakening ${book.title}. ${book.description}`,
          voice_id: "narrator_pro_01", 
          speed: 1.0
        })
      });

      if (!response.ok) throw new Error("Connection to Noiz failed.");

      const data = await response.json();
      setAudioUrl(data.audio_url);
    } catch (err) {
      setError("Awakening interrupted. Check System Connection.");
      console.error(err);
    } finally {
      setIsAwakening(false);
    }
  };

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <h1 style={styles.logo}>XAVIER-OS <span style={styles.accent}>AETHERIA</span></h1>
        <p style={styles.status}>SYSTEM STATUS: {isAwakening ? "PROCESSING..." : "ONLINE"}</p>
      </header>

      {activeBook && (
        <div style={styles.nowPlaying}>
          <img src={activeBook.cover} alt="Active Cover" style={styles.heroImage} />
          <div style={styles.controls}>
            <h2 style={{margin: 0}}>{activeBook.title}</h2>
            <p style={{color: '#888'}}>{activeBook.genre}</p>
            
            {isAwakening && <div className="loader">Synchronizing Aetherial Frequencies...</div>}
            {error && <p style={{color: 'red'}}>{error}</p>}
            
            {audioUrl && (
              <audio controls src={audioUrl} autoPlay style={styles.audioPlayer}>
                Your browser does not support the audio element.
              </audio>
            )}
          </div>
        </div>
      )}

      <section style={styles.grid}>
        {bookLibrary.map((book) => (
          <div key={book.id} style={styles.card} onClick={() => awakenBook(book)}>
            <div style={styles.imageWrapper}>
              <img src={book.cover} alt={book.title} style={styles.coverImage} />
              <div style={styles.overlay}>
                <span style={styles.awakenText}>AWAKEN</span>
              </div>
            </div>
            <h3 style={styles.bookTitle}>{book.title}</h3>
          </div>
        ))}
      </section>
    </div>
  );
};

const styles = {
  container: { backgroundColor: '#050505', color: '#fff', minHeight: '100vh', padding: '20px', fontFamily: '"Segoe UI", Roboto, sans-serif' },
  header: { textAlign: 'center', marginBottom: '40px', borderBottom: '1px solid #222', paddingBottom: '20px' },
  logo: { fontSize: '1.8rem', letterSpacing: '6px', margin: 0 },
  status: { fontSize: '0.6rem', color: '#00ff00', letterSpacing: '2px', marginTop: '5px' },
  accent: { color: '#ff3e3e', fontWeight: 'bold' },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: '25px' },
  card: { cursor: 'pointer', textAlign: 'center', transition: '0.3s' },
  imageWrapper: { position: 'relative', borderRadius: '8px', overflow: 'hidden', border: '1px solid #333' },
  coverImage: { width: '100%', aspectRatio: '2/3', objectFit: 'cover', display: 'block' },
  overlay: { position: 'absolute', inset: 0, backgroundColor: 'rgba(255,62,62,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: 0, transition: '0.3s' },
  awakenText: { fontWeight: 'bold', fontSize: '0.8rem', border: '1px solid white', padding: '5px 10px' },
  bookTitle: { marginTop: '12px', fontSize: '0.85rem', fontWeight: '500' },
  nowPlaying: { display: 'flex', gap: '25px', backgroundColor: '#111', padding: '25px', borderRadius: '15px', marginBottom: '40px', border: '1px solid #ff3e3e33' },
  heroImage: { width: '140px', borderRadius: '8px', boxShadow: '0 0 20px rgba(255,62,62,0.2)' },
  controls: { display: 'flex', flexDirection: 'column', justifyContent: 'center', flex: 1 },
  audioPlayer: { width: '100%', marginTop: '20px', filter: 'invert(1)' } 
};

// Required to make the component available to the rest of your app
export default XavierOS;
