function Footer() {
  return (
    <footer className="">
      <div className="mx-auto max-w-screen-xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid items-center justify-center">
          <div className="flex justify-center text-teal-600 px-4">
            <a href="https://www.buymeacoffee.com/cap10chunks" target="_blank">
              <img
                src="https://cdn.buymeacoffee.com/buttons/v2/default-red.png"
                alt="Buy Me A Coffee"
                className="h-16"
              />
            </a>
          </div>

          <a
            className="mt-4 text-center text-sm underline text-blue-600"
            href="mailto:djreale@gmail.com?subject=Pediatric Heart Transplant Site"
          >
            Email Me
          </a>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
