import React from 'react';

interface FooterLinkProps {
  href: string;
  label: string;
}

const FooterLink: React.FC<FooterLinkProps> = ({ href, label }) => {
  return (
    <li>
      <a href={href} className="text-gray-400 hover:text-ava-purple5 transition-colors">
        {label}
      </a>
    </li>
  );
};

export default FooterLink;