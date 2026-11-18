import { ImageResponse } from "next/og";

// Social share card for the homepage (also used by X/Twitter via the root metadata).
export const alt = "Tamas Das — Creative Full-Stack Developer in Kolkata, India";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
    return new ImageResponse(
        (
            <div
                style={{
                    width: "100%",
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    padding: "80px 96px",
                    backgroundColor: "#0a0a0a",
                    backgroundImage:
                        "radial-gradient(circle at 30% 40%, rgba(139,92,246,0.24), rgba(10,10,10,0) 60%)",
                    color: "#fafafa",
                    fontFamily: "sans-serif",
                }}
            >
                <div
                    style={{
                        display: "flex",
                        fontSize: 26,
                        letterSpacing: 8,
                        textTransform: "uppercase",
                        color: "rgba(255,255,255,0.45)",
                    }}
                >
                    Portfolio
                </div>
                <div
                    style={{
                        display: "flex",
                        marginTop: 18,
                        fontSize: 132,
                        fontWeight: 800,
                        letterSpacing: -4,
                        lineHeight: 1,
                        color: "#A78BFA",
                    }}
                >
                    Tamas Das
                </div>
                <div
                    style={{
                        display: "flex",
                        marginTop: 28,
                        fontSize: 44,
                        color: "rgba(255,255,255,0.88)",
                    }}
                >
                    Creative Full-Stack Developer
                </div>
                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        marginTop: 36,
                        fontSize: 28,
                        color: "rgba(255,255,255,0.5)",
                    }}
                >
                    <div
                        style={{
                            width: 14,
                            height: 14,
                            borderRadius: 7,
                            background: "#c4f046",
                            marginRight: 16,
                        }}
                    />
                    Kolkata, India · Next.js · React · Node.js
                </div>
            </div>
        ),
        size
    );
}
