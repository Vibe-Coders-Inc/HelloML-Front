import React, { forwardRef } from 'react';

const Lottie = forwardRef<any, any>(function Lottie(props, ref) {
  return <div data-testid="lottie-animation" style={props.style} />;
});

Lottie.displayName = 'Lottie';

export default Lottie;
export type LottieRefCurrentProps = {
  setSpeed: (speed: number) => void;
  play: () => void;
  pause: () => void;
  stop: () => void;
};
