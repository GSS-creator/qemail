// Qemail API client for QSSN server
class QEmailApiService {
  private baseUrl: string = 'https://qssn-d1-api.gastonsoftwaresolutions234.workers.dev'
  private token: string | null = null

  constructor() {
    // Default to the QSSN database server URL
    this.baseUrl = 'https://qssn-d1-api.gastonsoftwaresolutions234.workers.dev'
    try {
      this.token = localStorage.getItem('qos-auth-token')
    } catch {}
  }

  setBaseUrl(url: string) {
    this.baseUrl = url.replace(/\/$/, '')
  }

  private getHeaders(contentTypeJson: boolean = true): HeadersInit {
    const headers: HeadersInit = {}
    if (contentTypeJson) headers['Content-Type'] = 'application/json'
    headers['X-QSSN-Client'] = 'QSSN-Desktop-v1.0'
    if (this.token) headers['Authorization'] = `Bearer ${this.token}`
    return headers
  }

  setToken(token: string) {
    this.token = token
    try { localStorage.setItem('qos-auth-token', token) } catch {}
    console.log('QEmail API: Authentication token set successfully')
  }

  async health(): Promise<any> {
    const res = await fetch(`${this.baseUrl}/api/health`, { method: 'GET' })
    return res.ok ? res.json() : { status: 'error' }
  }

  async listEmails(folder: string): Promise<any[]> {
    console.log('QEmail API: Loading emails from folder:', folder)
    console.log('QEmail API: Using token:', this.token ? 'Present' : 'Missing')
    
    const res = await fetch(`${this.baseUrl}/api/emails/${encodeURIComponent(folder)}`, {
      method: 'GET',
      headers: this.getHeaders(false)
    })
    
    console.log('QEmail API: Response status:', res.status, res.statusText)
    
    if (!res.ok) {
      const errorData = await res.json().catch(() => ({ error: 'Failed to load emails' }))
      console.log('QEmail API: Error response:', errorData)
      throw new Error(errorData.error || 'Failed to load emails')
    }
    
    const data = await res.json()
    console.log('QEmail API: Successfully loaded', data.length, 'emails')
    return data
  }

  async getEmail(id: number): Promise<any> {
    const res = await fetch(`${this.baseUrl}/api/emails/${id}`, {
      method: 'GET',
      headers: this.getHeaders(false)
    })
    if (!res.ok) {
      const errorData = await res.json().catch(() => ({ error: 'Failed to load email' }))
      throw new Error(errorData.error || 'Failed to load email')
    }
    return res.json()
  }

  async sendEmail(data: { to: string; subject: string; content: string }): Promise<any> {
    const res = await fetch(`${this.baseUrl}/api/emails/send`, {
      method: 'POST',
      headers: this.getHeaders(true),
      body: JSON.stringify(data)
    })
    if (!res.ok) throw new Error('Failed to send email')
    return res.json()
  }

  async markEmailAsRead(id: number): Promise<any> {
    const res = await fetch(`${this.baseUrl}/api/emails/${id}/read`, {
      method: 'PUT',
      headers: this.getHeaders(false)
    })
    if (!res.ok) {
      const errorData = await res.json().catch(() => ({ error: 'Failed to mark email as read' }))
      throw new Error(errorData.error || 'Failed to mark email as read')
    }
    return res.json()
  }

  async toggleEmailStar(id: number): Promise<any> {
    const res = await fetch(`${this.baseUrl}/api/emails/${id}/star`, {
      method: 'PUT',
      headers: this.getHeaders(false)
    })
    if (!res.ok) {
      const errorData = await res.json().catch(() => ({ error: 'Failed to toggle email star' }))
      throw new Error(errorData.error || 'Failed to toggle email star')
    }
    return res.json()
  }

  async toggleEmailArchive(id: number): Promise<any> {
    const res = await fetch(`${this.baseUrl}/api/emails/${id}/archive`, {
      method: 'PUT',
      headers: this.getHeaders(false)
    })
    if (!res.ok) {
      const errorData = await res.json().catch(() => ({ error: 'Failed to toggle email archive' }))
      throw new Error(errorData.error || 'Failed to toggle email archive')
    }
    return res.json()
  }

  async deleteEmail(id: number): Promise<any> {
    const res = await fetch(`${this.baseUrl}/api/emails/${id}`, {
      method: 'DELETE',
      headers: this.getHeaders(false)
    })
    if (!res.ok) {
      const errorData = await res.json().catch(() => ({ error: 'Failed to delete email' }))
      throw new Error(errorData.error || 'Failed to delete email')
    }
    return res.json()
  }

  async login(username: string, password: string): Promise<{ token: string; user: any }> {
    const res = await fetch(`${this.baseUrl}/api/auth/login`, {
      method: 'POST',
      headers: this.getHeaders(true),
      body: JSON.stringify({ username, password })
    })
    if (!res.ok) {
      const errorData = await res.json().catch(() => ({ error: 'Login failed' }))
      throw new Error(errorData.error || 'Login failed')
    }
    const data = await res.json()
    if (data?.token) this.setToken(data.token)
    return data
  }

  async register(payload: { username: string; password: string; interests?: string }): Promise<{ token: string; user: any }> {
    // Generate QSSN email automatically like the Python backend does
    const qssnEmail = `${payload.username}@gss-tec.qssn`;
    
    const res = await fetch(`${this.baseUrl}/api/auth/register`, {
      method: 'POST',
      headers: this.getHeaders(true),
      body: JSON.stringify({
        username: payload.username,
        email: qssnEmail,
        password: payload.password,
        first_name: payload.username,
        interests: payload.interests
      })
    })
    if (!res.ok) {
      const errorData = await res.json().catch(() => ({ error: 'Registration failed' }))
      throw new Error(errorData.error || 'Registration failed')
    }
    const data = await res.json()
    if (data?.token) this.setToken(data.token)
    return data
  }

  async recoverEmail(username: string, password: string): Promise<{ email: string; username: string; message: string }> {
    const headers = this.getHeaders(true)
    // Remove Authorization header for email recovery since user might not be logged in
    delete headers['Authorization']

    console.log('Email recovery request headers:', headers)
    console.log('Email recovery request body:', { username, password })

    const res = await fetch(`${this.baseUrl}/api/auth/recover-email`, {
      method: 'POST',
      headers: headers,
      body: JSON.stringify({ username, password })
    })

    console.log('Email recovery response status:', res.status, res.statusText)

    if (!res.ok) {
      const errorText = await res.text()
      console.log('Email recovery error response:', errorText)

      let errorMessage = 'Email recovery failed'
      try {
        const errorData = JSON.parse(errorText)
        errorMessage = errorData.error || errorData.message || `Server error: ${res.status}`
      } catch {
        errorMessage = errorText || `HTTP ${res.status}: ${res.statusText}`
      }
      throw new Error(errorMessage)
    }

    const responseData = await res.json()
    console.log('Email recovery success:', responseData)
    return responseData
  }

  async requestPasswordReset(username: string, email: string): Promise<any> {
    const headers = this.getHeaders(true)
    delete headers['Authorization']

    console.log('Password reset request headers:', headers)
    console.log('Password reset request body:', { username, email })

    const res = await fetch(`${this.baseUrl}/api/auth/password/reset-request`, {
      method: 'POST',
      headers: headers,
      body: JSON.stringify({ username, email })
    })

    console.log('Password reset response status:', res.status, res.statusText)

    if (!res.ok) {
      const errorText = await res.text()
      console.log('Password reset error response:', errorText)

      let errorMessage = 'Password reset request failed'
      try {
        const errorData = JSON.parse(errorText)
        errorMessage = errorData.error || errorData.message || `Server error: ${res.status}`
      } catch {
        errorMessage = errorText || `HTTP ${res.status}: ${res.statusText}`
      }
      throw new Error(errorMessage)
    }

    const responseData = await res.json()
    console.log('Password reset success:', responseData)
    return responseData
  }

  async resetPassword(username: string, otp: string, newPassword: string): Promise<any> {
    const headers = this.getHeaders(true)
    delete headers['Authorization']

    // Generate QSSN email from username for the API call
    const email = `${username}@gss-tec.qssn`

    const res = await fetch(`${this.baseUrl}/api/auth/password/reset`, {
      method: 'POST',
      headers: headers,
      body: JSON.stringify({ email, otp, newPassword: newPassword })
    })

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({ error: 'Password reset failed' }))
      throw new Error(errorData.error || 'Password reset failed')
    }

    return res.json()
  }
}

export const qemailApi = new QEmailApiService()
export { QEmailApiService }
