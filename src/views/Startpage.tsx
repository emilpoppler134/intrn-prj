import { Link } from "react-router-dom";

export default function Startpage() {
  return (
    <>
      <h1 className="text-3xl font-bold underline">
        This is the startpage.
      </h1>
      <Link to="/login" className="text-indigo-600 hover:text-indigo-500">
        <span className="font-semibold">Go to login</span>
      </Link>
    </>
  )
}