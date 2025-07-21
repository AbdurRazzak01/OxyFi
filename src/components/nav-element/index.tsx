/* tslint:disable:no-empty */
import Link from 'next/link';
import Text from '../Text';
import clsx from 'clsx';
import { useRouter } from 'next/router';
import { useEffect, useRef } from 'react';

type NavElementProps = {
    label: string;
    href: string;
    as?: string;
    scroll?: boolean;
    chipLabel?: string;
    disabled?: boolean;
    navigationStarts?: () => void;
    className?: string;
};

const NavElement = ({
    label,
    href,
    as,
    scroll,
    disabled,
    navigationStarts = () => {},
    className,
}: NavElementProps) => {
    const router = useRouter();
    const isActive = href === router.asPath || (as && as === router.asPath);
    const divRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        if (divRef.current) {
            divRef.current.className = clsx(
                'h-0.5 w-1/4 transition-all duration-300 ease-out',
                isActive
                    ? '!w-full bg-gradient-to-l from-fuchsia-500 to-pink-500 '
                    : 'group-hover:w-1/2 group-hover:bg-fuchsia-500',
            );
        }
    }, [isActive]);

    if (className) {
        // Mobile/custom styling
        return (
            <Link
                href={href}
                as={as}
                scroll={scroll}
                passHref
                className={clsx(
                    className,
                    isActive && 'bg-purple-100 dark:bg-purple-900 text-purple-600 dark:text-purple-400',
                    disabled && 'pointer-events-none cursor-not-allowed opacity-50',
                )}
                onClick={() => navigationStarts()}
            >
                {label}
            </Link>
        );
    }

    // Desktop styling
    return (
        <Link
            href={href}
            as={as}
            scroll={scroll}
            passHref
            className={clsx(
                'group flex h-full flex-col items-center justify-between hover:scale-105 transition-all duration-200',
                disabled &&
                    'pointer-events-none cursor-not-allowed opacity-50',
            )}
            onClick={() => navigationStarts()}
        >
            <div className="flex flex-row items-center gap-3">
                <Text variant="nav-heading" className={clsx(
                    'transition-colors duration-200',
                    isActive 
                        ? 'text-purple-600 dark:text-purple-400' 
                        : 'text-gray-700 dark:text-gray-300 group-hover:text-purple-600 dark:group-hover:text-purple-400'
                )}> 
                    {label} 
                </Text>
            </div>
            <div ref={divRef} />
        </Link>
    );
};

export default NavElement;

