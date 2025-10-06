import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { qemailApi } from "./services/api.ts";

// Listen for server configuration from QOS parent window
window.addEventListener('message', (event) => {
  if (event.data?.type === 'QOS_SERVER_CONFIG') {
    console.log('Received server configuration from QOS:', event.data.serverUrl)
    // Update API service with server URL
    qemailApi.setBaseUrl(event.data.serverUrl)
    // Store in localStorage for persistence
    localStorage.setItem('qos-server-url', event.data.serverUrl)
  }
})

// Attach X-QSSN-Client for all API calls since qemail is now integrated with QOS
const originalFetch = window.fetch.bind(window)
window.fetch = (input: RequestInfo | URL, init?: RequestInit) => {
  const req = typeof input === 'string' || input instanceof URL ? new Request(input, init) : input
  const url = new URL(req.url, window.location.href)
  const isSameOrigin = url.origin === window.location.origin
  // Always attach QSSN client header for same-origin requests (QOS integration)
  const shouldAttach = isSameOrigin
  if (!shouldAttach) return originalFetch(req)
  const headers = new Headers(req.headers)
  if (!headers.has('X-QSSN-Client')) headers.set('X-QSSN-Client', 'QSSN-Desktop-v1.0')
  const nextReq = new Request(req, { headers })
  return originalFetch(nextReq)
}

// Set the database server URL
const dbServerUrl = 'https://qssn-d1-api.gastonsoftwaresolutions234.workers.dev'
qemailApi.setBaseUrl(dbServerUrl)

// Check for existing server URL in localStorage, but prioritize the database server URL
const savedServerUrl = localStorage.getItem('qos-server-url')
if (savedServerUrl && savedServerUrl !== dbServerUrl) {
  console.log('Using saved server URL from localStorage, but database operations will use:', dbServerUrl)
}

createRoot(document.getElementById("root")!).render(<App />);
