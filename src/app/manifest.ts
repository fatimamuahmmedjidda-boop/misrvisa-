import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "MISR VISA — Egypt Visa on Arrival & OK-to-Board",
    short_name: "MISR VISA",
    description: "OK-to-Board in 24–48 hours and the USD 36 Egypt visa on arrival, with flights, hotels and Cairo airport pickup.",
    start_url: "/",
    display: "standalone",
    background_color: "#020b09",
    theme_color: "#004d43",
    icons: [{ src: "/brand/logo-mark.png", sizes: "1800x1800", type: "image/png", purpose: "any" }],
  };
}
