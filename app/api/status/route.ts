import { NextResponse } from "next/server";

// Conteúdo fictício para fins de entretenimento — não representa dados reais

const MOSSAD_STATUSES = [
  {
    level: 0,
    label: "Não Identificado",
    color: "gray",
    description: "Sem registros ativos. Perfil ainda não catalogado nas bases operacionais.",
    threat: "NULA",
  },
  {
    level: 1,
    label: "Monitorado",
    color: "yellow",
    description: "Atividade suspeita registrada. Comunicações sob interceptação passiva.",
    threat: "BAIXA",
  },
  {
    level: 2,
    label: "Alvo de Alto Risco",
    color: "orange",
    description: "Associações confirmadas com elementos hostis. Localização rastreada ativamente.",
    threat: "ELEVADA",
  },
  {
    level: 3,
    label: "INIMIGO DECLARADO",
    color: "red",
    description: "Ameaça confirmada ao Estado. Autorização de neutralização em análise. Não aproximar sem protocolo.",
    threat: "CRÍTICA",
  },
];

const GOVERNMENT_STATUSES = [
  { status: "operante", label: "O governo está operante", color: "green", icon: "🏛️" },
  { status: "inexistente", label: "O governo não existe mais", color: "red", icon: "💀" },
];

function seededRandom(seed: number, max: number): number {
  const x = Math.sin(seed + 1) * 10000;
  return Math.floor((x - Math.floor(x)) * max);
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get("userId") || "anonymous";

  const today = new Date();
  const daySeed =
    today.getFullYear() * 10000 +
    (today.getMonth() + 1) * 100 +
    today.getDate();
  const userSeed = userId
    .split("")
    .reduce((acc, c) => acc + c.charCodeAt(0), 0);
  const seed = daySeed + userSeed;

  const mossadIndex = seededRandom(seed, MOSSAD_STATUSES.length);

  // Governo: 90% operante, 10% inexistente
  const govRoll = seededRandom(seed + 99, 10);
  const govIndex = govRoll === 0 ? 1 : 0;

  return NextResponse.json({
    mossad: MOSSAD_STATUSES[mossadIndex],
    government: GOVERNMENT_STATUSES[govIndex],
    generatedAt: new Date().toISOString(),
  });
}
