import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface TenantTabsProps {
  currentTab: string;
  onChange: (value: string) => void;
}

export default function TenantTabs({ currentTab, onChange }: TenantTabsProps) {
  return (
    <Tabs
      defaultValue={currentTab}
      value={currentTab}
      className="w-full bg-background p-2 sm:min-w-[35rem]"
      onValueChange={onChange}
    >
      <TabsList className="flex w-full">
        <TabsTrigger value="notstarted" className="w-full flex-1">
          <span className="bg-gradient-to-b from-red to-red-400 bg-clip-text font-bold text-transparent">
            Nepreluate{' '}
          </span>
        </TabsTrigger>
        <TabsTrigger value="inprogress" className="w-full flex-1">
          <span className="bg-gradient-to-b from-yellow to-yellow-400 bg-clip-text font-bold text-transparent">
            In progres
          </span>
        </TabsTrigger>
        <TabsTrigger value="completed" className="w-full flex-1">
          <span className="bg-gradient-to-b from-green to-green-400 bg-clip-text font-bold text-transparent">
            Finalizate{' '}
          </span>
        </TabsTrigger>
      </TabsList>
      <TabsContent
        value="notstarted"
        className="w-full overflow-y-auto bg-background"
      >
      </TabsContent>
      <TabsContent
        value="inprogress"
        className="w-full overflow-y-auto bg-background"
      >
      </TabsContent>
      <TabsContent
        value="completed"
        className="w-full overflow-y-auto bg-background"
      >
      </TabsContent>
    </Tabs>
  );
}
