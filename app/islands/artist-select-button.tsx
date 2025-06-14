import { useState } from "hono/jsx/dom";
import ArtistSelectModal from "./artist-select-modal";

interface Artist {
  id: string;
  name: string;
  name_kana: string;
}

interface ArtistSelectButtonProps {
  onSelect: (artist: Artist) => void;
  selectedArtist?: Artist | null;
  inputName?: string;
}

export default function ArtistSelectButton({
  onSelect,
  selectedArtist,
  inputName = "artist_id",
}: ArtistSelectButtonProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleSelect = (artist: Artist) => {
    onSelect(artist);
    setIsModalOpen(false);
  };

  return (
    <>
      <div class="mt-1 block w-full">
        <button
          type="button"
          onClick={() => setIsModalOpen(true)}
          class={`w-full px-3 py-2 border rounded-md shadow-sm text-left focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm ${
            selectedArtist 
              ? "border-green-500 bg-green-50 text-gray-900" 
              : "border-gray-300 bg-white text-gray-500 hover:bg-gray-50"
          }`}
        >
          {selectedArtist ? (
            <div>
              <div class="font-medium">{selectedArtist.name}</div>
              <div class="text-sm text-gray-500">{selectedArtist.name_kana}</div>
            </div>
          ) : (
            "アーティストを選択してください"
          )}
        </button>

        {selectedArtist && (
          <div class="absolute right-3 top-3 pointer-events-none">
            <div class="text-green-600">
              <svg
                class="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
          </div>
        )}
      </div>

      {/* Hidden input for form submission */}
      <input 
        type="hidden" 
        name={inputName} 
        value={selectedArtist?.id || ""} 
      />

      <ArtistSelectModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSelect={handleSelect}
      />
    </>
  );
}