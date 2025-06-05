/* eslint-disable @next/next/no-img-element */
import Link from "next/link"

interface LogoProps {
  className?: string
  width?: number
  height?: number
}

export default function Logo({ className = "", width = 120, height = 40 }: LogoProps) {
  return (
    <Link href="/" className={`flex items-center ${className}`}>
      <img
        src="/images/logonegro.png"
        alt="Guardería Campestre DOGS"
        width={width}
        height={height}
        className="object-contain"
      />
    </Link>
  )
}
