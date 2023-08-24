import React from "react";
import { classInput } from "../../components/classNames/InputClass";

export default function ViewsUser(props) {
  const recon = props.data;
  return (
    <div className="flex flex-col justify-center items-center gap-4">
        <p className="py-1">Fullname: {recon.fullname}</p>
        <p className="py-1">Age: {recon.age}</p>
        <p className="py-1">Phone: {recon.phone}</p>
        <p className="py-1">ID: {recon.id}</p>
        <input className={classInput} placeholder="Document your here..." />
    </div>
  );
}
