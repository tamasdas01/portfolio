// Type declarations for three.js examples/jsm modules
declare module 'three/examples/jsm/postprocessing/EffectComposer' {
    import { WebGLRenderer, WebGLRenderTarget } from 'three';
    export class Pass {
        enabled: boolean;
        needsSwap: boolean;
        renderToScreen: boolean;
        setSize(width: number, height: number): void;
        render(
            renderer: WebGLRenderer,
            writeBuffer: WebGLRenderTarget,
            readBuffer: WebGLRenderTarget,
            deltaTime: number,
            maskActive: boolean
        ): void;
    }
    export class EffectComposer {
        constructor(renderer: WebGLRenderer, renderTarget?: WebGLRenderTarget);
        addPass(pass: Pass): void;
        removePass(pass: Pass): void;
        render(deltaTime?: number): void;
        setSize(width: number, height: number): void;
        setPixelRatio(pixelRatio: number): void;
    }
}

declare module 'three/examples/jsm/postprocessing/RenderPass' {
    import { Scene, Camera } from 'three';
    import { Pass } from 'three/examples/jsm/postprocessing/EffectComposer';
    export class RenderPass extends Pass {
        constructor(scene: Scene, camera: Camera);
    }
}

declare module 'three/examples/jsm/postprocessing/UnrealBloomPass' {
    import { Vector2 } from 'three';
    import { Pass } from 'three/examples/jsm/postprocessing/EffectComposer';
    export class UnrealBloomPass extends Pass {
        constructor(
            resolution: Vector2,
            strength: number,
            radius: number,
            threshold: number
        );
        strength: number;
        radius: number;
        threshold: number;
    }
}
