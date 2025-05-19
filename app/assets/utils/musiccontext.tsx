import React, { createContext, useContext, useEffect, useRef, useState } from "react";
import { Audio, AVPlaybackStatus } from "expo-av";
import { BGM1, BGM2, BGM3 } from "../../../assets/audio/bgm";

const tracks = [BGM1, BGM2, BGM3];

type MusicContextType = {
  musicVolume: number;
  setMusicVolume: (v: number) => void;
  trackIndex: number;
  nextTrack: () => void;
};

const MusicContext = createContext<MusicContextType | undefined>(undefined);

export const MusicProvider = ({ children }: { children: React.ReactNode }) => {
  const soundRef = useRef<Audio.Sound | null>(null);
  const [trackIndex, setTrackIndex] = useState(0);
  const [musicVolume, setMusicVolume] = useState(0.5);
  const hasStarted = useRef(false);

  const loadAndPlayTrack = async (index: number) => {
    try {
      if (soundRef.current) {
        await soundRef.current.unloadAsync();
      }
      const { sound } = await Audio.Sound.createAsync(
        tracks[index],
        { shouldPlay: true, isLooping: false, volume: musicVolume },
        onPlaybackStatusUpdate
      );
      soundRef.current = sound;
    } catch (error) {
      console.error("Error loading track:", error);
    }
  };

  const onPlaybackStatusUpdate = (status: AVPlaybackStatus) => {
    if (!status.isLoaded) return;
    if (status.didJustFinish && !status.isLooping) {
      const nextIndex = (trackIndex + 1) % tracks.length;
      setTrackIndex(nextIndex);
    }
  };

  useEffect(() => {
    if (hasStarted.current) return;
    hasStarted.current = true;

    loadAndPlayTrack(trackIndex);

    return () => {
      soundRef.current?.unloadAsync();
    };
  }, []);

  useEffect(() => {
    if (!hasStarted.current) return;

    loadAndPlayTrack(trackIndex);
  }, [trackIndex]);

  // Update volume on change
  useEffect(() => {
    if (soundRef.current) {
      soundRef.current.setVolumeAsync(musicVolume);
    }
  }, [musicVolume]);

  const nextTrack = () => {
    setTrackIndex((i) => (i + 1) % tracks.length);
  };

  return (
    <MusicContext.Provider
      value={{
        musicVolume,
        setMusicVolume,
        trackIndex,
        nextTrack,
      }}
    >
      {children}
    </MusicContext.Provider>
  );
};

export const useMusic = () => {
  const context = useContext(MusicContext);
  if (!context) throw new Error("useMusic must be used within MusicProvider");
  return context;
};
