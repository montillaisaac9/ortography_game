
'use client'

import { PlayIcon, HomeIcon} from '@heroicons/react/24/outline';
import Link from 'next/link';
import { usePathname } from 'next/navigation';



// Map of links to display in the side navigation.
// Depending on the size of the application, this would be stored in a database.
const links = [
  { name: 'home', href: '/pages/home', icon: HomeIcon },
  { name: 'Juego 1', href: '/pages/home/game1', icon: PlayIcon },
  { name: 'Juego 2', href: '/pages/home/game2', icon: PlayIcon },
  { name: 'Juego 3', href: '/pages/home/game3', icon: PlayIcon },
  { name: 'Juego 4', href: '/pages/home/game4', icon: PlayIcon },
  { name: 'Juego 5', href: '/pages/home/game5', icon: PlayIcon },
];



export default function NavLinks() {

  const pathname = usePathname();
  console.log(pathname)

  return (
    <>
      {links.map((link) => {
        const LinkIcon = link.icon;
        return (
          <Link
            key={link.name}
            href={link.href}
            className={`flex h-[48px] grow items-center justify-center gap-2 rounded-md bg-gray-50 p-3 text-sm font-medium hover:bg-sky-100 hover:text-blue-600 md:flex-none md:justify-start md:p-2 md:px-3  
              ${pathname === link.href ? 'bg-sky-100 text-blue-600' : ''}
              `}
          >
            <LinkIcon className="w-6" />
            <p className="hidden md:block">{link.name}</p>
          </Link>
        );
      })}
    </>
  );
}
