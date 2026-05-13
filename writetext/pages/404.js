import Link from 'next/link'
export default function Custom404() {
  return (
    <div style={{ textAlign: 'center', width: '100%' }}>
      <h1>404 - Page Not Found</h1>
      <p>The page you are looking for does not exist.</p>
    <Link href="/home">Go Back Home</Link>
    </div>
  );
}