import React, {type ReactNode} from 'react';
import DocCard from '@theme-original/DocCard';
import type DocCardType from '@theme/DocCard';
import type {WrapperProps} from '@docusaurus/types';
import clsx from 'clsx';
import Link from '@docusaurus/Link';
import styles from './styles.module.css';
import Heading from '@theme/Heading';

type Props = WrapperProps<typeof DocCardType>;

function CardContainer({
  href,
  children,
}: {
  href: string;
  children: ReactNode;
}): JSX.Element {
  return (
    <Link
      href={href}
      className={clsx('card padding--lg', styles.cardContainer)}>
      {children}
    </Link>
  );
}

function CardLayout({
  href,
  icon,
  title,
  description,
}: {
  href: string;
  icon: ReactNode;
  title: string;
  description?: string;
}): JSX.Element {
  return (
    <CardContainer href={href}>
      <Heading
        as="h2"
        className={clsx('text--truncate', styles.cardTitle)}
        title={title}>
        {icon} {title}
      </Heading>
      {description && (
        <p
          className={clsx('text--truncate', styles.cardDescription)}
          title={description}>
          {description}
        </p>
      )}
    </CardContainer>
  );
}

export { CardLayout };
 
export default function DocCardWrapper(props: Props): ReactNode {
  return (
    <>
      <DocCard {...props} />
    </>
  );
}
