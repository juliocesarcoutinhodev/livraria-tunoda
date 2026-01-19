"use client";

/**
 * Admin Authors Page
 *
 * Página de listagem e gerenciamento de autores (ADMIN).
 * Inclui: busca, filtro, ordenação, ações inline.
 *
 * @module app/admin/authors
 */

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useAuthors, useUpdateAuthorStatus } from "@/hooks";
import { useAutoLogoutAfterInactivity } from "@/hooks/useInactivityLogout";
import AdminSidebar from "@/components/layout/AdminSidebar";
import Breadcrumb from "@/components/layout/Breadcrumb";
import { AuthorCardSkeleton, TableRowSkeleton } from "@/components/ui";
import type { Author, AuthorFilterParams } from "@/types/author";
import type { ResourceStatus } from "@/types/api";

export default function AuthorsPage() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<ResourceStatus | "ALL">(
    "ALL"
  );
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  // Auto-logout por inatividade
  useAutoLogoutAfterInactivity();

  // Filtros para API
  const apiFilters: AuthorFilterParams = {
    page: 0,
    size: 100, // Busca todos para filtro client-side
    sort: `name,${sortOrder}`,
    ...(statusFilter !== "ALL" && { status: statusFilter }),
  };

  // Query de autores
  const { data, isLoading, error } = useAuthors(apiFilters);
  const updateStatus = useUpdateAuthorStatus();

  // Filtros client-side (busca por nome)
  const filteredAuthors = useMemo(() => {
    if (!data?.content) return [];

    let authors = [...data.content];

    // Busca por nome (client-side)
    if (searchTerm) {
      authors = authors.filter((author) =>
        author.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    return authors;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, searchTerm]);

  const handleToggleStatus = (author: Author) => {
    const newStatus: ResourceStatus =
      author.status === "ACTIVE" ? "INACTIVE" : "ACTIVE";
    updateStatus.mutate({ id: author.id, status: newStatus });
  };

  const handleEdit = (authorId: string) => {
    router.push(`/admin/authors/${authorId}/edit`);
  };

  const handleCreateNew = () => {
    router.push("/admin/authors/new");
  };

  return (
    <div className="flex min-h-screen bg-christian-background">
      {/* Sidebar */}
      <AdminSidebar />

      {/* Main Content */}
      <main className="flex-1 lg:ml-64 p-6 lg:p-8">
        {/* Breadcrumb */}
        <Breadcrumb
          items={[
            { label: "Dashboard", href: "/admin/dashboard" },
            { label: "Autores" },
          ]}
        />

        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-christian-text font-playfair">
                Autores
              </h1>
              <p className="text-christian-text/60 mt-1">
                Gerencie os autores cadastrados na livraria
              </p>
            </div>
            <button
              onClick={handleCreateNew}
              className="inline-flex items-center gap-2 px-4 py-2 bg-christian-blue hover:bg-christian-green text-white rounded-lg font-semibold transition-colors"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4v16m8-8H4"
                />
              </svg>
              Novo Autor
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="mb-6 bg-white rounded-lg shadow-sm p-4 border border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Search */}
            <div>
              <label
                htmlFor="search"
                className="block text-sm font-medium text-christian-text mb-2"
              >
                Buscar por nome
              </label>
              <input
                id="search"
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Digite o nome..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-christian-blue"
              />
            </div>

            {/* Status Filter */}
            <div>
              <label
                htmlFor="status"
                className="block text-sm font-medium text-christian-text mb-2"
              >
                Filtrar por status
              </label>
              <select
                id="status"
                value={statusFilter}
                onChange={(e) =>
                  setStatusFilter(e.target.value as ResourceStatus | "ALL")
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-christian-blue"
              >
                <option value="ALL">Todos</option>
                <option value="ACTIVE">Ativos</option>
                <option value="INACTIVE">Inativos</option>
              </select>
            </div>

            {/* Sort Order */}
            <div>
              <label
                htmlFor="sort"
                className="block text-sm font-medium text-christian-text mb-2"
              >
                Ordenar por nome
              </label>
              <select
                id="sort"
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value as "asc" | "desc")}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-christian-blue"
              >
                <option value="asc">A-Z</option>
                <option value="desc">Z-A</option>
              </select>
            </div>
          </div>
        </div>

        {/* Error State */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <p className="text-red-600">
              Erro ao carregar autores. Tente novamente.
            </p>
          </div>
        )}

        {/* Loading State */}
        {isLoading && (
          <>
            {/* Desktop Table Loading */}
            <div className="hidden md:block bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              <table className="min-w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Autor
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Ações
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <TableRowSkeleton key={i} />
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Cards Loading */}
            <div className="md:hidden space-y-4">
              {[1, 2, 3, 4, 5].map((i) => (
                <AuthorCardSkeleton key={i} />
              ))}
            </div>
          </>
        )}

        {/* Empty State */}
        {!isLoading && !error && filteredAuthors.length === 0 && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
            <div className="inline-block p-4 bg-christian-blue/10 rounded-full mb-4">
              <svg
                className="w-12 h-12 text-christian-blue"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-christian-text mb-2 font-playfair">
              Nenhum autor encontrado
            </h3>
            <p className="text-christian-text/60 mb-6">
              {searchTerm || statusFilter !== "ALL"
                ? "Tente ajustar os filtros de busca"
                : "Comece adicionando o primeiro autor ao catálogo"}
            </p>
            {!searchTerm && statusFilter === "ALL" && (
              <button
                onClick={handleCreateNew}
                className="inline-flex items-center gap-2 px-6 py-3 bg-christian-blue hover:bg-christian-green text-white rounded-lg font-semibold transition-colors"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4v16m8-8H4"
                  />
                </svg>
                Adicionar Primeiro Autor
              </button>
            )}
          </div>
        )}

        {/* Desktop Table */}
        {!isLoading && !error && filteredAuthors.length > 0 && (
          <>
            <div className="hidden md:block bg-white rounded-lg shadow-sm border border-gray-200 overflow-x-auto">
              <table className="w-full table-fixed">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="w-1/2 px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Autor
                    </th>
                    <th className="w-1/6 px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="w-1/3 px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Ações
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredAuthors.map((author) => (
                    <tr
                      key={author.id}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          {author.photoUrl ? (
                            <Image
                              src={author.photoUrl}
                              alt={author.name}
                              width={40}
                              height={40}
                              className="rounded-full object-cover flex-shrink-0"
                            />
                          ) : (
                            <svg
                              className="w-10 h-10 text-gray-400 flex-shrink-0"
                              fill="currentColor"
                              viewBox="0 0 24 24"
                              aria-label="Foto"
                            >
                              <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                            </svg>
                          )}
                          <span className="font-medium text-christian-text">
                            {author.name}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex px-3 py-1.5 text-xs font-bold rounded-full ${
                            author.status === "ACTIVE"
                              ? "bg-green-100 text-green-800"
                              : "bg-gray-200 text-gray-700"
                          }`}
                        >
                          {author.status === "ACTIVE" ? "Ativo" : "Inativo"}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex gap-3">
                          {/* Editar */}
                          <button
                            onClick={() => handleEdit(author.id)}
                            className="p-2 text-blue-600 hover:bg-blue-600 hover:text-white rounded-lg transition-all shadow-sm hover:shadow-md"
                            title="Editar autor"
                          >
                            <svg
                              className="w-5 h-5"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                              />
                            </svg>
                          </button>

                          {/* Ativar/Desativar */}
                          <button
                            onClick={() => handleToggleStatus(author)}
                            disabled={updateStatus.isPending}
                            className={`p-2 rounded-lg transition-all shadow-sm hover:shadow-md disabled:opacity-50 ${
                              author.status === "ACTIVE"
                                ? "text-red-600 hover:bg-red-600 hover:text-white"
                                : "text-green-600 hover:bg-green-600 hover:text-white"
                            }`}
                            title={
                              author.status === "ACTIVE"
                                ? "Desativar autor"
                                : "Ativar autor"
                            }
                          >
                            <svg
                              className="w-5 h-5"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              {author.status === "ACTIVE" ? (
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636"
                                />
                              ) : (
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                                />
                              )}
                            </svg>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Cards */}
            <div className="md:hidden space-y-4">
              {filteredAuthors.map((author) => (
                <div
                  key={author.id}
                  className="bg-white rounded-lg shadow-sm p-4 border border-gray-200"
                >
                  <div className="flex items-start gap-4">
                    {/* Avatar */}
                    {author.photoUrl ? (
                      <Image
                        src={author.photoUrl}
                        alt={author.name}
                        width={56}
                        height={56}
                        className="rounded-full object-cover"
                      />
                    ) : (
                      <svg
                        className="w-14 h-14 text-gray-400"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                      </svg>
                    )}

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-christian-text truncate">
                        {author.name}
                      </h3>
                      <span
                        className={`inline-flex mt-2 px-2 py-0.5 text-xs font-semibold rounded-full ${
                          author.status === "ACTIVE"
                            ? "bg-green-100 text-green-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {author.status === "ACTIVE" ? "Ativo" : "Inativo"}
                      </span>

                      {/* Actions */}
                      <div className="flex gap-3 mt-3">
                        {/* Editar */}
                        <button
                          onClick={() => handleEdit(author.id)}
                          className="flex-1 flex items-center justify-center gap-2 px-3 py-2 text-sm bg-christian-blue hover:bg-christian-green text-white rounded-lg font-medium transition-colors"
                        >
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                            />
                          </svg>
                          Editar
                        </button>

                        {/* Ativar/Desativar */}
                        <button
                          onClick={() => handleToggleStatus(author)}
                          disabled={updateStatus.isPending}
                          className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 text-sm rounded-lg font-medium transition-colors disabled:opacity-50 ${
                            author.status === "ACTIVE"
                              ? "bg-gray-200 hover:bg-gray-300 text-gray-800"
                              : "bg-green-500 hover:bg-green-600 text-white"
                          }`}
                        >
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            {author.status === "ACTIVE" ? (
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636"
                              />
                            ) : (
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                              />
                            )}
                          </svg>
                          {author.status === "ACTIVE" ? "Desativar" : "Ativar"}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Results Count */}
            <div className="mt-4 text-sm text-christian-text/60 text-center">
              Exibindo {filteredAuthors.length}{" "}
              {filteredAuthors.length === 1 ? "autor" : "autores"}
            </div>
          </>
        )}
      </main>
    </div>
  );
}
