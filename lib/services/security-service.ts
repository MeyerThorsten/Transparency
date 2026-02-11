import { SecurityPosture } from "@/types";
import securityData from "@/data/mock/security.json";
import { perturbAbsolute } from "@/lib/utils/data-variation";

const data = securityData as Record<string, SecurityPosture>;

export async function getSecurityPosture(customerId: string): Promise<SecurityPosture> {
  const posture = data[customerId] ?? { overallScore: 0, vulnerabilities: [], topCves: [] };
  return {
    ...posture,
    overallScore: perturbAbsolute(posture.overallScore, 1, "secScore", 0, 100),
    vulnerabilities: posture.vulnerabilities.map((v, idx) => ({
      ...v,
      count: perturbAbsolute(v.count, 1, `vulnCount|${idx}`, 0),
    })),
  };
}
