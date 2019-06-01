require('dotenv').config()
const { auth } = require('@funcmaticjs/auth0-username-password')
const Auth0Plugin = require('../lib/auth0')

const EXPIRED_TOKEN = "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImtpZCI6Ik9VUXdSRGhETXpZME5qTXhOa0ZHUWprelF6UXdOa0pETVRZMU0wUTBNa0pGUVRjNU5VSTFRZyJ9.eyJpc3MiOiJodHRwczovL2Z1bmNtYXRpYy5hdXRoMC5jb20vIiwic3ViIjoiZ29vZ2xlLW9hdXRoMnwxMTM2MjAxNTk3NjUzNTcxNTY4NTciLCJhdWQiOlsiaHR0cHM6Ly9mdW5jbWF0aWMuYXV0aDAuY29tL2FwaS92Mi8iLCJodHRwczovL2Z1bmNtYXRpYy5hdXRoMC5jb20vdXNlcmluZm8iXSwiaWF0IjoxNTI3NTQ0OTA3LCJleHAiOjE1Mjc1NTIxMDcsImF6cCI6IjlCa0NuMndreXcxZ2NqVGt3RjYzcVMyaU9qV001a2VUIiwic2NvcGUiOiJvcGVuaWQgcHJvZmlsZSBlbWFpbCJ9.PvuKP_c1Fpaor9UvwyOf6pgSkylST-wdYR7zau-tF7kt6Gtb0u4MEs9hTr6ydMDyjpHAkhc6Tdumq_vvEJkVcwtIWzycSTwdW8IfhKUWai1Dh3w7ZnVtPqxWesmK5ny8ytw36Km0Yt_aOpNeyUNQ3JACLe9UuVuY8wDA9mJXGZDOi2zBu03hBA0NssgOTpzfx1L1IHqi5H8leaIeQ2AgXWgVXIuK81k6UKHgqOLbqnVSpU7yllxystTKqL6NrpZ1Qn4Vkt33df2GrjHaeipOpep_LXxFG2DZ2nN6vcyjEQIsY_7QO7p9JIq-u_zRKnGhFHL65bJeQI0sNipPb5NpnQ"
const INVALID_CREDENTIALS_TOKEN = "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImtpZCI6Ik5FTXdNakF5TXpnME9EWXhSVEUzTWpOQ05qazNNek13UmpZMU9FUkdSamMyUkVFelFrUkJSUSJ9.eyJnaXZlbl9uYW1lIjoiRGFuaWVsIEpoaW4iLCJmYW1pbHlfbmFtZSI6IllvbyIsIm5pY2tuYW1lIjoiZGFuaWVsanlvbyIsIm5hbWUiOiJEYW5pZWwgSmhpbiBZb28iLCJwaWN0dXJlIjoiaHR0cHM6Ly9saDMuZ29vZ2xldXNlcmNvbnRlbnQuY29tLy1MVW0ydnlZY0xUYy9BQUFBQUFBQUFBSS9BQUFBQUFBQUFDTS9BZk02ZDVTTkU0US9waG90by5qcGciLCJnZW5kZXIiOiJtYWxlIiwibG9jYWxlIjoiZW4iLCJ1cGRhdGVkX2F0IjoiMjAxOC0xMi0xMFQwNDoyODo0NS43MTlaIiwiZW1haWwiOiJkYW5pZWxqeW9vQGdvYWxib29rYXBwLmNvbSIsImVtYWlsX3ZlcmlmaWVkIjp0cnVlLCJpc3MiOiJodHRwczovL3N1cGVyc2hlZXRzLmF1dGgwLmNvbS8iLCJzdWIiOiJnb29nbGUtb2F1dGgyfDEwNzc2NDEzOTAwNDgyODczNzMyNiIsImF1ZCI6IlJrcFZldDlwem9yMmhaSjAxMkhoMXZwbnJBbFBxWm12IiwiaWF0IjoxNTQ0NDE4MDMxLCJleHAiOjE1NDQ0NTQwMzEsImF0X2hhc2giOiJsMXNFRC1JclBKbFdBNnhWMjNadVpRIiwibm9uY2UiOiJpSjd5UkN2VFZ2YkhLVnh1Wi1IVmUxMk9Kdmd2VjZhUCJ9.zPzNIR0DqvXDpqz7SYq0CwzYN2r6kIyc4J1Fn4DfGbKCluIj2wPuNo_oSDABgii5W7Pw4RI8eYgyq3Yga4urFNPjpS87Z9-4fQ0G00Q-2L4AtHihNqnyb0VjmzWkR1iKao3wYzOLTurrse1uwg4f8KTTDGsL5WRCdfiCd_GgK7kUuKiIRiRn7FfsvcS4eMidMt7wo2rBahBXvRAlwaOxWx6HN7J5TwlcAGkkJW2fc2nd3jXKpRk44l9ZDHQuhR-g63JPdJtSfScVP2JkvALTLW9lV_76lhHLPoR5B5DuVoyFurgePKVZLOropRcuc18BwsA99-gmaWbhfBPYBeO9ww"
const NOOP = () => { }

describe('Unauthorized Tokens', () => {
  let ctx = null
  let plugin = null
  beforeEach(async () => {
    ctx = {
      env: {
        FUNC_AUTH0_DOMAIN: process.env.FUNC_AUTH0_DOMAIN
      },
      event: { headers: { Authorization: '' } },
      state: { },
      logger: console
    }
    plugin = new Auth0Plugin()
    await plugin.start(ctx, NOOP)
  })
  it ('should deny when Authorization token is not given', async () => {
    ctx.event.headers['Authorization'] = ''
    await plugin.request(ctx, NOOP)
    expect(ctx.state.auth).toBeTruthy()
    expect(ctx.state.auth).toMatchObject({
      success: false,
      error: true,
      errorMessage: "No token provided"
    })
  })
  it ('should deny when Authorization token is malformed', async () => {
    ctx.event.headers['Authorization'] = 'BADTOKEN'
    await plugin.request(ctx, NOOP)
    expect(ctx.state.auth).toBeTruthy()
    expect(ctx.state.auth).toMatchObject({
      success: false,
      error: true,
      errorMessage: expect.stringMatching(/^Invalid token format/)
    })
  })
  it ('should deny an expired Auth0 Token', async () => {
    ctx.event.headers['Authorization'] = `Bearer ${EXPIRED_TOKEN}`
    await plugin.request(ctx, NOOP)
    expect(ctx.state.auth).toBeTruthy()
    expect(ctx.state.auth).toMatchObject({
      success: false,
      error: true,
      errorMessage: "jwt expired"
    })
  })
  it ('should deny an invalid Auth0 Token', async () => {
    ctx.event.headers['Authorization'] =  `Bearer ${INVALID_CREDENTIALS_TOKEN}`
    await plugin.request(ctx, NOOP)
    expect(ctx.state.auth).toMatchObject({
      success: false,
      error: true,
      errorMessage: expect.stringMatching(/^Unable to find a signing key/)
    })
  })
})

describe('Skip Authentication', () => {
  let ctx = null
  let plugin = null
  beforeEach(async () => {
    ctx = {
      env: {
        FUNC_AUTH0_DOMAIN: process.env.FUNC_AUTH0_DOMAIN,
        FUNC_AUTH0_SKIP_VERIFICATION: 'true'
      },
      event: { headers: { Authorization: '' } },
      state: { },
      logger: console
    }
    plugin = new Auth0Plugin()
    await plugin.start(ctx, NOOP)
  })
  it ('should just decode the token without verifying with authorizer', async () => {
    ctx.event.headers['Authorization'] = `Bearer ${EXPIRED_TOKEN}`
    await plugin.request(ctx, NOOP)
    expect(ctx.state.auth).toBeTruthy()
    expect(ctx.state.auth).toMatchObject({
      success: true,
      decoded: {
        iss: "https://funcmatic.auth0.com/"
      }
    })
  })
})

describe('Valid Authentication', () => {
  let ctx = null
  let plugin = null
  let accesstoken = null
  let idtoken = null
  beforeAll(async () => {
    let username = process.env.AUTH0_USERNAME
    let password = process.env.AUTH0_PASSWORD
    let user = await auth(username, password, {
      AUTH0_DOMAIN: process.env.FUNC_AUTH0_DOMAIN,
      AUTH0_CLIENTID: process.env.AUTH0_CLIENTID,
      AUTH0_CLIENTSECRET: process.env.AUTH0_CLIENTSECRET,
      AUTH0_AUDIENCE: process.env.AUTH0_AUDIENCE,
      AUTH0_SCOPE: process.env.AUTH0_SCOPE
    })
    accesstoken = user.access_token
    idtoken = user.id_token
  })
  beforeEach(async () => {
    ctx = {
      env: {
        FUNC_AUTH0_DOMAIN: process.env.FUNC_AUTH0_DOMAIN,
        FUNC_AUTH0_SKIP_VERIFICATION: 'false'
      },
      event: { headers: { Authorization: '' } },
      state: { },
      logger: console
    }
    plugin = new Auth0Plugin()
    await plugin.start(ctx, NOOP)
  })
  it ('should decode a valid id token', async () => {
    ctx.event.headers['Authorization'] = `Bearer ${idtoken}`
    await plugin.request(ctx, NOOP)
    expect(ctx.state.auth).toBeTruthy()
    expect(ctx.state.auth).toMatchObject({
      success: true,
      decoded: {
        name: process.env.AUTH0_USERNAME,
      }
    })
  })
  it ('should decode a valid access token', async () => {
    ctx.event.headers['Authorization'] = `Bearer ${accesstoken}`
    await plugin.request(ctx, NOOP)
    expect(ctx.state.auth).toBeTruthy()
    expect(ctx.state.auth).toMatchObject({
      success: true,
      decoded: {
        iss: `https://${process.env.FUNC_AUTH0_DOMAIN}/`,
      }
    })
  })
})
