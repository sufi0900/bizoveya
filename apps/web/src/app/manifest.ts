import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return { name: "Bizoveya", short_name: "Bizoveya", description: "Business websites and your digital workspace.", start_url: "/", display: "standalone", background_color: "#0b1515", theme_color: "#bce8c9", icons: [{ src: "/icon", sizes: "64x64", type: "image/png" }] };
}
