const NAV_SECTIONS = [
  { label: 'Overview', href: '#overview' },
  { label: 'Method', href: '#methodology' },
  { label: 'Results', href: '#results' },
  { label: 'Findings', href: '#findings' },
  { label: 'Artifacts', href: '#artifacts' },
]

export default function Nav() {
  function handleSelect(e: React.ChangeEvent<HTMLSelectElement>) {
    const href = e.target.value
    if (href) {
      document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' })
      e.target.value = ''
    }
  }

  return (
    <nav aria-label="Site navigation">
      <div className="nav-inner">
        <a href="#hero" className="nav-brand">Dzung Nguyen</a>

        {/* Desktop links */}
        <ul className="nav-links" role="list">
          {NAV_SECTIONS.map(s => (
            <li key={s.href}>
              <a href={s.href}>{s.label}</a>
            </li>
          ))}
        </ul>

        {/* Mobile fallback: select menu */}
        <select
          className="nav-select"
          onChange={handleSelect}
          defaultValue=""
          aria-label="Jump to section"
        >
          <option value="" disabled>Jump to…</option>
          {NAV_SECTIONS.map(s => (
            <option key={s.href} value={s.href}>{s.label}</option>
          ))}
        </select>
      </div>
    </nav>
  )
}
