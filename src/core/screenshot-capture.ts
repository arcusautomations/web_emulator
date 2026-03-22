export class ScreenshotCapture {
  static async captureScreenshot(canvas: HTMLCanvasElement): Promise<Blob | null> {
    return new Promise((resolve) => {
      canvas.toBlob((blob) => resolve(blob), 'image/png');
    });
  }

  static async captureThumbnail(canvas: HTMLCanvasElement, maxWidth = 320): Promise<Blob | null> {
    // Create a smaller canvas for thumbnails
    const thumbCanvas = document.createElement('canvas');
    const scale = maxWidth / canvas.width;
    thumbCanvas.width = maxWidth;
    thumbCanvas.height = Math.round(canvas.height * scale);

    const ctx = thumbCanvas.getContext('2d');
    if (!ctx) return null;

    ctx.imageSmoothingEnabled = false; // Pixel-perfect scaling
    ctx.drawImage(canvas, 0, 0, thumbCanvas.width, thumbCanvas.height);

    return new Promise((resolve) => {
      thumbCanvas.toBlob((blob) => resolve(blob), 'image/png');
    });
  }

  static async copyToClipboard(blob: Blob): Promise<boolean> {
    try {
      await navigator.clipboard.write([new ClipboardItem({ 'image/png': blob })]);
      return true;
    } catch {
      return false;
    }
  }

  static downloadScreenshot(blob: Blob, filename: string): void {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }
}
