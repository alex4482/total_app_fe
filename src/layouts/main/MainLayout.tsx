import { useEffect, useRef } from 'react';

// import { useAuthContext, useCurrentUser } from '@/Auth';
// import useStompClient from '@/clients/stomp-client';
// import useFetchFiles from '@/util/hooks/useFetchFiles';
// import useFetchNotifications from '@/util/hooks/useFetchNotifications';
// import useFetchProjects from '@/util/hooks/useFetchProjects';
// import useFetchTasks from '@/util/hooks/useFetchTasks';
// import useFetchUsers from '@/util/hooks/useFetchUsers';
// import { useSoundFilePath } from '@/util/hooks/useSoundFilePath';
import { Outlet } from 'react-router-dom';

import { Footer, Header, ScrollToTop, Search } from './components';

export const MainLayout = () => {
  // const { currentSession } = useAuthContext();
  // const currentUser = useCurrentUser();
  // const soundFilePath = useSoundFilePath(currentUser.id);
  // const audioRef = useRef<HTMLAudioElement | null>(null);
  // useStompClient(currentUser.id, audioRef);

  // const { handleFetchNotifications } = useFetchNotifications(currentUser);
  
  // Use effects for data fetching
  // useEffect(() => {
    // if (currentSession.isAuthenticated) {
  //    handleFetchNotifications();
    // }
  // }, []);

  return (
    <div className="flex min-h-screen flex-col">
      {/* <audio ref={audioRef} src={soundFilePath} preload="auto" /> */}
      <Header />
      <Search />
      <main className="flex-1 overflow-y-auto">
        <Outlet />
      </main>
      {/* <Footer /> */}
      <ScrollToTop />
    </div>
  );
};
