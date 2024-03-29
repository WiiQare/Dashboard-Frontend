import MenuItem, { Menu } from './MenuItem';
import HealthIcon from '@public/svg/health-Icon';
import PaymentsIcon from '@public/svg/payments-Icon';
import BeneficiariesIcon from '@public/svg/beneficiaries-Icon';
import PayersIcon from '@public/svg/payers-Icon';
import NFTICON from '@public/svg/voucher-icon';
import React from 'react';
import PaymentProviderIcon from '@public/svg/Providers-icon';
import { useSession } from 'next-auth/react';
import { UserType } from '@/Interfaces/interfaces';
import AddMember from './Addmember';

const Submenus = [
  { icon: PaymentProviderIcon, title: 'Provider', href: '/Payments/Providers' },
  { icon: PayersIcon, title: 'Payers', href: '/Payments/Payers' },
];

const menus = [
  { icon: PayersIcon, title: 'Payers', href: '/Payers' },
  { icon: BeneficiariesIcon, title: 'Beneficiaries', href: '/Beneficiaries' },
  { icon: HealthIcon, title: 'Providers', href: '/Providers' },
  { icon: PaymentsIcon, title: 'Payments', submenu: Submenus },
  { icon: NFTICON, title: 'Vouchers', href: '/Vouchers' },
] as unknown as Menu[];

// const reportMenus = [
//   {
//     icon: ProfileIcon,
//     title: "Profile",
//     href: "/profile",
//   },
//   {
//     title: "Settings",
//     href: "/settings",
//   },
// ] as unknown as Menu[];

const SideBar = (props: { sidebarOpen: boolean; handleSidebar: any }) => {
  const { data: session } = useSession();
  const userState = session?.user as UserType;

  return (
    <div
      id=" logo-sidebar"
      className={`
      ${props.sidebarOpen ? 'translate-x-0 ' : 'max-sm:hidden'}
      w-30 h-full transition-0.5   left-0 z-40 -translate-x-full border-r border-gray-200  bg-white pt-2 dark:border-none dark:border-gray-700 dark:bg-gray-900 sm:translate-x-0  `}
      aria-label="Sidebar"
    >
      <div className="transition-c-0.5 h-full w-[13rem] overflow-x-auto bg-white px-3 pb-4  dark:bg-gray-900">
        <div className=" flex flex-col  space-y-4">
          <ul className="flex flex-col space-y-3 text-black dark:text-white">
            {menus.map((menu, index) => (
              <MenuItem
                key={index}
                submenu={menu.submenu}
                title={menu.title}
                href={menu.href}
                icon={menu.icon}
              />
            ))}
          </ul>
          {/* <------components-----> */}
          <hr className="ml-4 py-2 text-black dark:text-white/20" />
          {userState?.data.type === 'WIIQARE_ADMIN' && <AddMember></AddMember>}
        </div>
      </div>
    </div>
  );
};

export default SideBar;
