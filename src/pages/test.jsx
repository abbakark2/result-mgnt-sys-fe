import React from "react";

function TestPage() {
  return (
    <div className="flex justify-center items-center bg-gray-800 min-h-screen text-white">
      <div className="bg-gray-700 p-8 rounded-lg shadow-md">
        <h1 className="text-4xl font-bold mb-4">Welcome to the Test Page</h1>
        <div className="min-w-3xl min-h-16 bg-gray-300 rounded-lg">
          <div className="flex justify-center text-black gap-5">
            <span>The following is the status toggle practice</span>
            <label
              htmlFor="status"
              className="flex justify-between items-center gap-5"
            >
              <input
                type="checkbox"
                name="status"
                id="status"
                className="sr-only peer"
              />
              <div
                className="w-9 h-5 border-2 cursor-pointer border-green-500 bg-white rounded-lg 
                relative 
                after:absolute after:bg-gray-300 after:w-4 after:h-4 after:rounded-full 
                peer-checked:after:translate-x-full peer-checked:after:bg-emerald-500 after:transition-all"
              ></div>
              {/* <div
                className="w-9 h-5 
                 relative
               bg-gray-200 
               peer-focus:outline-none 
               peer-focus:ring-2 
               peer-focus:ring-emerald-500/50 
               rounded-full 
               peer peer-checked:after:translate-x-full 
               rtl:peer-checked:after:-translate-x-full 
               peer-checked:after:border-white 
               after:content-[''] 
               after:absolute 
               after:top-0.5 
               after:start-0.5 
               after:bg-white 
               after:border-gray-300 
               after:border 
               after:rounded-full 
               after:h-4 after:w-4 
               after:transition-all 
               peer-checked:bg-emerald-500"
              ></div> */}
            </label>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TestPage;
