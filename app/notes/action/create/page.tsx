import { getCategories } from "@/lib/api";
import NoteForm from "@/components/NoteForm/NoteForm";
import css from "./CreateNote.module.css";

export const metadata = {
  title: "Create note",
  description: "Create a new note",
};

const CreateNote = async () => {
  const categories = await getCategories();

  return (
    <main className={css.main}>
      <div className={css.container}>
        <h1 className={css.title}>Create note</h1>
        <NoteForm categories={categories} />
      </div>
    </main>
  );
};

export default CreateNote;
