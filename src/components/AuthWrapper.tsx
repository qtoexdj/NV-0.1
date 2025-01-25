import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getSession } from '../lib/auth'

export function AuthWrapper({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    const checkAuth = async () => {
      const session = await getSession()
      if (!session) navigate('/login')
      setLoading(false)
    }

    checkAuth()
  }, [navigate])

  if (loading) return <div>Cargando...</div>

  return <>{children}</>
}
