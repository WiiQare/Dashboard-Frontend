import Link from "next/link";
import { useRouter } from "next/router";
import React, { useState } from "react";
import { Collapse, Text } from "@nextui-org/react";

export interface Menu {
  icon: string;
  title: string;
  href: string;
  submenu: any[];

}

function MenuItem(props: Menu) {
  const router = useRouter();
  const [isExpanded, setIsExpanded] = useState(false);

  const handleToggle = () => {
    setIsExpanded(!isExpanded);
  };
  return (
    <li>

      {props.submenu ? (

        <div className="opacity-75 ">

          <button onClick={handleToggle} className="hover:bg-[#FF8A2B] relative flex gap-2 rounded items-center py-3 w-full px-4">
            <props.icon />
            {props.title}
          </button>

          {isExpanded &&

            props.submenu.map((submenu) => (
              <div key={submenu.title} className="ml-3">
                <Link
                  href={submenu.href}
                  className={`relative flex gap-2 rounded items-center py-3 px-4 ${router.route == props.href
                    ? "button-text bg-[#FF8A2B] dark:bg-[#df690a]"
                    : "opacity-75 hover:bg-[#FF8A2B]"
                    }`}
                >
                  {router.route == props.href && (
                    <span className="absolute left-0 top-1/2 h-9 w-[6px] -translate-y-1/2 rounded bg-white"></span>
                  )}
                  <submenu.icon />
                  {submenu.title}
                </Link>
              </div>
            ))
          }

        </div>)
        : <Link

          href={props.href}
          className={`relative flex gap-2 rounded items-center py-3 px-4 ${router.route == props.href
            ? "button-text bg-[#FF8A2B] dark:bg-[#df690a]"
            : "opacity-75 hover:bg-[#FF8A2B]"
            }`}
        >
          {router.route == props.href && (
            <span className="absolute left-0 top-1/2 h-9 w-[6px] -translate-y-1/2 rounded bg-white"></span>
          )}
          <props.icon />
          {props.title}
        </Link>
      }



    </li >
  );
}

export default MenuItem;
