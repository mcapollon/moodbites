import React, { HTMLProps, ReactNode } from 'react';

interface CardProps extends HTMLProps<HTMLDivElement> {
  title?: string;
  subtitle?: string;
  icon?: ReactNode;
  footer?: ReactNode;
  isActive?: boolean;
}

const Card: React.FC<CardProps> = ({
  children,
  title,
  subtitle,
  icon,
  footer,
  isActive = false,
  className = '',
  ...props
}) => {
  return (
    <div
      className={`bg-white rounded-xl shadow-md overflow-hidden transition-all duration-200 ${
        isActive ? 'ring-2 ring-teal-500 shadow-lg' : ''
      } ${className}`}
      {...props}
    >
      {(title || icon) && (
        <div className="px-6 py-4 border-b border-gray-100 flex items-center">
          {icon && <div className="mr-3 text-teal-600">{icon}</div>}
          <div>
            {title && <h3 className="font-semibold text-lg text-gray-800">{title}</h3>}
            {subtitle && <p className="text-sm text-gray-500">{subtitle}</p>}
          </div>
        </div>
      )}
      <div className="p-6">{children}</div>
      {footer && <div className="px-6 py-4 bg-gray-50 border-t border-gray-100">{footer}</div>}
    </div>
  );
};

export default Card;