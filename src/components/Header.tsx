import { Link } from '@tanstack/react-router'
import dayjs from 'dayjs'

export function Header({ serverTime }: { serverTime: number }) {
  return (
    <header className="flex flex-col items-center justify-between md:flex-row">
      <div>
        <h1 className="mb-1 font-serif text-5xl font-black tracking-tighter md:text-6xl lg:text-7xl">
          <span>
            Sydney<span className="text-slate-300">.</span>Creative
          </span>
        </h1>
        <div className="flex flex-row items-center justify-between">
          <p className="text-sm font-light tracking-wide text-slate-500">
            {dayjs(serverTime).format('YYYY')} All rights reserved
          </p>
          <div className="mb-2 ml-4 inline-flex h-6 w-6 items-center justify-center rounded-full bg-rose-100 text-lg">
            <span className="font-bold tracking-normal text-rose-600">
              SPACE
            </span>
          </div>
        </div>
      </div>

      <div className="m-2 md:m-0" />

      {/* Mobile Admin Toggle */}
      <div className="flex gap-4">
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
