import Link from 'next/link'

export default function Home() {
  return (
    <div>
      <h1>Welcome to my app</h1>
      <Link href="/signup">Sign up</Link>
    </div>
  )
}
