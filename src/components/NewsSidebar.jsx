import { useEffect, useState } from 'react'
import axios from 'axios'

const ACTION_KEYWORDS = ['weather', 'storm', 'flood', 'cyclone', 'alert', 'warning', 'drought', 'heatwave']

function needsBadge(title) {
  return ACTION_KEYWORDS.some(kw => title.toLowerCase().includes(kw))
}

export default function NewsSidebar({ city, onHeadlines }) {
  const [articles, setArticles] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    setArticles([])
    const key = import.meta.env.VITE_GNEWS_KEY
    axios
      .get(`https://gnews.io/api/v4/search?q=weather+${encodeURIComponent(city)}&lang=en&max=5&apikey=${key}`)
      .then(res => {
        const arts = res.data.articles
        setArticles(arts)
        if (onHeadlines) onHeadlines(arts.map(a => a.title))
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [city, onHeadlines])

  return (
    <div className="n-card p-4">
      <p className="text-white/20 text-[10px] font-mono tracking-widest uppercase mb-3">
        Weather Intelligence · {city}
      </p>

      {loading ? (
        <p className="text-white/15 text-xs font-mono">FETCHING NEWS…</p>
      ) : (
        <div className="flex gap-3 overflow-x-auto pb-1 scrollbar-none">
          {articles.map((article, i) => (
            <a
              key={i}
              href={article.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-shrink-0 w-44 bg-[#181818] border border-white/[0.06] rounded-xl overflow-hidden hover:border-white/15 transition-all duration-300 group"
              style={{ animation: `slideInRight 0.4s ease-out ${i * 70}ms both` }}
            >
              {article.image && (
                <div className="overflow-hidden">
                  <img
                    src={article.image}
                    alt=""
                    className="w-full h-20 object-cover opacity-60 group-hover:opacity-80 transition-opacity duration-300"
                    onError={e => { e.target.style.display = 'none' }}
                  />
                </div>
              )}
              <div className="p-2.5">
                <p className="text-white/60 text-[11px] leading-snug line-clamp-3 font-light group-hover:text-white/80 transition-colors duration-300">
                  {article.title}
                </p>
                {needsBadge(article.title) && (
                  <span className="inline-flex items-center gap-1 mt-2 text-[9px] font-mono text-red-400/80 border border-red-500/20 px-1.5 py-0.5 rounded-full bg-red-500/5">
                    ▲ ACTION REQUIRED
                  </span>
                )}
                <p className="text-white/20 text-[9px] font-mono mt-1.5 uppercase tracking-wide">
                  {article.source?.name}
                </p>
              </div>
            </a>
          ))}
        </div>
      )}
    </div>
  )
}
