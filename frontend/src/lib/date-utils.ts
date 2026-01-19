/**
 * Utilitários para formatação de datas
 */

/**
 * Formata data do backend para padrão brasileiro (dd/MM/yyyy)
 * @param dateString - Data no formato ISO ou do backend (YYYY-MM-DD HH:mm:ss.SSSSSS)
 * @returns Data formatada como dd/MM/yyyy
 */
export function formatDate(dateString: string | null | undefined): string {
  if (!dateString) return "-";

  try {
    // Parse da data (funciona com ISO e formato do backend)
    const date = new Date(dateString.replace(" ", "T"));

    // Verifica se é uma data válida
    if (isNaN(date.getTime())) return "-";

    // Formata para dd/MM/yyyy
    return new Intl.DateTimeFormat("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    }).format(date);
  } catch {
    return "-";
  }
}

/**
 * Formata data e hora do backend para padrão brasileiro (dd/MM/yyyy HH:mm)
 * @param dateString - Data no formato ISO ou do backend
 * @returns Data e hora formatadas como dd/MM/yyyy HH:mm
 */
export function formatDateTime(
  dateString: string | null | undefined
): string {
  if (!dateString) return "-";

  try {
    const date = new Date(dateString.replace(" ", "T"));

    if (isNaN(date.getTime())) return "-";

    return new Intl.DateTimeFormat("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  } catch {
    return "-";
  }
}

/**
 * Formata data e hora completa do backend (dd/MM/yyyy HH:mm:ss)
 * @param dateString - Data no formato ISO ou do backend
 * @returns Data e hora formatadas como dd/MM/yyyy HH:mm:ss
 */
export function formatDateTimeFull(
  dateString: string | null | undefined
): string {
  if (!dateString) return "-";

  try {
    const date = new Date(dateString.replace(" ", "T"));

    if (isNaN(date.getTime())) return "-";

    return new Intl.DateTimeFormat("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    }).format(date);
  } catch {
    return "-";
  }
}

/**
 * Formata data relativa (há X dias, há X horas, etc)
 * @param dateString - Data no formato ISO ou do backend
 * @returns Texto relativo (ex: "há 2 dias", "há 3 horas")
 */
export function formatRelativeDate(
  dateString: string | null | undefined
): string {
  if (!dateString) return "-";

  try {
    const date = new Date(dateString.replace(" ", "T"));
    if (isNaN(date.getTime())) return "-";

    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffSec = Math.floor(diffMs / 1000);
    const diffMin = Math.floor(diffSec / 60);
    const diffHour = Math.floor(diffMin / 60);
    const diffDay = Math.floor(diffHour / 24);
    const diffMonth = Math.floor(diffDay / 30);
    const diffYear = Math.floor(diffDay / 365);

    if (diffYear > 0) return `há ${diffYear} ano${diffYear > 1 ? "s" : ""}`;
    if (diffMonth > 0) return `há ${diffMonth} ${diffMonth > 1 ? "meses" : "mês"}`;
    if (diffDay > 0) return `há ${diffDay} dia${diffDay > 1 ? "s" : ""}`;
    if (diffHour > 0) return `há ${diffHour} hora${diffHour > 1 ? "s" : ""}`;
    if (diffMin > 0) return `há ${diffMin} minuto${diffMin > 1 ? "s" : ""}`;
    return "agora mesmo";
  } catch {
    return "-";
  }
}
