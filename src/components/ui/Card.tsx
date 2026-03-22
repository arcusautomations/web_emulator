/**
 * Card — ARCADIUM UI Component (RSC compatible, no 'use client')
 *
 * Usage:
 *   <Card>
 *     <Card.Header>Title</Card.Header>
 *     <Card.Body>Content here</Card.Body>
 *     <Card.Footer>Footer actions</Card.Footer>
 *   </Card>
 *
 *   <Card hover className="p-4">Simple card</Card>
 */

import * as React from 'react';

// ── Types ──────────────────────────────────────────────────────────────────

export interface CardProps {
  children?: React.ReactNode;
  className?: string;
  /** Adds hover:border-neon-cyan/50 hover:shadow-glow-md-cyan transition */
  hover?: boolean;
  as?: React.ElementType;
}

export interface CardSectionProps {
  children?: React.ReactNode;
  className?: string;
}

// ── Sub-components ─────────────────────────────────────────────────────────

function CardHeader({ children, className = '' }: CardSectionProps) {
  return (
    <div
      className={[
        'px-5 pt-5 pb-4 border-b border-surface-3',
        'font-pixel text-h4 text-text-primary',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {children}
    </div>
  );
}
CardHeader.displayName = 'Card.Header';

function CardBody({ children, className = '' }: CardSectionProps) {
  return (
    <div className={['p-5 flex-1', className].filter(Boolean).join(' ')}>
      {children}
    </div>
  );
}
CardBody.displayName = 'Card.Body';

function CardFooter({ children, className = '' }: CardSectionProps) {
  return (
    <div
      className={[
        'px-5 pb-5 pt-4 border-t border-surface-3',
        'flex items-center gap-3',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {children}
    </div>
  );
}
CardFooter.displayName = 'Card.Footer';

// ── Root component ─────────────────────────────────────────────────────────

function Card({ children, className = '', hover = false, as: Tag = 'div' }: CardProps) {
  const classes = [
    'bg-surface-1 border border-magenta-dim/30 rounded-lg overflow-hidden',
    'flex flex-col',
    hover
      ? 'hover:border-neon-cyan/50 hover:shadow-glow-md-cyan transition-all duration-200 cursor-pointer'
      : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return <Tag className={classes}>{children}</Tag>;
}

Card.displayName = 'Card';

// Attach sub-components
Card.Header = CardHeader;
Card.Body = CardBody;
Card.Footer = CardFooter;

export { Card };
