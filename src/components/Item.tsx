import { cn } from '../utils/cn';

type ItemProps = {
  title: string;
  description?: React.ReactNode;
  tags?: string[];
  link?: { href: string; text: string };
  image?: { src: string; alt?: string };
  shortGutter?: boolean;
  bigImage?: boolean;
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
 * @param {boolean} [props.bigImage=false] - Whether to use the big image. Defaults to false.
 */
export const Item = ({ title, description, tags, link, image, shortGutter = false, bigImage = false }: ItemProps) => {
  const hasImage = image && image.src.length > 0;
  const hasLink = link && link.href.length > 0 && link.text && link.text.length > 0;
  const imageAlt = image?.alt || link?.text || title;
  const linkText = link?.text;
  const hasDescription = description && (typeof description === 'string' ? description.length > 0 : true);
  const hasTags = tags && tags.length > 0;

  return (
    <div className={cn('grid grid-cols-1 gap-6 sm:grid-cols-4', shortGutter ? 'mb-8' : 'mb-12')}>
      <div className="sm:col-span-1">
        <p className="text-lg font-semibold text-secondary sm:text-xl sm:font-normal">{title}</p>
      </div>
      <div className="sm:col-span-3">
        {hasImage && (
          <img
            alt={imageAlt}
            src={image.src}
            className={cn('mb-6 h-auto w-full max-w-xs sm:max-w-sm', bigImage && 'sm:max-w-md')}
          />
        )}

        {hasLink && (
          <a className="mb-4 text-lg text-white hover:underline" href={link.href} target="_blank" rel="noreferrer">
            {linkText}
          </a>
        )}
        {hasDescription && (
          <div className="mb-6">
            {typeof description === 'string' ? (
              <p className="text-pretty text-base">{description}</p>
            ) : (
              <div className="space-y-2">{description}</div>
            )}
          </div>
        )}
        {hasTags && <p className="text-sm text-secondary">{tags.join(' ∙ ')}</p>}
      </div>
    </div>
  );
};
