import { useEffect, useRef, useState } from 'react';
import { Camera, CameraOff, Mic, MicOff } from 'lucide-react';

interface UserWebcamProps {
  isCameraOn: boolean;
  onToggleCamera: () => void;
  isMicActive: boolean;
  micVolume: number; // 0 to 100
}

export const UserWebcam: React.FC<UserWebcamProps> = ({
  isCameraOn,
  onToggleCamera,
  isMicActive,
  micVolume,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [cameraError, setCameraError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    const startCamera = async () => {
      if (!isCameraOn) {
        if (streamRef.current) {
          streamRef.current.getTracks().forEach((track) => track.stop());
          streamRef.current = null;
        }
        if (videoRef.current) {
          videoRef.current.srcObject = null;
        }
        return;
      }

      try {
        setCameraError(null);
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { width: { ideal: 640 }, height: { ideal: 480 }, facingMode: 'user' },
        });

        if (!active) {
          stream.getTracks().forEach((track) => track.stop());
          return;
        }

        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (err: any) {
        console.warn('Camera access issue:', err);
        setCameraError('Camera unavailable');
      }
    };

    startCamera();

    return () => {
      active = false;
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }
    };
  }, [isCameraOn]);

  return (
    <div className="relative group w-44 sm:w-56 aspect-[4/3] rounded-2xl overflow-hidden bg-slate-900/90 border border-slate-700/80 shadow-2xl backdrop-blur-xl transition-all duration-300">
      {/* Video Feed */}
      {isCameraOn && !cameraError ? (
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className="w-full h-full object-cover transform -scale-x-100"
        />
      ) : (
        <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-slate-900 to-slate-950 text-slate-400 p-3 text-center">
          <div className="w-12 h-12 rounded-full bg-slate-800/90 border border-slate-700 flex items-center justify-center text-xl mb-1 shadow-inner">
            👤
          </div>
          <span className="text-xs font-semibold text-slate-300">You (Student)</span>
          <span className="text-[10px] text-slate-500">Camera Off</span>
        </div>
      )}

      {/* Real-time Audio Level Bar at bottom */}
      <div className="absolute bottom-2 left-2 right-2 h-1.5 bg-slate-800/80 rounded-full overflow-hidden border border-slate-700/50 backdrop-blur-sm">
        <div
          className={`h-full transition-all duration-75 ${
            isMicActive ? 'bg-gradient-to-r from-emerald-500 to-teal-400' : 'bg-slate-600'
          }`}
          style={{ width: `${isMicActive ? Math.max(10, micVolume) : 0}%` }}
        />
      </div>

      {/* Top Bar Badges */}
      <div className="absolute top-2 left-2 right-2 flex items-center justify-between pointer-events-none">
        <div className="px-2 py-0.5 rounded-full bg-black/60 backdrop-blur-md border border-white/10 text-[10px] font-semibold text-white flex items-center gap-1.5">
          <span className={`w-1.5 h-1.5 rounded-full ${isMicActive ? 'bg-emerald-400 animate-pulse' : 'bg-slate-400'}`} />
          <span>You</span>
        </div>

        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleCamera();
          }}
          className="pointer-events-auto p-1.5 rounded-full bg-black/60 hover:bg-black/90 backdrop-blur-md border border-white/10 text-white transition-all hover:scale-105 active:scale-95 shadow"
          title={isCameraOn ? 'Turn Camera Off' : 'Turn Camera On'}
        >
          {isCameraOn ? <Camera className="w-3 h-3" /> : <CameraOff className="w-3 h-3 text-rose-400" />}
        </button>
      </div>

      {/* Mic Status Indicator Badge */}
      <div className="absolute bottom-4 right-2 pointer-events-none">
        <div
          className={`p-1 rounded-full backdrop-blur-md border ${
            isMicActive
              ? 'bg-emerald-500/80 border-emerald-400 text-white shadow-lg shadow-emerald-500/40'
              : 'bg-black/60 border-white/10 text-slate-400'
          }`}
        >
          {isMicActive ? <Mic className="w-2.5 h-2.5" /> : <MicOff className="w-2.5 h-2.5" />}
        </div>
      </div>
    </div>
  );
};
