/**
 * BookMetricsModal - Modal de métricas do livro
 *
 * Exibe métricas de desempenho de um livro:
 * - Total de visualizações
 * - Total de cliques
 * - Taxa de conversão (CTR)
 *
 * @module components/ui/BookMetricsModal
 */

import { Dialog, Transition } from "@headlessui/react";
import { Fragment } from "react";
import { useBookMetrics } from "@/hooks/useBooks";
import type { Book } from "@/types/book";

interface BookMetricsModalProps {
  /** Livro para exibir métricas */
  book: Book | null;
  /** Se o modal está aberto */
  isOpen: boolean;
  /** Callback ao fechar */
  onClose: () => void;
}

export default function BookMetricsModal({
  book,
  isOpen,
  onClose,
}: BookMetricsModalProps) {
  // Só faz a query se tiver book.id
  const { data: metrics, isLoading } = useBookMetrics(book?.id || "");

  if (!book) return null;

  // Calcula CTR (Click-Through Rate)
  const ctr =
    metrics && metrics.views > 0
      ? ((metrics.clicks / metrics.views) * 100).toFixed(2)
      : "0.00";

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/25 backdrop-blur-sm" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-2xl transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                {/* Header */}
                <div className="flex items-start justify-between mb-6">
                  <div className="flex-1">
                    <Dialog.Title
                      as="h3"
                      className="text-xl font-bold text-gray-900 mb-1"
                    >
                      Métricas do Livro
                    </Dialog.Title>
                    <p className="text-sm text-gray-600 line-clamp-1">
                      {book.title}
                    </p>
                  </div>
                  <button
                    onClick={onClose}
                    className="text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <svg
                      className="w-6 h-6"
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
                  </button>
                </div>

                {/* Content */}
                {isLoading ? (
                  <div className="flex items-center justify-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-christian-blue"></div>
                  </div>
                ) : metrics ? (
                  <div className="space-y-6">
                    {/* Cards de Métricas */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      {/* Visualizações */}
                      <div className="bg-blue-50 rounded-lg p-4 border border-blue-100">
                        <div className="flex items-center gap-3 mb-2">
                          <div className="p-2 bg-blue-100 rounded-lg">
                            <svg
                              className="w-5 h-5 text-blue-600"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
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
                          </div>
                          <div>
                            <p className="text-xs text-blue-600 font-medium">
                              Visualizações
                            </p>
                          </div>
                        </div>
                        <p className="text-2xl font-bold text-blue-900">
                          {metrics.views.toLocaleString("pt-BR")}
                        </p>
                      </div>

                      {/* Cliques */}
                      <div className="bg-green-50 rounded-lg p-4 border border-green-100">
                        <div className="flex items-center gap-3 mb-2">
                          <div className="p-2 bg-green-100 rounded-lg">
                            <svg
                              className="w-5 h-5 text-green-600"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122"
                              />
                            </svg>
                          </div>
                          <div>
                            <p className="text-xs text-green-600 font-medium">
                              Cliques
                            </p>
                          </div>
                        </div>
                        <p className="text-2xl font-bold text-green-900">
                          {metrics.clicks.toLocaleString("pt-BR")}
                        </p>
                      </div>

                      {/* CTR */}
                      <div className="bg-purple-50 rounded-lg p-4 border border-purple-100">
                        <div className="flex items-center gap-3 mb-2">
                          <div className="p-2 bg-purple-100 rounded-lg">
                            <svg
                              className="w-5 h-5 text-purple-600"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                              />
                            </svg>
                          </div>
                          <div>
                            <p className="text-xs text-purple-600 font-medium">
                              Taxa de Conversão
                            </p>
                          </div>
                        </div>
                        <p className="text-2xl font-bold text-purple-900">
                          {ctr}%
                        </p>
                      </div>
                    </div>

                    {/* Informações Adicionais */}
                    <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                      <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                        <svg
                          className="w-5 h-5 text-gray-600"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                        Sobre as Métricas
                      </h4>
                      <div className="space-y-2 text-sm text-gray-600">
                        <p>
                          <strong>Visualizações:</strong> Total de vezes que o
                          livro foi visualizado na página de detalhes.
                        </p>
                        <p>
                          <strong>Cliques:</strong> Total de cliques no botão
                          "Adicionar ao Carrinho".
                        </p>
                        <p>
                          <strong>Taxa de Conversão (CTR):</strong> Percentual
                          de usuários que clicaram após visualizar o livro.
                        </p>
                        {metrics.lastViewedAt && (
                          <p className="pt-2 border-t border-gray-200">
                            <strong>Última visualização:</strong>{" "}
                            {new Date(metrics.lastViewedAt).toLocaleString(
                              "pt-BR"
                            )}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Dica */}
                    {metrics.views === 0 && (
                      <div className="bg-amber-50 rounded-lg p-4 border border-amber-200">
                        <div className="flex items-start gap-3">
                          <svg
                            className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5"
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
                          <div>
                            <p className="text-sm font-medium text-amber-900 mb-1">
                              Livro ainda não foi visualizado
                            </p>
                            <p className="text-xs text-amber-700">
                              Certifique-se de que o livro está ativo e visível
                              no catálogo público para começar a coletar
                              métricas.
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <p className="text-gray-500">
                      Não foi possível carregar as métricas
                    </p>
                  </div>
                )}

                {/* Footer */}
                <div className="mt-6 flex justify-end">
                  <button
                    onClick={onClose}
                    className="px-4 py-2 bg-christian-blue hover:bg-christian-blue/90 text-white rounded-lg font-medium transition-colors"
                  >
                    Fechar
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
