import { cn } from '../utils/cn';

type ItemProps = {
  title: string;
  description?: React.ReactNode;
  tags?: string[];
  link?: { href: string; text: string };
  image?: { src: string; alt?: string };
  shortGutter?: boolean;
};

/**
 * Renders an item with a title, optional description, tags, link, and image.
 *
 * @param {Object} props - The component props.
 * @param {string} props.title - The title of the item.
 * @param {string} [props.description] - The description of the item. Optional.
 * @param {string[]} [props.tags] - The tags of the item. Optional.
 * @param {Object} [props.link] - The link of the item. Optional.
 * @param {string} props.link.href - The URL of the link.
 * @param {string} props.link.text - The text of the link.
 * @param {Object} [props.image] - The image of the item. Optional.
 * @param {string} props.image.src - The source URL of the image.
 * @param {string} [props.image.alt] - The alt text of the image. Defaults to link text or title. Optional.
 * @param {boolean} [props.shortGutter=false] - Whether to use the short gutter. Defaults to false.
 */
export const Item = ({ title, description, tags, link, image, shortGutter = false }: ItemProps) => {
  const hasImage = image && image.src.length > 0;
  const hasLink = link && link.href.length > 0 && link.text && link.text.length > 0;
  const imageAlt = image?.alt || link?.text || title;
  const linkText = link?.text;
  const hasDescription = description && (typeof description === 'string' ? description.length > 0 : true);
  const hasTags = tags && tags.length > 0;

  return (
    <div className={cn('grid grid-cols-4 items-start gap-item', shortGutter ? 'mb-4' : 'mb-10')}>
      <div className="col-span-full sm:col-span-1">
        <p className="break-words font-bold text-secondary sm:font-normal">{title}</p>
      </div>
      <div className="col-span-full flex flex-col gap-2 sm:col-span-3">
        {hasImage && <img alt={imageAlt} src={image.src} className="mb-2 h-auto w-12 sm:w-9" />}

        {hasLink && (
          <a className="flex items-center text-pretty text-white" href={link.href} target="_blank" rel="noreferrer">
            {linkText}
          </a>
        )}
        {hasDescription && <p className="text-pretty">{description}</p>}
        {hasTags && <p className="text-pretty text-secondary">{tags.join(' ∙ ')}</p>}
      </div>
    </div>
  );
};
