import type { Metadata } from "next";
import "@/app/globals.css";
import { QuizProvider } from "@/contexts/QuizContext";

export const metadata: Metadata = {
  title: "MelodyMind — Learn the Notes. Become the Melody.",
  description: "Turn revision into music. Answer questions, build a melody, and hear your knowledge come to life.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="bg-black text-white min-h-screen dot-matrix-bg">
        <QuizProvider>
          {children}
        </QuizProvider>
      </body>
    </html>
  );
}
