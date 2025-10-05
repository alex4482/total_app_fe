import { useEffect, useState } from 'react';

import useGeneralStore from '@/stores/useGeneralStore';
import { useNavigate } from 'react-router-dom';

import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from '@/components/ui/command';

export function Search() {
  const [value, setValue] = useState<string | undefined>(undefined);

  const { isSearchOpen, setVariableByName } = useGeneralStore();
 
  const navigate = useNavigate();

  const handleOnValueChange = (newValue: any) => {
    if (newValue) {
      setValue(newValue);
    } else {
      setValue('');
    }
  };


  // const getColorBasedOnStatus = (task: Task) => {
  //   if (task.status === 'COMPLETED') {
  //     return 'bg-[green] bg-opacity-40';
  //   }
  //   if (task.status === 'IN_PROGRESS') {
  //     return 'bg-[orange] bg-opacity-40';
  //   }
  //   return 'bg-[red] bg-opacity-40';
  // };

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setVariableByName('isSearchOpen', !isSearchOpen);
      }
    };
    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, []);

  const handleOnOpenChange = (open: boolean) => {
    if (!open) {
      //setCurrentTask(null);
      //setCurrentProject(null);
    }
    setVariableByName('isSearchOpen', open);
  };

  return (
    <CommandDialog open={isSearchOpen} onOpenChange={handleOnOpenChange}>
      <CommandInput
        value={value}
        onValueChange={handleOnValueChange}
        placeholder="Cauta..."
      />
      <CommandList className="z-100 relative h-[300px]">
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandGroup heading="Task-uri">
          {/* {allTasks.map(task => (
            <CommandItem
              key={task.id}
              onSelect={() => handleOnTaskClick(task)}
              className={getColorBasedOnStatus(task) + ' mt-1 cursor-pointer'}
            >
              {'[T-' + task.number + '] ' + task.name}
            </CommandItem>
          ))} */}
        </CommandGroup>
        <CommandSeparator />
        <CommandGroup heading="Proiecte">
          {/* {projects.map(project => (
            <CommandItem
              key={project.id}
              className="mt-1 cursor-pointer"
              onSelect={() => handleOnProjectClick(project)}
            >
              {project.name}
            </CommandItem>
          ))} */}
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
}
