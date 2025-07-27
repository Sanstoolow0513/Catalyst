const { ipcMain } = require('electron')
const { Octokit } = require('@octokit/rest')
const { createOAuthAppAuth } = require('@octokit/auth-oauth-app')
const path = require('path')
const fs = require('fs')
const fetch = require('node-fetch')

class GitHubAuth {
  constructor() {
    this.clientId = process.env.GITHUB_CLIENT_ID || 'your_client_id';
    this.clientSecret = process.env.GITHUB_CLIENT_SECRET || 'your_client_secret';
    this.redirectUri = process.env.GITHUB_REDIRECT_URI || 'http://localhost:3000/auth/callback'
    this.scopes = ['user', 'repo']
    this.tokenPath = path.join(__dirname, '../../Appdata/config/github-token.json')
    
    console.log('GitHubAuth initialized with clientId:', this.clientId ? 'present' : 'missing');
    console.log('GitHubAuth redirectUri:', this.redirectUri);
    
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

    // 如果没有token，则生成OAuth授权URL
    const authUrl = `https://github.com/login/oauth/authorize?` +
      `client_id=${this.clientId}&` +
      `redirect_uri=${encodeURIComponent(this.redirectUri)}&` +
      `scope=${this.scopes.join(' ')}`
    
    return { url: authUrl }
  }

  async handleCallback(code) {
    try {
      console.log('Handling GitHub OAuth callback with code:', code ? 'present' : 'missing');
      
      if (!code) {
        throw new Error('Authorization code is missing');
      }
      
      // 使用授权码获取访问令牌
      const tokenResponse = await fetch(`https://github.com/login/oauth/access_token`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          client_id: this.clientId,
          client_secret: this.clientSecret,
          code: code,
          redirect_uri: this.redirectUri
        })
      });
      
      if (!tokenResponse.ok) {
        const errorText = await tokenResponse.text();
        console.error('Failed to get access token:', tokenResponse.status, errorText);
        throw new Error(`Failed to get access token: ${tokenResponse.status} ${errorText}`);
      }
      
      const tokenData = await tokenResponse.json();
      const token = tokenData.access_token;
      
      if (!token) {
        console.error('Access token not found in response:', tokenData);
        throw new Error('Access token not found in response');
      }
      
      console.log('Successfully obtained access token');
      
      // 保存令牌到本地文件
      fs.writeFileSync(this.tokenPath, JSON.stringify({ token }));
      console.log('Token saved to local file');
      
      // 创建新的Octokit实例并获取用户信息
      this.octokit = new Octokit({ auth: token })
      console.log('Fetching authenticated user information');
      const { data: user } = await this.octokit.users.getAuthenticated()
      
      console.log('Successfully authenticated user:', user.login);
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
      console.error('Stack trace:', error.stack);
      throw new Error(`Authentication error: ${error.message}`);
    }
  }

  async getToken() {
    console.log('Checking for existing token at:', this.tokenPath);
    if (fs.existsSync(this.tokenPath)) {
      try {
        console.log('Token file exists, attempting to read');
        const data = JSON.parse(fs.readFileSync(this.tokenPath));
        console.log('Token file parsed successfully');
        return data.token;  // 确保返回正确的token
      } catch (parseError) {
        console.error('Error parsing token file:', parseError);
        return null;
      }
    } else {
      console.log('Token file does not exist');
    }
    return null;
  }
}

module.exports = GitHubAuth
