const { ipcMain } = require('electron')
const { Octokit } = require('@octokit/rest')
const { createOAuthAppAuth } = require('@octokit/auth-oauth-app')
const path = require('path')
const fs = require('fs')

class GitHubAuth {
  constructor() {
    this.clientId = 'your_client_id'
    this.clientSecret = 'your_client_secret'
    this.redirectUri = 'http://localhost:3000/auth/callback'
    this.scopes = ['user', 'repo']
    this.tokenPath = path.join(__dirname, '../../Appdata/config/github-token.json')
    
    this.octokit = new Octokit({
      authStrategy: createOAuthAppAuth,
      auth: {
        clientId: this.clientId,
        clientSecret: this.clientSecret
      }
    })
  }

  async login() {
    const authUrl = this.octokit.auth({
      type: 'oauth',
      scopes: this.scopes,
      redirectUrl: this.redirectUri
    })
    
    return authUrl.url
  }

  async handleCallback(code) {
    try {
      const { token } = await this.octokit.auth({
        type: 'oauth-user',
        code: code
      })
      
      fs.writeFileSync(this.tokenPath, JSON.stringify({ token }))
      return token
    } catch (error) {
      console.error('Authentication failed:', error)
      throw error
    }
  }

  async getToken() {
    if (fs.existsSync(this.tokenPath)) {
      const { token } = JSON.parse(fs.readFileSync(this.tokenPath))
      return token
    }
    return null
  }
}

module.exports = GitHubAuth
