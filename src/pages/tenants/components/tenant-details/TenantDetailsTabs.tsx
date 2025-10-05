import useTenantsStore, { TenantDetailsHandler } from '@/stores/useTenantsStore.tsx';

import { Label } from '@/components/ui/label.tsx';
import { ScrollArea } from '@/components/ui/scroll-area.tsx';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs.tsx';

import 'filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css';
import 'filepond/dist/filepond.min.css';

import { useEffect, useRef, useState } from 'react';

import { Home } from 'lucide-react';
import { BeatLoader } from 'react-spinners';

import Default from './tabs/default/Defaults.tsx';
import useTenantsExtrasStore from '@/stores/useTenantsExtrasStore.tsx';

const TenantDetailsTabs = () => {
 const { setVariableByName, 
    setCurrentElement: setCurrentTenant, 
    currentElement: currentTenant } =
    useTenantsStore();
  const { setVariableByName: setVariableExtrasByName,
    areTenantDetailsLoading
   } =
    useTenantsExtrasStore();
  const [selectedTab, setSelectedTab] = useState('default');
  const prevTabRef = useRef(selectedTab);

  if (!currentTenant) return null;

  // useEffect(() => {
  //   if (fromHistory && selectedTab !== 'tenantHistory') {
  //     setSelectedTab('tenantHistory');
  //     setHistoryVariable('fromHistory', false);
  //   }
  // }, [fromHistory]);

  // useEffect(() => {
  //   if (prevTabRef.current === 'tenantHistory' && selectedTab !== 'tenantHistory') {
  //     setHistoryVariable('highlightedEventId', undefined);
  //   }
  //   prevTabRef.current = selectedTab;
  // }, [selectedTab]);
  return (
    <Tabs value={selectedTab} onValueChange={setSelectedTab}>
      <TabsList className="w-full justify-center md:justify-start">
        <TabsTrigger value="default">
          <Home />
        </TabsTrigger>
        {/* <TabsTrigger value="addComment">Adauga comentariu</TabsTrigger> */}
        <TabsTrigger value="tenantHistory">Istoric chirias</TabsTrigger>
        <TabsTrigger value="tenantFiles">Fișiere chirias</TabsTrigger>
      </TabsList>
      <TabsContent value="default">
        <Default/>
      </TabsContent>
      {/* <TabsContent value="addComment">
        <AddComment
          handleGetTenantDetails={handleGetTenantDetails}
          handleGetTenantHistory={handleGetTenantHistory}
          selectedTab={selectedTab}
        />
      </TabsContent> */}
      <TabsContent value="tenantHistory">
        {areTenantDetailsLoading ? (
          <div className="flex w-full flex-col items-center">
            <BeatLoader color="#F59E0B" />
          </div>
        ) : (
          <div className="mb-4">
            <Label>Istoric</Label>
            <ScrollArea className="mb-2 h-96 w-full rounded-md border">
              <div className="p-2">
                {/* <TenantHistoryComponent currentTenantHistory={currentTenantHistory} /> */}
              </div>
            </ScrollArea>
          </div>
        )}
      </TabsContent>
      <TabsContent value="tenantFiles">
        <div className="mb-4">
          <ScrollArea className="mb-2 h-96 w-full rounded-md border">
            <div className="p-2">
              {/* <MiniFileManager initialPath={composedPath} /> */}
            </div>
          </ScrollArea>
        </div>
      </TabsContent>
    </Tabs>
  );
};

export default TenantDetailsTabs;
