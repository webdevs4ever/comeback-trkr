import { Component, StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import './styles.css'

class ErrorBoundary extends Component {
  state = { error: null }

  static getDerivedStateFromError(error) {
    return { error }
  }

  render() {
    if (this.state.error) {
      return <main style={{ fontFamily: 'monospace', margin: '40px', maxWidth: '720px' }}>
        <h1>Unable to load Developer Academy</h1>
        <p>The app hit a browser error instead of rendering a blank screen.</p>
        <pre style={{ background: '#eee', padding: '16px', overflow: 'auto' }}>{this.state.error.message}</pre>
        <button onClick={() => { localStorage.removeItem('developer-academy-progress'); window.location.reload() }}>Reset saved progress and reload</button>
      </main>
    }

    return this.props.children
  }
}

createRoot(document.getElementById('root')).render(
  <StrictMode><ErrorBoundary><App /></ErrorBoundary></StrictMode>,
)
