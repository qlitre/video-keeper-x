import { useState, useEffect } from 'hono/jsx/dom'
import type { Artist } from '../types'

interface ArtistAutocompleteProps {
  onSelect: (artist: Artist) => void
  /** hidden input の name。デフォルト: "artist_id" */
  inputName?: string
}

export default function ArtistAutocomplete({
  onSelect,
  inputName = 'artist_id',
}: ArtistAutocompleteProps) {
  const [query, setQuery] = useState('')
  const [suggestions, setSuggestions] = useState<Artist[]>([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [loading, setLoading] = useState(false)
  const [selectedArtist, setSelectedArtist] = useState<Artist | null>(null)

  useEffect(() => {
    const searchArtists = async () => {
      if (query.length < 1) {
        setSuggestions([])
        setShowSuggestions(false)
        return
      }

      setLoading(true)
      try {
        const response = await fetch(
          `/api/artists?q=${encodeURIComponent(query)}`
        )
        if (response.ok) {
          const artists = (await response.json()) as Artist[]
          setSuggestions(artists)
          setShowSuggestions(true)
        }
      } catch (error) {
        console.error('Artist search error:', error)
      }
      setLoading(false)
    }

    const debounceTimer = setTimeout(searchArtists, 300)
    return () => clearTimeout(debounceTimer)
  }, [query])

  const handleSelect = (artist: Artist) => {
    setQuery(artist.name)
    setShowSuggestions(false)
    setSelectedArtist(artist)
    onSelect(artist)
    console.log('Artist selected:', artist) // デバッグ用
  }

  return (
    <div className="relative">
      <input
        type="text"
        value={query}
        onChange={e => {
          setQuery((e.target as HTMLInputElement).value)
          setSelectedArtist(null) // 入力が変更されたら選択状態をクリア
        }}
        onFocus={() => query.length > 0 && setShowSuggestions(true)}
        onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
        className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm ${
          selectedArtist ? 'border-green-500 bg-green-50' : 'border-gray-300'
        }`}
        placeholder="アーティスト名を入力して検索..."
      />

      {selectedArtist && (
        <div className="absolute right-3 top-3">
          <div className="text-green-600">
            <svg
              className="h-4 w-4"
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

      {loading && (
        <div className="absolute right-3 top-3">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-indigo-600"></div>
        </div>
      )}

      {/* hidden input ― 選択済みなら id、未選択なら空文字を保持 */}
      <input type="hidden" name={inputName} value={selectedArtist?.id ?? ''} />
      {showSuggestions && suggestions.length > 0 && (
        <div className="absolute z-10 w-full bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto">
          {suggestions.map(artist => (
            <button
              key={artist.id}
              type="button"
              onClick={() => handleSelect(artist)}
              className="w-full text-left px-3 py-2 hover:bg-gray-100 focus:bg-gray-100 focus:outline-none"
            >
              <div className="font-medium text-gray-900">{artist.name}</div>
              <div className="text-sm text-gray-500">{artist.name_kana}</div>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
