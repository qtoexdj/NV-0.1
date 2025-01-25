import React from 'react'

export default function UserPanel({ inmobiliaria, user }) {
  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h2 className="text-2xl font-bold mb-4">Panel de Usuario</h2>
      <div className="space-y-4">
        <div className="bg-green-50 p-4 rounded-lg">
          <h3 className="font-semibold">Bienvenido, {user?.email}</h3>
          <p>
            Estás asociado a: {inmobiliaria ? inmobiliaria.nombre_inm : 'Inmobiliaria no asignada'}
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white p-4 rounded-lg border">
            <h4 className="font-semibold mb-2">Tus Acciones</h4>
            <ul className="list-disc list-inside">
              <li>Ver Propiedades</li>
              <li>Actualizar Perfil</li>
              <li>Contactar Soporte</li>
            </ul>
          </div>
          <div className="bg-white p-4 rounded-lg border">
            <h4 className="font-semibold mb-2">Tu Actividad</h4>
            <p>Propiedades vistas: 12</p>
            <p>Mensajes enviados: 3</p>
          </div>
        </div>
      </div>
    </div>
  )
}
