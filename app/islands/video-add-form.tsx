import { useState, useEffect } from "hono/jsx/dom";

interface Artist {
  id: string;
  name: string;
  name_kana: string;
}

interface FormData {
  video_url?: string;
  x_account_id?: string;
  artist?: Artist;
  venue?: string;
  event_date?: string;
  song_name?: string;
}

interface VideoAddFormProps {
  savedFormData?: string;
}

export default function VideoAddForm({ savedFormData }: VideoAddFormProps) {
  const [selectedArtist, setSelectedArtist] = useState<Artist | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [artists, setArtists] = useState<Artist[]>([]);
  const [filteredArtists, setFilteredArtists] = useState<Artist[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<FormData>({});

  // Cookieからデータを復元
  useEffect(() => {
    if (savedFormData) {
      try {
        const parsed = JSON.parse(decodeURIComponent(savedFormData)) as FormData;
        setFormData(parsed);
        if (parsed.artist) {
          setSelectedArtist(parsed.artist);
        }
      } catch (error) {
        console.error('Failed to parse saved form data:', error);
      }
    }
  }, [savedFormData]);

  const saveFormData = (data: FormData) => {
    try {
      const serialized = encodeURIComponent(JSON.stringify(data));
      document.cookie = `video_form_data=${serialized}; path=/; max-age=3600; SameSite=Lax`;
    } catch (error) {
      console.error('Failed to save form data:', error);
    }
  };

  const handleInputChange = (field: keyof FormData, value: string) => {
    const newFormData = { ...formData, [field]: value };
    setFormData(newFormData);
    saveFormData(newFormData);
  };

  const handleArtistSelect = (artist: Artist) => {
    setSelectedArtist(artist);
    const newFormData = { ...formData, artist };
    setFormData(newFormData);
    saveFormData(newFormData);
    setIsModalOpen(false);
    setSearchQuery("");
  };

  const handleOpenModal = () => {
    setIsModalOpen(true);
    fetchAllArtists();
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSearchQuery("");
  };

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

  return (
    <>
    <form action="/videos/add" method="post" class="space-y-6">
      <div>
        <label for="video_url" class="block text-sm font-medium text-gray-700">
          動画URL <span class="text-red-500">*</span>
        </label>
        <input
          type="url"
          name="video_url"
          id="video_url"
          required
          value={formData.video_url || ''}
          onChange={(e) => handleInputChange('video_url', (e.target as HTMLInputElement).value)}
          class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          placeholder="https://x.com/username/status/..."
        />
        <p class="mt-1 text-sm text-gray-500">X（Twitter）の動画投稿URLを入力してください</p>
      </div>

      <div>
        <label for="x_account_id" class="block text-sm font-medium text-gray-700">
          投稿者のXアカウント名 <span class="text-red-500">*</span>
        </label>
        <input
          type="text"
          name="x_account_id"
          id="x_account_id"
          required
          value={formData.x_account_id || ''}
          onChange={(e) => handleInputChange('x_account_id', (e.target as HTMLInputElement).value)}
          class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          placeholder="@username (@ は含めない)"
        />
      </div>

      <div class="relative">
        <label for="artist_select" class="block text-sm font-medium text-gray-700">
          アーティスト名 <span class="text-red-500">*</span>
        </label>
        <div class="mt-1 block w-full">
          <button
            type="button"
            id="artist_select"
            onClick={handleOpenModal}
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
          name="artist_id" 
          value={selectedArtist?.id || ""} 
        />
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label for="venue" class="block text-sm font-medium text-gray-700">
            会場
          </label>
          <input
            type="text"
            name="venue"
            id="venue"
            value={formData.venue || ''}
            onChange={(e) => handleInputChange('venue', (e.target as HTMLInputElement).value)}
            class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            placeholder="ライブハウス名など"
          />
        </div>

        <div>
          <label for="event_date" class="block text-sm font-medium text-gray-700">
            開催日
          </label>
          <input
            type="date"
            name="event_date"
            id="event_date"
            value={formData.event_date || ''}
            onChange={(e) => handleInputChange('event_date', (e.target as HTMLInputElement).value)}
            class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>
      </div>

      <div>
        <label for="song_name" class="block text-sm font-medium text-gray-700">
          曲名
        </label>
        <input
          type="text"
          name="song_name"
          id="song_name"
          value={formData.song_name || ''}
          onChange={(e) => handleInputChange('song_name', (e.target as HTMLInputElement).value)}
          class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          placeholder="演奏された曲名"
        />
      </div>

      <div class="flex justify-end space-x-3">
        <a
          href="/"
          class="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          キャンセル
        </a>
        <button
          type="submit"
          class="bg-indigo-600 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          保存
        </button>
      </div>
    </form>

    {/* Artist Select Modal */}
    {isModalOpen && (
      <div class="fixed inset-0 z-50 overflow-y-auto">
        <div class="flex items-center justify-center min-h-screen px-4 py-8">
          {/* Background overlay */}
          <div
            class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
            onClick={handleCloseModal}
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
                      onClick={handleCloseModal}
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
                          href="/artists/add?return_to=video_add"
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
                            onClick={() => handleArtistSelect(artist)}
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
                      href="/artists/add?return_to=video_add"
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
    )}
    </>
  );
}