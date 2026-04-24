"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChangeEvent, useState } from "react";

import chevronLeftIcon from "@/assets/icons/chevron-left-icon.svg";
import { Button } from "@/components/Button";
import { TextInput } from "@/components/TextInput";

export default function CreateBouquetPage() {
  const router = useRouter();
  const [nickname, setNickname] = useState("");
  const isNicknameReady = nickname && nickname.length > 0;

  const updateNickname = (value: string) => {
    setNickname(value);
  };

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    updateNickname(event.currentTarget.value);
  };

  const handleNext = () => {
    if (!isNicknameReady) return;
    router.push(`/bouquet/create/recipient?nickname=${encodeURIComponent(nickname)}`);
  };

  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-[430px] flex-col bg-[var(--color-white)]">
      <header className="flex items-center px-4 py-4">
        <Link
          href="/"
          aria-label="홈으로 돌아가기"
          className="flex h-6 w-6 items-center justify-center text-[var(--color-black)]"
        >
          <Image src={chevronLeftIcon} alt="" aria-hidden />
        </Link>
      </header>

      <section className="flex flex-1 flex-col justify-between">
        <div>
          <div className="flex flex-col gap-4 px-5 pb-5 pt-3">
            <h1 className="typo-title-2 whitespace-pre-line text-[var(--color-brown-300)]">
              {"반가워요 :)\n마음 꽃집에서 사용할 \n이름을 알려주세요."}
            </h1>
            <p className="typo-body-2 text-[var(--color-brown-200)]">
              꽃다발을 보낼 상대방에도 해당 이름으로 보여요.
            </p>
          </div>

          <div className="px-5 pt-9.5">
            <TextInput
              id="nickname"
              aria-label="보내는 사람 닉네임"
              type="text"
              maxLength={6}
              value={nickname}
              onChange={handleChange}
              placeholder="이름 혹은 별명을 입력해주세요."
              containerClassName={`min-h-12 ${
                isNicknameReady
                  ? "border-[var(--color-green-300)]"
                  : "border-[var(--color-gray-100)]"
              }`}
              className={
                isNicknameReady
                  ? "text-[var(--color-brown-600)] placeholder:text-[var(--color-brown-600)]"
                  : "text-[var(--color-gray-900)] placeholder:text-[var(--color-gray-200)]"
              }
              helperText="6자 이내"
            />
          </div>
        </div>

        <div className="bg-gradient-to-b from-transparent to-white px-5 pb-safe-bottom pt-8">
          <Button
            variant="solid"
            disabled={!isNicknameReady}
            onClick={handleNext}
            className="h-12 w-full"
          >
            다음으로
          </Button>
        </div>
      </section>
    </main>
  );
}
