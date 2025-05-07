// import { linkTrack } from "./Track";
import Link from "next/link";
import { CreditCardIcon, TrendingUpDownIcon } from "lucide-react";
//@ts-ignore
import mixpanel from "mixpanel-browser";

const getMixpanelUrl = () => {
  try {
    const deviceId = mixpanel.get_property("$device_id");
    return `https://mixpanel.com/project/3276012/view/3782804/app/profile#distinct_id=%24device%3A${deviceId}`;
  } catch (e) {
    return "https://mixpanel.com/project/3276012/view/3782804/app/events";
  }
};

export function Header() {
  return (
    <header className="px-4 lg:px-6 h-14 flex items-center opacity-75 hover:opacity-100">
      <Link className="flex items-center justify-center" href="/">
        <TrendingUpDownIcon className="h-10 w-10" />
        <span className="ml-2 text-lg font-semibold">
          FixPanel <span className="invisible">logo</span>
        </span>
      </Link>
      <nav className="ml-auto flex gap-4 sm:gap-6">
        <Link className="text-sm font-medium hover:underline underline-offset-4" href="/">
          Home
        </Link>
        <Link className="text-sm font-medium hover:underline underline-offset-4" href="/features">
          Features
        </Link>
        <Link className="text-sm font-medium hover:underline underline-offset-4" href="/products">
          Products
        </Link>
        <Link className="text-sm font-medium hover:underline underline-offset-4" href="/pricing">
          Pricing
        </Link>
        <Link className="text-sm font-medium hover:underline underline-offset-4" href="/login">
          Sign In
        </Link>
        <Link className="text-sm font-medium hover:underline underline-offset-4" href="/about">
          About
        </Link>
        <Link
          className="text-sm font-medium hover:underline underline-offset-4"
          href="#"
          onClick={() => {
            mixpanel.track("END OF USER");
            mixpanel.reset();
            mixpanel.track("NEW USER");
            window.scrollTo(0, 0);
            window.location.reload();
          }}
        >
          Reset
        </Link>

        <Link
          className="text-sm font-medium hover:underline underline-offset-4 text-purple-500"
          href={getMixpanelUrl()}
          target="_blank"
        >
          MIXPANEL PROJECT
        </Link>
      </nav>
    </header>
  );
}
