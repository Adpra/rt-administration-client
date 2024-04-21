import React from "react";

interface IProps {
  links?: any;
  onPageChange?: any;
}

const Pagination = ({ links, onPageChange }: IProps) => {
  if (!links || links.length <= 1) {
    return null;
  }

  return (
    <div className="join">
      <button
        className="btn join-item btn-sm"
        onClick={() => onPageChange("prev")}
      >
        Previous
      </button>
      {links.map((link: any) => (
        <button
          key={link}
          className={`btn join-item btn-sm ${link.active ? "btn-active" : ""}`}
          onClick={() => onPageChange(link)}
        >
          {link}
        </button>
      ))}
      <button
        className="btn join-item btn-sm"
        onClick={() => onPageChange("next")}
      >
        Next
      </button>
    </div>
  );
};

export default Pagination;
