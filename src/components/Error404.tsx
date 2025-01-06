import { Link } from "react-router-dom";
import E404 from "../assets/img/404.png";
import Unlink from "../assets/img/unlink.png";

const Error404 = () => {
  return (
    <div className="lg:px-24 lg:py-24 md:py-20 md:px-44 px-4 py-24 items-center flex justify-center flex-col-reverse lg:flex-row md:gap-28 gap-16">
      <div className="xl:pt-24 w-full xl:w-1/2 relative pb-12 lg:pb-0">
        <div className="relative">
          <div className="absolute">
            <div className="">
              <h1 className="my-2 text-gray-800 font-bold text-2xl">
                Looks like you've found the doorway to the great nothing
              </h1>
              <div className="mt-10">
              <Link to="/" className="sm:w-full lg:w-auto my-2 border rounded md py-4 px-8 text-center bg-blue-600 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-700 focus:ring-opacity-50">
                Return
              </Link>
              </div>
            </div>
          </div>
          <div>
            <img src={E404} />
          </div>
        </div>
      </div>
      <div>
        <img src={Unlink} />
      </div>
    </div>
  );
};

export default Error404;
