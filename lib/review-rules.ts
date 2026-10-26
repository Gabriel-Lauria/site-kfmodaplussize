// Regras da avaliação, sem dependências: usadas no navegador (resposta imediata, sem carregar o Zod
// no site público) e pelo reviewSchema do Zod no servidor, que é a validação de verdade.
export const REVIEW = { name: [2, 60], city: 60, comment: [10, 800] } as const;

export const REVIEW_MESSAGES = {
  name: "Conte seu nome",
  rating: "Escolha de 1 a 5 estrelas",
  comment: `Escreva pelo menos ${REVIEW.comment[0]} caracteres`,
  commentMax: `Comentário: até ${REVIEW.comment[1]} caracteres`,
  cityMax: `Cidade: até ${REVIEW.city} caracteres`,
};

export function checkReview(data: Record<string, unknown>) {
  const errors: Record<string, string> = {};
  const name = String(data.name ?? "").trim();
  const city = String(data.city ?? "").trim();
  const comment = String(data.comment ?? "").trim();
  const rating = Number(data.rating);
  if (name.length < REVIEW.name[0] || name.length > REVIEW.name[1]) errors.name = REVIEW_MESSAGES.name;
  if (city.length > REVIEW.city) errors.city = REVIEW_MESSAGES.cityMax;
  if (!Number.isInteger(rating) || rating < 1 || rating > 5) errors.rating = REVIEW_MESSAGES.rating;
  if (comment.length < REVIEW.comment[0]) errors.comment = REVIEW_MESSAGES.comment;
  else if (comment.length > REVIEW.comment[1]) errors.comment = REVIEW_MESSAGES.commentMax;
  return errors;
}
