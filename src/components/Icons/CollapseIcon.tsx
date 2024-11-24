import { cn } from '../../utils/cn';

export const CollapseIcon = ({ isOpen }: { isOpen: boolean }) => {
  return (
    <span
      className={cn('ms-2 inline-block text-secondary transition-all duration-300 ease-in-out rotate-0', {
        'rotate-[450deg]': isOpen,
      })}
    >
      ↬
    </span>
  );
};
