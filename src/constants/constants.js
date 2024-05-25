const violations = [
  {
    id: 1,
    violation: "Illegal use / over-occupancy of dwelling units",
    dotColor: "#177AD5",
  },
  {
    id: 2,
    violation:
      "Illegal construction (no permit or structure does not meet minimum regulations)",
    dotColor: "#79D2DE",
  },
  {
    id: 3,
    violation:
      "Illegal signs (no permit or sign is not located in the proper location)",
    dotColor: "#ED6665",
  },
  {
    id: 4,
    violation: "Maintaining visible structure addresses",
    dotColor: "#FFC107",
  },
  {
    id: 5,
    violation:
      "Relaying all other concerns to the property authority (such as  interior/exterior housing maintenance and sanitation issues to the Wood  County Health Department, heavy items left in the right-of-way to Public  Works, etc.)",
    dotColor: "#4CAF50",
  },
  { id: 6, violation: "others", dotColor: "#FF5722" },
];

const statuses = [
  {
    id: 1,
    status: "Resolve",
  },
  {
    id: 2,
    status: "Pending",
  },
  {
    id: 3,
    status: "Not Resolve",
  },
];
export default {
  violations,
  statuses,
};
