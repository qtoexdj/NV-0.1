import React, { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

export default function AdminPanel({ inmobiliaria, user }) {
  const [users, setUsers] = useState([])
  const [loadingUsers, setLoadingUsers] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    try {
      setLoadingUsers(true)
      setError('')

      // Obtener todos los usuarios de la misma inmobiliaria
      const { data, error: fetchError } = await supabase
        .from('perfiles')
        .select(`
          usuario_id,
          usuarios:usuario_id (email)
        `)
        .eq('inmobiliaria_id', inmobiliaria.id)

      if (fetchError) throw fetchError

      // Mapear los resultados para obtener solo los emails
      const userEmails = data.map(profile => ({
        id: profile.usuario_id,
        email: profile.usuarios.email
      }))

      setUsers(userEmails)
    } catch (err) {
      console.error('Error fetching users:', err)
      setError(err.message)
    } finally {
      setLoadingUsers(false)
    }
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h2 className="text-2xl font-bold mb-4">Panel de Administrador</h2>
      <div className="space-y-6">
        {/* Bienvenida */}
        <div className="bg-blue-50 p-4 rounded-lg">
          <h3 className="font-semibold">Bienvenido, {user?.email}</h3>
          <p>
            Estás gestionando: <span className="font-medium">{inmobiliaria.nombre_inm}</span>
          </p>
        </div>

        {/* Gestión de Usuarios */}
        <div className="bg-white p-4 rounded-lg border">
          <h4 className="text-xl font-semibold mb-4">Gestión de Usuarios</h4>
          <div className="flex items-start gap-4">
            <button
              onClick={fetchUsers}
              disabled={loadingUsers}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:opacity-50"
            >
              {loadingUsers ? 'Actualizando...' : 'Ver Usuarios'}
            </button>

            <div className="flex-1">
              {users.length > 0 && (
                <div className="bg-gray-50 p-4 rounded">
                  <h5 className="font-semibold mb-2">Usuarios de la Inmobiliaria</h5>
                  <ul className="space-y-1">
                    {users.map((user) => (
                      <li key={user.id} className="text-sm text-gray-700">
                        {user.email}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mt-4">
              {error}
            </div>
          )}
        </div>

        {/* Estadísticas Rápidas */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white p-4 rounded-lg border">
            <h4 className="text-xl font-semibold mb-4">Estadísticas Rápidas</h4>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Usuarios activos:</span>
                <span className="font-medium">{users.length}</span>
              </div>
              <div className="flex justify-between">
                <span>Propiedades listadas:</span>
                <span className="font-medium">42</span>
              </div>
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg border">
            <h4 className="text-xl font-semibold mb-4">Acciones Rápidas</h4>
            <div className="space-y-2">
              <button className="w-full bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">
                Agregar Nuevo Usuario
              </button>
              <button className="w-full bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
                Ver Reportes
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
