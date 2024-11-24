export const Header = () => {
  return (
    <header className="fixed inset-x-0 top-0 flex items-center justify-between p-4">
      <img alt="Bonhomme" src="/logo.svg" className="h-8 w-auto" />
      <div>
        <button className="rounded-lg bg-neutral-700 p-2 px-3 font-medium text-white">Connect Wallet</button>
      </div>
    </header>
  );
};

export default Header;
