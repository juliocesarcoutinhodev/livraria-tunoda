"use client";

import { useState, useEffect, FormEvent } from "react";
import Modal from "./Modal";
import CustomSelect from "./CustomSelect";
import { useAdjustBookStock } from "@/hooks";
import { getErrorMessage } from "@/lib/api-client";
import type { Book } from "@/types/book";
import type { StockOperation } from "@/types/api";
import toast from "react-hot-toast";

interface StockAdjustmentModalProps {
  book: Book | null;
  isOpen: boolean;
  onClose: () => void;
}

/**
 * Modal para ajustar estoque de um livro
 * Suporta 3 operações: ADD (adicionar), REMOVE (remover), SET (definir)
 */
export default function StockAdjustmentModal({
  book,
  isOpen,
  onClose,
}: StockAdjustmentModalProps) {
  const adjustStock = useAdjustBookStock();

  const [operation, setOperation] = useState<StockOperation>("ADD");
  const [quantity, setQuantity] = useState<string>("");
  const [reason, setReason] = useState("");
  const [error, setError] = useState<string | null>(null);

  // Reseta form quando abre/fecha ou troca de livro
  useEffect(() => {
    if (isOpen) {
      setOperation("ADD");
      setQuantity("");
      setReason("");
      setError(null);
    }
  }, [isOpen, book?.id]);

  /**
   * Calcula novo estoque baseado na operação
   */
  const calculateNewStock = (): number | null => {
    if (!book || !quantity) return null;

    const qty = parseInt(quantity, 10);
    if (isNaN(qty) || qty < 0) return null;

    switch (operation) {
      case "ADD":
        return book.stock + qty;
      case "REMOVE":
        return book.stock - qty;
      case "SET":
        return qty;
      default:
        return null;
    }
  };

  const newStock = calculateNewStock();
  const isValidStock = newStock !== null && newStock >= 0;

  /**
   * Handle submit do formulário
   */
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!book) return;

    const qty = parseInt(quantity, 10);

    // Validações
    if (isNaN(qty) || qty <= 0) {
      setError("Quantidade deve ser maior que zero");
      return;
    }

    if (!isValidStock) {
      setError("Operação resultaria em estoque negativo");
      return;
    }

    setError(null);

    try {
      await adjustStock.mutateAsync({
        id: book.id,
        adjustment: {
          operation,
          quantity: qty,
          reason: reason.trim() || undefined,
        },
      });

      toast.success(
        `Estoque atualizado com sucesso! Novo estoque: ${newStock}`
      );
      onClose();
    } catch (err) {
      const message = getErrorMessage(err);
      setError(message);
      toast.error(message);
    }
  };

  /**
   * Handle cancel
   */
  const handleCancel = () => {
    if (adjustStock.isPending) return;
    onClose();
  };

  if (!book) return null;

  return (
    <Modal isOpen={isOpen} onClose={handleCancel} title="Ajustar Estoque">
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Informações do Livro */}
        <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
          <p className="text-sm font-medium text-gray-700 mb-1">Livro</p>
          <p className="font-semibold text-gray-900 line-clamp-2">
            {book.title}
          </p>
          <p className="text-sm text-gray-600 mt-2">
            Estoque Atual:{" "}
            <span
              className={`font-bold ${
                book.stock < 5 ? "text-red-600" : "text-gray-900"
              }`}
            >
              {book.stock} {book.stock === 1 ? "unidade" : "unidades"}
            </span>
          </p>
        </div>

        {/* Erro Geral */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        {/* Operação */}
        <CustomSelect
          label="Operação"
          value={operation}
          onChange={(value) => setOperation(value as StockOperation)}
          options={[
            { value: "ADD", label: "➕ Adicionar" },
            { value: "REMOVE", label: "➖ Remover" },
            { value: "SET", label: "🔢 Definir" },
          ]}
        />

        {/* Quantidade */}
        <div>
          <label
            htmlFor="quantity"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Quantidade <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            id="quantity"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            min="1"
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-christian-blue focus:border-transparent"
            placeholder="Digite a quantidade"
            required
          />
          {operation === "SET" && (
            <p className="text-xs text-gray-500 mt-1">
              O estoque será definido para este valor
            </p>
          )}
        </div>

        {/* Motivo (Opcional) */}
        <div>
          <label
            htmlFor="reason"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Motivo (opcional)
          </label>
          <textarea
            id="reason"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            rows={3}
            maxLength={200}
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-christian-blue focus:border-transparent resize-none"
            placeholder="Ex: Reposição, Correção de inventário, Devolução..."
          />
          <p className="text-xs text-gray-500 mt-1">{reason.length}/200</p>
        </div>

        {/* Preview do Novo Estoque */}
        {newStock !== null && (
          <div
            className={`border-t pt-4 ${
              isValidStock
                ? "border-gray-200"
                : "border-red-200 bg-red-50 -mx-6 px-6 pb-4"
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700">
                Novo Estoque:
              </span>
              <span
                className={`text-lg font-bold ${
                  isValidStock
                    ? newStock < 5
                      ? "text-orange-600"
                      : "text-green-600"
                    : "text-red-600"
                }`}
              >
                {newStock} {newStock === 1 ? "unidade" : "unidades"}
                {isValidStock ? " ✓" : " ✗"}
              </span>
            </div>
            {!isValidStock && (
              <p className="text-sm text-red-600 mt-2">
                ⚠️ Estoque não pode ser negativo
              </p>
            )}
            {isValidStock && newStock < 5 && (
              <p className="text-sm text-orange-600 mt-2">
                ⚠️ Atenção: Estoque ficará baixo
              </p>
            )}
          </div>
        )}

        {/* Botões de Ação */}
        <div className="flex gap-3 pt-2">
          <button
            type="button"
            onClick={handleCancel}
            disabled={adjustStock.isPending}
            className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={adjustStock.isPending || !isValidStock || !quantity}
            className="flex-1 bg-christian-blue hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {adjustStock.isPending ? "Ajustando..." : "Confirmar Ajuste"}
          </button>
        </div>
      </form>
    </Modal>
  );
}
