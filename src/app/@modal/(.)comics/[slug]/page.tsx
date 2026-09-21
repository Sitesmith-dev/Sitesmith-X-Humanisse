import { notFound } from "next/navigation";
import { getComic } from "@/content/comics";
import { ComicModal } from "@/components/comics/ComicModal";
import { ComicPanel } from "@/components/comics/ComicPanel";

// Intercepts soft navigation to /comics/[slug] and shows the same panel as a pop-up over the current page
export default async function ComicModalPage({ params }: PageProps<"/comics/[slug]">) {
  const { slug } = await params;
  const comic = getComic(slug);
  if (!comic) notFound();
  return (
    <ComicModal>
      <ComicPanel comic={comic} />
    </ComicModal>
  );
}
