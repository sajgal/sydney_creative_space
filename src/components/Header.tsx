import { Link } from '@tanstack/react-router'

export function Header() {
  return (
    <header className="flex flex-col items-center justify-between font-serif md:flex-row">
      <h1 className="text-redred mb-1 flex flex-col items-center font-black tracking-tighter">
        <span className="text-5xl md:text-6xl lg:text-7xl">Sydney</span>
        <span className="text-3xl md:text-4xl lg:text-5xl">Creative.space</span>
      </h1>

      <div className="flex gap-4 font-sans">
        {/* <Link to="/gallery">
          <Button size="icon-lg" aria-label="Admin" variant="outline">
            <ShieldKeyhole />
          </Button>
        </Link> */}
        <Link to="/gallery">Photographers</Link>
        <Link to="/gallery">About</Link>
      </div>
    </header>
  )
}
