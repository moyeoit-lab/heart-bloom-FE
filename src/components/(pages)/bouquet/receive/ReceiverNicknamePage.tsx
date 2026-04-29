"use client";

import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useMemo, useState } from "react";

import chevronLeftIcon from "@/assets/icons/chevron-left-icon.svg";
import { Button } from "@/components/Button";
import { TextInput } from "@/components/TextInput";
import { useBouquetByLinkQuery } from "@/features/bouquet";

const MAX_NICKNAME_LENGTH = 10;

export default function ReceiverNicknamePage() {
  const router = useRouter();
  const params = useParams<{ token: string }>();
  const token = params.token;
  const [nickname, setNickname] = useState("");
  const { data } = useBouquetByLinkQuery(token);
  const senderName = useMemo(() => data?.senderName?.trim() || "보낸 분", [data]);

  const trimmedNickname = nickname.trim();
  const isNextEnabled = trimmedNickname.length > 0;

  const handleNext = () => {
    if (!token || !isNextEnabled) {
      return;
    }

    const query = new URLSearchParams({
      receiverName: trimmedNickname,
    });
    router.push(`/bouquet/${token}/questions/1?${query.toString()}`);
  };

  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-[430px] flex-col bg-[#fafafa]">
      <header className="flex items-center px-4 py-4">
        <Link
          href={token ? `/bouquet/${token}` : "/"}
          aria-label="이전으로 돌아가기"
          className="flex h-6 w-6 items-center justify-center text-[var(--color-black)]"
        >
          <Image src={chevronLeftIcon} alt="" aria-hidden />
        </Link>
      </header>

      <section className="flex flex-1 flex-col justify-between">
        <div className="flex flex-col gap-7">
          <div className="flex flex-col gap-4 px-5 pb-5 pt-3">
          <h1
              className="typo-title-2 whitespace-pre-line text-[var(--color-brown-300)]"
              style={{ lineHeight: "30px" }}
            >
              {"반가워요 :)\n마음 꽃집에서 사용할\n이름을 알려주세요."}
            </h1>
            <p className="typo-body-2 text-[var(--color-brown-200)]">
              꽃다발을 보낼 상대방에도 해당 이름으로 보여요.
            </p>
          </div>

          <div className="px-5">
            <TextInput
              value={nickname}
              onChange={(event) => setNickname(event.target.value)}
              maxLength={MAX_NICKNAME_LENGTH}
              placeholder="이름을 입력해 주세요"
              helperText="10자 이내"
              containerClassName="border-[var(--color-green-300)]"
            />
          </div>
        </div>

        <div className="bg-gradient-to-b from-transparent to-white p-5">
          <Button
            className="h-12 w-full"
            disabled={!isNextEnabled}
            onClick={handleNext}
          >
            다음으로
          </Button>
        </div>
      </section>
    </main>
  );
}
