import React, { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import { useNavigate } from 'react-router-dom'

export function Dashboard() {
  const [user, setUser] = useState(null)
  const [inmobiliaria, setInmobiliaria] = useState(null)
  const [rol, setRol] = useState('')
  const [loading, setLoading] = useState(true)
  const [jwtData, setJwtData] = useState(null)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data: { user }, error: userError } = await supabase.auth.getUser()
        
        if (!user || userError) {
          navigate('/login')
          return
        }

        setUser(user)

        // Obtener y verificar los datos del JWT
        const { data: sessionData } = await supabase.auth.getSession()
        const jwtMetadata = sessionData.session?.user.app_metadata
        setJwtData(jwtMetadata)

        console.log('JWT Metadata:', jwtMetadata)

        if (!jwtMetadata?.inmobiliaria_id) {
          console.error('Error: inmobiliaria_id no encontrado en el JWT')
          setError('Error de configuración: inmobiliaria_id no encontrado en el JWT')
          return
        }

        // Obtener datos del perfil
        const { data: profileData, error: profileError } = await supabase
          .from('perfiles')
          .select('rol, inmobiliarias:inmobiliaria_id (id, nombre)')
          .eq('usuario_id', user.id)
          .single()

        if (profileError || !profileData) {
          console.error('Error fetching profile:', profileError)
          setError('El usuario no tiene un perfil asignado')
          return
        }

        setRol(profileData.rol)
        setInmobiliaria(profileData.inmobiliarias)
      } catch (err) {
        console.error('Error in dashboard:', err)
        setError('Ocurrió un error al cargar los datos')
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [navigate])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    navigate('/login')
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center space-x-4">
              <h1 className="text-xl font-bold">
                {inmobiliaria ? inmobiliaria.nombre : 'Mi Inmobiliaria'}
              </h1>
              <span className="bg-blue-100 text-blue-800 text-sm font-medium px-2.5 py-0.5 rounded">
                {rol}
              </span>
            </div>
            <button
              onClick={handleLogout}
              className="text-gray-700 hover:text-gray-900"
            >
              Cerrar Sesión
            </button>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="border-4 border-dashed border-gray-200 rounded-lg p-6">
            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                {error}
              </div>
            )}

            <h2 className="text-2xl font-bold mb-4">Bienvenido, {user.email}</h2>
            
            {/* Debug Section */}
            <div className="mt-8 p-4 bg-gray-50 rounded-lg">
              <h3 className="text-lg font-semibold mb-2">Debug Info (Solo para pruebas)</h3>
              <div className="space-y-2">
                <div>
                  <span className="font-medium">JWT Metadata:</span>
                  <pre className="bg-white p-2 rounded text-sm">
                    {JSON.stringify(jwtData, null, 2)}
                  </pre>
                </div>
                <div>
                  <span className="font-medium">User ID:</span>
                  <div className="bg-white p-2 rounded break-all text-sm">
                    {user.id}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
