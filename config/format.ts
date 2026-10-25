// Pequenos ajudantes de texto usados pela config e pelos componentes.

export function plural(n: number, one: string, many: string) {
  return n === 1 ? one : many;
}

const EXTENSO = ["zero", "uma", "duas", "três", "quatro", "cinco", "seis", "sete", "oito", "nove", "dez", "onze", "doze"];

// "Dez lojas", "Uma loja"... (feminino, até 12; acima disso usa o número)
export function countWords(n: number, one: string, many: string) {
  const word = EXTENSO[n] ?? String(n);
  return `${word.charAt(0).toUpperCase()}${word.slice(1)} ${plural(n, one, many)}`;
}

// "5541996817936" -> "+55 41 99681-7936"
export function formatPhone(digits: string) {
  const m = digits.match(/^(\d{2})(\d{2})(\d+)(\d{4})$/);
  return m ? `+${m[1]} ${m[2]} ${m[3]}-${m[4]}` : `+${digits}`;
}
