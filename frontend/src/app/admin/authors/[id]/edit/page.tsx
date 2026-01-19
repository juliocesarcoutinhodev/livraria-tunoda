"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import AdminSidebar from "@/components/layout/AdminSidebar";
import Breadcrumb from "@/components/layout/Breadcrumb";
import { useAuthorDetail, useUpdateAuthor } from "@/hooks";
import { useAutoLogoutAfterInactivity } from "@/hooks/useInactivityLogout";
import { getErrorMessage, isValidationError } from "@/lib/api-client";
import type { UpdateAuthorRequest } from "@/types/author";
import type { ResourceStatus } from "@/types/api";

interface FormData {
  name: string;
  biography: string;
  photoUrl: string;
  status: ResourceStatus;
}

interface FormErrors {
  name?: string;
  biography?: string;
  photoUrl?: string;
  status?: string;
  general?: string;
}

export default function EditAuthorPage() {
  const router = useRouter();
  const params = useParams();
  const authorId = params?.id as string;

  const { data: author, isLoading: isLoadingAuthor } =
    useAuthorDetail(authorId);
  const updateAuthor = useUpdateAuthor();
  useAutoLogoutAfterInactivity();

  const [formData, setFormData] = useState<FormData>({
    name: "",
    biography: "",
    photoUrl: "",
    status: "ACTIVE",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [touchedFields, setTouchedFields] = useState<Record<string, boolean>>(
    {}
  );

  // Preencher formulário quando autor carregar
  useEffect(() => {
    if (author) {
      setFormData({
        name: author.name,
        biography: author.biography,
        photoUrl: author.photoUrl || "",
        status: author.status,
      });
    }
  }, [author]);

  const validateField = (
    name: keyof FormData,
    value: string
  ): string | undefined => {
    switch (name) {
      case "name":
        if (!value.trim()) return "Nome é obrigatório.";
        if (value.length > 200)
          return "Nome não pode ter mais de 200 caracteres.";
        break;
      case "biography":
        if (!value.trim()) return "Biografia é obrigatória.";
        if (value.length < 20)
          return "Biografia deve ter no mínimo 20 caracteres.";
        break;
      case "photoUrl":
        if (value && !isValidUrl(value)) return "URL da foto inválida.";
        break;
      case "status":
        if (!["ACTIVE", "INACTIVE"].includes(value)) return "Status inválido.";
        break;
      default:
        return undefined;
    }
    return undefined;
  };

  const isValidUrl = (url: string): boolean => {
    try {
      const urlObj = new URL(url);
      return urlObj.protocol === "http:" || urlObj.protocol === "https:";
    } catch {
      return false;
    }
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Clear errors on change
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
    if (errors.general) {
      setErrors((prev) => ({ ...prev, general: undefined }));
    }
  };

  const handleBlur = (fieldName: keyof FormData) => {
    setTouchedFields((prev) => ({ ...prev, [fieldName]: true }));
    const error = validateField(fieldName, formData[fieldName]);
    setErrors((prev) => ({ ...prev, [fieldName]: error }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate all fields
    const newErrors: FormErrors = {};
    (Object.keys(formData) as Array<keyof FormData>).forEach((key) => {
      const error = validateField(key, formData[key]);
      if (error) newErrors[key] = error;
    });

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setTouchedFields(
        Object.keys(formData).reduce(
          (acc, key) => ({ ...acc, [key]: true }),
          {}
        )
      );
      return;
    }

    try {
      const updateData: UpdateAuthorRequest = {
        name: formData.name,
        biography: formData.biography,
        photoUrl: formData.photoUrl || undefined,
        status: formData.status,
      };

      await updateAuthor.mutateAsync({ id: authorId, data: updateData });
      setSuccessMessage("Autor atualizado com sucesso!");
      setErrors({});

      setTimeout(() => {
        setSuccessMessage(null);
        router.push("/admin/authors");
      }, 1500);
    } catch (error: unknown) {
      if (isValidationError(error)) {
        const backendErrors: FormErrors = {};
        const validationError = error as {
          errors?: Array<{ field?: string; message: string }>;
        };
        validationError.errors?.forEach(
          (err: { field?: string; message: string }) => {
            if (err.field) {
              backendErrors[err.field as keyof FormErrors] = err.message;
            } else {
              backendErrors.general = err.message;
            }
          }
        );
        setErrors((prev) => ({ ...prev, ...backendErrors }));
      } else {
        setErrors((prev) => ({
          ...prev,
          general: getErrorMessage(error),
        }));
      }
    }
  };

  if (isLoadingAuthor) {
    return (
      <div className="flex min-h-screen bg-christian-background">
        <AdminSidebar />
        <main className="flex-1 lg:ml-64 p-4 lg:p-6">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-christian-blue"></div>
          </div>
        </main>
      </div>
    );
  }

  if (!author) {
    return (
      <div className="flex min-h-screen bg-christian-background">
        <AdminSidebar />
        <main className="flex-1 lg:ml-64 p-4 lg:p-6">
          <div className="text-center py-12">
            <h1 className="text-2xl font-bold text-red-600">
              Autor não encontrado
            </h1>
            <Link
              href="/admin/authors"
              className="mt-4 inline-block text-christian-blue hover:underline"
            >
              Voltar para listagem
            </Link>
          </div>
        </main>
      </div>
    );
  }

  const nameCharCount = formData.name.length;
  const biographyCharCount = formData.biography.length;

  return (
    <div className="flex min-h-screen bg-christian-background">
      <AdminSidebar />
      <main className="flex-1 lg:ml-64 p-4 lg:p-6 overflow-y-auto">
        <Breadcrumb
          items={[
            { label: "Dashboard", href: "/admin/dashboard" },
            { label: "Autores", href: "/admin/authors" },
            { label: "Editar Autor" },
          ]}
        />

        <div className="mb-6">
          <h1 className="text-2xl font-bold text-christian-text font-playfair mb-1">
            Editar Autor
          </h1>
          <p className="text-christian-text/70 text-sm">
            Atualize os dados do autor no sistema
          </p>
        </div>

        {successMessage && (
          <div
            className="bg-green-50 border-l-4 border-green-500 text-green-700 p-4 mb-6 rounded-lg"
            role="alert"
          >
            <div className="flex items-center">
              <svg
                className="h-6 w-6 mr-3"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <p className="font-semibold">{successMessage}</p>
            </div>
          </div>
        )}

        {errors.general && (
          <div
            className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded-lg"
            role="alert"
          >
            <div className="flex items-center">
              <svg
                className="h-6 w-6 mr-3"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <p className="font-semibold">{errors.general}</p>
            </div>
          </div>
        )}

        {/* Layout: Formulário + Preview */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Formulário (2 colunas) */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-md p-4 lg:p-6">
              <form onSubmit={handleSubmit} className="space-y-4">
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
                      touchedFields.name && errors.name
                        ? "name-error"
                        : "name-help"
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
                      {nameCharCount}/200
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
                        <p
                          id="biography-error"
                          className="text-sm text-red-600"
                        >
                          {errors.biography}
                        </p>
                      ) : (
                        <p
                          id="biography-help"
                          className="text-sm text-gray-500"
                        >
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
                      {biographyCharCount} caracteres
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
                    <span className="text-gray-500 font-normal">
                      (opcional)
                    </span>
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
                        Cole o link de uma imagem hospedada (formato:
                        https://...)
                      </p>
                    )}
                  </div>
                </div>

                {/* Status */}
                <div>
                  <label
                    htmlFor="status"
                    className="block text-sm font-semibold text-christian-text mb-1.5"
                  >
                    Status <span className="text-red-500">*</span>
                  </label>
                  <select
                    id="status"
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    onBlur={() => handleBlur("status")}
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 transition-colors ${
                      touchedFields.status && errors.status
                        ? "border-red-500 focus:ring-red-500"
                        : "border-gray-300 focus:ring-christian-blue"
                    }`}
                    aria-required="true"
                    aria-invalid={touchedFields.status && !!errors.status}
                  >
                    <option value="ACTIVE">Ativo</option>
                    <option value="INACTIVE">Inativo</option>
                  </select>
                  {touchedFields.status && errors.status && (
                    <p className="text-sm text-red-600 mt-1">{errors.status}</p>
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
                    disabled={updateAuthor.isPending}
                    className="sm:flex-none px-8 py-2.5 bg-christian-blue hover:bg-christian-blue/90 text-white font-semibold rounded-lg transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-sm"
                  >
                    {updateAuthor.isPending ? (
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
                        Salvando...
                      </>
                    ) : (
                      "Salvar Alterações"
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* Preview do Autor (1 coluna) */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-md p-6 sticky top-4">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Preview
              </h2>

              <div className="flex flex-col items-center text-center">
                {/* Avatar */}
                <div className="w-32 h-32 rounded-full overflow-hidden bg-gray-100 mb-4 flex items-center justify-center">
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
                  )}
                </div>

                {/* Nome */}
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  {formData.name || "Nome do Autor"}
                </h3>

                {/* Status */}
                <span
                  className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium mb-4 ${
                    formData.status === "ACTIVE"
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {formData.status === "ACTIVE" ? "Ativo" : "Inativo"}
                </span>

                {/* Biografia */}
                {formData.biography && (
                  <div className="w-full">
                    <p className="text-sm text-gray-600 text-left line-clamp-4">
                      {formData.biography}
                    </p>
                    <p className="text-xs text-gray-500 mt-2">
                      {formData.biography.trim().length >= 20 ? (
                        <span className="text-green-600">
                          ✓ Pronto para salvar
                        </span>
                      ) : (
                        <span className="text-amber-600">
                          Biografia muito curta (mínimo 20 caracteres)
                        </span>
                      )}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
