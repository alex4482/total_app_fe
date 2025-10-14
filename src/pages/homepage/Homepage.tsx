import '../../styles/globals.css';

// import AvinciLogo from '@/assets/logo/avinciLogo.svg?react';
// import TasKeepLogo from '@/assets/logo/taskeepLogo.svg?react';
// import useStatisticsStore from '@/stores/useStatisticsStore';

// import ChartGrid from './components/ChartGrid';

export default function Homepage() {
//   const [allChartsLoaded, setAllChartsLoaded] = useState(false);
//   const { homepageCharts } = useStatisticsStore();

  return (
    <div className="flex flex-grow flex-col items-center justify-center xl:flex-row">
      <div className="flex flex-col items-center">
        <div className="mt-5 w-vw-80 md:w-vw-60 xl:w-vw-30">
          {/* <TasKeepLogo className="w-full" /> */}
        </div>
        <div className="md:w-vw-25 w-vw-30 xl:w-vw-10">
          {/* <AvinciLogo className="w-full" /> */}
        </div>
        <div
        //   className={`${allChartsLoaded ? 'shadow' : 'centered-shadow'} hidden xl:block`}
        ></div>
      </div>
      {/* <ChartGrid /> */}
    </div>
  );
}
