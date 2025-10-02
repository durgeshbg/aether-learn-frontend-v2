import { useState, useEffect, useCallback } from "react";

interface DocumentWithFullscreen extends Document {
  mozFullScreenElement?: Element;
  msFullscreenElement?: Element;
  webkitFullscreenElement?: Element;
  mozCancelFullScreen?: () => Promise<void>;
  msExitFullscreen?: () => Promise<void>;
  webkitExitFullscreen?: () => Promise<void>;
}

interface ElementWithFullscreen extends Element {
  mozRequestFullScreen?: () => Promise<void>;
  msRequestFullscreen?: () => Promise<void>;
  webkitRequestFullscreen?: () => Promise<void>;
}

const useFullscreen = () => {
  const [isFullscreen, setIsFullscreen] = useState(false);

  const checkFullscreenStatus = useCallback(() => {
    const doc = document as DocumentWithFullscreen;
    return Boolean(
      doc.fullscreenElement ||
        doc.webkitFullscreenElement ||
        doc.mozFullScreenElement ||
        doc.msFullscreenElement,
    );
  }, []);

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(checkFullscreenStatus());
    };

    const events = [
      "fullscreenchange",
      "webkitfullscreenchange",
      "mozfullscreenchange",
      "msfullscreenchange",
    ];

    events.forEach((event) => {
      document.addEventListener(event, handleFullscreenChange);
    });

    setIsFullscreen(checkFullscreenStatus());

    return () => {
      events.forEach((event) => {
        document.removeEventListener(event, handleFullscreenChange);
      });
    };
  }, [checkFullscreenStatus]);

  const enterFullscreen = useCallback(async () => {
    const element = document.documentElement as ElementWithFullscreen;

    try {
      if (element.requestFullscreen) {
        await element.requestFullscreen();
      } else if (element.webkitRequestFullscreen) {
        await element.webkitRequestFullscreen();
      } else if (element.mozRequestFullScreen) {
        await element.mozRequestFullScreen();
      } else if (element.msRequestFullscreen) {
        await element.msRequestFullscreen();
      }
    } catch (error) {
      console.error("Failed to enter fullscreen:", error);
    }
  }, []);

  const exitFullscreen = useCallback(async () => {
    const doc = document as DocumentWithFullscreen;

    try {
      if (doc.exitFullscreen) {
        await doc.exitFullscreen();
      } else if (doc.webkitExitFullscreen) {
        await doc.webkitExitFullscreen();
      } else if (doc.mozCancelFullScreen) {
        await doc.mozCancelFullScreen();
      } else if (doc.msExitFullscreen) {
        await doc.msExitFullscreen();
      }
    } catch (error) {
      console.error("Failed to exit fullscreen:", error);
    }
  }, []);

  return {
    isFullscreen,
    enterFullscreen,
    exitFullscreen,
  };
};

export default useFullscreen;
