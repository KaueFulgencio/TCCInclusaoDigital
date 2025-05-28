export interface Banco {
  codigo: string;
  nome: string;
}

export const bancos: Banco[] = [
  { codigo: "001", nome: "Banco do Brasil" },
  { codigo: "033", nome: "Santander" },
  { codigo: "104", nome: "Caixa Econômica Federal" },
  { codigo: "237", nome: "Bradesco" },
  { codigo: "341", nome: "Itaú" },
  { codigo: "260", nome: "Nu Pagamentos S.A." },
  { codigo: "290", nome: "PagSeguro Internet S.A." },
  { codigo: "318", nome: "Banco BMG" },
  { codigo: "745", nome: "Citibank" },
  { codigo: "756", nome: "Bancoob - Banco Cooperativo do Brasil" },
];
