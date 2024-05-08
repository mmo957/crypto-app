/* eslint-disable react/prop-types */

function MainBoxStyle({ children, className }) {
  return (
    <div
      className={`bg-black pb-10 w-full flex flex-col gap-4 items-center rounded-[40px] p-3 ${className}`}
    >
      {children}
    </div>
  );
}

export default MainBoxStyle;
