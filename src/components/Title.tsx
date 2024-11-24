export const Title = () => {
  return (
    <div className="mb-10 grid max-w-xl grid-cols-4 items-center gap-item">
      <div className="col-span-1">
        <div className="flex justify-center text-center transition-transform duration-300 ease-image-grow hover:scale-[1.03]">
          <img alt="Bonhomme" src="/profile.png" className="size-24 h-auto w-4/5 rounded-full" />
        </div>
      </div>
      <div className="col-span-3">
        <h1 className="text-title leading-tight text-white">Maxime Bonhomme</h1>
        <p className="">Product-focused Developer</p>
        <a className="opacity-50" href="https://etherscan.io/address/0xff5fe6e0d3d48c90a66217dd4a7560a3ed8dacd2">
          bonhomme.eth
        </a>
      </div>
    </div>
  );
};

export default Title;
