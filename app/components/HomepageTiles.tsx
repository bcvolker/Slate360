// Animation removed: use Tailwind transitions instead
import Link from "next/link";

const tiles = [
  {
    title: "360 Viewer",
    features: ["3D/360 photo/video viewer", "Measurement tools", "File upload", "Cesium integration"],
    link: "/features/360-viewer",
    image: "/images/360-viewer-placeholder.jpg",
  },
  {
    title: "BIM Studio",
    features: ["Workspace viewer", "Parametric modeling", "PDF/AI tools", "2D-to-3D conversion", "3D print lab", "Model editing", "Library integration"],
    link: "/features/bim-studio",
    image: "/images/bim-studio-placeholder.jpg",
  },
  {
    title: "Content Creation",
    features: ["Video editor", "Magnetic timeline", "LUTs", "Overlays", "Customizable workspace"],
    link: "/features/content-creation",
    image: "/images/content-creation-placeholder.jpg",
  },
  {
    title: "Geospatial & Robotics",
    features: ["Mission planning", "Volumetric analysis", "Google Maps overlay", "Drone SDK integration"],
    link: "/features/geospatial-robotics",
    image: "/images/geospatial-placeholder.jpg",
  },
  {
    title: "Reports & Analytics",
    features: ["Custom report builder", "Data visualization", "AI-generated charts", "KPI dashboards"],
    link: "/features/reports-analytics",
    image: "/images/reports-placeholder.jpg",
  },
  {
    title: "Virtual Reality Studio",
    features: ["Walkthroughs", "Safety simulation", "Multi-user sessions"],
    link: "/features/vr-studio",
    image: "/images/vr-studio-placeholder.jpg",
  },
];



export default function HomepageTiles() {
  return (
    <section className="snap-y snap-mandatory overflow-y-scroll h-screen">
      {tiles.map((tile, index) => (
        <div key={tile.title} className="snap-center h-screen flex items-center justify-center bg-gray-50">
          <div
            className={`grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto p-8 transition-all duration-500 opacity-0 translate-y-10 animate-fadein ${index % 2 === 0 ? "" : "md:grid-flow-col-dense"}`}
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            <div className={index % 2 === 0 ? "md:order-1" : "md:order-2"}>
              <img src={tile.image} alt={tile.title} className="w-full h-auto rounded-lg shadow-lg" />
            </div>
            <div className={`${index % 2 === 0 ? "md:order-2" : "md:order-1"} flex flex-col justify-center`}>
              <h2 className="text-3xl font-bold text-[#2F4F4F] mb-4">{tile.title}</h2>
              <ul className="list-disc list-inside text-[#B87333] mb-4">
                {tile.features.map((f) => (
                  <li key={f} className="text-lg">{f}</li>
                ))}
              </ul>
              <Link href={tile.link} className="text-[#4B9CD3] hover:underline text-lg">Learn More</Link>
            </div>
          </div>
        </div>
      ))}
    </section>
  );
}
