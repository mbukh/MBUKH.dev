export const Title = ({ title, iconUrl, children }: { title: string; iconUrl: string; children?: React.ReactNode }) => {
  return (
    <div className="mb-12 grid grid-cols-1 items-center gap-8 sm:grid-cols-4">
      <div className="sm:col-span-1">
        <div className="mx-auto max-w-[150px]">
          <img alt={`${title} icon`} src={iconUrl} className="h-auto w-full rounded-full" />
        </div>
      </div>
      <div className="sm:col-span-3">
        <h1 className="mb-2">{title}</h1>
        {children}
      </div>
    </div>
  );
};
