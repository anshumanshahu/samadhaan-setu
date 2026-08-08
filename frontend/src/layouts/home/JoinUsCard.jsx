const JoinUsCard = () => {
  return (
    <div className="bg-white border border-gray-100 rounded-2xl p-8 md:p-10 flex flex-col md:flex-row items-center justify-between gap-6">
      <div>
        <h3 className="text-xl font-bold text-gray-900 mb-2">
          Are you a ward officer or municipal staff?
        </h3>
        <p className="text-sm text-gray-500 max-w-md">
          Get access to the officer dashboard to receive, assign, and resolve
          complaints from your ward.
        </p>
      </div>
      <button className="bg-brand-green text-white font-medium px-6 py-3 rounded-full whitespace-nowrap">
        Register as Official
      </button>
    </div>
  );
};

export default JoinUsCard;