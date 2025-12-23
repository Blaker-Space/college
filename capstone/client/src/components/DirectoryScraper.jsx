import { useState } from "react";
import { btn } from "./styles";
import { Modal, showToast } from "./functions/ui";
import { apiFetch } from "./functions/api";

export default function DirectoryScraper({
  startPolling,
  isDirectoryScraping,
  setIsDirectoryScraping,
  cancelDirectoryScrape,
  loading,
  setLoading,
}) {
  const [url, setUrl] = useState("");
  const [open, setOpen] = useState(false);

  const handleDirectoryScrape = async () => {
    setLoading(true);

    if (!url.trim()) {
      alert("Please enter a URL first.");
      return;
    }

    setLoading(true);
    setIsDirectoryScraping(true);
    localStorage.setItem("isDirectoryScraping", "true");
    setOpen(false);
    startPolling();

    try {
      const res = await apiFetch("http://localhost:5000/directory", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      });

      const data = await res.json();
      console.log("Scrape result:", data);

      setUrl("");
    } catch (error) {
      console.error("Failed to start scrape:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* ---------- Button that opens the modal ---------- */}
      <button
        className={`${
          (isDirectoryScraping
            ? btn.danger
            : btn.success + " bg-emerald-700 text-white hover:bg-emerald-600") +
          " w-[138px] py-2 rounded shadow transition text-center flex justify-center"
        }`}
        onClick={() => {
          if (isDirectoryScraping) {
            cancelDirectoryScrape();
            return;
          } else {
            setOpen(true);
          }
        }}
      >
        {isDirectoryScraping ? "Cancel Scrape" : "Scrape Directory"}
      </button>

      {/* ---------- Modal itself ---------- */}
      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title="Scrape a Directory URL"
        footer={
          <>
            <button
              className={btn.danger + " mr-1"}
              onClick={() => setOpen(false)}
              disabled={loading}
            >
              Cancel
            </button>

            <button
              className={btn.success}
              onClick={handleDirectoryScrape}
              disabled={loading}
            >
              {loading ? "Scraping..." : "Start Scrape"}
            </button>
          </>
        }
      >
        <div className="flex flex-col mt-2">
          <input
            className="rounded px-2 py-1 text-black w-full border-2 border-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-400 mt-1"
            placeholder="Paste directory URL here..."
            value={url}
            onChange={(e) => setUrl(e.target.value)}
          />
        </div>
      </Modal>
    </>
  );
}
