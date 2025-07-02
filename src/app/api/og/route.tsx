import { ImageResponse } from "@vercel/og";
import type { NextRequest } from "next/server";

export const runtime = "edge";

function capitalizeWords(str: string) {
  return str.replace(
    /\w\S*/g,
    (txt) => txt.charAt(0).toUpperCase() + txt.slice(1)
  );
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const slug = searchParams.get("slug") ?? "default";
  console.log("SLUG: ", slug);

  const formattedTitle = capitalizeWords(slug.replace(/-/g, " "));

  return new ImageResponse(
    (
      <div
        tw="flex flex-col w-full h-full justify-between p-16 font-sans"
        style={{
          background: "linear-gradient(135deg, #18181b 0%, #27272a 100%)",
          boxSizing: "border-box",
        }}
      >
        <div tw="flex items-center">
          <span tw="text-5xl mr-4">⚡️</span>
          <span tw="text-3xl font-bold text-lime-400">superfast</span>
        </div>
        <div tw="flex flex-1 items-center justify-center">
          <span
            tw="text-white text-7xl font-extrabold text-center leading-tight tracking-tight"
            style={{
              textShadow: "0 8px 32px rgba(0,0,0,0.5)",
            }}
          >
            {formattedTitle}
          </span>
        </div>
        <div tw="text-left text-zinc-400 text-2xl font-normal tracking-wide">
          superfast.vercel.app
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  );
}
