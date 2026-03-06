"use client";

import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchNotes } from "@/lib/api";


import NoteList from "@/components/NoteList/NoteList";
import SearchBox from "@/components/SearchBox/SearchBox";
import Pagination from "@/components/Pagination/Pagination";
import Modal from "@/components/Modal/Modal";
import NoteForm from "@/components/NoteForm/NoteForm";

import css from "./NotesPage.module.css";

export default function NotesClient({tag}: { tag?: string }) {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [isOpen, setIsOpen] = useState(false);

 useEffect(() => {
  const timer = setTimeout(() => {
    setDebouncedSearch(search);
  }, 500);

  return () => clearTimeout(timer);
}, [search]);



 const { data, isLoading, error } = useQuery({
  queryKey: ["notes", page, debouncedSearch, tag ],
  queryFn: () => fetchNotes(page, debouncedSearch, tag),
  placeholderData: (previousData) => previousData,
});

  if (isLoading) {
    return <p>Loading, please wait...</p>;
  }

  if (error || !data) {
    return <p>Something went wrong.</p>;
  }

  return (
    <main className={css.container}>
      <button onClick={() => setIsOpen(true)}>
        Create note
      </button>

<SearchBox
  onChange={(value) => {
    setSearch(value);
    setPage(1);
  }}
/>

<NoteList notes={data.notes} />

{data.totalPages > 1 && (
  <Pagination
    pageCount={data.totalPages}
    currentPage={page}
    onPageChange={setPage}
  />
)}

      {isOpen && (
        <Modal onClose={() => setIsOpen(false)}>
          <NoteForm onClose={() => setIsOpen(false)} />
        </Modal>
      )}
    </main>
  );
}