// Property Types
export const PROPERTY_TYPES = [
  "Apartment",
  "Villa",
  "Townhouse",
  "Penthouse",
  "Duplex",
  "Office",
  "Shop",
  "Warehouse",
  "Land",
];

// Price Ranges (AED)
export const PRICE_RANGES = [
  { label: "Any", value: "any" },
  { label: "0 - 500,000", min: 0, max: 500000 },
  { label: "500,000 - 1,000,000", min: 500000, max: 1000000 },
  { label: "1,000,000 - 2,000,000", min: 1000000, max: 2000000 },
  { label: "2,000,000 - 5,000,000", min: 2000000, max: 5000000 },
  { label: "5,000,000+", min: 5000000, max: null },
];

// Bedroom Options
export const BEDROOM_OPTIONS = [
  { label: "Any", value: "any" },
  { label: "Studio", value: "0" },
  { label: "1+", value: "1" },
  { label: "2+", value: "2" },
  { label: "3+", value: "3" },
  { label: "4+", value: "4" },
  { label: "5+", value: "5" },
];

// Property Purposes
export const PROPERTY_PURPOSES = [
  { label: "Buy", value: "buy" },
  { label: "Rent", value: "rent" },
  { label: "Commercial", value: "commercial" },
  { label: "New Projects", value: "new-projects" },
];

// Format price with commas and currency symbol
export const formatPrice = (price: number): string => {
  return `AED ${price.toLocaleString()}`;
};

// Format area
export const formatArea = (area: number): string => {
  return `${area.toLocaleString()} sq ft`;
};
