export const Title = () => {
  return (
    <div className="mb-10 grid max-w-xl grid-cols-4 items-center gap-item">
      <div className="col-span-1">
        <div className="flex justify-center text-center transition-transform duration-300 ease-image-grow hover:scale-[1.03]">
          <img alt="Moshe Bukhman icon" src="/profile.png" className="size-24 h-auto w-4/5 rounded-full" />
        </div>
      </div>
      <div className="col-span-3">
        <h1 className="text-title leading-tight text-white">Moshe Bukhman</h1>
        <p className="">Software Engineer</p>
        <p className="text-secondary">Full Stack | DevOps</p>
      </div>
    </div>
  );
};

export default Title;
