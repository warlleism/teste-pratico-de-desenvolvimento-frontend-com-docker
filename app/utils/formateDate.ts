export default function formatDate(dateString: string) {
  if (!dateString) {
    return "pendente";
  }

  const months = [
    "Janeiro",
    "Fevereiro",
    "Março",
    "Abril",
    "Maio",
    "Junho",
    "Julho",
    "Agosto",
    "Setembro",
    "Outubro",
    "Novembro",
    "Dezembro",
  ];

  const date = new Date(dateString);

  const day = date.getUTCDate();
  const month = date.getUTCMonth();
  const year = date.getUTCFullYear();

  const formattedDate = `${day} de ${months[month]} de ${year}`;

  return formattedDate;
}
