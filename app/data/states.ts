const regions = [
  {
    region: 1,
    state: "Connecticut",
  },
  {
    region: 1,
    state: "Maine",
  },
  {
    region: 1,
    state: "Massachusetts",
  },
  {
    region: 1,
    state: "New Hampshire",
  },
  {
    region: 1,
    state: "Rhode Island",
  },
  {
    region: 2,
    state: "DC",
  },
  {
    region: 2,
    state: "Delaware",
  },
  {
    region: 2,
    state: "Maryland",
  },
  {
    region: 2,
    state: "New Jersey",
  },
  {
    region: 2,
    state: "Pennsylvania",
  },
  {
    region: 2,
    state: "West Virginia",
  },
  {
    region: 3,
    state: "Alabama",
  },
  {
    region: 3,
    state: "Arkansas",
  },
  {
    region: 3,
    state: "Florida",
  },
  {
    region: 3,
    state: "Georgia",
  },
  {
    region: 3,
    state: "Louisiana",
  },
  {
    region: 3,
    state: "Mississippi",
  },
  {
    region: 3,
    state: "Puerto Rico",
  },
  {
    region: 4,
    state: "Oklahoma",
  },
  {
    region: 4,
    state: "Texas",
  },
  {
    region: 5,
    state: "Arizona",
  },
  {
    region: 5,
    state: "California",
  },
  {
    region: 5,
    state: "Nevada",
  },
  {
    region: 5,
    state: "New Mexico",
  },
  {
    region: 5,
    state: "Utah",
  },
  {
    region: 6,
    state: "Alaska",
  },
  {
    region: 6,
    state: "Hawaii",
  },
  {
    region: 6,
    state: "Idaho",
  },
  {
    region: 6,
    state: "Montana",
  },
  {
    region: 6,
    state: "Oregon",
  },
  {
    region: 6,
    state: "Washington",
  },
  {
    region: 7,
    state: "Illinois",
  },
  {
    region: 7,
    state: "Minnesota",
  },
  {
    region: 7,
    state: "North Dakota",
  },
  {
    region: 7,
    state: "South Dakota",
  },
  {
    region: 7,
    state: "Wisconsin",
  },
  {
    region: 8,
    state: "Colorado",
  },
  {
    region: 8,
    state: "Iowa",
  },
  {
    region: 8,
    state: "Kansas",
  },
  {
    region: 8,
    state: "Missouri",
  },
  {
    region: 8,
    state: "Nebraska",
  },
  {
    region: 8,
    state: "Wyoming",
  },
  {
    region: 9,
    state: "New York",
  },
  {
    region: 9,
    state: "Vermont",
  },
  {
    region: 10,
    state: "Indiana",
  },
  {
    region: 10,
    state: "Michigan",
  },
  {
    region: 10,
    state: "Ohio",
  },
  {
    region: 11,
    state: "Kentucky",
  },
  {
    region: 11,
    state: "North Carolina",
  },
  {
    region: 11,
    state: "South Carolina",
  },
  {
    region: 11,
    state: "Tennessee",
  },
  {
    region: 11,
    state: "Virginia",
  },
];

export const regionStates = (region: number) => {
  return regions.filter((r) => r.region === region).map((s) => s.state);
};
