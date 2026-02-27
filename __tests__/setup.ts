import '@testing-library/jest-dom';

// Mock RTCPeerConnection
class MockRTCPeerConnection {
  localDescription: RTCSessionDescriptionInit | null = null;
  remoteDescription: RTCSessionDescriptionInit | null = null;
  connectionState = 'new';
  ontrack: ((e: any) => void) | null = null;
  onconnectionstatechange: (() => void) | null = null;

  addTrack = jest.fn();
  createOffer = jest.fn().mockResolvedValue({ type: 'offer', sdp: 'mock-sdp' });
  createAnswer = jest.fn().mockResolvedValue({ type: 'answer', sdp: 'mock-sdp' });
  setLocalDescription = jest.fn().mockResolvedValue(undefined);
  setRemoteDescription = jest.fn().mockResolvedValue(undefined);
  close = jest.fn();
  createDataChannel = jest.fn().mockReturnValue({
    onopen: null,
    onmessage: null,
    close: jest.fn(),
    send: jest.fn(),
  });
}

Object.defineProperty(globalThis, 'RTCPeerConnection', {
  value: MockRTCPeerConnection,
  writable: true,
});

// Mock MediaStream
class MockMediaStream {
  id = 'mock-stream';
  active = true;
  getTracks = jest.fn().mockReturnValue([{ stop: jest.fn(), enabled: true, kind: 'audio' }]);
  getAudioTracks = jest.fn().mockReturnValue([{ stop: jest.fn(), enabled: true, kind: 'audio' }]);
  getVideoTracks = jest.fn().mockReturnValue([]);
  addTrack = jest.fn();
  removeTrack = jest.fn();
}

Object.defineProperty(globalThis, 'MediaStream', {
  value: MockMediaStream,
  writable: true,
});

// Mock getUserMedia
Object.defineProperty(navigator, 'mediaDevices', {
  value: {
    getUserMedia: jest.fn().mockResolvedValue(new MockMediaStream()),
    enumerateDevices: jest.fn().mockResolvedValue([]),
  },
  writable: true,
});

// Mock AudioContext
class MockAudioContext {
  state = 'running';
  createMediaStreamSource = jest.fn().mockReturnValue({
    connect: jest.fn(),
    disconnect: jest.fn(),
  });
  createAnalyser = jest.fn().mockReturnValue({
    fftSize: 256,
    getByteTimeDomainData: jest.fn(),
    connect: jest.fn(),
  });
  close = jest.fn();
}

Object.defineProperty(globalThis, 'AudioContext', {
  value: MockAudioContext,
  writable: true,
});

// Mock Audio
Object.defineProperty(globalThis, 'Audio', {
  value: jest.fn().mockImplementation(() => ({
    autoplay: false,
    srcObject: null,
    play: jest.fn().mockResolvedValue(undefined),
    pause: jest.fn(),
  })),
  writable: true,
});

// Mock window.gtag
Object.defineProperty(window, 'gtag', {
  value: jest.fn(),
  writable: true,
});

Object.defineProperty(window, 'dataLayer', {
  value: [],
  writable: true,
});

// Mock requestAnimationFrame
globalThis.requestAnimationFrame = jest.fn().mockReturnValue(1);
globalThis.cancelAnimationFrame = jest.fn();

// Mock IntersectionObserver (for framer-motion useInView)
class MockIntersectionObserver {
  observe = jest.fn();
  unobserve = jest.fn();
  disconnect = jest.fn();
  constructor(callback: any) {
    // Immediately call with all entries as intersecting
    setTimeout(() => callback([{ isIntersecting: true }]), 0);
  }
}

Object.defineProperty(globalThis, 'IntersectionObserver', {
  value: MockIntersectionObserver,
  writable: true,
});

// Mock fetch
globalThis.fetch = jest.fn().mockResolvedValue({
  ok: true,
  json: () => Promise.resolve({ ephemeral_key: 'mock-key' }),
  text: () => Promise.resolve('mock-answer-sdp'),
});

// Suppress console errors/warnings in tests
const originalError = console.error;
console.error = (...args: any[]) => {
  if (typeof args[0] === 'string' && (
    args[0].includes('act(') ||
    args[0].includes('Not implemented') ||
    args[0].includes('Error: Uncaught')
  )) return;
  originalError(...args);
};
