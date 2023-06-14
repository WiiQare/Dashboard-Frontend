import Link from "next/link";
import { useRouter } from "next/router";
import React from "react";

export interface Menu {
  icon: any;
  title: string;
  href: string;
}

function MenuItem(props: Menu) {
  const router = useRouter();

  return (
    <li>
      <Link
        href={props.href}
        className={`relative flex gap-2 rounded items-center py-3 px-4 ${router.route == props.href
          ? "button-text bg-[#FF8A2B]"
          : "opacity-75 hover:bg-[#FF8A2B]"
          }`}
      >
        {router.route == props.href && (
          <span className="absolute left-0 top-1/2 h-9 w-[6px] -translate-y-1/2 rounded bg-white"></span>
        )}
        <props.icon  />
        {props.title}
      </Link>
    </li>
  );
}

export default MenuItem;