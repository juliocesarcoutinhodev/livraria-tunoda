"use client";

import { useState, FormEvent, ChangeEvent } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
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
    <>
      <div className="flex min-h-screen bg-gray-50">
        <AdminSidebar />

        <div className="flex-1 lg:ml-64 min-w-0">
          <div className="p-4 lg:p-8">
            <Breadcrumb
              items={[
                { label: "Dashboard", href: "/admin/dashboard" },
                { label: "Autores", href: "/admin/authors" },
                { label: "Novo Autor", href: "/admin/authors/new" },
              ]}
            />

            <div className="flex items-center justify-between mb-6">
              <h1 className="text-2xl font-bold text-gray-900">
                Cadastrar Novo Autor
              </h1>
            </div>

            {/* Mensagem de Sucesso */}
            {successMessage && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
                <p className="text-green-600">{successMessage}</p>
              </div>
            )}

            {/* Erro Geral */}
            {errors.form && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                <p className="text-red-600">{errors.form}</p>
              </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Formulário */}
              <div className="lg:col-span-2">
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Informações do Autor */}
                  <div className="bg-white rounded-lg shadow-sm p-6">
                    <h2 className="text-lg font-semibold text-gray-900 mb-4">
                      Informações do Autor
                    </h2>

                    <div className="space-y-4">
                      {/* Nome */}
                      <div>
                        <label
                          htmlFor="name"
                          className="block text-sm font-medium text-gray-700 mb-2"
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
                          className={`w-full px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-christian-blue focus:border-transparent ${
                            errors.name ? "border-red-300" : "border-gray-300"
                          }`}
                          placeholder="Ex: Robert C. Martin"
                        />
                        <div className="flex justify-between mt-1">
                          {errors.name && (
                            <p className="text-sm text-red-600">
                              {errors.name}
                            </p>
                          )}
                          <p className="text-xs text-gray-500 ml-auto">
                            {formData.name.length}/200
                          </p>
                        </div>
                      </div>

                      {/* Biografia */}
                      <div>
                        <label
                          htmlFor="biography"
                          className="block text-sm font-medium text-gray-700 mb-2"
                        >
                          Biografia <span className="text-red-500">*</span>
                        </label>
                        <textarea
                          id="biography"
                          name="biography"
                          value={formData.biography}
                          onChange={handleChange}
                          onBlur={() => handleBlur("biography")}
                          rows={6}
                          className={`w-full px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-christian-blue focus:border-transparent ${
                            errors.biography
                              ? "border-red-300"
                              : "border-gray-300"
                          }`}
                          placeholder="Escreva sobre a trajetória, obras e contribuições do autor..."
                        />
                        <div className="flex justify-between mt-1">
                          {errors.biography && (
                            <p className="text-sm text-red-600">
                              {errors.biography}
                            </p>
                          )}
                          <p className="text-xs text-gray-500 ml-auto">
                            Mínimo 20 caracteres (
                            {formData.biography.trim().length} caracteres)
                          </p>
                        </div>
                      </div>

                      {/* URL da Foto */}
                      <div>
                        <label
                          htmlFor="photoUrl"
                          className="block text-sm font-medium text-gray-700 mb-2"
                        >
                          URL da Foto
                        </label>
                        <input
                          type="url"
                          id="photoUrl"
                          name="photoUrl"
                          value={formData.photoUrl}
                          onChange={handleChange}
                          onBlur={() => handleBlur("photoUrl")}
                          className={`w-full px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-christian-blue focus:border-transparent ${
                            errors.photoUrl
                              ? "border-red-300"
                              : "border-gray-300"
                          }`}
                          placeholder="https://exemplo.com/foto.jpg"
                        />
                        {errors.photoUrl && (
                          <p className="text-sm text-red-600 mt-1">
                            {errors.photoUrl}
                          </p>
                        )}
                        <p className="text-xs text-gray-500 mt-1">
                          Opcional - URL pública da imagem do autor
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Botões de Ação */}
                  <div className="flex gap-4">
                    <button
                      type="submit"
                      disabled={createAuthor.isPending}
                      className="flex-1 bg-christian-blue hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {createAuthor.isPending
                        ? "Cadastrando..."
                        : "Cadastrar Autor"}
                    </button>
                    <button
                      type="button"
                      onClick={() => router.back()}
                      className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                    >
                      Cancelar
                    </button>
                  </div>
                </form>
              </div>

              {/* Preview do Autor */}
              <div className="lg:col-span-1">
                <div className="bg-white rounded-lg shadow-sm p-6 sticky top-4">
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">
                    Preview
                  </h2>

                  <div className="border border-gray-200 rounded-lg p-4">
                    {/* Foto do Autor */}
                    <div className="w-32 h-32 mx-auto bg-gray-100 rounded-full overflow-hidden mb-4">
                      {formData.photoUrl && isValidUrl(formData.photoUrl) ? (
                        <Image
                          src={formData.photoUrl}
                          alt={formData.name || "Preview"}
                          width={128}
                          height={128}
                          className="w-full h-full object-cover"
                          unoptimized
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <svg
                            className="w-16 h-16 text-gray-400"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                            />
                          </svg>
                        </div>
                      )}
                    </div>

                    {/* Nome */}
                    <h3 className="font-semibold text-gray-900 text-center mb-2">
                      {formData.name || "Nome do Autor"}
                    </h3>

                    {/* Biografia (preview) */}
                    {formData.biography && (
                      <p className="text-sm text-gray-600 text-center line-clamp-4">
                        {formData.biography}
                      </p>
                    )}

                    {/* Informações Adicionais */}
                    {formData.biography.trim().length >= 20 && (
                      <div className="mt-4 pt-4 border-t border-gray-200">
                        <p className="text-xs text-gray-500 text-center">
                          ✓ Pronto para cadastro
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
