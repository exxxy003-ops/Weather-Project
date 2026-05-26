const CITIES = [
  'Mumbai', 'Delhi', 'Bangalore', 'Surat', 'Chennai',
  'Hyderabad', 'Kolkata', 'Ahmedabad', 'Jaipur', 'Pune',
]

export default function CitySelector({ city, onCityChange }) {
  return (
    <select
      value={city}
      onChange={e => onCityChange(e.target.value)}
      className="bg-transparent border border-white/[0.1] text-white/60 text-xs font-mono tracking-widest uppercase rounded-lg px-3 py-1.5 cursor-pointer focus:outline-none focus:border-white/25 transition-colors duration-200 hover:border-white/20 hover:text-white/80"
    >
      {CITIES.map(c => (
        <option key={c} value={c} className="bg-[#111111] text-white normal-case tracking-normal">
          {c}
        </option>
      ))}
    </select>
  )
}
