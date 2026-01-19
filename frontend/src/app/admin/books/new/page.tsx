"use client";

import { useState, FormEvent, ChangeEvent } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import AdminSidebar from "@/components/layout/AdminSidebar";
import Breadcrumb from "@/components/layout/Breadcrumb";
import CustomSelect from "@/components/ui/CustomSelect";
import MultiSelect from "@/components/ui/MultiSelect";
import { useCreateBook, useAuthors } from "@/hooks";
import { getErrorMessage } from "@/lib/api-client";
import type { CreateBookRequest } from "@/types/book";
import type { Currency, WeightUnit } from "@/types/api";

/**
 * Página de criação de novo livro
 * Formulário completo com validação e preview
 */
export default function NewBookPage() {
  const router = useRouter();
  const createBook = useCreateBook();

  // Buscar autores ativos para o multiselect
  const { data: authorsData } = useAuthors({ status: "ACTIVE", size: 100 });

  // Form state
  const [formData, setFormData] = useState<CreateBookRequest>({
    title: "",
    description: "",
    photoUrl: "",
    isbn: "",
    price: 0,
    currency: "BRL",
    weight: 0,
    weightUnit: "GRAMS",
    stock: 0,
    authorIds: [],
  });

  // Validation errors
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Track touched fields
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
   * Valida formato ISBN (simples)
   */
  const isValidISBN = (isbn: string): boolean => {
    if (!isbn) return true; // ISBN é opcional
    // ISBN-10 ou ISBN-13 (apenas dígitos e hífens)
    const isbnPattern = /^(?:\d{9}[\dX]|\d{13})$/;
    const cleanISBN = isbn.replace(/-/g, "");
    return isbnPattern.test(cleanISBN);
  };

  /**
   * Valida todos os campos do formulário
   */
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    // Título: obrigatório, máx 300 caracteres
    if (!formData.title.trim()) {
      newErrors.title = "Título é obrigatório";
    } else if (formData.title.length > 300) {
      newErrors.title = "Título não pode ter mais de 300 caracteres";
    }

    // Descrição: obrigatória, mín 50 caracteres
    if (!formData.description.trim()) {
      newErrors.description = "Descrição é obrigatória";
    } else if (formData.description.trim().length < 50) {
      newErrors.description = "Descrição deve ter no mínimo 50 caracteres";
    }

    // URL da foto: opcional, mas se preenchida deve ser válida
    if (formData.photoUrl && !isValidUrl(formData.photoUrl)) {
      newErrors.photoUrl = "URL inválida";
    }

    // ISBN: opcional, mas se preenchido deve ser válido
    if (formData.isbn && !isValidISBN(formData.isbn)) {
      newErrors.isbn =
        "ISBN inválido (deve ter 10 ou 13 dígitos, sem hífens ou com)";
    }

    // Preço: obrigatório, > 0
    if (formData.price <= 0) {
      newErrors.price = "Preço deve ser maior que zero";
    }

    // Peso: obrigatório, > 0
    if (formData.weight <= 0) {
      newErrors.weight = "Peso deve ser maior que zero";
    }

    // Estoque: obrigatório, >= 0
    if (formData.stock < 0) {
      newErrors.stock = "Estoque não pode ser negativo";
    }

    // Autores: obrigatório, mínimo 1
    if (formData.authorIds.length === 0) {
      newErrors.authorIds = "Selecione pelo menos um autor";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /**
   * Valida campo específico quando perde o foco
   */
  const validateField = (fieldName: string) => {
    if (!touchedFields[fieldName]) return;

    const newErrors = { ...errors };

    switch (fieldName) {
      case "title":
        if (!formData.title.trim()) {
          newErrors.title = "Título é obrigatório";
        } else if (formData.title.length > 300) {
          newErrors.title = "Título não pode ter mais de 300 caracteres";
        } else {
          delete newErrors.title;
        }
        break;

      case "description":
        if (!formData.description.trim()) {
          newErrors.description = "Descrição é obrigatória";
        } else if (formData.description.trim().length < 50) {
          newErrors.description = "Descrição deve ter no mínimo 50 caracteres";
        } else {
          delete newErrors.description;
        }
        break;

      case "photoUrl":
        if (formData.photoUrl && !isValidUrl(formData.photoUrl)) {
          newErrors.photoUrl = "URL inválida";
        } else {
          delete newErrors.photoUrl;
        }
        break;

      case "isbn":
        if (formData.isbn && !isValidISBN(formData.isbn)) {
          newErrors.isbn = "ISBN inválido";
        } else {
          delete newErrors.isbn;
        }
        break;

      case "price":
        if (formData.price <= 0) {
          newErrors.price = "Preço deve ser maior que zero";
        } else {
          delete newErrors.price;
        }
        break;

      case "weight":
        if (formData.weight <= 0) {
          newErrors.weight = "Peso deve ser maior que zero";
        } else {
          delete newErrors.weight;
        }
        break;

      case "stock":
        if (formData.stock < 0) {
          newErrors.stock = "Estoque não pode ser negativo";
        } else {
          delete newErrors.stock;
        }
        break;

      case "authorIds":
        if (formData.authorIds.length === 0) {
          newErrors.authorIds = "Selecione pelo menos um autor";
        } else {
          delete newErrors.authorIds;
        }
        break;
    }

    setErrors(newErrors);
  };

  /**
   * Atualiza campo do formulário
   */
  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;

    // Converter para número se for campo numérico
    const numericFields = ["price", "weight", "stock"];
    const newValue = numericFields.includes(name) ? Number(value) : value;

    setFormData((prev) => ({ ...prev, [name]: newValue }));

    // Limpa erro do campo ao digitar
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  /**
   * Marca campo como "tocado" quando perde o foco
   */
  const handleBlur = (fieldName: string) => {
    setTouchedFields((prev) => ({ ...prev, [fieldName]: true }));
    validateField(fieldName);
  };

  /**
   * Formata preço para exibição
   */
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: formData.currency || "BRL",
    }).format(price);
  };

  /**
   * Handle submit do formulário
   */
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Marca todos os campos como tocados
    const allFields = Object.keys(formData);
    setTouchedFields(
      allFields.reduce((acc, field) => ({ ...acc, [field]: true }), {})
    );

    // Valida formulário
    if (!validateForm()) {
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    try {
      // Remove campos opcionais vazios
      const payload: CreateBookRequest = {
        ...formData,
        photoUrl: formData.photoUrl || undefined,
        isbn: formData.isbn || undefined,
      };

      await createBook.mutateAsync(payload);

      // Sucesso - redireciona para listagem
      router.push("/admin/books");
    } catch (error) {
      const message = getErrorMessage(error);
      setErrors({ submit: message });
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  // Opções dos autores para o multiselect
  const authorOptions =
    authorsData?.content.map((author) => ({
      value: author.id,
      label: author.name,
    })) || [];

  // Autores selecionados para o preview
  const selectedAuthors =
    authorsData?.content.filter((author) =>
      formData.authorIds.includes(author.id)
    ) || [];

  return (
    <>
      <div className="flex min-h-screen bg-gray-50">
        <AdminSidebar />

        <div className="flex-1 lg:ml-64 min-w-0">
          <div className="p-4 lg:p-8">
            <Breadcrumb
              items={[
                { label: "Dashboard", href: "/admin/dashboard" },
                { label: "Livros", href: "/admin/books" },
                { label: "Novo Livro", href: "/admin/books/new" },
              ]}
            />

            <div className="flex items-center justify-between mb-6">
              <h1 className="text-2xl font-bold text-gray-900">
                Cadastrar Novo Livro
              </h1>
            </div>

            {/* Erro geral de submissão */}
            {errors.submit && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                <p className="text-red-600">{errors.submit}</p>
              </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Formulário */}
              <div className="lg:col-span-2">
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* 1. Informações Básicas */}
                  <div className="bg-white rounded-lg shadow-sm p-6">
                    <h2 className="text-lg font-semibold text-gray-900 mb-4">
                      Informações Básicas
                    </h2>

                    <div className="space-y-4">
                      {/* Título */}
                      <div>
                        <label
                          htmlFor="title"
                          className="block text-sm font-medium text-gray-700 mb-2"
                        >
                          Título <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          id="title"
                          name="title"
                          value={formData.title}
                          onChange={handleChange}
                          onBlur={() => handleBlur("title")}
                          maxLength={300}
                          className={`w-full px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-christian-blue focus:border-transparent ${
                            errors.title ? "border-red-300" : "border-gray-300"
                          }`}
                          placeholder="Digite o título do livro"
                        />
                        <div className="flex justify-between mt-1">
                          {errors.title && (
                            <p className="text-sm text-red-600">
                              {errors.title}
                            </p>
                          )}
                          <p className="text-xs text-gray-500 ml-auto">
                            {formData.title.length}/300
                          </p>
                        </div>
                      </div>

                      {/* Descrição */}
                      <div>
                        <label
                          htmlFor="description"
                          className="block text-sm font-medium text-gray-700 mb-2"
                        >
                          Descrição <span className="text-red-500">*</span>
                        </label>
                        <textarea
                          id="description"
                          name="description"
                          value={formData.description}
                          onChange={handleChange}
                          onBlur={() => handleBlur("description")}
                          rows={6}
                          className={`w-full px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-christian-blue focus:border-transparent ${
                            errors.description
                              ? "border-red-300"
                              : "border-gray-300"
                          }`}
                          placeholder="Descreva o livro, sua sinopse e principais características..."
                        />
                        <div className="flex justify-between mt-1">
                          {errors.description && (
                            <p className="text-sm text-red-600">
                              {errors.description}
                            </p>
                          )}
                          <p className="text-xs text-gray-500 ml-auto">
                            Mínimo 50 caracteres (
                            {formData.description.trim().length} caracteres)
                          </p>
                        </div>
                      </div>

                      {/* URL da Foto */}
                      <div>
                        <label
                          htmlFor="photoUrl"
                          className="block text-sm font-medium text-gray-700 mb-2"
                        >
                          URL da Foto da Capa
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
                          placeholder="https://exemplo.com/capa.jpg"
                        />
                        {errors.photoUrl && (
                          <p className="text-sm text-red-600 mt-1">
                            {errors.photoUrl}
                          </p>
                        )}
                        <p className="text-xs text-gray-500 mt-1">
                          Opcional - URL pública da imagem da capa
                        </p>
                      </div>

                      {/* ISBN */}
                      <div>
                        <label
                          htmlFor="isbn"
                          className="block text-sm font-medium text-gray-700 mb-2"
                        >
                          ISBN
                        </label>
                        <input
                          type="text"
                          id="isbn"
                          name="isbn"
                          value={formData.isbn}
                          onChange={handleChange}
                          onBlur={() => handleBlur("isbn")}
                          className={`w-full px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-christian-blue focus:border-transparent ${
                            errors.isbn ? "border-red-300" : "border-gray-300"
                          }`}
                          placeholder="978-0-123456-78-9"
                        />
                        {errors.isbn && (
                          <p className="text-sm text-red-600 mt-1">
                            {errors.isbn}
                          </p>
                        )}
                        <p className="text-xs text-gray-500 mt-1">
                          Opcional - ISBN-10 ou ISBN-13
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* 2. Preço e Estoque */}
                  <div className="bg-white rounded-lg shadow-sm p-6">
                    <h2 className="text-lg font-semibold text-gray-900 mb-4">
                      Preço e Estoque
                    </h2>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {/* Preço */}
                      <div>
                        <label
                          htmlFor="price"
                          className="block text-sm font-medium text-gray-700 mb-2"
                        >
                          Preço <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="number"
                          id="price"
                          name="price"
                          value={formData.price || ""}
                          onChange={handleChange}
                          onBlur={() => handleBlur("price")}
                          step="0.01"
                          min="0"
                          className={`w-full px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-christian-blue focus:border-transparent ${
                            errors.price ? "border-red-300" : "border-gray-300"
                          }`}
                          placeholder="0.00"
                        />
                        {errors.price && (
                          <p className="text-sm text-red-600 mt-1">
                            {errors.price}
                          </p>
                        )}
                      </div>

                      {/* Moeda */}
                      <CustomSelect
                        label="Moeda"
                        value={formData.currency || "BRL"}
                        onChange={(value) =>
                          setFormData((prev) => ({
                            ...prev,
                            currency: value as Currency,
                          }))
                        }
                        options={[
                          { value: "BRL", label: "BRL - Real" },
                          { value: "USD", label: "USD - Dólar" },
                          { value: "EUR", label: "EUR - Euro" },
                        ]}
                      />

                      {/* Estoque */}
                      <div className="sm:col-span-2">
                        <label
                          htmlFor="stock"
                          className="block text-sm font-medium text-gray-700 mb-2"
                        >
                          Estoque Inicial{" "}
                          <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="number"
                          id="stock"
                          name="stock"
                          value={formData.stock || ""}
                          onChange={handleChange}
                          onBlur={() => handleBlur("stock")}
                          min="0"
                          className={`w-full px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-christian-blue focus:border-transparent ${
                            errors.stock ? "border-red-300" : "border-gray-300"
                          }`}
                          placeholder="0"
                        />
                        {errors.stock && (
                          <p className="text-sm text-red-600 mt-1">
                            {errors.stock}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* 3. Dimensões */}
                  <div className="bg-white rounded-lg shadow-sm p-6">
                    <h2 className="text-lg font-semibold text-gray-900 mb-4">
                      Dimensões
                    </h2>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {/* Peso */}
                      <div>
                        <label
                          htmlFor="weight"
                          className="block text-sm font-medium text-gray-700 mb-2"
                        >
                          Peso <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="number"
                          id="weight"
                          name="weight"
                          value={formData.weight || ""}
                          onChange={handleChange}
                          onBlur={() => handleBlur("weight")}
                          step="0.01"
                          min="0"
                          className={`w-full px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-christian-blue focus:border-transparent ${
                            errors.weight ? "border-red-300" : "border-gray-300"
                          }`}
                          placeholder="0.00"
                        />
                        {errors.weight && (
                          <p className="text-sm text-red-600 mt-1">
                            {errors.weight}
                          </p>
                        )}
                      </div>

                      {/* Unidade de Peso */}
                      <CustomSelect
                        label="Unidade"
                        value={formData.weightUnit || "GRAMS"}
                        onChange={(value) =>
                          setFormData((prev) => ({
                            ...prev,
                            weightUnit: value as WeightUnit,
                          }))
                        }
                        options={[
                          { value: "GRAMS", label: "Gramas (g)" },
                          { value: "KILOGRAMS", label: "Quilogramas (kg)" },
                        ]}
                      />
                    </div>
                  </div>

                  {/* 4. Autores */}
                  <div className="bg-white rounded-lg shadow-sm p-6">
                    <h2 className="text-lg font-semibold text-gray-900 mb-4">
                      Autores
                    </h2>

                    <MultiSelect
                      label="Selecione os autores"
                      value={formData.authorIds}
                      onChange={(value) => {
                        setFormData((prev) => ({ ...prev, authorIds: value }));
                        if (errors.authorIds) {
                          setErrors((prev) => {
                            const newErrors = { ...prev };
                            delete newErrors.authorIds;
                            return newErrors;
                          });
                        }
                      }}
                      options={authorOptions}
                      placeholder="Buscar autores..."
                      error={errors.authorIds}
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      <span className="text-red-500">*</span> Selecione pelo
                      menos um autor
                    </p>
                  </div>

                  {/* Botões de Ação */}
                  <div className="flex gap-4">
                    <button
                      type="submit"
                      disabled={createBook.isPending}
                      className="flex-1 bg-christian-blue hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {createBook.isPending
                        ? "Cadastrando..."
                        : "Cadastrar Livro"}
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

              {/* Preview do Livro */}
              <div className="lg:col-span-1">
                <div className="bg-white rounded-lg shadow-sm p-6 sticky top-4">
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">
                    Preview
                  </h2>

                  <div className="border border-gray-200 rounded-lg p-4">
                    {/* Capa */}
                    <div className="aspect-[3/4] bg-gray-100 rounded-lg overflow-hidden mb-4">
                      {formData.photoUrl && isValidUrl(formData.photoUrl) ? (
                        <Image
                          src={formData.photoUrl}
                          alt={formData.title || "Preview"}
                          width={300}
                          height={400}
                          className="w-full h-full object-cover"
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
                              d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                            />
                          </svg>
                        </div>
                      )}
                    </div>

                    {/* Título */}
                    <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                      {formData.title || "Título do livro"}
                    </h3>

                    {/* Autores */}
                    <p className="text-sm text-gray-600 mb-2">
                      {selectedAuthors.length > 0
                        ? selectedAuthors.map((a) => a.name).join(", ")
                        : "Autores"}
                    </p>

                    {/* Preço */}
                    <p className="text-lg font-bold text-christian-blue mb-2">
                      {formData.price > 0
                        ? formatPrice(formData.price)
                        : "R$ 0,00"}
                    </p>

                    {/* Descrição (preview) */}
                    {formData.description && (
                      <p className="text-sm text-gray-600 line-clamp-3">
                        {formData.description}
                      </p>
                    )}

                    {/* Informações Adicionais */}
                    {(formData.isbn || formData.weight > 0) && (
                      <div className="mt-4 pt-4 border-t border-gray-200 text-xs text-gray-500 space-y-1">
                        {formData.isbn && <p>ISBN: {formData.isbn}</p>}
                        {formData.weight > 0 && (
                          <p>
                            Peso: {formData.weight}
                            {formData.weightUnit === "KILOGRAMS" ? "kg" : "g"}
                          </p>
                        )}
                        {formData.stock >= 0 && (
                          <p>Estoque: {formData.stock} unidades</p>
                        )}
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
