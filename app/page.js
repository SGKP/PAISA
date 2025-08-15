import Image from "next/image";

export default function Home() {
  return (
    // this is used so that we can add 2 different or ore than 2 different main div inside the file this is called jsx <> is used
    <>
      <div className="flex flex-col items-center justify-center text-white h-[44vh] text-center">
        <div className="font-bold flex justify-center gap-2 text-5xl mb-2">
          Buy me a chai{" "}
          <span>
            <img src="/tea.gif" width={44} alt="" />
          </span>
        </div>
        <p className="mb-4">
          A crowd funding website where user can give money to thier favourite
          influencer
        </p>
        <div className="flex gap-4">
          <button
            type="button"
            className="text-white bg-gradient-to-r from-purple-500 via-purple-600 to-purple-700 
        hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-purple-300 
        dark:focus:ring-purple-800 shadow-lg shadow-purple-500/50 
        dark:shadow-lg dark:shadow-purple-800/80 font-medium rounded-lg 
        text-base px-10 py-4 text-center"
          >
            Start Now
          </button>
          <button
            type="button"
            className="text-white bg-gradient-to-br from-purple-600 to-blue-500 
        hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-blue-300 
        dark:focus:ring-blue-800 font-medium rounded-lg text-base px-10 py-4 text-center"
          >
            Read More
          </button>
        </div>
      </div>

      <div className="bg-white h-1 opacity-20"></div>
      <div className="text-white my-container mx-auto pb-32 pt-14 px-10 ">
        <h2 className="text-3xl font-bold text-center mb-14">
          Your Fans can buy you a Chai
        </h2>
        <div className=" flex justify-center  items-center">
          <div className="space-y-3 flex flex-col items-center justify-center">
            <img
              className="bg-slate-400 rounded-full p-2 text-black"
              width={88}
              src="/man.gif"
              alt=""
            />
            <p className="font-bold text-center">Fans want to help</p>
            <p className="text-center">
              Your fans are available to support you
            </p>
          </div>
          <div className="space-y-3 flex flex-col items-center justify-center">
            <img
              className="bg-slate-400 rounded-full p-2 text-black"
              width={88}
              src="/coin.gif"
              alt=""
            />
            <p className="font-bold text-center">Fans want to contribute</p>
            <p className="text-center">
              Your fans are willing to contribute financially
            </p>
          </div>
          <div className="space-y-3 flex flex-col items-center justify-center">
            <img
              className="bg-slate-400 rounded-full p-2 text-black"
              width={88}
              src="/group.gif"
              alt=""
            />
            <p className="font-bold text-center">Fans want to collaborate</p>
            <p className="text-center">
              Your fans are ready to collaborate with you
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white h-1 opacity-10"></div>

      <div className="text-white my-container mx-auto pb-32 pt-14 flex flex-col items-center justify-center">
        <h2 className="text-3xl font-bold text-center mb-14">
          Learn more about us
        </h2>
        {/* Responsive youtube embed  */}
        <div className="w-[90%] h-[40vh] md:w-[50%] md:h-[40vh] lg:w-[50%] lg:h-[40vh] xl:w-[50%] xl:h-[40vh]">
          <iframe
            className="w-full h-full"
            src="https://www.youtube.com/embed/ojuUnfqnUI0?si=wMUv4DG3ia6Wt4zn"
            title="YouTube video player"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen // ✅ Corrected here
          ></iframe>
        </div>
      </div>
    </>
  );
}
