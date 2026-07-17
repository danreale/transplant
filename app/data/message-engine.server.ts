export type MessageTone = "positive" | "negative" | "neutral";
export type Message = { text: string; tone: MessageTone };

export type BLOOD_TYPE_OBJ = {
  blood_type: string;
  today: number;
  yesterday: number;
  change: number;
};

export type WAIT_LIST_OBJ = {
  type: string;
  blood_types: BLOOD_TYPE_OBJ[];
};

const STATUS_ORDER = [
  "Heart Status 1A",
  "Heart Status 1B",
  "Heart Status 2",
  "Heart Status 7 (Inactive)",
];

const STATUS_LABELS: Record<string, string> = {
  "Heart Status 1A": "Status 1A",
  "Heart Status 1B": "Status 1B",
  "Heart Status 2": "Status 2",
  "Heart Status 7 (Inactive)": "Status 7 (Inactive)",
};

const BLOOD_TYPE_LABELS: Record<string, string> = {
  a: "A",
  b: "B",
  o: "O",
  ab: "AB",
};

const BLOOD_TYPES = ["a", "b", "o", "ab"];

type StatusDelta = { status: string; change: number };

type MatchResult = {
  transitions: { from: string; to: string; count: number }[];
  leftoverDecrease: number;
  leftoverIncrease: number;
};

const statusOrderIndex = (status: string) => STATUS_ORDER.indexOf(status);

// Greedily pairs the largest remaining decrease with the largest remaining
// increase for a single blood type's status deltas, so a 1A drop + 1B rise
// reads as one transition instead of two independent, unreconciled guesses.
export function matchTransitions(deltas: StatusDelta[]): MatchResult {
  let decreases = deltas
    .filter((d) => d.change < 0)
    .map((d) => ({ status: d.status, magnitude: -d.change }));
  let increases = deltas
    .filter((d) => d.change > 0)
    .map((d) => ({ status: d.status, magnitude: d.change }));

  const byMagnitudeThenOrder = (
    a: { status: string; magnitude: number },
    b: { status: string; magnitude: number }
  ) =>
    b.magnitude - a.magnitude || statusOrderIndex(a.status) - statusOrderIndex(b.status);

  const transitions: { from: string; to: string; count: number }[] = [];

  while (decreases.length > 0 && increases.length > 0) {
    decreases.sort(byMagnitudeThenOrder);
    increases.sort(byMagnitudeThenOrder);
    const dec = decreases[0];
    const inc = increases[0];
    const matched = Math.min(dec.magnitude, inc.magnitude);
    transitions.push({ from: dec.status, to: inc.status, count: matched });
    dec.magnitude -= matched;
    inc.magnitude -= matched;
    decreases = decreases.filter((d) => d.magnitude > 0);
    increases = increases.filter((i) => i.magnitude > 0);
  }

  const leftoverDecrease = decreases.reduce((sum, d) => sum + d.magnitude, 0);
  const leftoverIncrease = increases.reduce((sum, i) => sum + i.magnitude, 0);

  return { transitions, leftoverDecrease, leftoverIncrease };
}

export function buildMessagesForBloodType(
  bloodType: string,
  result: MatchResult
): Message[] {
  const messages: Message[] = [];
  const btLabel = BLOOD_TYPE_LABELS[bloodType] ?? bloodType.toUpperCase();

  for (const t of result.transitions) {
    const patientWord = t.count === 1 ? "patient" : "patients";
    messages.push({
      text: `${btLabel} blood type: ${t.count} ${patientWord} likely moved from ${STATUS_LABELS[t.from]} to ${STATUS_LABELS[t.to]}`,
      tone: "neutral",
    });
  }

  if (result.leftoverDecrease > 0) {
    const patientWord = result.leftoverDecrease === 1 ? "patient" : "patients";
    const verb = result.leftoverDecrease === 1 ? "was" : "were";
    messages.push({
      text: `${btLabel} blood type: ${result.leftoverDecrease} ${patientWord} likely received a transplant, ${verb} discharged, or passed away`,
      tone: "neutral",
    });
  }

  if (result.leftoverIncrease > 0) {
    const patientWord = result.leftoverIncrease === 1 ? "patient" : "patients";
    const verb = result.leftoverIncrease === 1 ? "was" : "were";
    messages.push({
      text: `${btLabel} blood type: ${result.leftoverIncrease} new ${patientWord} ${verb} added to the waiting list`,
      tone: "negative",
    });
  }

  return messages;
}

export function generateRegionMessages(waitListTypes: WAIT_LIST_OBJ[]): Message[] {
  const messages: Message[] = [];

  for (const bloodType of BLOOD_TYPES) {
    const deltas: StatusDelta[] = STATUS_ORDER.map((status) => {
      const wlt = waitListTypes.find((w) => w.type === status);
      const change =
        wlt?.blood_types.find((b) => b.blood_type === bloodType)?.change ?? 0;
      return { status, change };
    });
    const result = matchTransitions(deltas);
    messages.push(...buildMessagesForBloodType(bloodType, result));
  }

  return messages;
}
