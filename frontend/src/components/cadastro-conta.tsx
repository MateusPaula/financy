import * as Form from "@radix-ui/react-form";
import { useMutation } from "@apollo/client/react";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "sonner";
import { Header } from "./header";
import { UserRound, LogIn, Mail, Lock, Eye, EyeOff, Loader2 } from "lucide-react";
import { useState } from "react";
import { REGISTER } from "../lib/graphql/mutations/auth.mutations";
import { useAuthStore } from "../stores/auth";
import type { AuthOutput } from "../types";

type RegisterData = { register: AuthOutput };

export function CadastroConta() {
  const [showPassword, setShowPassword] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const setAuth = useAuthStore((s) => s.setAuth);

  const [register, { loading }] = useMutation<RegisterData>(REGISTER, {
    onCompleted: (data) => {
      const { token, user } = data.register;
      setAuth(token, user);
      navigate("/dashboard");
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    register({ variables: { data: { name, email, password } } });
  }

  return (
    <main className="min-h-dvh bg-gray-100 flex flex-col p-4 md:p-8">
      <div className="w-full max-w-2xl mx-auto">
        <div className="flex justify-center mb-6">
          <Header />
        </div>
      </div>

      <div className="bg-white flex flex-col items-center border border-gray-300 rounded-xl max-w-2xl mx-auto w-full">
        <div className="flex flex-col items-center w-full px-6 md:px-12 py-8">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
            Criar conta
          </h1>
          <p className="text-gray-600 mb-8">
            Comece a controlar suas finanças ainda hoje
          </p>

          <Form.Root className="w-full max-w-md" onSubmit={handleSubmit}>
            <Form.Field name="name" className="mb-6">
              <Form.Label className="block text-gray-700 font-medium mb-2">
                Nome completo
              </Form.Label>

              <div className="relative">
                <UserRound size={24} className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none opacity-40" />
                <Form.Control asChild>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full pl-14 pr-4 py-3.5 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-transparent text-gray-900 placeholder:text-gray-400"
                    placeholder="Seu nome completo"
                    required
                  />
                </Form.Control>
              </div>
            </Form.Field>

            <Form.Field name="email" className="mb-6">
              <Form.Label className="block text-gray-700 font-medium mb-2">
                E-mail
              </Form.Label>

              <div className="relative">
                <Mail size={24} className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none opacity-40" />
                <Form.Control asChild>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-14 pr-4 py-3.5 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-transparent text-gray-900 placeholder:text-gray-400"
                    placeholder="mail@exemplo.com"
                    required
                  />
                </Form.Control>
              </div>
            </Form.Field>

            <Form.Field name="password" className="mb-4">
              <Form.Label className="block text-gray-700 font-medium mb-2">
                Senha
              </Form.Label>

              <div className="relative">
                <Lock size={24} className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none opacity-40" />
                <Form.Control asChild>
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-14 pr-14 py-3.5 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-transparent text-gray-900 placeholder:text-gray-400"
                    placeholder="Digite sua senha"
                    required
                  />
                </Form.Control>
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 w-6 h-6 opacity-40 hover:opacity-60 transition-opacity"
                  aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
                >
                  {showPassword ? <EyeOff size={24} /> : <Eye size={24} />}
                </button>
              </div>
            </Form.Field>

            <Form.Submit asChild>
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-green-700 hover:bg-green-800 text-white font-semibold py-3.5 rounded-xl transition-colors mb-8 disabled:opacity-60 flex items-center justify-center gap-2"
              >
                {loading && <Loader2 size={20} className="animate-spin" />}
                Cadastrar
              </button>
            </Form.Submit>
          </Form.Root>

          <div className="flex items-center gap-4 w-full max-w-md mb-8">
            <div className="flex-1 h-px bg-gray-300"></div>
            <span className="text-gray-500 text-sm">ou</span>
            <div className="flex-1 h-px bg-gray-300"></div>
          </div>

          <div className="flex flex-col items-center gap-4 w-full max-w-md">
            <p className="text-gray-600">Já tem uma conta?</p>
            <Link
              to="/"
              className="w-full flex items-center justify-center gap-2 bg-white hover:bg-gray-50 text-gray-700 font-semibold py-3.5 rounded-xl border border-gray-300 transition-colors"
            >
              <LogIn size={20} />
              Fazer login
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
