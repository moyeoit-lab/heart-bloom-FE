type IconProps = {
  className?: string;
};

const Icon = ({
  className,
  children,
}: IconProps & { children: React.ReactNode }) => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden
    className={className}
  >
    {children}
  </svg>
);

const AddSquareIcon = ({ className }: IconProps) => (
  <Icon className={className}>
    <path
      d="M12 7.22461V16.7756"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M7.22461 12H16.7756"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M17.5717 1.65234H6.42883C3.7914 1.65234 1.65332 3.79042 1.65332 6.42785V17.5707C1.65332 20.2082 3.7914 22.3462 6.42883 22.3462H17.5717C20.2092 22.3462 22.3472 20.2082 22.3472 17.5707V6.42785C22.3472 3.79042 20.2092 1.65234 17.5717 1.65234Z"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Icon>
);

const HeartSquareIcon = ({ className }: IconProps) => (
  <Icon className={className}>
    <path
      d="M17.5717 1.65234H6.42883C3.7914 1.65234 1.65332 3.79042 1.65332 6.42785V17.5707C1.65332 20.2082 3.7914 22.3462 6.42883 22.3462H17.5717C20.2092 22.3462 22.3472 20.2082 22.3472 17.5707V6.42785C22.3472 3.79042 20.2092 1.65234 17.5717 1.65234Z"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M9.44923 6.92986C10.2897 6.99076 11.1654 7.40046 12.0038 8.22963C12.8419 7.40069 13.7168 6.99177 14.5565 6.93223C15.5042 6.86502 16.3419 7.24803 16.9481 7.85233C18.1398 9.04045 18.514 11.1903 17.0353 12.6691C17.0303 12.6741 17.0252 12.679 17.0199 12.6837L12.2915 16.9668C12.1282 17.1147 11.8793 17.1147 11.716 16.9668L6.98754 12.6837C6.98232 12.679 6.97721 12.6741 6.97222 12.6691C5.48574 11.1826 5.85797 9.03249 7.0536 7.8453C7.66122 7.24195 8.50069 6.86113 9.44923 6.92986Z"
      fill="currentColor"
    />
  </Icon>
);

const DashedIcon = ({ className }: IconProps) => (
  <Icon className={className}>
    <path
      d="M5.16324 22.1765C3.59536 21.7467 2.34963 20.538 1.86816 18.9922"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M18.8369 22.1765C20.4049 21.7467 21.6505 20.538 22.132 18.9922"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M10.4082 22.3462H13.5919M13.5919 1.65234H10.4082"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M1.65332 10.4082L1.65332 13.5919"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M22.3477 10.4082V13.5919"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M5.16324 1.82227C3.59536 2.25193 2.34963 3.46071 1.86816 5.00648"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M18.8369 1.82227C20.4049 2.25193 21.6505 3.46071 22.132 5.00648"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M11.7754 7V16.551"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M7 11.7754H16.551"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Icon>
);

const TOTAL_STEPS = 5;
const OPTIONAL_STEP = 5;
const INACTIVE_COLOR = "var(--color-gray-200)";

type QuestionStepperProps = {
  currentStep: number;
  accentColor: string;
};

export default function QuestionStepper({
  currentStep,
  accentColor,
}: QuestionStepperProps) {
  return (
    <div className="flex items-center justify-center gap-3 px-5 pb-3">
      {Array.from({ length: TOTAL_STEPS }, (_, i) => {
        const step = i + 1;
        const isOptional = step === OPTIONAL_STEP;
        const isCompleted = step < currentStep;
        const isActive = step === currentStep;
        const isHighlighted = isCompleted || isActive;
        const color = isHighlighted ? accentColor : INACTIVE_COLOR;

        const IconComponent = isOptional
          ? DashedIcon
          : isCompleted
            ? HeartSquareIcon
            : AddSquareIcon;

        return (
          <span
            key={step}
            className="inline-flex h-6 w-6 items-center justify-center"
            style={{ color }}
          >
            <IconComponent />
          </span>
        );
      })}
    </div>
  );
}
