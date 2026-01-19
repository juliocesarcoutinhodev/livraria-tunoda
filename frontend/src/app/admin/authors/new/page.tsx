"use client";

import { useState, FormEvent, ChangeEvent } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import AdminSidebar from "@/components/layout/AdminSidebar";
import Breadcrumb from "@/components/layout/Breadcrumb";
import { useCreateAuthor } from "@/hooks";
import type { CreateAuthorRequest } from "@/types/author";

/**
 * Página de criação de novo autor
 * Formulário completo com validação e preview de imagem
 */
export default function NewAuthorPage() {
  const router = useRouter();
  const createAuthor = useCreateAuthor();

  // Form state
  const [formData, setFormData] = useState<CreateAuthorRequest>({
    name: "",
    biography: "",
    photoUrl: "",
  });

  // Validation errors
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Success message
  const [successMessage, setSuccessMessage] = useState("");

  // Track which fields were touched (interacted with)
  const [touchedFields, setTouchedFields] = useState<Record<string, boolean>>(
    {}
  );

  /**
   * Valida URL de imagem
   */
  const isValidUrl = (url: string): boolean => {
    if (!url) return true; // URL é opcional
    try {
      const urlObj = new URL(url);
      return urlObj.protocol === "http:" || urlObj.protocol === "https:";
    } catch {
      return false;
    }
  };

  /**
   * Valida todos os campos do formulário
   */
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    // Nome: obrigatório, máx 200 caracteres
    if (!formData.name.trim()) {
      newErrors.name = "Nome é obrigatório";
    } else if (formData.name.length > 200) {
      newErrors.name = "Nome não pode ter mais de 200 caracteres";
    }

    // Biografia: obrigatória, mín 20 caracteres
    if (!formData.biography.trim()) {
      newErrors.biography = "Biografia é obrigatória";
    } else if (formData.biography.trim().length < 20) {
      newErrors.biography = "Biografia deve ter no mínimo 20 caracteres";
    }

    // URL da foto: opcional, mas se preenchida deve ser válida
    if (formData.photoUrl && !isValidUrl(formData.photoUrl)) {
      newErrors.photoUrl = "URL inválida";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /**
   * Atualiza campo do formulário
   */
  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Limpa erro do campo ao digitar
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }

    // Limpa mensagem de sucesso ao editar
    if (successMessage) {
      setSuccessMessage("");
    }
  };

  /**
   * Marca campo como touched ao perder foco
   */
  const handleBlur = (fieldName: string) => {
    setTouchedFields((prev) => ({ ...prev, [fieldName]: true }));
  };

  /**
   * Submete o formulário
   */
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Valida formulário
    if (!validateForm()) {
      return;
    }

    try {
      // Prepara dados (remove photoUrl se vazia)
      const dataToSubmit: CreateAuthorRequest = {
        name: formData.name.trim(),
        biography: formData.biography.trim(),
      };

      if (formData.photoUrl?.trim()) {
        dataToSubmit.photoUrl = formData.photoUrl.trim();
      }

      // Cria autor
      await createAuthor.mutateAsync(dataToSubmit);

      // Sucesso!
      setSuccessMessage("Autor criado com sucesso!");
      setFormData({ name: "", biography: "", photoUrl: "" });

      // Redireciona após 1.5 segundos
      setTimeout(() => {
        router.push("/admin/authors");
      }, 1500);
    } catch (error: any) {
      // Erros do backend
      if (error.response?.data?.errors) {
        const backendErrors: Record<string, string> = {};
        error.response.data.errors.forEach((err: any) => {
          backendErrors[err.field] = err.message;
        });
        setErrors(backendErrors);
      } else if (error.response?.data?.message) {
        setErrors({ form: error.response.data.message });
      } else {
        setErrors({ form: "Erro ao criar autor. Tente novamente." });
      }
    }
  };

  return (
    <div className="flex min-h-screen bg-christian-background">
      <AdminSidebar />
      <main className="flex-1 lg:ml-64 p-4 lg:p-6 overflow-y-auto">
        <Breadcrumb
          items={[
            { label: "Dashboard", href: "/admin/dashboard" },
            { label: "Autores", href: "/admin/authors" },
            { label: "Novo Autor" },
          ]}
        />

        <div className="mb-6">
          <h1 className="text-2xl font-bold text-christian-text font-playfair mb-1">
            Novo Autor
          </h1>
          <p className="text-christian-text/70 text-sm">
            Preencha os dados abaixo para cadastrar um novo autor no sistema
          </p>
        </div>

        {/* Mensagem de Sucesso */}
        {successMessage && (
          <div
            className="mb-6 p-4 bg-green-50 border-l-4 border-green-500 text-green-800 rounded-lg"
            role="alert"
          >
            <div className="flex items-center">
              <svg
                className="w-5 h-5 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
              <p className="font-medium">{successMessage}</p>
            </div>
          </div>
        )}

        {/* Erro Geral */}
        {errors.form && (
          <div
            className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-800 rounded-lg"
            role="alert"
          >
            <div className="flex items-center">
              <svg
                className="w-5 h-5 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
              <p className="font-medium">{errors.form}</p>
            </div>
          </div>
        )}

        {/* Formulário */}
        <div className="bg-white rounded-xl shadow-md p-4 lg:p-6">
          <form
            onSubmit={handleSubmit}
            className="space-y-4"
            style={{ maxWidth: "720px" }}
          >
            {/* Nome */}
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-semibold text-christian-text mb-1.5"
              >
                Nome do Autor <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                onBlur={() => handleBlur("name")}
                maxLength={200}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 transition-colors ${
                  touchedFields.name && errors.name
                    ? "border-red-500 focus:ring-red-500"
                    : "border-gray-300 focus:ring-christian-blue"
                }`}
                placeholder="Ex: Robert C. Martin"
                aria-required="true"
                aria-invalid={touchedFields.name && !!errors.name}
                aria-describedby={
                  touchedFields.name && errors.name ? "name-error" : "name-help"
                }
              />
              <div className="flex justify-between mt-1">
                <div className="flex-1">
                  {touchedFields.name && errors.name ? (
                    <p id="name-error" className="text-sm text-red-600">
                      {errors.name}
                    </p>
                  ) : (
                    <p id="name-help" className="text-sm text-gray-500">
                      Nome completo do autor
                    </p>
                  )}
                </div>
                <p className="text-sm text-gray-500 ml-4">
                  {formData.name.length}/200
                </p>
              </div>
            </div>

            {/* Biografia */}
            <div>
              <label
                htmlFor="biography"
                className="block text-sm font-semibold text-christian-text mb-1.5"
              >
                Biografia <span className="text-red-500">*</span>
              </label>
              <p className="text-sm text-gray-600 mb-1.5">
                Escreva sobre a trajetória, obras e contribuições do autor
              </p>
              <textarea
                id="biography"
                name="biography"
                value={formData.biography}
                onChange={handleChange}
                onBlur={() => handleBlur("biography")}
                rows={5}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 transition-colors resize-y ${
                  touchedFields.biography && errors.biography
                    ? "border-red-500 focus:ring-red-500"
                    : "border-gray-300 focus:ring-christian-blue"
                }`}
                placeholder="Ex: Robert C. Martin é um engenheiro de software americano, autor e palestrante. É co-autor do Manifesto Ágil e autor de diversos livros incluindo Clean Code, Clean Architecture e The Clean Coder..."
                aria-required="true"
                aria-invalid={touchedFields.biography && !!errors.biography}
                aria-describedby={
                  touchedFields.biography && errors.biography
                    ? "biography-error"
                    : "biography-help"
                }
              />
              <div className="flex justify-between mt-1">
                <div className="flex-1">
                  {touchedFields.biography && errors.biography ? (
                    <p id="biography-error" className="text-sm text-red-600">
                      {errors.biography}
                    </p>
                  ) : (
                    <p id="biography-help" className="text-sm text-gray-500">
                      Mínimo de 20 caracteres
                    </p>
                  )}
                </div>
                <p
                  className={`text-sm ml-4 ${
                    touchedFields.biography &&
                    formData.biography.trim().length < 20
                      ? "text-amber-600 font-medium"
                      : "text-gray-500"
                  }`}
                >
                  {formData.biography.trim().length} caracteres
                </p>
              </div>
            </div>

            {/* URL da Foto */}
            <div>
              <label
                htmlFor="photoUrl"
                className="block text-sm font-semibold text-christian-text mb-1.5"
              >
                Foto do Autor{" "}
                <span className="text-gray-500 font-normal">(opcional)</span>
              </label>
              <p className="text-sm text-gray-600 mb-1.5">
                URL da imagem que será exibida na listagem de autores e nos
                livros
              </p>
              <input
                type="url"
                id="photoUrl"
                name="photoUrl"
                value={formData.photoUrl}
                onChange={handleChange}
                onBlur={() => handleBlur("photoUrl")}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 transition-colors ${
                  touchedFields.photoUrl && errors.photoUrl
                    ? "border-red-500 focus:ring-red-500"
                    : "border-gray-300 focus:ring-christian-blue"
                }`}
                placeholder="https://example.com/photo.jpg"
                aria-invalid={touchedFields.photoUrl && !!errors.photoUrl}
                aria-describedby={
                  touchedFields.photoUrl && errors.photoUrl
                    ? "photoUrl-error"
                    : "photoUrl-help"
                }
              />
              <div className="mt-1">
                {touchedFields.photoUrl && errors.photoUrl ? (
                  <p id="photoUrl-error" className="text-sm text-red-600">
                    {errors.photoUrl}
                  </p>
                ) : (
                  <p id="photoUrl-help" className="text-sm text-gray-500">
                    Cole o link de uma imagem hospedada (formato: https://...)
                  </p>
                )}
              </div>

              {/* Preview da Foto */}
              {formData.photoUrl && isValidUrl(formData.photoUrl) && (
                <div className="mt-3">
                  <p className="text-sm font-medium text-gray-700 mb-2">
                    Preview:
                  </p>
                  <div className="relative w-32 h-32 rounded-lg overflow-hidden border-2 border-gray-200">
                    <Image
                      src={formData.photoUrl}
                      alt="Preview da foto do autor"
                      fill
                      className="object-cover"
                      onError={() => {
                        setErrors((prev) => ({
                          ...prev,
                          photoUrl: "Não foi possível carregar a imagem",
                        }));
                      }}
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Botões */}
            <div className="flex flex-col-reverse sm:flex-row gap-3 pt-4 border-t border-gray-200 mt-2">
              <Link
                href="/admin/authors"
                className="sm:flex-none px-6 py-2.5 text-gray-600 hover:text-gray-800 font-medium rounded-lg hover:bg-gray-100 transition-colors text-center"
              >
                Cancelar
              </Link>

              <button
                type="submit"
                disabled={createAuthor.isPending}
                className="sm:flex-none px-8 py-2.5 bg-christian-blue hover:bg-christian-blue/90 text-white font-semibold rounded-lg transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-sm"
              >
                {createAuthor.isPending ? (
                  <>
                    <svg
                      className="animate-spin h-5 w-5"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
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
                    <span>Salvando...</span>
                  </>
                ) : (
                  "Salvar Autor"
                )}
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
