import React from "react";
function SmallBox({ value = CertiK, name = "CertiK" }) {
  return (
    <div className="flex gap-2 px-2 bg-boxColor rounded-full py-1 ">
      <img src={value} width={20} height={20} alt={value} />
      <span>{name}</span>
    </div>
  );
}

export default SmallBox;
