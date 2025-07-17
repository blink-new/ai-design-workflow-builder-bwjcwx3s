import { useState, useEffect } from 'react'
import { blink } from './blink/client'
import { Toaster } from './components/ui/toaster'
import { MainInterface } from './components/MainInterface'

function App() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = blink.auth.onAuthStateChanged((state) => {
      setUser(state.user)
      setLoading(state.isLoading)
    })
    return unsubscribe
  }, [])

  if (loading) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <h1 className="text-2xl font-semibold mb-4">AI Design & Workflow Builder</h1>
          <p className="text-muted-foreground mb-6">Please sign in to continue</p>
          <button 
            onClick={() => blink.auth.login()}
            className="bg-primary text-primary-foreground px-6 py-2 rounded-md hover:bg-primary/90 transition-colors"
          >
            Sign In
          </button>
        </div>
      </div>
    )
  }

  return (
    <>
      <MainInterface user={user} />
      <Toaster />
    </>
  )
}

export default App