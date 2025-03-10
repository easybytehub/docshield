"use client";

import { useRef, useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import {
    DownloadIcon,
    UploadIcon,
    GithubIcon,
    Loader2,
    ChevronRight,
    ChevronLeft,
} from "lucide-react";
import { processImage } from "@/lib/watermark";
import {
    ReactCompareSlider,
    ReactCompareSliderHandle,
    ReactCompareSliderImage,
} from "react-compare-slider";
import Image from "next/image";

/**
 * CustomHandle Component
 * This component provides a custom handle for the image comparison slider.
 */
const CustomHandle: React.FC = () => {
    return (
        <ReactCompareSliderHandle
            buttonStyle={{
                width: "40px",
                height: "40px",
                borderRadius: "50%",
                backgroundColor: "white",
                border: "2px solid #ddd",
                boxShadow: "0 2px 6px rgba(0, 0, 0, 0.1)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
            }}
            style={{
                width: "2px",
                backgroundColor: "#ddd",
                cursor: "grab",
            }}
        >
            <div className="flex items-center gap-1">
                <ChevronLeft className="w-5 h-5 text-gray-600" />
                <ChevronRight className="w-5 h-5 text-gray-600" />
            </div>
        </ReactCompareSliderHandle>
    );
};

/**
 * Home Component
 * Main page component that:
 * - Allows image upload via file input or drag & drop.
 * - Processes the image by adding a watermark.
 * - Displays a comparison slider between the original and watermarked images.
 * - Shows download and reset options once processing is complete.
 */
export default function Home() {
    // State variables
    const [preview, setPreview] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [watermarkText, setWatermarkText] = useState("");
    const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "/docshield";

    // Refs for the canvas and drag & drop zone
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const dropZoneRef = useRef<HTMLDivElement | null>(null);

    /**
     * handleImageUpload
     * Reads the uploaded image file, processes it with the watermark,
     * and sets the preview state.
     *
     * @param file - The image file to process.
     */
    const handleImageUpload = useCallback(
        async (file: File | null) => {
            if (!file) return;
            // Use provided watermark text or default text if empty.
            const effectiveText = watermarkText.trim() || "Protected by DocShield";
            setLoading(true);
            const reader = new FileReader();
            reader.onload = (e) => {
                const img = new window.Image();
                img.src = e.target?.result as string;
                img.onload = () => {
                    if (canvasRef.current) {
                        processImage(img, effectiveText, canvasRef.current, setPreview);
                    }
                    setLoading(false);
                };
            };
            reader.readAsDataURL(file);
        },
        [watermarkText]
    );

    /**
     * handleFileSelect
     * Triggered when a file is selected from the file input.
     */
    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        handleImageUpload(e.target.files?.[0] || null);
    };

    /**
     * handleDragOver
     * Highlights the drop zone when a file is dragged over it.
     */
    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        dropZoneRef.current?.classList.add("border-blue-500", "bg-blue-50");
    };

    /**
     * handleDragLeave
     * Removes the highlight from the drop zone when the file is dragged away.
     */
    const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        dropZoneRef.current?.classList.remove("border-blue-500", "bg-blue-50");
    };

    /**
     * handleDrop
     * Processes the file dropped into the drop zone.
     */
    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        dropZoneRef.current?.classList.remove("border-blue-500", "bg-blue-50");
        const file = e.dataTransfer.files[0];
        handleImageUpload(file);
    };

    return (
        <div className="flex flex-col min-h-screen bg-gray-50 text-gray-800">
            {/* Header */}
            <header className="w-full bg-white shadow-sm">
                <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <h1 className="text-2xl font-bold text-blue-600">DocShield</h1>
                        <span className="hidden md:block text-sm text-gray-500">
              Professional document protection
            </span>
                    </div>
                    <a
                        href="https://github.com/easybytehub/docshield"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-gray-700 hover:text-blue-600 transition"
                    >
                        <GithubIcon className="w-6 h-6" />
                        <span className="hidden md:block">GitHub</span>
                    </a>
                </div>
            </header>

            {/* Main Content */}
            <main className="flex-grow w-full max-w-7xl mx-auto px-4 py-10">
                {/* Show upload form if there is no preview yet */}
                {!preview && (
                    <>
                        {/* Hero Section */}
                        <section className="text-center mb-10">
                            <h2 className="text-3xl sm:text-4xl font-bold mb-4 text-gray-700">
                                Protect your documents with confidence
                            </h2>
                            <p className="text-base sm:text-lg text-gray-600">
                                Add secure and professional watermarks in seconds.
                            </p>
                        </section>

                        {/* Two-column layout: left for upload controls, right for image comparison */}
                        <section className="flex flex-col md:flex-row gap-8 items-stretch">
                            {/* Column 1: Upload Form and Drag & Drop */}
                            <div className="flex-1 flex flex-col gap-6">
                                <div className="bg-white p-6 rounded-md shadow-sm border border-gray-200">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Watermark Text
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="Enter text (e.g., Valid for AEAT)"
                                        maxLength={100}
                                        value={watermarkText}
                                        onChange={(e) => setWatermarkText(e.target.value)}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-400 focus:outline-none transition"
                                    />
                                    <p className="text-right text-xs text-gray-400 mt-1">
                                        {watermarkText.length}/100 characters
                                    </p>
                                </div>

                                {/* Drag & Drop Zone */}
                                <div
                                    ref={dropZoneRef}
                                    onDragOver={handleDragOver}
                                    onDragLeave={handleDragLeave}
                                    onDrop={handleDrop}
                                    className="bg-white p-6 rounded-md shadow-sm border-2 border-dashed border-gray-300 hover:border-blue-400 transition-all duration-200 cursor-pointer flex-1 flex flex-col justify-center"
                                >
                                    <label
                                        className={`flex flex-col items-center justify-center gap-2 w-full h-full rounded-md transition-colors bg-blue-100 text-blue-700 hover:bg-blue-200`}
                                    >
                                        <UploadIcon className="w-7 h-7" />
                                        <span className="text-base font-medium">
                      Upload or drag your image
                    </span>
                                        <input
                                            type="file"
                                            accept="image/*"
                                            className="hidden"
                                            onChange={handleFileSelect}
                                        />
                                    </label>
                                    <p className="text-center text-xs text-gray-400 mt-3">
                                        Supported formats: PNG, JPG
                                    </p>
                                </div>

                                {/* Loading Indicator */}
                                {loading && (
                                    <div className="flex items-center gap-2 text-blue-600 font-medium">
                                        <Loader2 className="animate-spin w-5 h-5" />
                                        <span>Processing image...</span>
                                    </div>
                                )}
                            </div>

                            {/* Column 2: Image Comparison Slider */}
                            <div className="flex-1 flex flex-col">
                                <div>
                                    <h3 className="text-lg font-semibold mb-3 text-gray-700">
                                        Watermark Preview
                                    </h3>
                                    <p className="text-sm text-gray-500 mb-4">
                                        Drag the handle to compare
                                    </p>
                                </div>
                                <div className="flex-1 w-full rounded-md overflow-hidden shadow-sm border border-gray-200">
                                    <ReactCompareSlider
                                        itemOne={
                                            <ReactCompareSliderImage
                                                src={`${basePath}/protected.png`}
                                                alt="Original Document"
                                            />
                                        }
                                        itemTwo={
                                            <ReactCompareSliderImage
                                                src={`${basePath}/unprotected.png`}
                                                alt="Watermarked Document"
                                            />
                                        }
                                        handle={<CustomHandle />}
                                    />
                                </div>
                            </div>
                        </section>
                    </>
                )}

                {/* Show preview once image processing is complete */}
                {preview && (
                    <section className="w-full max-w-lg mx-auto text-center">
                        <h2 className="text-2xl sm:text-3xl font-bold mb-4 text-gray-700">
                            Your document is ready
                        </h2>
                        <p className="text-sm sm:text-base text-gray-600 mb-6">
                            A unique and secure watermark has been applied.
                        </p>

                        <div className="p-4 sm:p-6 flex flex-col items-center">
                            <img
                                src={preview}
                                alt="Protected Document"
                                className="w-auto h-auto max-w-full rounded-md border border-gray-300"
                            />
                        </div>

                        <div className="mt-8 flex flex-col sm:flex-row items-center gap-4">
                            <Button
                                asChild
                                className="flex-1 bg-green-600 hover:bg-green-700 text-white text-base py-3"
                            >
                                <a href={preview} download="protected-document.png">
                                    <DownloadIcon className="w-5 h-5 mr-2" />
                                    Download
                                </a>
                            </Button>
                            <Button
                                className="flex-1 bg-gray-600 hover:bg-gray-700 transition text-white text-base py-3"
                                onClick={() => {
                                    setPreview(null);
                                    setWatermarkText("");
                                }}
                            >
                                Protect another document
                            </Button>
                        </div>
                    </section>
                )}

                {/* Hidden canvas used for processing the image */}
                <canvas ref={canvasRef} className="hidden"></canvas>
            </main>

            {/* Footer */}
            <footer className="bg-white border-t border-gray-200 py-6">
                <div className="max-w-7xl mx-auto px-4 text-center">
                    <p className="text-gray-600 text-sm">
                        © {new Date().getFullYear()} DocShield. An open source project by{" "}
                        <a href="https://easybyte.es" className="text-blue-600 hover:underline">
                            EasyByte Hub
                        </a>
                        .
                    </p>
                    <p className="text-gray-500 text-xs mt-1">
                        Developed by{" "}
                        <a
                            href="https://www.linkedin.com/in/javier-miralles-rancano/"
                            target="_blank"
                            className="text-blue-600 hover:underline"
                        >
                            Javier Miralles
                        </a>{" "}
                        | Code on{" "}
                        <a
                            href="https://github.com/easybytehub/docshield"
                            className="text-blue-600 hover:underline"
                        >
                            GitHub
                        </a>
                    </p>
                </div>
            </footer>
        </div>
    );
}
