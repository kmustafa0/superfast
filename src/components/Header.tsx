import Image from "next/image";
import Link from "next/link";

const Header = () => {
  return (
    <header className="flex items-center justify-between mb-14">
      <h1 className="font-bold text-2xl">
        <Link href="/">superfast</Link>
      </h1>
      <span className="flex items-center gap-2 text-xs italic">
        by
        <Link
          href="https://github.com/kmustafa0"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            src="https://avatars.githubusercontent.com/u/92370453?s=96&v=4"
            className="rounded-full"
            alt="GitHub avatar of kmustafa0"
            width={24}
            height={24}
          />
        </Link>
      </span>
    </header>
  );
};

export default Header;
