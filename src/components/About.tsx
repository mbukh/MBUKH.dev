export const About = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="mb-10">
      <h2 className="mb-2 leading-snug text-white">About</h2>
      {children}
    </div>
  );
};

export default About;
