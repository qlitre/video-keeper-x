import { useState, useEffect } from "hono/jsx/dom";

interface Artist {
  id: string;
  name: string;
  name_kana: string;
}

interface ArtistSelectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (artist: Artist) => void;
}

export default function ArtistSelectModal({
  isOpen,
  onClose,
  onSelect,
}: ArtistSelectModalProps) {
  const [artists, setArtists] = useState<Artist[]>([]);
  const [filteredArtists, setFilteredArtists] = useState<Artist[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      fetchAllArtists();
    }
  }, [isOpen]);

  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredArtists(artists);
    } else {
      const filtered = artists.filter(
        (artist) =>
          artist.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (artist.name_kana && artist.name_kana.toLowerCase().includes(searchQuery.toLowerCase()))
      );
      setFilteredArtists(filtered);
    }
  }, [searchQuery, artists]);

  const fetchAllArtists = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/artists/all");
      if (response.ok) {
        const data = (await response.json()) as Artist[];
        setArtists(data);
        setFilteredArtists(data);
      } else {
        console.error("API error:", response.status, await response.text());
      }
    } catch (error) {
      console.error("Failed to fetch artists:", error);
    }
    setLoading(false);
  };

  const handleSelect = (artist: Artist) => {
    onSelect(artist);
    onClose();
    setSearchQuery("");
  };

  const handleClose = () => {
    onClose();
    setSearchQuery("");
  };

  if (!isOpen) return null;

  return (
    <div class="fixed inset-0 z-50 overflow-y-auto">
      <div class="flex items-center justify-center min-h-screen px-4 py-8">
        {/* Background overlay */}
        <div
          class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
          onClick={handleClose}
        ></div>

        {/* Modal */}
        <div class="relative bg-white rounded-lg text-left overflow-hidden shadow-xl max-w-lg w-full z-50">
          <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div class="sm:flex sm:items-start">
              <div class="w-full">
                <div class="flex justify-between items-center mb-4">
                  <h3 class="text-lg leading-6 font-medium text-gray-900">
                    アーティストを選択
                  </h3>
                  <button
                    onClick={handleClose}
                    class="text-gray-400 hover:text-gray-600"
                  >
                    <svg
                      class="h-6 w-6"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>

                {/* Search input */}
                <div class="mb-4">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) =>
                      setSearchQuery((e.target as HTMLInputElement).value)
                    }
                    placeholder="アーティスト名で検索..."
                    class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  />
                </div>

                {/* Artists list */}
                <div class="max-h-96 overflow-y-auto">
                  {loading ? (
                    <div class="flex justify-center py-8">
                      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
                    </div>
                  ) : filteredArtists.length === 0 ? (
                    <div class="text-center py-8">
                      <div class="text-gray-500 mb-4">
                        {searchQuery
                          ? "該当するアーティストが見つかりません"
                          : "アーティストが登録されていません"}
                      </div>
                      <a
                        href="/artists/add"
                        class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                      >
                        <svg
                          class="w-4 h-4 mr-2"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 4v16m8-8H4"
                          />
                        </svg>
                        新しいアーティストを登録
                      </a>
                    </div>
                  ) : (
                    <div class="space-y-2">
                      {filteredArtists.map((artist) => (
                        <button
                          key={artist.id}
                          onClick={() => handleSelect(artist)}
                          class="w-full text-left p-3 hover:bg-gray-50 rounded-md border border-gray-200 transition-colors"
                        >
                          <div class="font-medium text-gray-900">
                            {artist.name}
                          </div>
                          <div class="text-sm text-gray-500">
                            {artist.name_kana || ''}
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Add new artist button - always visible */}
                <div class="mt-4 pt-4 border-t border-gray-200">
                  <a
                    href="/artists/add"
                    class="w-full inline-flex justify-center items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    <svg
                      class="w-4 h-4 mr-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 4v16m8-8H4"
                      />
                    </svg>
                    新しいアーティストを登録
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}