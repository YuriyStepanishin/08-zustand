import {
  QueryClient,
  dehydrate,
  HydrationBoundary,
} from "@tanstack/react-query";
import { fetchNoteById } from "@/lib/api";
import Modal from "@/components/Modal/Modal";
import NotePreview from "@/app/@modal/(.)notes/[id]/NotePreview.client";

import { Metadata } from "next";
import { getSingleNote } from "@/lib/api";

type Props = {
  params: {
    id: string;
  };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const note = await getSingleNote(params.id);

  return {
    title: note.title,
    description: note.content.slice(0, 100),
    openGraph: {
      title: note.title,
      description: note.content.slice(0, 100),
      url: `https://notehub.vercel.app/notes/${params.id}`,
      images: [
        {
          url: "https://ac.goit.global/fullstack/react/notehub-og-meta.jpg",
          width: 1200,
          height: 630,
        },
      ],
    },
  };
}

export default async function NoteModal({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ["note", id],
    queryFn: () => fetchNoteById(id),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Modal>
        <NotePreview id={id} />
      </Modal>
    </HydrationBoundary>
  );
}
