import Image from "next/image";

export default function Home() {
  return (
    // this is used so that we can add 2 different or ore than 2 different main div inside the file this is called jsx <> is used
    <> 
    <div className="flex flex-col items-center justify-center text-white h-[44vh] text-center">
  <div className="font-bold flex justify-center gap-2 text-5xl mb-2">Buy me a chai <span><img src="/tea.gif" width={44} alt=""/></span></div>
  <p className="mb-4">A crowd funding website where user can give money to thier favourite influencer</p>
  <div className="flex gap-4">
    <button 
      type="button" 
      className="text-white bg-gradient-to-r from-purple-500 via-purple-600 to-purple-700 
        hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-purple-300 
        dark:focus:ring-purple-800 shadow-lg shadow-purple-500/50 
        dark:shadow-lg dark:shadow-purple-800/80 font-medium rounded-lg 
        text-base px-10 py-4 text-center">
      Start Now
    </button>
    <button 
      type="button" 
      className="text-white bg-gradient-to-br from-purple-600 to-blue-500 
        hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-blue-300 
        dark:focus:ring-blue-800 font-medium rounded-lg text-base px-10 py-4 text-center">
      Read More
    </button>
  </div>
</div>

<div className="bg-white h-1 opacity-20">
</div>

<div>

</div>




</>

  );
}
