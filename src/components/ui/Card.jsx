import React from "react";

const Card = ({ children, className = "" }) => {
  return (
    <div className={`card h-100 ${className}`}>
      <div className="card-body d-flex flex-column">{children}</div>
    </div>
  );
};

export default Card;
