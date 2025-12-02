interface User {
  id: number
  name: string
  email: string
  role: string
}

export default function Header({ user }: { user: User }) {
  return (
    <header className="bg-white border-b-2 border-black px-6 py-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-black">
            Bem-vindo, {user.name}
          </h2>
          <p className="text-sm text-gray-600 mt-1">
            {new Date().toLocaleDateString('pt-BR', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-gray-600 uppercase tracking-wide">
            {user.role === 'admin' ? 'Administrador' : 'Usuário'}
          </span>
        </div>
      </div>
    </header>
  )
}
