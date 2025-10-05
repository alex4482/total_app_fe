import useEmailsStore from '@/stores/useEmailsStore';

import BeatLoader from 'react-spinners/BeatLoader';

export default function Emails() {
  const { presetsTree, arePresetsLoading } = useEmailsStore();

  if (arePresetsLoading && !presetsTree.length) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <p className="mb-4 text-lg font-semibold">TBD</p>
          <BeatLoader color="#F59E0B" className="my-4" />
        </div>
      </div>
    );
  } 
  else {
    return (
      <>
        <div className="container h-screen flex-1 py-5 sm:py-5">
          {/* <PresetsEmailManager /> */}
        </div>
      </>
    );
  }
}
