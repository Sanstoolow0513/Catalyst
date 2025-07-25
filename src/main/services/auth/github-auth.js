const { ipcMain } = require('electron')
const { Octokit } = require('@octokit/rest')
const { createOAuthAppAuth } = require('@octokit/auth-oauth-app')
const path = require('path')
const fs = require('fs')

class GitHubAuth {
  constructor() {
    this.clientId = process.env.GITHUB_CLIENT_ID || 'your_client_id';
    this.clientSecret = process.env.GITHUB_CLIENT_SECRET || 'your_client_secret';
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
    // 尝试从本地获取token
    const token = await this.getToken()
    if (token) {
      return { token }
    }

    // 如果没有token，则进行OAuth流程
    const authUrl = this.octokit.auth({
      type: 'oauth',
      scopes: this.scopes,
      redirectUrl: this.redirectUri
    })
    
    return { url: authUrl.url }
  }

  async handleCallback(code) {
    try {
      const { token } = await this.octokit.auth({
        type: 'oauth-user',
        code: code
      }).catch(error => {
        throw new Error(`OAuth authentication failed: ${error.message}`);
      });
      
      if (token) {
        fs.writeFileSync(this.tokenPath, JSON.stringify({ token }));
      } else {
        throw new Error('Token retrieval failed');
      }
      
      // 自动设置token并返回用户信息
      this.octokit = new Octokit({ auth: token })
      const { data: user } = await this.octokit.users.getAuthenticated()
      
      return { 
        token,
        user: {
          login: user.login,
          name: user.name,
          avatarUrl: user.avatar_url
        }
      }
    } catch (error) {
      console.error('Authentication failed:', error.message);
      throw new Error(`Authentication error: ${error.message}`);
    }
  }

  async getToken() {
    if (fs.existsSync(this.tokenPath)) {
      try {
        const data = JSON.parse(fs.readFileSync(this.tokenPath));
        return data.token;  // 确保返回正确的token
      } catch (parseError) {
        console.error('Error parsing token file:', parseError);
        return null;
      }
    }
    return null;
  }
}

module.exports = GitHubAuth
