const Footer = () => (
  <div className="flex flex-col w-full h-full bg-gray-8 text-dark-gray-6 mt-auto items-center py-6 text-sm">
    <span>
      ChatGPT implementation by&nbsp;
      <a
        href="https://www.danielmaramba.com/"
        target="_blank"
        rel="noreferrer"
        className="text-brand-orange hover:bg-dark-fill-2"
      >
        Daniel Maramba
      </a>
    </span>
    <span className="flex items-center">
      Source code by&nbsp;
      <a
        href="https://www.buymeacoffee.com/burakorkmezz"
        target="_blank"
        rel="noreferrer"
        className="text-brand-orange hover:bg-dark-fill-2"
      >
        Burak Orkmez
      </a>
    </span>
  </div>
);

export default Footer;
