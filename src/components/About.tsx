export const About = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="mb-12">
      <h2 className="mb-4">About</h2>
      <div className="text-pretty text-base">{children}</div>
    </div>
  );
};
