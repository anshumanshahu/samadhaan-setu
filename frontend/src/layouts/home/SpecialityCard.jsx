const departments = [
  "Municipal Corporation",
  "Water Department",
  "Electricity Board",
  "Traffic Police",
  "Sanitation Department",
  "Parks & Horticulture",
];

const SpecialityCards = () => {
  return (
    <div className="flex gap-4 overflow-x-auto pb-2 md:grid md:grid-cols-6 md:overflow-visible">
      {departments.map((d) => (
        <div
          key={d}
          className="min-w-[160px] md:min-w-0 bg-brand-green/5 border border-brand-green/10 rounded-2xl p-4 text-center hover:bg-brand-green/10 transition cursor-pointer"
        >
          <p className="text-sm font-medium text-gray-800">{d}</p>
        </div>
      ))}
    </div>
  );
};

export default SpecialityCards;