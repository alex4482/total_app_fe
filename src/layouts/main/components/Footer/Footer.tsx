import TotalAppLogo from '@/assets/logo/totalAppLogo.svg?react';

export function Footer() {
  return (
    <footer id="footer">
      <section className="container flex items-center justify-center py-2">
        <div className="w-24 md:w-24 xl:w-32">
          <TotalAppLogo className="w-full" />
        </div>
      </section>

      <section className="container pb-10 text-center">
        <h3>
          &copy; tasKeep 2024 made by{' '}
          <span className="inline bg-gradient-to-r from-yellow-500 to-red-500 bg-clip-text font-bold text-transparent">
            JCD
          </span>
        </h3>
      </section>
    </footer>
  );
}
