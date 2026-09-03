const OrderStepCard = ({ step }) => {
  const Icon = step.icon;

  return (
    <div className="relative z-10 flex flex-col items-center text-center gap-3">
      <span className="flex items-center justify-center w-12 h-12 md:w-14 md:h-14 rounded-full bg-coffee-800 text-cream-50 shadow-[0_10px_24px_-8px_rgba(42,33,24,0.45)]">
        <Icon size={20} />
      </span>
      <div>
        <p className="font-semibold text-coffee-800">{step.title}</p>
        <p className="text-xs md:text-sm text-coffee-500/80 mt-1 max-w-[11rem] mx-auto">
          {step.description}
        </p>
      </div>
    </div>
  );
};

export default OrderStepCard;
