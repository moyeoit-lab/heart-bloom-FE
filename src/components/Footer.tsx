import Image from "next/image";

import logoMini from "@/assets/images/moyeoit-logo-mini.svg";
import logoFull from "@/assets/images/moyeoit-logo-full.svg";
import instaIcon from "@/assets/icons/instagram-icon.svg";

export default function Footer() {
  return (
    <footer className="absolute left-0 top-[791px] z-10 flex w-full flex-col gap-6 border-t border-[#e1e1e1] px-6 pb-12 pt-3">
      <div className="flex w-full items-center justify-between">
        <div className="flex items-center gap-2">
          <Image src={logoMini} alt="" aria-hidden />
          <Image src={logoFull} alt="MOYEO-IT 로고" />
        </div>
        <a
          href="https://www.instagram.com/"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="인스타그램으로 이동"
          className="inline-flex h-[26px] w-[26px] items-center justify-center"
        >
          <Image src={instaIcon} alt="" aria-hidden />
        </a>
      </div>

      <div className="text-[12px] font-medium leading-6 text-[#767676]">
        <p>모든 가족들에게 웃음꽃이 피도록</p>
        <p>광고 문의 : ahdudlt@gmail.com</p>
      </div>
    </footer>
  );
}
