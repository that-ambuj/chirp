export const LoadingSpinner = ({ size }: { size?: number }) => {
  return (
    <div>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width={size ?? 40}
        height={size ?? 40}
        viewBox="0 0 24 24"
      >
        <rect x="0" y="0" width="24" height="24" fill="none" stroke="none" />
        <path
          fill="#60a5fa"
          d="M12,1A11,11,0,1,0,23,12,11,11,0,0,0,12,1Zm0,19a8,8,0,1,1,8-8A8,8,0,0,1,12,20Z"
          opacity=".25"
        />
        <path
          fill="#60a5fa"
          d="M12,4a8,8,0,0,1,7.89,6.7A1.53,1.53,0,0,0,21.38,12h0a1.5,1.5,0,0,0,1.48-1.75,11,11,0,0,0-21.72,0A1.5,1.5,0,0,0,2.62,12h0a1.53,1.53,0,0,0,1.49-1.3A8,8,0,0,1,12,4Z"
        >
          <animateTransform
            attributeName="transform"
            dur="0.75s"
            repeatCount="indefinite"
            type="rotate"
            values="0 12 12;360 12 12"
          />
        </path>
      </svg>
    </div>
  );
};

export const LoadingPage = () => {
  return (
    <div className="absolute top-0 right-0 w-screen h-screen flex justify-center align-middle items-center">
      <LoadingSpinner />
    </div>
  );
};
