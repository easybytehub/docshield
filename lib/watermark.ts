const MAX_WIDTH = 2500;  // Ancho máximo permitido
const MAX_HEIGHT = 2500; // Alto máximo permitido

/**
 * Resize Image to a Safe Limit
 * Reduces the resolution of an image while maintaining aspect ratio.
 *
 * @param img - The original image element.
 * @returns A resized canvas with the scaled-down image.
 */
const resizeImage = (img: HTMLImageElement): HTMLCanvasElement => {
    const tempCanvas = document.createElement("canvas");
    const ctx = tempCanvas.getContext("2d");
    if (!ctx) return tempCanvas;

    let width = img.width;
    let height = img.height;

    // ⬇️ Aplicar resize si alguna dimensión supera el máximo permitido
    if (width > MAX_WIDTH || height > MAX_HEIGHT) {
        const scaleFactor = Math.min(MAX_WIDTH / width, MAX_HEIGHT / height);
        width = Math.round(width * scaleFactor);
        height = Math.round(height * scaleFactor);
    }

    tempCanvas.width = width;
    tempCanvas.height = height;
    ctx.drawImage(img, 0, 0, width, height);

    return tempCanvas;
};

/**
 * Main Function: processImage
 * - Reduces image resolution if necessary.
 * - Draws the image on a canvas with a white background.
 * - Renders fixed text and a wavy watermark.
 * - Applies a grayscale mask via a scribble pattern.
 * - Embeds a verification QR code (assumed to be drawn elsewhere).
 * - Returns a preview of the final image as a data URL.
 */
export const processImage = async (
    img: HTMLImageElement,
    watermarkText: string,
    canvas: HTMLCanvasElement,
    setPreview: (url: string) => void
): Promise<void> => {
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Set up dimensions for the image and canvas.
    const resizedCanvas = resizeImage(img);
    const imgWidth = resizedCanvas.width;
    const imgHeight = resizedCanvas.height;

    // Ajustar tamaño del canvas
    const canvasWidth = imgWidth * 1.1;
    const canvasHeight = imgHeight * 1.25;
    canvas.width = canvasWidth;
    canvas.height = canvasHeight;

    // Fill the canvas background with white and center the image.
    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);
    const imgX = (canvasWidth - imgWidth) / 2;
    // Use 15% of the extra height as top padding.
    const imgY = (canvasHeight - imgHeight) * 0.15;
    ctx.drawImage(resizedCanvas, imgX, imgY, imgWidth, imgHeight);

    // Configure font settings for the fixed text below the image.
    const fontSize = Math.max(14, Math.min(imgWidth, imgHeight) / 50);
    ctx.font = `bold ${fontSize}px Arial`;
    ctx.fillStyle = "black";
    ctx.textAlign = "start";

    // Calculate vertical positions for the watermark and website texts.
    const watermarkTop = imgY + imgHeight + fontSize * 1.5;
    const websiteTop = watermarkTop + fontSize * 2;

    // Wrap the watermark text and render each line.
    const wrappedLines = wrapText(watermarkText, canvasWidth * 0.9, fontSize);
    wrappedLines.forEach((line, index) => {
        ctx.fillText(line, canvasWidth * 0.05, watermarkTop + index * fontSize * 1.2);
    });
    ctx.font = `${fontSize}px Arial`;
    ctx.fillText("Protect your documents with DocShield.", canvasWidth * 0.05, websiteTop);

    // Apply the wavy watermark using a repeated, uppercased text.
    const finalWatermarkText = `✧ ${watermarkText}`.toUpperCase();
    applyWatermark(ctx, canvasWidth, canvasHeight, finalWatermarkText);

    // Apply a grayscale mask using a scribble pattern.
    applyGrayscaleMask(ctx, canvasWidth, canvasHeight);

    // Return the final preview (with QR code assumed to be embedded).
    setPreview(canvas.toDataURL("image/png"));
};

/**
 * Wrap Text Utility
 * Splits a string into multiple lines so that each line does not exceed maxWidth.
 *
 * @param text - The text to wrap.
 * @param maxWidth - Maximum width (in pixels) allowed for each line.
 * @param fontSize - The font size used to estimate the average character width.
 * @returns An array of text lines.
 */
const wrapText = (text: string, maxWidth: number, fontSize: number): string[] => {
    const words = text.trim().split(/\s+/);
    const lines: string[] = [];
    let currentLine = "";
    // Estimate the average character width (rough estimation).
    const charWidth = fontSize * 0.55;

    words.forEach((word) => {
        const testLine = currentLine ? `${currentLine} ${word}` : word;
        const testWidth = testLine.length * charWidth;
        if (testWidth > maxWidth) {
            if (currentLine) lines.push(currentLine);
            currentLine = word;
        } else {
            currentLine = testLine;
        }
    });
    if (currentLine) lines.push(currentLine);
    return lines;
};

/**
 * Apply Grayscale Mask
 * Uses a scribble pattern as a mask to convert parts of the image to grayscale.
 *
 * For each pixel in the canvas, if the corresponding mask pixel is black,
 * the color is converted to grayscale using the luminosity method.
 *
 * @param ctx - Canvas rendering context.
 * @param width - Width of the canvas.
 * @param height - Height of the canvas.
 */
const applyGrayscaleMask = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    // Retrieve the current image data from the canvas.
    const imageData = ctx.getImageData(0, 0, width, height);

    // Create an offscreen canvas to generate the mask.
    const maskCanvas = document.createElement("canvas");
    maskCanvas.width = width;
    maskCanvas.height = height;
    const maskCtx = maskCanvas.getContext("2d");
    if (!maskCtx) return;

    // Generate a scribble pattern on the mask canvas.
    createScribblePattern(maskCtx, width, height);
    const maskData = maskCtx.getImageData(0, 0, width, height).data;

    // For every pixel, if the mask is black, convert that pixel to grayscale.
    for (let i = 0; i < imageData.data.length; i += 4) {
        if (maskData[i] === 0) {
            const gray = 0.3 * imageData.data[i] + 0.59 * imageData.data[i + 1] + 0.11 * imageData.data[i + 2];
            imageData.data[i] = gray;
            imageData.data[i + 1] = gray;
            imageData.data[i + 2] = gray;
        }
    }
    ctx.putImageData(imageData, 0, 0);
};

/**
 * Create Scribble Pattern
 * Draws a scribble (doodle) pattern on the provided canvas context.
 * This pattern is used as a mask for the grayscale effect.
 *
 * @param ctx - Canvas rendering context.
 * @param width - Width of the canvas.
 * @param height - Height of the canvas.
 */
export const createScribblePattern = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    // Fill the canvas with black.
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, width, height);

    // Set the stroke style to white for drawing scribbles.
    ctx.strokeStyle = "white";
    ctx.lineCap = "round";

    // Calculate a scaling factor based on the canvas size.
    const baseScale = Math.sqrt((width * height) / (800 * 800));
    const lineSpacing = Math.max(5, height / 150);
    const numLines = Math.floor(height / lineSpacing) * 1.2;

    // Draw multiple scribble lines with random amplitude, frequency, and phase.
    for (let i = 0; i < numLines; i++) {
        const baseY = i * lineSpacing + lineSpacing / 2;
        const amplitude = Math.max(10, height / 60) * (0.5 + Math.random() * 0.5);
        const frequency = Math.max(0.002, 15 / width);
        const phase = Math.random() * 2 * Math.PI;
        ctx.beginPath();
        ctx.lineWidth = Math.max(1, width / 800) + Math.random() * (baseScale * 0.5);

        let x = 0;
        let y = baseY + amplitude * Math.sin(phase + frequency * x);
        ctx.moveTo(x, y);

        for (x = 1; x <= width; x += Math.max(2, width / 500)) {
            y = baseY + amplitude * Math.sin(phase + frequency * x);
            ctx.lineTo(x, y);
        }
        ctx.stroke();
    }
};

/**
 * Draw Horizontal Text Pattern
 * Draws a repeated horizontal pattern of text (without wave effect)
 * over the specified area.
 *
 * @param patternCtx - Canvas context for the pattern.
 * @param width - Width of the area to fill.
 * @param height - Height of the area to fill.
 * @param text - Text to be repeated.
 * @param fontSize - Font size for the text.
 * @param color - Text color (supports opacity).
 */
function drawHorizontalTextPattern(
    patternCtx: CanvasRenderingContext2D,
    width: number,
    height: number,
    text: string,
    fontSize: number,
    color: string
) {
    patternCtx.save();
    patternCtx.fillStyle = color;
    patternCtx.font = `bold ${fontSize}px Arial`;
    patternCtx.textBaseline = "top";
    const textWidth = patternCtx.measureText(text).width;
    const lineHeight = Math.ceil(fontSize);
    for (let y = 0; y < height; y += lineHeight) {
        let x = 0;
        while (x < width) {
            patternCtx.fillText(text, x, y);
            x += textWidth + fontSize * 0.3; // Horizontal spacing between texts.
        }
    }
    patternCtx.restore();
}

/**
 * Warp Text Columns
 * Applies a vertical wave distortion to the text pattern by drawing
 * 1-pixel-wide vertical slices of the pattern canvas onto the main canvas
 * with a calculated vertical offset.
 *
 * @param mainCtx - The main canvas context.
 * @param patternCanvas - Offscreen canvas containing the text pattern.
 * @param width - Width of the area to warp.
 * @param height - Height of the area to warp.
 * @param amplitude - Amplitude of the wave.
 * @param frequency - Frequency of the wave.
 * @param phase - Phase offset of the wave.
 * @param baseShift - Base vertical shift applied to every column.
 */
function warpTextColumns(
    mainCtx: CanvasRenderingContext2D,
    patternCanvas: HTMLCanvasElement,
    width: number,
    height: number,
    amplitude: number,
    frequency: number,
    phase: number,
    baseShift: number
) {
    for (let x = 0; x < width; x++) {
        // Calculate vertical offset using a sine wave function.
        const wave = amplitude * Math.sin(frequency * x + phase);
        const offset = Math.round(baseShift + wave);
        // Draw a 1px-wide vertical slice of the pattern onto the main canvas.
        mainCtx.drawImage(patternCanvas, x, 0, 1, height, x, offset, 1, height);
    }
}

/**
 * Apply Watermark
 * Generates a larger pattern canvas filled with repeated text,
 * applies a wave distortion effect, and draws the result onto the main canvas.
 *
 * @param ctx - Main canvas context.
 * @param finalWidth - Width of the main canvas.
 * @param finalHeight - Height of the main canvas.
 * @param text - Watermark text to be repeated.
 */
function applyWatermark(
    ctx: CanvasRenderingContext2D,
    finalWidth: number,
    finalHeight: number,
    text: string
) {
    const fontSize = Math.max(8, Math.min(finalWidth, finalHeight) / 70); // Asegurar legibilidad
    const extraPadding = Math.round(fontSize * 10);
    const patternWidth = finalWidth + extraPadding * 2;
    const patternHeight = finalHeight + extraPadding * 5;

    const patternCanvas = document.createElement("canvas");
    patternCanvas.width = patternWidth;
    patternCanvas.height = patternHeight;
    const patternCtx = patternCanvas.getContext("2d");
    if (!patternCtx) return;

    // Clear the pattern canvas.
    patternCtx.clearRect(0, 0, patternWidth, patternHeight);

    // Draw a horizontal repeated text pattern on the offscreen canvas.
    drawHorizontalTextPattern(
        patternCtx,
        patternWidth,
        patternHeight,
        text,
        fontSize,
        "rgba(41,133,133,0.5)"
    );

    // Set random wave parameters for a unique watermark effect.
    const amplitude = Math.max(5, finalHeight / (15 + Math.random() * 5));
    const frequency = Math.max(0.004, (8 + Math.random() * 4) / finalWidth);
    const phase = Math.random() * 2 * Math.PI;
    const baseShift = -finalHeight * 0.1;

    // Warp the text columns and draw the result onto the main canvas.
    warpTextColumns(ctx, patternCanvas, patternWidth, patternHeight, amplitude, frequency, phase, baseShift);
}
