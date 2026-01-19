/**
 * Skeleton - Componente de loading skeleton
 *
 * Exibe placeholders animados durante carregamento de conteúdo.
 *
 * @module components/ui/Skeleton
 */

export interface SkeletonProps {
  /** Largura (CSS value) */
  width?: string | number;
  /** Altura (CSS value) */
  height?: string | number;
  /** Formato (círculo ou retângulo) */
  variant?: "rectangular" | "circular";
  /** Classes CSS adicionais */
  className?: string;
}

/**
 * Componente Skeleton
 *
 * @example
 * ```tsx
 * // Skeleton retangular
 * <Skeleton width="100%" height={200} />
 *
 * // Skeleton circular (avatar)
 * <Skeleton variant="circular" width={40} height={40} />
 * ```
 */
export default function Skeleton({
  width = "100%",
  height = 20,
  variant = "rectangular",
  className = "",
}: SkeletonProps) {
  const baseClasses = "animate-pulse bg-gray-200";
  const variantClass = variant === "circular" ? "rounded-full" : "rounded";

  const style = {
    width: typeof width === "number" ? `${width}px` : width,
    height: typeof height === "number" ? `${height}px` : height,
  };

  return (
    <div
      className={`${baseClasses} ${variantClass} ${className}`}
      style={style}
    />
  );
}

/**
 * Skeleton para Card de Autor (mobile)
 */
export function AuthorCardSkeleton() {
  return (
    <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
      <div className="flex items-center gap-4">
        {/* Avatar */}
        <Skeleton variant="circular" width={64} height={64} />

        {/* Info */}
        <div className="flex-1 space-y-2">
          <Skeleton width="60%" height={20} />
          <Skeleton width="40%" height={16} />
        </div>

        {/* Actions */}
        <div className="space-y-2">
          <Skeleton width={32} height={32} />
          <Skeleton width={32} height={32} />
        </div>
      </div>
    </div>
  );
}

/**
 * Skeleton para Linha de Tabela (desktop)
 */
export function TableRowSkeleton() {
  return (
    <tr className="border-b border-gray-200">
      <td className="px-6 py-4">
        <div className="flex items-center gap-3">
          <Skeleton variant="circular" width={40} height={40} />
          <Skeleton width={120} height={16} />
        </div>
      </td>
      <td className="px-6 py-4">
        <Skeleton width={80} height={24} />
      </td>
      <td className="px-6 py-4">
        <div className="flex gap-2">
          <Skeleton width={70} height={32} />
          <Skeleton width={70} height={32} />
        </div>
      </td>
    </tr>
  );
}
