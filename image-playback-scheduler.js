/**
 * IMAGE DISPLAY SYSTEM
 * Handles timing, scheduling, and display of 90+ images during audio playback
 * One image every ~15.3 seconds for 23-minute (1380 second) audiobook
 */

class ImagePlaybackScheduler {
  constructor(audioElement, onImageChange) {
    this.audioElement = audioElement;
    this.onImageChange = onImageChange;
    this.imageQueue = [];
    this.currentImageIndex = 0;
    this.imageSchedules = [];
    this.isPlaying = false;
  }

  /**
   * Load images and create schedule based on audio duration
   * @param {Array} images - Array of image data URIs with timestamps
   * @param {Number} audioDuration - Duration in seconds
   */
  loadImages(images, audioDuration) {
    this.imageQueue = images;
    this.currentImageIndex = 0;

    if (!images || images.length === 0) {
      console.warn('⚠️  [ImageScheduler] No images loaded');
      return;
    }

    const totalDuration = audioDuration || this.audioElement?.duration || 1380;
    const imageInterval = totalDuration / images.length; // Seconds between each image

    console.log(`📸 [ImageScheduler] Loaded ${images.length} images for ${totalDuration}s audio (${imageInterval.toFixed(1)}s interval)`);

    // Create schedule: when to show each image based on audio time
    this.imageSchedules = images.map((img, idx) => ({
      ...img,
      index: idx,
      showAt: idx * imageInterval, // Show at this time in audio
      duration: imageInterval
    }));
  }

  /**
   * Called during audio playback to check if we should change image
   * @param {Number} currentTime - Current audio playback time in seconds
   */
  checkAndUpdateImage(currentTime) {
    if (!this.isPlaying || this.imageSchedules.length === 0) return;

    // Find which image should be showing at this time
    const nextImageIndex = Math.floor(currentTime / (this.audioElement.duration / this.imageSchedules.length));

    if (nextImageIndex !== this.currentImageIndex && nextImageIndex < this.imageSchedules.length) {
      this.currentImageIndex = nextImageIndex;
      const imageData = this.imageSchedules[nextImageIndex];

      console.log(`📸 [ImageScheduler] Image ${nextImageIndex + 1}/${this.imageSchedules.length} (${imageData.style})`);

      if (this.onImageChange) {
        this.onImageChange(imageData);
      }
    }
  }

  /**
   * Start playback sync
   */
  play() {
    this.isPlaying = true;
    console.log('📸 [ImageScheduler] Playback started');
  }

  /**
   * Pause playback sync
   */
  pause() {
    this.isPlaying = false;
    console.log('📸 [ImageScheduler] Playback paused');
  }

  /**
   * Reset to beginning
   */
  reset() {
    this.currentImageIndex = 0;
    this.isPlaying = false;
  }

  /**
   * Get current image data
   */
  getCurrentImage() {
    return this.imageSchedules[this.currentImageIndex] || null;
  }

  /**
   * Get progress percentage
   */
  getProgress() {
    return (this.currentImageIndex / this.imageSchedules.length) * 100;
  }
}

// ============================================================================
// IMAGE GALLERY COMPONENT (React Hook)
// ============================================================================

export const useImagePlayback = (audioRef) => {
  const [images, setImages] = React.useState([]);
  const [currentImage, setCurrentImage] = React.useState(null);
  const [imageProgress, setImageProgress] = React.useState(0);
  const [isGenerating, setIsGenerating] = React.useState(false);
  const schedulerRef = React.useRef(null);

  // Initialize scheduler on mount
  React.useEffect(() => {
    if (audioRef?.current) {
      schedulerRef.current = new ImagePlaybackScheduler(
        audioRef.current,
        (imageData) => {
          setCurrentImage(imageData);
          setImageProgress(
            ((imageData.index + 1) / (images.length || 90)) * 100
          );
        }
      );
    }
  }, [audioRef]);

  // Start image generation batch
  const startImageGeneration = async (bookId, episodeNum, storyChunks, characterMemory, bookData) => {
    try {
      setIsGenerating(true);
      console.log(`🎬 [ImagePlayback] Starting generation of 90+ images...`);

      const response = await fetch('/api/images/generate-batch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          bookId,
          episodeNum,
          storyChunks,
          characterMemory,
          bookData
        })
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      const result = await response.json();
      console.log(`✅ [ImagePlayback] ${result.message}`);
      setIsGenerating(false);

      return result;
    } catch (error) {
      console.error('❌ [ImagePlayback] Generation failed:', error);
      setIsGenerating(false);
      throw error;
    }
  };

  // Load images from array/source
  const loadImages = (imageArray, audioDuration) => {
    setImages(imageArray);
    if (schedulerRef.current) {
      schedulerRef.current.loadImages(imageArray, audioDuration);
      setCurrentImage(imageArray[0] || null);
    }
  };

  // Sync with audio playback
  const handleAudioTimeUpdate = () => {
    if (audioRef?.current && schedulerRef.current) {
      schedulerRef.current.checkAndUpdateImage(audioRef.current.currentTime);
    }
  };

  const handleAudioPlay = () => {
    schedulerRef.current?.play();
  };

  const handleAudioPause = () => {
    schedulerRef.current?.pause();
  };

  const handleAudioEnded = () => {
    schedulerRef.current?.reset();
  };

  return {
    currentImage,
    imageProgress,
    images,
    isGenerating,
    startImageGeneration,
    loadImages,
    handleAudioTimeUpdate,
    handleAudioPlay,
    handleAudioPause,
    handleAudioEnded
  };
};

// ============================================================================
// IMAGE DISPLAY COMPONENT
// ============================================================================

export const ImageDisplay = ({ currentImage, imageProgress, isGenerating, bookTitle }) => {
  return (
    <div style={{
      position: 'relative',
      width: '100%',
      aspectRatio: '16/9',
      backgroundColor: '#000',
      overflow: 'hidden',
      borderRadius: '16px',
      boxShadow: '0 20px 60px rgba(0, 255, 204, 0.2)'
    }}>
      {/* Main Image */}
      {currentImage?.dataUri ? (
        <img
          src={currentImage.dataUri}
          alt={`${bookTitle} - Image ${currentImage.index + 1}`}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            animation: 'fadeIn 0.8s ease-in'
          }}
        />
      ) : isGenerating ? (
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100%',
          color: '#00ffcc',
          fontSize: '18px',
          gap: '20px'
        }}>
          <div style={{
            fontSize: '48px',
            animation: 'spin 2s linear infinite'
          }}>🎬</div>
          <div>Generating 90+ images...</div>
          <div style={{ fontSize: '14px', opacity: 0.7 }}>
            ~8-12 minutes • Images will display during playback
          </div>
        </div>
      ) : (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100%',
          color: '#666',
          fontSize: '16px'
        }}>
          Preparing story visuals...
        </div>
      )}

      {/* Image Counter Overlay */}
      {currentImage && (
        <div style={{
          position: 'absolute',
          top: '20px',
          right: '20px',
          backgroundColor: 'rgba(0, 0, 0, 0.7)',
          color: '#00ffcc',
          padding: '12px 20px',
          borderRadius: '8px',
          fontSize: '14px',
          fontWeight: 'bold',
          backdropFilter: 'blur(10px)'
        }}>
          {currentImage.index + 1} / 90
        </div>
      )}

      {/* Style Badge */}
      {currentImage?.style && (
        <div style={{
          position: 'absolute',
          top: '20px',
          left: '20px',
          backgroundColor: 'rgba(0, 255, 204, 0.2)',
          color: '#00ffcc',
          padding: '8px 16px',
          borderRadius: '20px',
          fontSize: '12px',
          textTransform: 'uppercase',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(0, 255, 204, 0.3)'
        }}>
          {currentImage.style}
        </div>
      )}

      {/* Progress Bar */}
      <div style={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        width: `${imageProgress}%`,
        height: '4px',
        backgroundColor: '#00ffcc',
        transition: 'width 0.3s ease'
      }} />

      {/* Fade Animation */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default ImagePlaybackScheduler;
