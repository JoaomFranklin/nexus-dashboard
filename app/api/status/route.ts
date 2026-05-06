import { NextResponse } from "next/server";

// ============================================================
// SIMULAÇÃO FICTÍCIA — Todo o conteúdo abaixo é fictício e
// criado para fins de entretenimento. Não representa dados
// reais de nenhuma organização, governo ou agência.
// ============================================================

const MOSSAD_STATUSES = [
  { level: 0, label: "Não listado", color: "green", description: "Sem registros na base de dados" },
  { level: 1, label: "Observado", color: "yellow", description: "Atividade de baixo interesse detectada" },
  { level: 2, label: "Agente potencial", color: "orange", description: "Perfil compatível com recrutamento" },
  { level: 3, label: "Classificado", color: "red", description: "Acesso restrito — nível máximo" },
];

const GOVERNMENT_STATUSES = [
  { status: "operante", label: "O governo está operante", color: "green", icon: "🏛️" },
  { status: "inexistente", label: "O governo não existe mais", color: "red", icon: "💀" },
];

function seededRandom(seed: number, max: number): number {
  // Simple deterministic pseudo-random based on seed
  const x = Math.sin(seed + 1) * 10000;
  return Math.floor((x - Math.floor(x)) * max);
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get("userId") || "anonymous";

  // Use a seed based on userId + current day so status changes daily
  const today = new Date();
  const daySeed = today.getFullYear() * 10000 + (today.getMonth() + 1) * 100 + today.getDate();
  const userSeed = userId.split("").reduce((acc, c) => acc + c.charCodeAt(0), 0);
  const seed = daySeed + userSeed;

  const mossadIndex = seededRandom(seed, MOSSAD_STATUSES.length);
  const govIndex = seededRandom(seed + 1, GOVERNMENT_STATUSES.length);

  return NextResponse.json({
    mossad: MOSSAD_STATUSES[mossadIndex],
    government: GOVERNMENT_STATUSES[govIndex],
    disclaimer: "SIMULAÇÃO — Conteúdo 100% fictício para fins de entretenimento",
    generatedAt: new Date().toISOString(),
  });
}
