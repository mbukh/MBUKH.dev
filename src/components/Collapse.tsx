import { createContext, useCallback, useContext, useState } from 'react';
import { cn } from '../utils/cn';

const CollapseContext = createContext<{
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  withTeaser: boolean;
  className?: string;
}>({
  isOpen: false,
  setIsOpen: () => {},
  withTeaser: false,
});

export const Collapse = ({
  expanded = false,
  withTeaser = false,
  children,
  className,
}: {
  expanded?: boolean;
  withTeaser?: boolean;
  children: React.ReactNode;
  className?: string;
}) => {
  const [isOpen, setIsOpen] = useState(expanded || false);

  return (
    <CollapseContext.Provider value={{ isOpen, setIsOpen, withTeaser, className }}>{children}</CollapseContext.Provider>
  );
};

export const CollapseTrigger = ({
  onChange,
  children,
}: {
  onChange?: (newState: boolean) => void;
  children: React.ReactNode;
}) => {
  const { isOpen, setIsOpen } = useContext(CollapseContext);

  const handleClick = useCallback(() => {
    const newState = !isOpen;
    setIsOpen(newState);
    onChange?.(newState);
  }, [isOpen, setIsOpen, onChange]);

  return (
    <div className="cursor-pointer" onClick={handleClick}>
      {children}
    </div>
  );
};

export const CollapseContent = ({ children }: { children: React.ReactNode }) => {
  const { isOpen, withTeaser, setIsOpen, className } = useContext(CollapseContext);

  return (
    <div
      className={cn(
        'overflow-hidden transition-all duration-300 ease-in-out relative',
        { 'max-h-[1000px] opacity-100': isOpen },
        { 'max-h-24': withTeaser && !isOpen },
        { 'max-h-0': !isOpen && !withTeaser },
        className,
      )}
    >
      <div
        onClick={() => !isOpen && setIsOpen(true)}
        className={cn(
          'absolute bottom-0 h-0 w-full',
          'bg-gradient-to-b from-transparent via-transparent via-10% to-primary transition-height duration-300',
          {
            'h-28 cursor-pointer': withTeaser && !isOpen,
          },
          className,
        )}
      ></div>
      {children}
    </div>
  );
};
