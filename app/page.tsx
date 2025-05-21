import { FileUploader } from "@/components/file-uploader";
import { ConversionOptions } from "@/components/conversion-options";
import { WrapperProvider } from "@/components/wrapper";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-4 md:p-24">
      <WrapperProvider>
        <div className="w-full max-w-3xl space-y-8">
          <div className="text-center space-y-2">
            <h1 className="text-3xl md:text-4xl font-bold">
              Image Format Converter
            </h1>
            <p className="text-muted-foreground">
              Convert your images between PNG, JPG, WEBP, and PDF formats
            </p>
          </div>

          <FileUploader />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <ConversionOptions />
          </div>
        </div>
      </WrapperProvider>
    </main>
  );
}
