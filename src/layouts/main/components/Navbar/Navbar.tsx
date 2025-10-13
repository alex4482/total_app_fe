import { useEffect, useState } from 'react';

import useGeneralStore from '@/stores/useGeneralStore.tsx';
// import useTasksStore from '@/stores/useTasksStore.tsx';
import { Menu, Plus, SearchIcon } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

import { Button, buttonVariants } from '@/components/ui/button.tsx';
import { navigationMenuTriggerStyle } from '@/components/ui/navigation-menu';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from '@/components/ui/navigation-menu.tsx';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet.tsx';

import ModeToggle from './ModeToggle';

interface RouteProps {
  href: string;
  label: string;
}

const routeList: RouteProps[] = [
  {
    href: '/tenants',
    label: 'Chiriasi',
  },
  {
    href: '/email-presets',
    label: 'Emailuri predefinite',
  },
  {
    href: '/files',
    label: 'Fișiere',
  },
];

export function Navbar() {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isScrolled, setIsScrolled] = useState<boolean>(false);
  const { setVariableByName } = useGeneralStore();
  const navigate = useNavigate();

  // const { toggleTaskCreateOpen, toggleProjectCreateOpen } = useTasksStore();

  // const handleAddTaskClick = () => {
  //   toggleTaskCreateOpen(true);
  //   navigate('/tasks');
  // };

  // const handleAddProjectClick = () => {
  //   toggleProjectCreateOpen(true);
  //   navigate('/projects');
  // };

  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 0;
      setIsScrolled(isScrolled);
    };

    document.addEventListener('scroll', handleScroll);
    return () => {
      document.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 w-full border-b-[1px] bg-white dark:border-b-slate-700 dark:bg-background ${
        isScrolled ? 'shadow-md' : ''
      }`}
    >
      <nav className="flex h-14 justify-stretch px-4 py-4 lg:px-4">
        <div className="flex w-1/2 items-center justify-start gap-2 lg:w-1/3">
          <Link
            to="/"
            className="ml-2 flex bg-gradient-to-r from-yellow-500 to-red-500 bg-clip-text text-xl font-bold text-transparent"
          >
            TotalApp.
          </Link>
          <Button
            onClick={() => setVariableByName('isSearchOpen', true)}
            className={`${buttonVariants({
              variant: 'outline',
            })} ml-5 flex gap-2 border`}
          >
            <SearchIcon className="h-4 w-4 text-foreground" />
          </Button>
          { (
            <NavigationMenu className="ml-5 hidden lg:flex">
              <NavigationMenuList>
                <NavigationMenuItem>
                  <NavigationMenuTrigger className="!w-[200px]">
                    {' '}
                    <Plus className="mr-2 h-5 w-5" /> Adaugă
                  </NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <NavigationMenuLink
                      className={
                        navigationMenuTriggerStyle() +
                        ' !w-[200px] cursor-pointer select-none'
                      }
                     // onClick={handleAddTaskClick}
                    >
                      Task nou
                    </NavigationMenuLink>
                    <NavigationMenuLink
                      className={
                        navigationMenuTriggerStyle() +
                        ' !w-[200px] cursor-pointer select-none'
                      }
                     // onClick={handleAddProjectClick}
                    >
                      Proiect nou
                    </NavigationMenuLink>
                  </NavigationMenuContent>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>
          )}
        </div>

        <div className="flex w-1/2 items-center justify-end gap-2 lg:w-1/3 lg:justify-center">
          <div className="flex items-center gap-2 font-bold lg:hidden">
           
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger className="block lg:hidden">
                <Menu className="h-6 w-6" />
              </SheetTrigger>
              <SheetContent
                side={'left'}
                className="flex h-full flex-col items-center justify-end md:justify-center"
              >
                <div>
                  <SheetHeader className="flex items-center justify-center">
                    <SheetTitle className="flex bg-gradient-to-r from-yellow-500 to-red-500 bg-clip-text text-3xl font-bold text-transparent">
                      TotalApp.
                    </SheetTitle>
                  </SheetHeader>
                  <nav className="mt-4 flex flex-col items-center justify-end gap-2 md:justify-center">
                    {routeList.map(({ href, label }: RouteProps) => (
                      <Link
                        key={label}
                        to={href}
                        onClick={() => setIsOpen(false)}
                        className={buttonVariants({ variant: 'ghost' })}
                      >
                        {label}
                      </Link>
                    ))}
                  </nav>
                </div>
                <div className="mt-auto flex w-full flex-col items-end md:items-center">
                  { (
                    <Button
                      //onClick={handleAddTaskClick}
                      className={`${buttonVariants({
                        variant: 'primaryYellow',
                      })} flex w-full items-center justify-center border`}
                    >
                      <Plus className="mr-2 h-5 w-5" />
                      Adauga task
                    </Button>
                  )}
                  { (
                    <Button
                      //onClick={handleAddProjectClick}
                      className={`${buttonVariants({
                        variant: 'primaryYellow',
                      })} flex w-full items-center justify-center border`}
                    >
                      <Plus className="mr-2 h-5 w-5" />
                      Adauga proiect
                    </Button>
                  )}
                  <ModeToggle button={true} />
                
                </div>
              </SheetContent>
            </Sheet>
          </div>

          <div className="hidden gap-2 lg:flex">
            {routeList.map(({ href, label }: RouteProps) => (
              <Link
                key={label}
                to={href}
                onClick={() => setIsOpen(false)}
                className={buttonVariants({ variant: 'ghost' })}
              >
                {label}
              </Link>
            ))}
          </div>
        </div>

        <div className="hidden w-1/3 items-center justify-end gap-2 lg:flex">
          <ModeToggle />
        </div>
      </nav>
    </header>
  );
}
