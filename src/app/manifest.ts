import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
    return {
        name: "Tamas Das — Creative Full-Stack Developer",
        short_name: "Tamas Das",
        description:
            "Portfolio of Tamas Das, a creative full-stack developer in Kolkata, India.",
        start_url: "/",
        display: "browser",
        background_color: "#0a0a0a",
        theme_color: "#0a0a0a",
        icons: [{ src: "/favicon.ico", sizes: "any", type: "image/x-icon" }],
    };
}
