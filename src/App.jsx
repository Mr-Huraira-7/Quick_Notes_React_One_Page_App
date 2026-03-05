import React, { useMemo, useRef, useState } from "react";
import "./App.css";

const formatNoteDate = (isoDate) =>
  new Date(isoDate).toLocaleString("en-US", {
    dateStyle: "medium",
    timeStyle: "short"
  });

function App() {
  const [titleInput, setTitleInput] = useState("");
  const [descriptionInput, setDescriptionInput] = useState("");
  const [imageDataInput, setImageDataInput] = useState("");
  const [imageName, setImageName] = useState("");
  const [notes, setNotes] = useState([]);
  const [error, setError] = useState("");
  const fileInputRef = useRef(null);

  const totalNotes = useMemo(() => notes.length, [notes]);

  const clearError = () => {
    if (error) setError("");
  };

  const handleImageUpload = (event) => {
    const selectedFile = event.target.files?.[0];

    if (!selectedFile) {
      setImageDataInput("");
      setImageName("");
      return;
    }

    if (!selectedFile.type.startsWith("image/")) {
      setError("Please upload a valid image file.");
      event.target.value = "";
      setImageDataInput("");
      setImageName("");
      return;
    }

    const maxSizeInBytes = 5 * 1024 * 1024;
    if (selectedFile.size > maxSizeInBytes) {
      setError("Image size should be 5MB or less.");
      event.target.value = "";
      setImageDataInput("");
      setImageName("");
      return;
    }

    const reader = new FileReader();

    reader.onload = () => {
      setImageDataInput(String(reader.result));
      setImageName(selectedFile.name);
      clearError();
    };

    reader.onerror = () => {
      setError("Could not read the selected image.");
      setImageDataInput("");
      setImageName("");
    };

    reader.readAsDataURL(selectedFile);
  };

  const handleAddNote = () => {
    const title = titleInput.trim();
    const description = descriptionInput.trim();

    if (!title && !description && !imageDataInput) {
      setError("Please add a title, description, or image before saving your note.");
      return;
    }

    const newNote = {
      id: crypto.randomUUID(),
      title: title || "Untitled Note",
      description: description || "No description added.",
      imageData: imageDataInput,
      imageName,
      createdAt: new Date().toISOString()
    };

    setNotes((prevNotes) => [newNote, ...prevNotes]);
    setTitleInput("");
    setDescriptionInput("");
    setImageDataInput("");
    setImageName("");
    if (fileInputRef.current) fileInputRef.current.value = "";
    setError("");
  };

  const handleDeleteNote = (id) => {
    setNotes((prevNotes) => prevNotes.filter((note) => note.id !== id));
  };

  return (
    <main className="page">
      <div className="stars-layer stars-layer--one" />
      <div className="stars-layer stars-layer--two" />
      <div className="stars-layer stars-layer--three" />

      <div className="layout-wrap">
        <section className="notes-app">
          <header className="header">
            <div className="header-copy">
              <p className="eyebrow">Personal Galaxy Board</p>
              <h1>Quick Notes</h1>
            </div>
            <p className="counter-badge">
              Total Notes <span>{totalNotes}</span>
            </p>
          </header>

          <section className="composer">
            <div className="input-grid">
              <label className="sr-only" htmlFor="noteTitle">
                Note title
              </label>
              <input
                id="noteTitle"
                className="text-input"
                type="text"
                value={titleInput}
                onChange={(event) => {
                  setTitleInput(event.target.value);
                  clearError();
                }}
                placeholder="Title (optional but recommended)"
              />

              <label className="sr-only" htmlFor="noteImage">
                Upload note image
              </label>
              <div className="upload-field">
                <input
                  id="noteImage"
                  ref={fileInputRef}
                  className="file-input"
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                />
                <p className="upload-hint">{imageName ? `Selected: ${imageName}` : "Upload image (optional)"}</p>
              </div>
            </div>

            <label className="sr-only" htmlFor="noteDescription">
              Note description
            </label>
            <textarea
              id="noteDescription"
              className="note-input"
              value={descriptionInput}
              onChange={(event) => {
                setDescriptionInput(event.target.value);
                clearError();
              }}
              placeholder="Write your note description..."
              rows={4}
            />
            <button type="button" className="add-btn" onClick={handleAddNote}>
              Add Note
            </button>
            {error && <p className="error-text">{error}</p>}
          </section>
        </section>

        <section className="notes-board" aria-live="polite">
          {notes.length === 0 ? (
            <p className="empty-state">No notes yet. Add your first note.</p>
          ) : (
            <div className="notes-grid">
              {notes.map((note) => (
                <article key={note.id} className="note-card">
                  {note.imageData && (
                    <div className="note-media">
                      <img
                        src={note.imageData}
                        alt={`${note.title} preview`}
                        loading="lazy"
                      />
                    </div>
                  )}

                  <div className="note-content">
                    <div className="badge-row">
                      <span className="badge badge-primary">Quick Note</span>
                      <span className="badge badge-secondary">
                        {note.imageData ? "Image Attached" : "Text Only"}
                      </span>
                    </div>

                    <h2>{note.title}</h2>
                    <p className="note-description">{note.description}</p>
                  </div>

                  <footer className="card-footer">
                    <time dateTime={note.createdAt}>{formatNoteDate(note.createdAt)}</time>
                    <button
                      type="button"
                      className="delete-btn"
                      onClick={() => handleDeleteNote(note.id)}
                    >
                      Delete
                    </button>
                  </footer>
                </article>
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}

export default App;
