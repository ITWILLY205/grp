export interface Term {
  id: string;
  name: string;
  status: "active" | "finished" | "upcoming";
  marksEntryAllowed: boolean;
}

const terms: Term[] = [
  {
    id: "1",
    name: "Term 1 2024",
    status: "finished",
    marksEntryAllowed: true, // User wanted Term 1 to still be editable
  },
  {
    id: "2",
    name: "Term 2 2024",
    status: "active",
    marksEntryAllowed: true,
  },
  {
    id: "3",
    name: "Term 3 2024",
    status: "upcoming",
    marksEntryAllowed: false,
  },
];

export function getActiveTerm(): Term {
  return terms.find((t) => t.status === "active") || terms[0];
}

export function getAllTerms(): Term[] {
  return terms;
}

export function getTermById(id: string): Term | undefined {
  return terms.find((t) => t.id === id);
}
