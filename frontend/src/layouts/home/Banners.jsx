const Banners = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 py-10 grid md:grid-cols-2 gap-6">
      <div className="bg-brand-coral/10 rounded-2xl p-8 flex flex-col justify-center">
        <h3 className="text-xl font-bold text-gray-900 mb-2">
          Track your complaint anytime
        </h3>
        <p className="text-sm text-gray-600 mb-4">
          Get SMS and app updates as your issue moves from reported to resolved.
        </p>
        <button className="self-start bg-brand-coral text-white text-sm font-medium px-5 py-2.5 rounded-full">
          Track Status
        </button>
      </div>

      <div className="bg-brand-green/10 rounded-2xl p-8 flex flex-col justify-center">
        <h3 className="text-xl font-bold text-gray-900 mb-2">
          See how your ward is performing
        </h3>
        <p className="text-sm text-gray-600 mb-4">
          Public dashboards show resolution times across every ward in the city.
        </p>
        <button className="self-start bg-brand-green text-white text-sm font-medium px-5 py-2.5 rounded-full">
          View Dashboard
        </button>
      </div>
    </div>
  );
};

export default Banners; 