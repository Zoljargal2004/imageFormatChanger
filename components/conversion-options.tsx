"use client";

import { useState, useEffect, useContext } from "react";
import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import WrapperContext from "./wrapper";
import sharp from "sharp";

const formatOptions = [
  { value: "png", label: "PNG", description: "Lossless, transparency support" },
  {
    value: "jpg",
    label: "JPG",
    description: "Smaller file size, no transparency",
  },
  {
    value: "webp",
    label: "WEBP",
    description: "Modern format, good compression",
  },
];

export function ConversionOptions() {
  const [selectedFormat, setSelectedFormat] = useState("png");
  const [quality, setQuality] = useState(80);
  const [isConverting, setIsConverting] = useState(false);
  const [isImageUploaded, setIsImageUploaded] = useState(false);
  const { file } = useContext(WrapperContext);

  const handleConvert = async () => {
    if (!file) return;

    setIsConverting(true);
    try {
      const convertedBuffer = await file.arrayBuffer();
      if (convertedBuffer) {
        // Create a blob from the buffer
        const blob = new Blob([convertedBuffer], {
          type:
            selectedFormat === "pdf"
              ? "application/pdf"
              : `image/${selectedFormat}`,
        });

        // Create a download link
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `converted.${selectedFormat}`;
        document.body.appendChild(a);
        a.click();

        // Cleanup
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      }
    } catch (error) {
      console.error("Conversion failed:", error);
      // You might want to add proper error handling here
    } finally {
      setIsConverting(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Conversion Options</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label>Output Format</Label>
          <RadioGroup
            value={selectedFormat}
            onValueChange={setSelectedFormat}
            className="grid grid-cols-2 gap-2"
          >
            {formatOptions.map((format) => (
              <div key={format.value} className="flex items-center space-x-2">
                <RadioGroupItem value={format.value} id={format.value} />
                <Label htmlFor={format.value} className="cursor-pointer">
                  {format.label}
                </Label>
              </div>
            ))}
          </RadioGroup>
          <p className="text-xs text-muted-foreground mt-1">
            {formatOptions.find((f) => f.value === selectedFormat)?.description}
          </p>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between">
            <Label>Quality</Label>
            <span className="text-sm text-muted-foreground">{quality}%</span>
          </div>
          <Slider
            value={[quality]}
            min={10}
            max={100}
            step={1}
            onValueChange={(value) => setQuality(value[0])}
            disabled={selectedFormat === "pdf"}
          />
          <p className="text-xs text-muted-foreground">
            {quality < 50
              ? "Lower quality, smaller file size"
              : quality < 80
              ? "Balanced quality and file size"
              : "Higher quality, larger file size"}
          </p>
        </div>

        <Button
          className="w-full"
          onClick={handleConvert}
          disabled={file === null || isConverting}
        >
          {isConverting ? (
            <span className="flex items-center gap-2">
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
              Converting...
            </span>
          ) : (
            <span className="flex items-center gap-2">
              <Download className="h-4 w-4" />
              Convert & Download
            </span>
          )}
        </Button>
      </CardContent>
    </Card>
  );
}
