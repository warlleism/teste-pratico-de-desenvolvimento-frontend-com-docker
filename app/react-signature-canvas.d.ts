declare module 'react-signature-canvas' {
    import * as React from 'react';
  
    export interface ReactSignatureCanvasProps {
      canvasProps?: React.CanvasHTMLAttributes<HTMLCanvasElement>;
      clearOnResize?: boolean;
      velocityFilterWeight?: number;
      minWidth?: number;
      maxWidth?: number;
      minDistance?: number;
      dotSize?: number | (() => number);
      penColor?: string;
      throttle?: number;
      onEnd?: () => void;
      onBegin?: () => void;
    }
  
    export default class ReactSignatureCanvas extends React.Component<ReactSignatureCanvasProps> {
      clear: () => void;
      fromDataURL: (dataUrl: string, options?: { width?: number; height?: number }) => void;
      toDataURL: (type?: string, encoderOptions?: number) => string;
      getCanvas: () => HTMLCanvasElement | null;
      getTrimmedCanvas: () => HTMLCanvasElement | null;
      off: () => void;
      on: () => void;
    }
  }