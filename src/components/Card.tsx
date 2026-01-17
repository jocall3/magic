import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

/**
 * Interface for the Card component's props.
 * @param {string} title - The main heading of the card.
 * @param {string} description - The body text or description for the card.
 * @param {string} [imageUrl] - Optional URL for an image to display at the top of the card.
 * @param {string} [linkUrl] - Optional URL to make the entire card a clickable link.
 * @param {string} [ctaText='Learn More'] - Optional call-to-action text for the link.
 * @param {string} [className] - Optional additional CSS classes to apply to the card container.
 * @param {React.ReactNode} [children] - Optional children elements to render inside the card's body.
 */
interface CardProps {
  title: string;
  description: string;
  imageUrl?: string;
  linkUrl?: string;
  ctaText?: string;
  className?: string;
  children?: React.ReactNode;
}

/**
 * A reusable card component for displaying content in a structured and visually appealing way.
 * It supports an optional image, can be wrapped in a link, and allows for custom content via children.
 * The styling is done with Tailwind CSS, including hover effects and dark mode support.
 */
const Card: React.FC<CardProps> = ({
  title,
  description,
  imageUrl,
  linkUrl,
  ctaText = 'Read More',
  className = '',
  children,
}) => {
  // The inner content of the card, separated to be used within a Link or a div.
  const cardInnerContent = (
    <>
      {imageUrl && (
        <div className="relative w-full h-56 flex-shrink-0">
          <Image
            src={imageUrl}
            alt={title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover"
          />
        </div>
      )}
      <div className="p-6 flex flex-col flex-grow">
        <h3 className="text-xl lg:text-2xl font-bold mb-3 text-gray-900 dark:text-white">
          {title}
        </h3>
        <p className="text-gray-600 dark:text-gray-300 flex-grow">
          {description}
        </p>
        {children && <div className="mt-4">{children}</div>}
        {linkUrl && (
          <div className="mt-auto pt-4">
            <span className="inline-block text-blue-600 dark:text-blue-400 group-hover:text-blue-800 dark:group-hover:text-blue-300 font-semibold transition-colors duration-300">
              {ctaText} &rarr;
            </span>
          </div>
        )}
      </div>
    </>
  );

  // Base classes for the card container.
  const cardClasses = `
    bg-white dark:bg-gray-800 
    border border-gray-200 dark:border-gray-700 
    rounded-xl shadow-md hover:shadow-xl 
    transition-all duration-300 ease-in-out 
    transform hover:-translate-y-1.5
    flex flex-col h-full overflow-hidden group
    ${className}
  `;

  // If a linkUrl is provided, wrap the entire card in a Next.js Link component.
  if (linkUrl) {
    return (
      <Link href={linkUrl} className={cardClasses}>
        {cardInnerContent}
      </Link>
    );
  }

  // Otherwise, render a standard div.
  return <div className={cardClasses}>{cardInnerContent}</div>;
};

export default Card;