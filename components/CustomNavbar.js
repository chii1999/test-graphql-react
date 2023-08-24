import React, { useState } from "react";
import { classInput } from "./classNames/InputClass";
export default function CustomNavbar(props) {
  const [query, setQuery] = useState("");

  const handleSearch = (e) => {
    const dataQuery = e.target.value;
    setQuery(dataQuery);
  };

  props.handleSearch(query);

  return (
    <div className="w-full px-12 py-2 bg-gray-500 fixed flex justify-between items-center z-50">
      <h2 className="font-bold text-2xl text-white">CURD</h2>
      <div className="grow-8">
        <input
          onChange={handleSearch}
          className={classInput}
          placeholder="Search..."
        />
      </div>
    </div>
  );
}
