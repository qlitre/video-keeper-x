import { useState } from "hono/jsx/dom";
import ArtistSelectButton from "./artist-select-button";

interface Artist {
  id: string;
  name: string;
  name_kana: string;
}

export default function VideoAddForm() {
  const [selectedArtist, setSelectedArtist] = useState<Artist | null>(null);

  const handleArtistSelect = (artist: Artist) => {
    setSelectedArtist(artist);
  };

  return (
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
          class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          placeholder="@username (@ は含めない)"
        />
      </div>

      <div class="relative">
        <label class="block text-sm font-medium text-gray-700">
          アーティスト名 <span class="text-red-500">*</span>
        </label>
        <ArtistSelectButton 
          onSelect={handleArtistSelect}
          selectedArtist={selectedArtist}
          inputName="artist_id"
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
  );
}