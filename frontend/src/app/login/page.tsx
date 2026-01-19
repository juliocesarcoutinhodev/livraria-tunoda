"use client";

/**
 * Login Page
 *
 * Página de autenticação para administradores.
 * Integrada com backend Spring Boot via authService.
 *
 * Validações:
 * - Frontend: Apenas campos obrigatórios (não vazios)
 * - Backend: Formato de email, regras de senha, lógica de negócio
 *
 * @module app/login
 */

import { useState, FormEvent, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useLogin } from "@/hooks";
import { useRateLimit } from "@/hooks/useRateLimit";
import { getErrorMessage, getValidationErrors } from "@/lib/api-client";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirect") || "/admin/dashboard";
  const sessionExpired = searchParams.get("session_expired") === "true";
  const login = useLogin();

  // Form state
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>(
    {}
  );
  const [errorMessage, setErrorMessage] = useState("");

  // Rate limiting (máx 5 tentativas por minuto)
  const rateLimit = useRateLimit({
    maxAttempts: 5,
    windowMs: 60 * 1000, // 1 minuto
  });

  /**
   * Valida o formulário (apenas campos obrigatórios)
   * Backend valida formato, regras de negócio, etc.
   */
  const validateForm = (): boolean => {
    const newErrors: { email?: string; password?: string } = {};

    // Validação apenas de campos obrigatórios
    if (!email.trim()) {
      newErrors.email = "Email é obrigatório";
    }

    if (!password.trim()) {
      newErrors.password = "Senha é obrigatória";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /**
   * Tratamento de erros de login
   * Pega erros do backend e exibe no formulário
   */
  const handleLoginError = (error: unknown) => {
    // Pega erros de validação de campo do backend
    const validationErrors = getValidationErrors(error);

    if (validationErrors && validationErrors.length > 0) {
      // Mapeia erros de campo para o estado
      const fieldErrors: { email?: string; password?: string } = {};

      validationErrors.forEach((err) => {
        if (err.field === "email") {
          fieldErrors.email = err.message;
        } else if (err.field === "password" || err.field === "senha") {
          fieldErrors.password = err.message;
        }
      });

      setErrors(fieldErrors);

      // Se houver erros que não são de campo específico, mostra como erro geral
      const generalErrors = validationErrors.filter(
        (err) =>
          err.field !== "email" &&
          err.field !== "password" &&
          err.field !== "senha"
      );

      if (generalErrors.length > 0) {
        setErrorMessage(generalErrors.map((e) => e.message).join(", "));
      }
    } else {
      // Erro geral (não é de validação de campo)
      const message = getErrorMessage(error);

      // Tratamento de erros específicos
      if (message.includes("Network") || message.includes("Failed to fetch")) {
        setErrorMessage(
          "Erro de conexão. Verifique sua internet e tente novamente."
        );
      } else {
        // Exibe mensagem do backend diretamente
        setErrorMessage(message || "Erro ao fazer login. Tente novamente.");
      }
    }
  };

  /**
   * Submit do formulário
   */
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMessage("");

    // Rate limiting
    if (!rateLimit.canAttempt) {
      setErrorMessage(
        `Muitas tentativas. Aguarde ${rateLimit.resetTimeSeconds}s para tentar novamente.`
      );
      return;
    }

    // Validação
    if (!validateForm()) {
      return;
    }

    try {
      rateLimit.recordAttempt();

      // Login via React Query (já salva no store automaticamente)
      await login.mutateAsync({
        email,
        password,
      });

      // Sucesso: redireciona para a URL original ou dashboard
      router.push(redirectTo);
    } catch (error) {
      handleLoginError(error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-christian-background via-white to-christian-blue/5 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        {/* Card de Login */}
        <div className="bg-white rounded-2xl shadow-2xl p-8 sm:p-10 animate-fade-in">
          {/* Logo/Header */}
          <div className="text-center mb-8">
            <div className="inline-block p-3 bg-christian-blue/10 rounded-full mb-4">
              <svg
                className="w-12 h-12 text-christian-blue"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                />
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-christian-text font-playfair">
              Painel Administrativo
            </h1>
            <p className="text-christian-text/60 mt-2">
              Livraria Pastor Tunoda
            </p>
          </div>

          {/* Alerta de Sessão Expirada */}
          {sessionExpired && (
            <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg animate-slide-up">
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0">
                  <svg
                    className="w-5 h-5 text-yellow-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                    />
                  </svg>
                </div>
                <div className="flex-1">
                  <h4 className="text-sm font-semibold text-yellow-800 mb-1">
                    Sessão Expirada
                  </h4>
                  <p className="text-sm text-yellow-700">
                    Sua sessão foi encerrada por inatividade. Por favor, faça
                    login novamente.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Formulário */}
          <form onSubmit={handleSubmit} className="space-y-6" noValidate>
            {/* Erro Geral */}
            {errorMessage && (
              <div
                className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm"
                role="alert"
                aria-live="assertive"
              >
                <div className="flex items-start">
                  <svg
                    className="w-5 h-5 mr-2 flex-shrink-0 mt-0.5"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span>{errorMessage}</span>
                </div>
              </div>
            )}

            {/* Rate Limit Warning */}
            {!rateLimit.canAttempt && (
              <div
                className="bg-yellow-50 border border-yellow-200 text-yellow-700 px-4 py-3 rounded-lg text-sm"
                role="alert"
                aria-live="polite"
              >
                <p>
                  Aguarde <strong>{rateLimit.resetTimeSeconds}s</strong> para
                  tentar novamente.
                </p>
              </div>
            )}

            {/* Campo Email */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-semibold text-christian-text mb-2"
              >
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (errors.email) setErrors({ ...errors, email: undefined });
                }}
                className={`w-full px-4 py-3 rounded-lg border-2 transition-colors focus:outline-none focus:ring-2 focus:ring-christian-blue/20 ${
                  errors.email
                    ? "border-red-300 bg-red-50"
                    : "border-gray-200 bg-white"
                }`}
                placeholder="admin@livraria.com"
                aria-invalid={!!errors.email}
                aria-describedby={errors.email ? "email-error" : undefined}
              />
              {errors.email && (
                <p
                  id="email-error"
                  className="mt-2 text-sm text-red-600"
                  role="alert"
                >
                  {errors.email}
                </p>
              )}
            </div>

            {/* Campo Senha */}
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-semibold text-christian-text mb-2"
              >
                Senha
              </label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (errors.password)
                      setErrors({ ...errors, password: undefined });
                  }}
                  className={`w-full px-4 py-3 pr-12 rounded-lg border-2 transition-colors focus:outline-none focus:ring-2 focus:ring-christian-blue/20 ${
                    errors.password
                      ? "border-red-300 bg-red-50"
                      : "border-gray-200 bg-white"
                  }`}
                  placeholder="••••••••"
                  aria-invalid={!!errors.password}
                  aria-describedby={
                    errors.password ? "password-error" : undefined
                  }
                />
                {/* Toggle Senha */}
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-christian-blue transition-colors"
                  aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
                >
                  {showPassword ? (
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                      />
                    </svg>
                  ) : (
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                      />
                    </svg>
                  )}
                </button>
              </div>
              {errors.password && (
                <p
                  id="password-error"
                  className="mt-2 text-sm text-red-600"
                  role="alert"
                >
                  {errors.password}
                </p>
              )}
            </div>

            {/* Botão Entrar */}
            <div className="space-y-2">
              <button
                type="submit"
                disabled={login.isPending || !rateLimit.canAttempt}
                className="w-full text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                style={{
                  backgroundColor:
                    login.isPending || !rateLimit.canAttempt
                      ? "#9CA3AF"
                      : "#2F5D8C",
                  cursor:
                    login.isPending || !rateLimit.canAttempt
                      ? "not-allowed"
                      : "pointer",
                }}
                onMouseEnter={(e) => {
                  if (!login.isPending && rateLimit.canAttempt) {
                    e.currentTarget.style.backgroundColor = "#3A7D44";
                  }
                }}
                onMouseLeave={(e) => {
                  if (!login.isPending && rateLimit.canAttempt) {
                    e.currentTarget.style.backgroundColor = "#2F5D8C";
                  }
                }}
              >
                {login.isPending ? (
                  <span className="flex items-center justify-center">
                    <svg
                      className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Entrando...
                  </span>
                ) : (
                  "Entrar"
                )}
              </button>
            </div>

            {/* Informações de Teste */}
            {process.env.NODE_ENV === "development" && (
              <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg text-xs text-blue-700">
                <p className="font-semibold mb-1">Credenciais de teste:</p>
                <p>Email: admin@livraria.com</p>
                <p>Senha: admin123</p>
              </div>
            )}
          </form>

          {/* Footer */}
          <div className="mt-6 text-center text-sm text-christian-text/60">
            <p>© 2024 Livraria Pastor Tunoda</p>
            <p className="mt-1">Todos os direitos reservados</p>
          </div>
        </div>

        {/* Informações de Segurança */}
        <div className="mt-6 text-center text-xs text-christian-text/50">
          <p>Conexão segura via HTTPS</p>
          <p className="mt-1">Limite: 5 tentativas por minuto</p>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          Carregando...
        </div>
      }
    >
      <LoginForm />
    </Suspense>
  );
}
