import { FTLink } from "../atomic/FTLink";
import { MoonIcon } from "../icons/MoonIcon";
import { LocaleSwitcher } from "./LocaleSwitcher";
import { ThemeSwitcherButton } from "./ThemeSwitcherButton";

const HomeIcon = () => {
  return (
    <FTLink href="/">
      <MoonIcon />
    </FTLink>
  );
};

export async function Header() {
  return (
    <div className="flex flex-row items-center justify-between p-4">
      <HomeIcon />

      <LocaleSwitcher className="max-w-[140px]" />

      <ThemeSwitcherButton />
    </div>
  );
}
