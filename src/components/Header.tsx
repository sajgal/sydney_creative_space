import { Link } from '@tanstack/react-router'
import { MainNav } from './MainNav'

export function Header() {
  const navItems = [
    { to: '/photographers', label: 'Photographers' },
    { to: '/about', label: 'About' },
  ]

  return (
    <header className="flex flex-col items-center justify-between gap-2 font-serif md:flex-row">
      <Link to="/">
        <h1 className="text-redred flex flex-col items-center font-black tracking-tighter">
          <span className="text-5xl md:text-6xl lg:text-7xl">Sydney</span>
          <span className="text-3xl md:text-4xl lg:text-5xl">
            Creative.space
          </span>
        </h1>
      </Link>
      <MainNav items={navItems} className="font-sans" />
    </header>
  )
}
