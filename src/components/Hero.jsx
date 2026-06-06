import ExploreButtons from "./ExploreButtons";

function Hero() {
  return (
    <div className="bg-linear-to-b from-white to-[#EDF2FF] pt-30">
      <div className="mx-auto w-full max-w-[1200px] space-y-14 px-5">
        <div className="space-y-12">
          <div className="space-y-8 text-center text-[#1C1C1E]">
            <h1 className="text-[36px] font-extrabold md:text-[64px]">
              Powering Communities, One Contribution at a Time
            </h1>

            <p className="mx-auto max-w-[842px] font-light md:text-[20px]">
              Contribute.fi connects projects with passionate contributors
              through smart contracts, wallet-linked reputation, and transparent
              rewards — built on Soroban & Stellar.
            </p>
          </div>

          <ExploreButtons />
        </div>

        <img
          className="h-auto w-full"
          src="/Frame.svg"
          alt="Dashboard image"
          height="314"
          width="372"
        />
      </div>
    </div>
  );
}

export default Hero;
