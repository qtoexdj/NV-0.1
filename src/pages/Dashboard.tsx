import React, { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import { useNavigate } from 'react-router-dom'
import AdminPanel from '../components/AdminPanel'
import UserPanel from '../components/UserPanel'

export function Dashboard() {
  const [user, setUser] = useState(null)
  const [inmobiliaria, setInmobiliaria] = useState(null)
  const [rol, setRol] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Obtener usuario y sesión
        const { data: { user, session }, error: userError } = await supabase.auth.getUser()
        
        if (!user || userError) {
          navigate('/login')
          return
        }

        setUser(user)

        // Verificar si el usuario tiene un perfil
        const { data: profileData, error: profileError } = await supabase
          .from('perfiles')
          .select('*')
          .eq('usuario_id', user.id)
          .single()

        if (profileError || !profileData) {
          // Si no tiene perfil, crear uno
          const { error: createProfileError } = await supabase
            .from('perfiles')
            .insert([
              {
                usuario_id: user.id,
                inmobiliaria_id: 'id_de_inmobiliaria',  // Reemplaza con el ID de una inmobiliaria existente
                rol: 'usuario'  // Rol por defecto
              }
            ])

          if (createProfileError) throw createProfileError
        }

        // Obtener inmobiliaria_id y rol de los metadatos
        const { inmobiliaria_id, rol } = user.app_metadata
        if (!inmobiliaria_id || !rol) {
          throw new Error('Faltan datos en los metadatos del usuario')
        }

        setRol(rol)

        // Obtener datos de la inmobiliaria
        const { data: inmobiliariaData, error: inmobiliariaError } = await supabase
          .from('inmobiliarias')
          .select('id, nombre_inm')
          .eq('id', inmobiliaria_id)
          .single()

        if (inmobiliariaError || !inmobiliariaData) {
          throw new Error('No se pudo obtener la información de la inmobiliaria')
        }

        setInmobiliaria(inmobiliariaData)
      } catch (err) {
        console.error('Error fetching data:', err)
        setError(err.message)
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
                {inmobiliaria ? inmobiliaria.nombre_inm : 'Mi Inmobiliaria'}
              </h1>
              <span className="bg-blue-100 text-blue-800 text-sm font-medium px-2.5 py-0.5 rounded">
                {rol}
              </span>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-gray-700">{user?.email}</span>
              <button
                onClick={handleLogout}
                className="text-gray-700 hover:text-gray-900"
              >
                Cerrar Sesión
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}

          {rol === 'admin' && <AdminPanel inmobiliaria={inmobiliaria} user={user} />}
          {rol === 'user' && <UserPanel inmobiliaria={inmobiliaria} user={user} />}
        </div>
      </main>
    </div>
  )
}
