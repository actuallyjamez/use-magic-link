import {useState, useEffect} from 'react'
import unfetch from 'isomorphic-unfetch'
import {Sema} from 'async-sema'
import {Magic} from 'magic-sdk'

export interface token {
  token: string,
  expiredAt: number
}


export interface useMagicLink {
  loggedIn: boolean;
  loading: boolean;
  error?: Error;
  loggingIn: boolean;
  loggingOut: boolean;
  login: (email: string) => Promise<void>;
  logout: () => Promise<boolean>;
  fetch: (url: string, opts: RequestInit) => Promise<Response>;
  magic: Magic;
}

const tokenSema = new Sema(1)
const loggedInSema = new Sema(1)

const ONE_MINUTE = 1000 * 60

let currentLoginState: boolean = null
let currentToken: token = null
let magic: Magic = new Magic('API_KEY')


async function getMagicToken(apiKey) {
  await tokenSema.acquire()
  try {
    if (currentToken && currentToken.expiredAt > Date.now()) {
      return currentToken.token
    }

    const magic = new Magic(apiKey)
    const token = await magic.user.getIdToken()
    setToken(token)
    return token
  } finally {
    tokenSema.release()
  }
}

async function isLoggedIn(magicLinkKey) {
  await loggedInSema.acquire()

  try {
    if (currentLoginState !== null) {
      return currentLoginState
    }

    await getMagicToken(magicLinkKey)
    currentLoginState = true
  } catch (err) {
    currentLoginState = false
  } finally {
    loggedInSema.release()
  }

  return currentLoginState
}

function setToken(token, lifespan = ONE_MINUTE * 15) {
  currentToken = {
    token,
    expiredAt: Date.now() + lifespan - ONE_MINUTE,
  }
}

export function useMagic(apiKey: string): useMagicLink {
  if (!apiKey) {
    throw new Error('Magic Link publishableKey required as the first argument')
  }

  const [loggedIn, setLoggedIn] = useState<boolean>(
    currentLoginState !== null ? currentLoginState : false
  )
  const [loading, setLoading] = useState<boolean>(currentLoginState === null)
  const [error, setError] = useState<Error>(null)
  const [loggingIn, setLoggingIn] = useState<boolean>(false)
  const [loggingOut, setLoggingOut] = useState<boolean>(false)

  async function login(email: string) {
    setError(null)
    setLoggingIn(true)

    try {
      const magic = new Magic(apiKey)
      const token = await magic.auth.loginWithMagicLink({email})
      currentLoginState = true
      setToken(token)
      setLoggedIn(true)
    } catch (err) {
      setError(err)
    } finally {
      setLoggingIn(false)
    }
  }

  async function logout() {
    setError(null)
    setLoggingOut(true)

    try {
      const magic = new Magic(apiKey)
      await magic.user.logout()
      currentLoginState = null
      currentToken = null
      setLoggedIn(false)
    } catch (err) {
      setError(err)
    } finally {
      setLoggingOut(false)
    }

    return currentLoginState === null
  }

  async function fetch(url: string, opts: RequestInit) {
    const token = await getMagicToken(apiKey)
    if (token) {
      opts.headers = opts.headers || {}
      opts.headers['Authorization'] = `Bearer ${token}`
    }

    return unfetch(url, opts)
  }

  useEffect(() => {
    if (!currentLoginState) {
      isLoggedIn(apiKey)
        .then((loginState) => {
          setLoggedIn(loginState)
        })
        .then(() => setLoading(false))
    }
  }, [currentLoginState])

  return {
    loggedIn,
    loading,
    error,
    loggingIn,
    loggingOut,
    login,
    logout,
    fetch,
    magic,
  }
}
