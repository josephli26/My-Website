import React, { useState, useRef, useEffect } from "react";
import { Play, Pause, Volume2, VolumeX, Maximize, RotateCcw, Repeat } from "lucide-react";
import { useCMS } from "../context/CMSContext";

interface CustomVideoPlayerProps {
  src: string;
  poster?: string;
  className?: string;
  title?: string;
  autoPlay?: boolean;
  loop?: boolean;
}

export function CustomVideoPlayer({
  src,
  poster,
  className = "",
  title,
  autoPlay = false,
  loop = true,
}: CustomVideoPlayerProps) {
  const { data } = useCMS();
  const primaryColor = data?.design?.colors?.primary || "#8cff2e";

  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const [isPlaying, setIsPlaying] = useState(autoPlay);
  const [isLooping, setIsLooping] = useState(loop);
  const [progress, setProgress] = useState(0); // 0 to 100
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const controlsTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleTimeUpdate = () => {
      if (video.duration) {
        setCurrentTime(video.currentTime);
        setDuration(video.duration);
        setProgress((video.currentTime / video.duration) * 100);
      }
    };

    const handleLoadedMetadata = () => {
      setDuration(video.duration);
    };

    const handleEnded = () => {
      if (!isLooping) {
        setIsPlaying(false);
      }
    };

    video.addEventListener("timeupdate", handleTimeUpdate);
    video.addEventListener("loadedmetadata", handleLoadedMetadata);
    video.addEventListener("ended", handleEnded);

    return () => {
      video.removeEventListener("timeupdate", handleTimeUpdate);
      video.removeEventListener("loadedmetadata", handleLoadedMetadata);
      video.removeEventListener("ended", handleEnded);
    };
  }, [isLooping]);

  const togglePlay = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      videoRef.current.play().catch(() => {});
      setIsPlaying(true);
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.stopPropagation();
    if (!videoRef.current || !duration) return;
    const newTime = (parseFloat(e.target.value) / 100) * duration;
    videoRef.current.currentTime = newTime;
    setProgress(parseFloat(e.target.value));
  };

  const toggleMute = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (!videoRef.current) return;
    videoRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.stopPropagation();
    if (!videoRef.current) return;
    const val = parseFloat(e.target.value);
    setVolume(val);
    videoRef.current.volume = val;
    setIsMuted(val === 0);
  };

  const toggleFullscreen = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().catch(() => {});
    } else {
      document.exitFullscreen().catch(() => {});
    }
  };

  const handleRestart = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (!videoRef.current) return;
    videoRef.current.currentTime = 0;
    videoRef.current.play().catch(() => {});
    setIsPlaying(true);
  };

  const toggleLoop = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setIsLooping(!isLooping);
  };

  const formatTime = (timeInSec: number) => {
    if (isNaN(timeInSec)) return "0:00";
    const mins = Math.floor(timeInSec / 60);
    const secs = Math.floor(timeInSec % 60);
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  const handleMouseMove = () => {
    setShowControls(true);
    if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current);
    controlsTimeoutRef.current = setTimeout(() => {
      if (isPlaying) setShowControls(false);
    }, 2500);
  };

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => isPlaying && setShowControls(false)}
      onClick={(e) => e.stopPropagation()}
      className={`relative group bg-neutral-950 rounded-xl overflow-hidden border border-white/10 shadow-2xl flex items-center justify-center select-none ${className}`}
    >
      <video
        ref={videoRef}
        src={src}
        poster={poster}
        autoPlay={autoPlay}
        loop={isLooping}
        playsInline
        onClick={(e) => togglePlay(e)}
        className="w-full h-full object-contain cursor-pointer"
      />

      {/* Center Big Play Button Overlay when paused */}
      {!isPlaying && (
        <div
          onClick={(e) => togglePlay(e)}
          className="absolute inset-0 bg-black/40 backdrop-blur-[2px] flex items-center justify-center cursor-pointer transition-opacity duration-300"
        >
          <div
            className="w-16 h-16 sm:w-20 sm:h-20 rounded-full flex items-center justify-center shadow-xl transition-transform duration-300 group-hover:scale-110"
            style={{
              backgroundColor: primaryColor,
              color: "#000",
              boxShadow: `0 0 30px ${primaryColor}66`,
            }}
          >
            <Play size={32} className="ml-1 fill-black text-black" />
          </div>
        </div>
      )}

      {/* Control Bar Overlay */}
      <div
        onClick={(e) => e.stopPropagation()}
        className={`absolute bottom-0 left-0 right-0 p-3 sm:p-4 bg-gradient-to-t from-black/95 via-black/70 to-transparent transition-opacity duration-300 flex flex-col gap-2 ${
          showControls || !isPlaying ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      >
        {/* Progress Seekbar */}
        <div className="relative w-full flex items-center group/seekbar cursor-pointer">
          <input
            type="range"
            min="0"
            max="100"
            value={progress}
            onChange={handleSeek}
            onClick={(e) => e.stopPropagation()}
            className="w-full h-1.5 bg-white/20 rounded-lg appearance-none cursor-pointer outline-none focus:outline-none"
            style={{
              accentColor: primaryColor,
              background: `linear-gradient(to right, ${primaryColor} ${progress}%, rgba(255, 255, 255, 0.2) ${progress}%)`,
            }}
          />
        </div>

        {/* Buttons and Time */}
        <div className="flex items-center justify-between text-white text-xs font-mono pt-1">
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              type="button"
              onClick={(e) => togglePlay(e)}
              className="p-1.5 rounded-lg hover:bg-white/10 transition-colors text-white cursor-pointer"
              title={isPlaying ? "Pause" : "Play"}
            >
              {isPlaying ? <Pause size={18} /> : <Play size={18} />}
            </button>

            <button
              type="button"
              onClick={(e) => handleRestart(e)}
              className="p-1.5 rounded-lg hover:bg-white/10 transition-colors text-white/80 hover:text-white cursor-pointer"
              title="Restart Video"
            >
              <RotateCcw size={15} />
            </button>

            {/* Loop Toggle Button */}
            <button
              type="button"
              onClick={(e) => toggleLoop(e)}
              className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                isLooping
                  ? "bg-white/20 text-white font-bold"
                  : "hover:bg-white/10 text-white/40 hover:text-white"
              }`}
              title={isLooping ? "Loop Enabled (Click to disable)" : "Loop Disabled (Click to enable)"}
            >
              <Repeat size={16} />
            </button>

            <span className="text-[11px] text-white/80 font-mono tracking-wider ml-1">
              {formatTime(currentTime)} / {formatTime(duration)}
            </span>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            {/* Volume control */}
            <div className="flex items-center gap-1.5 group/vol">
              <button
                type="button"
                onClick={(e) => toggleMute(e)}
                className="p-1.5 rounded-lg hover:bg-white/10 transition-colors text-white cursor-pointer"
                title={isMuted ? "Unmute" : "Mute"}
              >
                {isMuted || volume === 0 ? <VolumeX size={18} /> : <Volume2 size={18} />}
              </button>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={isMuted ? 0 : volume}
                onChange={handleVolumeChange}
                onClick={(e) => e.stopPropagation()}
                className="w-16 h-1 rounded appearance-none cursor-pointer outline-none hidden sm:block"
                style={{
                  accentColor: "#ffffff",
                  background: `linear-gradient(to right, #ffffff ${(isMuted ? 0 : volume) * 100}%, rgba(255, 255, 255, 0.2) ${(isMuted ? 0 : volume) * 100}%)`,
                }}
              />
            </div>

            {/* Fullscreen button */}
            <button
              type="button"
              onClick={(e) => toggleFullscreen(e)}
              className="p-1.5 rounded-lg hover:bg-white/10 transition-colors text-white cursor-pointer"
              title="Toggle Fullscreen"
            >
              <Maximize size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
