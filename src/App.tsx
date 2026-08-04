import { useEffect, useState } from 'react'
import { Home } from './pages/Home'
import { Compose } from './pages/Compose'
import { View } from './pages/View'

function useHash(): string {
  const [hash, setHash] = useState(location.hash)
  useEffect(() => {
    const onChange = () => setHash(location.hash)
    window.addEventListener('hashchange', onChange)
    return () => window.removeEventListener('hashchange', onChange)
  }, [])
  return hash
}

export default function App() {
  const hash = useHash()
  const parts = hash.replace(/^#\/?/, '').split('/')

  if (parts[0] === 'c' && parts[1]) {
    return <View encoded={parts[1]} />
  }
  if (parts[0] === 'compose' && parts[1]) {
    const orientation = parts[2] === 'portrait' ? 'portrait' : 'landscape'
    return <Compose templateId={parts[1]} orientation={orientation} />
  }
  return <Home />
}
