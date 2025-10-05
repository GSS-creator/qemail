// Qemail API client for QSSN server
class QEmailApiService {
  private baseUrl: string = ''
  private token: string | null = null

  constructor() {
    // Use relative paths for QOS integration - no port needed
    this.baseUrl = ''
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
  }

  async health(): Promise<any> {
    const res = await fetch(`${this.baseUrl}/api/health`, { method: 'GET' })
    return res.ok ? res.json() : { status: 'error' }
  }

  async listEmails(folder: string): Promise<any[]> {
    const res = await fetch(`${this.baseUrl}/api/emails/${encodeURIComponent(folder)}`, {
      method: 'GET',
      headers: this.getHeaders(false)
    })
    if (!res.ok) {
      const errorData = await res.json().catch(() => ({ error: 'Failed to load emails' }))
      throw new Error(errorData.error || 'Failed to load emails')
    }
    return res.json()
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
    const res = await fetch(`${this.baseUrl}/api/auth/register`, {
      method: 'POST',
      headers: this.getHeaders(true),
      body: JSON.stringify(payload)
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
    
    const res = await fetch(`${this.baseUrl}/api/auth/password/reset`, {
      method: 'POST',
      headers: headers,
      body: JSON.stringify({ username, otp, new_password: newPassword })
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
