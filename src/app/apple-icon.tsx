import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

/** Same mark as icon.svg: a white serif "I" over a crimson bar, on the firm's navy. */
export default function AppleIcon() {
  const bar = (x: number, y: number, w: number, h: number, c: string) => (
    <div style={{ position: "absolute", left: x, top: y, width: w, height: h, background: c }} />
  );
  return new ImageResponse(
    (
      <div style={{ width: 180, height: 180, background: "#0f2238", position: "relative", display: "flex" }}>
        {bar(53, 34, 74, 14, "#ffffff")}
        {bar(81, 34, 18, 88, "#ffffff")}
        {bar(53, 108, 74, 14, "#ffffff")}
        {bar(53, 136, 74, 11, "#d92a43")}
      </div>
    ),
    size,
  );
}
