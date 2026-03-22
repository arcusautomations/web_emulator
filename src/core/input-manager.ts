import { DEFAULT_KEYBOARD_MAP } from '@/lib/constants';
import type { RetroButton, InputState } from '@/types';

export class InputManager {
  private keyboardState: Map<RetroButton, boolean> = new Map();
  private gamepadState: Map<RetroButton, boolean> = new Map();
  private touchState: Map<RetroButton, boolean> = new Map();
  private keyMap: Record<string, string>;
  private deadzone: number;
  private animFrameId: number | null = null;
  private onGamepadConnected: ((e: GamepadEvent) => void) | null = null;
  private onGamepadDisconnected: ((e: GamepadEvent) => void) | null = null;
  private connectedGamepads: Set<number> = new Set();

  constructor(keyMap?: Record<string, string>, deadzone = 0.15) {
    this.keyMap = keyMap ?? DEFAULT_KEYBOARD_MAP;
    this.deadzone = deadzone;
  }

  start(): void {
    // Keyboard listeners
    document.addEventListener('keydown', this.handleKeyDown);
    document.addEventListener('keyup', this.handleKeyUp);

    // Gamepad listeners
    this.onGamepadConnected = (e: GamepadEvent) => {
      this.connectedGamepads.add(e.gamepad.index);
    };
    this.onGamepadDisconnected = (e: GamepadEvent) => {
      this.connectedGamepads.delete(e.gamepad.index);
      this.gamepadState.clear();
    };
    window.addEventListener('gamepadconnected', this.onGamepadConnected);
    window.addEventListener('gamepaddisconnected', this.onGamepadDisconnected);

    // Check for already-connected gamepads
    const gamepads = navigator.getGamepads();
    for (const gp of gamepads) {
      if (gp) this.connectedGamepads.add(gp.index);
    }

    // Start polling gamepad
    this.pollGamepad();
  }

  stop(): void {
    document.removeEventListener('keydown', this.handleKeyDown);
    document.removeEventListener('keyup', this.handleKeyUp);

    if (this.onGamepadConnected) {
      window.removeEventListener('gamepadconnected', this.onGamepadConnected);
    }
    if (this.onGamepadDisconnected) {
      window.removeEventListener('gamepaddisconnected', this.onGamepadDisconnected);
    }

    if (this.animFrameId !== null) {
      cancelAnimationFrame(this.animFrameId);
      this.animFrameId = null;
    }
  }

  // Touch controls call these methods to update state
  setTouchButton(button: RetroButton, pressed: boolean): void {
    this.touchState.set(button, pressed);
  }

  clearTouchState(): void {
    this.touchState.clear();
  }

  // Get unified input state (keyboard OR gamepad OR touch)
  poll(): InputState {
    const buttons: Record<string, boolean> = {};
    const allButtons: RetroButton[] = [
      'up',
      'down',
      'left',
      'right',
      'a',
      'b',
      'x',
      'y',
      'l',
      'r',
      'start',
      'select',
    ];

    for (const btn of allButtons) {
      buttons[btn] = !!(
        this.keyboardState.get(btn) ||
        this.gamepadState.get(btn) ||
        this.touchState.get(btn)
      );
    }

    return {
      buttons: buttons as Record<RetroButton, boolean>,
      turbo: {} as Record<RetroButton, boolean>,
    };
  }

  get hasGamepad(): boolean {
    return this.connectedGamepads.size > 0;
  }

  updateKeyMap(newMap: Record<string, string>): void {
    this.keyMap = newMap;
  }

  updateDeadzone(newDeadzone: number): void {
    this.deadzone = newDeadzone;
  }

  private handleKeyDown = (e: KeyboardEvent): void => {
    const button = this.keyMap[e.key] as RetroButton | undefined;
    if (button) {
      e.preventDefault();
      this.keyboardState.set(button, true);
    }
  };

  private handleKeyUp = (e: KeyboardEvent): void => {
    const button = this.keyMap[e.key] as RetroButton | undefined;
    if (button) {
      e.preventDefault();
      this.keyboardState.set(button, false);
    }
  };

  private pollGamepad = (): void => {
    if (this.connectedGamepads.size > 0) {
      const gamepads = navigator.getGamepads();
      for (const index of this.connectedGamepads) {
        const gp = gamepads[index];
        if (!gp) continue;

        // Standard mapping (Xbox/PS/Switch Pro layout)
        // Buttons
        this.gamepadState.set('a', gp.buttons[0]?.pressed ?? false);
        this.gamepadState.set('b', gp.buttons[1]?.pressed ?? false);
        this.gamepadState.set('x', gp.buttons[2]?.pressed ?? false);
        this.gamepadState.set('y', gp.buttons[3]?.pressed ?? false);
        this.gamepadState.set('l', gp.buttons[4]?.pressed ?? false);
        this.gamepadState.set('r', gp.buttons[5]?.pressed ?? false);
        this.gamepadState.set('select', gp.buttons[8]?.pressed ?? false);
        this.gamepadState.set('start', gp.buttons[9]?.pressed ?? false);

        // D-pad (buttons 12-15) OR left stick with deadzone
        const dpadUp = gp.buttons[12]?.pressed ?? false;
        const dpadDown = gp.buttons[13]?.pressed ?? false;
        const dpadLeft = gp.buttons[14]?.pressed ?? false;
        const dpadRight = gp.buttons[15]?.pressed ?? false;

        // Left stick
        const lx = gp.axes[0] ?? 0;
        const ly = gp.axes[1] ?? 0;
        const stickUp = ly < -this.deadzone;
        const stickDown = ly > this.deadzone;
        const stickLeft = lx < -this.deadzone;
        const stickRight = lx > this.deadzone;

        this.gamepadState.set('up', dpadUp || stickUp);
        this.gamepadState.set('down', dpadDown || stickDown);
        this.gamepadState.set('left', dpadLeft || stickLeft);
        this.gamepadState.set('right', dpadRight || stickRight);

        break; // Use first connected gamepad only
      }
    }

    this.animFrameId = requestAnimationFrame(this.pollGamepad);
  };
}
