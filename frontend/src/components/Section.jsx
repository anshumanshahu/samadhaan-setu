const Section = ({ component, tag, icon, title, subtitle }) => {
  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 py-10 md:py-14">
      <div className="flex flex-col items-center text-center mb-8 md:mb-10">
        <span className="flex items-center gap-2 text-sm font-medium text-brand-green bg-brand-green/10 px-4 py-1.5 rounded-full mb-4">
          {icon}
          {tag}
        </span>
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
          {title}
        </h2>
        {subtitle && (
          <p className="text-gray-500 max-w-xl">{subtitle}</p>
        )}
      </div>
      {component}
    </div>
  );
};

export default Section;